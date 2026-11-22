'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSessionSnapshot } from '@/components/SessionGate';
import { sessionFetch } from '@/lib/session';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { reportPreset } from '@/lib/daily-reports';
import styles from './reports.module.css';

const views = [
  ['overview', 'Overview', ['super_admin','ads_admin','ads_finance','ads_support','report_auditor','report_contact_reveal']],
  ['delivery', 'Delivery & Traffic Quality', ['super_admin','ads_admin']],
  ['finance', 'Finance & Reconciliation', ['super_admin','ads_finance']],
  ['contacts', 'Account contacts', ['ads_support','ads_admin','report_auditor']],
  ['access', 'Report Access Audit', ['report_auditor']],
] as const;
const metricLabels: Record<string,string> = {
  paid_serves: 'Paid ad serves', promo_serves: 'Promo ad serves', quarantined_serves: 'Quarantined paid serves',
  posted_ad_spend_cents: 'Posted advertiser spend', pending_earnings_cents: 'Pending promoter earnings', cleared_earnings_cents: 'Cleared promoter earnings',
};
type Contact = { id: string; email: string | null; phone: string | null; has_email: boolean; has_phone: boolean };
type Audit = { position: string; actor_id: string | null; actor_roles: string[]; action: string; outcome: string; created_at: string; correlation_id: string; reason_code: string | null };

async function request(path: string, init?: RequestInit) {
  const response = await sessionFetch(path, { cache: 'no-store', ...init });
  if (!response.ok) throw new Error(response.status === 403 ? 'Your account does not have access to this report.' : 'The report could not be loaded. Please try again.');
  const body = await response.json();
  if (body.status !== 'success') throw new Error('Report unavailable.');
  return body.data;
}

export default function AdminReportsPage() {
  const query = useSearchParams();
  const { identityVersion } = useSessionSnapshot();
  return <ReportContent key={String(identityVersion) + ':' + query.toString()} query={query.toString()} />;
}

