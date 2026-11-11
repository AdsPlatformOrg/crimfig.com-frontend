require('./load.cjs');
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createAdsClient, ApiError } = require('../src/index.ts');
const { createAdsOperations } = require('../src/ads-operations.ts');

test('campaign sort HTTP denial is surfaced without retries or synthetic results', async () => {
  let calls = 0;
  const api = createAdsOperations(createAdsClient({ origin: 'https://ads.example', sessionFetch: async () => {
    calls++;
    return new Response(JSON.stringify({ message: 'denied' }), { status: 403, headers: { 'content-type': 'application/json' } });
  } }));
  await assert.rejects(api.campaignPage('all', 2, 25, '', 'views_desc'), error => error instanceof ApiError && error.status === 403);
  assert.equal(calls, 1);
});

test('typed campaign sorts preserve filters and pagination on the versioned request', async () => {
  const api = createAdsOperations(createAdsClient({ origin: 'https://ads.example', sessionFetch: async (url, init) => {
    const query = new URL(url);
    assert.equal(query.pathname, '/api/v1/campaigns/page');
    assert.equal(query.searchParams.get('status'), 'under_review');
    assert.equal(query.searchParams.get('page'), '3');
    assert.equal(query.searchParams.get('pageSize'), '25');
    assert.equal(query.searchParams.get('search'), 'Launch & grow');
    assert.equal(query.searchParams.get('sort'), 'ctr_desc');
    assert.equal(init.method, 'GET');
    return new Response(JSON.stringify({ status: 'success', data: { items: [], page: 3, pageSize: 25, total: 0, counts: {} } }),
      { headers: { 'content-type': 'application/json' } });
  } }));
  assert.equal((await api.campaignPage('under_review', 3, 25, 'Launch & grow', 'ctr_desc')).items.length, 0);
});
