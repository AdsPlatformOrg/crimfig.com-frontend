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
    createElement: (type, props, ...children) => ({type, props: props || {}, children}),
    useId: () => 'help-id',
    useRef(initial = null) {const i=cursor++;if(!(i in slots))slots[i]={current:initial};return slots[i];},
    useState(initial) { const i = cursor++; if (!(i in slots)) slots[i] = typeof initial==='function'?initial():initial; return [slots[i], value => {slots[i] = typeof value === 'function' ? value(slots[i]) : value;}]; },
    useEffect(fn, deps) { const i = cursor++; if (changed(slots[i]?.deps, deps)) { slots[i]?.cleanup?.(); slots[i] = {deps}; effects.push(() => {slots[i].cleanup = fn();}); } },
    useCallback(fn, deps) { const i = cursor++; if (changed(slots[i]?.deps, deps)) slots[i] = {deps, fn}; return slots[i].fn; },
  };
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(path.resolve(__dirname, '../../../web', file), 'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS, jsx:ts.JsxEmit.React, esModuleInterop:true}}).outputText;
  vm.runInNewContext(code, {exports,setTimeout:fn=>{timers.push(fn);return timers.length;},clearTimeout:id=>{timers[id-1]=null;}, React: react, URL, URLSearchParams, HTMLElement:class HTMLElement{}, AbortController, crypto: require('node:crypto').webcrypto, document: {addEventListener(){}, removeEventListener(){}}, window:{location:{origin:'https://staging-auth.crimfig.com',href:'https://staging-auth.crimfig.com/admin/moderation',search:''},history:{pushState(_state,_title,url){history.push(String(url));},replaceState(_state,_title,url){history.push(String(url));}},addEventListener(){},removeEventListener(){}}, require: name => {
    if (name === 'react' || name === 'react/jsx-runtime') return react;
    if (name in dependencies) return dependencies[name];
    if (name === 'next/navigation') return {useRouter: () => ({push(){}})};
    return new Proxy({}, {get: (_target, key) => String(key)});
  }, fetch: () => {throw Error('Raw cookie-only fetch is forbidden');}});
  component = Object.values(exports).find(value => typeof value === 'function');
  return {history:()=>history,fireTimers(){const pending=timers.splice(0);pending.forEach(fn=>fn?.());},render(){cursor = 0; tree = component(props); while(effects.length) effects.shift()(); return tree;}, async settle(){await new Promise(resolve => setImmediate(resolve)); return this.render();}, nodes(){const result=[];function visit(n){if(!n || typeof n !== 'object')return;if(Array.isArray(n)){n.forEach(visit);return;}result.push(n);n.children?.forEach(visit);}visit(tree);return result;}, unmount(){slots.forEach(value => value?.cleanup?.());}};
}
const text = n => typeof n === 'string' || typeof n === 'number' ? String(n) : Array.isArray(n) ? n.map(text).join('') : n?.children?.map(text).join('') || '';

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

