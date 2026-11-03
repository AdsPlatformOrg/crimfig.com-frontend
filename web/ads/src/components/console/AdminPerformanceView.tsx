"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui";
import {
  BarChart3,
  Calendar,
  Layers,
  RefreshCw,
  SlidersHorizontal,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  CheckCircle2,
  Clock,
  Filter,
} from "lucide-react";
import { sessionFetch } from "@/lib/session";
import { WebsitePolicyReview } from "./WebsitePolicyReview";

type Kind =
  | "house"
  | "creative"
  | "websites"
  | "website"
  | "slots"
  | "slot"
  | "promoter";

type Row = {
  id?: string;
  label?: string;
  promoterId?: string;
  websiteId?: string;
  serves: number;
  renders: number;
  impressions: number;
  clicks: number;
  viewable: number;
  ctr: number | null;
  renderRate: number | null;
  renderPending?: number;
  lastRenderAt?: string;
  installationStatus?: string;
  lastEventAt?: string;
  lifecycleStatus?: string;
  verificationStatus?: string;
  day?: string;
  inventoryClass?: string;
};

type Report = {
  _scope?: string;
  subject?: Record<string, Record<string, unknown>>;
  summary: Row;
  items: Row[];
  series: Row[];
  inventory: Row[];
  page: number;
  total: number;
  limit: number;
  asOf: string;
  definitions: Record<string, string>;
};

const titles: Record<Kind, string> = {
  house: "House Ads Performance",
  creative: "Creative Performance on Promoter Websites",
  websites: "Website Delivery Performance",
  website: "Website Performance by Slot",
  slots: "Ad Slot Performance",
  slot: "Slot Performance by House Creative",
  promoter: "Promoter Website Performance",
};

export function reportEndpoint(kind: Kind, id?: string) {
  const suffix: Record<Kind, string> = {
    house: "house-creatives/analytics",
    creative: `house-creatives/${id}/analytics`,
    websites: "websites/analytics",
    website: `websites/${id}/analytics`,
    slots: "slots/analytics",
    slot: `slots/${id}/analytics`,
    promoter: `promoters/${id}/analytics`,
  };
  return `/api/v1/admin/ads/${suffix[kind]}`;
}

