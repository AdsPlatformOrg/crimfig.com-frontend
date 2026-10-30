require('./load.cjs');
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createAdsClient, ApiError, dataOf, jsonSchema, validateResponse } = require('../src/index.ts');
const { createAdsOperations } = require('../src/ads-operations.ts');
const Ajv = require('ajv');
const origin = 'https://ads.example';
const campaign = { id: 'campaign', title: 'Draft', format: 'card', status: 'draft', moderationStatus: 'draft', budgetUsdCents: 500, remainingBudgetUsdCents: 500 };
const ok = (data, status = 200) => new Response(JSON.stringify({ status: 'success', data }), { status, headers: { 'content-type': 'application/json' } });
const setup = fetcher => createAdsOperations(createAdsClient({ origin, sessionFetch: fetcher }));

test('typed operations construct actual versioned methods/paths, query, ID encoding and JSON body', async () => {
  const calls = [];
  const api = setup(async (url, init) => { calls.push({ url, init }); return init.method === 'POST' ? ok(campaign, 201) : ok([]); });
  await api.listCampaigns('draft');
  await api.create({ title: 'Draft', budgetUsd: 5 });
  assert.equal(calls[0].url, `${origin}/api/v1/campaigns?status=draft`);
  assert.equal(calls[1].init.method, 'POST');
  assert.deepEqual(JSON.parse(await calls[1].init.body.text()), { title: 'Draft', budgetUsd: 5 });
  assert.equal(calls[1].init.credentials, 'omit');
  assert.equal(calls[1].init.redirect, 'error');
  const c = createAdsClient({ origin, sessionFetch: async (url) => { assert.match(url, /id%2Fwith%20space/); return ok({ ...campaign, adStacks: [], creatives: [] }); } });
  await c.GET('/api/v1/campaigns/{id}', { params: { path: { id: 'id/with space' } } });
});
test('transport preserves caller headers/abort and never retries an uncertain mutation', async () => {
  const controller = new AbortController(); let count = 0;
  const client = createAdsClient({ origin, sessionFetch: async (url, init) => {
    count++; assert.equal(init.headers.get('x-operation-id'), 'operation');
    assert.equal(init.signal.aborted, true); throw new DOMException('secret raw token', 'AbortError');
  } });
  controller.abort();
  await assert.rejects(client.POST('/api/v1/campaigns', { body: { title: 'Draft', budgetUsd: 5 }, headers: { 'x-operation-id': 'operation' }, signal: controller.signal }), error => {
    assert.ok(error instanceof ApiError); assert.equal(error.category, 'timeout'); assert.equal(error.outcome, 'unknown'); assert.doesNotMatch(error.message, /secret/); return true;
  });
  assert.equal(count, 1);
});
test('multipart prepared/direct uses encoded form bytes and browser boundary without losing signal', async () => {
  const api = setup(async (url, init) => {
    const decoded = await new Request(url, init).formData();
    assert.match(init.headers.get('content-type'), /^multipart\/form-data; boundary=/);
    if (url.endsWith('/prepared')) { assert.equal(decoded.get('manifest'), '{"version":1}'); assert.equal(decoded.get('files').name, 'test.webp'); }
    else assert.equal(decoded.get('file').name, 'test.webp');
    return ok({ assetId: 'asset', cdnUrl: '/api/v1/uploads/media/test.webp', status: 'ready' }, 201);
  });
  const file = new File(['bytes'], 'test.webp', { type: 'image/webp' });
  const form = new FormData(); form.append('files', file); form.append('manifest', '{"version":1}');
  await api.uploadPrepared(form); await api.uploadDirect(file);
});
test('public contract calls do not use bearer session transport or forward explicit credential headers', async () => {
  let publicCalls = 0;
  const c = createAdsClient({ origin, sessionFetch: async () => { throw Error('private transport used'); }, publicFetch: async request => {
    publicCalls++; assert.equal(request.headers.has('authorization'), false); assert.equal(request.headers.has('cookie'), false); assert.equal(request.credentials, 'omit'); return ok([]);
  } });
  await c.GET('/api/v1/campaigns/catalog', { headers: { Authorization: 'Bearer secret', cookie: 'secret' } });
  assert.equal(publicCalls, 1);
});
test('wrong-origin override is rejected before session credentials can be sent', async () => {
  let count = 0; const c = createAdsClient({ origin, sessionFetch: async () => { count++; return ok([]); } });
  await assert.rejects(c.GET('/api/v1/campaigns', { baseUrl: 'https://attacker.example' }), ApiError);
  assert.equal(count, 0);
});
test('actual successful response must match schema, not merely generic cast or envelope', async () => {
  assert.deepEqual(await setup(async () => ok([])).listCampaigns(), []);
  for (const body of [{ status: 'success', data: [{ ...campaign, budgetUsdCents: '500' }] }, { status: 'success', data: [{ id: 'only' }] }, { status: 'error', data: [] }]) {
    await assert.rejects(setup(async () => new Response(JSON.stringify(body))).listCampaigns(), error => error instanceof ApiError && error.category === 'protocol');
  }
  await assert.rejects(setup(async () => new Response('<html>secret</html>')).listCampaigns(), ApiError);
});
test('zero and nullable campaign fields and permitted additive fields remain honest', async () => {
  const data = await setup(async () => ok([{ ...campaign, remainingBudgetUsdCents: 0, category: null, channels: null, futureField: 'allowed' }])).listCampaigns();
  assert.equal(data[0].remainingBudgetUsdCents, 0); assert.equal(data[0].category, null);
});