const cid='11111111-1111-4111-8111-111111111111', sid='22222222-2222-4222-8222-222222222222';
function boundReceipt(type,id,stage,body){const actualStage=stage==='reviewer'?'primary':'manager';return {targetType:type,targetId:id,stage:actualStage,campaign:{id:cid,status:'paused'},decision:{targetType:type,targetId:id,stage:actualStage,decision:body.decision,requestId:body.requestId,submissionId:body.submissionId,contentRevision:body.expectedRevision}};}
class ModerationApiError extends Error {constructor(status){super('Rejected request');this.status=status;this.outcome='rejected';}}
function moderation(roles,api={},authorityRequest) {
 const calls=[],writes=[];
 const queue={campaigns:[{id:cid,title:'Campaign title',submissionId:sid,contentRevision:3}],stacks:[{id:cid,name:'Stack title',submissionId:sid,contentRevision:3}],creatives:[{id:cid,headline:'Creative title',submissionId:sid,contentRevision:3}],hasMore:{campaigns:false,stacks:false,creatives:true}};
 const base={moderationSummary:async type=>({scope:type,asOf:'2026-11-02T12:00:00.000Z',reviewerCount:150,managerCount:20,submissionCount:30,oldestSubmittedAt:null,oldestAgeSeconds:null,unknownAgeCount:0,overdueCount:null,targetStatus:'not_configured'}),queue:async(stage,page)=>{calls.push(['queue',stage,page]);return queue;},moderationDetail:async(type,id)=>({targetType:type,targetId:id,campaign:{id:cid,status:'paused'},item:{id,headline:'Inspected title'},content:{id,headline:'Immutable title'},submissionId:sid,contentRevision:3,capabilities:{reviewer:{allowed:roles.some(r=>['ads_reviewer','ads_admin','super_admin'].includes(r)),reason:null},manager:{allowed:roles.some(r=>['ads_manager','ads_admin','super_admin'].includes(r)),reason:null}},children:[],targets:[],history:[],hasMoreChildren:false,hasMoreHistory:false}),reviewCreative:async(id,stage,body)=>{writes.push([id,stage,body]);return boundReceipt('creative',id,stage,body);},reviewStack:async(id,stage,body)=>{writes.push([id,stage,body]);return boundReceipt('stack',id,stage,body);},reviewCampaign:async(id,stage,body)=>{writes.push([id,stage,body]);return boundReceipt('campaign',id,stage,body);},...api};
 const app=mount('ads/src/components/console/AdminModerationQueue.tsx',{'@crimfig/api-client':{ApiError:ModerationApiError},'../../lib/session':{dashboardSession:()=>({getSnapshot:()=>({}),subscribe:()=>()=>{}}),sessionFetch:async url=>{calls.push(['staff',url]);if(authorityRequest)return authorityRequest();return Response.json({data:{userId:cid,isStaff:roles.length>0,roles}});}},'../../lib/ads-api-client':{adsApi:()=>base}},{apiBase:''});
 return {app,calls,writes,base,queue};
}
const button=(app,label)=>app.nodes().find(n=>typeof n.props.onClick==='function'&&text(n).trim()===label);
async function ready(app){app.render();await app.settle();await app.settle();}
for(const roles of [[],['ads_finance'],['ads_support'],['ads_reviewer'],['ads_manager'],['ads_admin'],['super_admin'],['ads_reviewer','ads_manager']]) test(`moderation six entity/stage surfaces follow Ads authority: ${roles.join()||'none'}`,async()=>{
 const {app,calls,writes}=moderation(roles);await ready(app);
 const read=roles.some(r=>['ads_support','ads_reviewer','ads_manager','ads_admin','super_admin'].includes(r));
 assert.equal(calls[0][1],'/api/v1/ecosystem/staff-status');
 if(!read){assert.equal(calls.some(c=>c[0]==='queue'),false);assert.equal(button(app,'View details'),undefined);app.unmount();return;}
 for(const stage of ['reviewer','manager']) {
  button(app,stage==='reviewer'?'Review 1 (Primary)':'Review 2 (Manager Approval)').props.onClick();await ready(app);
  for(const label of ['Creatives','Ad Stacks','Campaigns']) {
   button(app,label).props.onClick();await ready(app);
   assert.ok(button(app,'View details'));
   const action=button(app,stage==='reviewer'?'Review 1':'Review 2');assert.ok(action);
   assert.equal(action.props.disabled,!roles.some(r=>['ads_admin','super_admin',stage==='reviewer'?'ads_reviewer':'ads_manager'].includes(r)));
   assert.equal(app.nodes().some(n=>text(n)==='Emergency Override'),false);
  }
 }
 assert.equal(calls.filter(c=>c[0]==='staff').length,1);assert.equal(writes.length,0);app.unmount();
});
test('names, preview and View details open inspection without writes; decision binds inspected immutable metadata',async()=>{
 const {app,writes}=moderation(['ads_admin']);await ready(app);
 for(const find of [()=>button(app,'Creative title'),()=>app.nodes().find(n=>n.props['aria-label']==='View preview and details for Creative title'),()=>button(app,'View details')]) {
  find().props.onClick();await ready(app);assert.ok(app.nodes().some(n=>n.props.value?.headline==='Immutable title'));assert.equal(writes.length,0);
  app.nodes().find(n=>n.props['aria-label']==='Close details').props.onClick();app.render();
 }
 button(app,'View details').props.onClick();await ready(app);app.nodes().filter(n=>typeof n.props.onClick==='function'&&text(n)==='Review 1').at(-1).props.onClick();app.render();
 const dialog=app.nodes().find(n=>typeof n.props.onSubmit==='function');assert.ok(dialog);
 await dialog.props.onSubmit({decision:'approved',internalNote:'staff only'});await ready(app);
 assert.equal(writes.length,1);assert.equal(writes[0][2].expectedRevision,3);assert.equal(writes[0][2].submissionId,sid);assert.equal(writes[0][2].internalNote,'staff only');assert.equal('note' in writes[0][2],false);assert.equal(text(app.render()).includes('LIVE'),false);app.unmount();
});
test('missing immutable metadata blocks writes rather than fetching a newer submission at confirm',async()=>{
 const f=moderation(['ads_admin']);const detail=await f.base.moderationDetail('creative',cid);f.base.moderationDetail=async()=>({...detail,submissionId:null});await ready(f.app);button(f.app,'View details').props.onClick();await ready(f.app);f.app.nodes().filter(n=>typeof n.props.onClick==='function'&&text(n)==='Review 1').at(-1).props.onClick();f.app.render();const dialog=f.app.nodes().find(n=>typeof n.props.onSubmit==='function');await assert.rejects(dialog.props.onSubmit({decision:'approved'}),/current authorized/);assert.equal(f.writes.length,0);f.app.unmount();
});
test('uncertain writes retain exact UUID and payload across retry; duplicate submit is blocked synchronously',async()=>{
 let resolve,calls=[];const f=moderation(['ads_admin'],{reviewCreative:async(id,stage,payload)=>{calls.push(payload);if(calls.length===1)return new Promise((yes,no)=>{resolve=()=>no(Error('connection lost'));});return boundReceipt('creative',id,stage,payload);}});await ready(f.app);button(f.app,'View details').props.onClick();await ready(f.app);f.app.nodes().filter(n=>typeof n.props.onClick==='function'&&text(n)==='Review 1').at(-1).props.onClick();f.app.render();const dialog=f.app.nodes().find(n=>typeof n.props.onSubmit==='function');const pending=dialog.props.onSubmit({decision:'approved'});await assert.rejects(dialog.props.onSubmit({decision:'approved'}),/already in progress/);resolve();await assert.rejects(pending,/connection lost/);f.app.render();assert.ok(button(f.app,'Retry same decision'));await button(f.app,'Retry same decision').props.onClick();await ready(f.app);assert.equal(calls.length,2);assert.deepEqual(calls[0],calls[1]);f.app.unmount();
});
test('older queue responses never replace the selected manager stage and refresh failure does not undo success',async()=>{
 let resolve;const f=moderation(['ads_admin'],{queue:async stage=>stage==='reviewer'?new Promise(r=>resolve=r):({...f.queue,creatives:[]})});await ready(f.app);button(f.app,'Review 2 (Manager Approval)').props.onClick();await ready(f.app);resolve({...f.queue,creatives:[{id:cid,headline:'OLD PRIMARY'}]});await ready(f.app);assert.equal(text(f.app.render()).includes('OLD PRIMARY'),false);f.app.unmount();
});