export function AdminPerformanceView({
  kind,
  id,
}: {
  kind: Kind;
  id?: string;
}) {
  const [storedData, setData] = useState<Report | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [ready, setReady] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const sequence = useRef(0);

  const data = storedData?._scope === `${kind}:${id || ""}` ? storedData : null;

  useEffect(() => {
    setQuery(window.location.search.slice(1));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const seq = ++sequence.current;
    setLoading(true);
    setError("");
    void (async () => {
      try {
        const res = await sessionFetch(`${reportEndpoint(kind, id)}?${query}`);
        if (!res.ok)
          throw Error(
            `Report unavailable (HTTP ${res.status}). Request: ${
              res.headers.get("x-request-id") || "unavailable"
            }`
          );
        const json = await res.json();
        if (!json.data || !Array.isArray(json.data.items) || !json.data.summary)
          throw Error("Unexpected report response");
        if (seq === sequence.current)
          setData({ ...json.data, _scope: `${kind}:${id || ""}` });
      } catch (e) {
        if (seq === sequence.current)
          setError(e instanceof Error ? e.message : "Report unavailable");
      } finally {
        if (seq === sequence.current) setLoading(false);
      }
    })();
  }, [ready, kind, id, query, refresh]);

  const qs = new URLSearchParams(query);
  function filter(name: string, value: string) {
    const next = new URLSearchParams(query);
    if (value) next.set(name, value);
    else next.delete(name);
    if (name !== "page") next.delete("page");
    window.history.pushState({}, "", `?${next}`);
    setQuery(next.toString());
  }

  function link(path: string) {
    const p = new URLSearchParams();
    for (const key of ["range", "from", "to", "format", "inventory"]) {
      const v = qs.get(key);
      if (v) p.set(key, v);
    }
    const q = p.toString();
    return q ? `${path}?${q}` : path;
  }

  return (
    <section className="cf-report-root space-y-6" aria-label="Performance report">
      {/* Header & Breadcrumb Context */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] mb-1">
            <Link href="/admin/house-ads" className="hover:text-[var(--color-crimson)] transition-colors">
              House Ads
            </Link>
            <ChevronRight size={12} />
            <span>Reporting</span>
            {kind !== "house" && (
              <>
                <ChevronRight size={12} />
                <span className="font-semibold text-[var(--color-text-primary)]">{titles[kind]}</span>
              </>
            )}
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
            {titles[kind]}
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            Standard delivery telemetry, viewability beacons, and placement attribution
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setRefresh((v) => v + 1)}
            disabled={loading}
            className="flex items-center gap-1.5"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            <span>{loading ? "Refreshing..." : "Refresh"}</span>
          </Button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1 p-1 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-lg text-sm w-fit overflow-x-auto">
        <Link
          href={link("/admin/house-ads")}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
            kind === "house" ? "bg-[var(--color-crimson)] text-white" : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
          }`}
        >
          House Ads
        </Link>
        <Link
          href={link("/admin/house-ads/performance")}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
            kind === "house" ? "bg-[var(--color-crimson)] text-white" : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
          }`}
        >
          Performance
        </Link>
        <Link
          href={link("/admin/websites")}
          className="px-3 py-1.5 rounded-md font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
        >
          Websites
        </Link>
        <Link
          href={link("/admin/ad-slots")}
          className="px-3 py-1.5 rounded-md font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
        >
          Ad Slots
        </Link>
      </div>

      {/* Filter Toolbar */}
      <Card className="border-[var(--border-subtle)]">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 items-end">
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1">
                Time range
              </label>
              <select
                className="w-full h-9 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-1 text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-crimson)]"
                value={qs.get("range") || "7d"}
                onChange={(e) => {
                  const next = new URLSearchParams(query);
                  next.delete("from");
                  next.delete("to");
                  next.set("range", e.target.value);
                  next.delete("page");
                  window.history.pushState({}, "", `?${next}`);
                  setQuery(next.toString());
                }}
              >
                <option value="24h">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
              </select>
            </div>

            {kind !== "house" && kind !== "creative" && (
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1">
                  Inventory
                </label>
                <select
                  className="w-full h-9 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-1 text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-crimson)]"
                  value={qs.get("inventory") || ""}
                  onChange={(e) => filter("inventory", e.target.value)}
                >
                  <option value="">All inventory</option>
                  {["house", "paid", "direct", "shadow", "simulated_paid"].map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1">
                Slot format
              </label>
              <select
                className="w-full h-9 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-1 text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-crimson)]"
                value={qs.get("format") || ""}
                onChange={(e) => filter("format", e.target.value)}
              >
                <option value="">All formats</option>
                {[
                  "banner",
                  "card",
                  "video",
                  "interstitial",
                  "square",
                  "sidebar_sticky",
                  "in_content_mid",
                  "in_content_end",
                ].map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1">
                From (UTC)
              </label>
              <input
                type="datetime-local"
                className="w-full h-9 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-1 text-xs text-[var(--color-text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-crimson)]"
                value={qs.get("from")?.slice(0, 16) || ""}
                onChange={(e) =>
                  filter(
                    "from",
                    e.target.value ? new Date(e.target.value + "Z").toISOString() : ""
                  )
                }
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1">
                To (UTC)
              </label>
              <input
                type="datetime-local"
                className="w-full h-9 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-1 text-xs text-[var(--color-text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-crimson)]"
                value={qs.get("to")?.slice(0, 16) || ""}
                onChange={(e) =>
                  filter(
                    "to",
                    e.target.value ? new Date(e.target.value + "Z").toISOString() : ""
                  )
                }
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-3 pt-3 border-t border-[var(--border-subtle)]">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                window.history.pushState({}, "", window.location.pathname);
                setQuery("");
              }}
            >
              Reset filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error state */}
      {error && (
        <div role="alert" className="p-4 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-sm text-red-800 dark:text-red-300 flex items-center justify-between">
          <span>{error} {data && "· Previously loaded figures may be stale."}</span>
          <Button variant="outline" size="sm" onClick={() => setRefresh((v) => v + 1)}>
            Retry
          </Button>
        </div>
      )}

      {/* Loading state skeleton */}
      {loading && !data && (
        <div className="py-8 text-center text-sm text-[var(--color-text-muted)]">
          <RefreshCw size={24} className="animate-spin mx-auto mb-2 text-[var(--color-crimson)]" />
          Loading performance telemetry...
        </div>
      )}

      {data && (
        <>
          {/* Reporting Context / Subject Chips */}
          {data.subject && Object.keys(data.subject).length > 0 && (
            <div className="flex flex-wrap items-center gap-2 p-3 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-lg text-xs">
              <span className="font-semibold text-[var(--color-text-primary)] flex items-center gap-1">
                <Filter size={13} /> Active Scope:
              </span>
              {Object.entries(data.subject).map(([key, value]) => (
                <Badge key={key} variant="outline" className="font-normal text-[var(--color-text-secondary)]">
                  {String(value.label || value.id)}
                  {value.policyStatus || value.lifecycleStatus || value.verificationStatus
                    ? ` · ${String(value.policyStatus || value.lifecycleStatus || value.verificationStatus)}`
                    : ""}
                  {value.installationStatus ? ` · Inst: ${value.installationStatus}` : ""}
                </Badge>
              ))}
            </div>
          )}

          {kind === "website" && id && !loading && !error && data.subject?.websiteId && (
            <WebsitePolicyReview key={id} websiteId={id} currentPolicy={String(data.subject.websiteId.policyStatus || "unknown")} onSaved={() => setRefresh(v => v + 1)} />
          )}

          {/* KPI Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { key: "serves", label: "Serves", value: data.summary.serves.toLocaleString() },
              { key: "renders", label: "Renders", value: data.summary.renders.toLocaleString() },
              { key: "impressions", label: "Impressions", value: data.summary.impressions.toLocaleString() },
              { key: "viewable", label: "Viewable", value: data.summary.viewable.toLocaleString() },
              { key: "clicks", label: "Clicks", value: data.summary.clicks.toLocaleString() },
              {
                key: "ctr",
                label: "CTR",
                value: data.summary.ctr === null ? "Not measurable" : `${data.summary.ctr.toFixed(2)}%`,
              },
            ].map((kpi) => (
              <Card key={kpi.key} className="border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                <CardContent className="p-4">
                  <p className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                    {kpi.label}
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)] mt-1">
                    {kpi.value}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Telemetry Metrics & Definitions Banner */}
          <div className="p-3 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-lg text-xs space-y-1 text-[var(--color-text-secondary)]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-[var(--color-text-primary)]">
                Render rate:{" "}
                {data.summary.renderRate == null ? "Not measurable" : `${data.summary.renderRate.toFixed(2)}%`}
              </span>
              <span>·</span>
              <span>Issued serves awaiting render confirmation: {data.summary.renderPending ?? "Unknown"}</span>
              <span>·</span>
              <span className="text-[var(--color-text-muted)]">
                Updated {new Date(data.asOf).toLocaleString()} (UTC window)
              </span>
            </div>
            <p className="text-[var(--color-text-muted)]">{data.definitions.basis}</p>
            <p className="text-[var(--color-text-muted)]">{data.definitions.coverage}</p>
          </div>

          {/* Main Breakdown Table */}
          <Card className="border-[var(--border-subtle)] overflow-hidden">
            <CardHeader className="p-4 pb-2 border-b border-[var(--border-subtle)]">
              <CardTitle className="text-base font-semibold">
                {kind === "house"
                  ? "House Creatives Breakdown"
                  : kind === "website" || kind === "slots"
                  ? "Ad Slots Breakdown"
                  : kind === "slot"
                  ? "House Creatives on Slot"
                  : "Performance Breakdown"}
              </CardTitle>
            </CardHeader>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Target</TableHead>
                    <TableHead className="text-right">Serves</TableHead>
                    <TableHead className="text-right">Renders</TableHead>
                    <TableHead className="text-right">Render %</TableHead>
                    <TableHead className="text-right">Impressions</TableHead>
                    <TableHead className="text-right">Viewable</TableHead>
                    <TableHead className="text-right">Clicks</TableHead>
                    <TableHead className="text-right">CTR</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.items.map((row) => (
                    <TableRow key={row.id || row.label}>
                      <TableCell className="font-medium">
                        <div>
                          <span>{row.label || row.id}</span>
                          {row.lastRenderAt && (
                            <p className="text-[11px] text-[var(--color-text-muted)]">
                              Last render: {new Date(row.lastRenderAt).toLocaleString()}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{row.serves.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{row.renders.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        {row.renderRate == null ? "—" : `${row.renderRate.toFixed(1)}%`}
                      </TableCell>
                      <TableCell className="text-right">{row.impressions.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{row.viewable.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{row.clicks.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-semibold">
                        {row.ctr === null ? "—" : `${row.ctr.toFixed(2)}%`}
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        {kind === "house" && row.id && (
                          <Link
                            href={link(`/admin/house-ads/${row.id}/performance`)}
                            className="text-xs text-[var(--color-crimson)] hover:underline inline-flex items-center gap-0.5"
                          >
                            <span>Drilldown</span>
                            <ExternalLink size={11} />
                          </Link>
                        )}
                        {kind === "websites" && row.id && (
                          <Link
                            href={link(`/admin/websites/${row.id}/performance`)}
                            className="text-xs text-[var(--color-crimson)] hover:underline inline-flex items-center gap-0.5"
                          >
                            <span>Slots</span>
                            <ExternalLink size={11} />
                          </Link>
                        )}
                        {row.promoterId && (
                          <Link
                            href={link(`/admin/promoters/${row.promoterId}/performance`)}
                            className="text-xs text-[var(--color-text-muted)] hover:underline"
                          >
                            Promoter
                          </Link>
                        )}
                        {row.websiteId && (
                          <>
                            <span className="text-[var(--color-text-muted)]">·</span>
                            <Link
                              href={link(`/admin/websites/${row.websiteId}/performance`)}
                              className="text-xs text-[var(--color-text-muted)] hover:underline"
                            >
                              Website
                            </Link>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {data.items.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-6 text-sm text-[var(--color-text-muted)]">
                        No registered inventory matches this scope and time filter.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            {/* Pagination */}
            <div className="flex items-center justify-between p-3 border-t border-[var(--border-subtle)] text-xs text-[var(--color-text-muted)]">
              <span>
                Page {data.page} · {data.total} records total
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={data.page <= 1}
                  onClick={() => filter("page", String(data.page - 1))}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={data.page * data.limit >= data.total}
                  onClick={() => filter("page", String(data.page + 1))}
                >
                  Next
                </Button>
              </div>
            </div>
          </Card>

          {/* Daily Trend Table */}
          <Card className="border-[var(--border-subtle)]">
            <CardHeader className="p-4 pb-2 border-b border-[var(--border-subtle)]">
              <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                <TrendingUp size={15} />
                Daily Delivery Trend (UTC)
              </CardTitle>
            </CardHeader>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Day</TableHead>
                    <TableHead className="text-right">Serves</TableHead>
                    <TableHead className="text-right">Renders</TableHead>
                    <TableHead className="text-right">Clicks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.series.map((row) => (
                    <TableRow key={row.day}>
                      <TableCell className="font-mono text-xs">{row.day?.slice(0, 10)}</TableCell>
                      <TableCell className="text-right">{row.serves.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{row.renders.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{row.clicks.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                  {data.series.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4 text-xs text-[var(--color-text-muted)]">
                        No delivery activity in this period.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>

          {/* Inventory Breakdown */}
          {data.inventory && data.inventory.length > 0 && (
            <Card className="border-[var(--border-subtle)]">
              <CardHeader className="p-4 pb-2 border-b border-[var(--border-subtle)]">
                <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                  <Layers size={15} />
                  Inventory Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-3 space-y-2">
                {data.inventory.map((row) => (
                  <div key={row.inventoryClass} className="flex items-center justify-between text-xs py-1 border-b border-[var(--border-subtle)] last:border-0">
                    <span className="font-medium text-[var(--color-text-primary)] capitalize">
                      {row.inventoryClass}
                    </span>
                    <span className="text-[var(--color-text-muted)]">
                      {row.serves.toLocaleString()} serves · {row.renders.toLocaleString()} renders · {row.clicks.toLocaleString()} clicks
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </section>
  );
}
