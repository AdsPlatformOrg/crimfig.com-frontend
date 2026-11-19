const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const { JSDOM } = require('jsdom');

test('Ads mobile navigation closes, releases its modal lock, and can reopen after navigation and resize', async () => {
  const dom = new JSDOM('<main id="root"></main>', { url: 'https://staging-ads.crimfig.com/dashboard' });
  const { window } = dom;
  const globals = ['window', 'document', 'navigator', 'HTMLElement', 'HTMLInputElement', 'HTMLButtonElement', 'Element', 'Node', 'NodeFilter', 'MutationObserver', 'CustomEvent', 'Event', 'MouseEvent', 'FocusEvent', 'getComputedStyle', 'IS_REACT_ACT_ENVIRONMENT'];
  const previous = new Map(globals.map(key => [key, Object.getOwnPropertyDescriptor(global, key)]));
  for (const key of globals) {
    const value = key === 'window' ? window : key === 'IS_REACT_ACT_ENVIRONMENT' ? true :
      key === 'getComputedStyle' ? window.getComputedStyle.bind(window) : window[key];
    Object.defineProperty(global, key, { value, configurable: true, writable: true });
  }

  const React = require('react');
  const { createRoot } = require('react-dom/client');
  const load = Module._load;
  const previousTs = require.extensions['.ts'];
  const previousTsx = require.extensions['.tsx'];
  const compile = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    fileName: filename,
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText, filename);
  require.extensions['.ts'] = require.extensions['.tsx'] = compile;

  let pathname = '/dashboard';
  const viewport = new window.EventTarget();
  viewport.matches = true;
  window.matchMedia = () => viewport;
  Module._load = function (name, parent, isMain) {
    if (name.endsWith('.module.css')) return new Proxy({}, { get: (_, key) => key === '__esModule' ? false : key });
    if (name === 'next/navigation') return { usePathname: () => pathname };
    if (name === 'next/link') return React.forwardRef(({ children, ...props }, ref) => React.createElement('a', { ...props, ref }, children));
    if (name === '../ThemeSwitcher') return { ThemeSwitcher: () => null };
    if (name.endsWith('/account-menu')) return { AccountMenu: () => null };
    if (name === '../CrimFigLogo') return { CrimFigLogo: () => null };
    if (name === '../../lib/api-data' || name === '../../lib/session') return {};
    if (name === '@/lib/utils') return load.call(this, path.resolve(__dirname, '../src/lib/utils.ts'), parent, isMain);
    return load.call(this, name, parent, isMain);
  };

  const root = createRoot(window.document.getElementById('root'));
  const dialog = () => window.document.querySelector('[role="dialog"]');
  const click = element => React.act(async () => {
    assert.ok(element);
    element.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }));
  });
  const settle = () => React.act(async () => { await new Promise(resolve => setTimeout(resolve, 20)); });

  try {
    const { AdsConsoleShell } = require('../src/components/console/AdsConsoleShell.tsx');
    const render = () => React.act(async () => root.render(React.createElement(AdsConsoleShell, {
      role: 'advertiser', activeNavId: 'dashboard', pendingSession: true,
    })));
    await render();
    const trigger = window.document.querySelector('[aria-label="Open navigation menu"]');
    trigger.focus();
    await click(trigger);
    assert.equal(dialog().querySelector('[aria-label="Collapse sidebar"]'), null);
    await React.act(async () => window.document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true })));
    await settle();
    assert.equal(dialog(), null);
    assert.equal(window.document.activeElement, trigger);
    assert.notEqual(window.document.body.style.pointerEvents, 'none');

    await click(trigger);
    pathname = '/campaigns';
    await render();
    assert.equal(dialog(), null);

    await click(trigger);
    await React.act(async () => {
      viewport.matches = false;
      viewport.dispatchEvent(new window.Event('change'));
    });
    assert.equal(dialog(), null);

    viewport.matches = true;
    await click(trigger);
    await click(dialog().querySelector('[aria-label="Close navigation menu"]'));
    assert.equal(dialog(), null);
    assert.notEqual(window.document.body.style.pointerEvents, 'none');
  } finally {
    await React.act(async () => root.unmount());
    Module._load = load;
    require.extensions['.ts'] = previousTs;
    require.extensions['.tsx'] = previousTsx;
    dom.window.close();
    for (const [key, descriptor] of previous) {
      if (descriptor) Object.defineProperty(global, key, descriptor);
      else delete global[key];
    }
  }
});
