const { root, Module } = require('./load.cjs');
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const backend = path.resolve(root, '../../../backend');
const backendRequire = Module.createRequire(path.join(backend, 'package.json'));
const { exportContract, loadControllers } = backendRequire('./scripts/export-ads-contract.cjs');
const artifact = require('../src/generated/ads-v1.json');
const { validateResponse } = require('../src/validation.ts');
const { safeApiError } = backendRequire('./api/ads-api/src/contracts/api-error.ts');

test('offline export loads real controller metadata, no business/DB modules or listeners, deterministic artifacts', async () => {
  const http = require('node:http'), net = require('node:net'), dns = require('node:dns');
  const originalListen = http.Server.prototype.listen, originalConnect = net.connect, originalLookup = dns.lookup, originalFetch = global.fetch;
  const forbidden = () => { throw Error('Forbidden live export side effect'); };
  http.Server.prototype.listen = forbidden; net.connect = forbidden; dns.lookup = forbidden; global.fetch = forbidden;
  try {
    const one = await exportContract(), two = await exportContract();
    assert.equal(one.text, two.text); assert.deepEqual(one.document, artifact);
    assert.equal(one.manifest.operations.length, 36);
    assert.equal(one.document.paths['/api/v1/campaigns/catalog'].get.security.length, 0);
    assert.deepEqual(one.document.paths['/api/v1/campaigns'].post.security, [{ bearer: [] }]);
    assert.deepEqual(one.document.paths['/api/v1/admin/ads/moderation/campaigns/{id}/manager-approval'].post['x-ads-roles'], ['ads_manager']);
    assert.deepEqual(one.document.paths['/api/v1/campaigns/{id}'].patch.security, [{ bearer: [] }]);
    assert.equal(Object.keys(require.cache).some(name => /(?:campaigns|uploads|moderation)\.service\.ts$|database\.module\.ts|app\.module\.ts$/.test(name)), false);
  } finally { http.Server.prototype.listen = originalListen; net.connect = originalConnect; dns.lookup = originalLookup; global.fetch = originalFetch; }
});
test('request DTO metadata documents real required fields, nullable optional, enums and numeric array validators', () => {
  const schemas = artifact.components.schemas;
  assert.deepEqual(schemas.CreateCampaignDto.required.sort(), ['budgetUsd', 'title']);
  assert.deepEqual(schemas.CreateCampaignDto.properties.pricingModel.enum, ['cpm', 'cpc']);
  assert.equal(schemas.CreateCampaignDto.properties.requestId.nullable, true);
  assert.equal(schemas.CreateCampaignDto.properties.targetHours.items.type, 'integer');
  assert.equal(schemas.CreateCampaignDto.properties.targetHours.items.maximum, 23);
  assert.equal(schemas.CreateCampaignDto.properties.budgetUsd.minimum, 5);
  assert.equal(schemas.AddCreativeDto.properties.headline.maxLength, 100);
  assert.deepEqual(schemas.SaveCampaignDto.required.sort(), ['expectedRevision', 'requestId']);
  assert.deepEqual(artifact.paths['/api/v1/campaigns/{id}/status'].put.requestBody.content['application/json'].schema.properties.status.enum, ['active', 'paused', 'trash']);
});
test('all documented operations have distinct IDs, success/error schema and appropriate multipart/binary contracts', () => {
  const ids = [];
  for (const item of Object.values(artifact.paths)) for (const operation of Object.values(item)) {
    ids.push(operation.operationId);
    assert.ok(operation.responses['400']); assert.ok(operation.responses['503']);
    assert.ok(Object.keys(operation.responses).some(code => /^2\d\d$/.test(code)));
  }
  assert.equal(new Set(ids).size, 36);
  assert.ok(artifact.paths['/api/v1/uploads/prepared'].post.requestBody.content['multipart/form-data']);
  assert.ok(artifact.paths['/api/v1/uploads/media/{storageKey}'].get.responses['206'].content['application/octet-stream']);
  assert.equal(artifact.paths['/api/v1/uploads/media/{storageKey}'].get.security.length, 0);
});
test('manifest detects changed artifacts and source-provenance input is explicit', () => {
  const text = fs.readFileSync(path.join(root, 'src/generated/ads-v1.json'), 'utf8');
  const manifest = require('../src/generated/ads-v1.manifest.json');
  const hash = value => crypto.createHash('sha256').update(value).digest('hex');
  assert.equal(hash(text), manifest.sha256); assert.notEqual(hash(text.replace('campaigns', 'campaings')), manifest.sha256);
  assert.match(manifest.sourceSha256, /^[a-f0-9]{64}$/);
});
test('real controller envelopes with independent service fixtures conform, and wrong field mapping fails', async () => {
  const { controllers } = loadControllers();
  const campaigns = new controllers[0]({ getAdvertiserCampaigns: async (owner, status) => {
    assert.equal(owner, 'owner'); assert.equal(status, 'draft');
    return [{ id: 'campaign', title: 'Server fixture', format: 'card', status: 'draft', moderationStatus: 'draft', budgetUsdCents: 500, remainingBudgetUsdCents: 0, category: null, channels: '["websites"]' }];
  } });
  const output = await campaigns.getAdvertiserCampaigns({ user: { sub: 'owner' } }, 'draft');
  assert.equal(validateResponse('/api/v1/campaigns', 'GET', 200, output), true);
  output.data[0].budgetUsdCents = 'wrong';
  assert.equal(validateResponse('/api/v1/campaigns', 'GET', 200, output), false);
  const uploads = new controllers[1]({ readyAsset: async (owner, id) => ({ assetId: id, cdnUrl: '/api/v1/uploads/media/image.webp', status: 'ready', width: 300, height: 250, bytes: 40000, mimeType: 'image/webp', sha256: 'a'.repeat(64), preparation: { quality: 0.97 } }) });
  const asset = await uploads.readyAsset('asset', { user: { sub: 'owner' } });
  assert.equal(validateResponse('/api/v1/uploads/assets/{assetId}', 'GET', 200, asset), true);
  const moderation = new controllers[2]({ getQueue: async stage => {
    assert.equal(stage, 'manager'); return { campaigns: [], creatives: [], totalPending: 0 };
  } });
  assert.equal(validateResponse('/api/v1/admin/ads/moderation/queue', 'GET', 200, await moderation.getQueue({ query: { stage: 'manager' } })), true);
});
test('safe backend exception serialization preserves statuses/correlation while dropping raw exception/url/header data', () => {
  const id = '9fcd9482-d4f5-4aa8-9a35-f4197b0086a7';
  const error = safeApiError(500, { message: 'postgres PASSWORD=SECRET', token: 'SECRET' }, '/campaign?token=SECRET', 'SECRET');
  assert.equal(error.statusCode, 500); assert.equal(error.code, 'INTERNAL_ERROR'); assert.equal(error.path, '/<unresolved>');
  assert.doesNotMatch(JSON.stringify(error), /SECRET|postgres|PASSWORD/);
  assert.equal(safeApiError(409, 'Your wallet cannot reserve this campaign budget. Check your balance or choose a smaller budget.', '/campaigns/:id', id).code, 'BUDGET_REJECTED');
  assert.equal(safeApiError(409, 'raw unknown conflict', '/campaigns/:id', id).requestId, id);
  const fields = safeApiError(400, { message: ['title must be a string SECRET', 'token must be a string SECRET'] });
  assert.deepEqual(fields.fieldErrors, { title: ['Check this field.'] });
});

