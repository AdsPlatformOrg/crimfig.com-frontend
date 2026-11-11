const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

const exportsForTest = {};
const source = fs.readFileSync(path.resolve(__dirname, '../src/lib/campaign-list-sort.ts'), 'utf8');
vm.runInNewContext(ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText, { exports: exportsForTest });
const { parseCampaignSort, campaignColumnSort, campaignSortOptions } = exportsForTest;

test('invalid URL sorts fall back safely and actions are never sortable', () => {
  for (const value of [null, '', 'title; drop table users', 'budget_desc_desc']) {
    assert.equal(parseCampaignSort(value), 'newest');
  }
  assert.equal(campaignColumnSort('actions', 'newest'), null);
  assert.equal(campaignColumnSort('newest', 'newest'), null);
});

test('each data column toggles ascending and descending and restores from URL', () => {
  for (const column of ['campaign', 'status', 'budget', 'spend', 'creatives', 'views', 'clicks', 'ctr']) {
    const ascending = campaignColumnSort(column, 'newest');
    assert.equal(ascending.direction, undefined);
    const descending = campaignColumnSort(column, ascending.next);
    assert.equal(descending.direction, 'ascending');
    assert.equal(descending.nextDirection, 'descending');
    assert.equal(campaignColumnSort(column, descending.next).direction, 'descending');
    assert.equal(campaignColumnSort(column, descending.next).next, ascending.next);
    assert.equal(parseCampaignSort(descending.next), descending.next);
  }
});

test('all selector options match the generated API sort contract', () => {
  const contract = require('../../../shared/api-client/src/generated/ads-v1.json');
  const values = contract.paths['/api/v1/campaigns/page'].get.parameters.find(parameter => parameter.name === 'sort').schema.enum;
  assert.deepEqual(Array.from(campaignSortOptions, option => option[0]).sort(), values.slice().sort());
});
