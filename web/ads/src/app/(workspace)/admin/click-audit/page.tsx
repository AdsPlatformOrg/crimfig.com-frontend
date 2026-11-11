'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useSessionSnapshot } from '@/components/SessionGate';
import { apiData } from '@/lib/api-data';
import styles from './click-audit.module.css';

const outcomes = [
  ['all', 'Observed clicks'], ['redirects', 'Redirects'], ['valid', 'Valid clicks'],
  ['rejected', 'Rejected clicks'], ['missing', 'Missing click events'], ['billed', 'Billed clicks'],
] as const;
type Outcome = typeof outcomes[number][0];
type Row = {
  id: string; at: string; receipt_id: string | null; event_id: string | null; serve_id: string | null;
  campaign: string; domain: string | null; slot: string | null; valid: boolean | null; billed: boolean;
  reason: string | null; request_id: string | null; reservation_state: string | null;
  event_deadline: string | null; claim_event_id: string | null; settled_at: string | null;
  settlement_claim_id: string | null; assessment: string | null; assessment_reasons: string[] | null;
  debit_id: string | null; billed_usd_cents: number | null;
  has_journal: boolean;
};
type Result = {
  counts: Record<Outcome, number>; total: number; page: number; pageSize: number;
  items: Row[]; from: string; to: string; timezone: string;
};
const dateTime = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Africa/Lagos', dateStyle: 'medium', timeStyle: 'medium',
});
const stamp = (value: string | null) => value ? dateTime.format(new Date(value)) : 'Unavailable';
const outcomeLabel = (row: Row) => row.valid === true ? 'Valid' : row.valid === false ? 'Rejected' : 'Click event missing';
const reasonLabels: Record<string, string> = {
  IP_BINDING_MISMATCH: 'Client IP did not match the issued ad',
  EVENT_NOT_RECORDED: 'Click event recording returned no event',
  DUP_CLICK: 'Duplicate click',
};
const reasonText = (reason: string | null) => reason ? reasonLabels[reason] ?? reason : 'Unknown';

export default function ClickAuditPage() {
  const params = useSearchParams();
  const { identityVersion } = useSessionSnapshot();
  return <AuditWorkspace key={identityVersion + ':' + params.toString()} query={params.toString()} />;
}

function AuditWorkspace({ query }: { query: string }) {
  const router = useRouter();
  const [data, setData] = useState<Result | null>(null);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  const [expanded, setExpanded] = useState<string | null>(null);
  const params = new URLSearchParams(query);
  const active = params.get('outcome') || 'all';
  useEffect(() => {
    const controller = new AbortController();
    apiData<Result>('/api/v1/admin/ads/click-audit?' + query, { signal: controller.signal, cache: 'no-store' })
      .then(value => { if (!controller.signal.aborted) setData(value); })
      .catch(() => { if (!controller.signal.aborted) setError('Click audit is unavailable. Check the filters or try again.'); });
    return () => controller.abort();
  }, [query, retry]);

  function navigate(filters: URLSearchParams) {
    const search = filters.toString();
    router.push('/admin/click-audit' + (search ? '?' + search : ''));
  }
  function changeFilter(key: 'outcome' | 'page', value: string) {
    const next = new URLSearchParams(query);
    next.set(key, value);
    if (key === 'outcome') next.delete('page');
    navigate(next);
  }

  return <div className={styles.root}>
    <header className={styles.heading}>
      <h1 className="cf-page-title">Click Audit</h1>
      <p>Trace ad redirects, click evidence and billing outcomes.</p>
    </header>
    <form className={styles.filters} onSubmit={event => {
      event.preventDefault();
      const next = new URLSearchParams();
      for (const [key, value] of new FormData(event.currentTarget)) {
        if (typeof value === 'string' && value.trim()) next.set(key, value.trim());
      }
      navigate(next);
    }}>
      <label>Campaign ID<Input name="campaign" defaultValue={params.get('campaign') ?? ''} /></label>
      <label>Website ID<Input name="website" defaultValue={params.get('website') ?? ''} /></label>
      <label>Slot ID<Input name="slot" defaultValue={params.get('slot') ?? ''} /></label>
      <label>From<Input name="from" type="date" defaultValue={params.get('from') ?? ''} /></label>
      <label>To<Input name="to" type="date" defaultValue={params.get('to') ?? ''} /></label>
      <label>Outcome<select name="outcome" defaultValue={active}>
        {outcomes.map(([key, label]) => <option key={key} value={key}>{key === 'all' ? 'All outcomes' : label}</option>)}
      </select></label>
      <Button type="submit">Apply filters</Button>
      {query && <Button asChild variant="outline"><Link href="/admin/click-audit">Clear</Link></Button>}
    </form>
    {error && <div role="alert" className={styles.panel}>
      <p>{error}</p><Button variant="outline" onClick={() => { setError(''); setRetry(value => value + 1); }}>Try again</Button>
    </div>}
    {!data && !error && <div className={styles.loading} role="status" aria-label="Loading click audit" />}
    {data && <>
      <p className={styles.muted}>{data.from} to {data.to} · Africa/Lagos</p>
      <div className={styles.counts} aria-label="Click outcome filters">
        {outcomes.map(([key, label]) => <button type="button" className={styles.count}
          aria-pressed={active === key} key={key} onClick={() => changeFilter('outcome', key)}>
          <span>{label}</span><strong>{data.counts[key].toLocaleString()}</strong>
        </button>)}
      </div>
      <p className={styles.muted}>A redirect can also be a valid, rejected or billed click. These totals overlap.</p>
      <section className={styles.panel} aria-labelledby="results-heading">
        <div className={styles.sectionHeading}><h2 id="results-heading">Click records</h2><span>{data.total.toLocaleString()} results</span></div>
        {data.items.length === 0 ? <p>No click records match these filters.</p> :
          <Table aria-label="Click audit records">
            <TableHeader><TableRow>
              {['Time', 'Campaign', 'Site or slot', 'Click outcome', 'Billing', 'Details'].map(label => <TableHead scope="col" key={label}>{label}</TableHead>)}
            </TableRow></TableHeader>
            <TableBody>{data.items.map(row => <AuditRow key={row.id} row={row} open={expanded === row.id}
              toggle={() => setExpanded(expanded === row.id ? null : row.id)} />)}</TableBody>
          </Table>}
        <div className={styles.pagination}>
          <Button variant="outline" disabled={data.page <= 1} onClick={() => changeFilter('page', String(data.page - 1))}>Previous</Button>
          <span>Page {data.page}</span>
          <Button variant="outline" disabled={data.page * data.pageSize >= data.total} onClick={() => changeFilter('page', String(data.page + 1))}>Next</Button>
        </div>
      </section>
    </>}
  </div>;
}

