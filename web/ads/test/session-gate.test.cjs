const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const vm = require('node:vm');
const { JSDOM } = require('jsdom');
const React = require('react');
const { createRoot } = require('react-dom/client');
const ts = require('typescript');
const { createSessionClient } = require('@crimfig/session');

const dashboard = 'https://staging-ads.crimfig.com/dashboard?view=console';
const authOrigin = 'https://staging-auth.crimfig.com';
const login = new URL('/login', authOrigin);
login.searchParams.set('return_to', dashboard);
const source = fs.readFileSync(path.join(__dirname, '../src/components/SessionGate.tsx'), 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
});

async function checkGate(responses, check) {
  const dom = new JSDOM('<div id="root"></div>', { url: dashboard });
  const redirects = [];
  const timers = new Map();
  let refreshes = 0;
  const client = createSessionClient({
    authOrigin,
    apiOrigins: [new URL(dashboard).origin],
    coordinateRefresh: (refresh) => refresh(),
    schedule: () => () => {},
    fetch: async () => {
      const status = responses[refreshes++];
      return status === 200
        ? Response.json({ accessToken: 'access-token', expiresIn: 60 })
        : new Response(null, { status });
    },
  });
  const exports = {};
  const dependencies = {
    react: React,
    'react/jsx-runtime': require('react/jsx-runtime'),
    '../lib/session': { dashboardSession: () => client, loginUrl: () => login.href },
    './ui/button': { Button: (props) => React.createElement('button', props) },
  };
  vm.runInNewContext(outputText, {
    exports,
    require: (name) => dependencies[name],
    window: {
      location: { replace: (url) => redirects.push(url) },
      setTimeout: (callback) => { timers.set(callback, callback); return callback; },
      clearTimeout: (id) => timers.delete(id),
    },
  });
  global.window = dom.window;
  global.document = dom.window.document;
  global.IS_REACT_ACT_ENVIRONMENT = true;
  const container = document.getElementById('root');
  const root = createRoot(container);
  try {
    await React.act(async () => root.render(React.createElement(
      exports.SessionGate, { loadingShell: 'Loading workspace' }, 'Private workspace',
    )));
    await check({
      container, redirects, timers,
      refreshes: () => refreshes,
      runRetry: () => React.act(async () => {
        const [callback] = timers.keys();
        assert.ok(callback);
        timers.delete(callback);
        callback();
      }),
    });
  } finally {
    await React.act(async () => root.unmount());
    client.dispose();
    dom.window.close();
    delete global.window;
    delete global.document;
    delete global.IS_REACT_ACT_ENVIRONMENT;
  }
}

test('an outage keeps the workspace locked and offers manual recovery after one automatic retry', async () => {
  await checkGate([503, 503, 200], async ({ container, redirects, timers, refreshes, runRetry }) => {
    assert.equal(container.textContent, 'Loading workspace');
    await runRetry();
    assert.match(container.textContent, /Unable to open your workspace/);
    assert.doesNotMatch(container.textContent, /Private workspace/);
    assert.equal(timers.size, 0);
    assert.equal(refreshes(), 2);
    assert.deepEqual(redirects, []);
    await React.act(async () => container.querySelector('button').click());
    assert.equal(container.textContent, 'Private workspace');
  });
});

test('a rejected session goes directly to sign-in with the dashboard return URL', async () => {
  await checkGate([401], async ({ container, redirects, timers }) => {
    assert.deepEqual(redirects, [login.href]);
    assert.equal(container.textContent, 'Loading workspace');
    assert.equal(timers.size, 0);
  });
});

test('a temporary failure recovers automatically and a valid session opens directly', async () => {
  await checkGate([503, 200], async ({ container, redirects, runRetry }) => {
    assert.equal(container.textContent, 'Loading workspace');
    await runRetry();
    assert.equal(container.textContent, 'Private workspace');
    assert.deepEqual(redirects, []);
  });
  await checkGate([200], async ({ container, redirects, timers }) => {
    assert.equal(container.textContent, 'Private workspace');
    assert.deepEqual(redirects, []);
    assert.equal(timers.size, 0);
  });
});
