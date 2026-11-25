const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');

const ROOT = path.resolve(__dirname, '../../..');

function loadLegalModule() {
  const full = path.join(ROOT, 'shared/ui/legal/LegalPages.tsx');
  const code = ts.transpileModule(fs.readFileSync(full, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText;
  const exports = {};
  const iconStub = new Proxy({}, { get: (_t, k) => (props) => React.createElement('span', { 'data-icon': String(k), ...props }) });
  const deps = {
    react: React,
    'lucide-react': iconStub,
    'next/link': { __esModule: true, default: ({ href, children, ...rest }) => React.createElement('a', { href, ...rest }, children) },
  };
  vm.runInNewContext(code, { exports, module: { exports }, require: (n) => deps[n] ?? require(n) });
  return exports;
}

test('Negative-first: PLAN-0169 legal pages omit unregistered street address, country/venue, and keep strictly essential cookies', () => {
  const { LegalDocumentPage } = loadLegalModule();
  for (const kind of ['terms', 'privacy', 'cookies', 'ad-policy', 'refund-policy', 'data-deletion']) {
    const html = renderToStaticMarkup(React.createElement(LegalDocumentPage, { kind, appName: 'CrimFig Ads' }));
    assert.doesNotMatch(html, /CrimFig Technologies|CrimFig\.com Inc\.|CrimFig Ecosystem Ltd|October 31, 2026|privacy@crimfig\.com|legal@crimfig\.com/);
    assert.doesNotMatch(html, /Federal Republic of Nigeria|Delaware|cookie consent banner required/i);
    assert.match(html, /CRIMFIG/);
    assert.match(html, /November 23, 2026/);
  }
  const cookiesHtml = renderToStaticMarkup(React.createElement(LegalDocumentPage, { kind: 'cookies', appName: 'CrimFig Ads' }));
  assert.match(cookiesHtml, /Strictly essential cookies/i);
});

test('Positive: PLAN-0169 legal docs contain exact owner policy rules and all 3 apps expose matching routes and footer links', () => {
  const { LegalDocumentPage, LEGAL_FOOTER_LINKS } = loadLegalModule();

  const termsHtml = renderToStaticMarkup(React.createElement(LegalDocumentPage, { kind: 'terms', appName: 'CrimFig Auth' }));
  assert.match(termsHtml, /18 years old/);
  assert.match(termsHtml, /guardian permission and active supervision/);
  assert.match(termsHtml, /30 days/);
  assert.match(termsHtml, /support@crimfig\.com/);

  const adPolicyHtml = renderToStaticMarkup(React.createElement(LegalDocumentPage, { kind: 'ad-policy', appName: 'CrimFig Ads' }));
  assert.match(adPolicyHtml, /Adult or X-Rated content/);
  assert.match(adPolicyHtml, /HTTPS/);
  assert.match(adPolicyHtml, /malware/);
  assert.match(adPolicyHtml, /Help &amp; Support/);

  const refundHtml = renderToStaticMarkup(React.createElement(LegalDocumentPage, { kind: 'refund-policy', appName: 'CrimFig Billing' }));
  assert.match(refundHtml, /up to 30 days/);
  assert.match(refundHtml, /withdrawn immediately/);
  assert.match(refundHtml, /negative account balance/);

  const privacyHtml = renderToStaticMarkup(React.createElement(LegalDocumentPage, { kind: 'privacy', appName: 'CrimFig Auth' }));
  assert.match(privacyHtml, /within 30 days/);
  assert.match(privacyHtml, /up to 6 years/);
  assert.match(privacyHtml, /UK GDPR/);

  const deletionHtml = renderToStaticMarkup(React.createElement(LegalDocumentPage, { kind: 'data-deletion', appName: 'CrimFig Ads' }));
  assert.match(deletionHtml, /30 days/);
  assert.match(deletionHtml, /up to 6 years/);

  for (const appDir of ['web/ads', 'web/auth', 'web/billing']) {
    for (const item of [...LEGAL_FOOTER_LINKS, { href: '/terms-of-use' }]) {
      const routeFile = path.join(ROOT, appDir, 'src/app', item.href.replace(/^\//, ''), 'page.tsx');
      assert.equal(fs.existsSync(routeFile), true, `Missing ${routeFile}`);
    }
    const footerSrc = fs.readFileSync(path.join(ROOT, appDir, 'src/components/landing/LandingFooter.tsx'), 'utf8');
    assert.match(footerSrc, /LegalFooterLinks/);
    assert.match(footerSrc, /(?:©|&copy;) .*CRIMFIG/);
    assert.doesNotMatch(footerSrc, /CrimFig Technologies|CrimFig\.com Inc\.|CrimFig Ecosystem Ltd\./);
  }
});
