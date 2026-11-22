const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const React = require('react');
const { JSDOM } = require('jsdom');
const { createRoot } = require('react-dom/client');

function component(file, imports) {
  const exports = {};
  const source = fs.readFileSync(path.join(__dirname, '../src/components', file), 'utf8');
  vm.runInNewContext(ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText, {
    exports, AbortController,
    navigator: global.window.navigator,
    require: name => imports[name] ?? require(name),
  });
  return exports;
}
test('AdStation scopes data and feedback to the selected website and confirms saves before changing preference', async () => {
  const dom = new JSDOM('<div id="root"></div>', { url: 'https://ads.example.test', pretendToBeVisual: true });
  const globals = {
    window: dom.window, document: dom.window.document,
    HTMLElement: dom.window.HTMLElement, Element: dom.window.Element, Node: dom.window.Node,
    MutationObserver: dom.window.MutationObserver,
    requestAnimationFrame: dom.window.requestAnimationFrame.bind(dom.window),
    cancelAnimationFrame: dom.window.cancelAnimationFrame.bind(dom.window),
    getComputedStyle: dom.window.getComputedStyle.bind(dom.window),
    IS_REACT_ACT_ENVIRONMENT: true,
  };
  const previous = Object.fromEntries(Object.keys(globals).map(name => [name, global[name]]));
  Object.assign(global, globals);
  const requests = [];
  const ui = tag => ({ children, ...props }) => React.createElement(tag, props, children);
  const Button = ({ variant, size, asChild, children, ...props }) => asChild
    ? React.cloneElement(children, props) : React.createElement('button', props, children);
  const { AdStationWorkspace } = component('console/adstation/AdStationWorkspace.tsx', {
    'next/link': { __esModule: true, default: ui('a') },
    '../../../lib/session': { sessionFetch: (url, init) => new Promise(resolve => requests.push({ url, init, resolve })) },
    '../../ui/button': { Button },
    '../../ui/input': { Input: ui('input') },
    '../../ui/badge': { Badge: ({ variant, ...props }) => React.createElement('span', props) },
    '../../ui/table': { Table: ui('table'), TableHeader: ui('thead'), TableBody: ui('tbody'), TableRow: ui('tr'), TableHead: ui('th'), TableCell: ui('td') },
    '../../ui/tabs': component('ui/tabs.tsx', { '@/lib/utils': { cn: (...values) => values.filter(Boolean).join(' ') } }),
    '../../ui/dialog': component('ui/dialog.tsx', { '@/lib/utils': { cn: (...values) => values.filter(Boolean).join(' ') } }),
    './AdStationWorkspace.module.css': { default: new Proxy({}, { get: (_, key) => key }) },
  });
  const root = createRoot(document.getElementById('root'));
  const render = id => React.act(async () => root.render(React.createElement(AdStationWorkspace, { websiteId: id, websiteDomain: id + '.test', initialPreference: 'medium' })));
  const respond = (request, data, ok = true) => React.act(async () => request.resolve({ ok, json: async () => ({ status: 'success', data }) }));
  const tab = async name => React.act(async () => {
    const trigger = Array.from(document.querySelectorAll('[role=tab]')).find(item => item.textContent === name);
    assert.ok(trigger);
    trigger.dispatchEvent(new dom.window.MouseEvent('mousedown', { bubbles: true, button: 0 }));
  });
  try {
    await render('site-a');
    assert.equal(requests.length, 2);
    await render('site-b');
    assert.equal(requests.length, 4);
    await respond(requests[0], [{ id: 'old', name: 'Old site slot', slotType: 'direct' }]);
    await respond(requests[1], [{ id: 'old-deal', campaignTitle: 'Old site deal' }]);
    assert.doesNotMatch(document.body.textContent, /Old site/);
    await respond(requests[2], [{
      id: 'slot-b', name: 'Current slot', slotType: 'direct', format: 'general', slotTagId: 'tag-b',
      adstationReadiness: { networkActiveOnWebsite: false, manualReviewApprovedOnCurrentRevision: true, liveEligible: false, displayStatus: 'Approved — Network Not Active', blockerReasons: [] },
    }]);
    await respond(requests[3], []);
    assert.match(document.body.textContent, /Current slot/);
    assert.match(document.body.textContent, /1 of 1 approved/);
    assert.equal(Array.from(document.querySelectorAll('button')).find(item => item.textContent === 'Go Live').disabled, true);
    assert.ok(document.querySelector('a[href*="setup?websiteId=site-b"]'));
    await tab('Delivery Ratio');
    let high = Array.from(document.querySelectorAll('button')).find(item => item.textContent === 'High Network');
    await React.act(async () => high.click());
    const failedSave = requests.at(-1);
    assert.equal(failedSave.init.method, 'PUT');
    await respond(failedSave, {}, false);
    assert.match(document.body.textContent, /change could not be confirmed/);
    assert.match(document.body.textContent, /Current preference medium/);
    await React.act(async () => high.click());
    await respond(requests.at(-1), { deliveryPreference: 'high' });
    assert.match(document.body.textContent, /Current preference high/);
    await render('site-c');
    assert.doesNotMatch(document.body.textContent, /Delivery preference saved|Current slot/);
  } finally {
    await React.act(async () => root.unmount());
    dom.window.close();
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete global[key]; else global[key] = value;
    }
  }
});
