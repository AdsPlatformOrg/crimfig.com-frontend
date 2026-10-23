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
  return load('subscription-api');
}

const id='12345678-1234-4234-8234-123456789099';
const response = data => new Response(JSON.stringify({status:'success',data}));
const value={requestId:id,reference:'cf-sub-'+'a'.repeat(64),status:'pending',subscriptionId:null,amountUsdCents:500,amountNgnKobo:50000,checkoutUrl:'https://checkout.paystack.com/fixture'};
test('subscription URL identifies a request but never proves payment',()=>{const a=api();assert.equal(a.subscriptionRequest('?success=true'),null);assert.equal(a.subscriptionRequest('?subscription_request='+id),id);for(const query of ['?subscription_request=bad','?subscription_request='+id+'&subscription_request='+id])assert.throws(()=>a.subscriptionRequest(query));});
test('subscription acknowledgement binds identity, amounts and checkout destination',()=>{const a=api();assert.equal(a.validateSubscriptionPayment(value,id),value);for(const change of [{requestId:'other'},{reference:'wallet-reference'},{amountUsdCents:-1},{amountNgnKobo:NaN},{checkoutUrl:'https://evil.example/'},{status:'success'},{status:'completed',subscriptionId:null},{status:'completed',subscriptionId:id}])assert.throws(()=>a.validateSubscriptionPayment({...value,...change},id));assert.equal(a.validateSubscriptionPayment({...value,status:'completed',subscriptionId:id,checkoutUrl:null},id).status,'completed');});
test('checkout sends one explicit request with immutable purchase identity',async()=>{const calls=[];const a=api(async(...args)=>{calls.push(args);return response(value);});await a.startSubscription({requestId:id,appSlug:'chat',planId:'chat_pro',interval:'monthly'},500);assert.equal(calls.length,1);assert.equal(calls[0][1].method,'POST');assert.deepEqual(JSON.parse(calls[0][1].body),{requestId:id,appSlug:'chat',planId:'chat_pro',interval:'monthly'});});
test('uncertain checkout never automatically repeats the POST',async()=>{let calls=0;const a=api(async()=>{calls++;throw Error('lost response');});await assert.rejects(a.startSubscription({requestId:id,appSlug:'chat',planId:'chat_pro',interval:'monthly'},500));assert.equal(calls,1);});
test('recovery uses owner-bound GET and validates the returned request',async()=>{const calls=[];const a=api(async(...args)=>{calls.push(args);return response(value);});await a.recoverSubscription(id);assert.equal(calls[0][0],'/api/v1/subscriptions/requests/'+id);assert.equal(calls[0][1],undefined);await assert.rejects(api(async()=>response({...value,requestId:'other'})).recoverSubscription(id));});
