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
  const native = (tag) => ({ children, asChild, variant, ...props }) =>
    asChild ? children : React.createElement(tag, props, children);
  const baseDeps = {
    react: React,
    'lucide-react': new Proxy({}, { get: (_t, k) => (props) => React.createElement('span', { 'data-icon': String(k), ...props }) }),
    'next/link': { __esModule: true, default: native('a') },
    '@/components/ui/button': { Button: native('button') },
    '../../ui/button': { Button: native('button') },
    '../../ui/card': {
      Card: native('div'), CardHeader: native('div'), CardTitle: native('h2'),
      CardDescription: native('p'), CardContent: native('div'),
    },
    '../ui/card': {
      Card: native('div'), CardHeader: native('div'), CardTitle: native('h2'),
      CardDescription: native('p'), CardContent: native('div'),
    },
    '../../ui/badge': { Badge: native('span') },
    '../ui/badge': { Badge: native('span') },
    '@/components/ui/badge': { Badge: native('span') },
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
    URLSearchParams: global.URLSearchParams,
    process: { env: { NODE_ENV: 'production' } },
    require: (n) => deps[n] ?? baseDeps[n] ?? require(n),
  });
  return exports;
}

test('PLAN-0152 customer navigation, paused pages, account settings and read-only profile', async () => {
  const dom = new JSDOM('<div id="root"></div>', { url: 'https://ads.example.test/disputes?workspace=advertiser' });
  const prior = {
    window: global.window,
    document: global.document,
    localStorage: global.localStorage,
    IS_REACT_ACT_ENVIRONMENT: global.IS_REACT_ACT_ENVIRONMENT,
  };
  Object.assign(global, {
    window: dom.window,
    document: dom.window.document,
    localStorage: dom.window.localStorage,
    IS_REACT_ACT_ENVIRONMENT: true,
  });

  const root = createRoot(document.getElementById('root'));
  try {
    // 1. workspaceNavigation omits /disputes
    const { workspaceNavigation } = loadTsx('src/lib/workspace-navigation.ts', {
      '../components/DashboardSidebar': {},
    });
    for (const role of ['advertiser', 'promoter']) {
      const items = workspaceNavigation(role).flatMap((group) => group.items);
      assert.equal(items.some((item) => item.href === '/disputes' || item.id === 'disputes'), false);
    }

    // 2. /disputes redirects to /support
    const replaced = [];
    const { default: AdsDisputesPage } = loadTsx('src/app/(workspace)/disputes/page.tsx', {
      'next/navigation': { useRouter: () => ({ replace: (u) => replaced.push(u) }) },
    });
    await React.act(async () => root.render(React.createElement(AdsDisputesPage)));
    assert.equal(replaced[0], '/support?workspace=advertiser');

    // 3. ConversionsTab shows Coming soon with no key-generation button
    const { ConversionsTab } = loadTsx('src/components/console/conversions/ConversionsTab.tsx');
    await React.act(async () => root.render(React.createElement(ConversionsTab)));
    assert.match(document.body.textContent, /Conversion Tracking/);
    assert.match(document.body.textContent, /Coming soon/);
    assert.doesNotMatch(document.body.textContent, /Generate API Key/);

    // 4. NotificationCenter shows Coming soon without advertiser /campaigns fallback
    const { NotificationCenter } = loadTsx('src/components/console/NotificationCenter.tsx');
    await React.act(async () => root.render(React.createElement(NotificationCenter)));
    assert.match(document.body.textContent, /Notifications/);
    assert.match(document.body.textContent, /Coming soon/);
    assert.equal(document.querySelector('a[href="/campaigns"]'), null);

    // 5. AccountSettingsView uses exact "Account Settings" heading and "Appearance" / "Session"
    let loggedOut = 0;
    const { AccountSettingsView } = loadTsx('src/components/console/settings/AccountSettingsView.tsx', {
      '../../../lib/session': { dashboardSession: () => ({ logout: async () => { loggedOut++; } }) },
    });
    await React.act(async () => root.render(React.createElement(AccountSettingsView)));
    assert.equal(document.querySelector('h1').textContent.trim(), 'Account Settings');
    assert.match(document.body.textContent, /Appearance/);
    assert.match(document.body.textContent, /Session/);
    const signOutBtn = Array.from(document.querySelectorAll('button')).find((b) => /Sign out/.test(b.textContent));
    await React.act(async () => signOutBtn.click());
    assert.equal(loggedOut, 1);

    const requests = [];
    const avatar = 'https://auth.example.test/avatars/profile.webp';
    const { UserProfileView } = loadTsx('src/components/console/profile/UserProfileView.tsx', {
      '../../../../../../shared/ui/origins': { ecosystemOrigin: () => 'https://auth.example.test' },
      '../../../lib/session': { dashboardSession: () => ({ getProfile: async () => ({ userId: 'owner-1', avatar: { url: avatar } }) }) },
      '../../../lib/api-data': { apiData: async (url) => {
        requests.push(url);
        return url.includes('staff-status') ? { isStaff: false, roles: [] } : null;
      } },
    });
    await React.act(async () => root.render(React.createElement(UserProfileView)));
    assert.deepEqual(requests, ['/api/v1/promoters/profile/existing', '/api/v1/ecosystem/staff-status']);
    assert.equal(document.querySelector('img').src, avatar);
    assert.match(document.body.textContent, /Verified Session/);
    assert.match(document.body.textContent, /Promoter profile: not registered/);
    assert.equal(document.querySelector('a[href="/promoter/websites"]'), null);
  } finally {
    await React.act(async () => root.unmount());
    dom.window.close();
    Object.assign(global, prior);
  }
});
