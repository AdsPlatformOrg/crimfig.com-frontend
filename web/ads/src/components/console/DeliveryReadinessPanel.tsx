'use client';
import { useEffect, useRef, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Badge, Button, Card, Input } from '../ui';
import { sessionFetch } from '../../lib/session';
import { adsApi } from '../../lib/ads-api-client';

type Gate = {
  gateCode: string;
  status: string;
  explanation: string;
  owner: string;
  source: string;
  action?: string;
  observedAt: string | null;
};
export type Readiness = { version: number; evaluatedAt: string; gates: Gate[] };
const statuses: Record<string, string> = {
  eligible: 'Pass', blocked: 'Blocked', pending: 'Pending', action_required: 'Action required',
  unknown: 'Unknown', unavailable: 'Unavailable', stale: 'Stale', observed: 'Observed',
};

type ResendState = 'idle' | 'sending' | 'sent' | 'failed';

/** Sends the signed-in advertiser's own verification email without leaving the page. */
function VerifyEmailAction({ onReload }: { onReload?: () => void }) {
  const [state, setState] = useState<ResendState>('idle');
  const [message, setMessage] = useState('');
  const lock = useRef(false);
  async function send() {
    if (lock.current) return;
    lock.current = true;
    setState('sending');
    try {
      const response = await sessionFetch('/api/v1/auth/resend-verification', { method: 'POST' });
      if (response.ok) { setState('sent'); return; }
      setMessage(response.status === 429 ? 'Too many requests. Wait a few minutes before trying again.'
        : response.status === 401 ? 'Your session expired. Sign in again, then retry.'
        : 'The email could not be confirmed as sent. Check your inbox before trying again.');
      setState('failed');
    } catch {
      setMessage('The email could not be confirmed as sent. Check your inbox before trying again.');
      setState('failed');
    } finally { lock.current = false; }
  }
  return <>
    <Button variant="outline" disabled={state === 'sending'} onClick={() => void send()}>
      {state === 'sending' ? 'Sending email…' : 'Send verification email'}
    </Button>
    {state === 'failed' && <p role="alert">{message}</p>}
    <Dialog.Root open={state === 'sent'} onOpenChange={open => { if (!open) setState('idle'); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="cf-report-overlay" />
        <Dialog.Content className="cf-report-dialog">
          <Dialog.Title>Verification email sent</Dialog.Title>
          <Dialog.Description>
            Check your email inbox (and spam folder) and open the verification link. Then come back here and reload readiness.
          </Dialog.Description>
          <div className="cf-mod-toolbar">
            <Button variant="outline" onClick={() => setState('idle')}>Got it</Button>
            {onReload && <Button onClick={() => { setState('idle'); onReload(); }}>Reload readiness</Button>}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  </>;
}

export function DeliveryReadinessPanel({ report, onReload, canAct = true }: { report: Readiness; onReload?: () => void; canAct?: boolean }) {
  const blockedGates = report.gates.filter(g => g.status === 'blocked' || g.status === 'action_required');
  const isOverallBlocked = blockedGates.length > 0;

  return (
    <section className="cf-section" aria-label="Paid delivery readiness">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <h2 className="cf-section-title" style={{ margin: 0 }}>Paid delivery readiness</h2>
          <p className="cf-muted" style={{ margin: '2px 0 0 0' }}>Checked {new Date(report.evaluatedAt).toLocaleString()}</p>
        </div>
        <div>
          <Badge
            variant="outline"
            style={{
              fontSize: '12px',
              fontWeight: 700,
              padding: '4px 10px',
              backgroundColor: isOverallBlocked ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
              color: isOverallBlocked ? '#EF4444' : '#10B981',
              borderColor: isOverallBlocked ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)',
            }}
          >
            {isOverallBlocked ? `DELIVERY BLOCKED (${blockedGates.length} Gate${blockedGates.length === 1 ? '' : 's'})` : 'ALL EVALUATED GATES PASS'}
          </Badge>
        </div>
      </div>

      {report.gates.filter(gate => canAct ? gate.owner === 'Advertiser' || gate.owner === 'Moderation' : true).map(gate => {
        const isBlocked = gate.status === 'blocked' || gate.status === 'action_required';
        const isEligible = gate.status === 'eligible' || gate.status === 'observed';
        return (
          <Card
            key={gate.gateCode}
            className="cf-dialog-section"
            style={{
              borderLeft: isBlocked ? '4px solid #EF4444' : isEligible ? '4px solid #10B981' : '4px solid #64748B',
              marginBottom: '10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary, #0F172A)' }}>
                {gate.gateCode.replace(/_/g, ' ')}
              </span>
              <Badge
                variant="outline"
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  backgroundColor: isBlocked ? 'rgba(239, 68, 68, 0.1)' : isEligible ? 'rgba(16, 185, 129, 0.1)' : 'rgba(100, 116, 139, 0.1)',
                  color: isBlocked ? '#EF4444' : isEligible ? '#10B981' : '#64748B',
                }}
              >
                {statuses[gate.status] ?? 'Unknown'}
              </Badge>
            </div>
            <p style={{ margin: '4px 0', fontSize: '13px', color: 'var(--text-secondary, #334155)' }}>{gate.explanation}</p>
            <p className="cf-muted" style={{ margin: '4px 0 0 0', fontSize: '11px' }}>
              <strong>Owner:</strong> {gate.owner} · <strong>Authority:</strong> {gate.source}
              {gate.observedAt ? ' · Observed ' + new Date(gate.observedAt).toLocaleString() : ''}
            </p>
            {gate.action === 'verify_email' && canAct && <div style={{ marginTop: '8px' }}><VerifyEmailAction onReload={onReload} /></div>}
            {gate.action === 'review_website' && <div style={{ marginTop: '8px' }}><a href="#website-suitability-review">Open suitability review</a></div>}
          </Card>
        );
      })}
    </section>
  );
}
export function CampaignReadiness({ campaignId, staff = false }: { campaignId: string; staff?: boolean }) {
  const endpoint = '/api/v1/campaigns/' + (staff ? 'admin/' : '') + encodeURIComponent(campaignId) + '/delivery-readiness';
  const [snapshot, setSnapshot] = useState<{ endpoint: string; report?: Readiness; error?: string }>();
  const [refresh, setRefresh] = useState(0);
  useEffect(() => {
    let active = true;
    setSnapshot(undefined);
    void Promise.resolve().then(() => adsApi().deliveryReadiness(campaignId, staff)).then(result => {
      if (result?.version !== 1 || !Array.isArray(result.gates)) throw Error('Readiness response is unavailable.');
      if (active) setSnapshot({ endpoint, report: result });
    }).catch(() => {
      if (active) setSnapshot({ endpoint, error: 'Readiness is unavailable. Try refreshing the checks.' });
    });
    return () => { active = false; };
  }, [endpoint, campaignId, staff, refresh]);
  const current = snapshot?.endpoint === endpoint ? snapshot : undefined;
  return <>
    {current?.report ? <DeliveryReadinessPanel report={current.report} canAct={!staff} onReload={() => setRefresh(value => value + 1)} />
      : <p role={current?.error ? 'alert' : 'status'}>{current?.error ?? 'Checking delivery readiness…'}</p>}
    <Button variant="outline" disabled={!current} onClick={() => setRefresh(value => value + 1)}>Refresh readiness</Button>
  </>;
}

