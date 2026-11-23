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

  const rechartsStub = new Proxy(
    {},
    {
      get: (_target, prop) => {
        const name = String(prop);
        return ({ children, data, ...rest }) =>
          React.createElement(
            'div',
            { 'data-recharts': name, 'data-count': Array.isArray(data) ? String(data.length) : undefined },
            children,
          );
      },
    },
  );

  const baseDeps = {
    react: React,
    'lucide-react': new Proxy({}, { get: (_t, k) => (props) => React.createElement('span', { 'data-icon': String(k), ...props }) }),
    'next/link': { __esModule: true, default: native('a') },
    recharts: rechartsStub,
    '../ui': {
      Alert: native('div'),
      AlertDescription: native('div'),
      Badge: native('span'),
      Button: native('button'),
      Card: native('div'),
      CardContent: native('div'),
      CardDescription: native('p'),
      CardHeader: native('div'),
      CardTitle: native('h2'),
      ChartContainer: ({ children, ...props }) =>
        React.createElement('div', { 'data-slot': 'chart', ...props }, children),
      ChartLegend: () => React.createElement('div', { 'data-chart-legend': '1' }),
      ChartLegendContent: () => null,
      ChartTooltip: () => React.createElement('div', { 'data-chart-tooltip': '1' }),
      ChartTooltipContent: () => null,
      Skeleton: native('div'),
      Table: native('table'),
      TableBody: native('tbody'),
      TableCell: native('td'),
      TableHead: native('th'),
      TableHeader: native('thead'),
      TableRow: native('tr'),
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

async function mountOverview(sessionFetch) {
  const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
    url: 'https://ads.crimfig.com/admin/overview',
  });
  global.window = dom.window;
  global.document = dom.window.document;
  global.IS_REACT_ACT_ENVIRONMENT = true;

  const { AdminPlatformOverview } = loadTsx('src/components/console/AdminPlatformOverview.tsx', {
    '@/lib/session': { sessionFetch },
  });

  const root = createRoot(dom.window.document.getElementById('root'));
  await React.act(async () => {
    root.render(React.createElement(AdminPlatformOverview));
  });
  await React.act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
  return { dom, root };
}

test('PLAN-0160 Admin navigation exposes Platform Overview first for staff roles', () => {
  const { workspaceNavigation, resolveWorkspaceContext } = loadTsx('src/lib/workspace-navigation.ts', {});
  const adminNav = workspaceNavigation('admin', ['ads_admin']);
  assert.equal(adminNav[0].items[0].id, 'admin_overview');
  assert.equal(adminNav[0].items[0].href, '/admin/overview');
  assert.equal(adminNav[0].items[0].label, 'Platform Overview');
  assert.deepEqual(Array.from(resolveWorkspaceContext('/admin/overview')), ['admin', 'admin_overview']);
});

test('Negative-first: API denial fails closed without fabricating zero dials or summary cards', async () => {
  const { dom, root } = await mountOverview(async () => ({
    ok: false,
    status: 403,
    json: async () => ({ status: 'error', message: 'Forbidden' }),
  }));

  try {
    const text = dom.window.document.body.textContent;
    assert.match(text, /does not have permission to view platform overview metrics/i);
    assert.doesNotMatch(text, /User Verification Dial/);
    assert.doesNotMatch(text, /Ecosystem Onboarding Funnel/);
  } finally {
    await React.act(async () => root.unmount());
    dom.window.close();
  }
});

