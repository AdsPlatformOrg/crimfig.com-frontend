const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { JSDOM } = require('jsdom');
const React = require('react');
const { createRoot } = require('react-dom/client');
const ts = require('typescript');

function load(file, dependencies) {
  const source = fs.readFileSync(path.resolve(__dirname, '../src', file), 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2020 },
  });
  const exports = {};
  vm.runInNewContext(outputText, {
    exports, URLSearchParams, AbortController,
    require: name => dependencies[name] ?? require(name),
  });
  return exports;
}

test('reports clear private rows and ignore a late response when the account or workspace changes', async () => {
  const dom = new JSDOM('<div id="root"></div>');
  global.window = dom.window;
  global.document = dom.window.document;
  global.IS_REACT_ACT_ENVIRONMENT = true;
  const requests = [];
  const pushed = [];
  let identityVersion = 1;
  let params = 'from=2026-11-10&to=2026-11-10&compare=true';
  const element = tag => props => React.createElement(tag, props);
  const api = load('lib/daily-reports.ts', {
    './api-data': { apiData: (url, init) => new Promise(resolve => requests.push({ url, signal: init.signal, resolve })) },
  });
  const table = Object.fromEntries(Object.entries({
    Table: 'table', TableBody: 'tbody', TableCell: 'td', TableHead: 'th', TableHeader: 'thead', TableRow: 'tr',
  }).map(([key, tag]) => [key, element(tag)]));
  const Page = load('app/(workspace)/reports/page.tsx', {
    'next/navigation': { useRouter: () => ({ push: url => pushed.push(url) }), useSearchParams: () => new URLSearchParams(params) },
    '@/components/SessionGate': { useSessionSnapshot: () => ({ identityVersion }) },
    '@/components/ui/button': { Button: element('button') },
    '@/components/ui/input': { Input: element('input') },
    '@/components/ui/table': table,
    '@/lib/daily-reports': api,
    './reports.module.css': { default: {} },
  }).default;
  const zero = Object.fromEntries(['spend','cpmSpend','cpcSpend','posted','credits','confirmed','pending','adjustments',
    'billableImpressions','billableClicks','impressions','clicks','validClicks','billedClicks'].map(key => [key,'0']));
  function response(role, campaign) {
    const amounts = { ...zero, spend: '500000', billableImpressions: '1' };
    return {
      role, timezone: 'Africa/Lagos', updatedAt: '2026-11-11T08:00:00Z', from: '2026-11-10', to: '2026-11-10',
      daily: [{ date: '2026-11-10', incomplete: false, ...amounts }], totals: amounts,
      breakdown: [{ campaignId: 'campaign-id', creativeId: 'ad-id', campaign, creative: 'Example ad', ...amounts }],
      comparison: { from: '2026-11-09', to: '2026-11-09', totals: zero },
    };
  }
  const container = document.getElementById('root');
  const root = createRoot(container);
  const render = () => React.act(async () => root.render(React.createElement(Page)));
  const reply = (index, role, campaign) => React.act(async () => requests[index].resolve(response(role, campaign)));
  try {
    await render();
    assert.match(container.textContent, /Loading report/);
    await reply(0, 'advertiser', 'Private campaign A');
    assert.match(container.textContent, /Private campaign A/);
    assert.match(container.textContent, /\$0\.0005/);
    assert.match(container.textContent, /Previous period/);
    assert.match(container.textContent, /Unavailable/);
    identityVersion++;
    await render();
    assert.doesNotMatch(container.textContent, /Private campaign A/);
    assert.equal(requests[0].signal.aborted, true);
    params += '&workspace=promoter';
    await render();
    assert.match(requests[2].url, /role=promoter/);
    assert.equal(requests[1].signal.aborted, true);
    await reply(1, 'advertiser', 'Late private campaign');
    assert.doesNotMatch(container.textContent, /Late private campaign/);
    await reply(2, 'promoter', 'Promoted campaign B');
    assert.match(container.textContent, /Confirmed earnings/);
    assert.match(container.textContent, /Promoted campaign B/);
    await React.act(async () => container.querySelector('form').dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true })));
    assert.equal(new URL(pushed[0], 'https://example.test').searchParams.get('workspace'), 'promoter');
    assert.equal(new URL(pushed[0], 'https://example.test').searchParams.get('compare'), 'true');
  } finally {
    await React.act(async () => root.unmount());
    dom.window.close();
    delete global.window;
    delete global.document;
    delete global.IS_REACT_ACT_ENVIRONMENT;
  }
});