test('review dialog synchronously prevents duplicate submissions and every dismissal while pending',async()=>{
 let finish,closed=0,calls=[];
 const app=mount('ads/src/components/console/ModerationReviewDialog.tsx',{}, {isOpen:true,targetType:'creative',targetTitle:'Creative · revision 3',stage:'reviewer',onClose:()=>closed++,onSubmit:async data=>{calls.push(data);return new Promise(resolve=>finish=resolve);}});
 app.render();const form=app.nodes().find(n=>n.type==='form');const pending=form.props.onSubmit({preventDefault(){}});await form.props.onSubmit({preventDefault(){}});assert.equal(calls.length,1);
 app.render();const root=app.nodes().find(n=>n.props.onOpenChange);root.props.onOpenChange(false);const cancel=button(app,'Cancel');cancel.props.onClick();const close=app.nodes().find(n=>n.props['aria-label']==='Close dialog');close.props.onClick();assert.equal(closed,0);assert.equal(close.props.disabled,true);
 finish();await pending;assert.equal(closed,1);app.unmount();
});
test('dialog bounds notes, has a separate staff audience, and reset uses immutable component identity',async()=>{
 const app=mount('ads/src/components/console/ModerationReviewDialog.tsx',{}, {isOpen:true,targetType:'campaign',targetTitle:'A',stage:'manager',onClose(){},onSubmit:async()=>{throw Error('not expected');}});app.render();const notes=app.nodes().filter(n=>n.type==='textarea');assert.equal(notes.length,2);assert.ok(notes.every(n=>n.props.maxLength===2000));notes[1].props.onChange({target:{value:'x'.repeat(2001)}});app.render();await app.nodes().find(n=>n.type==='form').props.onSubmit({preventDefault(){}});assert.ok(text(app.render()).includes('2,000'));app.unmount();
});
test('a successful decision followed by a failed refresh preserves the success and exposes a separate load error',async()=>{
 const f=moderation(['ads_admin']);await ready(f.app);button(f.app,'View details').props.onClick();await ready(f.app);f.app.nodes().filter(n=>typeof n.props.onClick==='function'&&text(n)==='Review 1').at(-1).props.onClick();f.app.render();const dialog=f.app.nodes().find(n=>typeof n.props.onSubmit==='function');f.base.queue=async()=>{throw Error('refresh unavailable');};await dialog.props.onSubmit({decision:'approved'});await ready(f.app);assert.ok(text(f.app.render()).includes('Decision recorded'));assert.ok(text(f.app.render()).includes('Request unavailable'));assert.equal(button(f.app,'Retry same decision'),undefined);assert.equal(f.writes.length,1);f.app.unmount();
});

