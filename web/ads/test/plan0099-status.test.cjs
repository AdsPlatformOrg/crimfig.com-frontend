const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

const source = fs.readFileSync(path.resolve(__dirname, '../src/lib/campaign-list-status.ts'), 'utf8');
const exportsForTest = {};
vm.runInNewContext(ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText, { exports: exportsForTest });
const { campaignListStatus } = exportsForTest;

test('missing or unrelated moderation does not invent a review status', () => {
  for (const moderation of [undefined, null, '', 'approved', 'rejected', 'draft']) {
    assert.equal(campaignListStatus('paused', moderation), 'paused');
  }
  assert.equal(campaignListStatus('trash', 'pending_primary_review'), 'trash');
});

test('pending review rows match the API review category instead of claiming paused or active', () => {
  for (const moderation of ['pending_primary_review', 'pending_manager_approval']) {
    assert.equal(campaignListStatus('paused', moderation), 'under_review');
    assert.equal(campaignListStatus('active', moderation), 'under_review');
  }
});

test('approved active and paused campaigns retain their delivery labels', () => {
  assert.equal(campaignListStatus('active', 'approved'), 'active');
  assert.equal(campaignListStatus('paused', 'approved'), 'paused');
  assert.equal(campaignListStatus('draft', 'draft'), 'draft');
});
