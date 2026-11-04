const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

const exportsFixture = {};
const source = fs.readFileSync(path.resolve(__dirname, '../../../web/ads/src/lib/auction-pricing.ts'), 'utf8');
vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, { exports: exportsFixture });
const { formatAuctionUsd } = exportsFixture;

test('auction rate, CPC charge and fractional CPM event preserve their units and precision', () => {
  assert.equal(formatAuctionUsd('1500000', 6), '$1.50');
  assert.equal(formatAuctionUsd('100000000', 9), '$0.10');
  assert.equal(formatAuctionUsd('500000', 9), '$0.0005');
  assert.equal(formatAuctionUsd('9007199254740993999', 9), '$9007199254.740993999');
});

test('a recorded zero differs from an absent or invalid amount', () => {
  assert.equal(formatAuctionUsd('0', 2), '$0.00');
  assert.equal(formatAuctionUsd(null, 2), null);
  assert.equal(formatAuctionUsd('1e9', 9), null);
});