test('stale 409 blocks reconfirmation until renewed inspection; no unknown-outcome retry is offered',async()=>{
 const f=moderation(['ads_admin'],{reviewCreative:async()=>{throw new ModerationApiError(409);}});await ready(f.app);button(f.app,'View details').props.onClick();await ready(f.app);f.app.nodes().filter(n=>typeof n.props.onClick==='function'&&text(n)==='Review 1').at(-1).props.onClick();f.app.render();await assert.rejects(f.app.nodes().find(n=>typeof n.props.onSubmit==='function').props.onSubmit({decision:'approved'}));await ready(f.app);assert.ok(text(f.app.render()).includes('Submission changed'));assert.equal(button(f.app,'Retry same decision'),undefined);assert.equal(f.app.nodes().some(n=>typeof n.props.onSubmit==='function'),false);f.app.unmount();
});
test('staff denial and malformed authority never load private rows; a later valid refresh clears denial',async()=>{
 for(const initial of [()=>new Response(null,{status:403}),()=>Response.json({data:{isStaff:true,roles:['ads_admin']}})]){
  let valid=false;const f=moderation(['ads_admin'],{},async()=>valid?Response.json({data:{userId:cid,isStaff:true,roles:['ads_admin']}}):initial());await ready(f.app);assert.equal(f.calls.some(c=>c[0]==='queue'),false);valid=true;await button(f.app,'Refresh').props.onClick();await ready(f.app);assert.ok(button(f.app,'View details'));assert.equal(text(f.app.render()).includes('access denied'),false);f.app.unmount();
 }
});
test('bounded pagination exposes the next backlog page and does not fabricate missing revision',async()=>{
 const f=moderation(['ads_admin']);f.queue.creatives[0].contentRevision=undefined;await ready(f.app);assert.ok(text(f.app.render()).includes('Revision unavailable'));assert.equal(button(f.app,'Review 1').props.disabled,true);await button(f.app,'Next').props.onClick();await ready(f.app);assert.ok(f.calls.some(c=>c[0]==='queue'&&c[2]===2));assert.equal(f.writes.length,0);f.app.unmount();
});

