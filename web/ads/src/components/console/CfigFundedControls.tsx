"use client";
import { useEffect, useRef, useState } from "react";
import { sessionFetch } from "@/lib/session";
import { formatCfig, parseCfig } from "@/lib/cfig-format";
import { Button, Card, CardHeader, CardTitle, CardContent, Input } from "../ui";
type Row = Record<string, any>;
async function request(path: string, body?: Row) {
  const response = await sessionFetch(
    "/api/v1/" + path,
    body
      ? {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(body),
        }
      : undefined,
  );
  const result = await response.json().catch(() => null);
  if (!response.ok || result?.data === undefined)
    throw new Error(
      result?.message ||
        "Funded rewards unavailable; reconcile an unconfirmed request before changing it.",
    );
  return result.data;
}
export function CfigFundedControls({ mode }: { mode: "promoter" | "reserve" }) {
  const admin = mode === "reserve",
    base = admin ? "admin/rewards/cfig" : "promoter/rewards/cfig";
  const [data, setData] = useState<Row | null>(null),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [receipt, setReceipt] = useState<Row | null>(null),
    [cohort, setCohort] = useState<Row | null>(null),
    [amount, setAmount] = useState(""),
    [proof, setProof] = useState(""),
    [policy, setPolicy] = useState(""),
    [rate, setRate] = useState(""),
    [effective, setEffective] = useState(""),
    [source, setSource] = useState(""),
    [auditReason, setAuditReason] = useState(""),
    [expiry, setExpiry] = useState(""),
    [reconciliationKind, setReconciliationKind] = useState("backing");
  const pending = useRef<{ id: string; fingerprint: string } | null>(null),
    writing = useRef(false);
  useEffect(() => {
    let active = true;
    request(base + (admin ? "/funded-programs" : "/conversions/options"))
      .then((result) => {
        if (active) setData(result);
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
  }, [base, admin]);
  async function write(path: string, payload: Row) {
    if (!enabled || writing.current) return;
    const fingerprint = JSON.stringify({ path, payload });
    if (pending.current && pending.current.fingerprint !== fingerprint) {
      setError(
        "Reconcile or retry the existing request before changing its terms.",
      );
      return;
    }
    pending.current ??= { id: crypto.randomUUID(), fingerprint };
    writing.current = true;
    setBusy(true);
    setError("");
    try {
      const result = await request(base + path, {
        ...payload,
        requestId: pending.current.id,
      });
      setReceipt(result);
      pending.current = null;
      const updated = await request(
        base + (admin ? "/funded-programs" : "/conversions/options"),
      );
      setData(updated);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Outcome unconfirmed");
    } finally {
      writing.current = false;
      setBusy(false);
    }
  }
  async function reconcile() {
    if (!pending.current || writing.current) return;
    writing.current = true;
    setBusy(true);
    setError("");
    try {
      const result = await request(base + "/conversions/" + pending.current.id);
      setReceipt(result);
      pending.current = null;
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Receipt unavailable; retry the same request.",
      );
    } finally {
      writing.current = false;
      setBusy(false);
    }
  }
  const enabled = admin
      ? data?.enabled?.funding === true
      : data?.conversionEnabled === true,
    units = parseCfig(amount);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          {admin
            ? "Funded program allocations"
            : "Conditional funded conversion"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <p>
          Virtual $cfig, funded points and cash remain separate. Funding and
          launch require independent authorization; no guaranteed redeemable
          value.
        </p>
        {!data && !error && <p role="status">Loading funding status…</p>}
        {error && (
          <p role="alert" className="break-words">
            {error}
          </p>
        )}
        {data && !enabled && (
          <p>
            Funding or conversion is disabled. No monetary action is available.
          </p>
        )}
        {!admin && data && (
          <>
            <p>{data.notice}</p>
            {(data.cohorts ?? []).map((c: Row) => (
              <Button
                key={c.allocationId}
                variant="outline"
                className="h-auto min-h-11 w-full whitespace-normal text-left"
                disabled={!enabled || busy || !!pending.current}
                onClick={() => setCohort(c)}
              >
                {formatCfig(c.availableMicroCfig)} · {c.termsVersion} ·{" "}
                {c.cfigPerPoint} $cfig per funded point
              </Button>
            ))}
            {!data.cohorts?.length && (
              <p>No approved funded cohort is available.</p>
            )}
            {cohort && (
              <p className="break-all">
                Original policy {cohort.policyId}. Minimum {data.minimumPoints}{" "}
                point; monthly maximum {data.monthlyMaximumPoints} points.
                Capacity is rechecked at submission.
              </p>
            )}
            <label className="grid gap-1">
              $cfig to convert
              <Input
                inputMode="decimal"
                value={amount}
                disabled={!enabled || busy || !!pending.current}
                onChange={(e) => setAmount(e.target.value)}
              />
            </label>
            <Button
              className="min-h-11"
              disabled={!enabled || !cohort || !units || busy}
              onClick={() =>
                void write("/conversions", {
                  allocationId: cohort?.allocationId,
                  policyId: cohort?.policyId,
                  microCfig: units,
                })
              }
            >
              {busy
                ? "Processing…"
                : enabled
                  ? "Convert cleared $cfig"
                  : "Conversion unavailable"}
            </Button>
            {pending.current && (
              <>
                <p className="break-all">
                  Unconfirmed request: {pending.current.id}. Retry without
                  changing terms.
                </p>
                <Button
                  variant="outline"
                  className="min-h-11"
                  disabled={busy}
                  onClick={() => void reconcile()}
                >
                  Check conversion receipt
                </Button>
              </>
            )}
          </>
        )}
        {admin && data && (
          <>
            <details className="space-y-3 rounded-lg border p-3">
              <summary className="min-h-11 cursor-pointer font-medium">
                Reconcile an existing funding source or pending award
              </summary>
              <p>
                Two authorized reviewers attest an existing source. This creates
                evidence only; it cannot deposit money or issue points.
              </p>
              <div className="flex flex-wrap gap-2">
                {["backing", "clearance"].map((kind) => (
                  <Button
                    key={kind}
                    variant="outline"
                    className="min-h-11"
                    aria-pressed={reconciliationKind === kind}
                    disabled={!enabled || busy || !!pending.current}
                    onClick={() => setReconciliationKind(kind)}
                  >
                    {kind === "backing"
                      ? "Inbound fund ledger"
                      : "Original pending point lot"}
                  </Button>
                ))}
              </div>
              {[
                ["Existing source ledger ID", source, setSource],
                [
                  "Reason and independent evidence reference",
                  auditReason,
                  setAuditReason,
                ],
                [
                  "Evidence expiry (UTC ISO, within 30 days)",
                  expiry,
                  setExpiry,
                ],
              ].map(([title, value, update]) => (
                <label className="grid gap-1" key={String(title)}>
                  {String(title)}
                  <Input
                    value={String(value)}
                    disabled={!enabled || busy || !!pending.current}
                    onChange={(e) =>
                      (update as (value: string) => void)(e.target.value)
                    }
                  />
                </label>
              ))}
              <Button
                className="min-h-11"
                disabled={
                  !enabled || busy || !source || !auditReason || !expiry
                }
                onClick={() =>
                  void write("/reconciliations", {
                    kind: reconciliationKind,
                    sourceId: source,
                    reason: auditReason,
                    expiresAt: expiry,
                  })
                }
              >
                Prepare source reconciliation
              </Button>
            </details>
            {(data.reconciliations ?? []).map((r: Row) => (
              <article key={r.id} className="space-y-2 rounded-lg border p-3">
                <p className="break-all">
                  {r.kind} review {r.id}
                </p>
                <p className="break-all">
                  Source {r.source_id}; preparer {r.prepared_by}
                </p>
                {r.proof_id ? (
                  <p className="break-all">
                    Reconciled evidence ID: {r.proof_id}
                  </p>
                ) : (
                  <Button
                    className="min-h-11"
                    variant="outline"
                    disabled={!enabled || busy}
                    onClick={() =>
                      void write("/reconciliations/" + r.id + "/approve", {})
                    }
                  >
                    Approve source reconciliation independently
                  </Button>
                )}
              </article>
            ))}
            <p>
              Proposals reserve no money. Independent approval can reserve
              existing reconciled backing above the safety floor.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["Backing receipt ID", proof, setProof],
                ["Allocation (USD cents)", amount, setAmount],
                ["Original House policy ID", policy, setPolicy],
                ["Approved cohort $cfig per point", rate, setRate],
                [
                  "Prospective effective date (UTC ISO)",
                  effective,
                  setEffective,
                ],
              ].map(([title, value, update]) => (
                <label className="grid gap-1" key={String(title)}>
                  {String(title)}
                  <Input
                    value={String(value)}
                    disabled={!enabled || busy || !!pending.current}
                    onChange={(e) =>
                      (update as (value: string) => void)(e.target.value)
                    }
                  />
                </label>
              ))}
            </div>
            <Button
              className="min-h-11"
              disabled={
                !enabled ||
                busy ||
                !proof ||
                !policy ||
                !rate ||
                !effective ||
                !/^[1-9][0-9]*$/.test(amount)
              }
              onClick={() =>
                void write("/reserve/allocations", {
                  program: "house_conversion",
                  proofId: proof,
                  amountCents: amount,
                  housePolicyId: policy,
                  cfigPerPoint: rate,
                  effectiveFrom: effective,
                })
              }
            >
              Propose backed allocation
            </Button>
            {(data.allocations ?? []).map((a: Row) => (
              <article key={a.id} className="space-y-2 rounded-lg border p-3">
                <p className="break-all">
                  {a.id} · {a.program}
                </p>
                <p>
                  {String(a.amount_cents)} USD cents ·{" "}
                  {a.approved_at ? "Approved" : "Awaiting independent approval"}
                </p>
                <p className="break-all">
                  Original cohort{" "}
                  {a.policy_snapshot?.housePolicyId ?? "Paid campaign rules"};
                  rate {a.policy_snapshot?.cfigPerPoint ?? "canonical CPC/CPM"};
                  effective {a.policy_snapshot?.effectiveFrom}
                </p>
                <Button
                  className="min-h-11"
                  variant="outline"
                  disabled={!enabled || busy || !!a.approved_at}
                  onClick={() =>
                    void write("/reserve/allocations/" + a.id + "/approve", {})
                  }
                >
                  Approve allocation independently
                </Button>
              </article>
            ))}
            {!(data.allocations ?? []).length && (
              <p>No funded program allocations recorded.</p>
            )}
            <p>{(data.issues ?? []).length} recent immutable issue receipts.</p>
          </>
        )}
        {receipt && (
          <div role="status" className="space-y-1 rounded-lg border p-3">
            <p className="break-all">
              Recorded reference: {receipt.id ?? receipt.requestId}
            </p>
            {receipt.points && (
              <p>
                {receipt.points} funded points issued ·{" "}
                {formatCfig(receipt.debitedMicroCfig)} debited ·{" "}
                {formatCfig(receipt.residualMicroCfig)} request residual.
              </p>
            )}
            {receipt.status && <p>{receipt.status}</p>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
