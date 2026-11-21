const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { JSDOM } = require('jsdom');
const React = require('react');
const { createRoot } = require('react-dom/client');
const ts = require('typescript');

test('website detail retries failed slots, ignores the previous website, and reports clipboard results', async () => {
  const dom = new JSDOM('<main id="root"></main>');
  global.window = dom.window;
  global.document = dom.window.document;
  global.IS_REACT_ACT_ENVIRONMENT = true;
  const clipboard = {};
  const requests = [];
  const sites = ['alpha', 'beta'].map(id => ({
    id, domain: id + '.example.test', url: 'https://' + id + '.example.test',
    verificationToken: id + '-token', verificationMethod: 'dns_txt',
  }));
  const element = tag => ({ children, ...props }) => React.createElement(tag, props, children);
  const dependencies = {
    'next/navigation': { useRouter: () => ({ push() {} }) },
    'next/link': { default: element('a') },
    '@/lib/campaigns-api': { loadWebsites: async () => sites },
    '@/lib/session': { sessionFetch: url => new Promise(resolve => requests.push({ url, resolve })) },
    '@/lib/api-data': {},
    '@/lib/cfig-format': { houseRewardEligibility: () => 'Unavailable' },
    '@/components/CrimFigAdSlot': { generateCrimFigVerifyMetaTag: token => token },
    '@/components/ui/button': { Button: element('button') },
    '@/components/ui/table': {},
    '@/components/ui/badge': { Badge: element('span') },
  };
  const file = path.resolve(__dirname, '../src/app/(workspace)/promoter/websites/[websiteId]/page.tsx');
  const { outputText } = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 },
  });
  const exports = {};
  vm.runInNewContext(outputText, {
    exports, navigator: { clipboard }, setTimeout, clearTimeout,
    require: name => dependencies[name] ?? require(name),
  });
  const container = document.getElementById('root');
  const root = createRoot(container);
  const render = id => React.act(async () => root.render(React.createElement(exports.default, { params: Promise.resolve({ websiteId: id }) })));
  const reply = (index, status, data) => React.act(async () => requests[index].resolve({ ok: status === 200, json: async () => ({ data }) }));
  const click = pattern => React.act(async () => {
    const button = Array.from(container.querySelectorAll('button')).find(node => pattern.test(node.title || node.textContent));
    assert.ok(button, String(pattern));
    button.click();
  });
  try {
    await render('alpha');
    await reply(0, 403);
    assert.match(container.textContent, /Ad slots could not be loaded/);
    assert.doesNotMatch(container.textContent, /No ad slots configured/);
    await click(/Retry loading ad slots/);
    await reply(1, 500);
    await click(/Retry loading ad slots/);
    await render('beta');
    assert.match(requests[3].url, /\/beta\/slots$/);
    await reply(3, 200, []);
    await reply(2, 500);
    assert.match(container.textContent, /No ad slots configured/);
    assert.doesNotMatch(container.textContent, /Ad slots could not be loaded|alpha\.example\.test/);

    clipboard.writeText = async () => { throw new Error('Denied'); };
    await click(/Copy HTML Meta Tag/i);
    assert.equal(container.querySelector('textarea').value, 'beta-token');
    let finishCopy;
    clipboard.writeText = () => new Promise(resolve => { finishCopy = resolve; });
    await click(/Copy HTML Meta Tag/i);
    assert.equal(container.querySelector('[title="Copy HTML Meta Tag"]').textContent.trim(), 'Copy');
    await React.act(async () => finishCopy());
    assert.equal(container.querySelector('[title="Copy HTML Meta Tag"]').textContent.trim(), 'Copied');
  } finally {
    await React.act(async () => root.unmount());
    dom.window.close();
    delete global.window;
    delete global.document;
    delete global.IS_REACT_ACT_ENVIRONMENT;
  }
});