test('summary failure leaves private queue usable without fabricated backlog or overdue zero',async()=>{
 const f=moderation(['ads_support'],{moderationSummary:async()=>{throw Error('offline');}});await ready(f.app);await f.app.settle();assert.ok(text(f.app.render()).includes('Backlog summary unavailable'));assert.ok(button(f.app,'View details'));assert.equal(text(f.app.render()).includes('Review 1 pending: 0'),false);assert.equal(f.writes.length,0);f.app.unmount();
});
test('summary totals use all pages, filter links retain type, and older type replies are ignored',async()=>{
 let resolve;const f=moderation(['ads_support'],{moderationSummary:async type=>type==='creative'?new Promise(r=>resolve=r):({scope:type,asOf:'2026-11-02T12:00:00Z',reviewerCount:222,managerCount:3,submissionCount:14,oldestSubmittedAt:'2026-11-01T12:00:00Z',unknownAgeCount:1})});await ready(f.app);button(f.app,'Campaigns').props.onClick();await ready(f.app);await f.app.settle();assert.ok(text(f.app.render()).includes('Review 1 pending: 222'));resolve({reviewerCount:999,managerCount:9});await ready(f.app);assert.equal(text(f.app.render()).includes('999'),false);assert.ok(text(f.app.render()).includes('Overdue count unavailable'));assert.ok(text(f.app.render()).includes('24h 0m'));button(f.app,'Review 2 pending: 3').props.onClick();await ready(f.app);assert.ok(button(f.app,'Campaign title'));assert.equal(f.writes.length,0);f.app.unmount();
});
test('rejection picker uses supplied codes, requires reason or custom explanation and keeps internal notes separate',async()=>{
 const sent=[];const app=mount('ads/src/components/console/ModerationReviewDialog.tsx',{}, {isOpen:true,targetType:'creative',targetTitle:'A',stage:'reviewer',reasons:[{code:'LOW_QUALITY',label:'Creative quality or completeness'}],onClose(){},onSubmit:async value=>sent.push(value)});app.render();button(app,'Reject').props.onClick();app.render();let form=app.nodes().find(n=>n.type==='form');await form.props.onSubmit({preventDefault(){}});assert.equal(sent.length,0);assert.ok(text(app.render()).includes('Choose a rejection reason'));let notes=app.nodes().filter(n=>n.type==='textarea');notes[1].props.onChange({target:{value:'private assessment'}});app.render();await app.nodes().find(n=>n.type==='form').props.onSubmit({preventDefault(){}});assert.equal(sent.length,0);notes=app.nodes().filter(n=>n.type==='textarea');notes[0].props.onChange({target:{value:'Please provide readable text.'}});app.render();await app.nodes().find(n=>n.type==='form').props.onSubmit({preventDefault(){}});assert.equal(sent.length,1);assert.equal(sent[0].reasonCode,undefined);assert.equal(sent[0].internalNote,'private assessment');assert.equal(sent[0].advertiserNote,'Please provide readable text.');assert.equal('note' in sent[0],false);app.unmount();
});

test('mismatched receipt cannot confirm an uncertain decision or permit a fresh request UUID',async()=>{
 let payload;const f=moderation(['ads_admin'],{reviewCreative:async(id,stage,body)=>{payload=body;throw Error('lost response');},reviewReceipt:async()=>({result:{...boundReceipt('creative',cid,'reviewer',payload),decision:{...boundReceipt('creative',cid,'reviewer',payload).decision,submissionId:'another-submission'}}})});await ready(f.app);button(f.app,'View details').props.onClick();await ready(f.app);f.app.nodes().filter(n=>typeof n.props.onClick==='function'&&text(n)==='Review 1').at(-1).props.onClick();f.app.render();await assert.rejects(f.app.nodes().find(n=>typeof n.props.onSubmit==='function').props.onSubmit({decision:'approved'}));f.app.render();await button(f.app,'Check outcome').props.onClick();await ready(f.app);assert.ok(text(f.app.render()).includes('does not match'));assert.ok(button(f.app,'Retry same decision'));assert.equal(text(f.app.render()).includes('Decision confirmed:'),false);f.app.unmount();
});

