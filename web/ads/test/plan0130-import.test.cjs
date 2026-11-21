require('../../../shared/api-client/test/load.cjs');
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{randomUUID}=require('node:crypto');
const {importHouseSamples}=require('../src/lib/import-house-samples.ts');
const catalog=require('../src/data/house-samples.json');
function fixture(){
  const records=[],calls=[],journal={},uploads=[];
  const request=async(url,init={})=>{
    calls.push({url,init});
    if(url.includes('?page='))return Response.json({data:records,meta:{hasNext:false}});
    if(url.endsWith('/uploads/direct')){const id=randomUUID();uploads.push(id);return Response.json({data:{assetId:id,cdnUrl:`/api/v1/uploads/media/${id}`}});}
    const payload=JSON.parse(init.body);assert.equal(payload.isActive,false);assert.ok(payload.imageAssetId);assert.equal(payload.headline,'');
    const item={id:randomUUID(),...payload};records.push(item);return Response.json({data:item});
  };
  return {records,calls,journal,uploads,request};
}
test('unrecognized environments and failed catalog reads perform no import mutations',async()=>{
  const f=fixture();await assert.rejects(importHouseSamples(f.request,'https://attacker.example',{},()=>{},()=>{}),/recognized/);assert.equal(f.calls.length,0);
  await assert.rejects(importHouseSamples(async()=>new Response(null,{status:503}),'https://ads.crimfig.com',{},()=>{},()=>{}),/reconcile/);
});
test('ambiguous upload and creative writes are never automatically repeated',async()=>{
  const key=`${catalog.assets[0].family}/${catalog.assets[0].preset}`;
  for(const phase of ['uploading','creating','registered']){
    const f=fixture();await assert.rejects(importHouseSamples(f.request,'https://ads.crimfig.com',{[key]:{phase}},()=>{},()=>{}),/reconciliation/);
    assert.equal(f.calls.filter(item=>item.init.method==='POST').length,0);
  }
});
test('all prepared samples import as inactive and a repeated run reconciles instead of creating duplicates',async()=>{
  const f=fixture(),prior=global.fetch;let saved=0;
  global.fetch=async(url)=>{
    const sample=catalog.assets.find(item=>item.url===url);assert.ok(sample);
    return new Response(fs.readFileSync(path.join(__dirname,'../public',url)),{headers:{'Content-Type':sample.mime}});
  };
  try{
    await importHouseSamples(f.request,'https://staging-ads.crimfig.com',f.journal,()=>saved++,()=>{});
    assert.equal(f.records.length,27);assert.equal(f.uploads.length,27);assert.equal(saved,108);
    assert.ok(f.records.every(item=>!item.isActive&&item.destinationUrl==='https://staging-ads.crimfig.com'));
    await importHouseSamples(f.request,'https://staging-ads.crimfig.com',f.journal,()=>{},()=>{});
    assert.equal(f.records.length,27);assert.equal(f.uploads.length,27);
    assert.equal(f.calls.filter(item=>item.init.method==='PATCH'||item.url.includes('/delivery/')).length,0);
  }finally{global.fetch=prior;}
});
test('wrong sample bytes fail before any media upload or creative creation',async()=>{
  const f=fixture(),prior=global.fetch;
  global.fetch=async()=>new Response('incorrect',{headers:{'Content-Type':catalog.assets[0].mime}});
  try{await assert.rejects(importHouseSamples(f.request,'https://ads.crimfig.com',{},()=>{},()=>{}),/verification failed/);assert.equal(f.uploads.length,0);assert.equal(f.records.length,0);}
  finally{global.fetch=prior;}
});
