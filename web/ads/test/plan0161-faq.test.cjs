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

test('Negative & Positive: FaqContent renders only the 9 Ads FAQ items with exact financial rules and no decorative badges', async () => {
  await withDom('https://ads.crimfig.com/faq', async (root, el) => {
    const { FaqContent, ADS_FAQ_ITEMS } = compile(
      path.resolve(__dirname, '../src/app/faq/FaqContent.tsx'),
      {
        'next/link': { __esModule: true, default: ({ href, children, ...p }) => React.createElement('a', { href, ...p }, children) },
      },
    );
    await React.act(async () => root.render(React.createElement(FaqContent)));
    assert.equal(ADS_FAQ_ITEMS.length, 9);
    assert.equal(el.querySelectorAll('article').length, 9);
    assert.match(el.textContent, /\$5 USD/);
    assert.match(el.textContent, /verified billable impressions and eligible clicks/);
    assert.doesNotMatch(el.textContent, /55%|30%|15%|55\/30\/15/);
    assert.match(el.textContent, /72-hour clearance period/);
    assert.match(el.textContent, /CrimFig AdStation/);
    assert.match(el.textContent, /invalid activity/);
    assert.doesNotMatch(el.textContent, /Passkey|Two-Step Verification/i);
  });
});

test('Negative & Positive: Ads header places FAQ right after Home and About in desktop and mobile menus', async () => {
  await withDom('https://ads.crimfig.com/', async (root, el) => {
    const icons = new Proxy({}, { get: () => (p) => React.createElement('span', p) });
    const { LandingNavbar } = compile(
      path.resolve(__dirname, '../src/components/landing/LandingNavbar.tsx'),
      {
        'lucide-react': icons,
        'next/link': { __esModule: true, default: ({ href, children, ...p }) => React.createElement('a', { href, ...p }, children) },
        'next-intl': { useTranslations: () => (k) => ({ home: 'Home', about: 'About', launch: 'Launch Console' }[k] ?? k) },
        '../CrimFigLogo': { CrimFigLogo: () => React.createElement('span', {}, 'CrimFig') },
        '../ui/button': { Button: ({ children, ...p }) => React.createElement('button', p, children) },
        '../../../../../shared/ui/localization/LanguagePicker': { LanguagePicker: () => React.createElement('span') },
        '../../../../../shared/ui/localization/LocalizationProvider': { useLanguage: () => ({ locale: 'en' }) },
        './usePreviewCopy': { adsPreviewHref: (p) => p, usePreviewCopy: () => (s) => s },
      },
    );
    await React.act(async () => root.render(React.createElement(LandingNavbar, { onLaunchConsole: () => {} })));
    const desktopLinks = [...el.querySelectorAll('nav.cf-site-nav a')].map((a) => [a.textContent, a.getAttribute('href')]);
    assert.deepEqual(desktopLinks, [['Home', '/'], ['About', '/about'], ['How to Use', '/how-to-use'], ['FAQs', '/faq']]);
    const mobileLinks = [...el.querySelectorAll('#ads-mobile-navigation a')].map((a) => [a.textContent, a.getAttribute('href')]);
    assert.deepEqual(mobileLinks, [['Home', '/'], ['About', '/about'], ['How to Use', '/how-to-use'], ['FAQs', '/faq']]);
  });
});

test('Negative & Positive: Auth and Billing landing headers keep existing items and link Ads to landing when anonymous or dashboard when signed in', async () => {
  const icons = new Proxy({}, { get: () => (p) => React.createElement('span', p) });
  const origins = compile(path.resolve(__dirname, '../../../shared/ui/origins.ts'));

  for (const signedIn of [false, true]) {
    const snap = signedIn
      ? { status: 'authenticated', signOut: null }
      : { status: 'anonymous', signOut: null };

    // Auth header
    await withDom('https://auth.crimfig.com/', async (root, el) => {
      const { LandingNavbar } = compile(
        path.resolve(__dirname, '../../auth/src/components/landing/LandingNavbar.tsx'),
        {
          'lucide-react': icons,
          'next/link': { __esModule: true, default: ({ href, children, ...p }) => React.createElement('a', { href, ...p }, children) },
          '../CrimFigLogo': { CrimFigLogo: () => React.createElement('span', {}, 'CrimFig') },
          '../ui/button': { Button: ({ asChild, children, ...p }) => (asChild ? children : React.createElement('button', p, children)) },
          '../../../../../shared/ui/localization/LanguagePicker': { LanguagePicker: () => React.createElement('span') },
          '../SessionGate': { useSessionSnapshot: () => snap },
          '../../lib/public-header': { publicHeaderActions: () => [] },
          '../../../../../shared/ui/origins': origins,
        },
      );
      await React.act(async () => root.render(React.createElement(LandingNavbar)));
      const links = [...el.querySelectorAll('nav.cf-site-nav a')].map((a) => [a.textContent, a.getAttribute('href')]);
      assert.deepEqual(links, [
        ['Ads', signedIn ? 'https://ads.crimfig.com/dashboard' : 'https://ads.crimfig.com/'],
        ['Ads FAQ', 'https://ads.crimfig.com/faq'],
      ]);
    });

    // Billing header
    await withDom('https://billing.crimfig.com/', async (root, el) => {
      const { LandingNavbar } = compile(
        path.resolve(__dirname, '../../billing/src/components/landing/LandingNavbar.tsx'),
        {
          'lucide-react': icons,
          '../CrimFigLogo': { CrimFigLogo: () => React.createElement('span', {}, 'CrimFig') },
          '../ui/button': { Button: ({ children, ...p }) => React.createElement('button', p, children) },
          '../../../../../shared/ui/localization/LanguagePicker': { LanguagePicker: () => React.createElement('span') },
          '../SessionGate': { useSessionSnapshot: () => snap },
          '../../../../../shared/ui/origins': origins,
        },
      );
      await React.act(async () => root.render(React.createElement(LandingNavbar, { onLaunchConsole: () => {} })));
      const links = [...el.querySelectorAll('nav.cf-site-nav a')].map((a) => [a.textContent, a.getAttribute('href')]);
      assert.deepEqual(links, [
        ['Features', '#features'],
        ['Rewards Status', '#rewards'],
        ['Funding availability', '#security'],
        ['Ads', signedIn ? 'https://ads.crimfig.com/dashboard' : 'https://ads.crimfig.com/'],
        ['Ads FAQ', 'https://ads.crimfig.com/faq'],
      ]);
    });
  }
});

test('Ads, Auth, and Billing sidebars include FAQ near the bottom', () => {
  const adsNav = fs.readFileSync(path.resolve(__dirname, '../src/lib/workspace-navigation.ts'), 'utf8');
  assert.match(adsNav, /id:\s*"faq"[\s\S]*href:\s*"\/faq"/);
  const authShell = fs.readFileSync(path.resolve(__dirname, '../../auth/src/components/AuthConsoleShell.tsx'), 'utf8');
  assert.match(authShell, /id:\s*'faq'[\s\S]*href:\s*`\$\{adsBase\}\/faq`/);
  const billingConsole = fs.readFileSync(path.resolve(__dirname, '../../billing/src/components/console/BillingConsole.tsx'), 'utf8');
  const matches = billingConsole.match(/id:\s*'faq',\s*label:\s*navCopy\.faq,\s*icon:\s*BookOpen,\s*href:\s*`\$\{adsBase\}\/faq`/g);
  assert.equal(matches?.length, 3);
});
