const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const React = require('react');
const { JSDOM } = require('jsdom');
const { createRoot } = require('react-dom/client');

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
    './AdvertiserMilestonesCard.module.css': { default: {} },
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

test('PLAN-0154 Admin navigation exposes Program Switches & Reserves to super_admin/ads_finance only', () => {
  const { workspaceNavigation, resolveWorkspaceContext } = loadTsx('src/lib/workspace-navigation.ts', {});
  const adminNav = workspaceNavigation('admin', ['super_admin']);
  const promoGroup = adminNav.find((g) => g.title === 'Promotional rewards');
  assert.ok(promoGroup);
  const ctrlItem = promoGroup.items.find((i) => i.href === '/admin/rewards/controls');
  assert.ok(ctrlItem);
  assert.equal(ctrlItem.label, 'Program Switches & Reserves');

  const reviewerNav = workspaceNavigation('admin', ['ads_reviewer']);
  assert.equal(reviewerNav.some((g) => g.title === 'Promotional rewards'), false);
  assert.deepStrictEqual([...resolveWorkspaceContext('/admin/rewards/controls')], ['admin', 'admin_rewards_controls']);
});

test('PLAN-0154 AdvertiserMilestonesCard shows error state on failure, all 7 tiers incl. Prestige, and enforces terms before claiming', async () => {
  const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: 'https://ads.crimfig.com/advertiser/rewards' });
  const old = { window: global.window, document: global.document, IS_REACT_ACT_ENVIRONMENT: global.IS_REACT_ACT_ENVIRONMENT };
  Object.assign(global, { window: dom.window, document: dom.window.document, IS_REACT_ACT_ENVIRONMENT: true });

  let failFirst = true;
  let postCalled = false;
  const samplePayload = {
    status: 'success',
    data: {
      policyVersion: 'advertiser-rewards-v2',
      evaluatedAt: '2026-11-22T18:00:00Z',
      monetaryProgram: { status: 'active', bonusClaimsEnabled: true, reason: 'Advertiser bonus credit program is active.' },
      progress: {
        totalCampaigns: 1,
        completedCampaignsAwaitingVerification: 0,
        verifiedCompletedCampaigns: 1,
        eligibleClearedSpendCents: 1000000,
        explanation: 'Progress reflects verified cash funding.',
      },
      definitions: [
        { tier: 'A1_FIRST_CAMPAIGN', title: 'A1 — First Advertiser', requirement: 'Spend $5', state: 'CLAIMABLE', cumulativeSpendTargetCents: 500, bonusCreditCents: 500 },
        { tier: 'A2_CONSISTENT', title: 'A2 — Consistent Advertiser', requirement: 'Spend $100', state: 'CLAIMABLE', cumulativeSpendTargetCents: 10000, bonusCreditCents: 1500 },
        { tier: 'A3_GROWTH', title: 'A3 — Growth Advertiser', requirement: 'Spend $500', state: 'CLAIMABLE', cumulativeSpendTargetCents: 50000, bonusCreditCents: 5000 },
        { tier: 'A4_TRUSTED', title: 'A4 — Trusted Advertiser', requirement: 'Spend $2,500 + 12mo', state: 'IN_PROGRESS', cumulativeSpendTargetCents: 250000, bonusCreditCents: 15000 },
        { tier: 'PRESTIGE_100', title: 'Prestige 10K', requirement: 'Spend $10,000', state: 'CLAIMABLE', isPrestige: true, cumulativeSpendTargetCents: 1000000, bonusCreditCents: 10000 },
        { tier: 'PRESTIGE_1000', title: 'Prestige 100K', requirement: 'Spend $100,000', state: 'IN_PROGRESS', isPrestige: true, cumulativeSpendTargetCents: 10000000, bonusCreditCents: 50000 },
        { tier: 'PRESTIGE_10000', title: 'Prestige 1M', requirement: 'Spend $1,000,000', state: 'IN_PROGRESS', isPrestige: true, cumulativeSpendTargetCents: 100000000, bonusCreditCents: 250000 },
      ],
      bonusWallet: {
        availableBonusCreditCents: 0,
        reservedBonusCreditCents: 0,
        consumedBonusCreditCents: 0,
        lifetimeClaimedCents: 0,
        lifetimeMaxCents: 332000,
        claims: [],
      },
      achievements: [],
    },
  };

  const { AdvertiserMilestonesCard } = loadTsx('src/components/console/AdvertiserMilestonesCard.tsx', {
    '../../lib/session': {
      sessionFetch: async (url, init) => {
        if (failFirst) return { ok: false, status: 503, json: async () => null };
        if (url === '/api/v1/advertiser/milestones/claim' && init?.method === 'POST') {
          postCalled = true;
          const body = JSON.parse(init.body);
          assert.equal(body.acceptTerms, true);
          return {
            ok: true,
            status: 201,
            json: async () => ({
              ...samplePayload,
              data: {
                ...samplePayload.data,
                definitions: samplePayload.data.definitions.map((d) =>
                  d.tier === body.milestoneId ? { ...d, state: 'CLAIMED', claimed: true } : d,
                ),
                bonusWallet: { ...samplePayload.data.bonusWallet, availableBonusCreditCents: 500, lifetimeClaimedCents: 500 },
              },
            }),
          };
        }
        return { ok: true, status: 200, json: async () => samplePayload };
      },
    },
  });

  const root = createRoot(dom.window.document.getElementById('root'));
  try {
    await React.act(async () => root.render(React.createElement(AdvertiserMilestonesCard)));
    assert.match(dom.window.document.body.textContent, /Rewards status is temporarily unavailable/);

    failFirst = false;
    await React.act(async () => dom.window.document.querySelector('button').click());

    const text = dom.window.document.body.textContent;
    assert.match(text, /Prestige 10K/);
    assert.match(text, /Prestige 100K/);
    assert.match(text, /Prestige 1M/);
    assert.match(text, /All 7 Milestones/);

    const claimBtn = [...dom.window.document.querySelectorAll('button')].find((b) => /Claim/.test(b.textContent));
    assert.equal(claimBtn.disabled, true);
    assert.equal(postCalled, false);

    const checkbox = dom.window.document.querySelector('input[type="checkbox"]');
    await React.act(async () => checkbox.click());
    const enabledClaimBtn = [...dom.window.document.querySelectorAll('button')].find((b) => /Claim/.test(b.textContent));
    assert.equal(enabledClaimBtn.disabled, false);
    await React.act(async () => enabledClaimBtn.click());
    assert.equal(postCalled, true);
  } finally {
    await React.act(async () => root.unmount());
    Object.assign(global, old);
    dom.window.close();
  }
});