function AuditRow({ row, open, toggle }: { row: Row; open: boolean; toggle: () => void }) {
  const detailId = 'click-detail-' + row.id;
  return <>
    <TableRow>
      <TableCell>{stamp(row.at)}</TableCell><TableCell>{row.campaign}</TableCell>
      <TableCell>{row.domain || row.slot || 'Unavailable'}</TableCell>
      <TableCell><Badge variant="outline">{outcomeLabel(row)}</Badge></TableCell>
      <TableCell>{row.billed && row.billed_usd_cents != null
        ? (row.billed_usd_cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
        : row.billed ? 'Billed' : row.settlement_claim_id ? 'Settlement claim recorded' : 'No posted debit'}</TableCell>
      <TableCell><Button variant="outline" size="sm" aria-expanded={open} aria-controls={open ? detailId : undefined}
        onClick={toggle}>{open ? 'Hide details' : 'View details'}</Button></TableCell>
    </TableRow>
    {open && <TableRow><TableCell colSpan={6}>
      <div id={detailId} className={styles.evidence}>
        <section><h3>Redirect</h3><p>{row.receipt_id ?? 'No redirect receipt'}</p><p>Serve {row.serve_id ?? 'unavailable'}</p>
          {row.request_id && <Link href={'/admin/auction-logs/' + row.request_id}>View auction</Link>}</section>
        <section><h3>Click event</h3><p>{row.event_id ?? 'No linked click event'}</p>
          <p>{row.event_id ? row.has_journal ? 'Evidence journal recorded' : 'Evidence journal missing' : 'Validity undetermined'}</p>
          {(row.reason || !row.event_id) && <p>Reason: {reasonText(row.reason)}</p>}</section>
        <section><h3>Assessment</h3><p>{row.assessment ?? 'No final assessment'}</p>
          {row.assessment_reasons?.length ? <p>{row.assessment_reasons.join(', ')}</p> : null}</section>
        <section><h3>Billing</h3><p>Reservation: {row.reservation_state ?? 'Unavailable'}</p>
          <p>Event deadline: {stamp(row.event_deadline)}</p>
          <p>Claim: {row.settlement_claim_id ?? row.claim_event_id ?? 'None'}</p>
          {row.debit_id && <p>Billing receipt: {row.debit_id}</p>}
          {row.settled_at && <p>Settled: {stamp(row.settled_at)}</p>}</section>
      </div>
    </TableCell></TableRow>}
  </>;
}
