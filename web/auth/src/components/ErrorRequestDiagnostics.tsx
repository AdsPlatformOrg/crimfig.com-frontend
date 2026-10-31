"use client";
import React, { useEffect, useRef, useState } from "react";
import { consentSession } from "../lib/consent";
import { Button, Input } from "./ui";
type Occurrence = {
  id: string;
  requestId: string;
  correlationId: string;
  service: string;
  environment: string;
  statusCode: number;
  availability: string;
  occurredAt: string;
};
const panel: React.CSSProperties = {
  background: "var(--bg-elevated)",
  color: "var(--text-primary)",
  padding: 20,
  border: "1px solid var(--border-subtle)",
  borderRadius: 12,
  minWidth: 0,
};
const code: React.CSSProperties = {
  background: "var(--bg-page)",
  color: "var(--text-primary)",
  border: "1px solid var(--border-subtle)",
  padding: 12,
  borderRadius: 8,
  whiteSpace: "pre-wrap",
  overflowWrap: "anywhere",
  maxHeight: 420,
  overflow: "auto",
  fontSize: 12,
};
export function ErrorRequestDiagnostics({
  environment,
  service,
}: {
  environment: string;
  service: string;
}) {
  const [rows, setRows] = useState<Occurrence[]>([]),
    [request, setRequest] = useState(""),
    [correlation, setCorrelation] = useState(""),
    [search, setSearch] = useState(""),
    [offset, setOffset] = useState(0),
    [selected, setSelected] = useState<string | null>(null),
    [data, setData] = useState<any>(null),
    [error, setError] = useState(""),
    [detailError, setDetailError] = useState(""),
    [busy, setBusy] = useState(false),
    [refresh, setRefresh] = useState(0),
    [copyState, setCopyState] = useState("");
  const seq = useRef(0);
  const scope = new URLSearchParams();
  if (environment !== "all") scope.set("environment", environment);
  if (service !== "all") scope.set("service", service);
  const scopeString = scope.toString();
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSelected(params.get("occurrence"));
  }, []);
  useEffect(() => {
    const pop = () =>
      setSelected(
        new URLSearchParams(window.location.search).get("occurrence"),
      );
    window.addEventListener("popstate", pop);
    return () => window.removeEventListener("popstate", pop);
  }, []);
  useEffect(() => {
    let active = true;
    setBusy(true);
    setError("");
    const q = new URLSearchParams(scopeString);
    new URLSearchParams(search).forEach((v, k) => q.set(k, v));
    q.set("offset", String(offset));
    void (async () => {
      try {
        const res = await consentSession().request(
          new URL(
            `/api/v1/admin/error-monitor/occurrences?${q}`,
            window.location.origin,
          ),
        );
        if (!res.ok)
          throw Error(`Request history unavailable (HTTP ${res.status})`);
        const json = await res.json();
        if (!Array.isArray(json.data?.items))
          throw Error("Unexpected request history");
        if (active) setRows(json.data.items);
      } catch (e) {
        if (active)
          setError(e instanceof Error ? e.message : "History unavailable");
      } finally {
        if (active) setBusy(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [scopeString, search, offset, refresh]);
  useEffect(() => {
    const current = ++seq.current;
    setData(null);
    setDetailError("");
    setCopyState("");
    if (!selected) return;
    void (async () => {
      try {
        const res = await consentSession().request(
          new URL(
            `/api/v1/admin/error-monitor/occurrences/${encodeURIComponent(selected)}/diagnostics?${scopeString}`,
            window.location.origin,
          ),
        );
        if (!res.ok)
          throw Error(`Diagnostics unavailable (HTTP ${res.status})`);
        const json = await res.json();
        if (current === seq.current) setData(json.data);
      } catch (e) {
        if (current === seq.current)
          setDetailError(
            e instanceof Error ? e.message : "Diagnostics unavailable",
          );
      }
    })();
    return () => {
      seq.current++;
    };
  }, [selected, scopeString, refresh]);
  function choose(id: string | null) {
    setSelected(id);
    const url = new URL(window.location.href);
    if (id) url.searchParams.set("occurrence", id);
    else url.searchParams.delete("occurrence");
    window.history.pushState({}, "", url);
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      setCopyState("Masked diagnostic copied");
    } catch {
      setCopyState("Copy failed. Select the masked text manually.");
    }
  }
  async function download() {
    if (!selected) return;
    try {
      const res = await consentSession().request(
        new URL(
          `/api/v1/admin/error-monitor/occurrences/${encodeURIComponent(selected)}/export?${scopeString}`,
          window.location.origin,
        ),
      );
      if (!res.ok) throw Error(`Export failed (HTTP ${res.status})`);
      const blob = new Blob([JSON.stringify(await res.json(), null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "masked-error-diagnostics.json";
      a.click();
      URL.revokeObjectURL(url);
      setCopyState("Masked export downloaded");
    } catch (e) {
      setCopyState(e instanceof Error ? e.message : "Export failed");
    }
  }
  const diagnostic = data?.diagnostics;
  return (
    <section style={panel}>
      <h2>Request History & Diagnostics</h2>
      <p>
        Search retained error requests beyond group samples. Older records may
        contain metadata only.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setOffset(0);
          const q = new URLSearchParams();
          if (request) q.set("requestId", request);
          if (correlation) q.set("correlationId", correlation);
          setSearch(q.toString());
        }}
        style={{ display: "flex", gap: 12, flexWrap: "wrap", margin: "16px 0" }}
      >
        <label>
          Request ID
          <Input value={request} onChange={(e) => setRequest(e.target.value)} />
        </label>
        <label>
          Correlation ID
          <Input
            value={correlation}
            onChange={(e) => setCorrelation(e.target.value)}
          />
        </label>
        <Button type="submit">Search requests</Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setRefresh((v) => v + 1)}
        >
          Refresh / Retry
        </Button>
      </form>
      {busy && <p role="status">Loading request history…</p>}
      {error && <p role="alert">{error}</p>}
      {!busy && !error && !rows.length && (
        <p>No retained requests match these filters.</p>
      )}
      {!error &&
        rows.map((row) => (
          <div
            key={row.id}
            style={{
              padding: "12px 0",
              borderTop: "1px solid var(--border-subtle)",
              overflowWrap: "anywhere",
            }}
          >
            <Button variant="link" onClick={() => choose(row.id)}>
              HTTP {row.statusCode} · {row.requestId}
            </Button>
            <p>
              {row.service} · {row.environment} · {row.availability} ·{" "}
              {new Date(row.occurredAt).toLocaleString()}
            </p>
          </div>
        ))}
      <div style={{ display: "flex", gap: 12, margin: "12px 0" }}>
        <Button
          variant="outline"
          disabled={busy || offset === 0}
          onClick={() => setOffset((v) => Math.max(0, v - 25))}
        >
          Previous requests
        </Button>
        <Button
          variant="outline"
          disabled={busy || rows.length < 25}
          onClick={() => setOffset((v) => v + 25)}
        >
          Next requests
        </Button>
      </div>
      {selected && (
        <section
          aria-label="Request investigation"
          style={{ ...panel, background: "var(--bg-surface)" }}
        >
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <h3>Request investigation</h3>
            <Button variant="outline" onClick={() => choose(null)}>
              Close details
            </Button>
          </div>
          {detailError && <p role="alert">{detailError}</p>}
          {!data && !detailError && <p role="status">Loading diagnostics…</p>}
          {data && (
            <>
              <p>
                {data.service} · {data.environment} · {data.requestId} ·{" "}
                {data.availability}
              </p>
              {!diagnostic && (
                <p>
                  This record has no retained diagnostic payload. Old stacks and
                  bodies cannot be reconstructed.
                </p>
              )}
              {diagnostic && (
                <>
                  <p>{diagnostic.reason || ""}</p>
                  <p>
                    Duration: {diagnostic.durationMs ?? "unknown"} ms ·{" "}
                    {diagnostic.logCoverage}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                    <Button variant="outline" onClick={() => void copy()}>
                      Copy masked details
                    </Button>
                    <Button variant="outline" onClick={() => void download()}>
                      Export masked JSON
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setCorrelation(data.correlationId);
                        setSearch(
                          new URLSearchParams({
                            correlationId: data.correlationId,
                          }).toString(),
                        );
                        setOffset(0);
                      }}
                    >
                      Related requests
                    </Button>
                  </div>
                  <p role="status">{copyState}</p>
                  <details open>
                    <summary>Exception stack & causes</summary>
                    {Array.isArray(diagnostic.exception) ? (
                      diagnostic.exception.map((cause: any, i: number) => (
                        <div key={i}>
                          <h4>
                            {cause.name}: {cause.message}
                          </h4>
                          <pre style={code}>{cause.stack}</pre>
                        </div>
                      ))
                    ) : (
                      <p>No exception stack captured for this response.</p>
                    )}
                  </details>
                  {["request", "response", "logs"].map((key) => (
                    <details key={key}>
                      <summary>
                        {key === "logs"
                          ? "Correlated request logs"
                          : key === "request"
                            ? "Request & masked payload"
                            : "Response & masked payload"}
                      </summary>
                      <pre style={code}>
                        {JSON.stringify(
                          diagnostic[key] ?? { status: "unavailable" },
                          null,
                          2,
                        )}
                      </pre>
                    </details>
                  ))}
                  <p>
                    Dropped log entries: {diagnostic.droppedLogEntries ?? 0}.
                    Truncation and omission reasons appear in the affected
                    fields.
                  </p>
                </>
              )}
            </>
          )}
        </section>
      )}
    </section>
  );
}
