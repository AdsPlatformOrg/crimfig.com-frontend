export const IMAGE_QUALITY = 0.97;
export const SOURCE_LIMIT = 100000000;
export const SOURCE_PIXELS = 24000000;
export const SOURCE_EDGE = 16384;
export const PREVIEW_EDGE = 2048;
export const IMAGE_PROFILES = {
  compact: { target: 40000, cap: 50000 },
  standard: { target: 100000, cap: 150000 },
  larger: { target: 150000, cap: 200000 },
} as const;
export type ImageProfile = keyof typeof IMAGE_PROFILES;
export interface Crop {
  x: number;
  y: number;
  width: number;
  height: number;
}
export interface PreparedRendition {
  blob: Blob;
  width: number;
  height: number;
}
export function cropBox(
  width: number,
  height: number,
  ratio: number,
  zoom: number,
  x: number,
  y: number,
): Crop {
  if (
    ![width, height, ratio, zoom].every((v) => Number.isFinite(v) && v > 0) ||
    zoom < 1 ||
    zoom > 4 ||
    x < 0 ||
    x > 100 ||
    y < 0 ||
    y > 100
  )
    throw Error("Invalid crop controls.");
  const w = Math.min(width, height * ratio) / zoom,
    h = w / ratio;
  return {
    x: ((width - w) * x) / 100,
    y: ((height - h) * y) / 100,
    width: w,
    height: h,
  };
}
/** Inspect compressed headers before decoding, bounded to 1 MB. Animations never become stills. */
export async function inspectSource(file: File) {
  if (!file.size || file.size > SOURCE_LIMIT)
    throw Error("Choose a source image of up to 100 MB.");
  const b = new Uint8Array(await file.slice(0, 1048576).arrayBuffer());
  const v = new DataView(b.buffer);
  let width = 0,
    height = 0,
    mime = "",
    orientation = 1;
  const ascii = (start: number, end: number) =>
    String.fromCharCode(...b.slice(start, end));
  if (b[0] === 137 && ascii(1, 4) === "PNG") {
    mime = "image/png";
    width = v.getUint32(16);
    height = v.getUint32(20);
    let p = 8;
    while (p + 12 <= b.length) {
      const len = v.getUint32(p),
        type = ascii(p + 4, p + 8);
      if (type === "acTL")
        throw Error(
          "Animated images are not supported here. Choose a static image.",
        );
      if (type === "IDAT") break;
      p += 12 + len;
    }
  } else if (ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") {
    mime = "image/webp";
    const kind = ascii(12, 16);
    if (kind === "VP8X") {
      if (b[20] & 2) throw Error("Animated WebP is not supported here.");
      width = 1 + b[24] + b[25] * 256 + b[26] * 65536;
      height = 1 + b[27] + b[28] * 256 + b[29] * 65536;
    } else if (
      kind === "VP8 " &&
      b[23] === 157 &&
      b[24] === 1 &&
      b[25] === 42
    ) {
      width = v.getUint16(26, true) & 16383;
      height = v.getUint16(28, true) & 16383;
    } else if (kind === "VP8L" && b[20] === 47) {
      const bits = v.getUint32(21, true);
      width = (bits & 16383) + 1;
      height = ((bits >>> 14) & 16383) + 1;
    }
  } else if (b[0] === 255 && b[1] === 216) {
    mime = "image/jpeg";
    let p = 2;
    while (p + 4 < b.length) {
      if (b[p] !== 255) break;
      const marker = b[p + 1];
      p += 2;
      if (marker === 217 || marker === 218) break;
      if (marker === 216 || marker === 1) continue;
      const len = v.getUint16(p);
      if (len < 2 || p + len > b.length) break;
      if (marker === 225 && ascii(p + 2, p + 6) === "Exif") {
        const t = p + 8,
          le = ascii(t, t + 2) === "II";
        if (t + 8 < p + len) {
          const d = t + v.getUint32(t + 4, le);
          if (d + 2 < p + len) {
            const count = Math.min(v.getUint16(d, le), 256);
            for (let j = 0; j < count; j++) {
              const q = d + 2 + j * 12;
              if (q + 12 > p + len) break;
              if (v.getUint16(q, le) === 274)
                orientation = v.getUint16(q + 8, le);
            }
          }
        }
      }
      if ([192, 193, 194].includes(marker)) {
        height = v.getUint16(p + 3);
        width = v.getUint16(p + 5);
      }
      p += len;
    }
  }
  if (!mime || file.type !== mime || !width || !height)
    throw Error(
      "Use a valid static JPEG, PNG or WebP. AVIF and GIF are not enabled in this cropper.",
    );
  if (width * height > SOURCE_PIXELS || Math.max(width, height) > SOURCE_EDGE)
    throw Error(
      "This source exceeds the 24-megapixel / 16,384px processing limit. Its file size alone does not establish safe decoding.",
    );
  if (orientation >= 5 && orientation <= 8) [width, height] = [height, width];
  return { width, height, mime, orientation };
}

