const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createSessionClient, safeReturnUrl, SessionError } = require('../dist');

const authOrigin = 'https://auth.crimfig.com';
const api = 'https://billing.crimfig.com';
const pair = token => Response.json({ accessToken: token, refreshToken: 'never-store', expiresIn: 900 });
const client = (fetch, extra = {}) => createSessionClient({ authOrigin, apiOrigins: [api], fetch, ...extra });
const deferred = () => {
  let resolve;
  const promise = new Promise(r => { resolve = r; });
  return { promise, resolve };
};

test('bootstrap uses actual direct auth contract, cookie credentials and keeps snapshots token-free', async () => {
  const calls = [];
  const session = client(async (url, init) => { calls.push({ url, init }); return pair('access'); });
  const state = await session.bootstrap();
  assert.equal(state.status, 'authenticated');
  assert.equal(calls[0].url, `${authOrigin}/api/v1/auth/refresh`);
  assert.equal(calls[0].init.credentials, 'include');
  assert.equal(calls[0].init.body, '{}');
  assert.equal(JSON.stringify(state).includes('access'), false);
  assert.equal(JSON.stringify(state).includes('never-store'), false);
});

test('parallel protected reads wait for one refresh and remove spoofable identity headers', async () => {
  const gate = deferred();
  let refreshes = 0;
  const sent = [];
  const session = client(async (url, init) => {
    if (url.endsWith('/refresh')) { refreshes++; await gate.promise; return pair('valid'); }
    sent.push(init);
    return Response.json({ ok: true });
  });
  const pending = Array.from({ length: 8 }, () => session.request(`${api}/api/v1/wallet`, {
    headers: { 'x-user-id': 'victim', 'x-user-email': 'victim@example.com', Authorization: 'Bearer forged' },
  }));
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(sent.length, 0);
  gate.resolve();
  await Promise.all(pending);
  assert.equal(refreshes, 1);
  assert.equal(sent.length, 8);
  for (const init of sent) {
    assert.equal(init.credentials, 'omit');
    assert.equal(init.redirect, 'error');
    assert.equal(init.headers.get('authorization'), 'Bearer valid');
    assert.equal(init.headers.has('x-user-id'), false);
    assert.equal(init.headers.has('x-user-email'), false);
  }
});

test('401 refresh becomes anonymous while outage remains temporary-error', async () => {
  const anonymous = client(async () => new Response(null, { status: 401 }));
  assert.equal((await anonymous.bootstrap()).status, 'anonymous');
  const outage = client(async () => { throw new TypeError('network'); });
  assert.equal((await outage.bootstrap()).status, 'temporary-error');
  await assert.rejects(outage.request(`${api}/wallet`), error => error instanceof SessionError && error.kind === 'temporary');
});

test('invalid payloads do not authenticate', async () => {
  for (const body of [null, { data: { accessToken: 'nested', expiresIn: 900 } },
    { accessToken: '', expiresIn: 900 }, { accessToken: 'x', expiresIn: -1 },
    { accessToken: 'x', expiresIn: '900' }]) {
    const session = client(async () => Response.json(body));
    assert.equal((await session.bootstrap()).status, 'temporary-error');
  }
});

test('refresh collision is recoverable and never automatically retries the consumed cookie', async () => {
  let refreshes = 0;
  const session = client(async () => {
    refreshes++;
    return Response.json({ code: 'REFRESH_CONFLICT' }, { status: 409 });
  });
  assert.equal((await session.bootstrap()).status, 'temporary-error');
  assert.equal(refreshes, 1);
});

test('untrusted origins and URL credentials are rejected before any token request', async () => {
  let calls = 0;
  const session = client(async () => { calls++; return pair('secret'); });
  for (const url of ['https://evil.example/wallet', 'https://billing.crimfig.com.evil.example/',
    'https://user:password@billing.crimfig.com/wallet', 'http://billing.crimfig.com/wallet']) {
    await assert.rejects(session.request(url), TypeError);
  }
  assert.equal(calls, 0);
});

test('safe reads retry a rejected token once, then return second 401 without looping', async () => {
  let refreshes = 0;
  let reads = 0;
  const session = client(async url => {
    if (url.endsWith('/refresh')) return pair(`token-${++refreshes}`);
    reads++;
    return new Response(null, { status: 401 });
  });
  const result = await session.request(`${api}/wallet`);
  assert.equal(result.status, 401);
  assert.equal(refreshes, 2);
  assert.equal(reads, 2);
  assert.equal(session.getSnapshot().status, 'anonymous');
});