test('Zero-value honesty: genuine zeros render 0 counts and 0% dials without NaN', async () => {
  const zeroPayload = {
    windowDays: 30,
    generatedAt: '2026-11-23T05:00:00.000Z',
    users: { totalSignedUp: 0, emailVerified: 0, activeAccounts: 0, pendingVerification: 0, suspended: 0, newInWindow: 0 },
    websites: {
      totalPromoters: 0, setup: 0, verified: 0, pendingVerification: 0, failedVerification: 0,
      policyApproved: 0, withSlotsCreated: 0, withSlotsAdded: 0, pinging7d: 0, newInWindow: 0,
    },
    adSlots: {
      created: 0, addedVerified: 0, liveActive: 0, pendingInstall: 0, retired: 0, newInWindow: 0,
      byType: { consideration: 0, network: 0, direct: 0, hybrid: 0 },
    },
    campaigns: { advertisersWithCampaigns: 0, total: 0, active: 0, underReview: 0, draft: 0, paused: 0, paidServesInWindow: 0, houseServesInWindow: 0 },
    rates: { userVerificationPct: 0, websiteVerificationPct: 0, websiteSlotCoveragePct: 0, websiteEmbedInstallPct: 0, slotInstallPct: 0 },
    dailySeries: [{ date: '2026-11-23', usersSignedUp: 0, websitesSetup: 0, websitesVerified: 0, slotsCreated: 0, slotsAdded: 0 }],
  };

  const { dom, root } = await mountOverview(async () => ({
    ok: true,
    status: 200,
    json: async () => ({ status: 'success', data: zeroPayload }),
  }));

  try {
    const text = dom.window.document.body.textContent;
    assert.match(text, /User Verification Dial/);
    assert.match(text, /0%/);
    assert.doesNotMatch(text, /NaN/);
  } finally {
    await React.act(async () => root.unmount());
    dom.window.close();
  }
});

test('Populated metrics render dials, KPI badges, charts, funnel table, and switch window days cleanly', async () => {
  const requestedUrls = [];
  const makePayload = (days) => ({
    windowDays: days,
    generatedAt: '2026-11-23T05:30:00.000Z',
    users: { totalSignedUp: 142, emailVerified: 118, activeAccounts: 115, pendingVerification: 24, suspended: 3, newInWindow: days === 7 ? 9 : 27 },
    websites: {
      totalPromoters: 48, setup: 55, verified: 44, pendingVerification: 7, failedVerification: 4,
      policyApproved: 38, withSlotsCreated: 36, withSlotsAdded: 29, pinging7d: 26, newInWindow: 11,
    },
    adSlots: {
      created: 80, addedVerified: 56, liveActive: 50, pendingInstall: 24, retired: 2, newInWindow: 15,
      byType: { consideration: 36, network: 28, direct: 12, hybrid: 4 },
    },
    campaigns: { advertisersWithCampaigns: 19, total: 33, active: 14, underReview: 4, draft: 10, paused: 5, paidServesInWindow: 2400, houseServesInWindow: 610 },
    rates: { userVerificationPct: 83.1, websiteVerificationPct: 80, websiteSlotCoveragePct: 65.5, websiteEmbedInstallPct: 52.7, slotInstallPct: 70 },
    dailySeries: [
      { date: '2026-11-22', usersSignedUp: 4, websitesSetup: 2, websitesVerified: 2, slotsCreated: 3, slotsAdded: 2 },
      { date: '2026-11-23', usersSignedUp: 5, websitesSetup: 3, websitesVerified: 1, slotsCreated: 4, slotsAdded: 3 },
    ],
  });

  const { dom, root } = await mountOverview(async (url) => {
    requestedUrls.push(String(url));
    const days = String(url).includes('days=7') ? 7 : 30;
    return {
      ok: true,
      status: 200,
      json: async () => ({ status: 'success', data: makePayload(days) }),
    };
  });

  try {
    const doc = dom.window.document;
    const text = doc.body.textContent;
    assert.match(text, /Platform Overview/);
    assert.match(text, /83\.1%/);
    assert.match(text, /142/);
    assert.match(text, /55/);
    assert.match(text, /80/);
    assert.match(text, /56/);
    assert.match(text, /Daily Ecosystem Growth \(30 Days\)/);
    assert.match(text, /Ecosystem Onboarding Funnel/);
    assert.equal(doc.querySelectorAll('[data-recharts="RadialBarChart"]').length, 4);
    assert.equal(doc.querySelectorAll('[data-recharts="AreaChart"]').length, 1);
    assert.equal(doc.querySelectorAll('[data-recharts="BarChart"]').length, 1);

    const btn7d = Array.from(doc.querySelectorAll('button')).find((b) => b.textContent === '7D');
    assert.ok(btn7d);
    await React.act(async () => {
      btn7d.click();
    });
    await React.act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    assert.equal(requestedUrls.some((u) => u.includes('/api/v1/admin/platform-metrics?days=7')), true);
    assert.match(doc.body.textContent, /Daily Ecosystem Growth \(7 Days\)/);
  } finally {
    await React.act(async () => root.unmount());
    dom.window.close();
  }
});
