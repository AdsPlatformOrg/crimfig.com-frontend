const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const React = require('react');
const JsxRuntime = require('react/jsx-runtime');
const { renderToStaticMarkup } = require('react-dom/server');

const frontendRoot = path.resolve(__dirname, '../../..');

function loadTsx(relPath, mocks = {}) {
  const fullPath = path.join(frontendRoot, relPath);
  const source = fs.readFileSync(fullPath, 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
  }).outputText;

  const mod = { exports: {} };
  const originalLoad = Module._load;
  Module._load = function patched(request, parent, isMain) {
    if (Object.prototype.hasOwnProperty.call(mocks, request)) return mocks[request];
    if (request === 'react') return React;
    if (request === 'react/jsx-runtime') return JsxRuntime;
    if (request === 'next/link') {
      return ({ href, children, ...props }) => React.createElement('a', { href, ...props }, children);
    }
    if (request === '@/components/AuthBrandHeader') {
      return { AuthBrandHeader: ({ title, subtitle }) => React.createElement('div', null, title, subtitle) };
    }
    if (request === '@/components/ui/alert') {
      return {
        Alert: ({ children }) => React.createElement('div', { role: 'alert' }, children),
        AlertDescription: ({ children }) => React.createElement('span', null, children),
      };
    }
    if (request === '@/components/ui/button') {
      return {
        Button: ({ children, disabled, asChild, ...props }) =>
          asChild ? children : React.createElement('button', { disabled, ...props }, children),
      };
    }
    if (request === '@/components/ui/card') {
      return { Card: ({ children }) => React.createElement('div', null, children) };
    }
    if (request === '@/lib/auth-copy') {
      return { getMfaChallengeCopy: () => ({ title: 'Two-Factor Verification' }) };
    }
    if (request.endsWith('/LocalizationProvider')) {
      return { useLanguage: () => ({ locale: 'en' }) };
    }
    if (request.endsWith('/LanguagePicker')) {
      return { LanguagePicker: () => null };
    }
    return originalLoad.call(this, request, parent, isMain);
  };

  try {
    const fn = new Function('exports', 'require', 'module', '__filename', '__dirname', compiled);
    fn(mod.exports, (id) => Module._load(id, mod, false), mod, fullPath, path.dirname(fullPath));
    return mod.exports;
  } finally {
    Module._load = originalLoad;
  }
}

test('MFA challenge, Consent, and Org Accept Invite render coming-soon lockouts even with query tokens', () => {
  const mfaMod = loadTsx('web/auth/src/app/mfa-challenge/page.tsx', {
    'next/navigation': { useSearchParams: () => new URLSearchParams('token=challenge-123') },
  });
  const mfaHtml = renderToStaticMarkup(React.createElement(mfaMod.default));
  assert.match(mfaHtml, /coming soon/i);
  assert.doesNotMatch(mfaHtml, /Verify &amp; Continue/);

  const consentMod = loadTsx('web/auth/src/app/consent/page.tsx', {
    'next/navigation': {
      useSearchParams: () =>
        new URLSearchParams(
          'client_id=test_app&redirect_uri=https%3A%2F%2Fapp.crimfig.com%2Fcb&code_challenge=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa&code_challenge_method=S256',
        ),
    },
  });
  const consentHtml = renderToStaticMarkup(React.createElement(consentMod.default));
  assert.match(consentHtml, /coming soon/i);
  assert.match(consentHtml, /disabled/);
  assert.doesNotMatch(consentHtml, />Authorize</);

  const inviteMod = loadTsx('web/auth/src/app/(workspace)/org/accept-invite/page.tsx', {
    'next/navigation': { useSearchParams: () => new URLSearchParams('token=invite-123') },
  });
  const inviteHtml = renderToStaticMarkup(React.createElement(inviteMod.default));
  assert.match(inviteHtml, /coming soon/i);
  assert.doesNotMatch(inviteHtml, /Accept Invitation &amp; Join/);
});

test('Auth pages and footer do not call active OAuth, MFA verify, or Org accept-invite mutations', () => {
  for (const rel of [
    'web/auth/src/app/mfa-challenge/page.tsx',
    'web/auth/src/app/consent/page.tsx',
    'web/auth/src/app/(workspace)/org/accept-invite/page.tsx',
  ]) {
    const src = fs.readFileSync(path.join(frontendRoot, rel), 'utf8');
    assert.doesNotMatch(src, /\/api\/v1\/(mfa\/verify|oauth\/authorize\/approve|orgs\/accept-invite)/);
  }
  const footer = fs.readFileSync(path.join(frontendRoot, 'web/auth/src/components/landing/LandingFooter.tsx'), 'utf8');
  assert.doesNotMatch(footer, /Accept Org Invite/);
});

test('Launch date marker exists in internal code comments and <!-- Tag --> without public UI exposure', () => {
  const readme = fs.readFileSync(path.join(frontendRoot, 'shared/ui/README.md'), 'utf8');
  assert.match(readme, /<!--\s*CrimFig officially launched on November 23, 2026\s*-->/);
  for (const rel of [
    'web/auth/src/app/layout.tsx',
    'web/ads/src/app/layout.tsx',
    'web/billing/src/app/layout.tsx',
  ]) {
    const src = fs.readFileSync(path.join(frontendRoot, rel), 'utf8');
    assert.match(src, /\/\/\s*CrimFig officially launched on November 23, 2026\./);
  }
});
