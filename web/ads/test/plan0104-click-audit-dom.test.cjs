const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const vm = require('node:vm');
const React = require('react');
const { createRoot } = require('react-dom/client');
const { JSDOM } = require('jsdom');
const ts = require('typescript');

test('Click Audit exposes missing evidence and preserves campaign scope when filtering', async () => {
  const dom = new JSDOM('<div id="root"></div>');
  const prior = { window: global.window, document: global.document, act: global.IS_REACT_ACT_ENVIRONMENT };
  global.window = dom.window;
  global.document = dom.window.document;
  global.IS_REACT_ACT_ENVIRONMENT = true;
  const container = document.getElementById('root');
  const root = createRoot(container);
  const navigation = [];
  const campaign = '5837d2c4-eb9d-4295-ad8d-a50341b47824';
  const tags = entries => Object.fromEntries(Object.entries(entries).map(([name, tag]) =>
    [name, ({ variant, size, asChild, ...props }) => asChild ? props.children : React.createElement(tag, props)]));
  const deps = {
    'next/link': { default: props => React.createElement('a', props) },
    'next/navigation': { useRouter: () => ({ push: url => navigation.push(url) }),
      useSearchParams: () => new URLSearchParams('campaign=' + campaign + '&page=2') },
    '@/components/ui/button': tags({ Button: 'button' }),
    '@/components/ui/input': tags({ Input: 'input' }),
    '@/components/ui/badge': tags({ Badge: 'span' }),
    '@/components/ui/table': tags({ Table: 'table', TableBody: 'tbody', TableCell: 'td', TableHead: 'th', TableHeader: 'thead', TableRow: 'tr' }),
    '@/components/SessionGate': { useSessionSnapshot: () => ({ identityVersion: 1 }) },
    '@/lib/api-data': { apiData: async () => ({
      counts: { all: 4, redirects: 4, valid: 0, rejected: 2, missing: 2, billed: 0 },
      total: 4, page: 1, pageSize: 25, from: '2026-11-11', to: '2026-11-11',
      items: [{ id: 'receipt-id', receipt_id: 'receipt-id', event_id: null, valid: null, billed: false,
        at: '2026-11-11T09:28:02Z', campaign: 'Jed Test Campaign', domain: 'jed.com.ng', reason: null }],
    }) },
    './click-audit.module.css': { default: {} },
  };
  try {
    const source = readFileSync(resolve(__dirname, '../src/app/(workspace)/admin/click-audit/page.tsx'), 'utf8');
    const { outputText } = ts.transpileModule(source, { compilerOptions: {
      module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2020,
    } });
    const exports = {};
    vm.runInNewContext(outputText, { exports, URLSearchParams, AbortController, require: name => deps[name] ?? require(name) });
    await React.act(async () => root.render(React.createElement(exports.default)));
    assert.match(container.textContent, /Jed Test Campaign.*Click event missing/);
    const details = [...container.querySelectorAll('button')].find(button => button.textContent === 'View details');
    await React.act(async () => details.click());
    assert.equal(details.getAttribute('aria-expanded'), 'true');
    assert.match(container.textContent, /Validity undetermined.*Reason: Unknown/);
    const missing = [...container.querySelectorAll('button')].find(button => button.textContent.includes('Missing click events'));
    await React.act(async () => missing.click());
    const next = new URL(navigation[0], 'https://example.test');
    assert.equal(next.searchParams.get('campaign'), campaign);
    assert.equal(next.searchParams.get('outcome'), 'missing');
    assert.equal(next.searchParams.has('page'), false);
  } finally {
    await React.act(async () => root.unmount());
    dom.window.close();
    global.window = prior.window;
    global.document = prior.document;
    global.IS_REACT_ACT_ENVIRONMENT = prior.act;
  }
});
