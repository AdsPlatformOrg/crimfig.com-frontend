import { apiData } from './api-data';

const keys = ['spend', 'cpmSpend', 'cpcSpend', 'posted', 'credits', 'confirmed', 'pending', 'adjustments',
  'billableImpressions', 'billableClicks', 'impressions', 'clicks', 'validClicks', 'billedClicks'] as const;
export type Metrics = Partial<Record<(typeof keys)[number], string>>;
const earningsKeys = ['confirmed', 'pending', 'adjustments', 'billableImpressions', 'billableClicks'] as const;
const spendKeys = keys.filter(key => key !== 'confirmed' && key !== 'pending' && key !== 'adjustments');
export type ReportRole = 'advertiser' | 'promoter';
type Breakdown = Metrics & {
  campaignId: string | null; creativeId: string | null; campaign?: string | null; creative?: string | null;
};
export type DailyReport = {
  role: ReportRole; timezone: string; updatedAt: string; from: string; to: string;
  daily: (Metrics & { date: string; incomplete: boolean })[];
  totals: Metrics;
  breakdown: Breakdown[];
  comparison: { from: string; to: string; totals: Metrics } | null;
};
const day = (value: unknown) => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
function metrics(value: unknown, role: ReportRole): value is Metrics {
  if (!value || typeof value !== 'object') return false;
  const allowed: readonly (keyof Metrics)[] = role === 'promoter' ? earningsKeys : spendKeys;
  const row = value as Metrics;
  return allowed.every(key => typeof row[key] === 'string' && /^-?\d+$/.test(row[key]!)) &&
    keys.every(key => allowed.includes(key) || !(key in row));
}

export function metric(row: Metrics, key: keyof Metrics): string {
  const value = row[key];
  if (value === undefined) throw new Error('Report metric is unavailable.');
  return value;
}

export async function readDailyReport(role: ReportRole, filters: string, signal: AbortSignal) {
  const query = new URLSearchParams(filters);
  query.set('role', role);
  const data = await apiData<DailyReport>('/api/v1/reports/daily?' + query, { signal, cache: 'no-store' });
  if (!data || data.role !== role || data.timezone !== 'Africa/Lagos' ||
    !Number.isFinite(Date.parse(data.updatedAt)) || !day(data.from) || !day(data.to) || !metrics(data.totals, role) ||
    !Array.isArray(data.daily) || !data.daily.every(row => metrics(row, role) && day(row.date) && typeof row.incomplete === 'boolean') ||
    !Array.isArray(data.breakdown) || !data.breakdown.every(row => metrics(row, role) &&
      [row.campaignId, row.creativeId].every(value => value === null || typeof value === 'string') &&
      (role === 'promoter'
        ? !('campaign' in row) && !('creative' in row) &&
          [row.campaignId, row.creativeId].every(value => value === null || /^[0-9a-f]{64}$/.test(value))
        : [row.campaign, row.creative].every(value => value === null || typeof value === 'string'))) ||
    (data.comparison !== null && (!data.comparison || !day(data.comparison.from) ||
      !day(data.comparison.to) || !metrics(data.comparison.totals, role)))) {
    throw new Error('Report data is unavailable.');
  }
  return data;
}

export function aggregateCampaigns(rows: Breakdown[]): Breakdown[] {
  const groups = new Map<string | null, Breakdown>();
  for (const row of rows) {
    const prior = groups.get(row.campaignId);
    if (!prior) groups.set(row.campaignId, { ...row, creativeId: null, creative: null });
    else for (const key of keys) {
      if (row[key] !== undefined) prior[key] = (BigInt(metric(prior, key)) + BigInt(metric(row, key))).toString();
    }
  }
  return [...groups.values()];
}

export function money(value: string | bigint, exact = true): string {
  const amount = BigInt(value);
  const abs = amount < 0n ? -amount : amount;
  const nanos = exact ? abs : (abs + 5_000_000n) / 10_000_000n * 10_000_000n;
  const cents = (nanos % 1_000_000_000n).toString().padStart(9, '0').replace(/0+$/, '').padEnd(2, '0');
  return (amount < 0n ? '−' : '') + '$' + (nanos / 1_000_000_000n).toLocaleString('en-US') + '.' + cents;
}

export function ratio(numerator: string, denominator: string, scale = 1) {
  return BigInt(denominator) === 0n ? null : Number(numerator) / Number(denominator) * scale;
}

export function reportPreset(preset: string, now = new Date()): [string, string] {
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Lagos',
    year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
  const d = new Date(today + 'T00:00:00Z');
  const shift = (days: number) => new Date(d.getTime() + days * 86_400_000).toISOString().slice(0, 10);
  const monthStart = today.slice(0, 7) + '-01';
  if (preset === 'today') return [today, today];
  if (preset === 'yesterday') return [shift(-1), shift(-1)];
  if (preset === 'month') return [monthStart, today];
  if (preset === 'last-month') {
    const last = new Date(Date.parse(monthStart) - 86_400_000).toISOString().slice(0, 10);
    return [last.slice(0, 7) + '-01', last];
  }
  return [shift(preset === '30' ? -30 : -7), shift(-1)];
}
