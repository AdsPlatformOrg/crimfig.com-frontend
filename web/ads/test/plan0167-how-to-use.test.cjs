const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const React = require('react');
const { JSDOM } = require('jsdom');

function compile(file, deps = {}) {
  const source = fs.readFileSync(file, 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText;
  const moduleExports = {};
  vm.runInNewContext(compiled, {
    exports: moduleExports,
    process: { env: { NODE_ENV: 'production' } },
    require: (id) => deps[id] ?? require(id),
    window: global.window,
  });
  return moduleExports;
}

async function withDom(url, run) {
  const dom = new JSDOM('<div id="root"></div>', { url });
  const prior = {
    window: global.window,
    document: global.document,
    IS_REACT_ACT_ENVIRONMENT: global.IS_REACT_ACT_ENVIRONMENT,
  };
  global.window = dom.window;
  global.document = dom.window.document;
  global.IS_REACT_ACT_ENVIRONMENT = true;
  const { createRoot } = require('react-dom/client');
  const root = createRoot(document.getElementById('root'));
  try {
    await run(root, document.getElementById('root'));
  } finally {
    await React.act(async () => root.unmount());
    global.window = prior.window;
    global.document = prior.document;
    global.IS_REACT_ACT_ENVIRONMENT = prior.IS_REACT_ACT_ENVIRONMENT;
    dom.window.close();
  }
}

test('Negative & Positive: HowToUseGuide rejects broken/missing local guide assets and renders both Advertiser & Promoter steps cleanly', async () => {
  const publicDir = path.resolve(__dirname, '../public');
  const guideSource = path.resolve(__dirname, '../src/app/how-to-use/HowToUseGuide.tsx');

  await withDom('https://ads.crimfig.com/how-to-use', async (root, el) => {
    const icons = new Proxy({}, { get: () => (p) => React.createElement('span', p) });
    const origins = compile(path.resolve(__dirname, '../../../shared/ui/origins.ts'));
    const {
      HowToUseGuide,
      ADVERTISER_GUIDE_STEPS,
      PROMOTER_GUIDE_STEPS,
    } = compile(guideSource, {
      'lucide-react': icons,
      'next/link': {
        __esModule: true,
        default: ({ href, children, ...p }) => React.createElement('a', { href, ...p }, children),
      },
      '../../components/ui/tabs': {
        Tabs: ({ children, value }) => React.createElement('div', { 'data-tabs-value': value }, children),
        TabsList: ({ children, ...p }) => React.createElement('div', { role: 'tablist', ...p }, children),
        TabsTrigger: ({ children, value, ...p }) =>
          React.createElement('button', { type: 'button', role: 'tab', 'data-value': value, ...p }, children),
        TabsContent: ({ children, value }) =>
          React.createElement('section', { 'data-tab-content': value }, children),
      },
      '../../components/ui/badge': {
        Badge: ({ children }) => React.createElement('span', {}, children),
      },
      '../../components/ui/button': {
        Button: ({ children, ...p }) => React.createElement('button', p, children),
      },
      '../../components/ui/dialog': {
        Dialog: ({ open, children }) => (open ? React.createElement('div', { role: 'dialog' }, children) : null),
        DialogContent: ({ children }) => React.createElement('div', {}, children),
        DialogHeader: ({ children }) => React.createElement('div', {}, children),
        DialogTitle: ({ children }) => React.createElement('h3', {}, children),
        DialogDescription: ({ children }) => React.createElement('p', {}, children),
      },
      '../../../../../shared/ui/origins': origins,
    });

    assert.equal(ADVERTISER_GUIDE_STEPS.length, 4);
    assert.equal(PROMOTER_GUIDE_STEPS.length, 4);

    // Verify zero broken/empty screenshot or animated WebP clip references under public/guides/
    for (const step of [...ADVERTISER_GUIDE_STEPS, ...PROMOTER_GUIDE_STEPS]) {
      assert.ok(step.imageAlt.trim().length > 15, `Missing descriptive alt text on ${step.title}`);
      assert.ok(step.screenshotSrc.startsWith('/guides/'), `Unexpected screenshot path ${step.screenshotSrc}`);
      assert.ok(step.clipSrc.startsWith('/guides/'), `Unexpected clip path ${step.clipSrc}`);
      const pngFile = path.join(publicDir, step.screenshotSrc.replace(/^\//, ''));
      const webpFile = path.join(publicDir, step.clipSrc.replace(/^\//, ''));
      assert.ok(fs.existsSync(pngFile), `Missing PNG file ${pngFile}`);
      assert.ok(fs.existsSync(webpFile), `Missing WebP clip file ${webpFile}`);
      assert.ok(fs.statSync(pngFile).size > 5000, `PNG file too small: ${pngFile}`);
      assert.ok(fs.statSync(webpFile).size > 5000, `WebP file too small: ${webpFile}`);
    }

    await React.act(async () => root.render(React.createElement(HowToUseGuide)));

    assert.match(el.textContent, /How to Use CrimFig Ads/);
    assert.match(el.textContent, /Fund Your Advertising Wallet/);
    assert.match(el.textContent, /Register & Verify Your Website/);
    assert.match(el.textContent, /55% of eligible paid ad revenue/);
    assert.match(el.textContent, /72-hour traffic-quality review window/);
    assert.equal(el.querySelectorAll('article').length, 8);
  });
});

test('Ads workspace navigation links to /how-to-use in both Advertiser and Promoter hubs', () => {
  const nav = fs.readFileSync(path.resolve(__dirname, '../src/lib/workspace-navigation.ts'), 'utf8');
  const matches = nav.match(/id:\s*"how_to_use",\s*label:\s*"How to Use",\s*icon:\s*BookOpen,\s*href:\s*"\/how-to-use"/g);
  assert.equal(matches?.length, 2);
});
