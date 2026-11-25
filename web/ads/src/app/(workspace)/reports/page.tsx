'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useSessionSnapshot } from '@/components/SessionGate';
import { aggregateCampaigns, metric, money, ratio, readDailyReport, reportPreset, type DailyReport, type Metrics, type ReportRole } from '@/lib/daily-reports';
import { ecosystemOrigin } from '../../../../../../shared/ui/origins';
import styles from './reports.module.css';

const presets = [['7','Last 7 days'], ['30','Last 30 days'], ['today','Today'], ['yesterday','Yesterday'],
  ['month','This month'], ['last-month','Last month'], ['custom','Custom range']];
const count = (value: string) => BigInt(value).toLocaleString('en-US');
const percent = (value: number | null) => value === null ? 'Unavailable' : value.toFixed(2) + '%';
const cost = (value: number | null) => value === null ? 'Unavailable' : '$' + value.toFixed(4);

export default function ReportsPage() {
  const params = useSearchParams();
  const { identityVersion } = useSessionSnapshot();
  const role = params.get('workspace') === 'promoter' ? 'promoter' : 'advertiser';
  return <ReportWorkspace key={identityVersion + ':' + role + ':' + params.toString()} role={role} params={params.toString()} />;
}

function ReportWorkspace({ role, params }: { role: ReportRole; params: string }) {
  const router = useRouter();
  const query = useMemo(() => new URLSearchParams(params), [params]);
  const [preset, setPreset] = useState(query.get('preset') ?? (query.has('from') ? 'custom' : '7'));
  const [from, setFrom] = useState(query.get('from') ?? reportPreset('7')[0]);
  const [to, setTo] = useState(query.get('to') ?? reportPreset('7')[1]);
  const [compare, setCompare] = useState(query.get('compare') === 'true');
  const [state, setState] = useState<{ report?: DailyReport; error?: string }>({});
  const [retry, setRetry] = useState(0);
  const [groupBy, setGroupBy] = useState<'campaign' | 'ad'>('campaign');
  const viewParam = query.get('view');
  const view = viewParam === 'daily' || viewParam === 'breakdown' ? viewParam : 'overview';
  const views = [
    ['overview', 'Overview'],
    ['daily', role === 'promoter' ? 'Daily Activity' : 'Daily Performance'],
    ['breakdown', role === 'promoter' ? 'Breakdown' : 'Campaign & Ad Breakdown'],
  ] as const;
  const [page, setPage] = useState(0);
  const promoter = role === 'promoter';
  useEffect(() => {
    const controller = new AbortController();
    const filters = new URLSearchParams();
    for (const key of ['from', 'to', 'compare']) {
      const value = query.get(key);
      if (value !== null) filters.set(key, value);
    }
    readDailyReport(role, filters.toString(), controller.signal).then(
      report => { if (!controller.signal.aborted) setState({ report }); },
      error => { if (!controller.signal.aborted) setState({ error: error.message }); },
    );
    return () => controller.abort();
  }, [query, role, retry]);
  const report = state.report;
  const groups = report ? (groupBy === 'campaign' ? aggregateCampaigns(report.breakdown) : report.breakdown) : [];
  const pageSize = 20;
  return (
    <div className={styles.root}>
      <header>
        <h1 className={styles.title}>{promoter ? 'Earnings report' : 'Advertising report'}</h1>
        <p className={styles.secondary}>{promoter ? 'Daily promoter earnings by campaign and ad.' : 'Daily delivery, spend and billing by campaign and ad.'}</p>
      </header>
      <form className={styles.filters} onSubmit={event => {
        event.preventDefault();
        const next = new URLSearchParams({ from, to, preset, compare: String(compare) });
        if (promoter) next.set('workspace', 'promoter');
        if (view !== 'overview') next.set('view', view);
        router.push('/reports?' + next.toString());
      }}>
        <label>Period<select value={preset} onChange={event => {
          const next = event.target.value;
          setPreset(next);
          if (next !== 'custom') {
            const [start, end] = reportPreset(next);
            setFrom(start); setTo(end);
          }
        }}>{presets.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        <label>From<Input type="date" required value={from} max={to} onChange={event => { setFrom(event.target.value); setPreset('custom'); }} /></label>
        <label>To<Input type="date" required value={to} min={from} max={reportPreset('today')[1]} onChange={event => { setTo(event.target.value); setPreset('custom'); }} /></label>
        <label className={styles.compare}><input type="checkbox" checked={compare} onChange={event => setCompare(event.target.checked)} /> Compare previous period</label>
        <Button type="submit">Apply</Button>
      </form>
      <nav className={styles.views} aria-label="Report views">
        {views.map(([id, label]) => {
          const next = new URLSearchParams(params);
          next.set('view', id);
          return <Link href={'/reports?' + next.toString()} key={id} aria-current={view === id ? 'page' : undefined}>{label}</Link>;
        })}
      </nav>
      {state.error && <div role="alert" className={styles.surface}><p>{state.error}</p><Button variant="outline" onClick={() => { setState({}); setRetry(value => value + 1); }}>Retry</Button></div>}
      {!state.error && !report && <p role="status">Loading report…</p>}
      {report && <>
        <p className={styles.secondary}>{report.from} to {report.to} · {report.timezone} · Updated {new Intl.DateTimeFormat('en-GB', {
          dateStyle: 'medium', timeStyle: 'short', timeZone: report.timezone,
        }).format(new Date(report.updatedAt))}</p>
        {view === 'overview' && <>
          <Summary report={report} />
          {promoter ? <p className={styles.secondary}>Earnings and withdrawals are tracked separately.{' '}
            <a href={new URL('/transactions', ecosystemOrigin('billing', process.env.NEXT_PUBLIC_BILLING_WEB_URL)).href}>View wallet transactions</a>
          </p> : <p className={styles.secondary}><Link href="/billing">View Billing &amp; Wallet</Link></p>}
          {report.comparison && <Comparison report={report} />}
          <section className={styles.surface}><h2>{promoter ? 'Earnings trend' : 'Spend trend'}</h2><Trend report={report} /></section>
        </>}
        {view === 'daily' && <section className={styles.surface} aria-labelledby="daily-report-title">
          <h2 id="daily-report-title">{promoter ? 'Daily activity' : 'Daily performance'}</h2>
          <p className={styles.secondary}>{promoter ? 'Earnings follow the qualifying event date. Recoveries appear on their posting date.' :
            'Event spend follows the qualifying event date. Debits and credits follow their posting date. A debit can include fractional spend carried from an earlier day.'}</p>
          <ReportTable role={role} label="Date" rows={report.daily.map(row => ({ key: row.date, label: row.date + (row.incomplete ? ' · In progress' : ''), metrics: row }))} />
        </section>}
        {view === 'breakdown' && <section className={styles.surface} aria-labelledby="report-breakdown-title">
          <div className={styles.sectionHeading}><h2 id="report-breakdown-title">Breakdown</h2>
            <label>Group by <select value={groupBy} onChange={event => { setGroupBy(event.target.value === 'ad' ? 'ad' : 'campaign'); setPage(0); }}>
              <option value="campaign">Campaign</option><option value="ad">Ad</option>
            </select></label>
          </div>
          {groups.length === 0 ? <p>No recorded activity in this period.</p> : <>
            <ReportTable role={role} label={groupBy === 'campaign' ? 'Campaign' : 'Campaign / Ad'} rows={groups.slice(page * pageSize, (page + 1) * pageSize).map(row => ({
              key: (row.campaignId ?? '') + ':' + (row.creativeId ?? ''),
              label: (promoter && row.campaignId ? 'Campaign ' + row.campaignId.slice(0, 12) : row.campaign || 'Campaign unavailable') + (groupBy === 'ad' ? ' / ' + (promoter && row.creativeId ? 'Ad ' + row.creativeId.slice(0, 12) : row.creative || (row.creativeId ? 'Untitled ad' : 'Campaign-level posting')) : ''),
              metrics: row,
            }))} />
            {groups.length > pageSize && <div className={styles.pagination}>
              <Button variant="outline" disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</Button>
              <span>{page + 1} of {Math.ceil(groups.length / pageSize)}</span>
              <Button variant="outline" disabled={(page + 1) * pageSize >= groups.length} onClick={() => setPage(page + 1)}>Next</Button>
            </div>}
          </>}
        </section>}
      </>}
    </div>
  );
}

function Summary({ report }: { report: DailyReport }) {
  const t = report.totals;
  const cards = report.role === 'promoter' ? [
    ['Confirmed earnings (cash)', money(metric(t, 'confirmed'))], ['Pending earnings (cash)', money(metric(t, 'pending'))],
    ['Promotional confirmed earnings', money(metric(t, 'promoConfirmed'))], ['Promotional pending earnings', money(metric(t, 'promoPending'))],
    ['Average confirmed per selected day', money(BigInt(metric(t, 'confirmed')) / BigInt(report.daily.length || 1), false)],
    ['Earnings adjustments', money(metric(t, 'adjustments'))],
  ] : [
    ['Event spend (cash)', money(metric(t, 'spend'))], ['Bonus credit spend', money(metric(t, 'bonusSpend'))],
    ['Posted debits', money(metric(t, 'posted'))], ['Posted credits', money(metric(t, 'credits'))],
    ['Billable impressions', count(metric(t, 'billableImpressions'))], ['Bonus impressions', count(metric(t, 'bonusImpressions'))],
    ['Observed clicks', count(metric(t, 'clicks'))], ['Valid clicks', count(metric(t, 'validClicks'))], ['Billed clicks', count(metric(t, 'billedClicks'))], ['Billable clicks', count(metric(t, 'billableClicks'))],
    ['Observed CTR', percent(ratio(metric(t, 'clicks'), metric(t, 'impressions'), 100))],
    ['Cost per billable click', cost(ratio(metric(t, 'cpcSpend'), metric(t, 'billableClicks'), 1e-9))],
    ['Cost per 1,000 billable impressions', cost(ratio(metric(t, 'cpmSpend'), metric(t, 'billableImpressions'), 1e-6))],
  ];
  return <dl className={styles.cards}>{cards.map(([label, value]) => <div className={styles.surface} key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>;
}

function Comparison({ report }: { report: DailyReport }) {
  if (!report.comparison) return null;
  const key = report.role === 'promoter' ? 'confirmed' : 'spend';
  const previous = metric(report.comparison.totals, key);
  const delta = BigInt(metric(report.totals, key)) - BigInt(previous);
  return <section className={styles.surface}>
    <h2>Previous period</h2>
    <p>{report.comparison.from} to {report.comparison.to} · {money(previous)}</p>
    <p>Change in {key === 'spend' ? 'event spend' : 'confirmed earnings'} {money(delta)} · {percent(ratio(delta.toString(), previous, 100))}</p>
  </section>;
}

function Trend({ report }: { report: DailyReport }) {
  const key = report.role === 'promoter' ? 'confirmed' : 'spend';
  const values = report.daily.map(row => Number(metric(row, key)));
  const max = Math.max(0, ...values);
  if (!max || values.length < 2) return <p className={styles.secondary}>No trend to display for this period.</p>;
  return <div aria-hidden="true" className={styles.trend}>{values.map((value, index) =>
    <span key={report.daily[index].date} style={{ height: (value / max * 100) + '%' }}
      title={report.daily[index].date + ' ' + money(metric(report.daily[index], key))} />)}</div>;
}

function ReportTable({ role, label, rows }: { role: ReportRole; label: string; rows: { key: string; label: string; metrics: Metrics }[] }) {
  const promoter = role === 'promoter';
  const columns: { key: keyof Metrics; label: string; currency?: boolean }[] = promoter ? [
    { key: 'confirmed', label: 'Confirmed', currency: true }, { key: 'pending', label: 'Pending', currency: true },
    { key: 'adjustments', label: 'Adjustments', currency: true },
  ] : [
    { key: 'spend', label: 'Event spend', currency: true }, { key: 'posted', label: 'Posted debits', currency: true },
    { key: 'credits', label: 'Posted credits', currency: true },
  ];
  return <div className={styles.tableRegion} tabIndex={0} role="region" aria-label={label + ' report table'}>
    <Table aria-label={label + ' report'}>
      <TableHeader><TableRow><TableHead scope="col">{label}</TableHead>
        {columns.map(column => <TableHead key={column.key} scope="col">{column.label}</TableHead>)}
        <TableHead scope="col">Billable impressions</TableHead><TableHead scope="col">Billable clicks</TableHead>
      </TableRow></TableHeader>
      <TableBody>{rows.map(row => <TableRow key={row.key}><th scope="row" className={styles.rowLabel}>{row.label}</th>
        {columns.map(column => <TableCell key={column.key}>{column.currency ? money(metric(row.metrics, column.key)) : count(metric(row.metrics, column.key))}</TableCell>)}
        <TableCell>{count(metric(row.metrics, 'billableImpressions'))}</TableCell><TableCell>{count(metric(row.metrics, 'billableClicks'))}</TableCell>
      </TableRow>)}</TableBody>
    </Table>
  </div>;
}
