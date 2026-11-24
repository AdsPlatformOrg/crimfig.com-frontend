'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRightLeft, Bell, Power, ShieldCheck } from 'lucide-react';
import { sessionFetch } from '@/lib/session';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
} from '../ui';

interface SwitchRow {
  key: string;
  enabled: boolean;
  isLockedOff: boolean;
  label: string;
  description: string;
  updatedAt: string;
}

interface Overview {
  actorCapabilities?: {
    canManualSeedCommitment: boolean;
  };
  switches: SwitchRow[];
  switchAudit: {
    id: string;
    switchKey: string;
    previousEnabled: boolean;
    nextEnabled: boolean;
    reason: string;
    createdAt: string;
  }[];
  reserves: {
    promotionalAdReserve: {
      totalAllocatedCents: number;
      issuedBonusCreditsCents: number;
      consumedBonusCreditsCents: number;
      remainingPromoBudgetCents: number;
      reservedLiabilityCents: number;
      paidPromoterEarningsCents: number;
      transferableCents: number;
    } | null;
    rewardsFund: {
      cashBalanceUsdCents: number;
      availableUsdCents: number;
      allocatedUsdCents: number;
      fundedPendingUsdCents: number;
      spentUsdCents: number;
      reserveFloorUsdCents: number;
      transferableCents: number;
    } | null;
    platformOperatingReserve: {
      availableCents: number;
      transferableCents: number;
    } | null;
    cfigConversionReserve: {
      availableCents: number;
      reservedCents: number;
      spentCents: number;
      transferableCents: number;
    } | null;
  };
  transfers: {
    id: string;
    fromReserve: string;
    toReserve: string;
    amountCents: number;
    reason: string;
    createdAt: string;
  }[];
  alerts: {
    id: string;
    category: string;
    severity: string;
    summary: string;
    status: string;
    createdAt: string;
  }[];
}