export function StaffCampaignLookup() {
  const [input, setInput] = useState('');
  const [selected, setSelected] = useState('');
  const valid = /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(input.trim());
  return <section className="cf-section" aria-label="Staff campaign lookup">
    <form className="cf-section" onSubmit={event => {
      event.preventDefault();
      if (valid) setSelected(input.trim());
    }}>
      <label htmlFor="readiness-campaign-id">Campaign ID</label>
      <Input id="readiness-campaign-id" value={input} maxLength={36} onChange={event => setInput(event.target.value)} />
      <Button type="submit" variant="outline" disabled={!valid}>Inspect campaign readiness</Button>
    </form>
    {selected && <CampaignReadiness key={selected} campaignId={selected} staff />}
  </section>;
}

type AuctionRecord = {
  requestId: string;
  createdAt: string;
  inventoryClass: string;
  candidateCount: number;
  excludedCandidates?: { reasonCode?: string }[];
};

export function SlotAuctionEvidence({ slotTagId }: { slotTagId: string }) {
  const [snapshot, setSnapshot] = useState<AuctionRecord[]>();
  const [state, setState] = useState<'idle' | 'loading' | 'failed'>('idle');
  const [errorDetail, setErrorDetail] = useState<string>();

  useEffect(() => {
    if (state !== 'loading') return;
    let active = true;
    setErrorDetail(undefined);
    void sessionFetch('/api/v1/adstation/admin/auction-decisions?limit=10&slotTagId=' + encodeURIComponent(slotTagId))
      .then(async response => {
        if (!response.ok) {
          const body = await response.json().catch(() => null);
          throw new Error(body?.message || `HTTP ${response.status}`);
        }
        const data = (await response.json()).data;
        if (!Array.isArray(data)) throw new Error('Invalid response structure');
        if (active) { setSnapshot(data.slice(0, 10)); setState('idle'); }
      }).catch((err) => {
        if (active) {
          setErrorDetail(err instanceof Error ? err.message : 'Unknown error');
          setState('failed');
        }
      });
    return () => { active = false; };
  }, [state, slotTagId]);
  const paid = snapshot?.filter(row => row.inventoryClass === 'paid').length ?? 0;
  const noFill = snapshot?.filter(row => row.inventoryClass === 'no_fill').length ?? 0;
  return <section className="cf-section" aria-label="Slot auction evidence">
    <h2 className="cf-section-title">Recent slot decisions</h2>
    <p className="cf-muted">Sample of up to 10 latest recorded decisions for this slot. Use a request ID to investigate with Ads Operations.</p>
    <Button variant="outline" disabled={state === 'loading'} onClick={() => { setSnapshot(undefined); setState('loading'); }}>
      {state === 'loading' ? 'Loading decisions…' : 'Load latest decisions'}
    </Button>
    {state === 'failed' && <p role="alert" className="text-sm text-red-600 mt-2">Auction evidence is unavailable ({errorDetail}). Try loading it again.</p>}
    {snapshot?.length === 0 && <p className="text-sm text-[var(--color-text-muted)] mt-2">No decision records found in this sample.</p>}
    {!!snapshot?.length && <>
      <p className="mt-2 text-sm font-medium">{snapshot.length} decisions sampled · {paid} paid · {noFill} no fill</p>
      <ul className="space-y-2 mt-2">
        {snapshot.map(row => {
          const exclusions = Array.isArray(row.excludedCandidates) ? row.excludedCandidates : [];
          const primaryReason = exclusions[0]?.reasonCode || (row.inventoryClass === 'house' ? 'HOUSE_FALLBACK' : 'NONE');
          const stage = (exclusions[0] as any)?.stage || (row.candidateCount === 0 ? 'pre_auction' : 'auction');
          const isHouse = row.inventoryClass === 'house';
          const isPaid = row.inventoryClass === 'paid';

          return (
            <li key={row.requestId} className="p-3 border border-[var(--border-subtle)] rounded-lg text-xs bg-[var(--bg-card)]">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
                    isPaid ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                    isHouse ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                    'bg-slate-100 text-slate-800'
                  }`}>
                    ● {row.inventoryClass.replaceAll('_', ' ')}
                  </span>
                  <span className="font-semibold text-[var(--text-primary)]">
                    Gate: {stage.replaceAll('_', ' ').toUpperCase()}
                  </span>
                </div>
                <span className="text-[var(--text-muted)]">{new Date(row.createdAt).toLocaleString()}</span>
              </div>

              <div className="mt-2 text-xs">
                <span className="text-[var(--text-muted)]">Primary Fallback Code: </span>
                <span className="font-mono font-semibold text-[var(--color-crimson)]">{primaryReason}</span>
              </div>

              <p className="cf-muted font-mono mt-1 text-[11px]">Request ID: {row.requestId}</p>

              <div className="mt-2 pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-[var(--text-muted)]">
                <span>Evaluated Candidates: <strong>{row.candidateCount}</strong></span>
                <span>Policy Version: <code>{(row as any).policyVersion || 'v1'}</code></span>
              </div>
            </li>
          );
        })}
      </ul>
    </>}
  </section>;
}

type OperationsSnapshot = {
  campaigns: number;
  inactiveAccountCampaigns: number;
  unverifiedAdvertisers: number;
  managerReviewCampaigns: number;
  oldestPendingSubmissionAt: string | null;
  slots: number;
  staleInstallations: number;
  evaluatedAt: string;
};

export function ReadinessOperations() {
  const [result, setResult] = useState<OperationsSnapshot>();
  const [state, setState] = useState<'idle' | 'loading' | 'failed'>('idle');
  useEffect(() => {
    if (state !== 'loading') return;
    let active = true;
    void sessionFetch('/api/v1/admin/ads/readiness/operations').then(async response => {
      if (!response.ok) throw Error('Unavailable');
      const data = (await response.json()).data;
      if (!data || !Number.isInteger(data.campaigns) || !Number.isInteger(data.slots)) throw Error('Unavailable');
      if (active) { setResult(data); setState('idle'); }
    }).catch(() => { if (active) setState('failed'); });
    return () => { active = false; };
  }, [state]);
  return <section className="cf-section" aria-label="Readiness operations">
    <h2 className="cf-section-title">Operations snapshot</h2>
    <Button variant="outline" disabled={state === 'loading'} onClick={() => { setResult(undefined); setState('loading'); }}>
      {state === 'loading' ? 'Checking readiness…' : 'Load operations snapshot'}
    </Button>
    {state === 'failed' && <p role="alert">Operations evidence is unavailable.</p>}
    {result && <dl>
      <dt>Campaign population</dt><dd>{result.campaigns} of up to 100 newest active or in-review campaigns</dd>
      <dt>Campaigns with inactive advertiser accounts</dt><dd>{result.inactiveAccountCampaigns}</dd>
      <dt>Distinct unverified advertisers in this sample</dt><dd>{result.unverifiedAdvertisers}</dd>
      <dt>Campaigns awaiting manager approval</dt><dd>{result.managerReviewCampaigns}</dd>
      <dt>Oldest recorded submission still in review</dt><dd>{result.oldestPendingSubmissionAt ? new Date(result.oldestPendingSubmissionAt).toLocaleString() : 'No timestamp observed'}</dd>
      <dt>Stale installations</dt><dd>{result.staleInstallations} of {result.slots} recently updated active, previously verified slots sampled. Checks older than 24 hours or missing timestamps count as stale.</dd>
      <dt>Snapshot checked</dt><dd>{new Date(result.evaluatedAt).toLocaleString()}</dd>
    </dl>}
  </section>;
}
