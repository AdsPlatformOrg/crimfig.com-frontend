const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { runInNewContext } = require('node:vm');
const { test } = require('node:test');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');

function load(path, imports = {}) {
  const exports = {};
  const source = readFileSync(join(__dirname, '../src', path), 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS },
  });
  runInNewContext(outputText, { exports, require: name => imports[name] ?? require(name) });
  return exports;
}

const { DeliveryReadinessPanel } = load('components/console/DeliveryReadinessPanel.tsx', {
  '@radix-ui/react-dialog': {},
  '../ui': { Button: ({ children, variant, size, ...props }) => React.createElement('button', props, children) },
  '../../lib/session': {},
  '../../lib/ads-api-client': {},
  '../../lib/delivery-readiness-view': load('lib/delivery-readiness-view.ts'),
  './DeliveryReadinessPanel.module.css': { default: {} },
});
const gate = (status, owner = 'Advertiser') => ({
  status, owner, gateCode: 'CHECK_' + status.toUpperCase(), explanation: 'Explanation for ' + status,
  source: 'Test evidence', observedAt: null,
});
const render = props => renderToStaticMarkup(React.createElement(DeliveryReadinessPanel, props));
const report = (...gates) => ({ version: 1, evaluatedAt: '2026-11-11T00:00:00Z', gates });

test('readiness failure and empty results remain explicit', () => {
  const failure = render({ error: 'Readiness is unavailable.', onReload() {} });
  assert.match(failure, /role="alert">Readiness is unavailable/);
  assert.match(failure, /Refresh readiness/);
  assert.doesNotMatch(failure, /passed|<details/);
  assert.match(render({ report: report() }), /No readiness checks/);
});

test('unresolved checks are visible ahead of a single passing disclosure', () => {
  const pending = { ...gate('pending'), action: 'review_website' };
  const markup = render({ report: report(gate('eligible'), pending, gate('stale'), gate('unknown'), gate('unavailable'), gate('blocked'), gate('eligible', 'Platform')) });
  const [visible, collapsed] = markup.split('<details');
  assert.match(visible, /5 checks need attention/);
  for (const status of ['pending', 'stale', 'unknown', 'unavailable', 'blocked']) {
    assert.match(visible, new RegExp('Explanation for ' + status));
  }
  assert.match(visible, /Open suitability review/);
  assert.doesNotMatch(visible, /Explanation for eligible/);
  assert.match(collapsed, /View passing checks \(1\)/);
  assert.equal(markup.match(/<details/g).length, 1);
});

test('all-pass summary counts evaluated checks and groups their explanations', () => {
  const markup = render({ report: report(gate('eligible'), gate('observed')) });
  assert.match(markup, /2 checks passed/);
  assert.match(markup, /View passing checks \(2\)/);
  assert.doesNotMatch(markup, /Checks needing attention/);
});