test('concurrent 401 reads share recovery rather than each rotating the cookie', async () => {
  let refreshes = 0;
  const session = client(async (url, init) => {
    if (url.endsWith('/refresh')) return pair(`token-${++refreshes}`);
    return new Response(null, { status: init.headers.get('authorization') === 'Bearer token-1' ? 401 : 200 });
  });
  await session.bootstrap();
  const results = await Promise.all(Array.from({ length: 6 }, () => session.request(`${api}/wallet`)));
  assert.equal(refreshes, 2);
  assert.ok(results.every(result => result.status === 200));
});

test('mutations are never replayed after 401 and forbidden responses never cause refresh', async () => {
  let refreshes = 0;
  let writes = 0;
  const session = client(async url => {
    if (url.endsWith('/refresh')) { refreshes++; return pair('valid'); }
    writes++;
    return new Response(null, { status: 401 });
  });
  const response = await session.request(`${api}/wallet/fund`, { method: 'POST', body: '{"amount":100}' });
  assert.equal(response.status, 401);
  assert.equal(writes, 1);
  assert.equal(refreshes, 1);
  const forbidden = client(async url => url.endsWith('/refresh') ? pair('valid') : new Response(null, { status: 403 }));
  assert.equal((await forbidden.request(`${api}/admin`)).status, 403);
  assert.equal(forbidden.getSnapshot().status, 'authenticated');
});

test('clearing during refresh cannot resurrect a signed-out session', async () => {
  const gate = deferred();
  const session = client(async () => { await gate.promise; return pair('stale'); });
  const pending = session.bootstrap();
  await new Promise(resolve => setImmediate(resolve));
  session.clearSession();
  gate.resolve();
  await assert.rejects(pending, error => error.kind === 'cancelled');
  assert.equal(session.getSnapshot().status, 'anonymous');
});

test('expiry triggers new refresh before protected request', async () => {
  let now = 0;
  let refreshes = 0;
  const session = client(async url => url.endsWith('/refresh') ? pair(`token-${++refreshes}`) : new Response(), { now: () => now });
  await session.bootstrap();
  now = 901_000;
  await session.request(`${api}/wallet`);
  assert.equal(refreshes, 2);
});

test('logout uses bearer plus cookie, clears memory and surfaces server failures', async () => {
  let logoutInit;
  const session = client(async (url, init) => {
    if (url.endsWith('/refresh')) return pair('valid');
    logoutInit = init;
    return new Response(null, { status: 503 });
  });
  await session.bootstrap();
  await assert.rejects(session.logout(), /cookie may remain/);
  assert.equal(logoutInit.credentials, 'include');
  assert.equal(logoutInit.headers.Authorization, 'Bearer valid');
  assert.equal(session.getSnapshot().status, 'anonymous');
});

test('timeout leaves a recoverable error instead of an infinite loading state', async () => {
  const session = client(async (_url, init) => {
    await new Promise((resolve, reject) => {
      const keepAlive = setTimeout(resolve, 1000);
      init.signal.addEventListener('abort', () => { clearTimeout(keepAlive); reject(init.signal.reason); }, { once: true });
    });
    return pair('late');
  }, { requestTimeoutMs: 10 });
  assert.equal((await session.bootstrap()).status, 'temporary-error');
});

test('requests during server logout cannot refresh the cookie and restore the session', async () => {
  const gate = deferred();
  let refreshes = 0;
  const session = client(async url => {
    if (url.endsWith('/refresh')) { refreshes++; return pair('valid'); }
    if (url.endsWith('/logout')) { await gate.promise; return new Response(); }
    throw new Error('Protected request must not run');
  });
  await session.bootstrap();
  const logout = session.logout();
  await new Promise(resolve => setImmediate(resolve));
  await assert.rejects(session.request(`${api}/wallet`), /Logout is in progress/);
  gate.resolve();
  await logout;
  assert.equal(refreshes, 1);
  assert.equal(session.getSnapshot().status, 'anonymous');
});

test('return URLs use exact origins and never navigate or accept credentials', () => {
  assert.equal(safeReturnUrl(`${api}/wallet?tab=cards`, [api]), `${api}/wallet?tab=cards`);
  for (const value of ['javascript:alert(1)', '//evil.example', '/relative', 'https://billing.crimfig.com.evil.example',
    'https://user:password@billing.crimfig.com/']) assert.equal(safeReturnUrl(value, [api]), null);
});

test('configuration permits HTTP only for explicit local development origins', () => {
  assert.throws(() => client(async () => pair('x'), { authOrigin: 'http://auth.crimfig.com' }), TypeError);
  assert.throws(() => client(async () => pair('x'), { authOrigin: 'https://auth.crimfig.com/path' }), TypeError);
  assert.doesNotThrow(() => client(async () => pair('x'), { authOrigin: 'http://localhost:3000', allowLocalHttp: true }));
});

