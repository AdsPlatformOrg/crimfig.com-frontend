const {test}=require('node:test');
const assert=require('node:assert/strict');
const {createSessionClient}=require('../dist');
const coordination=require('../dist/refresh-coordination');

function locks(){let tail=Promise.resolve();return {request(_name, options, work){if(typeof options==='function')work=options;const next=tail.then(()=>{if(options?.signal?.aborted)throw Error('aborted');return work();});tail=next.catch(()=>{});return next;}};}
function emitter(){const listeners=new Set();return {addEventListener(type,fn){if(type==='message')listeners.add(fn);},removeEventListener(type,fn){listeners.delete(fn);},emit(event){for(const fn of [...listeners])fn(event);}};}

function browser(origin='https://staging-ads.crimfig.com', auth='https://staging-auth.crimfig.com', manager=locks()){
 const messages=[], frames=[];const parent={...emitter(),location:{origin},crypto:require('node:crypto').webcrypto};
 const document={createElement(){const frame={hidden:false,addEventListener(){},setAttribute(){},remove(){frame.cleanup?.();}};frames.push(frame);return frame;},body:{appendChild(frame){const url=new URL(frame.src);const child={...emitter(),location:{origin:auth,search:url.search},parent:{postMessage(data,target){messages.push(data);queueMicrotask(()=>parent.emit({data,origin:auth,source:frame.contentWindow}));}}};frame.contentWindow={postMessage(data,target){assert.equal(target,auth);messages.push(data);queueMicrotask(()=>child.emit({data,origin,source:child.parent}));}};frame.cleanup=coordination.installRefreshLockHost(child,manager);}}};
 return {parent,document,messages,frames,auth};
}
function inBrowser(b,work){return coordination.withBrowserRefreshLock(b.auth,work,{window:b.parent,document:b.document,locks:null});}

test('cross-app bootstrap serializes cookie rotation before dispatch, without replay',async()=>{
 const manager=locks(),a=browser(undefined,undefined,manager),b=browser('https://staging-billing.crimfig.com',undefined,manager);
 let cookie=0,refreshes=0,conflicts=0,active=0,maxActive=0;
 const fetch=async()=>{refreshes++;const presented=cookie;active++;maxActive=Math.max(maxActive,active);await new Promise(r=>setImmediate(r));active--;if(presented!==cookie){conflicts++;return new Response(null,{status:409});}cookie++;return Response.json({accessToken:'memory-only',expiresIn:900});};
 const clients=[a,b].map(env=>createSessionClient({authOrigin:env.auth,apiOrigins:[env.parent.location.origin],fetch,coordinateRefresh:work=>inBrowser(env,work)}));
 const states=await Promise.all(clients.map(c=>c.bootstrap()));
 assert.ok(states.every(s=>s.status==='authenticated'));assert.equal(refreshes,2);assert.equal(conflicts,0);assert.equal(maxActive,1);
 assert.ok([...a.messages,...b.messages].every(m=>!JSON.stringify(m).includes('memory-only')));clients.forEach(c=>c.dispose());
});

test('Auth top-level refresh uses the same lock as embedded app coordination',async()=>{
 const manager=locks(),b=browser(undefined,undefined,manager);let active=0,max=0;
 const work=async()=>{active++;max=Math.max(max,active);await new Promise(r=>setImmediate(r));active--;};
 await Promise.all([inBrowser(b,work),coordination.withBrowserRefreshLock(b.auth,work,{window:{location:{origin:b.auth}},locks:manager})]);assert.equal(max,1);
});

test('host allowlist isolates staging, production, local ports and hostile origins',()=>{
 const allowed=coordination.refreshCoordinatorOrigins('https://staging-auth.crimfig.com');
 assert.ok(allowed.includes('https://staging-ads.crimfig.com'));
 for(const bad of ['https://ads.crimfig.com','https://evil.example','https://staging-ads.crimfig.com.evil.example','null'])assert.ok(!allowed.includes(bad));
 assert.deepEqual(coordination.refreshCoordinatorOrigins('https://preview.example'),[]);
});

test('untrusted parent cannot acquire a lock or receive grant messages',()=>{
 let requested=0,sent=0;const parent={postMessage(){sent++;}};
 const host={...emitter(),location:{origin:'https://staging-auth.crimfig.com',search:'?parent_origin=https%3A%2F%2Fevil.example&id=12345678-1234-1234-1234-123456789abc'},parent};
 const cleanup=coordination.installRefreshLockHost(host,{request(){requested++;}});
 host.emit({origin:'https://evil.example',source:parent,data:{type:'acquire',version:1,id:'12345678-1234-1234-1234-123456789abc'}});
 assert.equal(requested,0);assert.equal(sent,0);cleanup();
});

test('failed refresh releases the browser lock but never retries the failed work',async()=>{
 const b=browser();let calls=0;await assert.rejects(inBrowser(b,async()=>{calls++;throw Error('ambiguous network');}),/ambiguous network/);
 assert.equal(calls,1);assert.equal(await inBrowser(b,async()=>7),7);
});

test('spoofed source, origin or request ID cannot start a refresh while its real lock is queued',async()=>{
 const manager=locks();let unlock;const hold=manager.request('hold',()=>new Promise(r=>unlock=r));await new Promise(r=>setImmediate(r));
 const b=browser(undefined,undefined,manager);let calls=0;const pending=inBrowser(b,async()=>++calls);await new Promise(r=>setImmediate(r));
 const frame=b.frames[0],id=new URL(frame.src).searchParams.get('id');
 const data={scope:'crimfig-refresh-lock',version:1,id,type:'granted'};
 b.parent.emit({origin:b.auth,source:{},data});b.parent.emit({origin:'https://evil.example',source:frame.contentWindow,data});b.parent.emit({origin:b.auth,source:frame.contentWindow,data:{...data,id:'wrong'}});
 assert.equal(calls,0);unlock();await hold;assert.equal(await pending,1);
});

test('blocked coordinator times out without dispatching or replaying refresh',async t=>{
 t.mock.timers.enable({apis:['setTimeout']});
 const b=browser();b.document.body.appendChild=()=>{};let calls=0;
 const pending=inBrowser(b,async()=>++calls);const rejected=assert.rejects(pending,/timed out/);
 t.mock.timers.tick(45000);await rejected;assert.equal(calls,0);
});

test('unsupported Web Locks preserves one-attempt behavior without introducing retries',async()=>{
 const b=browser(undefined,undefined,null);let calls=0;assert.equal(await inBrowser(b,async()=>++calls),1);assert.equal(calls,1);
});
