const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm'), ts = require('typescript');
function api(fetcher) {
  const root = path.resolve(__dirname, '../../../web/billing/src/lib'), cache = new Map();
  function load(name) {
    if (name === 'session') return {sessionFetch: fetcher};
    if (cache.has(name)) return cache.get(name);
    const exports = {}; cache.set(name, exports);
    const code = ts.transpileModule(fs.readFileSync(path.join(root, `${name}.ts`), 'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
    vm.runInNewContext(code,{exports,require:r=>load(r.replace('./','')),URL,URLSearchParams}); return exports;
  }
  return load('funding-api');
}
const response = data => new Response(JSON.stringify({status:'success',data}));
const reference = 'crimfig-fund-fixture';
const requestId = '12345678-1234-4234-8234-123456789099';
const transaction = {id:'tx',type:'wallet_fund',provider:'paystack',status:'completed',reference,amountUsdCents:500};
test('return parameters select a reference, never payment success', () => {
  const {fundingReturn} = api();
  assert.equal(fundingReturn('?status=success&paid=true').kind,'none');
  assert.equal(fundingReturn('?reference='+reference+'&status=success').reference,reference);
  assert.equal(fundingReturn('?trxref='+reference+'&reference='+reference).kind,'valid');
  for (const search of ['?reference=', '?reference=foreign/host', '?reference=%3Cscript%3E', '?reference=one&trxref=two', '?reference=one&reference=two']) assert.equal(fundingReturn(search).kind,'invalid');
});
test('confirmed and already-completed references require an actual matching completed funding transaction', async () => {
  for (const status of ['completed','already_completed']) {
    const calls=[];
    const result = await api(async (...args)=>{calls.push(args);return response({status,transaction});}).verifyFundingReference(reference);
    assert.equal(result.status,'confirmed'); assert.equal(calls.length,1); assert.equal(calls[0][0],'/api/v1/wallet/verify/'+reference); assert.equal(calls[0][1],undefined);
  }
});
test('pending reference stays pending without any wallet or checkout write', async () => {
  const calls=[];
  const result=await api(async (...args)=>{calls.push(args);return response({status:'pending',reference,transactionId:'tx'});}).verifyFundingReference(reference);
  assert.equal(result.status,'pending'); assert.equal(calls.length,1);
});
test('malformed, foreign, wrong-type and non-completed responses cannot claim payment success', async () => {
  for (const data of [{status:'success'},{status:'completed',transaction:{...transaction,reference:'other'}},{status:'completed',transaction:{...transaction,type:'subscription_charge'}},{status:'completed',transaction:{...transaction,status:'pending'}},{status:'pending',reference:'other',transactionId:'tx'},{status:'completed',transaction:{...transaction,amountUsdCents:5.5}}]) await assert.rejects(api(async()=>response(data)).verifyFundingReference(reference));
});
test('invalid references never reach the API; unavailable and denied verification never start checkout', async () => {
  let calls=0;
  const service=api(async()=>{calls++;return new Response('{}',{status:503});});
  await assert.rejects(service.verifyFundingReference('https://foreign.test')); assert.equal(calls,0);
  await assert.rejects(service.verifyFundingReference(reference)); assert.equal(calls,1);
});
test('checkout requires a persisted matching amount/reference and allowlisted provider URL', async () => {
  let body;
  const result=await api(async (url,init)=>{assert.equal(url,'/api/v1/wallet/fund');assert.equal(init.method,'POST');body=JSON.parse(init.body);return response({status:'pending',requestId,checkoutReady:true,reference,transactionId:'tx',amountUsd:5,authorizationUrl:'https://checkout.paystack.com/fixture'});}).startFunding(5,false,requestId);
  assert.equal(result.reference,reference);assert.equal(body.saveCard,false);assert.equal(result.url,'https://checkout.paystack.com/fixture');
  for (const change of [{amountUsd:10},{reference:''},{authorizationUrl:'https://foreign.test/pay'},{transactionId:null}]) await assert.rejects(api(async()=>response({status:'pending',requestId,checkoutReady:true,reference,transactionId:'tx',amountUsd:5,authorizationUrl:'https://checkout.paystack.com/fixture',...change})).startFunding(5,true,requestId));
});
test('ambiguous checkout preserves server reference, is marked uncertain and is never replayed', async () => {
  let calls=0;
  const service=api(async()=>{calls++;return new Response(JSON.stringify({message:'unconfirmed',reference}),{status:503});});
  await assert.rejects(service.startFunding(5,false,requestId), error=>error.uncertain===true&&error.reference===reference);assert.equal(calls,1);
  for (const fetcher of [async()=>{throw Error('offline');}, async()=>new Response('bad-json')]) await assert.rejects(api(fetcher).startFunding(5,false,requestId),error=>error.uncertain===true);
});
test('input and permission rejection are explicit and never replay a write', async () => {
  let calls=0;const service=api(async()=>{calls++;return new Response('{}',{status:403});});
  for (const amount of [NaN,Infinity,0.99,1.001,21474836.48]) await assert.rejects(service.startFunding(amount,false,requestId),error=>error.uncertain===false);
  assert.equal(calls,0);await assert.rejects(service.startFunding(5,false,requestId),error=>error.uncertain===false);assert.equal(calls,1);
});
test('ledger consumes actual items, derives cents, preserves zero and distinguishes absent NGN', async () => {
  const row={...transaction,description:'Wallet funding',amountUsdCents:0,amountNgnKobo:null,createdAt:'2026-10-21T10:00:00Z'};
  const items=await api(async()=>response({items:[row],total:1})).loadTransactions();
  assert.equal(items[0].amountUsd,0);assert.equal(items[0].amountNgn,null);
  assert.equal((await api(async()=>response({items:[],total:0})).loadTransactions()).length,0);
  for (const value of [{transactions:[],total:0},{items:[{...row,amountUsdCents:'500'}],total:1},{items:[row],total:0}]) await assert.rejects(api(async()=>response(value)).loadTransactions());
});

test('durable request query accepts only one UUID v4 identity', () => {
  const service=api();
  assert.equal(service.fundingRequest('?view=console').kind,'none');
  assert.equal(service.fundingRequest('?funding_request='+requestId).requestId,requestId);
  for (const value of ['', 'invalid', requestId+'&funding_request=12345678-1234-4234-8234-123456789098']) assert.equal(service.fundingRequest('?funding_request='+value).kind,'invalid');
});
test('recovery reads existing checkout, ambiguous intent and completion without creating checkout', async () => {
  for (const [status,checkoutReady,kind] of [['pending',true,'checkout'],['pending',false,'pending'],['completed',false,'completed']]) {
    const calls=[];const result=await api(async (...args)=>{calls.push(args);return response({status,requestId,checkoutReady,reference,transactionId:'tx',amountUsd:5,authorizationUrl:'https://checkout.paystack.com/fixture'});}).recoverFundingRequest(requestId);
    assert.equal(result.kind,kind);assert.equal(calls.length,1);assert.equal(calls[0][0],'/api/v1/wallet/funding-requests/'+requestId);assert.equal(calls[0][1],undefined);
  }
});
test('only owner recovery 404 reports missing; outages and malformed responses remain blocked', async () => {
  assert.equal((await api(async()=>new Response('{}',{status:404})).recoverFundingRequest(requestId)).kind,'missing');
  for (const status of [401,403,409,503]) await assert.rejects(api(async()=>new Response('{}',{status})).recoverFundingRequest(requestId));
  const base={status:'pending',requestId,checkoutReady:true,reference,transactionId:'tx',amountUsd:5,authorizationUrl:'https://checkout.paystack.com/fixture'};
  for (const change of [{requestId:'foreign'},{amountUsd:21474836.48},{status:'completed'},{authorizationUrl:'https://foreign.test'}]) await assert.rejects(api(async()=>response({...base,...change})).recoverFundingRequest(requestId));
  let calls=0;await assert.rejects(api(async()=>{calls++;}).recoverFundingRequest('invalid'));assert.equal(calls,0);
});
test('explicit submission preserves the durable request identity on the only POST', async () => {
  let calls=0;const service=api(async (url,init)=>{calls++;assert.equal(JSON.parse(init.body).requestId,requestId);return response({status:'pending',requestId,checkoutReady:false,reference,transactionId:'tx',amountUsd:5});});
  assert.equal((await service.startFunding(5,false,requestId)).kind,'pending');assert.equal(calls,1);
});
