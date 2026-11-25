const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const React = require('react');
const { JSDOM } = require('jsdom');
const { createRoot } = require('react-dom/client');

function loadDailyReports(replyFn) {
  const source = fs.readFileSync(path.resolve(__dirname, '../src/lib/daily-reports.ts'), 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  });
  const exportsForTest = {};
  vm.runInNewContext(outputText, {
    exports: exportsForTest,
    URLSearchParams,
    require: () => ({ apiData: replyFn }),
  });
  return exportsForTest;
}

function loadTsx(relPath, deps = {}) {
  const full = path.join(__dirname, '..', relPath);
  const exports = {};
  const native = (tag) => ({ children, asChild, variant, size, ...props }) =>
    asChild ? children : React.createElement(tag, props, children);
  const baseDeps = {
    react: React,
    'lucide-react': new Proxy({}, { get: (_t, k) => (props) => React.createElement('span', { 'data-icon': String(k), ...props }) }),
    'next/link': { __esModule: true, default: native('a') },
    '../ui/button': { Button: native('button') },
    '../ui/badge': { Badge: native('span') },
    '../ui/card': {
      Card: native('div'),
      CardHeader: native('div'),
      CardTitle: native('h2'),
      CardDescription: native('p'),
      CardContent: native('div'),
    },
    '../ui/input': { Input: native('input') },
    '../ui': {
      Button: native('button'),
      Badge: native('span'),
      Input: native('input'),
      Card: native('div'),
      CardHeader: native('div'),
      CardTitle: native('h2'),
      CardDescription: native('p'),
      CardContent: native('div'),
    },
  };
  const code = ts.transpileModule(fs.readFileSync(full, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText;
  vm.runInNewContext(code, {
    exports,
    module: { exports },
    document: global.document,
    localStorage: global.localStorage,
    window: global.window,
    crypto: global.crypto,
    URLSearchParams: global.URLSearchParams,
    require: (n) => deps[n] ?? baseDeps[n] ?? require(n),
  });
  return exports;
}

test('PLAN-0155 dailyReport parser rejects cross-role bonus/promo leakage and parses valid cash+bonus split', async () => {
  let currentReply = null;
  const { readDailyReport, aggregateCampaigns } = loadDailyReports(async () => currentReply);
  const date = '2026-11-24';

  const validAdvertiser = {
    role: 'advertiser',
    timezone: 'Africa/Lagos',
    updatedAt: `${date}T12:00:00Z`,
    from: date,
    to: date,
    totals: {
      spend: '100000000',
      bonusSpend: '36500000',
      cpmSpend: '100000000',
      cpcSpend: '0',
      posted: '100000000',
      credits: '0',
      billableImpressions: '200',
      bonusImpressions: '73',
      billableClicks: '0',
      impressions: '273',
      clicks: '0',
      validClicks: '0',
      billedClicks: '0',
    },
    daily: [],
    breakdown: [
      {
        campaignId: 'camp-1',
        creativeId: 'cr-1',
        campaign: 'Bonus Camp',
        creative: 'Card 1',
        spend: '0',
        bonusSpend: '20000000',
        cpmSpend: '0',
        cpcSpend: '0',
        posted: '0',
        credits: '0',
        billableImpressions: '0',
        bonusImpressions: '40',
        billableClicks: '0',
        impressions: '40',
        clicks: '0',
        validClicks: '0',
        billedClicks: '0',
      },
      {
        campaignId: 'camp-1',
        creativeId: 'cr-2',
        campaign: 'Bonus Camp',
        creative: 'Card 2',
        spend: '0',
        bonusSpend: '16500000',
        cpmSpend: '0',
        cpcSpend: '0',
        posted: '0',
        credits: '0',
        billableImpressions: '0',
        bonusImpressions: '33',
        billableClicks: '0',
        impressions: '33',
        clicks: '0',
        validClicks: '0',
        billedClicks: '0',
      },
    ],
    comparison: null,
  };

  // Negative first: promoter metric leaked into advertiser payload rejected; non-numeric bonusSpend rejected
  currentReply = { ...validAdvertiser, totals: { ...validAdvertiser.totals, promoConfirmed: '0' } };
  await assert.rejects(readDailyReport('advertiser', '', new AbortController().signal), /unavailable/);

  currentReply = { ...validAdvertiser, totals: { ...validAdvertiser.totals, bonusSpend: 'abc' } };
  await assert.rejects(readDailyReport('advertiser', '', new AbortController().signal), /unavailable/);

  // Positive: valid advertiser & promoter payloads parse and aggregate cleanly
  currentReply = validAdvertiser;
  const parsedAdv = await readDailyReport('advertiser', '', new AbortController().signal);
  assert.equal(parsedAdv.totals.bonusSpend, '36500000');
  const [agg] = aggregateCampaigns(parsedAdv.breakdown);
  assert.equal(agg.bonusSpend, '36500000');
  assert.equal(agg.bonusImpressions, '73');

  currentReply = {
    role: 'promoter',
    timezone: 'Africa/Lagos',
    updatedAt: `${date}T12:00:00Z`,
    from: date,
    to: date,
    totals: {
      confirmed: '55000000',
      pending: '0',
      promoConfirmed: '20000000',
      promoPending: '275000',
      adjustments: '0',
      billableImpressions: '200',
      promoImpressions: '74',
      billableClicks: '0',
    },
    daily: [],
    breakdown: [],
    comparison: null,
  };
  const parsedPromo = await readDailyReport('promoter', '', new AbortController().signal);
  assert.equal(parsedPromo.totals.promoConfirmed, '20000000');
  assert.equal(parsedPromo.totals.promoPending, '275000');
});

test('PLAN-0155 AdminRewardsControlsView gates reserve transfers & proceeds to single super_admin and includes cfig_conversion_reserve', async () => {
  let transferPayload = null;

  async function renderForRole(canManage) {
    const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
      url: 'https://ads.crimfig.com/admin/rewards/controls',
    });
    const old = { window: global.window, document: global.document, IS_REACT_ACT_ENVIRONMENT: global.IS_REACT_ACT_ENVIRONMENT };
    Object.assign(global, { window: dom.window, document: dom.window.document, IS_REACT_ACT_ENVIRONMENT: true });

    const { AdminRewardsControlsView } = loadTsx('src/components/console/AdminRewardsControlsView.tsx', {
      '@/lib/session': {
        sessionFetch: async (url, init) => {
          if (url === '/api/v1/admin/rewards/controls/reserves/transfer' && init?.method === 'POST') {
            transferPayload = JSON.parse(init.body);
            return { ok: true, status: 201, json: async () => ({ status: 'success', data: { id: 'tx-1' } }) };
          }
          return {
            ok: true,
            status: 200,
            json: async () => ({
              status: 'success',
              data: {
                actorCapabilities: {
                  canManualSeedCommitment: canManage,
                  canTransferReserves: canManage,
                  canRecordOperatingProceeds: canManage,
                },
                switches: [],
                switchAudit: [],
                reserves: {
                  promotionalAdReserve: { remainingPromoBudgetCents: 2000, reservedLiabilityCents: 0, paidPromoterEarningsCents: 0, issuedBonusCreditsCents: 0, transferableCents: 2000 },
                  rewardsFund: { cashBalanceUsdCents: 20000, availableUsdCents: 20000, allocatedUsdCents: 0, fundedPendingUsdCents: 0, reserveFloorUsdCents: 10000, transferableCents: 10000 },
                  platformOperatingReserve: { availableCents: 5000, transferableCents: 5000 },
                  cfigConversionReserve: { availableCents: 2000, reservedCents: 0, spentCents: 0, transferableCents: 2000 },
                },
                transfers: [],
                alerts: [],
              },
            }),
          };
        },
      },
    });
    const root = createRoot(dom.window.document.getElementById('root'));
    await React.act(async () => root.render(React.createElement(AdminRewardsControlsView)));
    return {
      dom,
      cleanup: async () => {
        await React.act(async () => root.unmount());
        Object.assign(global, old);
        dom.window.close();
      },
    };
  }

  // Negative first: non-super_admin (e.g. ads_finance) sees read-only notices and cannot execute transfers or proceeds
  const financeView = await renderForRole(false);
  try {
    const text = financeView.dom.window.document.body.textContent;
    assert.match(text, /Inter-pool reserve transfers require a single super_admin role/);
    assert.match(text, /Recording realized platform proceeds requires a single super_admin role/);
    assert.equal(
      [...financeView.dom.window.document.querySelectorAll('button')].some((b) => /^Transfer$/.test(b.textContent)),
      false,
    );
  } finally {
    await financeView.cleanup();
  }

  // Positive: super_admin can select cfig_conversion_reserve and execute transfer
  const superView = await renderForRole(true);
  try {
    const doc = superView.dom.window.document;
    const win = superView.dom.window;
    const selects = [...doc.querySelectorAll('select')];
    assert.ok(selects.some((s) => [...s.options].some((o) => o.value === 'cfig_conversion_reserve')));

    const transferBtn = [...doc.querySelectorAll('button')].find((b) => /^Transfer$/.test(b.textContent));
    const transferForm = transferBtn.closest('form');
    const [fromSelect, toSelect] = [...transferForm.querySelectorAll('select')];
    const setReactVal = async (el, val) => {
      const key = Object.keys(el).find((k) => k.startsWith('__reactProps'));
      await React.act(async () => el[key].onChange({ target: { value: val } }));
    };
    await setReactVal(fromSelect, 'platform_operating_reserve');
    await setReactVal(toSelect, 'cfig_conversion_reserve');

    const [amountInput, reasonInput] = [...transferForm.querySelectorAll('input')];
    await setReactVal(amountInput, '10.00');
    await setReactVal(reasonInput, 'Allocate $10 to cfig conversion reserve');
    await React.act(async () => transferForm.dispatchEvent(new win.Event('submit', { bubbles: true, cancelable: true })));

    assert.ok(transferPayload);
    assert.equal(transferPayload.fromReserve, 'platform_operating_reserve');
    assert.equal(transferPayload.toReserve, 'cfig_conversion_reserve');
    assert.equal(transferPayload.amountCents, 1000);
  } finally {
    await superView.cleanup();
  }
});
