require('./load.cjs');
const {test} = require('node:test');
const assert = require('node:assert/strict');
const {createAdsClient} = require('../src/index.ts');
const {createAdsOperations} = require('../src/ads-operations.ts');
test('owner and staff readiness refreshes always bypass HTTP cache',async()=>{
  const calls = [];
  const api = createAdsOperations(createAdsClient({origin:'https://ads.example',sessionFetch:async(url,init)=>{
    calls.push({url,cache:init.cache});
    return new Response(JSON.stringify({status:'success',data:{version:1,scope:'campaign',entityId:'id',evaluatedAt:new Date().toISOString(),gates:[]}}),{headers:{'content-type':'application/json'}});
  }}));
  await api.deliveryReadiness('id');
  await api.deliveryReadiness('id',true);
  assert.deepEqual(calls.map(call=>call.cache),['no-store','no-store']);
  assert.match(calls[1].url,/campaigns\/admin\/id/);
});