test('object response schemas retain nested required fields and nullable creation readback', async () => {
  assert.equal(await setup(async () => ok(null)).creation('request'), null);
  await assert.rejects(setup(async () => ok({ ...campaign, creatives: [] })).details('id'), ApiError);
  await assert.rejects(setup(async () => ok({ supportedAdTypes: ['image'] })).capabilities(), ApiError);
});
test('OpenAPI nullable ref/union/enum/allOf/nested arrays conversion handles null and invalid values', () => {
  const ajv = new Ajv({ strict: false });
  const schema = jsonSchema({ type: 'object', required: ['items', 'choice'], properties: {
    items: { type: 'array', items: { allOf: [{ type: 'object', properties: { title: { type: 'string' } }, required: ['title'] }] } },
    choice: { nullable: true, enum: ['a'], type: 'string' },
    ref: { nullable: true, $ref: '#/definitions/Text' },
  }, definitions: { Text: { type: 'string' } } });
  const validate = ajv.compile(schema);
  assert.equal(validate({ items: [{ title: 'yes' }], choice: null, ref: null }), true);
  assert.equal(validate({ items: [{ title: 2 }], choice: 'a' }), false);
  assert.equal(validate({ items: [], choice: 'b' }), false);
});
for (const status of [400, 401, 403, 404, 409, 422, 429, 500, 503]) test(`safe ApiError preserves HTTP ${status}, never raw provider/message secrets`, async () => {
  const id = '9fcd9482-d4f5-4aa8-9a35-f4197b0086a7';
  const api = setup(async () => new Response(JSON.stringify({ message: 'SECRET credential', code: 'SECRET', requestId: id, fieldErrors: { title: ['SECRET'], token: ['SECRET'] } }), { status }));
  await assert.rejects(api.create({ title: 'Draft', budgetUsd: 5 }), error => {
    assert.ok(error instanceof ApiError); assert.equal(error.status, status); assert.equal(error.requestId, id);
    assert.equal(error.operation, 'Campaigns_createCampaign'); assert.doesNotMatch(JSON.stringify(error), /SECRET/);
    assert.equal(error.outcome, status >= 500 ? 'unknown' : 'rejected'); return true;
  });
});
test('known budget rejection stays actionable; 503, invalid error JSON and network remain uncertain on mutations', async () => {
  await assert.rejects(setup(async () => new Response(JSON.stringify({ code: 'BUDGET_REJECTED' }), { status: 409 })).create({ title: 'Draft', budgetUsd: 5 }), /wallet cannot reserve/);
  for (const fetcher of [async () => new Response('<secret>', { status: 503 }), async () => { throw Error('secret network'); }]) {
    await assert.rejects(setup(fetcher).create({ title: 'Draft', budgetUsd: 5 }), error => error instanceof ApiError && error.outcome === 'unknown' && !error.message.includes('secret'));
  }
});
test('binary preview is parsed as blob and no JSON validation is attempted', async () => {
  const blob = await setup(async () => new Response('image bytes', { headers: { 'content-type': 'image/webp' } })).media('image.webp', 'owner');
  assert.equal(await blob.text(), 'image bytes');
});
test('schema validator rejects missing operation/unsupported success status', () => {
  assert.equal(validateResponse('/not-real', 'GET', 200, {}), false);
  assert.equal(validateResponse('/api/v1/campaigns', 'POST', 202, {}), false);
  assert.throws(() => dataOf({}), ApiError);
});
test('wrong success content type and undeclared no-content status fail without parsing as a valid DTO', async () => {
  for (const response of [new Response(JSON.stringify({ status: 'success', data: [] }), { headers: { 'content-type': 'text/html' } }), new Response(null, { status: 204 })]) {
    await assert.rejects(setup(async () => response).listCampaigns(), error => error instanceof ApiError && error.category === 'protocol');
  }
});

test('error codes must agree with the status and correlation IDs must be valid UUIDs', async () => {
  await assert.rejects(setup(async () => new Response(JSON.stringify({ code: 'BUDGET_REJECTED', requestId: '-'.repeat(36) }), { status: 503 })).create({ title: 'Draft', budgetUsd: 5 }), error => {
    assert.equal(error.code, 'SERVICE_UNAVAILABLE'); assert.equal(error.requestId, undefined);
    assert.equal(error.outcome, 'unknown'); return true;
  });
});
