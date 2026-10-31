"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import { Button, Input } from "../ui";
import { sessionFetch } from "@/lib/session";

type Creative = {
  id: string;
  title: string;
  headline: string;
  bodyText: string;
  ctaText: string;
  destinationUrl: string;
  adType: string;
  imageUrl: string | null;
  videoUrl: string | null;
  format: string;
  width: number;
  height: number;
  priority: number;
  isActive: boolean;
};
const defaults = {
  imageAssetId: "",
  videoAssetId: "",
  title: "",
  headline: "",
  bodyText: "",
  ctaText: "Start Advertising",
  destinationUrl: "https://ads.crimfig.com",
  adType: "image",
  imageUrl: "",
  videoUrl: "",
  format: "banner",
  width: 728,
  height: 90,
  priority: 10,
  isActive: true,
};
export function AdminHouseAdsView() {
  const [items, setItems] = useState<Creative[] | null>(null),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(false),
    [open, setOpen] = useState(false),
    [editing, setEditing] = useState<string | null>(null),
    [form, setForm] = useState(defaults),
    [saving, setSaving] = useState(false),
    [formError, setFormError] = useState(""),
    [archive, setArchive] = useState<Creative | null>(null);
  const [preview, setPreview] = useState(""),
    [previewError, setPreviewError] = useState("");
  useEffect(() => {
    let active = true;
    let objectUrl = "";
    setPreviewError("");
    const src = form.adType === "video" ? form.videoUrl : form.imageUrl;
    const assetId =
      form.adType === "video" ? form.videoAssetId : form.imageAssetId;
    if (!open || !src) {
      setPreview("");
      return;
    }
    if (!assetId) {
      setPreview(src);
      return;
    }
    void (async () => {
      try {
        const path = new URL(src, window.location.origin).pathname.replace(
          "/uploads/media/",
          "/uploads/private-media/",
        );
        const res = await sessionFetch(path);
        if (!res.ok) throw Error("Private media preview unavailable");
        objectUrl = URL.createObjectURL(await res.blob());
        if (active) setPreview(objectUrl);
        else URL.revokeObjectURL(objectUrl);
      } catch (e) {
        if (active) {
          setPreview("");
          setPreviewError(
            e instanceof Error ? e.message : "Preview unavailable",
          );
        }
      }
    })();
    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [
    open,
    form.adType,
    form.imageUrl,
    form.videoUrl,
    form.imageAssetId,
    form.videoAssetId,
  ]);
  const [page, setPage] = useState(1),
    [hasNext, setHasNext] = useState(false);
  const sequence = useRef(0);
  async function load() {
    const seq = ++sequence.current;
    setLoading(true);
    setError("");
    try {
      const res = await sessionFetch(
        `/api/v1/admin/ads/house-creatives?page=${page}`,
      );
      if (!res.ok)
        throw Error(
          `Cannot load creatives (HTTP ${res.status}). Request: ${res.headers.get("x-request-id") || "unavailable"}`,
        );
      const json = await res.json();
      if (!Array.isArray(json.data))
        throw Error("Unexpected creative response");
      if (seq === sequence.current) {
        setItems(json.data);
        setHasNext(!!json.meta?.hasNext);
      }
    } catch (e) {
      if (seq === sequence.current)
        setError(e instanceof Error ? e.message : "Cannot load creatives");
    } finally {
      if (seq === sequence.current) setLoading(false);
    }
  }
  useEffect(() => {
    void load();
    return () => {
      sequence.current++;
    };
  }, [page]);
  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    setFormError("");
    try {
      const res = await sessionFetch(
        `/api/v1/admin/ads/house-creatives${editing ? `/${editing}` : ""}`,
        {
          method: editing ? "PATCH" : "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            ...form,
            imageUrl: form.adType === "image" ? form.imageUrl : undefined,
            videoUrl: form.adType === "video" ? form.videoUrl : undefined,
            imageAssetId:
              form.adType === "image" && form.imageAssetId
                ? form.imageAssetId
                : undefined,
            videoAssetId:
              form.adType === "video" && form.videoAssetId
                ? form.videoAssetId
                : undefined,
          }),
        },
      );
      if (!res.ok)
        throw Error(
          `Save failed (HTTP ${res.status}). Check required media and dimensions.`,
        );
      setOpen(false);
      await load();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }
  async function upload(file: File | undefined) {
    if (!file || saving) return;
    setSaving(true);
    setFormError("");
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await sessionFetch("/api/v1/uploads/direct", {
        method: "POST",
        body,
      });
      if (!res.ok) throw Error(`Upload failed (HTTP ${res.status})`);
      const json = await res.json();
      if (!json.data?.assetId || !json.data?.cdnUrl)
        throw Error("Upload confirmation missing");
      setForm((old) => ({
        ...old,
        [old.adType === "video" ? "videoUrl" : "imageUrl"]: new URL(
          json.data.cdnUrl,
          window.location.origin,
        ).toString(),
        [old.adType === "video" ? "videoAssetId" : "imageAssetId"]:
          json.data.assetId,
      }));
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setSaving(false);
    }
  }
  async function confirmArchive() {
    if (!archive || saving) return;
    setSaving(true);
    setFormError("");
    try {
      const res = await sessionFetch(
        `/api/v1/admin/ads/house-creatives/${archive.id}`,
        { method: "DELETE" },
      );
      if (!res.ok) throw Error(`Archive failed (HTTP ${res.status})`);
      setArchive(null);
      await load();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Archive failed");
    } finally {
      setSaving(false);
    }
  }
  return (
    <section className="cf-report">
      <header className="cf-report-header">
        <div>
          <h1>House Ads Management</h1>
          <p>
            Manage zero-charge platform creatives. Performance is reported
            separately.
          </p>
        </div>
        <div className="cf-report-actions">
          <Button
            variant="outline"
            onClick={() => void load()}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            onClick={() => {
              setEditing(null);
              setForm(defaults);
              setFormError("");
              setOpen(true);
            }}
          >
            Add House Ad
          </Button>
        </div>
      </header>
      <nav className="cf-report-tabs" aria-label="House Ads">
        <Link href="/admin/house-ads" aria-current="page">
          Creatives
        </Link>
        <Link href="/admin/house-ads/performance">
          Performance on promoter websites
        </Link>
      </nav>
      {error && (
        <div role="alert" className="cf-report-error">
          {error}{" "}
          <Button variant="outline" onClick={() => void load()}>
            Retry
          </Button>
          {items && (
            <p>
              Previously loaded creatives are shown; this list may be stale.
            </p>
          )}
        </div>
      )}
      {loading && <p role="status">Loading creatives…</p>}
      {!loading && !error && items?.length === 0 && (
        <div className="cf-report-panel">
          <h2>No house creatives configured</h2>
          <p>Add a creative to get started.</p>
        </div>
      )}
      {items?.map((c) => (
        <article key={c.id} className="cf-report-panel cf-report-row">
          <div>
            <h2>{c.title}</h2>
            <p>
              {c.adType} · {c.format} · {c.width} × {c.height} · Priority{" "}
              {c.priority} · {c.isActive ? "Active" : "Paused"}
            </p>
            <p>{c.headline}</p>
            <p>{c.bodyText}</p>
          </div>
          <div className="cf-report-actions">
            <Link href={`/admin/house-ads/${c.id}/performance`}>
              View performance
            </Link>
            <Button
              variant="outline"
              onClick={() => {
                setEditing(c.id);
                setForm({
                  ...defaults,
                  ...c,
                  imageUrl: c.imageUrl || "",
                  videoUrl: c.videoUrl || "",
                });
                setFormError("");
                setOpen(true);
              }}
            >
              Edit / Preview
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setFormError("");
                setArchive(c);
              }}
            >
              Archive
            </Button>
          </div>
        </article>
      ))}
      <div className="cf-report-actions">
        <Button
          variant="outline"
          disabled={loading || page === 1}
          onClick={() => setPage((v) => v - 1)}
        >
          Previous creatives
        </Button>
        <span>Page {page}</span>
        <Button
          variant="outline"
          disabled={loading || !hasNext}
          onClick={() => setPage((v) => v + 1)}
        >
          Next creatives
        </Button>
      </div>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="cf-report-overlay" />
          <Dialog.Content className="cf-report-dialog">
            <Dialog.Title>
              {editing ? "Edit House Ad" : "Add House Ad"}
            </Dialog.Title>
            <Dialog.Description>
              Configure creative content and preview. Preview does not send
              delivery events.
            </Dialog.Description>
            <form onSubmit={save} className="cf-report-form">
              {(
                [
                  "title",
                  "headline",
                  "bodyText",
                  "ctaText",
                  "destinationUrl",
                ] as const
              ).map((key) => (
                <label key={key}>
                  {
                    {
                      title: "Internal title",
                      headline: "Headline",
                      bodyText: "Body",
                      ctaText: "Call to action",
                      destinationUrl: "Destination URL",
                    }[key]
                  }
                  <Input
                    required
                    type={key === "destinationUrl" ? "url" : "text"}
                    value={form[key]}
                    onChange={(e) =>
                      setForm({ ...form, [key]: e.target.value })
                    }
                  />
                </label>
              ))}
              <label>
                Creative type
                <select
                  value={form.adType}
                  onChange={(e) => setForm({ ...form, adType: e.target.value })}
                >
                  <option value="image">Image</option>
                  <option value="text">Text</option>
                  <option value="video">Video</option>
                </select>
              </label>
              {form.adType !== "text" && (
                <label>
                  {form.adType === "image" ? "Image URL" : "Video URL"}
                  <Input
                    type="url"
                    required
                    value={
                      form.adType === "image" ? form.imageUrl : form.videoUrl
                    }
                    onChange={(e) =>
                      setForm({
                        ...form,
                        [form.adType === "image" ? "imageUrl" : "videoUrl"]:
                          e.target.value,
                      })
                    }
                  />
                </label>
              )}
              {form.adType !== "text" && (
                <label>
                  Upload media (existing service size and type restrictions
                  apply)
                  <input
                    type="file"
                    accept={form.adType === "image" ? "image/*" : "video/*"}
                    disabled={saving}
                    onChange={(e) => void upload(e.target.files?.[0])}
                  />
                </label>
              )}
              <label>
                Format
                <select
                  value={form.format}
                  onChange={(e) => setForm({ ...form, format: e.target.value })}
                >
                  {[
                    "banner",
                    "square",
                    "interstitial",
                    "card",
                    "video",
                    "any",
                  ].map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </label>
              <div className="cf-report-grid">
                {(["width", "height", "priority"] as const).map((key) => (
                  <label key={key}>
                    {key}
                    <Input
                      type="number"
                      required
                      min={key === "priority" ? 0 : 50}
                      max={
                        key === "priority"
                          ? 1000
                          : key === "width"
                            ? 3840
                            : 2160
                      }
                      value={form[key]}
                      onChange={(e) =>
                        setForm({ ...form, [key]: Number(e.target.value) })
                      }
                    />
                  </label>
                ))}
              </div>
              <label>
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) =>
                    setForm({ ...form, isActive: e.target.checked })
                  }
                />{" "}
                Active
              </label>
              {previewError && <p role="alert">{previewError}</p>}
              <div className="cf-report-panel">
                <strong>Creative preview</strong>
                {form.adType === "image" && form.imageUrl ? (
                  <img
                    src={preview || undefined}
                    onError={() => setPreviewError("Image preview failed")}
                    alt={form.headline}
                    style={{
                      display: "block",
                      maxWidth: "100%",
                      maxHeight: 250,
                    }}
                  />
                ) : form.adType === "video" && form.videoUrl ? (
                  <video
                    src={preview || undefined}
                    onError={() => setPreviewError("Video preview failed")}
                    controls
                    style={{ maxWidth: "100%", maxHeight: 250 }}
                  />
                ) : (
                  <p>
                    {form.headline} — {form.bodyText}
                  </p>
                )}
              </div>
              {formError && <p role="alert">{formError}</p>}
              <div className="cf-report-actions">
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving…" : "Save creative"}
                </Button>
                <Dialog.Close asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Dialog.Close>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      <Dialog.Root
        open={!!archive}
        onOpenChange={(value) => {
          if (!value) setArchive(null);
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="cf-report-overlay" />
          <Dialog.Content className="cf-report-dialog">
            <Dialog.Title>Archive {archive?.title}?</Dialog.Title>
            <Dialog.Description>
              Stops future selection while preserving historical attribution.
            </Dialog.Description>
            {formError && <p role="alert">{formError}</p>}
            <div className="cf-report-actions">
              <Button disabled={saving} onClick={() => void confirmArchive()}>
                Archive creative
              </Button>
              <Dialog.Close asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  );
}
