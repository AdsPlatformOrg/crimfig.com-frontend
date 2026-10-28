const {test} = require('node:test');
const assert = require('node:assert/strict');
const {createSessionClient} = require('../dist');
const authOrigin='https://auth.crimfig.com', api='https://ads.crimfig.com';
const pair=(accessToken='token', expiresIn=60)=>Response.json({accessToken,expiresIn});
function clock(){let time=0;const tasks=new Set();return {now:()=>time,schedule:(work,delay)=>{const task={at:time+delay,work};tasks.add(task);return()=>tasks.delete(task);},async advance(ms){time+=ms;for(const task of [...tasks].sort((a,b)=>a.at-b.at)){if(tasks.has(task)&&task.at<=time){tasks.delete(task);task.work();}}await new Promise(r=>setImmediate(r));}};}
const deferred=()=>{let resolve;const promise=new Promise(r=>resolve=r);return{resolve,promise};};
const client=(fetch,clock)=>createSessionClient({authOrigin,apiOrigins:[api],fetch,...clock});

test('snapshot references are stable between transitions and cannot be mutated',async()=>{
 const s=client(async()=>pair());assert.equal(s.getSnapshot(),s.getSnapshot());const initial=s.getSnapshot();await s.bootstrap();assert.notEqual(initial,s.getSnapshot());assert.ok(Object.isFrozen(s.getSnapshot()));s.dispose();
});
test('proactive renewal preserves authenticated state, expiry and one shared refresh',async()=>{
 const c=clock(),gate=deferred();let refreshes=0;const states=[];
 const s=client(async url=>{if(!url.endsWith('/refresh'))return new Response();refreshes++;return refreshes===1?pair():gate.promise;},c);
 await s.bootstrap();s.subscribe(v=>states.push(v));await c.advance(48000);
 assert.equal(refreshes,2);assert.equal(s.getSnapshot().status,'authenticated');assert.equal(s.getSnapshot().expiresAt,60000);assert.equal(s.getSnapshot().renewal,'refreshing');
 const requests=Array.from({length:5},()=>s.request(`${api}/data`));gate.resolve(pair('new'));await Promise.all(requests);assert.equal(refreshes,2);assert.ok(states.every(v=>v.status==='authenticated'));s.dispose();
});
test('renewal outage retains still-valid UI then locks exactly at expiry without a retry storm',async()=>{
 const c=clock();let calls=0;const s=client(async()=>++calls===1?pair():new Response(null,{status:503}),c);
 await s.bootstrap();await c.advance(48000);assert.equal(s.getSnapshot().status,'authenticated');assert.equal(s.getSnapshot().renewal,'connection-error');assert.equal(s.getSnapshot().expiresAt,60000);
 await c.advance(12000);assert.equal(s.getSnapshot().status,'temporary-error');assert.equal(s.getSnapshot().expiresAt,null);assert.equal(calls,2);s.dispose();
});
test('slow renewal cannot leave an expired credential usable',async()=>{
 const c=clock(),gate=deferred();let count=0,apiCalls=0;const s=client(async url=>{if(!url.endsWith('/refresh')){apiCalls++;return new Response();}return ++count===1?pair():gate.promise;},c);
 await s.bootstrap();await c.advance(48000);await c.advance(12000);assert.equal(s.getSnapshot().status,'temporary-error');const request=s.request(`${api}/data`);await new Promise(r=>setImmediate(r));assert.equal(apiCalls,0);gate.resolve(pair('new'));await request;assert.equal(apiCalls,1);s.dispose();
});
test('confirmed revocation during background renewal clears private session immediately',async()=>{
 const c=clock();let count=0;const s=client(async()=>++count===1?pair():new Response(null,{status:401}),c);await s.bootstrap();await c.advance(48000);assert.equal(s.getSnapshot().status,'anonymous');assert.equal(s.getSnapshot().expiresAt,null);s.dispose();
});
test('401 mutation is never replayed and locks before explicit recovery',async()=>{
 let posts=0;const s=client(async url=>url.endsWith('/refresh')?pair():(posts++,new Response(null,{status:401})));await s.bootstrap();await s.request(`${api}/campaigns`,{method:'POST'});assert.equal(posts,1);assert.equal(s.getSnapshot().status,'temporary-error');s.dispose();
});
test('logout while renewal is pending cannot restore a signed-out session',async()=>{
 const c=clock(),gate=deferred();let count=0;const s=client(async url=>url.endsWith('/logout')?new Response():++count===1?pair():gate.promise,c);await s.bootstrap();await c.advance(48000);await s.logout();gate.resolve(pair('late'));await new Promise(r=>setImmediate(r));assert.equal(s.getSnapshot().status,'anonymous');assert.equal(s.getSnapshot().signOut,'complete');await c.advance(120000);assert.equal(count,2);s.dispose();
});
test('different account identity invalidates cached UI epoch',async()=>{
 const jwt=sub=>`header.${Buffer.from(JSON.stringify({sub})).toString('base64url')}.signature`;const c=clock();let count=0;const s=client(async()=>pair(jwt(++count===1?'alice':'bob')),c);await s.bootstrap();const before=s.getSnapshot().identityVersion;await c.advance(48000);assert.ok(s.getSnapshot().identityVersion>before);assert.equal(s.getSnapshot().status,'authenticated');s.dispose();
});
test('profile response after logout is cancelled rather than exposing prior account data',async()=>{
 const gate=deferred();const s=client(async url=>url.endsWith('/refresh')?pair():url.endsWith('/logout')?new Response():gate.promise);await s.bootstrap();const result=s.getProfile();await new Promise(r=>setImmediate(r));await s.logout();gate.resolve(Response.json({userId:'old',email:'old@example.com',avatar:{kind:'preset',presetId:'x',alt:'x',url:'https://auth.crimfig.com/x',version:1}}));await assert.rejects(result,/Session changed/);s.dispose();
});
test('explicit recovery retries a temporary outage and returns a usable session',async()=>{
 let count=0;const s=client(async()=>++count===1?new Response(null,{status:503}):pair());assert.equal((await s.bootstrap()).status,'temporary-error');assert.equal((await s.bootstrap()).status,'authenticated');assert.equal(count,2);s.dispose();
});
