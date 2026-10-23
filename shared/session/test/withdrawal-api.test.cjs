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
  return load('withdrawal-api');
}

const response = data => new Response(JSON.stringify({status:'success',data}));
const id='12345678-1234-4234-8234-123456789099';
const input={requestId:id,bankAccountId:'bank',amountUsd:5};
const quote={...input,quoteId:id,reference:'wd_'+'a'.repeat(40),amountUsdCents:500,grossKobo:50000,netKobo:49000,transferFeeKobo:1000,stampDutyKobo:0,totalFeeKobo:1000,rate:100,expiresAt:new Date(Date.now()+300000).toISOString()};
test('recovery parameters never establish success',()=>{const a=api();assert.equal(a.withdrawalRequest('?paid=true'),null);assert.equal(a.withdrawalRequest('?withdrawal_request='+id),id);for(const q of ['?withdrawal_request=','?withdrawal_request=invalid','?withdrawal_request='+id+'&withdrawal_request='+id])assert.throws(()=>a.withdrawalRequest(q));});
test('quotes require matching identity, exact fees and current expiry',()=>{const a=api();assert.equal(a.validateWithdrawalQuote(quote,input),quote);for(const change of [{bankAccountId:'foreign'},{requestId:'foreign'},{netKobo:50000},{stampDutyKobo:50},{grossKobo:50000.5},{rate:NaN},{expiresAt:'invalid'},{expiresAt:new Date(0).toISOString()}])assert.throws(()=>a.validateWithdrawalQuote({...quote,...change},input));});
test('confirmation sends reviewed immutable details once',async()=>{const calls=[];const a=api(async(...args)=>{calls.push(args);return response({reference:quote.reference,status:'processing'});});await a.confirmWithdrawal(quote);assert.equal(calls.length,1);assert.equal(calls[0][0],'/api/v1/withdrawals');assert.deepEqual(JSON.parse(calls[0][1].body),{requestId:id,quoteId:id,bankAccountId:'bank',amountUsd:5});});
test('expired confirmation cannot send a write',async()=>{let calls=0;const a=api(async()=>{calls++;});await assert.rejects(a.confirmWithdrawal({...quote,expiresAt:new Date(0).toISOString()}));assert.equal(calls,0);});
test('ambiguous submission is never replayed',async()=>{let calls=0;const a=api(async()=>{calls++;throw Error('lost');});await assert.rejects(a.confirmWithdrawal(quote));assert.equal(calls,1);});
test('recovery reads only and rejects invented success',async()=>{const calls=[];const a=api(async(...args)=>{calls.push(args);return response({reference:quote.reference,status:'processing'});});assert.equal((await a.recoverWithdrawal(id)).status,'processing');assert.equal(calls[0][1],undefined);assert.equal(calls[0][0],'/api/v1/withdrawals/requests/'+id);await assert.rejects(api(async()=>response({reference:quote.reference,status:'success'})).recoverWithdrawal(id));});

test('unsent cancellation uses one explicit POST and accepts only confirmed cancellation',async()=>{const calls=[];const a=api(async(...args)=>{calls.push(args);return response({withdrawalId:'fixture',reference:quote.reference,status:'cancelled'});});assert.equal((await a.cancelUndispatchedWithdrawal(quote.reference)).status,'cancelled');assert.equal(calls.length,1);assert.equal(calls[0][1].method,'POST');assert.equal(calls[0][0],'/api/v1/withdrawals/'+quote.reference+'/cancel');await assert.rejects(api(async()=>response({status:'processing'})).cancelUndispatchedWithdrawal(quote.reference));});

test('refund breakdown requires terminal status and exact conservation',async()=>{const refund={grossUsdCents:500,refundUsdCents:490,retainedUsdCents:10,retainedKobo:1000};const value={reference:quote.reference,status:'reversed',refund};assert.equal((await api(async()=>response(value)).recoverWithdrawal(id)).refund.refundUsdCents,490);for(const bad of [{...value,status:'processing'},{...value,refund:{...refund,refundUsdCents:500}},{...value,refund:{...refund,retainedKobo:-1}}])await assert.rejects(api(async()=>response(bad)).recoverWithdrawal(id));});
