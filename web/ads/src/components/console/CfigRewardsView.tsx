"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { sessionFetch } from "@/lib/session";
import { formatCfig } from "@/lib/cfig-format";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Input,
  Badge,
} from "../ui";
type Mode = "promoter" | "admin" | "policies" | "reserve";
type Row = Record<string, any>;
async function read(path: string, options?: RequestInit) {
  const res = await sessionFetch("/api/v1/" + path, options);
  const body = await res.json().catch(() => null);
  if (!res.ok || !body || body.data === undefined)
    throw new Error(body?.message || `Rewards unavailable (${res.status})`);
  return body.data;
}
const label = "grid gap-1 text-sm",
  action = "min-h-11";
export function CfigRewardsView({ mode }: { mode: Mode }) {
  const admin = mode !== "promoter",
    base = admin ? "admin/rewards/cfig" : "promoter/rewards/cfig";
  const [data, setData] = useState<Row | null>(null),
    [history, setHistory] = useState<Row | null>(null),
    [allocations, setAllocations] = useState<Row | null>(null),
    [policies, setPolicies] = useState<Row[]>([]),
    [reviews, setReviews] = useState<Row | null>(null),
    [finals, setFinals] = useState<Row[]>([]),
    [badges, setBadges] = useState<Row | null>(null),
    [reserve, setReserve] = useState<Row | null>(null);
  const [loading, setLoading] = useState(true),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [message, setMessage] = useState(""),
    [page, setPage] = useState(1),
    [selected, setSelected] = useState(""),
    [detail, setDetail] = useState<Row | null>(null),
    [detailError, setDetailError] = useState(""),
    [reason, setReason] = useState(""),
    [clickAudit, setClickAudit] = useState(false),
    [effective, setEffective] = useState(""),
    [day, setDay] = useState("");
  const generation = useRef(0),
    writing = useRef(false),
    pending = useRef<{ fingerprint: string; requestId: string } | null>(null);
  const load = useCallback(async () => {
    const current = ++generation.current;
    setLoading(true);
    setError("");
    try {
      const [
        summary,
        movements,
        allocated,
        policyRows,
        reviewRows,
        closed,
        progress,
        fund,
      ] = await Promise.all([
        read(base + (admin ? "/summary" : "")),
        read(base + "/transactions?page=" + page),
        read(base + "/allocations?page=" + page),
        admin ? read(base + "/policies") : Promise.resolve([]),
        mode === "admin"
          ? read(base + "/reviews?page=" + page)
          : Promise.resolve(null),
        mode === "admin" ? read(base + "/finalizations") : Promise.resolve([]),
        !admin ? read(base + "/badges") : Promise.resolve(null),
        mode === "reserve"
          ? read(base + "/reserve/allocations")
          : Promise.resolve(null),
      ]);
      if (current !== generation.current) return;
      setData(summary);
      setHistory(movements);
      setAllocations(allocated);
      setPolicies(policyRows);
      setReviews(reviewRows);
      setFinals(closed);
      setBadges(progress);
      setReserve(fund);
    } catch (e) {
      if (current !== generation.current) return;
      setData(null);
      setHistory(null);
      setAllocations(null);
      setReviews(null);
      setPolicies([]);
      setFinals([]);
      setBadges(null);
      setReserve(null);
      setError(e instanceof Error ? e.message : "Rewards unavailable");
    } finally {
      if (current === generation.current) setLoading(false);
    }
  }, [base, admin, mode, page]);
  useEffect(() => {
    void load();
    return () => {
      generation.current++;
    };
  }, [load]);
  useEffect(() => {
    let active = true;
    setDetail(null);
    setDetailError("");
    if (mode === "admin" && selected)
      read(base + "/reviews/" + selected)
        .then((d) => {
          if (active) setDetail(d);
        })
        .catch((e) => {
          if (active)
            setDetailError(
              e instanceof Error ? e.message : "Evidence unavailable",
            );
        });
    return () => {
      active = false;
    };
  }, [base, mode, selected]);
  async function write(path: string, payload: Row) {
    if (writing.current) return;
    writing.current = true;
    setBusy(true);
    setMessage("");
    setError("");
    const fingerprint = JSON.stringify({ path, payload });
    if (pending.current?.fingerprint !== fingerprint)
      pending.current = { fingerprint, requestId: crypto.randomUUID() };
    try {
      const result = await read(base + path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          requestId: pending.current.requestId,
        }),
      });
      pending.current = null;
      setMessage(
        result?.status === "reviewed_not_allocated"
          ? "Eligibility review recorded. No reward is allocated until the UTC day is finalized."
          : "Action recorded.",
      );
      setSelected("");
      setReason("");
      setClickAudit(false);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Action unavailable");
    } finally {
      writing.current = false;
      setBusy(false);
    }
  }
  const policy = data?.housePolicy;
  return (
    <div className="mx-auto max-w-6xl space-y-5 p-4 md:p-6">
      <header className="flex flex-wrap justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide">
            House Ad rewards
          </p>
          <h1 className="text-xl font-semibold md:text-2xl">
            {mode === "policies"
              ? "Reward policy history"
              : mode === "reserve"
                ? "Conversion funding status"
                : admin
                  ? "Allocation & audit console"
                  : "Your virtual $cfig"}
          </h1>
          <p className="mt-2 max-w-3xl text-sm">
            $cfig is a virtual promotional unit, separate from cash and funded
            $fig points, with no guaranteed redeemable value.
          </p>
        </div>
        <Button
          className={action}
          variant="outline"
          disabled={loading || busy}
          onClick={() => void load()}
        >
          Refresh
        </Button>
      </header>
      {admin && (
        <nav
          aria-label="Rewards sections"
          className="flex flex-wrap gap-4 text-sm"
        >
          <Link className="underline" href="/admin/rewards/cfig">
            Review & finalization
          </Link>
          <Link className="underline" href="/admin/rewards/cfig/policies">
            Policies
          </Link>
          <Link className="underline" href="/admin/rewards/cfig/reserve">
            Funding status
          </Link>
        </nav>
      )}
      <Card>
        <CardContent className="space-y-2 pt-5">
          <Badge>
            {!data
              ? "Earning status unavailable"
              : data.earningEnabled
                ? "Activation gates enabled; eligibility still required"
                : "Earning disabled"}
          </Badge>
          <p className="text-sm">
            Only suitability-approved websites with verified, unexpired
            ownership at serve time may earn. TESTING websites earn zero $cfig;
            DNS verification alone does not grant approval.
          </p>
          <p className="text-sm">
            {policy ? (
              <>
                Eligible House views:{" "}
                {formatCfig(
                  (1000000n / BigInt(policy.impressionsPerCfig)).toString(),
                )}
                ; independently audited clicks:{" "}
                {formatCfig(
                  (1000000n / BigInt(policy.clicksPerCfig)).toString(),
                )}
                .{" "}
              </>
            ) : null}
            Limits span every approved website and both streams.
          </p>
          <p className="text-sm">
            Events belong to their original UTC serve day. Receipt and
            validation close 72 hours after that day ends; availability also
            requires independent fraud clearance. Late or unresolved events do
            not move to the next day.
          </p>
          <Button className={action} disabled>
            Conversion unavailable
          </Button>
          <p className="text-xs">
            Production activation, funding and conversion require separate
            authorization.
          </p>
        </CardContent>
      </Card>
      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-400 p-3 text-sm"
        >
          {error}
        </div>
      )}
      {message && (
        <p role="status" aria-atomic="true" className="text-sm">
          {message}
        </p>
      )}
      {loading && <p role="status">Loading rewards…</p>}
      {data && !loading && (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {["pending", "available", "invalid", "converted"].map((key) => (
              <Card key={key}>
                <CardHeader>
                  <CardDescription className="capitalize">
                    {key}
                  </CardDescription>
                  <CardTitle className="text-lg">
                    {formatCfig(data.balances[key])}
                  </CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
          {policy && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Policy limits</CardTitle>
                <CardDescription>
                  {policy.policyVersion} · applies prospectively after approved
                  activation
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2 text-sm sm:grid-cols-2">
                <p>Approved daily: {policy.dailyCapApprovedCfig} $cfig</p>
                <p>TESTING: zero $cfig</p>
                <p>
                  Monthly per promoter: {policy.monthlyCapPerPromoterCfig} $cfig
                </p>
                <p>
                  Platform monthly planning budget:{" "}
                  {policy.monthlyBudgetUsdCents} USD cents
                </p>
                <p>
                  Outstanding planning ceiling: {policy.maxOutstandingUsdCents}{" "}
                  USD cents
                </p>
                <p>1 $cfig = 1,000,000 integer micro-cfig</p>
              </CardContent>
            </Card>
          )}
        </>
      )}
      {mode === "admin" && finals[0] && !loading && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Latest finalized exposure
            </CardTitle>
            <CardDescription>
              As of serve day {finals[0].day}; these are finalized virtual
              allocations, not cash backing or live request totals.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm sm:grid-cols-2">
            <p>
              Month allocated: {formatCfig(finals[0].snapshot.globalMonthAfter)}
            </p>
            <p>
              Outstanding at allocation:{" "}
              {formatCfig(finals[0].snapshot.outstandingAfter)}
            </p>
            <p>Receipt/validation cutoff: {finals[0].snapshot.cutoff}</p>
            <p>Candidates: {finals[0].snapshot.candidateCount}</p>
          </CardContent>
        </Card>
      )}
      {mode === "policies" && !loading && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Propose canonical policy snapshot
              </CardTitle>
              <CardDescription>
                Rates and budgets come from versioned canonical financial
                configuration, never per-request overrides. Activation is
                separate. Effective dates must be future UTC midnight to keep
                daily snapshots unambiguous.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                className="grid gap-3 sm:grid-cols-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (policy)
                    void write("/policies", {
                      terms: {
                        version: policy.policyVersion,
                        termsVersion: policy.policyVersion,
                        effectiveFrom: effective,
                      },
                      reason,
                    });
                }}
              >
                <label className={label}>
                  Effective UTC timestamp
                  <Input
                    required
                    placeholder="YYYY-MM-DDT00:00:00Z"
                    value={effective}
                    onChange={(e) => setEffective(e.target.value)}
                  />
                </label>
                <label className={label}>
                  Proposal reason
                  <Input
                    required
                    minLength={3}
                    maxLength={500}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </label>
                <Button
                  className={action}
                  type="submit"
                  disabled={busy || !policy}
                >
                  Propose snapshot
                </Button>
              </form>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Policy history</CardTitle>
              <CardDescription>
                Most recent 100 versions. Independent approval never bypasses
                activation gates.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {policies.length === 0 ? (
                <p>No policies proposed.</p>
              ) : (
                policies.map((p) => (
                  <article
                    key={p.id}
                    className="space-y-2 rounded-lg border p-3 text-sm"
                  >
                    <h2 className="font-semibold">
                      {p.terms.version} ·{" "}
                      {p.approved_at
                        ? "Approved"
                        : "Awaiting independent approval"}
                    </h2>
                    <p className="break-all">{p.id}</p>
                    <p>Effective: {p.terms.effectiveFrom}</p>
                    <details>
                      <summary className="cursor-pointer">
                        View immutable terms
                      </summary>
                      <pre className="whitespace-pre-wrap break-all text-xs">
                        {JSON.stringify(p.terms, null, 2)}
                      </pre>
                    </details>
                    {!p.approved_at && (
                      <Button
                        className={action}
                        variant="outline"
                        onClick={() => {
                          setSelected(p.id);
                          setReason("");
                        }}
                      >
                        Review approval
                      </Button>
                    )}
                  </article>
                ))
              )}
            </CardContent>
          </Card>
          {selected && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Independent policy approval
                </CardTitle>
                <CardDescription>
                  {selected}. Proposer cannot approve their own terms.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  className="space-y-3"
                  onSubmit={(e) => {
                    e.preventDefault();
                    void write("/policies/" + selected + "/approve", {
                      reason,
                    });
                  }}
                >
                  <label className={label}>
                    Reason
                    <Input
                      required
                      minLength={3}
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                    />
                  </label>
                  <Button className={action} disabled={busy}>
                    Approve these terms
                  </Button>{" "}
                  <Button
                    className={action}
                    type="button"
                    variant="outline"
                    disabled={busy}
                    onClick={() => setSelected("")}
                  >
                    Cancel
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </>
      )}
      {mode === "admin" && reviews && !loading && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Eligibility reviews</CardTitle>
              <CardDescription>
                Manual signed reviews do not credit balances. Only timely
                validated events enter deterministic day finalization.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {reviews.items.length === 0 ? (
                <p>No House candidates.</p>
              ) : (
                reviews.items.map((r: Row) => (
                  <article
                    key={r.event_id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3 text-sm"
                  >
                    <div className="min-w-0">
                      <button
                        className="break-all text-left font-medium underline"
                        onClick={() => {
                          setSelected(r.event_id);
                          setReason("");
                          setClickAudit(false);
                        }}
                      >
                        Event {r.event_id}
                      </button>
                      <p>
                        {r.type} · Website at serve:{" "}
                        {r.website_policy_at_serve || "Unknown"}
                      </p>
                      <p>
                        Review: {r.eligibility_review || "Unreviewed"} ·{" "}
                        {r.finalization_state}
                      </p>
                    </div>
                    <Button
                      className={action}
                      variant="outline"
                      onClick={() => {
                        setSelected(r.event_id);
                        setReason("");
                        setClickAudit(false);
                      }}
                    >
                      View details / Review
                    </Button>
                  </article>
                ))
              )}
            </CardContent>
          </Card>
          {selected && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Evidence & reward decision
                </CardTitle>
                <CardDescription>
                  Decisions preserve original evidence. Clearance requires a
                  different reviewer after finalization and the minimum hold.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {detailError && <p role="alert">{detailError}</p>}
                {!detail && !detailError && (
                  <p role="status">Loading evidence…</p>
                )}
                {detail && (
                  <>
                    <p className="text-sm">{detail.reason}</p>
                    <dl className="grid gap-1 text-sm">
                      {Object.entries(detail.item).map(([k, v]) => (
                        <div className="break-all" key={k}>
                          <dt className="inline font-medium">
                            {k.replaceAll("_", " ")}:{" "}
                          </dt>
                          <dd className="inline">
                            {v == null
                              ? "Unknown"
                              : typeof v === "object"
                                ? JSON.stringify(v)
                                : String(v)}
                          </dd>
                        </div>
                      ))}
                    </dl>
                    <details>
                      <summary className="cursor-pointer text-sm">
                        Review and movement history
                      </summary>
                      <pre className="whitespace-pre-wrap break-all text-xs">
                        {JSON.stringify(
                          {
                            reviews: detail.reviews,
                            movements: detail.movements,
                          },
                          null,
                          2,
                        )}
                      </pre>
                    </details>
                  </>
                )}
                <label className={label}>
                  Audit reason
                  <Input
                    minLength={3}
                    maxLength={500}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </label>
                {detail?.item.type === "click" && (
                  <label className="flex items-start gap-2 text-sm">
                    <input
                      type="checkbox"
                      className="mt-1 h-5 w-5"
                      checked={clickAudit}
                      onChange={(e) => setClickAudit(e.target.checked)}
                    />
                    I independently checked self-click and invalid-traffic
                    evidence. A browser click alone is not eligibility proof.
                  </label>
                )}
                <div className="flex flex-wrap gap-2">
                  {["accrue", "reject", "clear", "invalidate"].map((choice) => (
                    <Button
                      className={action}
                      key={choice}
                      variant={choice === "accrue" ? "default" : "outline"}
                      disabled={
                        busy ||
                        !detail ||
                        reason.trim().length < 3 ||
                        (choice === "accrue" &&
                          (!data?.earningEnabled ||
                            !detail.evidenceChecksPassed ||
                            (detail.item.type === "click" && !clickAudit)))
                      }
                      onClick={() =>
                        void write("/reviews/" + selected + "/decision", {
                          action: choice,
                          reason,
                          clickAudit,
                        })
                      }
                    >
                      {choice === "accrue"
                        ? "Record eligible review"
                        : choice === "reject"
                          ? "Reject eligibility"
                          : choice === "clear"
                            ? "Clear finalized reward"
                            : "Invalidate reward"}
                    </Button>
                  ))}
                  <Button
                    className={action}
                    variant="outline"
                    disabled={busy}
                    onClick={() => setSelected("")}
                  >
                    Close
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Chronological UTC finalization
              </CardTitle>
              <CardDescription>
                Close the earliest unclosed day only after its
                receipt/validation deadline. One transaction freezes candidates,
                budget and allocations. Closed periods cannot reopen.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form
                className="grid gap-3 sm:grid-cols-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  void write("/finalizations/" + day, { reason });
                }}
              >
                <label className={label}>
                  Original UTC serve day
                  <Input
                    type="date"
                    required
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                  />
                </label>
                <label className={label}>
                  Finalization reason
                  <Input
                    required
                    minLength={3}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </label>
                <Button
                  className={action}
                  disabled={busy || !data?.earningEnabled}
                >
                  Finalize reviewed day
                </Button>
              </form>
              {finals.length === 0 ? (
                <p>No finalized days.</p>
              ) : (
                finals.map((f) => (
                  <details key={f.day} className="rounded-lg border p-3">
                    <summary className="cursor-pointer text-sm">
                      {f.day} · {formatCfig(f.snapshot.allocated)} allocated
                    </summary>
                    <pre className="whitespace-pre-wrap break-all text-xs">
                      {JSON.stringify(f.snapshot, null, 2)}
                    </pre>
                  </details>
                ))
              )}
            </CardContent>
          </Card>
        </>
      )}
      {badges && !loading && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              House prestige achievements
            </CardTitle>
            <CardDescription>
              Approved, qualified House progress continues when monetary caps
              stop earning. House editions award no funded points. Counts
              reflect finalized qualification; later reviews remain auditable.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            {[
              ["houseImpressions", "House Impression"],
              ["houseClicks", "House Click"],
            ].map(([key, name]) => (
              <section key={key}>
                <h2 className="font-medium">{name} Edition</h2>
                <p className="text-sm">
                  {badges[key].progress} finalized qualifying events
                </p>
                <ol className="mt-2 grid gap-1 text-sm">
                  {badges[key].thresholds.map(
                    (threshold: number, index: number) => (
                      <li key={threshold}>
                        Tier {index + 1}: {threshold.toLocaleString()} ·{" "}
                        {BigInt(badges[key].progress) >= BigInt(threshold)
                          ? "Achieved"
                          : "In progress"}
                      </li>
                    ),
                  )}
                </ol>
              </section>
            ))}
          </CardContent>
        </Card>
      )}
      {badges &&
        Array.isArray(badges.achievements) &&
        badges.achievements.length > 0 &&
        !loading && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Award history</CardTitle>
              <CardDescription>
                Recorded House prestige awards remain visible across prospective
                threshold changes. Dates are the qualifying UTC allocation
                cutoff, not a cash credit.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {badges.achievements.map((a: Row) => (
                <p key={a.badge_key} className="text-sm">
                  {a.badge_title} · {new Date(a.achieved_at).toISOString()} · No
                  funded-point bonus
                </p>
              ))}
            </CardContent>
          </Card>
        )}
      {allocations && !loading && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Finalized event allocations
            </CardTitle>
            <CardDescription>
              Entitlements may be partially allocated. TESTING, late and
              incomplete events earn zero; badge qualification is separate from
              monetary caps.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {allocations.items.length === 0 ? (
              <p>No finalized allocations.</p>
            ) : (
              allocations.items.map((r: Row) => (
                <article
                  key={r.event_id}
                  className="rounded-lg border p-3 text-sm"
                >
                  <p className="break-all">
                    {r.day} · {r.event_id}
                  </p>
                  <p>
                    {r.metric} · {r.outcome}
                  </p>
                  <p>
                    Entitled: {formatCfig(r.entitled)} · Allocated:{" "}
                    {formatCfig(r.allocated)}
                  </p>
                  <p>
                    House badge qualification: {r.badge_eligible ? "Yes" : "No"}
                  </p>
                </article>
              ))
            )}
          </CardContent>
        </Card>
      )}
      {mode === "reserve" && reserve && !loading && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Existing Rewards Fund — no conversion allocation
            </CardTitle>
            <CardDescription>{reserve.status}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm">
              Planning exposure budgets are not cash backing. Existing fund
              assets are not a $cfig redemption promise.
            </p>
            {reserve.existingRewardsFund ? (
              <dl className="grid gap-2 text-sm">
                {Object.entries(reserve.existingRewardsFund).map(
                  ([key, value]) => (
                    <div
                      className="flex flex-wrap justify-between gap-2"
                      key={key}
                    >
                      <dt>{key.replaceAll("_", " ")}</dt>
                      <dd>
                        {String(value)} {key === "currency" ? "" : "USD cents"}
                      </dd>
                    </div>
                  ),
                )}
              </dl>
            ) : (
              <p>Fund backing unavailable; no funding assumed.</p>
            )}
            <Button className={action} disabled>
              Allocation requires separate authorization
            </Button>
          </CardContent>
        </Card>
      )}
      {history && !loading && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Virtual movement history
            </CardTitle>
            <CardDescription>
              Pending, cleared and compensating movements reconcile in
              micro-cfig; these are not cash earnings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {history.items.length === 0 ? (
              <p>No virtual movements recorded.</p>
            ) : (
              history.items.map((r: Row) => (
                <article
                  key={r.id}
                  className="space-y-1 rounded-lg border p-3 text-sm"
                >
                  <p>
                    {r.kind} · {new Date(r.created_at).toLocaleString()}
                  </p>
                  <p className="break-all">Reference {r.id}</p>
                  <p>{r.reason}</p>
                  <p>
                    Pending Δ {r.pending_delta} · Available Δ{" "}
                    {r.available_delta} · Invalid Δ {r.invalid_delta}
                  </p>
                </article>
              ))
            )}
            <div className="flex flex-wrap items-center gap-3">
              <Button
                className={action}
                variant="outline"
                disabled={busy || page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <span>Page {page}</span>
              <Button
                className={action}
                variant="outline"
                disabled={
                  busy ||
                  !(history.hasNext || allocations?.hasNext || reviews?.hasNext)
                }
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