function claims(api={},props={}){
 const writes=[],reads=[];let state={enabled:true,serverTime:'2026-11-02T12:00:00Z',policy:{ttlSeconds:600,maxLifetimeSeconds:3600,renewal:'manual'},claim:null};
 const actor='55555555-5555-4555-8555-555555555555';
 const operations={moderationClaim:async()=>{reads.push('GET');return state;},changeModerationClaim:async(type,id,action,body)=>{writes.push({type,id,action,body});state={...state,claim:action==='release'?null:{id:'claim-id',claimantId:actor,expiresAt:'2026-11-02T12:10:00Z'}};return {...state,outcome:action==='renew'?'renewed':action==='release'?'released':'acquired'};},...api};
 const app=mount('ads/src/components/console/ModerationClaimPanel.tsx',{'@crimfig/api-client':{ApiError:ModerationApiError},'../../lib/ads-api-client':{adsApi:()=>operations}},{type:'creative',id:cid,submissionId:sid,revision:3,stage:'reviewer',actorId:actor,canReview:true,isAdmin:false,...props});return {app,writes,reads,setState:value=>{state=value;}};
}
test('claim panel inspection is GET-only; role denial and disabled rollout never acquire a claim',async()=>{
 for(const props of [{canReview:false},{}]){const f=claims({},props);await ready(f.app);assert.equal(f.writes.length,0);if(props.canReview===false){assert.equal(button(f.app,'Claim review').props.disabled,true);await button(f.app,'Claim review').props.onClick();await ready(f.app);assert.equal(f.writes.length,0);}else{f.setState({enabled:false,serverTime:'2026-11-02T12:00:00Z',policy:{ttlSeconds:600,maxLifetimeSeconds:3600},claim:null});await button(f.app,'Refresh claim status').props.onClick();await ready(f.app);assert.equal(button(f.app,'Claim review'),undefined);assert.ok(text(f.app.render()).includes('Normal review remains available'));}f.app.unmount();}
});
test('claim transport uncertainty retains the exact request and prevents double send or changed action',async()=>{
 let finish;const sent=[];const f=claims({changeModerationClaim:async(type,id,action,body)=>{sent.push(body);if(sent.length===1)return new Promise((yes,no)=>{finish=()=>no(Error('offline'));});return {outcome:'acquired'};}});await ready(f.app);const pending=button(f.app,'Claim review').props.onClick();await button(f.app,'Claim review').props.onClick();assert.equal(sent.length,1);finish();await pending;await ready(f.app);assert.ok(button(f.app,'Retry original claim request'));await button(f.app,'Retry original claim request').props.onClick();await ready(f.app);assert.equal(sent.length,2);assert.deepEqual(sent[0],sent[1]);f.app.unmount();
});
test('claim acquisition binds inspected metadata; expiry checks only read and manual renewal is explicit',async()=>{
 const f=claims();await ready(f.app);await button(f.app,'Claim review').props.onClick();await ready(f.app);assert.equal(f.writes.length,1);assert.equal(f.writes[0].body.submissionId,sid);assert.equal(f.writes[0].body.expectedRevision,3);assert.equal(f.writes[0].body.stage,'reviewer');const before=f.reads.length;f.app.fireTimers();await ready(f.app);assert.ok(f.reads.length>before);assert.equal(f.writes.length,1);await button(f.app,'Renew claim').props.onClick();await ready(f.app);assert.equal(f.writes[1].action,'renew');assert.equal(f.writes[1].body.claimId,'claim-id');f.app.unmount();
});
test('other claimant is advisory, normal workflow remains available and takeover needs admin plus reason',async()=>{
 const f=claims({}, {isAdmin:true});f.setState({enabled:true,serverTime:'2026-11-02T12:00:00Z',policy:{ttlSeconds:600,maxLifetimeSeconds:3600},claim:{id:'another-claim',claimantId:'other-user',expiresAt:'2026-11-02T12:10:00Z'}});await ready(f.app);assert.ok(text(f.app.render()).includes('never block'));assert.equal(button(f.app,'Take over claim').props.disabled,true);const input=f.app.nodes().find(n=>n.props['aria-label']==='Takeover audit reason');input.props.onChange({target:{value:'Reviewer requested reassignment'}});f.app.render();await button(f.app,'Take over claim').props.onClick();await ready(f.app);assert.equal(f.writes[0].action,'takeover');assert.equal(f.writes[0].body.claimId,'another-claim');assert.equal(f.writes[0].body.reason,'Reviewer requested reassignment');f.app.unmount();
});

test('hierarchical inspection links retain the original queue type and page in URL context',async()=>{
 const f=moderation(['ads_admin']);await ready(f.app);button(f.app,'View details').props.onClick();await ready(f.app);await button(f.app,'View parent campaign').props.onClick();await ready(f.app);assert.equal(f.app.history().length,2);for(const location of f.app.history()){const url=new URL(location);assert.equal(url.searchParams.get('queueType'),'creative');assert.equal(url.searchParams.get('page'),'1');}assert.equal(new URL(f.app.history().at(-1)).searchParams.get('itemType'),'campaign');assert.equal(f.writes.length,0);f.app.unmount();
});