/** Every trial renders the same approved source crop. Quality never changes. */
export async function encodeWithinBudget(
  source: CanvasImageSource,
  crop: Crop,
  profile: ImageProfile,
  maxWidth: number,
  signal?: AbortSignal,
  onProgress?: (n: number) => void,
): Promise<PreparedRendition> {
  const { target, cap } = IMAGE_PROFILES[profile];
  const ratio = crop.width / crop.height;
  let scale = Math.min(1, maxWidth / crop.width, PREVIEW_EDGE / crop.height),
    best: PreparedRendition | undefined;
  const started = Date.now();
  for (let trial = 0; trial < 24; trial++) {
    signal?.throwIfAborted();
    if (Date.now() - started > 45000)
      throw Error(
        "Image preparation took too long on this device. Your source is retained.",
      );
    const width = Math.max(1, Math.round(crop.width * scale)),
      height = Math.max(1, Math.round(width / ratio));
    const canvas =
      typeof OffscreenCanvas !== "undefined"
        ? new OffscreenCanvas(width, height)
        : Object.assign(document.createElement("canvas"), { width, height });
    const ctx = canvas.getContext("2d") as
      CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null;
    if (!ctx) throw Error("Image processing is unavailable on this device.");
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(
      source,
      crop.x,
      crop.y,
      crop.width,
      crop.height,
      0,
      0,
      width,
      height,
    );
    const blob =
      typeof OffscreenCanvas !== "undefined" &&
      canvas instanceof OffscreenCanvas
        ? await canvas.convertToBlob({
            type: "image/webp",
            quality: IMAGE_QUALITY,
          })
        : await new Promise<Blob>((resolve, reject) =>
            (canvas as HTMLCanvasElement).toBlob(
              (b) => (b ? resolve(b) : reject(Error("Image encoding failed."))),
              "image/webp",
              IMAGE_QUALITY,
            ),
          );
    canvas.width = 1;
    canvas.height = 1;
    signal?.throwIfAborted();
    if (!["image/webp", "image/png", "image/jpeg"].includes(blob.type))
      throw Error("This browser returned an unsupported encoded format.");
    if (blob.size <= cap) best = { blob, width, height };
    onProgress?.(Math.min(95, 10 + trial * 4));
    if (
      blob.size <= target ||
      (best && width <= 320) ||
      width === 1 ||
      height === 1
    ) {
      if (best) return best;
      throw Error(
        "This device could not produce an image within the byte cap.",
      );
    }
    const next = scale * Math.min(0.85, Math.sqrt(target / blob.size) * 0.92);
    if (Math.round(crop.width * next) === width) scale *= 0.7;
    else scale = next;
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
  if (best) return best;
  throw Error(
    "Could not prepare this image within the byte cap. Your source is retained.",
  );
}
