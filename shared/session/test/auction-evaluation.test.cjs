const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const { createRequire } = require('node:module');
const appRequire = createRequire(path.resolve(__dirname, '../../../web/ads/package.json'));
const React = appRequire('react');
const { renderToStaticMarkup } = appRequire('react-dom/server');
const contractDirectory = process.env.PLAN0096_CONTRACT_DIR || path.resolve(__dirname, 'fixtures/plan0096');
const output = {};
const source = fs.readFileSync(path.resolve(__dirname, '../../../web/ads/src/components/admin/delivery-evaluation.tsx'), 'utf8');
vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React, esModuleInterop: true } }).outputText, { exports: output, require: appRequire });
const render = decision => renderToStaticMarkup(React.createElement(output.DeliveryEvaluation, { decision }));

test('legacy records retain unknown classification and stage counts', () => {
  assert.match(render({ excludedCandidates: [{ reasonCode: 'AUCTION_NO_WINNER', count: 2 }] }), /were not recorded/);
});
test('recorded zero groups remain zero and failed candidate identifiers are visible', () => {
  const html = render({ excludedCandidates: [{ deliveryEvaluation: { device: 'android', deviceSource: 'user_agent', auctionPolicyVersion: 'fixture-v1',
    counts: { discovered: 2, targetingEligible: 2, creativeCompatible: 1, auctionEntered: 1, eligibleGroups: 0 },
    preAuctionExclusions: [{ campaignId: 'campaign-fixture', creativeId: 'creative-fixture', reasonCode: 'CREATIVE_FORMAT_MISMATCH', stage: 'creative_compatibility' }] } }] });
  assert.match(html, /android/); assert.match(html, /User agent/); assert.match(html, /fixture-v1/);
  assert.match(html, /Eligible advertiser groups<\/dt><dd[^>]*>0<\/dd>/);
  assert.match(html, /campaign-fixture/); assert.match(html, /CREATIVE_FORMAT_MISMATCH/);
});
test('malformed stage values are unknown', () => {
  assert.match(render({ excludedCandidates: [{ deliveryEvaluation: { counts: { discovered: -1 }, device: 'untrusted-value' } }] }), /Unknown/);
});
test('actual isolated backend decisions render desktop and mobile contract evidence', () => {
  const file = path.join(contractDirectory, 'integration-contract.json');
  const decisions = JSON.parse(fs.readFileSync(file, 'utf8'));
  assert.equal(decisions.length, 3);
  for (const [index, device] of ['android', 'ios', 'desktop'].entries()) {
    const html = render(decisions[index]);
    assert.match(html, new RegExp(device)); assert.match(html, /plan0096-fixture/);
    assert.match(html, /Eligible advertiser groups<\/dt><dd[^>]*>1<\/dd>/);
  }
});
test('actual persisted House fallback exposes its specific compatibility rejection', () => {
  const decision = JSON.parse(fs.readFileSync(path.join(contractDirectory, 'fallback-contract.json'), 'utf8'));
  const html = render(decision);
  assert.match(html, /CREATIVE_FORMAT_MISMATCH/);
  assert.match(html, /Compatible creatives<\/dt><dd[^>]*>0<\/dd>/);
});