test('PLAN-0154 AdminRewardsControlsView locks $CFIG->Points conversion OFF, exposes all reserves & transfers', async () => {
  const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: 'https://ads.crimfig.com/admin/rewards/controls' });
  const old = { window: global.window, document: global.document, IS_REACT_ACT_ENVIRONMENT: global.IS_REACT_ACT_ENVIRONMENT };
  Object.assign(global, { window: dom.window, document: dom.window.document, IS_REACT_ACT_ENVIRONMENT: true });

  const overviewData = {
    status: 'success',
    data: {
      switches: [
        { key: 'advertiser_bonus_credit', enabled: true, isLockedOff: false, label: 'Advertiser Bonus Ad Credit', description: 'Bonus claims' },
        { key: 'cfig_to_points_conversion', enabled: false, isLockedOff: true, label: '$CFIG -> Redeemable Points Conversion', description: 'Locked OFF' },
      ],
      switchAudit: [],
      reserves: {
        promotionalAdReserve: { remainingPromoBudgetCents: 2500, reservedLiabilityCents: 500, paidPromoterEarningsCents: 0, issuedBonusCreditsCents: 1500, transferableCents: 2000 },
        rewardsFund: { cashBalanceUsdCents: 20000, availableUsdCents: 15000, allocatedUsdCents: 5000, fundedPendingUsdCents: 0, reserveFloorUsdCents: 10000, transferableCents: 5000 },
        platformOperatingReserve: { availableCents: 40000, transferableCents: 40000 },
      },
      transfers: [],
      alerts: [{ id: '00000000-0000-4000-8000-000000000111', category: 'full_bonus_campaign', severity: 'info', summary: '100% bonus campaign submitted', status: 'open', createdAt: '2026-11-22T18:00:00Z' }],
    },
  };

  const { AdminRewardsControlsView } = loadTsx('src/components/console/AdminRewardsControlsView.tsx', {
    '@/lib/session': {
      sessionFetch: async () => ({ ok: true, status: 200, json: async () => overviewData }),
    },
  });

  const root = createRoot(dom.window.document.getElementById('root'));
  try {
    await React.act(async () => root.render(React.createElement(AdminRewardsControlsView)));
    const text = dom.window.document.body.textContent;
    assert.match(text, /Program Switches & Reserves/);
    assert.match(text, /Locked OFF/);
    assert.match(text, /Promotional Ad Reserve/);
    assert.match(text, /Platform Operating Reserve/);
    assert.match(text, /Silent Safety Notices \(1 open\)/);
    const toggleButtons = [...dom.window.document.querySelectorAll('button')].filter((b) => /Turn (ON|OFF)/.test(b.textContent));
    assert.equal(toggleButtons.length, 1);
  } finally {
    await React.act(async () => root.unmount());
    Object.assign(global, old);
    dom.window.close();
  }
});
