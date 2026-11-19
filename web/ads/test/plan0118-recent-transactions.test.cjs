const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const Module = require('node:module');
const path = require('node:path');
const ts = require('typescript');
const { JSDOM } = require('jsdom');

test('recent Billing preview handles unavailable, empty and five-row responses', async () => {
  const dom = new JSDOM('<main></main>');
  const previous = new Map(['window', 'document', 'IS_REACT_ACT_ENVIRONMENT'].map(key => [key, Object.getOwnPropertyDescriptor(global, key)]));
  global.window = dom.window;
  global.document = dom.window.document;
  global.IS_REACT_ACT_ENVIRONMENT = true;
  const React = require('react');
  const root = require('react-dom/client').createRoot(document.querySelector('main'));
  const load = Module._load;
  const extensions = { '.tsx': require.extensions['.tsx'], '.ts': require.extensions['.ts'] };
  require.extensions['.tsx'] = require.extensions['.ts'] = (module, filename) => module._compile(
    ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText, filename);
  let reply;
  Module._load = function (name, parent, isMain) {
    if (name === '../../../lib/api-data') return { apiData: (route, options) => {
      assert.equal(route, '/api/v1/ads/billing/recent-transactions');
      assert.ok(options.signal);
      return reply();
    } };
    if (name === '@/lib/utils') return load.call(this, path.resolve(__dirname, '../src/lib/utils.ts'), parent, isMain);
    return load.call(this, name, parent, isMain);
  };
  try {
    const { RecentBillingTransactions } = require('../src/components/console/billing/RecentBillingTransactions.tsx');
    const render = async (key, response) => {
      reply = response;
      await React.act(async () => root.render(React.createElement(RecentBillingTransactions, { key })));
    };
    await render('unavailable', async () => { throw Error('offline'); });
    assert.match(document.querySelector('main').textContent, /unavailable/);
    assert.equal(document.querySelector('table'), null);
    await render('empty', async () => ({items: []}));
    assert.match(document.querySelector('main').textContent, /No transactions yet/);
    await render('rows', async () => ({items: Array.from({length: 5}, (_, i) => ({
      id: String(i), type: 'wallet_fund', status: 'completed', amountUsdCents: i * 100, createdAt: '2026-11-19T12:00:00Z',
    }))}));
    assert.equal(document.querySelectorAll('tbody tr').length, 5);
    assert.match(document.querySelector('tbody tr').textContent, /\$0\.00/);
    assert.equal(document.querySelectorAll('th[scope="col"]').length, 4);
  } finally {
    await React.act(async () => root.unmount());
    Module._load = load;
    for (const [key, value] of Object.entries(extensions)) {
      if (value) require.extensions[key] = value;
      else delete require.extensions[key];
    }
    for (const [key, descriptor] of previous) {
      if (descriptor) Object.defineProperty(global, key, descriptor);
      else delete global[key];
    }
    dom.window.close();
  }
});

test('Ads rewrites only the preview path to the Billing transaction list with a limit of five', async () => {
  const previousTs = require.extensions['.ts'];
  const environment = {
    RAILWAY_ENVIRONMENT_NAME: 'staging',
    ADS_API_BACKEND_URL: 'https://ads-api-staging.up.railway.app',
    AUTH_API_BACKEND_URL: 'https://auth-api-staging.up.railway.app',
    BILLING_API_BACKEND_URL: 'https://billing-api-staging.up.railway.app',
  };
  const previous = new Map([...Object.keys(environment), 'NEXT_PUBLIC_BILLING_API_URL'].map(key => [key, process.env[key]]));
  Object.assign(process.env, environment);
  require.extensions['.ts'] = (module, filename) => module._compile(
    ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, filename);
  try {
    const rules = await require('../next.config.ts').default.rewrites();
    const preview = rules.findIndex(rule => rule.source === '/api/v1/ads/billing/recent-transactions');
    assert.ok(preview >= 0 && preview < rules.findIndex(rule => rule.source === '/api/:path*'));
    assert.equal(rules[preview].destination, environment.BILLING_API_BACKEND_URL + '/api/v1/transactions?limit=5');
    delete process.env.BILLING_API_BACKEND_URL;
    delete process.env.NEXT_PUBLIC_BILLING_API_URL;
    const fallback = await require('../next.config.ts').default.rewrites();
    assert.equal(fallback.some(rule => rule.source === rules[preview].source), false);
    assert.ok(fallback.some(rule => rule.source === '/api/:path*'));
    process.env.BILLING_API_BACKEND_URL = 'https://billing-api-production-bb4c.up.railway.app';
    await assert.rejects(require('../next.config.ts').default.rewrites(), /points to production/);
  } finally {
    if (previousTs) require.extensions['.ts'] = previousTs;
    else delete require.extensions['.ts'];
    for (const [key, value] of previous) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
});
