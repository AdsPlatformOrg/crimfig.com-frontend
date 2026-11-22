"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Award, Coins, Sparkles } from "lucide-react";
import { sessionFetch } from "@/lib/session";
import { loadWebsites } from "@/lib/campaigns-api";
import { formatCfig } from "@/lib/cfig-format";
import { ecosystemOrigin } from "../../../../../shared/ui/origins";
import { Button, Card, CardContent, CardHeader, CardTitle } from "../ui";
import { CfigFundedControls } from "./CfigFundedControls";
import styles from "./PromoterRewards.module.css";

type PromoSummary = {
  earningEnabled: boolean;
  balances: { pending: string; available: string };
  housePolicy?: { impressionsPerCfig: number; clicksPerCfig: number; dailyCapApprovedCfig: number; monthlyCapPerPromoterCfig: number };
};
type Progress = { progress: string; thresholds: number[] };
type PromoBadges = {
  houseImpressions: Progress;
  houseClicks: Progress;
  achievements: { badge_key: string; badge_title: string; achieved_at?: string }[];
};
type Points = {
  availablePoints: number;
  pendingPoints: number;
  paidEarningEnabled?: boolean;
  isSuspended: boolean;
  badges: { id: string; badgeTitle: string }[];
  recentLedger: { id: string; deltaPoints: number; state: string; createdAt: string }[];
};
type PromoLedger = {
  items: { id: string; kind: string; available_delta: string; created_at: string }[];
};
type Data = {
  websites: Awaited<ReturnType<typeof loadWebsites>> | null;
  promo: PromoSummary | null;
  points: Points | null;
  badges: PromoBadges | null;
  ledger: PromoLedger | null;
};

async function request<T>(path: string, envelope = true): Promise<T> {
  const response = await sessionFetch(path);
  if (!response.ok) throw new Error("Rewards unavailable");
  const body = await response.json();
  return envelope ? body.data : body;
}

const promoPath = "/api/v1/promoter/rewards/cfig";
const value = <T,>(result: PromiseSettledResult<T>) => result.status === "fulfilled" ? result.value : null;
const pointText = (count: number | undefined) => Number.isSafeInteger(count) ? count!.toLocaleString() : "Unavailable";
const dateText = (date: string) => new Date(date).toLocaleDateString();

