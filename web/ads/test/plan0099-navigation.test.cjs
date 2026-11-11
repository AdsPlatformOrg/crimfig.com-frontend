const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

const sourcePath = path.resolve(__dirname, '../src/lib/campaign-navigation.ts');
const source = fs.readFileSync(sourcePath, 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText;
const moduleExports = {};
vm.runInNewContext(compiled, { exports: moduleExports, URL });

const { campaignsReturnHref, withCampaignReturnTo } = moduleExports;

test('campaign list return path retains its query and rejects external or unrelated routes', () => {
  assert.equal(campaignsReturnHref('/campaigns?status=active&page=3&search=summer%20sale'), '/campaigns?status=active&page=3&search=summer%20sale');
  assert.equal(campaignsReturnHref('https://evil.example/campaigns?status=active'), '/campaigns');
  assert.equal(campaignsReturnHref('//evil.example/campaigns?status=active'), '/campaigns');
  assert.equal(campaignsReturnHref('/settings?next=/campaigns?status=active'), '/campaigns');
  assert.equal(campaignsReturnHref('/campaigns'), '/campaigns');
});

test('campaign detail links safely carry the validated list return path', () => {
  const returnTo = '/campaigns?status=paused&page=2&search=launch';
  assert.equal(
    withCampaignReturnTo('/campaigns/campaign-1/stacks/stack-1', returnTo),
    `/campaigns/campaign-1/stacks/stack-1?returnTo=${encodeURIComponent(returnTo)}`,
  );
  assert.equal(
    withCampaignReturnTo('/campaigns/campaign-1/stacks/stack-1?tab=ads', returnTo),
    `/campaigns/campaign-1/stacks/stack-1?tab=ads&returnTo=${encodeURIComponent(returnTo)}`,
  );
  assert.equal(
    withCampaignReturnTo('/campaigns/campaign-1/edit', returnTo),
    `/campaigns/campaign-1/edit?returnTo=${encodeURIComponent(returnTo)}`,
  );
});

test('invalid return destinations are not propagated into detail links', () => {
  assert.equal(
    withCampaignReturnTo('/campaigns/campaign-1', 'https://evil.example/steal'),
    '/campaigns/campaign-1',
  );
});
