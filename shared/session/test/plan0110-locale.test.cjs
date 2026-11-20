const {test}=require('node:test');const assert=require('node:assert/strict');
const {createSessionClient}=require('../dist');
test('locale saves use the authenticated account and reject failed or mismatched acknowledgements',async()=>{
  const calls=[];let fail=false;
  const client=createSessionClient({authOrigin:'https://auth.crimfig.com',apiOrigins:[],fetch:async(url,init)=>{
    if(url.endsWith('/refresh'))return Response.json({accessToken:'fixture',expiresIn:900});
    calls.push({url,init});return fail?new Response(null,{status:503}):Response.json({preferredLocale:'pt-BR'});
  }});
  try{
    await client.updatePreferredLocale('pt-BR');assert.equal(calls[0].url,'https://auth.crimfig.com/api/v1/auth/profile/locale');
    assert.deepEqual(JSON.parse(calls[0].init.body),{preferredLocale:'pt-BR'});
    assert.equal(calls[0].init.headers.Authorization,'Bearer fixture');assert.equal(calls[0].init.credentials,'omit');assert.equal(calls[0].init.redirect,'error');
    await assert.rejects(client.updatePreferredLocale('fr'),/Invalid language/);
    fail=true;await assert.rejects(client.updatePreferredLocale('pt-BR'),/could not be saved/);
  }finally{client.dispose();}
});
