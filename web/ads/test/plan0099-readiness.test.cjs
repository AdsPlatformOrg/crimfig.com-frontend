const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

const sourcePath = path.resolve(__dirname, '../src/lib/delivery-readiness-view.ts');
const source = fs.readFileSync(sourcePath, 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText;
const moduleExports = {};
vm.runInNewContext(compiled, { exports: moduleExports });

const { isPassingReadinessStatus, summarizeDeliveryReadiness } = moduleExports;

test('only eligible and observed readiness checks are treated as passing', () => {
  assert.equal(isPassingReadinessStatus('eligible'), true);
  assert.equal(isPassingReadinessStatus('observed'), true);
  for (const status of ['blocked', 'action_required', 'pending', 'unknown', 'unavailable', 'stale']) {
    assert.equal(isPassingReadinessStatus(status), false, `${status} must not be presented as passing`);
  }
});

test('empty or unresolved readiness results never claim that all checks pass', () => {
  assert.equal(summarizeDeliveryReadiness([]).label, 'No visible readiness checks');
  assert.deepEqual(
    { ...summarizeDeliveryReadiness([{ status: 'pending' }, { status: 'unavailable' }]) },
    { passing: 0, needsAttention: 2, blocked: 0, label: '2 checks need attention', tone: 'attention' },
  );
});

test('successful checks are counted, while blocking checks take precedence in the summary', () => {
  assert.deepEqual(
    { ...summarizeDeliveryReadiness([{ status: 'eligible' }, { status: 'observed' }]) },
    { passing: 2, needsAttention: 0, blocked: 0, label: 'All evaluated checks pass', tone: 'passing' },
  );
  assert.deepEqual(
    { ...summarizeDeliveryReadiness([{ status: 'eligible' }, { status: 'blocked' }, { status: 'action_required' }]) },
    { passing: 1, needsAttention: 2, blocked: 2, label: '2 checks blocked', tone: 'blocked' },
  );
});
