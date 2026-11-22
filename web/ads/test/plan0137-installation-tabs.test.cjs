const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const React = require('react');
const { JSDOM } = require('jsdom');
const { createRoot } = require('react-dom/client');

function loadComponent(file, imports) {
  const source = fs.readFileSync(path.join(__dirname, '../src/components', file), 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  });
  const exports = {};
  vm.runInNewContext(outputText, {
    exports,
    AbortController,
    setTimeout,
    navigator: global.window.navigator,
    require: name => imports[name] ?? require(name),
  });
  return exports;
}

test('slot installation shows and copies only the current format and isolates embed responses', async () => {
  const dom = new JSDOM('<div id="root"></div>', { url: 'https://ads.example.test', pretendToBeVisual: true });
  const globals = {
    window: dom.window,
    document: dom.window.document,
    getComputedStyle: dom.window.getComputedStyle.bind(dom.window),
    requestAnimationFrame: dom.window.requestAnimationFrame.bind(dom.window),
    cancelAnimationFrame: dom.window.cancelAnimationFrame.bind(dom.window),
    IS_REACT_ACT_ENVIRONMENT: true,
  };
  const previous = Object.fromEntries(Object.keys(globals).map(name => [name, global[name]]));
  Object.assign(global, globals);
  const requests = [];
  const copied = [];
  let clipboardBlocked = false;
  Object.defineProperty(dom.window.navigator, 'clipboard', {
    value: { writeText: async text => {
      if (clipboardBlocked) throw new Error('Clipboard denied');
      copied.push(text);
    } },
  });

  const Button = ({ variant, ...props }) => React.createElement('button', props);
  const { WebsiteAdSlots } = loadComponent('console/WebsiteAdSlots.tsx', {
    'next/link': { __esModule: true, default: props => React.createElement('a', props) },
    'next/navigation': { useRouter: () => ({}) },
    '../../lib/session': { sessionFetch: (url, init) => new Promise(resolve => requests.push({ url, init, resolve })) },
    '../ui/button': { Button },
    '../ui/input': { Input: props => React.createElement('input', props) },
    '../ui/table': {},
    '../ui/tabs': loadComponent('ui/tabs.tsx', { '@/lib/utils': { cn: (...values) => values.filter(Boolean).join(' ') } }),
    './HouseSizeSamples': { HouseSizeSamples: () => null },
    './ConsequentialConfirmDialog': { ConsequentialConfirmDialog: ({title,description,onOpenChange}) => React.createElement('div',{role:'dialog'},title,description,React.createElement('button',{onClick:()=>onOpenChange(false)},'Cancel')) },
    '../../lib/house-samples': { houseSampleCatalog: require('../src/data/house-samples.json') },
    './WebsiteAdSlots.module.css': {},
  });
  const root = createRoot(document.getElementById('root'));
  const site = '00000000-0000-4000-8000-000000000001';
  const ids = [2, 3, 4, 5, 6, 7].map(value => `00000000-0000-4000-8000-00000000000${value}`);
  const slots = ids.map((id, index) => ({
    id, websiteId: site, name: `Slot ${index}`, slotTagId: `tag-${index}`,
    slotType: 'network', lifecycleStatus: 'testing', installationStatus: 'unchecked',
    updatedAt: '2026-11-21T00:00:00.000Z', ...(index === 4 && { retiredAt: '2026-11-21T00:00:00.000Z' }),
  })).slice(0, 5);
  const render = slotId => React.act(async () => root.render(React.createElement(WebsiteAdSlots, { websiteId: site, mode: 'detail', slotId })));
  const reply = (index, data, ok = true) => React.act(async () => requests[index].resolve({
    ok, json: async () => ({ data, message: ok ? undefined : 'Embed denied' }),
  }));
  const tab = name => [...document.querySelectorAll('[role="tab"]')].find(element => element.textContent === name);
  const select = element => React.act(async () => element.dispatchEvent(new dom.window.MouseEvent('mousedown', { bubbles: true, button: 0 })));
  const action = text => [...document.querySelectorAll('button')].find(button => button.textContent === text);
  const openInstallation = () => React.act(async () => action('Installation instructions').click());
  const codes = () => [...document.querySelectorAll('pre code')].map(element => element.textContent);

  try {
    await render(ids[0]);
    await reply(0, slots);
    assert.equal(requests.length, 1);
    assert.equal(action('Installation instructions').getAttribute('aria-expanded'), 'false');
    await React.act(async () => action('Retire slot').click());
    assert.match(document.querySelector('[role="dialog"]').textContent, /Slot 0.*permanently stop/);
    await React.act(async () => action('Cancel').click());
    assert.equal(requests.length, 1);
    await openInstallation();
    assert.equal(action('Installation instructions').getAttribute('aria-expanded'), 'true');
    assert.equal(document.activeElement.textContent, 'Installation instructions');
    assert.match(requests[1].url, new RegExp(`${ids[0]}/embed$`));
    await render(ids[1]);
    await reply(2, slots);
    await openInstallation();
    assert.equal(requests[1].init.signal.aborted, true);
    await reply(1, { htmlSnippet: 'Other slot code' });
    assert.deepEqual(codes(), []);

    await reply(3, null, false);
    assert.equal(document.querySelector('[role="alert"]').textContent, 'Embed denied');
    await React.act(async () => [...document.querySelectorAll('button')].find(button => button.textContent === 'Retry installation instructions').click());
    assert.match(requests[4].url, new RegExp(`${ids[1]}/embed$`));
    const sdk = '<script defer src="/embed.js"></script>';
    const markup = '<ins data-ad-slot="tag-1">\n</ins>';
    const jsx = '<CrimFigAdSlot\n  slotTagId="tag-1"\n/>\n';
    await reply(4, { sdkSnippet: sdk, slotSnippet: markup, htmlSnippet: markup + sdk, nextJsSnippet: jsx });
    assert.equal(tab('HTML').getAttribute('aria-selected'), 'true');
    assert.deepEqual(codes(), [sdk, markup]);
    await React.act(async () => document.querySelector('[aria-label="Copy Slot markup"]').click());
    assert.deepEqual(copied, [markup]);
    assert.equal(tab('WordPress (Coming soon)').disabled, true);
    await select(tab('WordPress (Coming soon)'));
    assert.equal(tab('HTML').getAttribute('aria-selected'), 'true');
    await select(tab('React / Next.js'));
    assert.equal(requests.length, 5);
    assert.deepEqual(codes(), [jsx]);
    await React.act(async () => document.querySelector('[aria-label="Copy React / Next.js snippet"]').click());
    assert.deepEqual(copied, [markup, jsx]);
    clipboardBlocked = true;
    await React.act(async () => document.querySelector('[aria-label="Copy React / Next.js snippet"]').click());
    assert.match(document.body.textContent, /Select and copy the code manually/);
    assert.deepEqual(codes(), [jsx]);

    await render(ids[2]);
    await reply(5, slots);
    await openInstallation();
    await reply(6, { sdkSnippet: sdk, htmlSnippet: markup + sdk });
    assert.equal(tab('HTML').getAttribute('aria-selected'), 'true');
    assert.deepEqual(codes(), [markup + sdk]);
    await select(tab('React / Next.js'));
    assert.deepEqual(codes(), []);
    assert.match(document.body.textContent, /React \/ Next.js snippet unavailable/);
    assert.equal(document.querySelector('[aria-label^="Copy"]'), null);

    await render(ids[3]);
    await reply(7, slots);
    await openInstallation();
    await reply(8, { sdkSnippet: sdk });
    assert.deepEqual(codes(), [sdk]);
    assert.match(document.body.textContent, /Slot markup snippet unavailable/);

    await render(ids[4]);
    await reply(9, slots);
    assert.equal(document.querySelector('[role="tablist"]'), null);
    assert.equal(requests.length, 10);

    await render(ids[5]);
    await reply(10, slots);
    assert.equal(document.querySelector('[role="tablist"]'), null);
    assert.equal(requests.length, 11);
  } finally {
    await React.act(async () => root.unmount());
    dom.window.close();
    Object.assign(global, previous);
  }
});