test('backend contract metadata and safe exception boundary compile in isolation', () => {
  const ts = backendRequire('typescript');
  const roots = ['contracts/ads-contract.ts', 'contracts/api-configuration.ts', 'contracts/api-error.ts', 'modules/security/ads-exception.filter.ts']
    .map(name => path.join(backend, 'api/ads-api/src', name));
  const options = { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, moduleResolution: ts.ModuleResolutionKind.Node10,
    experimentalDecorators: true, emitDecoratorMetadata: true, esModuleInterop: true, strict: true, skipLibCheck: true, noEmit: true };
  const program = ts.createProgram(roots, options);
  const diagnostics = ts.getPreEmitDiagnostics(program);
  assert.equal(diagnostics.length, 0, ts.formatDiagnosticsWithColorAndContext(diagnostics, { getCurrentDirectory: () => backend, getCanonicalFileName: n => n, getNewLine: () => '\n' }));
});

test('controller route and validator changes alter canonical output before regenerating consumers', async () => {
  const { controllers } = loadControllers();
  const { PATH_METADATA } = backendRequire('@nestjs/common/constants');
  const controller = controllers[0];
  const previous = Reflect.getMetadata(PATH_METADATA, controller);
  try {
    Reflect.defineMetadata(PATH_METADATA, 'campaigns-vnext', controller);
    const changed = await exportContract();
    assert.ok(changed.document.paths['/api/v1/campaigns-vnext']);
    assert.notEqual(changed.manifest.sha256, require('../src/generated/ads-v1.manifest.json').sha256);
  } finally { Reflect.defineMetadata(PATH_METADATA, previous, controller); }
  const storage = backendRequire('class-validator').getMetadataStorage();
  const rule = storage.getTargetValidationMetadatas(
    Reflect.getMetadata('design:paramtypes', controller.prototype, 'createCampaign')[1], '', false, false).find(m => m.name === 'min');
  assert.ok(rule);
  const original = rule.constraints[0];
  try {
    rule.constraints[0] = original + 1;
    backendRequire('./api/ads-api/src/contracts/ads-contract.ts').documentAdsController(controller);
    const changed = await exportContract();
    assert.equal(changed.document.components.schemas.CreateCampaignDto.properties.budgetUsd.minimum, original + 1);
    assert.notEqual(changed.manifest.sha256, require('../src/generated/ads-v1.manifest.json').sha256);
  } finally {
    rule.constraints[0] = original;
    backendRequire('./api/ads-api/src/contracts/ads-contract.ts').documentAdsController(controller);
  }
});
