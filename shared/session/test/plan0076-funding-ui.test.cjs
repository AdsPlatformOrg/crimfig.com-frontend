const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

// Runs the real component effects and event handlers without a DOM or network.
function mount(file, dependencies, props = {}) {
  const slots = [], effects = [], timers=[], history=[]; let cursor = 0, tree, component;
  const changed = (a, b) => !a || a.length !== b.length || a.some((v, i) => v !== b[i]);
  const react = {
    Fragment:'Fragment',
    createElement: (type, props, ...children) => ({type, props: props || {}, children}),
    useId: () => 'help-id',
    useRef(initial = null) {const i=cursor++;if(!(i in slots))slots[i]={current:initial};return slots[i];},
    useState(initial) { const i = cursor++; if (!(i in slots)) slots[i] = typeof initial==='function'?initial():initial; return [slots[i], value => {slots[i] = typeof value === 'function' ? value(slots[i]) : value;}]; },
    useEffect(fn, deps) { const i = cursor++; if (changed(slots[i]?.deps, deps)) { slots[i]?.cleanup?.(); slots[i] = {deps}; effects.push(() => {slots[i].cleanup = fn();}); } },
    useCallback(fn, deps) { const i = cursor++; if (changed(slots[i]?.deps, deps)) slots[i] = {deps, fn}; return slots[i].fn; },
  };
  const exports = {};
  const adsFunding = {}; const billingCopy = {}; vm.runInNewContext(ts.transpileModule(fs.readFileSync(path.resolve(__dirname, '../../../web/billing/src/lib/billing-copy.ts'), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, { exports: billingCopy });
  const storage = props.storage || new Map();
  const helper = ts.transpileModule(fs.readFileSync(path.resolve(__dirname, '../../../web/billing/src/lib/ads-funding-return.ts'), 'utf8'), {
    compilerOptions: {module: ts.ModuleKind.CommonJS},
  }).outputText;
  vm.runInNewContext(helper, {exports: adsFunding, URLSearchParams, require: () => dependencies['../../lib/funding-api']});
  const code = ts.transpileModule(fs.readFileSync(path.resolve(__dirname, '../../../web', file), 'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS, jsx:ts.JsxEmit.React, esModuleInterop:true}}).outputText;
  vm.runInNewContext(code, {exports,process:{env:{NODE_ENV:'production'}},setTimeout:fn=>{timers.push(fn);return timers.length;},clearTimeout:id=>{timers[id-1]=null;}, React: react, URL, URLSearchParams, HTMLElement:class HTMLElement{}, AbortController, crypto: require('node:crypto').webcrypto, document: {addEventListener(){}, removeEventListener(){}}, window:{crypto:require('node:crypto').webcrypto,location:{origin:'https://staging-billing.crimfig.com',href:'https://staging-billing.crimfig.com/?view=console',search:props.search||'',assign:target=>{history.push(target);},replace:target=>{history.push(target);}},sessionStorage:{getItem:key=>storage.get(key)??null,setItem:(key,value)=>storage.set(key,value)},history:{pushState(_state,_title,url){history.push(String(url));},replaceState(_state,_title,url){history.push(String(url));}},addEventListener(){},removeEventListener(){}}, require: name => {
    if (name === 'react' || name === 'react/jsx-runtime') return react;
    if (name === '../../lib/ads-funding-return') return adsFunding; if (name === '../../lib/billing-copy') return billingCopy; if (name === '../../../../../shared/ui/localization/locale') return { publishedLocales: ['en', 'fr', 'es'] };
    if (name in dependencies) return dependencies[name];
    if (name === 'next/navigation') return {useRouter: () => ({push(){}})};
    return new Proxy({}, {get: (_target, key) => String(key)});
  }, fetch: () => {throw Error('Raw cookie-only fetch is forbidden');}});
  component = Object.values(exports).find(value => typeof value === 'function');
  return {history:()=>history,fireTimers(){const pending=timers.splice(0);pending.forEach(fn=>fn?.());},render(){cursor = 0; tree = component(props); while(effects.length) effects.shift()(); return tree;}, async settle(){await new Promise(resolve => setImmediate(resolve)); return this.render();}, nodes(){const result=[];function visit(n){if(!n || typeof n !== 'object')return;if(Array.isArray(n)){n.forEach(visit);return;}result.push(n);n.children?.forEach(visit);}visit(tree);return result;}, unmount(){slots.forEach(value => value?.cleanup?.());}};
}
const text = n => typeof n === 'string' || typeof n === 'number' ? String(n) : Array.isArray(n) ? n.map(text).join('') : n?.children?.map(text).join('') || '';

class FundingStartError extends Error{constructor(message,uncertain,reference){super(message);this.uncertain=uncertain;this.reference=reference;}}
const id='12345678-1234-4234-8234-123456789099';

const button=(app,label)=>app.nodes().find(n=>typeof n.props.onClick==='function'&&text(n).trim()===label);
function billing(overrides={},search='',bankDirectory,initialTab,storage){
 const sends=[],checks=[];const funding={fundingReturn:()=>({kind:'none'}),fundingRequest:value=>new URLSearchParams(value).has('funding_request')?{kind:'valid',requestId:id}:{kind:'none'},validFundingRequestId:value=>typeof value==='string'&&value.length===36,validFundingReference:value=>typeof value==='string'&&/^[a-z0-9-]+$/i.test(value),recoverFundingRequest:async()=>{throw Error('lookup unavailable');},verifyFundingReference:async reference=>{checks.push(reference);return {status:'pending',reference};},startFunding:async(amount,save,requestId)=>{sends.push({amount,save,requestId});return {kind:'checkout',requestId,reference:'crimfig-fund-new',amountUsd:amount,url:'https://checkout.paystack.com/unit-test'};},FundingStartError,loadTransactions:async()=>[],...overrides};
 const app=mount('billing/src/components/console/BillingConsole.tsx',{'../../../../../shared/ui/localization/LocalizationProvider':{useLanguage:()=>({locale:'en',t:k=>k})},'../../lib/session':{dashboardSession:()=>({}),sessionFetch:async()=>Response.json({data:[]})},'../../../../../shared/ui/origins':{ecosystemOrigin:app=>`https://staging-${app}.crimfig.com`},'../../lib/use-dialog':{useDialog:()=>({current:null})},'../../lib/wallet-view':{walletView:()=>({availableUsd:0,lockedUsd:0,totalUsd:0,rate:1500,rateSource:'unit fixture',lastUpdated:'12:00'})},'../../lib/billing-api':{billingData:async path=>path==='/api/v1/bank-accounts/banks'&&bankDirectory?bankDirectory():path==='/api/v1/subscriptions/catalog'?{}:path==='/api/v1/wallet'?{}:[],resolveBank:async()=>{},saveBank:async()=>{}},'../../lib/funding-api':funding},{search,initialTab,storage});
 return {app,sends,checks,funding};
}
async function ready(app){app.render();await app.settle();await app.settle();}
const deposit=app=>app.nodes().find(n=>typeof n.props.onClick==='function'&&text(n).trim()==='Fund Wallet'&&!n.props['aria-label']);
test('old unavailable recovery never blocks a fresh zero-balance account deposit',async()=>{
 const f=billing({},'?funding_request='+id);await ready(f.app);const open=deposit(f.app);assert.ok(open);assert.equal(Boolean(open.props.disabled),false);open.props.onClick();f.app.render();const pay=button(f.app,'Pay $50.00 USD');assert.ok(pay);assert.equal(Boolean(pay.props.disabled),false);pay.props.onClick();await ready(f.app);assert.equal(f.sends.length,1);assert.notEqual(f.sends[0].requestId,id);assert.ok(f.app.history().some(url=>url==='https://checkout.paystack.com/unit-test'));f.app.unmount();
});
test('uncertain same-intent retry reuses exact body; explicit separate deposit gets another UUID',async()=>{
 const sends=[];const f=billing({startFunding:async(amount,save,requestId)=>{sends.push({amount,save,requestId});throw new FundingStartError('Outcome unknown',true);}});await ready(f.app);deposit(f.app).props.onClick();f.app.render();button(f.app,'Pay $50.00 USD').props.onClick();await ready(f.app);assert.ok(button(f.app,'Start a separate deposit'));assert.equal(button(f.app,'Pay $50.00 USD').props.disabled,true);await button(f.app,'Retry same request').props.onClick();await ready(f.app);assert.equal(sends.length,2);assert.deepEqual(sends[0],sends[1]);button(f.app,'Start a separate deposit').props.onClick();f.app.render();button(f.app,'Pay $50.00 USD').props.onClick();await ready(f.app);assert.equal(sends.length,3);assert.notEqual(sends[2].requestId,sends[0].requestId);f.app.unmount();
});
test('rapid submit dispatches one funding intent while the active request is in flight',async()=>{
 let resolve;const sends=[];const f=billing({startFunding:async(amount,save,requestId)=>{sends.push(requestId);return new Promise(r=>resolve=()=>r({kind:'checkout',requestId,reference:'ref',amountUsd:amount,url:'https://checkout.paystack.com/unit-test'}));}});await ready(f.app);deposit(f.app).props.onClick();f.app.render();const pay=button(f.app,'Pay $50.00 USD');pay.props.onClick();pay.props.onClick();assert.equal(sends.length,1);resolve();await ready(f.app);f.app.unmount();
});
test('optional lookup cannot overwrite a separately edited new deposit amount',async()=>{
 let resolve;const f=billing({recoverFundingRequest:()=>new Promise(r=>resolve=r)},'?funding_request='+id);await ready(f.app);deposit(f.app).props.onClick();f.app.render();const amount=f.app.nodes().find(n=>n.props.id==='billing-fund-amount');amount.props.onChange({target:{value:'20'}});f.app.render();resolve({kind:'checkout',requestId:id,reference:'old-ref',amountUsd:999,url:'https://checkout.paystack.com/unit-test-old'});await ready(f.app);assert.ok(button(f.app,'Pay $20.00 USD'));assert.equal(f.sends.length,0);f.app.unmount();
});


test('valid provider return verifies automatically despite an invalid stale lookup parameter',async()=>{
 const f=billing({fundingReturn:()=>({kind:'valid',reference:'paid-ref'}),fundingRequest:()=>({kind:'invalid'}),verifyFundingReference:async ref=>{f.checks.push(ref);return {status:'confirmed',reference:ref};}},'?reference=paid-ref&funding_request=bad');await ready(f.app);assert.deepEqual(f.checks,['paid-ref']);assert.ok(text(f.app.render()).includes('Payment confirmed.'));assert.equal(f.sends.length,0);f.app.unmount();
});
test('pending return is checked automatically with bounded read-only polling and no checkout creation',async()=>{
 let reads=0;const f=billing({fundingReturn:()=>({kind:'valid',reference:'pending-ref'}),verifyFundingReference:async reference=>{reads++;return {status:reads===3?'confirmed':'pending',reference};}});await ready(f.app);assert.equal(reads,1);f.app.fireTimers();await ready(f.app);assert.equal(reads,2);f.app.fireTimers();await ready(f.app);assert.equal(reads,3);assert.ok(text(f.app.render()).includes('Payment confirmed.'));f.app.fireTimers();await ready(f.app);assert.equal(reads,3);assert.equal(f.sends.length,0);f.app.unmount();
});


test('checking another owned transaction stays available during old lookup/verification',async()=>{
 let resolve;const checked=[];const f=billing({recoverFundingRequest:async()=>({kind:'pending',requestId:id,reference:'first-ref',amountUsd:5}),loadTransactions:async()=>[{id:'row2',type:'wallet_fund',status:'pending',reference:'second-ref',amountUsd:5,amountNgn:7500,createdAt:'Today',description:'Deposit'}],verifyFundingReference:async reference=>{checked.push(reference);if(reference==='first-ref')return new Promise(r=>resolve=()=>r({status:'pending',reference}));return {status:'confirmed',reference};}},'?funding_request='+id);await ready(f.app);button(f.app,'View transactions').props.onClick();f.app.render();const check=button(f.app,'Check payment');assert.ok(check);assert.equal(Boolean(check.props.disabled),false);check.props.onClick();await ready(f.app);assert.deepEqual(checked,['first-ref','second-ref']);resolve();await ready(f.app);assert.ok(text(f.app.render()).includes('Payment confirmed.'));assert.equal(f.sends.length,0);f.app.unmount();
});
test('pending automatic checks stop after six follow-ups and never initialize another payment',async()=>{
 let reads=0;const f=billing({fundingReturn:()=>({kind:'valid',reference:'forever-pending'}),verifyFundingReference:async reference=>{reads++;return {status:'pending',reference};}});await ready(f.app);for(let i=0;i<10;i++){f.app.fireTimers();await ready(f.app);}assert.equal(reads,7);assert.equal(f.sends.length,0);assert.ok(text(f.app.render()).includes('Payment is still pending'));f.app.unmount();
});


test('closing an active checkout form does not redirect later or cancel the stored request',async()=>{
 let resolve;const f=billing({startFunding:async(amount,save,requestId)=>new Promise(r=>resolve=()=>r({kind:'checkout',requestId,reference:'ref',amountUsd:amount,url:'https://checkout.paystack.com/late-checkout'}))});await ready(f.app);deposit(f.app).props.onClick();f.app.render();button(f.app,'Pay $50.00 USD').props.onClick();f.app.render();const close=f.app.nodes().find(n=>n.props['aria-label']==='Close Deposit to CrimFig Wallet');close.props.onClick();f.app.render();resolve();await ready(f.app);assert.equal(f.app.history().includes('https://checkout.paystack.com/late-checkout'),false);assert.ok(button(f.app,'Resume existing checkout'));assert.equal(f.sends.length,0);f.app.unmount();
});

test('bank directory failure is local to bank setup and retry can load options',async()=>{
 let calls=0;
 const {app}=billing({},'',async()=>{if(++calls===1)throw Error('gateway unavailable');return [{name:'Fixture Bank',code:'001'}];},'bank_accounts');
 await ready(app);
 assert.equal(calls,0);
 button(app,'Add Bank Account').props.onClick();
 await ready(app);
 assert.match(app.nodes().filter(n=>n.props.role==='alert').map(text).join(' '),/Bank directory is temporarily unavailable/);
 button(app,'Retry bank list').props.onClick();
 await ready(app);
 assert.equal(calls,2);
 assert.equal(app.nodes().find(n=>n.props.id==='billing-bank-code').props.disabled,false);
 assert.ok(app.nodes().some(n=>n.type==='option'&&n.props.value==='001'));
 app.unmount();
});
test('known checkout preflight failure clears the recovery prompt and permits a fresh request',async()=>{
 const sends=[];
 const {app}=billing({startFunding:async(_amount,_save,requestId)=>{sends.push(requestId);throw new FundingStartError('Checkout is not configured',false);}});
 await ready(app);deposit(app).props.onClick();app.render();
 button(app,'Pay $50.00 USD').props.onClick();await ready(app);
 assert.equal(button(app,'Find existing payment'),undefined);
 assert.equal(button(app,'Pay $50.00 USD').props.disabled,false);
 button(app,'Pay $50.00 USD').props.onClick();await ready(app);
 assert.notEqual(sends[0],sends[1]);
 app.unmount();
});


const adsReturn = 'https://staging-ads.crimfig.com/billing';
const adsMenu = app => app.nodes().flatMap(node => node.props.groups || [])
  .flatMap(group => group.items).find(item => item.id === 'back_to_ads_billing');
const originStorage = (reference) => new Map([['crimfig.ads-wallet-funding', JSON.stringify({ requestId: id, reference })]]);

test('an unrelated confirmed payment and an arbitrary return URL cannot redirect to Ads', async () => {
  const f = billing({
    fundingReturn: () => ({ kind: 'valid', reference: 'other-ref' }),
    verifyFundingReference: async reference => ({ status: 'confirmed', reference }),
  }, '?reference=other-ref&funding_source=ads&returnTo=https://invalid.example', undefined, undefined, originStorage('ads-ref'));
  await ready(f.app);
  assert.equal(adsMenu(f.app), undefined);
  assert.deepEqual(f.app.history(), []);
  f.app.unmount();
});

test('pending and unavailable Ads payment checks keep the back link without redirecting', async () => {
  for (const verifyFundingReference of [
    async reference => ({ status: 'pending', reference }),
    async () => { throw Error('provider status unavailable'); },
  ]) {
    const f = billing({
      fundingReturn: () => ({ kind: 'valid', reference: 'ads-ref' }),
      verifyFundingReference,
    }, '?reference=ads-ref', undefined, undefined, originStorage('ads-ref'));
    await ready(f.app);
    assert.equal(adsMenu(f.app)?.href, adsReturn);
    assert.deepEqual(f.app.history(), []);
    f.app.unmount();
  }
});

test('Ads entry opens the deposit and binds a new checkout across provider return', async () => {
  const storage = new Map();
  const entry = billing({}, '?funding_source=ads', undefined, undefined, storage);
  await ready(entry.app);
  assert.equal(adsMenu(entry.app)?.href, adsReturn);
  button(entry.app, 'Pay $50.00 USD').props.onClick();
  await ready(entry.app);
  assert.equal(entry.sends.length, 1);
  assert.ok(entry.app.history().includes('https://checkout.paystack.com/unit-test'));
  entry.app.unmount();

  const returned = billing({
    fundingReturn: () => ({ kind: 'valid', reference: 'crimfig-fund-new' }),
    verifyFundingReference: async reference => ({ status: 'confirmed', reference }),
  }, '?reference=crimfig-fund-new', undefined, undefined, storage);
  await ready(returned.app);
  assert.deepEqual(returned.app.history(), [adsReturn]);
  assert.equal(returned.sends.length, 0);
  returned.app.unmount();
});
