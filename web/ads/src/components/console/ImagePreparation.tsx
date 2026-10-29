"use client";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import ReactCrop, { type PercentCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { ImagePlus, RotateCw, RotateCcw, X } from "lucide-react";
import { Button } from "../ui/button";
import { MediaPreview } from "../MediaPreview";
import { useDialog } from "../../lib/use-dialog";
import { sessionFetch } from "../../lib/session";
import { sourceCrop, centeredSelection } from "../../lib/crop-coordinates";
import {
  encodeWithinBudget,
  inspectSource,
  IMAGE_QUALITY,
  PREVIEW_EDGE,
  type ImageProfile,
  type PreparedRendition,
  type Crop,
} from "../../lib/image-preparation";

const RATIOS = [
  ["Original", 0],
  ["Square - 1:1", 1],
  ["Landscape - 1.91:1", 1.91],
  ["Portrait - 4:5", 0.8],
  ["Widescreen - 16:9", 16 / 9],
  ["Medium rectangle - 300x250", 6 / 5],
  ["Half page - 300x600", 0.5],
  ["Leaderboard - 728x90", 728 / 90],
  ["Mobile banner - 320x50", 6.4],
  ["Large mobile - 320x100", 3.2],
  ["Skyscraper - 160x600", 160 / 600],
  ["Billboard - 970x250", 3.88],
  ["Custom W:H", -1],
] as const;
let releaseActiveSource: (() => void) | undefined;
export interface PreparedImageAsset {
  assetId: string;
  cdnUrl: string;
  width: number;
  height: number;
  bytes: number;
  mimeType?: string;
  sha256?: string;
  preparation: any;
  adFormat: "card" | "banner";
}
interface SourceInfo {
  name: string;
  size: number;
  width: number;
  height: number;
}
export function ImagePreparation({
  onUploaded,
  onBusyChange,
  initialLayout = "card",
  currentUrl,
  currentSpecs,
}: {
  onUploaded: (asset: PreparedImageAsset) => void;
  onBusyChange?: (busy: boolean) => void;
  initialLayout?: "card" | "banner";
  currentUrl?: string;
  currentSpecs?: {
    width: number;
    height: number;
    bytes: number;
    mimeType?: string;
  };
}) {
  const id = useId(),
    input = useRef<HTMLInputElement>(null),
    stage = useRef<HTMLCanvasElement>(null);
  const bitmap = useRef<ImageBitmap | null>(null),
    surface = useRef<HTMLCanvasElement | null>(null),
    controller = useRef<AbortController | null>(null),
    worker = useRef<Worker | null>(null),
    generation = useRef(0),
    busy = useRef(false),
    releaseRef = useRef<(() => void) | null>(null);
  const [open, setOpen] = useState(false),
    [source, setSource] = useState<SourceInfo | null>(null),
    [saved, setSaved] = useState<PreparedImageAsset | null>(null),
    [dragging, setDragging] = useState(false);
  const [ratioChoice, setRatioChoice] = useState(1.91),
    [customW, setCustomW] = useState(1),
    [customH, setCustomH] = useState(1),
    [rotation, setRotation] = useState(0),
    [profile, setProfile] = useState<ImageProfile>("standard"),
    [layout, setLayout] = useState<"card" | "banner">(initialLayout);
  const [selection, setSelection] = useState<PercentCrop>({
      unit: "%",
      x: 5,
      y: 5,
      width: 90,
      height: 90,
    }),
    [status, setStatus] = useState(""),
    [error, setError] = useState(""),
    [progress, setProgress] = useState(0),
    [working, setWorking] = useState(false);
  const geometry = useRef<{
    bitmap: ImageBitmap;
    rotation: number;
    ratio: number;
  } | null>(null);
  const lastConfirmed = useRef<{
    bitmap: ImageBitmap;
    selection: PercentCrop;
    rotation: number;
    ratio: number;
    ratioChoice: number;
    customW: number;
    customH: number;
    profile: ImageProfile;
    layout: "card" | "banner";
  } | null>(null);
  const panel = useDialog(open, cancel);
  const ratio =
    ratioChoice === -1
      ? customW / customH
      : ratioChoice === 0 && source
        ? rotation % 180
          ? source.height / source.width
          : source.width / source.height
        : ratioChoice;
  const validRatio =
    Number.isFinite(ratio) &&
    ratio > 0 &&
    ratio <= 50 &&
    customW > 0 &&
    customH > 0;
  function setBusy(value: boolean) {
    busy.current = value;
    setWorking(value);
    onBusyChange?.(value);
  }
  function cancel() {
    generation.current++;
    controller.current?.abort();
    worker.current?.terminate();
    worker.current = null;
    setBusy(false);
    setOpen(false);
    setError("");
    setStatus("");
    const old = lastConfirmed.current;
    if (old && old.bitmap === bitmap.current) {
      geometry.current = {
        bitmap: old.bitmap,
        rotation: old.rotation,
        ratio: old.ratio,
      };
      setRotation(old.rotation);
      setRatioChoice(old.ratioChoice);
      setCustomW(old.customW);
      setCustomH(old.customH);
      setProfile(old.profile);
      setLayout(old.layout);
      setSelection(old.selection);
    } else {
      bitmap.current?.close();
      bitmap.current = null;
      surface.current = null;
      setSource(null);
    }
  }
  useEffect(
    () => () => {
      generation.current++;
      controller.current?.abort();
      worker.current?.terminate();
      bitmap.current?.close();
      if (releaseActiveSource === releaseRef.current)
        releaseActiveSource = undefined;
    },
    [],
  );
  // Rotate only when the source/orientation changes, never for crop dragging or resizing.
  useEffect(() => {
    if (!open || !bitmap.current || !stage.current) return;
    const b = bitmap.current,
      c = document.createElement("canvas");
    c.width = rotation % 180 ? b.height : b.width;
    c.height = rotation % 180 ? b.width : b.height;
    const ctx = c.getContext("2d");
    if (!ctx) {
      setError("This device cannot create an image workspace.");
      return;
    }
    ctx.translate(c.width / 2, c.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.drawImage(b, -b.width / 2, -b.height / 2);
    surface.current = c;
    const changed =
      geometry.current?.bitmap !== b ||
      geometry.current?.rotation !== rotation ||
      geometry.current?.ratio !== ratio;
    if (changed && validRatio) {
      setSelection(centeredSelection(c.width, c.height, ratio));
      geometry.current = { bitmap: b, rotation, ratio };
    }
    const target = stage.current;
    target.width = c.width;
    target.height = c.height;
    target.getContext("2d")?.drawImage(c, 0, 0);
  }, [source, rotation, open, ratio, validRatio]);

  async function select(file?: File) {
    if (!file || busy.current) return;
    releaseActiveSource?.();
    const run = ++generation.current;
    setOpen(true);
    setError("");
    setStatus("Preparing image workspace...");
    setBusy(true);
    const release = () => {
      generation.current++;
      controller.current?.abort();
      worker.current?.terminate();
      bitmap.current?.close();
      bitmap.current = null;
      surface.current = null;
      lastConfirmed.current = null;
      setSource(null);
      setOpen(false);
      setBusy(false);
    };
    releaseRef.current = release;
    releaseActiveSource = release;
    try {
      const info = await inspectSource(file),
        scale = Math.min(1, PREVIEW_EDGE / Math.max(info.width, info.height));
      const decoded = createImageBitmap(file, {
        imageOrientation: "from-image",
        resizeWidth: Math.max(1, Math.round(info.width * scale)),
        resizeHeight: Math.max(1, Math.round(info.height * scale)),
        resizeQuality: "high",
      });
      const image = await new Promise<ImageBitmap>((resolve, reject) => {
        let timedOut = false;
        const timer = setTimeout(() => {
          timedOut = true;
          reject(
            Error("Image decoding exceeded this device's 30-second budget."),
          );
        }, 30000);
        decoded.then(
          (b) => {
            clearTimeout(timer);
            if (timedOut || run !== generation.current) {
              b.close();
              reject(new DOMException("Cancelled", "AbortError"));
            } else resolve(b);
          },
          (e) => {
            clearTimeout(timer);
            reject(e);
          },
        );
      });
      if (run !== generation.current) {
        image.close();
        return;
      }
      bitmap.current = image;
      setSource({
        name: file.name,
        size: file.size,
        width: info.width,
        height: info.height,
      });
      setRotation(0);
      setStatus(
        "Drag the selection or resize its corners. Arrow keys adjust the focused selection.",
      );
    } catch (e) {
      if (run === generation.current) {
        setError((e as Error).message);
        setOpen(false);
      }
    } finally {
      if (run === generation.current) setBusy(false);
      if (input.current) input.current.value = "";
    }
  }
  async function encode(
    c: HTMLCanvasElement,
    crop: Crop,
    p: ImageProfile,
    maxWidth: number,
    signal: AbortSignal,
  ): Promise<PreparedRendition> {
    if (typeof Worker === "undefined" || typeof OffscreenCanvas === "undefined")
      return encodeWithinBudget(c, crop, p, maxWidth, signal, setProgress);
    const clone = await createImageBitmap(c);
    if (signal.aborted) {
      clone.close();
      signal.throwIfAborted();
    }
    return new Promise((resolve, reject) => {
      let w: Worker;
      try {
        w = new Worker(new URL("../../lib/image-worker.ts", import.meta.url));
      } catch {
        clone.close();
        void encodeWithinBudget(c, crop, p, maxWidth, signal, setProgress).then(
          resolve,
          reject,
        );
        return;
      }
      worker.current = w;
      const finish = () => {
        clearTimeout(timer);
        signal.removeEventListener("abort", stop);
        w.terminate();
        if (worker.current === w) worker.current = null;
      };
      const stop = () => {
        finish();
        reject(new DOMException("Cancelled", "AbortError"));
      };
      const timer = setTimeout(() => {
        finish();
        reject(
          Error("Image processing exceeded this device's 60-second budget."),
        );
      }, 60000);
      signal.addEventListener("abort", stop, { once: true });
      w.onerror = () => {
        finish();
        reject(
          Error(
            "Image processing failed. Your source remains available to retry.",
          ),
        );
      };
      w.onmessage = (e) => {
        if (e.data.progress !== undefined) setProgress(e.data.progress);
        else if (e.data.error) {
          finish();
          reject(Error(e.data.error));
        } else {
          finish();
          resolve(e.data.result);
        }
      };
      w.postMessage({ bitmap: clone, crop, profile: p, maxWidth }, [clone]);
    });
  }
  async function confirmImage() {
    if (busy.current || !surface.current || !source || !validRatio) return;
    const run = ++generation.current;
    controller.current = new AbortController();
    const signal = controller.current.signal;
    setBusy(true);
    setError("");
    setProgress(0);
    setStatus("Preparing your crop...");
    try {
      const canvas = surface.current,
        crop = sourceCrop(selection, canvas.width, canvas.height),
        actualRatio = crop.width / crop.height;
      const outputs = [
        await encode(canvas, crop, profile, PREVIEW_EDGE, signal),
      ];
      if (profile !== "compact")
        outputs.push(
          await encode(
            canvas,
            crop,
            "compact",
            Math.min(outputs[0].width, 640),
            signal,
          ),
        );
      signal.throwIfAborted();
      setStatus("Uploading prepared image...");
      setProgress(100);
      const body = new FormData();
      for (const [i, o] of outputs.entries()) {
        const ext =
          o.blob.type === "image/png"
            ? "png"
            : o.blob.type === "image/jpeg"
              ? "jpg"
              : "webp";
        body.append(
          "files",
          new File([o.blob], `prepared-${i}.${ext}`, { type: o.blob.type }),
        );
      }
      body.append(
        "manifest",
        JSON.stringify({
          version: 1,
          pipelineVersion: 2,
          quality: IMAGE_QUALITY,
          profile,
          layout,
          ratio: actualRatio,
          crop,
          descriptor: {
            preset:
              RATIOS.find(([, v]) => v === ratioChoice)?.[0] || "Custom W:H",
            ...(ratioChoice === -1
              ? { customRatio: { width: customW, height: customH } }
              : {}),
            rotation,
            coordinateSpace: {
              width: canvas.width,
              height: canvas.height,
              units: "pixels",
              orientation: "exif_applied_then_rotation",
            },
            source: {
              width: source.width,
              height: source.height,
              bytes: source.size,
              reportedBy: "client",
            },
          },
        }),
      );
      const res = await sessionFetch("/api/v1/uploads/prepared", {
        method: "POST",
        body,
        signal,
      });
      const json = await res.json();
      signal.throwIfAborted();
      if (run !== generation.current) return;
      if (
        !res.ok ||
        !json.data?.assetId ||
        !json.data?.width ||
        !json.data?.preparation
      )
        throw Error(
          typeof json.message === "string"
            ? json.message
            : "The upload and saved image specs could not be confirmed.",
        );
      const asset = { ...json.data, adFormat: layout } as PreparedImageAsset;
      setSaved(asset);
      onUploaded(asset);
      if (bitmap.current)
        lastConfirmed.current = {
          bitmap: bitmap.current,
          selection,
          rotation,
          ratio,
          ratioChoice,
          customW,
          customH,
          profile,
          layout,
        };
      setOpen(false);
      setStatus("Uploaded and ready to attach to your ad.");
    } catch (e) {
      if (run === generation.current && (e as Error).name !== "AbortError") {
        setError((e as Error).message);
        setStatus("Your previous image is unchanged. You can retry.");
      }
    } finally {
      if (run === generation.current) setBusy(false);
    }
  }
  const url = saved?.cdnUrl || currentUrl,
    specs = saved || currentSpecs;
  const dialog =
    open && typeof document !== "undefined"
      ? createPortal(
          <div
            className="cf-crop-overlay"
            onClick={(e) => {
              e.stopPropagation();
              if (e.target === e.currentTarget) cancel();
            }}
          >
            <div
              ref={panel}
              className="cf-crop-dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby={`${id}-title`}
              aria-describedby={`${id}-hint`}
              tabIndex={-1}
            >
              <header className="cf-crop-header">
                <div>
                  <h2 id={`${id}-title`}>Crop image</h2>
                  <p id={`${id}-hint`}>
                    Move the selection. Drag its corners to resize.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Close image cropper"
                  onClick={cancel}
                >
                  <X size={20} />
                </Button>
              </header>
              <div className="cf-crop-body">
                {source && (
                  <>
                    <div className="cf-crop-toolbar">
                      <label>
                        Aspect ratio
                        <select
                          value={ratioChoice}
                          onChange={(e) =>
                            setRatioChoice(Number(e.target.value))
                          }
                          disabled={working}
                        >
                          {RATIOS.map(([name, value]) => (
                            <option key={name} value={value}>
                              {name}
                            </option>
                          ))}
                        </select>
                      </label>
                      {ratioChoice === -1 && (
                        <>
                          <label>
                            Custom width
                            <input
                              type="number"
                              min=".01"
                              step="any"
                              value={customW}
                              onChange={(e) =>
                                setCustomW(Number(e.target.value))
                              }
                              disabled={working}
                            />
                          </label>
                          <label>
                            Custom height
                            <input
                              type="number"
                              min=".01"
                              step="any"
                              value={customH}
                              onChange={(e) =>
                                setCustomH(Number(e.target.value))
                              }
                              disabled={working}
                            />
                          </label>
                        </>
                      )}
                      <Button
                        type="button"
                        variant="outline"
                        disabled={working}
                        onClick={() => setRotation((r) => (r + 90) % 360)}
                      >
                        <RotateCw size={16} />
                        Rotate
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        disabled={working}
                        onClick={() => {
                          setRotation(0);
                          if (surface.current && validRatio)
                            setSelection(
                              centeredSelection(
                                surface.current.width,
                                surface.current.height,
                                ratio,
                              ),
                            );
                        }}
                      >
                        <RotateCcw size={16} />
                        Reset
                      </Button>
                    </div>
                    {!validRatio && (
                      <p role="alert">
                        Enter a positive width and height with a ratio no
                        greater than 50:1.
                      </p>
                    )}
                    <div className="cf-crop-workspace">
                      <ReactCrop
                        crop={selection}
                        onChange={(_, percent) => setSelection(percent)}
                        aspect={validRatio ? ratio : 1}
                        disabled={working || !validRatio}
                        keepSelection
                        ruleOfThirds
                        minWidth={16}
                        minHeight={16}
                      >
                        <canvas
                          ref={stage}
                          aria-label="Source image with adjustable crop selection"
                        />
                      </ReactCrop>
                    </div>
                    <details className="cf-crop-options">
                      <summary>Output options and image details</summary>
                      <div className="cf-crop-toolbar">
                        <label>
                          Image size budget
                          <select
                            value={profile}
                            onChange={(e) =>
                              setProfile(e.target.value as ImageProfile)
                            }
                            disabled={working}
                          >
                            <option value="compact">Compact - cap 50 KB</option>
                            <option value="standard">
                              Standard - cap 150 KB
                            </option>
                            <option value="larger">
                              Larger feed - cap 200 KB
                            </option>
                          </select>
                        </label>
                        <label>
                          Ad layout
                          <select
                            value={layout}
                            onChange={(e) =>
                              setLayout(e.target.value as "card" | "banner")
                            }
                            disabled={working}
                          >
                            <option value="card">Card / feed</option>
                            <option value="banner">Banner</option>
                          </select>
                        </label>
                      </div>
                      <p>
                        {source.width}x{source.height}px source -{" "}
                        {(source.size / 1000000).toFixed(2)} MB. Encoder quality
                        stays at 0.97; dimensions reduce automatically. The
                        source stays in this browser.
                      </p>
                      <p>
                        Placement eligibility also depends on layout, output
                        dimensions and the publisher's byte cap.
                      </p>
                    </details>
                  </>
                )}
                <p role="status">
                  {status}
                  {working && progress ? ` ${progress}%` : ""}
                </p>
                {error && (
                  <p role="alert" className="cf-crop-error">
                    {error}
                  </p>
                )}
              </div>
              <footer className="cf-crop-footer">
                <Button type="button" variant="outline" onClick={cancel}>
                  {working ? "Cancel processing" : "Cancel"}
                </Button>
                <Button
                  type="button"
                  onClick={() => void confirmImage()}
                  disabled={
                    working ||
                    !source ||
                    !validRatio ||
                    selection.width <= 0 ||
                    selection.height <= 0
                  }
                >
                  {working ? "Preparing image..." : "Use image"}
                </Button>
              </footer>
            </div>
          </div>,
          document.body,
        )
      : null;
  return (
    <div className="cf-image-picker">
      <input
        ref={input}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        hidden
        aria-label="Choose source image"
        onChange={(e) => void select(e.target.files?.[0])}
      />
      {url ? (
        <div className="cf-image-tile">
          <MediaPreview source={url} />
          <div className="cf-image-tile-caption">
            <strong>Image ready</strong>
            {specs && (
              <span>
                {specs.width}x{specs.height}px -{" "}
                {(specs.bytes / 1000).toFixed(1)} KB
                {specs.mimeType
                  ? ` - ${specs.mimeType.replace("image/", "")}`
                  : ""}
              </span>
            )}
          </div>
          <div className="cf-image-tile-actions">
            {source && bitmap.current && (
              <Button
                type="button"
                variant="outline"
                disabled={working}
                onClick={() => {
                  setOpen(true);
                  setError("");
                }}
              >
                Edit crop
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              disabled={working}
              onClick={() => input.current?.click()}
            >
              Replace image
            </Button>
          </div>
          {!source && (
            <p>To edit the crop, select the original source again.</p>
          )}
        </div>
      ) : (
        <div
          className={`cf-image-drop cf-image-drop-compact${dragging ? " is-dragging" : ""}`}
          onDragEnter={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragOver={(e) => e.preventDefault()}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            if (e.dataTransfer.files.length !== 1) {
              setError("Choose one image at a time.");
              return;
            }
            void select(e.dataTransfer.files[0]);
          }}
        >
          <ImagePlus size={28} aria-hidden="true" />
          <strong>Drag and drop your image</strong>
          <span>or choose a file to crop</span>
          <Button
            type="button"
            variant="outline"
            disabled={working}
            onClick={() => input.current?.click()}
          >
            Browse image
          </Button>
          <small>JPEG, PNG or static WebP - up to 100 MB</small>
        </div>
      )}
      <p className="cf-image-limit">
        Up to 24 megapixels / 16,384px per edge. Device processing limits apply.
      </p>
      {!open && error && (
        <p role="alert" className="cf-crop-error">
          {error}
        </p>
      )}
      {dialog}
    </div>
  );
}
