'use client';
import { useEffect, useState } from 'react';
import { Badge, Button, Card, Input } from '../ui';
import { sessionFetch } from '../../lib/session';
import { adsApi } from '../../lib/ads-api-client';
import { ecosystemOrigin } from '../../../../../shared/ui/origins';

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

export function DeliveryReadinessPanel({ report }: { report: Readiness }) {
  const auth = ecosystemOrigin('auth', process.env.NEXT_PUBLIC_AUTH_WEB_URL);
  return (
    <section className="cf-section" aria-label="Paid delivery readiness">
      <h2 className="cf-section-title">Paid delivery readiness</h2>
      <p className="cf-muted">Checked {new Date(report.evaluatedAt).toLocaleString()}</p>
      {report.gates.map(gate => (
        <Card key={gate.gateCode} className="cf-dialog-section">
          <Badge variant="outline">{statuses[gate.status] ?? 'Unknown'}</Badge>
          <p>{gate.explanation}</p>
          <p className="cf-muted">{gate.owner} · {gate.source}{gate.observedAt ? ' · Observed ' + new Date(gate.observedAt).toLocaleString() : ''}</p>
          {gate.action === 'verify_email' && <Button asChild variant="outline"><a href={auth + '/verify-email'}>Verify or resend email</a></Button>}
          {gate.action === 'review_website' && <a href="#website-suitability-review">Open suitability review</a>}
        </Card>
      ))}
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
    {current?.report ? <DeliveryReadinessPanel report={current.report} />
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
  useEffect(() => {
    if (state !== 'loading') return;
    let active = true;
    void sessionFetch('/api/v1/adstation/admin/auction-decisions?limit=10&slotTagId=' + encodeURIComponent(slotTagId))
      .then(async response => {
        if (!response.ok) throw Error('Unavailable');
        const data = (await response.json()).data;
        if (!Array.isArray(data)) throw Error('Unavailable');
        if (active) { setSnapshot(data.slice(0, 10)); setState('idle'); }
      }).catch(() => { if (active) setState('failed'); });
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
    {state === 'failed' && <p role="alert">Auction evidence is unavailable. Try loading it again.</p>}
    {snapshot?.length === 0 && <p>No decision records found in this sample.</p>}
    {!!snapshot?.length && <>
      <p>{snapshot.length} decisions sampled · {paid} paid · {noFill} no fill</p>
      <ul>
        {snapshot.map(row => <li key={row.requestId}>
          <strong>{row.inventoryClass.replaceAll('_', ' ')}</strong> · {new Date(row.createdAt).toLocaleString()} · {row.candidateCount} candidates
          <p className="cf-muted">Request {row.requestId}</p>
          {!!row.excludedCandidates?.length && <p className="cf-muted">Exclusion codes {[
            ...new Set(row.excludedCandidates.map(item => item.reasonCode).filter(Boolean)),
          ].slice(0, 8).join(', ')}</p>}
        </li>)}
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
