const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const React = require('react');
const { JSDOM } = require('jsdom');
const { createRoot } = require('react-dom/client');

test('advertiser rewards rejects the legacy balance contract, retries and shows historical awards under review', async () => {
  const dom = new JSDOM('<div id="root"></div>', { url: 'https://ads.example.test/advertiser/rewards' });
  const old = { window: global.window, document: global.document, IS_REACT_ACT_ENVIRONMENT: global.IS_REACT_ACT_ENVIRONMENT };
  Object.assign(global, { window: dom.window, document: dom.window.document, IS_REACT_ACT_ENVIRONMENT: true });
  const requests = [];
  const native = tag => ({ children, variant, ...props }) => React.createElement(tag, props, children);
  const exports = {};
  const source = fs.readFileSync(path.join(__dirname, '../src/components/console/AdvertiserMilestonesCard.tsx'), 'utf8');
  const dependencies = {
    '../../lib/session': { sessionFetch: () => new Promise(resolve => requests.push(resolve)) },
    '../ui/badge': { Badge: native('span') }, '../ui/button': { Button: native('button') },
    '../ui/card': { Card: native('div'), CardContent: native('div') },
    './AdvertiserMilestonesCard.module.css': { default: {} },
  };
  vm.runInNewContext(ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText, { exports, require: name => dependencies[name] ?? require(name) });
  const root = createRoot(document.getElementById('root'));
  try {
    await React.act(async () => root.render(React.createElement(exports.AdvertiserMilestonesCard)));
    await React.act(async () => requests.shift()({ ok: true, json: async () => ({ status: 'success', data: { achievements: [], totalBonusCreditRemainingUsd: '10000.00' } }) }));
    assert.match(document.body.textContent, /temporarily unavailable/);
    assert.doesNotMatch(document.body.textContent, /10000/);
    await React.act(async () => document.querySelector('button').click());
    await React.act(async () => requests.shift()({ ok: true, json: async () => ({
      status: 'success', data: {
        policyVersion: 'advertiser-recognition-v1', evaluatedAt: '2026-11-22T00:00:00Z',
        progress: { totalCampaigns: 2, completedCampaignsAwaitingVerification: 1, verifiedCompletedCampaigns: null, eligibleClearedSpendCents: null, explanation: 'Verification is pending.' },
        monetaryProgram: { status: 'unavailable', reason: 'Funding and claim terms require approval.' },
        definitions: [{ tier: 'A1_FIRST_CAMPAIGN', title: 'First Campaign', state: 'EARNED', requirement: 'Complete one eligible campaign.' }, { tier: 'A2_CONSISTENT', title: 'Consistent Advertiser', state: 'PENDING_CLEARANCE', requirement: 'Complete three eligible campaigns.' }],
        badges: [{ id: 'verified', tier: 'A1_FIRST_CAMPAIGN', state: 'qualified', achievedAt: '2026-11-22T00:00:00Z' }],
        achievements: [{ id: 'old', badgeTitle: 'Historical award', achievedAt: '2026-11-01T00:00:00Z', bonusCreditCents: 500, bonusCreditRemainingCents: 200, creditExpiresAt: null, isClawedBack: false, status: 'RECONCILIATION_REQUIRED' }],
      },
    }) }));
    assert.match(document.body.textContent, /Pending verification/);
    assert.match(document.body.textContent, /Earned badge/);
    assert.match(document.body.textContent, /First Campaign/);
    assert.match(document.body.textContent, /Historical award/);
    assert.match(document.body.textContent, /Under review/);
    assert.match(document.body.textContent, /Recorded remaining credit/);
    assert.doesNotMatch(document.body.textContent, /Unlocked|Claimed|Claimable|guaranteed|10000/);
    assert.equal(document.querySelector('button'), null);
  } finally {
    await React.act(async () => root.unmount());
    Object.assign(global, old);
    dom.window.close();
  }
});
