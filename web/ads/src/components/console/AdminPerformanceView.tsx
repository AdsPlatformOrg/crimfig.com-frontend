"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "../ui";
import { sessionFetch } from "@/lib/session";

type Kind =
  "house" | "creative" | "websites" | "website" | "slots" | "slot" | "promoter";
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
  const [storedData, setData] = useState<Report | null>(null),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true),
    [query, setQuery] = useState(""),
    [ready, setReady] = useState(false),
    [refresh, setRefresh] = useState(0);
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
            `Report unavailable (HTTP ${res.status}). Request: ${res.headers.get("x-request-id") || "unavailable"}`,
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
    return () => {
      sequence.current++;
    };
  }, [kind, id, query, ready, refresh]);
  useEffect(() => {
    const pop = () => setQuery(window.location.search.slice(1));
    window.addEventListener("popstate", pop);
    return () => window.removeEventListener("popstate", pop);
  }, []);
  function filter(key: string, value: string) {
    const next = new URLSearchParams(query);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== "page") next.delete("page");
    window.history.pushState({}, "", `${window.location.pathname}?${next}`);
    setQuery(next.toString());
  }
  const qs = new URLSearchParams(query);
  const link = (path: string, extra: Record<string, string> = {}) => {
    const next = new URLSearchParams(query);
    next.delete("page");
    const key = (
      {
        creative: "creativeId",
        website: "websiteId",
        slot: "slotId",
        promoter: "promoterId",
      } as Record<string, string>
    )[kind];
    if (key && id) next.set(key, id);
    for (const [k, v] of Object.entries(extra)) next.set(k, v);
    return `${path}?${next}`;
  };
  const detail = (row: Row) =>
    kind === "house" || kind === "slot"
      ? link(`/admin/house-ads/${row.id}/performance`)
      : kind === "website" || kind === "slots"
        ? link(`/admin/ad-slots/${row.id}`)
        : link(
            `/admin/websites/${row.id}/performance`,
            kind === "creative" && id ? { creativeId: id } : {},
          );
  return (
    <section className="cf-report">
      <header className="cf-report-header">
        <div>
          <h1>{titles[kind]}</h1>
          {id && <p className="cf-report-id">{id}</p>}
          <p>
            Operational delivery evidence. House and Shadow traffic never
            generates payouts.
          </p>
        </div>
        <Button
          variant="outline"
          disabled={loading}
          onClick={() => setRefresh((v) => v + 1)}
        >
          Refresh
        </Button>
      </header>
      <nav aria-label="Delivery reporting" className="cf-report-tabs">
        <Link href="/admin/house-ads">Creatives</Link>
        <Link href={link("/admin/house-ads/performance")}>
          House Performance
        </Link>
        <Link href={link("/admin/websites")}>Websites</Link>
        <Link href={link("/admin/ad-slots")}>Ad Slots</Link>
      </nav>
      <div className="cf-report-panel cf-report-actions">
        <label>
          Time range
          <select
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
        </label>
        {kind !== "house" && kind !== "creative" && (
          <label>
            Inventory
            <select
              value={qs.get("inventory") || ""}
              onChange={(e) => filter("inventory", e.target.value)}
            >
              <option value="">All inventory</option>
              {["house", "paid", "direct", "shadow", "simulated_paid"].map(
                (v) => (
                  <option key={v}>{v}</option>
                ),
              )}
            </select>
          </label>
        )}
        {(["from", "to"] as const).map((key) => (
          <label key={key}>
            {key === "from" ? "From (UTC)" : "To (UTC)"}
            <input
              type="datetime-local"
              value={qs.get(key)?.slice(0, 16) || ""}
              onChange={(e) =>
                filter(
                  key,
                  e.target.value
                    ? new Date(e.target.value + "Z").toISOString()
                    : "",
                )
              }
            />
          </label>
        ))}
        <label>
          Slot format
          <select
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
              <option key={v}>{v}</option>
            ))}
          </select>
        </label>
        <Button
          variant="outline"
          onClick={() => {
            window.history.pushState({}, "", window.location.pathname);
            setQuery("");
          }}
        >
          Reset filters
        </Button>
      </div>
      {loading && <p role="status">Loading performance…</p>}
      {error && (
        <div role="alert" className="cf-report-error">
          {error} {data && "Previously loaded figures may be stale."}
          <Button variant="outline" onClick={() => setRefresh((v) => v + 1)}>
            Retry
          </Button>
        </div>
      )}
      {data && (
        <>
          {data.subject && (
            <div className="cf-report-panel">
              <h2>Reporting context</h2>
              {Object.entries(data.subject).map(([key, value]) => (
                <p key={key}>
                  {String(value.label || value.id)} �{" "}
                  {String(
                    value.policyStatus ||
                      value.lifecycleStatus ||
                      value.verificationStatus ||
                      "",
                  )}{" "}
                  {value.installationStatus
                    ? `� Installation: ${value.installationStatus}`
                    : ""}
                </p>
              ))}
            </div>
          )}
          <p>
            Updated {new Date(data.asOf).toLocaleString()} · UTC reporting
            window · {loading || error ? "Stale while refreshing" : "Loaded"}
          </p>
          <div className="cf-report-grid">
            {(
              [
                "serves",
                "renders",
                "impressions",
                "viewable",
                "clicks",
              ] as const
            ).map((key) => (
              <div key={key} className="cf-report-panel">
                <h2>{key === "viewable" ? "Viewable impressions" : key}</h2>
                <strong>{data.summary[key].toLocaleString()}</strong>
              </div>
            ))}
            <div className="cf-report-panel">
              <h2>CTR</h2>
              <strong>
                {data.summary.ctr === null
                  ? "Not measurable"
                  : `${data.summary.ctr.toFixed(2)}%`}
              </strong>
            </div>
          </div>
          <p>
            Render rate:{" "}
            {data.summary.renderRate == null
              ? "Not measurable"
              : `${data.summary.renderRate.toFixed(2)}%`}{" "}
            � Issued serves awaiting render confirmation:{" "}
            {data.summary.renderPending ?? "Unknown"}
          </p>
          <p>{data.definitions.basis}</p>
          <p>{data.definitions.coverage}</p>
          <p>
            Request totals, no-fill and browser failures: unknown where no
            measurement exists.
          </p>
          <div className="cf-report-table">
            <table>
              <caption>
                {kind === "house"
                  ? "House creatives"
                  : kind === "website" || kind === "slots"
                    ? "Slots"
                    : kind === "slot"
                      ? "House creatives"
                      : "Promoter websites"}
              </caption>
              <thead>
                <tr>
                  <th>Name / ID</th>
                  <th>Status</th>
                  <th>Serves</th>
                  <th>Renders</th>
                  <th>Impressions</th>
                  <th>Clicks</th>
                  <th>CTR</th>
                  <th>Last render / installation</th>
                  <th>Related</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <Link href={detail(row)}>{row.label || row.id}</Link>
                    </td>
                    <td>
                      {row.lifecycleStatus || row.verificationStatus || "—"}
                    </td>
                    <td>{row.serves}</td>
                    <td>{row.renders}</td>
                    <td>{row.impressions}</td>
                    <td>{row.clicks}</td>
                    <td>{row.ctr === null ? "—" : `${row.ctr.toFixed(2)}%`}</td>
                    <td>
                      {row.lastRenderAt
                        ? new Date(row.lastRenderAt).toLocaleString()
                        : "No render confirmed"}
                      {row.installationStatus && ` � ${row.installationStatus}`}
                    </td>
                    <td>
                      {row.promoterId && (
                        <Link
                          href={link(
                            `/admin/promoters/${row.promoterId}/performance`,
                          )}
                        >
                          Promoter
                        </Link>
                      )}
                      {row.websiteId && (
                        <>
                          {" "}
                          ·{" "}
                          <Link
                            href={link(
                              `/admin/websites/${row.websiteId}/performance`,
                            )}
                          >
                            Website
                          </Link>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!data.items.length && (
            <p>No registered inventory matches this scope.</p>
          )}
          <div className="cf-report-actions">
            <Button
              variant="outline"
              disabled={data.page <= 1}
              onClick={() => filter("page", String(data.page - 1))}
            >
              Previous
            </Button>
            <span>
              Page {data.page} · {data.total} records
            </span>
            <Button
              variant="outline"
              disabled={data.page * data.limit >= data.total}
              onClick={() => filter("page", String(data.page + 1))}
            >
              Next
            </Button>
          </div>
          <details className="cf-report-panel">
            <summary>Daily delivery trend (UTC)</summary>
            <div className="cf-report-table">
              <table>
                <thead>
                  <tr>
                    <th>Day</th>
                    <th>Serves</th>
                    <th>Renders</th>
                    <th>Clicks</th>
                  </tr>
                </thead>
                <tbody>
                  {data.series.map((row) => (
                    <tr key={row.day}>
                      <td>{row.day?.slice(0, 10)}</td>
                      <td>{row.serves}</td>
                      <td>{row.renders}</td>
                      <td>{row.clicks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {!data.series.length && <p>No delivery activity in this period.</p>}
          </details>
          <details className="cf-report-panel">
            <summary>Inventory breakdown</summary>
            {data.inventory.map((row) => (
              <p key={row.inventoryClass}>
                {row.inventoryClass}: {row.serves} serves · {row.renders}{" "}
                renders · {row.clicks} clicked serves
              </p>
            ))}
          </details>
        </>
      )}
    </section>
  );
}
