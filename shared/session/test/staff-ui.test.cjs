const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

// Runs the real component effects and event handlers without a DOM or network.
function mount(file, dependencies, props = {}) {
  const slots = [], effects = []; let cursor = 0, tree, component;
  const changed = (a, b) => !a || a.length !== b.length || a.some((v, i) => v !== b[i]);
  const react = {
    createElement: (type, props, ...children) => ({type, props: props || {}, children}),
    useState(initial) { const i = cursor++; if (!(i in slots)) slots[i] = initial; return [slots[i], value => {slots[i] = typeof value === 'function' ? value(slots[i]) : value;}]; },
    useEffect(fn, deps) { const i = cursor++; if (changed(slots[i]?.deps, deps)) { slots[i]?.cleanup?.(); slots[i] = {deps}; effects.push(() => {slots[i].cleanup = fn();}); } },
    useCallback(fn, deps) { const i = cursor++; if (changed(slots[i]?.deps, deps)) slots[i] = {deps, fn}; return slots[i].fn; },
  };
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(path.resolve(__dirname, '../../../web', file), 'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS, jsx:ts.JsxEmit.React, esModuleInterop:true}}).outputText;
  vm.runInNewContext(code, {exports, URL, AbortController, window:{location:{origin:'https://staging-auth.crimfig.com'}}, require: name => {
    if (name === 'react') return react;
    if (name in dependencies) return dependencies[name];
    if (name === 'next/navigation') return {useRouter: () => ({push(){}})};
    return new Proxy({}, {get: (_target, key) => String(key)});
  }, fetch: () => {throw Error('Raw cookie-only fetch is forbidden');}});
  component = Object.values(exports).find(value => typeof value === 'function');
  return {render(){cursor = 0; tree = component(props); while(effects.length) effects.shift()(); return tree;}, async settle(){await new Promise(resolve => setImmediate(resolve)); return this.render();}, nodes(){const result=[];function visit(n){if(!n || typeof n !== 'object')return;if(Array.isArray(n)){n.forEach(visit);return;}result.push(n);n.children?.forEach(visit);}visit(tree);return result;}, unmount(){slots.forEach(value => value?.cleanup?.());}};
}
const text = n => typeof n === 'string' ? n : Array.isArray(n) ? n.map(text).join('') : n?.children?.map(text).join('') || '';

test('Auth staff guard uses the shared bearer session and accepts only verified staff', async () => {
  for(const isStaff of [true, false]) {
    const calls=[];
    const app=mount('auth/src/components/AuthAdminGuard.tsx', {'../lib/consent':{consentSession:()=>({request:async(url, init)=>{calls.push([url,init]);return Response.json({data:{userId:'user',isStaff,roles:isStaff?['support_agent']:[]}});}})}}, {children:'PRIVATE DIRECTORY'});
    app.render();const result=await app.settle();
    assert.equal(calls.length,1);assert.equal(calls[0][0].href,'https://staging-auth.crimfig.com/api/v1/auth/staff-status');
    assert.equal(text(result).includes('PRIVATE DIRECTORY'),isStaff);app.unmount();
  }
});

test('Auth staff response arriving after unmount never authorizes the directory', async () => {
  let resolve;const pending=new Promise(r=>resolve=r);
  const app=mount('auth/src/components/AuthAdminGuard.tsx', {'../lib/consent':{consentSession:()=>({request:()=>pending})}}, {children:'PRIVATE DIRECTORY'});
  app.render();app.unmount();resolve(Response.json({data:{userId:'user',isStaff:true,roles:['support_agent']}}));
  assert.equal(text(await app.settle()).includes('PRIVATE DIRECTORY'),false);
});

test('Auth staff guard fails closed on malformed staff data, HTTP denial and connection failure', async () => {
  for(const request of [async()=>Response.json({data:{isStaff:'true'}}), async()=>new Response(null,{status:403}), async()=>{throw Error('offline');}]) {
    const app=mount('auth/src/components/AuthAdminGuard.tsx', {'../lib/consent':{consentSession:()=>({request})}}, {children:'PRIVATE DIRECTORY'});
    app.render();assert.equal(text(await app.settle()).includes('PRIVATE DIRECTORY'),false);app.unmount();
  }
});

for(const roles of [[], ['ads_support'], ['ads_admin'], ['ads_reviewer'], ['ads_manager'], ['super_admin']]) test(`moderation controls follow exact server role requirements: ${roles.join() || 'none'}`, async () => {
  const app=mount('ads/src/components/console/AdminModerationQueue.tsx', {'../../lib/session':{sessionFetch:async url=>Response.json(String(url).includes('staff-status')?{data:{isStaff:roles.length>0,roles}}:{data:{campaigns:[{id:'camp',title:'Test',pricingModel:'cpm',budgetUsdCents:100}],creatives:[{id:'creative',destinationUrl:'https://example.com',mediaFormat:'image'}],totalPending:2}})}}, {apiBase:''});
  app.render();await app.settle();await app.settle();
  let buttons=app.nodes().filter(n=>typeof n.props.onClick==='function');
  assert.equal(buttons.some(n=>text(n)==='Approve'),roles.includes('ads_reviewer'));
  const campaigns=buttons.find(n=>text(n).includes('Campaigns')); assert.ok(campaigns);campaigns.props.onClick();app.render();
  buttons=app.nodes().filter(n=>typeof n.props.onClick==='function');
  assert.equal(buttons.some(n=>text(n)==='Approve & Pass to Manager'),roles.includes('ads_reviewer'));
  assert.equal(buttons.some(n=>text(n)==='Emergency Override'),roles.includes('super_admin'));
  const manager=buttons.find(n=>text(n).includes('Manager'));if(manager && !text(manager).includes('Approve')){manager.props.onClick();await app.settle();buttons=app.nodes().filter(n=>typeof n.props.onClick==='function');assert.equal(buttons.some(n=>text(n)==='Approve Campaign'),roles.includes('ads_manager'));}
});
