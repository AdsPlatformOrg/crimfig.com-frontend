const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const React = require('react');
const { JSDOM } = require('jsdom');
const session = require('../../../shared/session/dist/index.js');

function compile(file, deps = {}, win) {
  const source = fs.readFileSync(file, 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText;
  const exports = {};
  vm.runInNewContext(compiled, {
    exports,
    URL,
    URLSearchParams,
    process: { env: { NODE_ENV: 'production' } },
    window: win ?? global.window,
    require: (id) => deps[id] ?? require(id),
  });
  return exports;
}

test('Negative & Positive: loginDestination rejects unsafe return_to and defaults sign-in to Ads Dashboard', () => {
  const origins = compile(
    path.resolve(__dirname, '../../../shared/ui/origins.ts'),
    {},
    { location: { origin: 'https://auth.crimfig.com', hostname: 'auth.crimfig.com' } },
  );
  const { loginDestination } = compile(
    path.resolve(__dirname, '../../auth/src/lib/login-return.ts'),
    {
      '../../../../shared/ui/origins': origins,
      '@crimfig/session': session,
    },
    { location: { origin: 'https://auth.crimfig.com', hostname: 'auth.crimfig.com' } },
  );

  assert.equal(loginDestination(new URLSearchParams()), 'https://ads.crimfig.com/dashboard');
  assert.equal(
    loginDestination(new URLSearchParams({ return_to: 'https://evil.example/steal' })),
    'https://ads.crimfig.com/dashboard',
  );
  assert.equal(
    loginDestination(new URLSearchParams({ return_to: 'https://billing.crimfig.com/?view=console' })),
    'https://billing.crimfig.com/?view=console',
  );
});

for (const app of ['ads', 'auth', 'billing']) {
  test(`Negative & Positive: ${app} SessionGate skips lock screen on sign-out and redirects straight to clean /login`, async () => {
    const dom = new JSDOM('<div id="root"></div>', { url: `https://${app}.crimfig.com/dashboard` });
    const redirects = [];
    let snapshot = Object.freeze({ status: 'authenticated', expiresAt: Date.now() + 60_000, signOut: null });
    const listeners = new Set();
    const publish = (next) => {
      snapshot = Object.freeze(next);
      for (const listener of listeners) listener();
    };
    const stubClient = {
      getSnapshot: () => snapshot,
      subscribe: (fn) => {
        listeners.add(fn);
        return () => listeners.delete(fn);
      },
      bootstrap: async () => {},
      logout: async () => {
        publish({ status: 'anonymous', expiresAt: null, signOut: 'pending' });
        await Promise.resolve();
        publish({ status: 'anonymous', expiresAt: null, signOut: 'complete' });
      },
    };

    const gatePath = path.resolve(__dirname, `../../${app}/src/components/SessionGate.tsx`);
    const deps = {
      react: React,
      'react/jsx-runtime': require('react/jsx-runtime'),
      '@crimfig/session': session,
      './ui/button': { Button: (p) => React.createElement('button', p) },
      '../lib/session': {
        dashboardSession: () => stubClient,
        loginUrl: () => `https://auth.crimfig.com/login?return_to=https%3A%2F%2F${app}.crimfig.com%2Fdashboard`,
      },
      '../lib/consent': {
        consentSession: () => stubClient,
      },
    };

    const compiled = compile(gatePath, deps, {
      location: { origin: `https://${app}.crimfig.com`, href: `https://${app}.crimfig.com/dashboard`, replace: (u) => redirects.push(u) },
      setTimeout: () => 0,
      clearTimeout: () => {},
    });

    global.window = dom.window;
    global.document = dom.window.document;
    global.IS_REACT_ACT_ENVIRONMENT = true;
    const { createRoot } = require('react-dom/client');
    const container = document.getElementById('root');
    const root = createRoot(container);
    try {
      await React.act(async () => {
        root.render(React.createElement(compiled.SessionGate, {}, 'Workspace Content'));
      });
      await React.act(async () => {
        publish({ status: 'anonymous', expiresAt: null, signOut: 'pending' });
      });
      assert.doesNotMatch(container.textContent, /Your private workspace is locked/);
      assert.doesNotMatch(container.textContent, /Signing out/);

      await React.act(async () => {
        await stubClient.logout();
      });
      assert.doesNotMatch(container.textContent, /Your private workspace is locked/);
      assert.equal(redirects.at(-1), 'https://auth.crimfig.com/login');
    } finally {
      await React.act(async () => root.unmount());
      dom.window.close();
      delete global.window;
      delete global.document;
      delete global.IS_REACT_ACT_ENVIRONMENT;
    }
  });
}

test('Auth LandingPage removes inline FAQ, footer links to plain-language /faq pages on Auth and Billing', () => {
  const authLanding = fs.readFileSync(path.resolve(__dirname, '../../auth/src/components/landing/LandingPage.tsx'), 'utf8');
  assert.doesNotMatch(authLanding, /LandingFAQ/);

  const authFooter = fs.readFileSync(path.resolve(__dirname, '../../auth/src/components/landing/LandingFooter.tsx'), 'utf8');
  assert.match(authFooter, /href="\/faq"[^>]*>Account FAQ/);

  const billingFooter = fs.readFileSync(path.resolve(__dirname, '../../billing/src/components/landing/LandingFooter.tsx'), 'utf8');
  assert.match(billingFooter, /href="\/faq"[\s\S]*Billing FAQ/);

  const authFaq = fs.readFileSync(path.resolve(__dirname, '../../auth/src/app/faq/page.tsx'), 'utf8');
  assert.doesNotMatch(authFaq, /fingerprint|HTTP-only/i);
});