const usd = (cents: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format((cents || 0) / 100);

const RESERVE_OPTIONS = [
  { value: 'rewards_fund_available', label: 'Rewards Fund (Redeemable Points)' },
  { value: 'cfig_conversion_reserve', label: '$cfig Conversion & Backing Pool' },
  { value: 'promotional_ad_reserve', label: 'Promotional Ad Reserve' },
  { value: 'platform_operating_reserve', label: 'Platform Operating Reserve' },
] as const;

const reserveLabel = (key: string) =>
  key === 'owner_seed_commitment'
    ? 'Owner Seed Commitment (Manual)'
    : RESERVE_OPTIONS.find(o => o.value === key)?.label ?? key;

export function AdminRewardsControlsView() {
  const [data, setData] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const [switchReasons, setSwitchReasons] = useState<Record<string, string>>({});

  const [fromReserve, setFromReserve] = useState<string>('platform_operating_reserve');
  const [toReserve, setToReserve] = useState<string>('promotional_ad_reserve');
  const [transferAmountUsd, setTransferAmountUsd] = useState<string>('');
  const [transferReason, setTransferReason] = useState<string>('');
  const pendingTransferId = useRef<string | null>(null);

  const [seedPool, setSeedPool] = useState<string>('rewards_fund_available');
  const [seedAmountUsd, setSeedAmountUsd] = useState<string>('200.00');
  const [seedRef, setSeedRef] = useState<string>('');
  const [seedReason, setSeedReason] = useState<string>('');
  const pendingSeedId = useRef<string | null>(null);

  const [proceedsAmountUsd, setProceedsAmountUsd] = useState<string>('');
  const [proceedsSourceRef, setProceedsSourceRef] = useState<string>('');
  const [proceedsReason, setProceedsReason] = useState<string>('');
  const pendingProceedsId = useRef<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await sessionFetch('/api/v1/admin/rewards/controls');
      const body = await res.json().catch(() => null);
      if (!res.ok || body?.status !== 'success' || !body?.data) {
        throw new Error(body?.message || `Failed to load controls (${res.status})`);
      }
      setData(body.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to load controls');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleToggle(sw: SwitchRow) {
    const reason = (switchReasons[sw.key] || '').trim() || `Platform Admin toggled ${sw.key} to ${!sw.enabled ? 'ON' : 'OFF'}`;
    if (reason.length < 3) {
      setError('Enter a short reason (at least 3 characters) before toggling.');
      return;
    }
    setBusy(true);
    setError('');
    setStatusMsg('');
    try {
      const res = await sessionFetch(`/api/v1/admin/rewards/controls/switches/${encodeURIComponent(sw.key)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enabled: !sw.enabled,
          reason,
          requestId: crypto.randomUUID(),
        }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok || body?.status !== 'success') {
        throw new Error(body?.message || `Toggle failed (${res.status})`);
      }
      setStatusMsg(`${sw.label} is now ${!sw.enabled ? 'ON' : 'OFF'}.`);
      setSwitchReasons(prev => ({ ...prev, [sw.key]: '' }));
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to toggle switch');
    } finally {
      setBusy(false);
    }
  }

  async function handleTransfer(e: React.FormEvent) {
    e.preventDefault();
    const amountCents = Math.round(Number(transferAmountUsd) * 100);
    if (!Number.isSafeInteger(amountCents) || amountCents <= 0) {
      setError('Enter a positive USD amount to transfer.');
      return;
    }
    if (fromReserve === toReserve) {
      setError('Source and destination reserves must be different.');
      return;
    }
    if (transferReason.trim().length < 3) {
      setError('Provide a transfer reason (minimum 3 characters).');
      return;
    }
    setBusy(true);
    setError('');
    setStatusMsg('');
    const requestId = pendingTransferId.current ?? (pendingTransferId.current = crypto.randomUUID());
    try {
      const res = await sessionFetch('/api/v1/admin/rewards/controls/reserves/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromReserve,
          toReserve,
          amountCents,
          reason: transferReason.trim(),
          requestId,
        }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok || body?.status !== 'success') {
        throw new Error(body?.message || `Transfer failed (${res.status})`);
      }
      pendingTransferId.current = null;
      setTransferAmountUsd('');
      setTransferReason('');
      setStatusMsg(`Transferred ${usd(amountCents)} from ${fromReserve} to ${toReserve}.`);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Transfer failed');
    } finally {
      setBusy(false);
    }
  }

  async function handleManualCommitment(e: React.FormEvent) {
    e.preventDefault();
    const amountCents = Math.round(Number(seedAmountUsd) * 100);
    if (!Number.isSafeInteger(amountCents) || amountCents <= 0) {
      setError('Enter a positive USD amount to stake into the pool.');
      return;
    }
    if (seedRef.trim().length < 3 || seedReason.trim().length < 3) {
      setError('Commitment reference and reason require at least 3 characters.');
      return;
    }
    setBusy(true);
    setError('');
    setStatusMsg('');
    const requestId = pendingSeedId.current ?? (pendingSeedId.current = crypto.randomUUID());
    try {
      const res = await sessionFetch('/api/v1/admin/rewards/controls/reserves/manual-commitment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetPool: seedPool,
          amountCents,
          commitmentRef: seedRef.trim(),
          reason: seedReason.trim(),
          requestId,
        }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok || body?.status !== 'success') {
        throw new Error(body?.message || `Manual commitment failed (${res.status})`);
      }
      pendingSeedId.current = null;
      setSeedRef('');
      setSeedReason('');
      setStatusMsg(`Recorded ${usd(amountCents)} Owner Seed Commitment into ${reserveLabel(seedPool)}.`);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to record manual pool commitment');
    } finally {
      setBusy(false);
    }
  }

  async function handleOperatingProceeds(e: React.FormEvent) {
    e.preventDefault();
    const amountCents = Math.round(Number(proceedsAmountUsd) * 100);
    if (!Number.isSafeInteger(amountCents) || amountCents <= 0) {
      setError('Enter a positive USD proceeds amount.');
      return;
    }
    if (proceedsSourceRef.trim().length < 3 || proceedsReason.trim().length < 3) {
      setError('Source reference and reason require at least 3 characters.');
      return;
    }
    setBusy(true);
    setError('');
    setStatusMsg('');
    const requestId = pendingProceedsId.current ?? (pendingProceedsId.current = crypto.randomUUID());
    try {
      const res = await sessionFetch('/api/v1/admin/rewards/controls/reserves/operating-proceeds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amountCents,
          sourceRef: proceedsSourceRef.trim(),
          reason: proceedsReason.trim(),
          requestId,
        }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok || body?.status !== 'success') {
        throw new Error(body?.message || `Operating proceeds failed (${res.status})`);
      }
      pendingProceedsId.current = null;
      setProceedsAmountUsd('');
      setProceedsSourceRef('');
      setProceedsReason('');
      setStatusMsg(`Recorded ${usd(amountCents)} into Platform Operating Reserve.`);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to record proceeds');
    } finally {
      setBusy(false);
    }
  }

  async function handleAckAlert(id: string) {
    setBusy(true);
    setError('');
    try {
      const res = await sessionFetch(`/api/v1/admin/rewards/controls/alerts/${id}/acknowledge`, {
        method: 'POST',
      });
      const body = await res.json().catch(() => null);
      if (!res.ok || body?.status !== 'success') {
        throw new Error(body?.message || 'Acknowledge failed');
      }
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to acknowledge alert');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ display: 'grid', gap: 20, maxWidth: 1100 }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Program Switches &amp; Reserves</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: 4, fontSize: '0.875rem' }}>
          Manage rewards program switches, inspect Promotional Ad Reserve alongside other CrimFig reserves, move funds cleanly across reserves, and review silent safety notices.
        </p>
      </div>

      {error && (
        <div role="alert" style={{ padding: 12, borderRadius: 8, border: '1px solid var(--color-crimson, #D4143A)', color: 'var(--color-crimson, #D4143A)' }}>
          {error}
        </div>
      )}
      {statusMsg && (
        <div role="status" style={{ padding: 12, borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
          {statusMsg}
        </div>
      )}
      {loading && !data && <p>Loading program switches &amp; reserves…</p>}

      {data && (
        <>
          {/* Program Feature Switches */}
          <Card>
            <CardHeader>
              <CardTitle style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Power size={18} aria-hidden="true" /> Program Feature Switches
              </CardTitle>
              <CardDescription>
                Toggle features ON or OFF immediately with audited history (zero environment variable changes needed).
              </CardDescription>
            </CardHeader>
            <CardContent style={{ display: 'grid', gap: 12 }}>
              {data.switches.map(sw => (
                <div
                  key={sw.key}
                  style={{
                    display: 'grid',
                    gap: 8,
                    padding: 14,
                    borderRadius: 10,
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{sw.label}</div>
                      <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{sw.description}</div>
                    </div>
                    <Badge variant="outline">
                      {sw.isLockedOff ? 'Locked OFF' : sw.enabled ? 'ON' : 'OFF'}
                    </Badge>
                  </div>
                  {!sw.isLockedOff && (
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                      <Input
                        placeholder="Optional audit note (min 3 chars)"
                        value={switchReasons[sw.key] || ''}
                        onChange={e => setSwitchReasons(prev => ({ ...prev, [sw.key]: e.target.value }))}
                        style={{ maxWidth: 340 }}
                      />
                      <Button
                        variant={sw.enabled ? 'outline' : 'default'}
                        disabled={busy}
                        onClick={() => void handleToggle(sw)}
                      >
                        {sw.enabled ? 'Turn OFF' : 'Turn ON'}
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Reserves Snapshot & Inter-Reserve Transfers */}
          <Card>
            <CardHeader>
              <CardTitle style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ShieldCheck size={18} aria-hidden="true" /> Reserves Overview
              </CardTitle>
              <CardDescription>
                View Promotional Ad Reserve, Rewards Fund cash backing, and Platform Operating Reserve balances side-by-side.
              </CardDescription>
            </CardHeader>
            <CardContent style={{ display: 'grid', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 12 }}>
                <div style={{ padding: 14, borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontWeight: 600 }}>Rewards Fund (Redeemable Points)</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: 6 }}>
                    {usd(data.reserves.rewardsFund?.cashBalanceUsdCents ?? 0)}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 6 }}>
                    Unallocated Available: {usd(data.reserves.rewardsFund?.availableUsdCents ?? 0)}<br />
                    Safety Floor Locked: {usd(data.reserves.rewardsFund?.reserveFloorUsdCents ?? 10000)}<br />
                    Usable Above Floor: {usd(data.reserves.rewardsFund?.transferableCents ?? 0)}<br />
                    Backing Allocated Points: {usd(data.reserves.rewardsFund?.allocatedUsdCents ?? 0)}<br />
                    Pending 72h Hold: {usd(data.reserves.rewardsFund?.fundedPendingUsdCents ?? 0)}
                  </div>
                </div>

                <div style={{ padding: 14, borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontWeight: 600 }}>$cfig Conversion &amp; Backing Pool</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: 6 }}>
                    {usd(data.reserves.cfigConversionReserve?.availableCents ?? 0)}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 6 }}>
                    Available USD Backing: {usd(data.reserves.cfigConversionReserve?.availableCents ?? 0)}<br />
                    Reserved for Cohorts: {usd(data.reserves.cfigConversionReserve?.reservedCents ?? 0)}<br />
                    Settled Conversions: {usd(data.reserves.cfigConversionReserve?.spentCents ?? 0)}
                  </div>
                </div>

                <div style={{ padding: 14, borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontWeight: 600 }}>Promotional Ad Reserve</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: 6 }}>
                    {usd(data.reserves.promotionalAdReserve?.remainingPromoBudgetCents ?? 0)}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 6 }}>
                    Transferable (after pending liability): {usd(data.reserves.promotionalAdReserve?.transferableCents ?? 0)}<br />
                    72h Pending Promoter Liability: {usd(data.reserves.promotionalAdReserve?.reservedLiabilityCents ?? 0)}<br />
                    Paid to Promoters: {usd(data.reserves.promotionalAdReserve?.paidPromoterEarningsCents ?? 0)}<br />
                    Claimed Bonus Credits: {usd(data.reserves.promotionalAdReserve?.issuedBonusCreditsCents ?? 0)}
                  </div>
                </div>

                <div style={{ padding: 14, borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontWeight: 600 }}>Platform Operating Reserve</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: 6 }}>
                    {usd(data.reserves.platformOperatingReserve?.availableCents ?? 0)}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 6 }}>
                    Central reserve available to allocate into Promotional Ad Reserve, Rewards Fund, or $cfig Pool.
                  </div>
                </div>
              </div>

              {data.actorCapabilities?.canManualSeedCommitment !== false ? (
                <form onSubmit={handleManualCommitment} style={{ display: 'grid', gap: 10, padding: 14, borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontWeight: 600 }}>Manual Pool Commitment (Super Admin Owner Seed — No Paystack Checkout)</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                    Records an explicit owner seed commitment into the selected pool. Rewards Fund enforces a $100.00 safety floor (commit e.g. $200.00 to leave $100.00 usable above floor); $20.00 fits the remaining pools cleanly.
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                    <select
                      aria-label="Target seed pool"
                      value={seedPool}
                      onChange={e => {
                        const val = e.target.value;
                        setSeedPool(val);
                        setSeedAmountUsd(val === 'rewards_fund_available' ? '200.00' : '20.00');
                      }}
                      style={{ minHeight: 40, padding: '0 10px', borderRadius: 8, border: '1px solid var(--border-subtle)' }}
                    >
                      {RESERVE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                    <Input
                      type="number"
                      step="0.01"
                      min="0.01"
                      aria-label="Seed commitment amount USD"
                      placeholder="Amount USD"
                      value={seedAmountUsd}
                      onChange={e => setSeedAmountUsd(e.target.value)}
                      style={{ maxWidth: 130 }}
                    />
                    <Button type="button" size="sm" variant="outline" disabled={busy} onClick={() => setSeedAmountUsd('20.00')}>
                      $20
                    </Button>
                    <Button type="button" size="sm" variant="outline" disabled={busy} onClick={() => setSeedAmountUsd('200.00')}>
                      $200
                    </Button>
                    <Input
                      aria-label="Commitment reference"
                      placeholder="Commitment ref (e.g. founder-seed-2026-11)"
                      value={seedRef}
                      onChange={e => setSeedRef(e.target.value)}
                      style={{ maxWidth: 230 }}
                    />
                    <Input
                      aria-label="Commitment reason"
                      placeholder="Reason (e.g. Initial pool bootstrap)"
                      value={seedReason}
                      onChange={e => setSeedReason(e.target.value)}
                      style={{ maxWidth: 240 }}
                    />
                    <Button type="submit" disabled={busy}>Commit Seed Funds</Button>
                  </div>
                </form>
              ) : (
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', padding: 12, borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
                  Manual owner seed commitments require a single <code>super_admin</code> role.
                </div>
              )}

              <form onSubmit={handleTransfer} style={{ display: 'grid', gap: 10, padding: 14, borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <ArrowRightLeft size={16} aria-hidden="true" /> Move Funds Between Reserves
                </div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                  <select value={fromReserve} onChange={e => setFromReserve(e.target.value)} style={{ minHeight: 40, padding: '0 10px', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
                    {RESERVE_OPTIONS.map(o => <option key={o.value} value={o.value}>From: {o.label}</option>)}
                  </select>
                  <select value={toReserve} onChange={e => setToReserve(e.target.value)} style={{ minHeight: 40, padding: '0 10px', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
                    {RESERVE_OPTIONS.map(o => <option key={o.value} value={o.value}>To: {o.label}</option>)}
                  </select>
                  <Input
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="Amount USD"
                    value={transferAmountUsd}
                    onChange={e => setTransferAmountUsd(e.target.value)}
                    style={{ maxWidth: 140 }}
                  />
                  <Input
                    placeholder="Transfer reason (e.g. Fund promo reserve)"
                    value={transferReason}
                    onChange={e => setTransferReason(e.target.value)}
                    style={{ maxWidth: 320 }}
                  />
                  <Button type="submit" disabled={busy}>Transfer</Button>
                </div>
              </form>

              <form onSubmit={handleOperatingProceeds} style={{ display: 'grid', gap: 10, padding: 14, borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontWeight: 600 }}>Record Realized Platform Proceeds to Operating Reserve</div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                  <Input
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="Amount USD"
                    value={proceedsAmountUsd}
                    onChange={e => setProceedsAmountUsd(e.target.value)}
                    style={{ maxWidth: 140 }}
                  />
                  <Input
                    placeholder="Source ref (e.g. settled-batch-2026-11)"
                    value={proceedsSourceRef}
                    onChange={e => setProceedsSourceRef(e.target.value)}
                    style={{ maxWidth: 240 }}
                  />
                  <Input
                    placeholder="Reason"
                    value={proceedsReason}
                    onChange={e => setProceedsReason(e.target.value)}
                    style={{ maxWidth: 260 }}
                  />
                  <Button type="submit" variant="outline" disabled={busy}>Record Proceeds</Button>
                </div>
              </form>

              {data.transfers.length > 0 && (
                <div>
                  <h3 style={{ fontSize: '0.95rem', marginBottom: 8 }}>Recent Reserve Transfers</h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 6 }}>
                    {data.transfers.slice(0, 10).map(t => (
                      <li key={t.id} style={{ fontSize: 13, padding: '8px 10px', border: '1px solid var(--border-subtle)', borderRadius: 8 }}>
                        <strong>{usd(t.amountCents)}</strong> · {reserveLabel(t.fromReserve)} → {reserveLabel(t.toReserve)} · {t.reason} ({new Date(t.createdAt).toLocaleString()})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Silent Platform Safety Alerts */}
          <Card>
            <CardHeader>
              <CardTitle style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Bell size={18} aria-hidden="true" /> Silent Safety Notices ({data.alerts.filter(a => a.status === 'open').length} open)
              </CardTitle>
              <CardDescription>
                Informational safety notices for 100% bonus-credit campaigns, self-dealing blocks, and post-award eligibility changes (no automatic blocking or clawback).
              </CardDescription>
            </CardHeader>
            <CardContent style={{ display: 'grid', gap: 8 }}>
              {data.alerts.length === 0 ? (
                <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>No silent safety notices recorded yet.</p>
              ) : (
                data.alerts.map(alert => (
                  <div
                    key={alert.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 12,
                      padding: 10,
                      borderRadius: 8,
                      border: '1px solid var(--border-subtle)',
                      flexWrap: 'wrap',
                    }}
                  >
                    <div style={{ fontSize: 13 }}>
                      <strong>[{alert.category}]</strong> {alert.summary}{' '}
                      <span style={{ color: 'var(--text-secondary)' }}>({new Date(alert.createdAt).toLocaleString()})</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Badge variant="outline">{alert.status}</Badge>
                      {alert.status === 'open' && (
                        <Button size="sm" variant="outline" disabled={busy} onClick={() => void handleAckAlert(alert.id)}>
                          Acknowledge
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
