import { apiData, arrayData } from './api-data';

export async function dashboardData(period: string) {
  if (!['7d', '30d', '90d'].includes(period)) throw new Error('Custom date analytics are not supported yet.');
  const query = `?period=${period}`;
  const [summary, timeseries, channels, alerts] = await Promise.all([
    apiData<any>(`/api/v1/analytics/dashboard/summary${query}`), apiData(`/api/v1/analytics/dashboard/timeseries${query}`),
    apiData(`/api/v1/analytics/dashboard/channel-breakdown${query}`), apiData('/api/v1/analytics/dashboard/alerts'),
  ]);
  for (const group of ['campaignCounts', 'creativeAlertCounts', 'financials', 'performance']) {
    if (!summary?.[group] || !Object.values(summary[group]).every(value => typeof value === 'number' && Number.isFinite(value) && value >= 0)) throw new Error('Invalid analytics summary.');
  }
  if (!['impressions', 'clicks', 'hovers', 'touches', 'ctr', 'avgCpmUsd', 'avgCpcUsd'].every(key => typeof summary.performance[key] === 'number')) throw new Error('Incomplete analytics summary.');
  if (!['totalBudgetUsd','totalSpentUsd','remainingBudgetUsd'].every(key => typeof summary.financials[key] === 'number')) throw new Error('Incomplete analytics financials.');
  return { summary, timeseries: arrayData<any>(timeseries), channels: arrayData<any>(channels), alerts: arrayData<any>(alerts) };
}
