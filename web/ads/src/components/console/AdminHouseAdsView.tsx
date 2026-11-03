"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
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
                        }}
                      >
                        Performance
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
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
              <fieldset disabled={saving} className="cf-section tw:grid tw:gap-4 tw:md:grid-cols-2"><legend>Ad copy</legend>
              {(
                [
                  "title",
                  "headline",
                  "bodyText",
                  "ctaText",
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
                  {key==='bodyText'?<Textarea required rows={4} value={form[key]} onChange={event=>setForm({...form,[key]:event.target.value})}/>:                  <Input
                    required
                    type="text"
                    value={form[key]}
                    onChange={(e) =>
                      setForm({ ...form, [key]: e.target.value })
                    }
                  />}
                </label>
              ))}
              </fieldset>
              <fieldset disabled={saving} className="cf-section"><legend>Assets &amp; destination</legend>
              <label>Destination URL<Input required type="url" value={form.destinationUrl} onChange={event=>setForm({...form,destinationUrl:event.target.value})}/></label>
              <label>
                Ad type
                <select className="cf-input"
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
              {filename&&<p className="cf-muted" role="status">Selected file: {filename}</p>}
              </fieldset><fieldset disabled={saving} className="cf-section"><legend>Specifications &amp; delivery</legend>
              <label>
                Format
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
              <div className="cf-report-grid">
                {(["width", "height", "priority"] as const).map((key) => (
                  <label key={key}>
                    {key==='priority'?'Delivery priority':`${key==='width'?'Width':'Height'} (px)`}
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