function channels() {
  const peers=[]; const messages=[];
  return {messages,open(){const handlers=new Set();const peer={postMessage(message){messages.push(message);for(const other of peers)if(other!==peer)for(const handler of other.handlers)handler({data:message});},handlers,addEventListener(_type,listener){handlers.add(listener);},removeEventListener(_type,listener){handlers.delete(listener);},close(){handlers.clear();}};peers.push(peer);return peer;}};
}
test('logout immediately locks peers, emits no credentials and cannot silently bootstrap again', async () => {
  const bus=channels(),gate=deferred();let calls=0;
  const fetcher=async url=>{calls++;if(url.endsWith('/refresh'))return pair('private-token');await gate.promise;return new Response();};
  const a=client(fetcher,{signOutChannel:bus.open()}),b=client(fetcher,{signOutChannel:bus.open()});
  await a.bootstrap();await b.bootstrap();const logout=a.logout();
  assert.equal(a.getSnapshot().signOut,'pending');assert.equal(b.getSnapshot().signOut,'remote');assert.equal(b.getSnapshot().status,'anonymous');
  assert.deepEqual(bus.messages,[{type:'signed-out',version:1,authOrigin}]);
  assert.equal((await b.bootstrap()).status,'anonymous');await assert.rejects(b.request(api+'/wallet'),/Signed out/);
  gate.resolve();await logout;assert.equal(a.getSnapshot().signOut,'complete');
  assert.equal((await a.bootstrap()).status,'anonymous');assert.equal(calls,3);a.dispose();b.dispose();
});
test('duplicate logout clicks share one server operation and failure stays locked', async () => {
  let posts=0;const session=client(async url=>{if(url.endsWith('/refresh'))return pair('valid');posts++;return new Response(null,{status:503});});await session.bootstrap();
  const one=session.logout(),two=session.logout();assert.equal(one,two);await assert.rejects(one,/cookie may remain/);
  assert.equal(session.getSnapshot().signOut,'failed');await assert.rejects(session.request(api+'/wallet'),/Signed out/);assert.equal((await session.bootstrap()).status,'anonymous');assert.equal(posts,1);
});
test('remote logout cancels pending refresh and does not echo or revoke another family', async () => {
  const bus=channels(),gate=deferred();let refreshes=0;const peer=bus.open();const session=client(async()=>{refreshes++;await gate.promise;return pair('stale');},{signOutChannel:bus.open()});
  const boot=session.bootstrap();await new Promise(resolve=>setImmediate(resolve));peer.postMessage({type:'signed-out',version:1,authOrigin});gate.resolve();await assert.rejects(boot,error=>error.kind==='cancelled');
  assert.equal(session.getSnapshot().status,'anonymous');assert.equal(session.getSnapshot().signOut,'remote');assert.equal(bus.messages.length,1);assert.equal(refreshes,1);session.dispose();
});
test('foreign, malformed and sign-in broadcasts never alter session authority', async () => {
  const bus=channels(),peer=bus.open();const session=client(async()=>pair('valid'),{signOutChannel:bus.open()});await session.bootstrap();
  for(const data of [null,{type:'signed-in',version:1,authOrigin,token:'forged'},{type:'signed-out',version:2,authOrigin},{type:'signed-out',version:1,authOrigin:'https://foreign.example'}])peer.postMessage(data);
  assert.equal(session.getSnapshot().status,'authenticated');assert.equal(session.getSnapshot().signOut,null);session.dispose();
});
test('unavailable broadcast transport cannot prevent local sign-out', async () => {
  const session=client(async url=>url.endsWith('/refresh')?pair('valid'):new Response(),{signOutChannel:{postMessage(){throw Error('blocked');},addEventListener(){},removeEventListener(){},close(){}}});await session.bootstrap();await session.logout();assert.equal(session.getSnapshot().signOut,'complete');session.dispose();
});
test('late protected response cannot reach consumers after peer sign-out', async () => {
  const bus=channels(),peer=bus.open(),gate=deferred();const session=client(async url=>{if(url.endsWith('/refresh'))return pair('valid');await gate.promise;return new Response();},{signOutChannel:bus.open()});await session.bootstrap();
  const read=session.request(api+'/wallet');await new Promise(resolve=>setImmediate(resolve));peer.postMessage({type:'signed-out',version:1,authOrigin});gate.resolve();await assert.rejects(read,error=>error.kind==='cancelled');session.dispose();
});

test('synchronous logout subscriber cannot create a second server operation', async () => {
  let posts=0;const session=client(async url=>url.endsWith('/refresh')?pair('valid'):(posts++,new Response()));await session.bootstrap();let nested;
  session.subscribe(snapshot=>{if(snapshot.signOut==='pending')nested=session.logout();});const result=session.logout();assert.equal(result,nested);await result;assert.equal(posts,1);
});
