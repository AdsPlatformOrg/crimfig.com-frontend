"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import { Pause, Play } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { Button, Input } from "../ui";
import { sessionFetch } from "@/lib/session";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../ui/table";
import { Badge } from "../ui/badge";
import {HouseSampleImport} from './HouseSampleImport';

type Creative = {
  id: string;
  imageAssetId?: string | null;
  videoAssetId?: string | null;
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
const HOUSE_IMAGE_PRESETS = [
  { id: "medium_rectangle", label: "Medium Rectangle (300 × 250)", width: 300, height: 250, format: "card" },
  { id: "large_rectangle", label: "Large Rectangle (336 × 280)", width: 336, height: 280, format: "card" },
  { id: "leaderboard", label: "Leaderboard (728 × 90)", width: 728, height: 90, format: "banner" },
  { id: "mobile_banner", label: "Mobile Banner (320 × 50)", width: 320, height: 50, format: "banner" },
  { id: "large_mobile_banner", label: "Large Mobile Banner (320 × 100)", width: 320, height: 100, format: "banner" },
  { id: "half_page", label: "Half Page (300 × 600)", width: 300, height: 600, format: "card" },
  { id: "billboard", label: "Billboard (970 × 250)", width: 970, height: 250, format: "banner" },
  { id: "square", label: "Square (250 × 250)", width: 250, height: 250, format: "card" },
  { id: "large_square", label: "Large Square (300 × 300)", width: 300, height: 300, format: "card" },
] as const;
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
  const initialForm=useRef(''),mutationBusy=useRef(false);
  const [discardRequested,setDiscardRequested]=useState(false),[filename,setFilename]=useState('');
  useEffect(()=>{if(open){initialForm.current=JSON.stringify(form);setDiscardRequested(false);setFilename('');}},[open]);
  function closeEditor(){if(mutationBusy.current)return;if(JSON.stringify(form)!==initialForm.current){setDiscardRequested(true);return;}setOpen(false);}
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
  async function toggleActive(creative: Creative) {
    if (mutationBusy.current) return;
    mutationBusy.current = true;
    setSaving(true);
    setError("");
    try {
      const res = await sessionFetch(
        `/api/v1/admin/ads/house-creatives/${creative.id}`,
        {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ isActive: !creative.isActive }),
        },
      );
      if (!res.ok) throw Error(`Status update failed (HTTP ${res.status})`);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Status update failed");
    } finally {
      mutationBusy.current = false;
      setSaving(false);
    }
  }
  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (mutationBusy.current) return;
    mutationBusy.current=true;
    setSaving(true);
    setFormError("");
    try {
      const res = await sessionFetch(
        `/api/v1/admin/ads/house-creatives${editing ? `/${editing}` : ""}`,
        {
          method: editing ? "PATCH" : "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            title: form.title,
            headline: form.headline,
            bodyText: form.bodyText,
            ctaText: form.ctaText,
            destinationUrl: form.destinationUrl,
            adType: form.adType,
            format: form.format,
            width: Number(form.width),
            height: Number(form.height),
            priority: Number(form.priority),
            isActive: Boolean(form.isActive),
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
      mutationBusy.current=false;setSaving(false);
    }
  }
  async function upload(file: File | undefined) {
    if (!file || mutationBusy.current) return;
    mutationBusy.current=true;setFilename(file.name);
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
      mutationBusy.current=false;setSaving(false);
    }
  }
  async function confirmArchive() {
    if (!archive || mutationBusy.current) return;
    mutationBusy.current=true;
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
      mutationBusy.current=false;setSaving(false);
    }
  }
  return (
    <section className="cf-report cf-admin-ui cf-house-admin">
      <header className="cf-report-header">
        <div>
          <h1 className="cf-page-title">House Ads</h1>
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
      <HouseSampleImport onImported={()=>void load()} />
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
      {items && items.length > 0 && (
        <div style={{ marginTop: '16px' }}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead style={{ width: '32%' }}>Creative & Copy</TableHead>
                <TableHead style={{ width: '18%' }}>Format & Dimensions</TableHead>
                <TableHead style={{ width: '15%' }}>Priority & Status</TableHead>
                <TableHead className="text-right" style={{ width: '35%' }}>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{c.title}</div>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-crimson)', marginTop: '2px' }}>
                      {c.headline}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px', maxWidth: '360px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {c.bodyText}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div style={{ textTransform: 'capitalize', fontWeight: 500 }}>
                      {c.adType} · {c.format}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {c.width} × {c.height} px
                    </div>
                  </TableCell>
                  <TableCell>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <Badge
                        variant="outline"
                        style={{
                          width: 'fit-content',
                          fontSize: '11px',
                          fontWeight: 600,
                          backgroundColor: c.isActive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                          color: c.isActive ? 'var(--color-success, #10B981)' : 'var(--color-error, #EF4444)',
                        }}
                      >
                        {c.isActive ? 'ACTIVE' : 'PAUSED'}
                      </Badge>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        Priority: {c.priority}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
                      <Link
                        href={`/admin/house-ads/${c.id}/performance`}
                        style={{
                          fontSize: '12px',
                          fontWeight: 600,
                          color: 'var(--text-secondary)',
                          textDecoration: 'none',
                          padding: '5px 10px',
                          borderRadius: '6px',
                          border: '1px solid var(--border-subtle)',
                          backgroundColor: 'var(--bg-surface)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Performance
                      </Link>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        disabled={saving}
                        title={c.isActive ? "Pause house ad delivery" : "Activate house ad delivery"}
                        aria-label={c.isActive ? `Pause ${c.title}` : `Activate ${c.title}`}
                        onClick={() => void toggleActive(c)}
                        style={{
                          color: c.isActive ? 'var(--color-warning, #D97706)' : 'var(--color-success, #10B981)',
                        }}
                      >
                        {c.isActive ? <Pause size={15} aria-hidden="true" /> : <Play size={15} aria-hidden="true" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditing(c.id);
                          setForm({
                            imageAssetId: c.imageAssetId || "",
                            videoAssetId: c.videoAssetId || "",
                            title: c.title || "",
                            headline: c.headline || "",
                            bodyText: c.bodyText || "",
                            ctaText: c.ctaText || "",
                            destinationUrl: c.destinationUrl || "https://ads.crimfig.com",
                            adType: c.adType || "image",
                            imageUrl: c.imageUrl || "",
                            videoUrl: c.videoUrl || "",
                            format: c.format || "banner",
                            width: c.width || 728,
                            height: c.height || 90,
                            priority: c.priority ?? 10,
                            isActive: Boolean(c.isActive),
                          });
                          setFormError("");
                          setOpen(true);
                        }}
                      >
                        Edit / Preview
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setFormError("");
                          setArchive(c);
                        }}
                      >
                        Archive
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
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
      <Dialog.Root open={open} onOpenChange={value=>value?setOpen(true):closeEditor()}>
        <Dialog.Portal>
          <Dialog.Overlay className="cf-report-overlay" />
          <Dialog.Content className="cf-report-dialog cf-house-dialog cf-admin-ui">
            <Dialog.Title>
              {editing ? "Edit House Ad" : "Add House Ad"}
            </Dialog.Title>
            <Dialog.Description>
              Configure creative content and preview. Preview does not send
              delivery events.
            </Dialog.Description>
            <form onSubmit={save} className="cf-report-form" aria-busy={saving}>
              {discardRequested&&<aside role="alert" className="cf-surface cf-dialog-section"><p>Discard your unsaved changes?</p><Button type="button" variant="destructive" onClick={()=>{setDiscardRequested(false);setOpen(false);}}>Discard changes</Button><Button type="button" variant="outline" onClick={()=>setDiscardRequested(false)}>Keep editing</Button></aside>}
              <fieldset disabled={saving} className="cf-section cf-house-fieldset"><legend>Ad copy &amp; identity</legend>
              <div className="cf-house-field-grid tw:grid tw:gap-4 tw:md:grid-cols-2">
                <label className="cf-house-field cf-house-field-full">
                  <span>Internal title</span>
                  <Input
                    required
                    type="text"
                    placeholder="e.g. CrimFig Fall Growth — Large Square"
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                  />
                </label>
              </div>
              <details className="cf-house-optional-copy" open={form.adType === "text" || Boolean(form.headline || form.bodyText)}>
                <summary>
                  {form.adType === "image"
                    ? "Optional overlay / fallback copy (not required for Image ads)"
                    : "Headline, body & call to action"}
                </summary>
                <div className="cf-house-field-grid" style={{ marginTop: "12px" }}>
                  {(
                    [
                      "headline",
                      "ctaText",
                      "bodyText",
                    ] as const
                  ).map((key) => (
                    <label
                      key={key}
                      className={key === "bodyText" ? "cf-house-field cf-house-field-full" : "cf-house-field"}
                    >
                      <span>
                        {
                          {
                            headline: "Headline (optional for Image ads)",
                            bodyText: "Body (optional for Image ads)",
                            ctaText: "Call to action",
                          }[key]
                        }
                      </span>
                      {key==='bodyText'?<Textarea required={form.adType === "text"} rows={3} value={form[key]} onChange={event=>setForm({...form,[key]:event.target.value})}/>:                  <Input
                        required={form.adType === "text"}
                        type="text"
                        value={form[key]}
                        onChange={(e) =>
                          setForm({ ...form, [key]: e.target.value })
                        }
                      />}
                    </label>
                  ))}
                </div>
              </details>
              </fieldset>
              <fieldset disabled={saving} className="cf-section cf-house-fieldset"><legend>Assets &amp; destination</legend>
              <div className="cf-house-type-pills" role="group" aria-label="House ad format availability">
                <span className="cf-house-type-pill cf-house-type-pill-active">Image Ads — Available</span>
                <span className="cf-house-type-pill cf-house-type-pill-muted">Text Ads — Coming Soon</span>
                <span className="cf-house-type-pill cf-house-type-pill-muted">Video Ads — Coming Soon</span>
              </div>
              <div className="cf-house-field-grid tw:grid tw:gap-4 tw:md:grid-cols-2">
                <label className="cf-house-field">
                  <span>Destination URL</span>
                  <Input required type="url" value={form.destinationUrl} onChange={event=>setForm({...form,destinationUrl:event.target.value})}/>
                </label>
                <label className="cf-house-field">
                  <span>Ad type</span>
                  <select className="cf-input"
                    value={form.adType}
                    onChange={(e) => setForm({ ...form, adType: e.target.value })}
                  >
                    <option value="image">Image</option>
                    <option value="text" disabled>Text (Coming soon)</option>
                    <option value="video" disabled>Video (Coming soon)</option>
                  </select>
                </label>
                {form.adType !== "text" && (
                  <label className="cf-house-field cf-house-field-full">
                    <span>{form.adType === "image" ? "Image URL" : "Video URL"}</span>
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
                  <label className="cf-house-field cf-house-field-full cf-house-upload-box">
                    <span>Upload media (existing service size and type restrictions apply)</span>
                    <input
                      type="file"
                      accept={form.adType === "image" ? "image/*" : "video/*"}
                      disabled={saving}
                      onChange={(e) => void upload(e.target.files?.[0])}
                    />
                  </label>
                )}
              </div>
              {filename&&<p className="cf-muted" role="status">Selected file: {filename}</p>}
              </fieldset><fieldset disabled={saving} className="cf-section cf-house-fieldset"><legend>Specifications &amp; delivery</legend>
              <div className="cf-house-field-grid tw:grid tw:gap-4 tw:md:grid-cols-2">
                <label className="cf-house-field">
                  <span>Approved image preset</span>
                  <select
                    className="cf-input"
                    value={
                      HOUSE_IMAGE_PRESETS.find(
                        (p) => p.width === Number(form.width) && p.height === Number(form.height),
                      )?.id || "custom"
                    }
                    onChange={(e) => {
                      const preset = HOUSE_IMAGE_PRESETS.find((p) => p.id === e.target.value);
                      if (preset) {
                        setForm({
                          ...form,
                          width: preset.width,
                          height: preset.height,
                          format: preset.format,
                        });
                      }
                    }}
                  >
                    {HOUSE_IMAGE_PRESETS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.label}
                      </option>
                    ))}
                    <option value="custom">Custom dimensions ({form.width} × {form.height} px)</option>
                  </select>
                </label>
                <label className="cf-house-field">
                  <span>Format</span>
                  <select className="cf-input"
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
              </div>
              <div className="cf-report-grid">
                {(["width", "height", "priority"] as const).map((key) => (
                  <label key={key} className="cf-house-field">
                    <span>{key==='priority'?'Delivery priority':`${key==='width'?'Width':'Height'} (px)`}</span>
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
              <label className="cf-house-checkbox">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) =>
                    setForm({ ...form, isActive: e.target.checked })
                  }
                />{" "}
                <span>Active (eligible for immediate fallback &amp; dynamic slot delivery)</span>
              </label>
              </fieldset>
              {previewError && <p role="alert">{previewError}</p>}
              <div className="cf-report-panel">
                <h3 className="cf-section-title">Live preview (nonbillable)</h3>
                {form.adType === "image" && form.imageUrl ? (
                  <img
                    className="cf-house-preview"
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
                    className="cf-house-preview"
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
                  <Button type="button" variant="outline" disabled={saving}>
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
          if (!value&&!mutationBusy.current) setArchive(null);
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="cf-report-overlay" />
          <Dialog.Content className="cf-report-dialog cf-house-dialog cf-admin-ui">
            <Dialog.Title>Archive {archive?.title}?</Dialog.Title>
            <Dialog.Description>
              Stops future selection while preserving historical attribution.
            </Dialog.Description>
            {formError && <p role="alert">{formError}</p>}
            <div className="cf-report-actions">
              <Button variant="destructive" disabled={saving} onClick={() => void confirmArchive()}>
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