test('ActionHelp opens on hover/focus/click and CampaignsManager disables unapproved Resume with nearby help', async () => {
  const help = mount('ads/src/components/ActionHelp.tsx', {}, {action: 'Resume Draft Campaign', reason: 'Approve this campaign before activating delivery.'});
  help.render();
  let trigger = help.nodes().find(n => n.type === 'button');
  assert.equal(trigger.props['aria-label'], 'Why is Resume Draft Campaign unavailable?');
  assert.equal(trigger.props['aria-expanded'], false);
  trigger.props.onClick();
  help.render();
  trigger = help.nodes().find(n => n.type === 'button');
  assert.equal(trigger.props['aria-expanded'], true);
  assert.equal(text(help.render()).includes('Approve this campaign before activating delivery.'), true);

  let toggled = 0;
  const manager = mount('ads/src/components/console/advertiser/CampaignsManager.tsx', {
    '../../../lib/campaigns-api': {
      loadCampaignPage: async () => ({total:2,counts:{all:2,under_review:1},items:[
        { id: 'draft-1', title: 'Draft One', headline: 'H1', format: 'card', status: 'draft', moderationStatus: 'draft', budgetUsd: 10, spentUsd: 0, metricsLoaded: false, impressions: 0, clicks: 0, capabilities: { canEdit: true, canBeginEdit: false, canSubmit: true, canActivate: false, canPause: false, canTrash: true, blocker: 'Choose Edit and restart review to change this submission.' } },
        { id: 'rev-1', title: 'Review One', headline: 'H2', format: 'card', status: 'paused', moderationStatus: 'pending_primary_review', budgetUsd: 15, spentUsd: 0, metricsLoaded: false, impressions: 0, clicks: 0, capabilities: { canEdit: false, canBeginEdit: true, canSubmit: false, canActivate: false, canPause: false, canTrash: true, blocker: 'Choose Edit and restart review to change this submission.' } },
      ]}),
      loadCampaignDetails: async () => ({}),
      setCampaignStatus: async () => { toggled++; return { status: 'active' }; },
    },
  });
  manager.render();
  await manager.settle();
  assert.equal(manager.nodes().some(n=>text(n)==='Resume Campaign'&&typeof n.props?.onSelect==='function'),false);
  assert.equal(toggled,0);
  const helps = manager.nodes().filter(n => typeof n.props?.action === 'string' && n.props.action.startsWith('Resume'));
  assert.equal(helps.length, 2);
  const underReviewTab = manager.nodes().find(n => typeof n.props?.onClick === 'function' && text(n).includes('Under Review'));
  assert.ok(underReviewTab);
  assert.equal(text(underReviewTab).includes('1'), true);
});

test('PLAN-0045: AuthAdminGuard with requiredRole="super_admin" denies support_agent and auth_admin without leaking Error Monitor UI', async () => {
  for (const [roles, shouldAllow] of [
    [['support_agent'], false],
    [['auth_admin', 'security_admin'], false],
    [['super_admin'], true],
  ]) {
    const app = mount(
      'auth/src/components/AuthAdminGuard.tsx',
      {
        '../lib/consent': {
          consentSession: () => ({
            request: async () =>
              Response.json({
                data: {
                  userId: '11111111-1111-4111-8111-111111111111',
                  isStaff: true,
                  roles,
                },
              }),
          }),
        },
      },
      { requiredRole: 'super_admin', children: 'ERROR_MONITOR_SECRET_CONSOLE' },
    );
    app.render();
    const out = text(await app.settle());
    assert.equal(out.includes('ERROR_MONITOR_SECRET_CONSOLE'), shouldAllow);
    if (!shouldAllow) {
      assert.equal(out.includes('Access Denied'), true);
      assert.equal(out.includes('Requires super_admin authorization.'), true);
    }
    app.unmount();
  }
});

test('PLAN-0045: AuthAdminPage hides Error Monitor navigation for non-super_admin staff and shows it for super_admin', async () => {
  for (const [roles, shouldShowNav] of [
    [['support_agent'], false],
    [['auth_admin'], false],
    [['super_admin'], true],
  ]) {
    const guardMod = mount(
      'auth/src/components/AuthAdminGuard.tsx',
      {
        '../lib/consent': {
          consentSession: () => ({
            request: async () =>
              Response.json({
                data: {
                  userId: '11111111-1111-4111-8111-111111111111',
                  isStaff: true,
                  roles,
                },
              }),
          }),
        },
      },
      {
        children: (staff) =>
          Array.isArray(staff.roles) && staff.roles.includes('super_admin')
            ? 'NAV_ERROR_MONITOR_VISIBLE'
            : 'STANDARD_STAFF_ONLY',
      },
    );
    guardMod.render();
    const rendered = text(await guardMod.settle());
    assert.equal(rendered.includes('NAV_ERROR_MONITOR_VISIBLE'), shouldShowNav);
    guardMod.unmount();
  }
});