export function PromoterRewards() {
  const [revision, setRevision] = useState(0);
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [announcement, setAnnouncement] = useState("");
  const seenAwards = useRef(new Map<string, Set<string>>());
  const billing = ecosystemOrigin("billing", process.env.NEXT_PUBLIC_BILLING_WEB_URL);

  useEffect(() => {
    let current = true;
    const record = (source: string, ids: string[] | undefined) => {
      if (!ids) return false;
      const previous = seenAwards.current.get(source);
      const added = previous && ids.some(id => !previous.has(id));
      seenAwards.current.set(source, new Set([...(previous ?? []), ...ids]));
      return Boolean(added);
    };
    void Promise.allSettled([
      loadWebsites(),
      request<PromoSummary>(promoPath),
      request<Points>("/api/v1/ads/billing/rewards/me", false),
      request<PromoBadges>(promoPath + "/badges"),
      request<PromoLedger>(promoPath + "/transactions?page=1"),
    ]).then(([websites, promo, points, badges, ledger]) => {
      if (!current) return;
      const next = { websites: value(websites), promo: value(promo), points: value(points), badges: value(badges), ledger: value(ledger) };
      const newPointsBadge = record("points-badge", next.points?.badges?.map(item => item.id));
      const newPromoBadge = record("promo-badge", next.badges?.achievements?.map(item => item.badge_key));
      const newPoints = record("points-credit", next.points?.recentLedger?.filter(item =>
        item.state === "available" && Number.isSafeInteger(item.deltaPoints) && item.deltaPoints > 0,
      ).map(item => item.id));
      const newCfig = record("promo-credit", next.ledger?.items?.filter(item =>
        item.kind === "clear" && typeof item.available_delta === "string" &&
        /^\d+$/.test(item.available_delta) && BigInt(item.available_delta) > 0n,
      ).map(item => item.id));
      if (newPointsBadge || newPromoBadge || newPoints || newCfig) {
        setAnnouncement([
          newPointsBadge || newPromoBadge ? "You unlocked a new badge." : "",
          newPoints ? "New Redeemable Points are available." : "",
          newCfig ? "New virtual $cfig is available." : "",
        ].filter(Boolean).join(" "));
      }
      setData(next);
      setLoading(false);
    });
    return () => { current = false; };
  }, [revision]);

  const sites = data?.websites;
  const eligible = sites?.filter(site => site.isActive !== false && !site.isSuspended && site.policyStatus !== "suspended") ?? [];
  const verified = eligible.filter(site => site.isVerified);
  const approved = verified.some(site => site.policyStatus === "approved");
  const awaiting = verified.some(site => site.policyStatus === "pending_approval");
  const pendingStatus = loading ? "Checking…" : "Unavailable";
  const promoStatus = data?.promo?.earningEnabled === true ? "Program enabled" : data?.promo?.earningEnabled === false ? "Earning paused" : pendingStatus;
  const pointsStatus = data?.points?.isSuspended ? "Account suspended" : data?.points?.paidEarningEnabled === true
    ? "Program enabled" : data?.points?.paidEarningEnabled === false ? "Earning paused" : pendingStatus;
  const policy = data?.promo?.housePolicy;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1>Earn Points &amp; $cfig</h1>
          <p>Track Redeemable Points from eligible paid activity and virtual $cfig from CrimFig Promo Ads.</p>
        </div>
        <Button variant="outline" disabled={loading} onClick={() => {
          setAnnouncement("");
          setLoading(true);
          setRevision(value => value + 1);
        }}>{loading ? "Refreshing…" : "Refresh"}</Button>
      </header>
      <div role="status" aria-atomic="true">{announcement && <p className={styles.celebration}>✦ {announcement}</p>}</div>
      <div className={styles.grid} aria-busy={loading}>
        <Card><CardHeader><CardTitle><Coins size={17} aria-hidden="true" /> Redeemable Points</CardTitle></CardHeader>
          <CardContent>
            <p>{pointsStatus}</p>
            <dl className={styles.balances}><div><dt>Available</dt><dd>{pointText(data?.points?.availablePoints)}</dd></div><div><dt>Pending</dt><dd>{pointText(data?.points?.pendingPoints)}</dd></div></dl>
            <a href={new URL("/rewards", billing).href}>View points and redemption</a>
          </CardContent>
        </Card>
        <Card><CardHeader><CardTitle><Sparkles size={17} aria-hidden="true" /> Virtual $cfig</CardTitle></CardHeader>
          <CardContent>
            <p>{promoStatus}</p>
            <dl className={styles.balances}><div><dt>Available</dt><dd>{formatCfig(data?.promo?.balances?.available)}</dd></div><div><dt>Pending</dt><dd>{formatCfig(data?.promo?.balances?.pending)}</dd></div></dl>
            <p>$cfig is promotional and has no guaranteed cash value.</p>
          </CardContent>
        </Card>
      </div>
      <Card><CardHeader><CardTitle>Earning checklist</CardTitle></CardHeader>
        <CardContent>
          <h3>Website setup for promo ads</h3>
          <ul className={styles.checklist}>
            <li><span>Add a website</span><strong>{sites ? sites.length ? "Complete" : "Action needed" : pendingStatus}</strong>{sites && !sites.length && <Link href="/promoter/websites?action=new">Add website</Link>}</li>
            <li><span>Verify website ownership</span><strong>{sites ? verified.length ? "Complete" : "Action needed" : pendingStatus}</strong>{sites && !verified.length && <Link href="/promoter/websites">Manage websites</Link>}</li>
            <li><span>Get suitability approval</span><strong>{sites ? approved ? "Complete" : awaiting ? "Awaiting review" : "Action needed" : pendingStatus}</strong>{sites && !approved && <Link href="/promoter/websites">Check website status</Link>}</li>
          </ul>
          <p>Promo ad activity is checked automatically. Eligibility depends on website approval and current ownership when the ad was served.</p>
          <h3>Paid activity for Redeemable Points</h3>
          <p>Eligible paid ad views and clicks are checked automatically. Points become available after the activity clears.</p>
        </CardContent>
      </Card>
      <div className={styles.grid}>
        <Milestone title="Ad view milestones" progress={data?.badges?.houseImpressions} />
        <Milestone title="Ad click milestones" progress={data?.badges?.houseClicks} />
      </div>
      {!!(data?.badges?.achievements?.length || data?.points?.badges?.length) && (
        <Card><CardHeader><CardTitle>Earned badges</CardTitle></CardHeader>
          <CardContent className={styles.grid}>
            <section><h3>Redeemable Points</h3><ul>{data?.points?.badges?.map(item =>
              <li key={item.id}><Award size={14} aria-hidden="true" /> {item.badgeTitle}</li>)}</ul></section>
            <section><h3>Promo ads</h3><ul>{data?.badges?.achievements?.map(item =>
              <li key={item.badge_key}><Award size={14} aria-hidden="true" /> {item.badge_title.replace(/\bHouse\b/gi, "Promo")}{item.achieved_at && <> · <time dateTime={item.achieved_at}>{dateText(item.achieved_at)}</time></>}</li>)}</ul></section>
          </CardContent>
        </Card>
      )}
      <Card><CardHeader><CardTitle>Recent activity</CardTitle></CardHeader>
        <CardContent className={styles.grid}>
          <section><h3>Redeemable Points</h3>
            {data?.points?.recentLedger ? data.points.recentLedger.length ? <ul>{data.points.recentLedger.slice(0, 5).map(item => <li key={item.id}>{dateText(item.createdAt)} · {item.deltaPoints.toLocaleString()} points · {item.state}</li>)}</ul> : <p>No points activity yet.</p> : <p>{pendingStatus}</p>}
          </section>
          <section><h3>Virtual $cfig</h3>
            {data?.ledger?.items ? data.ledger.items.length ? <ul>{data.ledger.items.slice(0, 5).map(item => <li key={item.id}>{dateText(item.created_at)} · {item.kind.replaceAll("_", " ")}{typeof item.available_delta === "string" && /^-?\d+$/.test(item.available_delta) && BigInt(item.available_delta) !== 0n ? " · " + (item.available_delta.startsWith("-") ? "−" : "+") + formatCfig(item.available_delta.replace(/^-/, "")) : ""}</li>)}</ul> : <p>No $cfig activity yet.</p> : <p>{pendingStatus}</p>}
          </section>
        </CardContent>
      </Card>
      <details className={styles.details}><summary>Program details and conversion</summary>
        {policy && <p>Earn 1 $cfig per {policy.impressionsPerCfig.toLocaleString()} qualifying promo ad views or {policy.clicksPerCfig.toLocaleString()} qualifying clicks, up to {policy.dailyCapApprovedCfig} daily and {policy.monthlyCapPerPromoterCfig} monthly.</p>}
        <CfigFundedControls mode="promoter" />
      </details>
    </div>
  );
}

function Milestone({ title, progress }: { title: string; progress?: Progress }) {
  const count = progress && /^\d+$/.test(String(progress.progress)) ? BigInt(progress.progress) : null;
  const next = count === null ? undefined : progress?.thresholds?.find(threshold => BigInt(threshold) > count);
  return <Card><CardHeader><CardTitle><Award size={17} aria-hidden="true" /> {title}</CardTitle></CardHeader>
    <CardContent>
      {count === null ? <p>Progress unavailable</p> : <>
        <p><strong>{count.toLocaleString()}</strong>{next === undefined ? " · All milestones reached" : ` of ${next.toLocaleString()} to the next badge`}</p>
        {next !== undefined && <progress aria-label={title} value={Number(count)} max={next} />}
        <details><summary>All milestones</summary><ul>{progress?.thresholds.map(threshold => <li key={threshold}>{threshold.toLocaleString()} · {count >= BigInt(threshold) ? "Reached" : "In progress"}</li>)}</ul></details>
      </>}
    </CardContent>
  </Card>;
}
