"use client";
import { useEffect, useId, useRef, useState } from "react";
import { Button } from "../ui/button";
import { sessionFetch } from "../../lib/session";
import {
  cropBox,
  encodeWithinBudget,
  inspectSource,
  IMAGE_QUALITY,
  IMAGE_PROFILES,
  PREVIEW_EDGE,
  type ImageProfile,
  type PreparedRendition,
} from "../../lib/image-preparation";

const RATIOS = [
  ["Original", 0],
  ["Square · 1:1", 1],
  ["Landscape · 1.91:1", 1.91],
  ["Portrait · 4:5", 0.8],
  ["Widescreen · 16:9", 16 / 9],
  ["Medium rectangle · 300×250", 6 / 5],
  ["Half page · 300×600", 0.5],
  ["Leaderboard · 728×90", 728 / 90],
  ["Mobile banner · 320×50", 6.4],
  ["Large mobile · 320×100", 3.2],
  ["Skyscraper · 160×600", 160 / 600],
  ["Billboard · 970×250", 3.88],
  ["Custom", -1],
] as const;
let releaseActiveSource: (() => void) | undefined;
export interface PreparedImageAsset {
  assetId: string;
  cdnUrl: string;
  width: number;
  height: number;
  bytes: number;
  preparation: any;
  adFormat: "card" | "banner";
}
export function ImagePreparation({
  onUploaded,
  onBusyChange,
  initialLayout = "card",
}: {
  onUploaded: (asset: PreparedImageAsset) => void;
  onBusyChange?: (busy: boolean) => void;
  initialLayout?: "card" | "banner";
}) {
  const id = useId(),
    input = useRef<HTMLInputElement>(null),
    preview = useRef<HTMLCanvasElement>(null),
    original = useRef<HTMLCanvasElement>(null);
  const bitmap = useRef<ImageBitmap | null>(null),
    sourceCanvas = useRef<HTMLCanvasElement | null>(null),
    abort = useRef<AbortController | null>(null),
    worker = useRef<Worker | null>(null),
    generation = useRef(0),
    busy = useRef(false);
  const [source, setSource] = useState<{
    name: string;
    size: number;
    width: number;
    height: number;
  } | null>(null);
  const [ratioChoice, setRatioChoice] = useState(1.91),
    [customW, setCustomW] = useState(1),
    [customH, setCustomH] = useState(1),
    [rotation, setRotation] = useState(0),
    [zoom, setZoom] = useState(1),
    [panX, setPanX] = useState(50),
    [panY, setPanY] = useState(50);
  const [profile, setProfile] = useState<ImageProfile>("standard"),
    [layout, setLayout] = useState<"card" | "banner">(initialLayout),
    [state, setState] = useState("Select an image"),
    [error, setError] = useState(""),
    [progress, setProgress] = useState(0),
    [outputs, setOutputs] = useState<PreparedRendition[]>([]),
    [outputUrl, setOutputUrl] = useState("");
  const pointer = useRef<{
    x: number;
    y: number;
    panX: number;
    panY: number;
  } | null>(null);
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
  const cancel = () => {
    generation.current++;
    abort.current?.abort();
    worker.current?.terminate();
    worker.current = null;
    busy.current = false;
    onBusyChange?.(false);
    setState(source ? "Ready to crop" : "Select an image");
  };
  useEffect(
    () => () => {
      generation.current++;
      abort.current?.abort();
      worker.current?.terminate();
      bitmap.current?.close();
    },
    [],
  );
  useEffect(() => {
    if (!outputs[0]) {
      setOutputUrl("");
      return;
    }
    const url = URL.createObjectURL(outputs[0].blob);
    setOutputUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [outputs]);
  useEffect(() => {
    setOutputs([]);
    if (!bitmap.current || !source || !validRatio) return;
    const b = bitmap.current,
      c = document.createElement("canvas");
    c.width = rotation % 180 ? b.height : b.width;
    c.height = rotation % 180 ? b.width : b.height;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.translate(c.width / 2, c.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.drawImage(b, -b.width / 2, -b.height / 2);
    sourceCanvas.current = c;
    const crop = cropBox(c.width, c.height, ratio, zoom, panX, panY);
    for (const [target, rect] of [
      [original.current, { x: 0, y: 0, width: c.width, height: c.height }],
      [preview.current, crop],
    ] as const) {
      if (!target) continue;
      const scale = Math.min(1, 600 / rect.width, 360 / rect.height);
      target.width = Math.max(1, Math.round(rect.width * scale));
      target.height = Math.max(1, Math.round(rect.height * scale));
      target
        .getContext("2d")
        ?.drawImage(
          c,
          rect.x,
          rect.y,
          rect.width,
          rect.height,
          0,
          0,
          target.width,
          target.height,
        );
    }
  }, [source, ratio, rotation, zoom, panX, panY, profile, layout, validRatio]);
  async function select(file?: File) {
    if (!file) return;
    releaseActiveSource?.();
    cancel();
    const run = ++generation.current;
    setError("");
    setState("Inspecting source…");
    onBusyChange?.(true);
    busy.current = true;
    const release = () => {
      generation.current++;
      abort.current?.abort();
      worker.current?.terminate();
      bitmap.current?.close();
      bitmap.current = null;
      sourceCanvas.current = null;
      setSource(null);
      setOutputs([]);
      busy.current = false;
      onBusyChange?.(false);
    };
    releaseActiveSource = release;
    try {
      const info = await inspectSource(file);
      const scale = Math.min(
        1,
        PREVIEW_EDGE / Math.max(info.width, info.height),
      );
      const decode = createImageBitmap(file, {
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
            Error("This device could not decode the source within 30 seconds."),
          );
        }, 30000);
        decode.then(
          (b) => {
            clearTimeout(timer);
            if (timedOut || run !== generation.current) {
              b.close();
              reject(Error("Cancelled"));
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
      bitmap.current?.close();
      bitmap.current = image;
      setSource({
        name: file.name,
        size: file.size,
        width: info.width,
        height: info.height,
      });
      setRotation(0);
      setZoom(1);
      setPanX(50);
      setPanY(50);
      setState("Ready to crop");
    } catch (e) {
      if (run === generation.current) {
        setError((e as Error).message);
        setState("Select an image");
      }
    } finally {
      if (run === generation.current) {
        busy.current = false;
        onBusyChange?.(false);
      }
      if (input.current) input.current.value = "";
    }
  }
  async function encode(
    c: HTMLCanvasElement,
    p: ImageProfile,
    maxWidth: number,
    signal: AbortSignal,
  ): Promise<PreparedRendition> {
    const crop = cropBox(c.width, c.height, ratio, zoom, panX, panY);
    if (typeof Worker === "undefined" || typeof OffscreenCanvas === "undefined")
      return encodeWithinBudget(c, crop, p, maxWidth, signal, setProgress);
    const b = await createImageBitmap(c);
    signal.throwIfAborted();
    return new Promise((resolve, reject) => {
      let w: Worker;
      try {
        w = new Worker(new URL("../../lib/image-worker.ts", import.meta.url));
      } catch {
        b.close();
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
        worker.current = null;
      };
      const stop = () => {
        finish();
        reject(new DOMException("Cancelled", "AbortError"));
      };
      const timer = setTimeout(() => {
        finish();
        reject(
          Error(
            "Image preparation exceeded this device’s 60-second processing budget.",
          ),
        );
      }, 60000);
      signal.addEventListener("abort", stop, { once: true });
      w.onerror = () => {
        finish();
        reject(
          Error("Browser image processing failed. Your source is retained."),
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
      w.postMessage({ bitmap: b, crop, profile: p, maxWidth }, [b]);
    });
  }
  async function prepare() {
    if (busy.current || !sourceCanvas.current || !validRatio) return;
    busy.current = true;
    onBusyChange?.(true);
    abort.current = new AbortController();
    const signal = abort.current.signal;
    setError("");
    setState("Preparing image…");
    setProgress(0);
    try {
      const primary = await encode(
        sourceCanvas.current,
        profile,
        PREVIEW_EDGE,
        signal,
      );
      const renditions = [primary];
      if (profile !== "compact")
        renditions.push(
          await encode(
            sourceCanvas.current,
            "compact",
            Math.min(primary.width, 640),
            signal,
          ),
        );
      signal.throwIfAborted();
      setOutputs(renditions);
      setProgress(100);
      setState("Ready to upload");
    } catch (e) {
      if ((e as Error).name !== "AbortError") {
        setError((e as Error).message);
        setState("Ready to crop");
      }
    } finally {
      busy.current = false;
      onBusyChange?.(false);
    }
  }
  async function upload() {
    if (busy.current || !outputs.length || !sourceCanvas.current) return;
    busy.current = true;
    onBusyChange?.(true);
    setState("Uploading prepared image…");
    setError("");
    abort.current = new AbortController();
    try {
      const body = new FormData();
      for (const [i, o] of outputs.entries()) {
        const extension =
          o.blob.type === "image/png"
            ? "png"
            : o.blob.type === "image/jpeg"
              ? "jpg"
              : "webp";
        body.append(
          "files",
          new File([o.blob], `prepared-${i}.${extension}`, {
            type: o.blob.type,
          }),
        );
      }
      body.append(
        "manifest",
        JSON.stringify({
          version: 1,
          quality: IMAGE_QUALITY,
          profile,
          layout,
          ratio,
          crop: cropBox(
            sourceCanvas.current.width,
            sourceCanvas.current.height,
            ratio,
            zoom,
            panX,
            panY,
          ),
        }),
      );
      const res = await sessionFetch("/api/v1/uploads/prepared", {
        method: "POST",
        body,
        signal: abort.current.signal,
      });
      const json = await res.json();
      if (!res.ok || !json.data?.assetId)
        throw Error(
          typeof json.message === "string"
            ? json.message
            : "Image upload could not be confirmed. The prepared image is retained.",
        );
      onUploaded({ ...json.data, adFormat: layout });
      setState("Uploaded");
    } catch (e) {
      if ((e as Error).name !== "AbortError") {
        setError((e as Error).message);
        setState("Ready to upload");
      }
    } finally {
      busy.current = false;
      onBusyChange?.(false);
    }
  }
  return (
    <section className="cf-image-preparation" aria-label="Prepare image">
      <div
        className="cf-image-drop"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files.length !== 1) {
            setError("Choose one image at a time.");
            return;
          }
          void select(e.dataTransfer.files[0]);
        }}
      >
        <strong>Drop an image here</strong>
        <p>
          Prepare it here before uploading. JPEG, PNG or static WebP · up to 100
          MB, 24 megapixels, 16,384px per edge. Device limits still apply.
        </p>
        <Button
          type="button"
          variant="outline"
          disabled={busy.current}
          onClick={() => input.current?.click()}
        >
          Browse image
        </Button>
        <input
          ref={input}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          hidden
          aria-label="Choose source image"
          onChange={(e) => void select(e.target.files?.[0])}
        />
      </div>
      {source && (
        <>
          <p>
            {source.name} · {(source.size / 1000000).toFixed(2)} MB ·{" "}
            {source.width}×{source.height}px
          </p>
          <p>
            Only prepared outputs leave this browser. Lossy encoder quality
            stays at 0.97; output dimensions reduce automatically.
          </p>
          <fieldset disabled={busy.current}>
            <legend>Crop and delivery options</legend>
            <div className="cf-image-options">
              <label>
                Crop ratio
                <select
                  value={ratioChoice}
                  onChange={(e) => setRatioChoice(Number(e.target.value))}
                >
                  {RATIOS.map(([label, value]) => (
                    <option value={value} key={label}>
                      {label}
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
                      min="0.01"
                      max="1000"
                      step="any"
                      value={customW}
                      onChange={(e) => setCustomW(Number(e.target.value))}
                    />
                  </label>
                  <label>
                    Custom height
                    <input
                      type="number"
                      min="0.01"
                      max="1000"
                      step="any"
                      value={customH}
                      onChange={(e) => setCustomH(Number(e.target.value))}
                    />
                  </label>
                </>
              )}
              <label>
                Image size budget
                <select
                  value={profile}
                  onChange={(e) => setProfile(e.target.value as ImageProfile)}
                >
                  <option value="compact">
                    Compact · target 40 KB / cap 50 KB
                  </option>
                  <option value="standard">
                    Standard · target 100 KB / cap 150 KB
                  </option>
                  <option value="larger">
                    Larger feed · target 150 KB / cap 200 KB
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
                >
                  <option value="card">Card / feed placement</option>
                  <option value="banner">Banner placement</option>
                </select>
              </label>
            </div>
            <p>
              A crop ratio does not select a placement. Each placement also
              checks layout, dimensions and its own byte cap.
            </p>
            <div className="cf-image-previews">
              <div>
                <span>Source preview</span>
                <canvas ref={original} />
              </div>
              <div>
                <span>Chosen crop</span>
                <canvas
                  ref={preview}
                  tabIndex={0}
                  aria-label="Crop preview. Use arrow keys to pan, or drag to reposition."
                  onKeyDown={(e) => {
                    const delta = e.shiftKey ? 10 : 2;
                    if (e.key.startsWith("Arrow")) {
                      e.preventDefault();
                      if (e.key === "ArrowLeft")
                        setPanX((x) => Math.max(0, x - delta));
                      if (e.key === "ArrowRight")
                        setPanX((x) => Math.min(100, x + delta));
                      if (e.key === "ArrowUp")
                        setPanY((y) => Math.max(0, y - delta));
                      if (e.key === "ArrowDown")
                        setPanY((y) => Math.min(100, y + delta));
                    }
                  }}
                  onPointerDown={(e) => {
                    e.currentTarget.setPointerCapture(e.pointerId);
                    pointer.current = {
                      x: e.clientX,
                      y: e.clientY,
                      panX,
                      panY,
                    };
                  }}
                  onPointerMove={(e) => {
                    const p = pointer.current;
                    if (p) {
                      setPanX(
                        Math.max(
                          0,
                          Math.min(100, p.panX - (e.clientX - p.x) / 3),
                        ),
                      );
                      setPanY(
                        Math.max(
                          0,
                          Math.min(100, p.panY - (e.clientY - p.y) / 3),
                        ),
                      );
                    }
                  }}
                  onPointerUp={() => {
                    pointer.current = null;
                  }}
                  onPointerCancel={() => {
                    pointer.current = null;
                  }}
                />
              </div>
            </div>
            <div className="cf-image-options">
              {(
                [
                  ["Zoom", zoom, setZoom, 1, 4, 0.05],
                  ["Horizontal position", panX, setPanX, 0, 100, 1],
                  ["Vertical position", panY, setPanY, 0, 100, 1],
                ] as const
              ).map(([label, value, set, min, max, step]) => (
                <label key={label}>
                  {label}
                  <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={(e) => set(Number(e.target.value))}
                  />
                </label>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => setRotation((n) => (n + 90) % 360)}
            >
              Rotate 90°
            </Button>{" "}
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setRotation(0);
                setZoom(1);
                setPanX(50);
                setPanY(50);
              }}
            >
              Reset crop
            </Button>
          </fieldset>
          {!validRatio && (
            <p role="alert">
              Enter a positive custom width and height, with ratio no greater
              than 50:1.
            </p>
          )}
          <Button
            type="button"
            disabled={busy.current || !validRatio}
            onClick={() => void prepare()}
          >
            Apply crop
          </Button>
        </>
      )}
      <p role="status" id={id}>
        {state}
        {busy.current && progress > 0 ? ` · ${progress}%` : ""}
      </p>
      {busy.current && (
        <Button type="button" variant="outline" onClick={cancel}>
          Cancel processing
        </Button>
      )}
      {outputs.length > 0 && (
        <>
          <div className="cf-image-output">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={outputUrl} alt="Prepared ad preview" />
            {outputs.map((o, i) => (
              <p key={i}>
                {i ? "Compact rendition" : "Selected rendition"}: {o.width}×
                {o.height}px · {(o.blob.size / 1000).toFixed(1)} KB ·{" "}
                {o.blob.type.replace("image/", "")} ·{" "}
                {Math.round(
                  (1 - o.blob.size / (source?.size || o.blob.size)) * 100,
                )}
                % smaller
              </p>
            ))}
            <p>
              {outputs.some(
                (o) =>
                  o.width >= (layout === "banner" ? 320 : 300) &&
                  o.height >= (layout === "banner" ? 50 : 150),
              )
                ? "Dimension-compatible with the selected layout; publisher byte limits still apply."
                : "Prepared successfully; dimensions are too small for the selected layout. This creative cannot fill those placements."}
            </p>
          </div>
          <Button
            type="button"
            disabled={busy.current || state === "Uploaded"}
            onClick={() => void upload()}
          >
            Upload prepared image
          </Button>
        </>
      )}
      {error && (
        <p role="alert" className="cf-image-error">
          {error}
        </p>
      )}
    </section>
  );
}
