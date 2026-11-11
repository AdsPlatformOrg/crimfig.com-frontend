const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const { runInNewContext } = require('node:vm');
const ts = require('typescript');

const source = readFileSync(resolve(__dirname, '../src/lib/daily-reports.ts'), 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
});
const exportsForTest = {};
let reply;
let requested;
runInNewContext(outputText, {
  exports: exportsForTest, URLSearchParams,
  require: () => ({ apiData: async (path, init) => { requested = { path, init }; return reply; } }),
});
const { aggregateCampaigns, money, ratio, readDailyReport, reportPreset } = exportsForTest;

test('daily report rejects malformed or cross-workspace financial data', async () => {
  const signal = new AbortController().signal;
  reply = { role: 'advertiser', totals: {} };
  await assert.rejects(readDailyReport('promoter', 'compare=true', signal), /unavailable/);
  assert.match(requested.path, /compare=true&role=promoter$/);
  assert.equal(requested.init.signal, signal);
});

test('reports keep exact event nanos and sum campaign rows independently of posted debits', () => {
  const zeros = Object.fromEntries(['spend', 'cpmSpend', 'cpcSpend', 'posted', 'credits', 'confirmed',
    'pending', 'adjustments', 'billableImpressions', 'billableClicks', 'impressions', 'clicks', 'validClicks', 'billedClicks'].map(key => [key, '0']));
  const [campaign] = aggregateCampaigns([
    { ...zeros, campaignId: 'campaign', creativeId: 'ad', spend: '500000' },
    { ...zeros, campaignId: 'campaign', creativeId: null, posted: '10000000' },
  ]);
  assert.equal(money(campaign.spend), '$0.0005');
  assert.equal(money(campaign.posted), '$0.01');
  assert.equal(ratio('0', '0', 100), null);
});

test('completed-day presets use Lagos midnight and handle month transitions', () => {
  const now = new Date('2026-10-31T23:15:00Z');
  assert.deepEqual(Array.from(reportPreset('7', now)), ['2026-10-25','2026-10-31']);
  assert.deepEqual(Array.from(reportPreset('last-month', now)), ['2026-10-01','2026-10-31']);
});