function ReportContent({ query }: { query: string }) {
  const router = useRouter();
  const params = new URLSearchParams(query);
  const view = views.some(([id]) => id === params.get('view')) ? params.get('view')! : 'overview';
  const [roles, setRoles] = useState<string[]>();
  const [data, setData] = useState<any>();
  const [error, setError] = useState('');
  const [revision, setRevision] = useState(0);
  const [from, setFrom] = useState(params.get('from') ?? reportPreset('7')[0]);
  const [to, setTo] = useState(params.get('to') ?? reportPreset('7')[1]);
  const [reason, setReason] = useState('');
  const [reveal, setReveal] = useState<{ key: string; value: string }>();
  const [revealing, setRevealing] = useState(false);
  const revealLock = useRef(false);
  const alive = useRef(true);
  const [integrity, setIntegrity] = useState<string>();
  const allowed = (required: readonly string[]) => roles?.some(role => required.includes(role)) ?? false;
  const current = views.find(([id]) => id === view)!;
  const page = Number(params.get('page') ?? '1');

  useEffect(() => { alive.current = true; return () => { alive.current = false; }; }, []);
  useEffect(() => {
    const controller = new AbortController();
    void sessionFetch('/api/v1/ecosystem/staff-status', { signal: controller.signal, cache: 'no-store' }).then(async response => {
      if (!response.ok) throw new Error();
      const body = await response.json();
      if (!body.data?.isStaff || !Array.isArray(body.data.roles)) throw new Error();
      if (!controller.signal.aborted) setRoles(body.data.roles);
    }).catch(() => { if (!controller.signal.aborted) setError('Report permissions could not be verified.'); });
    return () => controller.abort();
  }, [revision]);
  useEffect(() => {
    if (!roles || !allowed(current[2])) return;
    const controller = new AbortController();
    const filters = view === 'delivery' || view === 'finance'
      ? new URLSearchParams({ from, to }) : new URLSearchParams({ page: String(page) });
    void request('/api/v1/admin/reports/' + view + '?' + filters, { signal: controller.signal }).then(result => {
      if (!controller.signal.aborted) { setData(result); setError(''); }
    }).catch(() => { if (!controller.signal.aborted) setError('The report could not be loaded. Please try again.'); });
    return () => controller.abort();
    // Form edits are applied through the URL before querying.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roles, view, revision, query]);
  useEffect(() => {
    if (!reveal) return;
    const timer = window.setTimeout(() => setReveal(undefined), 30000);
    const hide = () => setReveal(undefined);
    window.addEventListener('blur', hide);
    document.addEventListener('visibilitychange', hide);
    return () => { window.clearTimeout(timer); window.removeEventListener('blur', hide); document.removeEventListener('visibilitychange', hide); };
  }, [reveal]);

  async function showContact(contact: Contact, field: 'email' | 'phone') {
    if (!reason || revealLock.current) return;
    revealLock.current = true; setRevealing(true); setReveal(undefined); setError('');
    try {
      const result = await request('/api/v1/admin/reports/contacts/' + contact.id + '/reveal', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ field, reason }),
      });
      if (typeof result.value !== 'string') throw new Error();
      if (alive.current) setReveal({ key: contact.id + ':' + field, value: result.value });
    } catch { if (alive.current) setError('The contact could not be revealed. Check your permission and try again.'); }
    finally { revealLock.current = false; if (alive.current) setRevealing(false); }
  }
  function pageLink(next: number) {
    const target = new URLSearchParams(query); target.set('page', String(next));
    router.push('/admin/reports?' + target);
  }
  return <section className={styles.root}>
    <h1 className="cf-page-title">Reports</h1>
    <nav className={styles.tabs} aria-label="Admin report views">{views.map(([id, label, required]) => {
      const next = new URLSearchParams(query); next.set('view', id); next.delete('page');
      return allowed(required) ? <Link key={id} href={'/admin/reports?' + next} aria-current={id === view ? 'page' : undefined}>{label}</Link> : <span key={id} aria-disabled="true">{label}</span>;
    })}</nav>
    {error && <div role="alert"><p>{error}</p><Button variant="outline" onClick={() => { setRoles(undefined); setData(undefined); setRevision(value => value + 1); }}>Try again</Button></div>}
    {!roles && !error && <p role="status">Checking report permissions…</p>}
    {roles && !allowed(current[2]) && <p>Your account does not have access to this report.</p>}
    {roles && allowed(current[2]) && !data && !error && <p role="status">Loading report…</p>}
    {data && <>
      {(view === 'delivery' || view === 'finance') && <form className={styles.filters} onSubmit={event => {
        event.preventDefault(); const next = new URLSearchParams({ view, from, to }); router.push('/admin/reports?' + next);
      }}><label>From<Input type="date" required value={from} max={to} onChange={event => setFrom(event.target.value)} /></label><label>To<Input type="date" required value={to} min={from} onChange={event => setTo(event.target.value)} /></label><Button type="submit">Apply</Button></form>}
      {view === 'overview' && <div className={styles.grid}>{data.sources?.map((source: {name: string;source: string;basis: string}) => <section className={styles.panel} key={source.name}><h2>{source.name}</h2><p>{source.source}</p><p>{source.basis}</p></section>)}</div>}
      {(view === 'delivery' || view === 'finance') && <>
        <p>{data.from} to {data.to} · {data.timezone} · Updated {new Date(data.updatedAt).toLocaleString()}</p>
        <div className={styles.grid}>{Object.keys(metricLabels).filter(key => key in (data.metrics ?? {})).map(key => <section className={styles.panel} key={key}>
          <h2>{metricLabels[key]}</h2><strong className={styles.amount}>{/^-?\d+$/.test(data.metrics[key]) ? key.endsWith('_cents') ? '$' + (BigInt(data.metrics[key]) / 100n).toLocaleString() + '.' + (BigInt(data.metrics[key]) % 100n).toString().padStart(2, '0') : BigInt(data.metrics[key]).toLocaleString() : 'Unavailable'}</strong>
        </section>)}</div>
        {view === 'delivery' ? <Link href="/admin/click-audit">Open Click Audit</Link> : <p>{data.basis} These totals show postings and their current status. Reconciliation cases remain in Traffic Adjustments.</p>}
      </>}
      {view === 'contacts' && <>
        {roles?.includes('report_contact_reveal') && <label className={styles.reason}>Investigation reason<select value={reason} onChange={event => { setReason(event.target.value); setReveal(undefined); }}><option value="">Choose a reason</option><option value="account_support">Account support</option><option value="payment_investigation">Payment investigation</option><option value="policy_review">Policy review</option></select></label>}
        <div className={styles.table}><Table><TableHeader><TableRow><TableHead>Account reference</TableHead><TableHead>Email</TableHead><TableHead>Phone</TableHead></TableRow></TableHeader><TableBody>{(data as Contact[]).map(contact => <TableRow key={contact.id}><TableCell>{contact.id}</TableCell>{(['email','phone'] as const).map(field => <TableCell key={field}>
          {reveal?.key === contact.id + ':' + field ? <><span>{reveal.value}</span><Button size="sm" variant="outline" onClick={() => setReveal(undefined)}>Hide {field}</Button></> : <><span>{contact[field] ?? 'Unavailable'}</span>{roles?.includes('report_contact_reveal') && contact[field === 'email' ? 'has_email' : 'has_phone'] && <Button size="sm" variant="outline" disabled={!reason || revealing} onClick={() => void showContact(contact, field)}>Show {field}</Button>}</>}
        </TableCell>)}</TableRow>)}</TableBody></Table></div>
      </>}
      {view === 'access' && <>
        <div className={styles.filters}><Button variant="outline" onClick={async () => { setIntegrity(undefined); try { const result = await request('/api/v1/admin/reports/access/integrity'); if (alive.current) setIntegrity(result.invalid_entries === '0' ? 'Audit hash chain verified across ' + result.entries + ' entries.' : 'Audit integrity needs investigation.'); } catch { if (alive.current) setError('Audit integrity could not be checked.'); } }}>Verify audit integrity</Button>{integrity && <p role="status">{integrity}</p>}</div>
        <div className={styles.table}><Table><TableHeader><TableRow><TableHead>UTC time</TableHead><TableHead>Actor</TableHead><TableHead>Action</TableHead><TableHead>Outcome</TableHead><TableHead>Correlation</TableHead></TableRow></TableHeader><TableBody>{(data as Audit[]).map(entry => <TableRow key={entry.position}><TableCell>{new Date(entry.created_at).toISOString()}</TableCell><TableCell>{entry.actor_id ?? 'Anonymous'}<p>{entry.actor_roles.join(', ')}</p></TableCell><TableCell>{entry.action}<p>{entry.reason_code}</p></TableCell><TableCell>{entry.outcome}</TableCell><TableCell>{entry.correlation_id}</TableCell></TableRow>)}</TableBody></Table></div>
      </>}
      {(view === 'contacts' || view === 'access') && <div className={styles.filters}><Button variant="outline" disabled={!Number.isSafeInteger(page) || page <= 1} onClick={() => pageLink(page - 1)}>Previous</Button><span>Page {page}</span><Button variant="outline" disabled={!Array.isArray(data) || data.length < 25} onClick={() => pageLink(page + 1)}>Next</Button></div>}
    </>}
  </section>;
}
