const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

const sourcePath = path.resolve(__dirname, '../src/lib/campaigns-api.ts');
const source = fs.readFileSync(sourcePath, 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
const moduleExports = {};
vm.runInNewContext(compiled, { exports: moduleExports, require: () => ({}) });

const { campaignView } = moduleExports;

test('campaign list response metrics are surfaced as loaded values', () => {
  const campaign = campaignView({
    id: 'campaign-1',
    title: 'Paid campaign',
    impressionsCount: 12,
    clicksCount: 3,
    hoversCount: 4,
    touchesCount: 2,
  });

  assert.equal(campaign.metricsLoaded, true);
  assert.equal(campaign.impressions, 12);
  assert.equal(campaign.clicks, 3);
  assert.equal(campaign.hovers, 4);
  assert.equal(campaign.touches, 2);
});

test('missing metric fields are not misrepresented as loaded zeroes', () => {
  const campaign = campaignView({ id: 'campaign-2', title: 'Incomplete response' });

  assert.equal(campaign.metricsLoaded, false);
  assert.equal(campaign.impressions, 0);
  assert.equal(campaign.clicks, 0);
});
