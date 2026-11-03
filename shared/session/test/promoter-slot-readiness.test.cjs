const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),ts=require('typescript');
const text=n=>typeof n==='string'?n:Array.isArray(n)?n.map(text).join(''):n?.children?.map(text).join('')||'';
const cfigHelpers={};vm.runInNewContext(ts.transpileModule(fs.readFileSync(path.resolve(__dirname,'../../../web/ads/src/lib/cfig-format.ts'),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,{exports:cfigHelpers});
test('proxy can restore legacy inventory routes before a backend rollback',async()=>{
 const source=fs.readFileSync(path.resolve(__dirname,'../../../web/ads/next.config.ts'),'utf8');
 const output=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
 const exports={},env={};
 vm.runInNewContext(output,{exports,process:{env},require:()=>({backendOrigin:name=>`https://${name}.example.test`})});
 const canonical=await exports.default.rewrites();
 assert.equal(canonical.some(rule=>rule.source.startsWith('/api/v1/publisher')),false);
 env.ADS_LEGACY_INVENTORY_ROUTES='true';
 const rollback=await exports.default.rewrites();
 assert.equal(rollback.find(rule=>rule.source==='/api/v1/publisher/:path*').destination,'https://ads.example.test/api/v1/adstation/:path*');
 assert.equal(rollback.find(rule=>rule.source==='/api/v1/admin/ads/slots/:id/lifecycle').destination,'https://ads.example.test/api/v1/adstation/admin/slots/:id/lifecycle');
 assert.equal(rollback.at(-1).source,'/api/:path*');
});
test('rollback rewrites preserve request methods and bodies with an older API', {
 skip: process.env.PLAN0091_LOOPBACK !== 'true',
},async()=>{
 const {createServer}=require('node:http');
 const {getPathMatch}=require('../../../web/ads/node_modules/next/dist/shared/lib/router/utils/path-match');
 const {prepareDestination}=require('../../../web/ads/node_modules/next/dist/shared/lib/router/utils/prepare-destination');
 const listen=server=>new Promise(resolve=>server.listen(0,'127.0.0.1',()=>resolve(`http://127.0.0.1:${server.address().port}`)));
 const api=createServer(async(req,res)=>{
  if(!req.url.startsWith('/api/v1/adstation/')){res.writeHead(404).end();return;}
  const chunks=[];for await(const chunk of req)chunks.push(chunk);
  res.writeHead(201,{'Content-Type':'application/json'}).end(JSON.stringify({path:req.url,method:req.method,body:Buffer.concat(chunks).toString()}));
 });
 const origin=await listen(api);
 const config=fs.readFileSync(path.resolve(__dirname,'../../../web/ads/next.config.ts'),'utf8');
 const exports={},env={ADS_LEGACY_INVENTORY_ROUTES:'true'};
 vm.runInNewContext(ts.transpileModule(config,{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,{exports,process:{env},require:()=>({backendOrigin:()=>origin})});
 const rules=await exports.default.rewrites();
 const proxy=createServer(async(req,res)=>{
  const url=new URL(req.url,'http://localhost');
  for(const rule of rules){
   const params=getPathMatch(rule.source)(url.pathname);
   if(!params)continue;
   const {parsedDestination}=prepareDestination({destination:rule.destination,params,query:Object.fromEntries(url.searchParams),appendParamsToQuery:false});
   const destination=new URL(parsedDestination.pathname,origin);
   for(const [key,value] of Object.entries(parsedDestination.query))destination.searchParams.set(key,value);
   const chunks=[];for await(const chunk of req)chunks.push(chunk);
   const upstream=await fetch(destination,{method:req.method,body:chunks.length?Buffer.concat(chunks):undefined});
   res.writeHead(upstream.status).end(await upstream.text());return;
  }
  res.writeHead(404).end();
 });
 try{
  const frontend=await listen(proxy);
  const body=JSON.stringify({decision:'approved'});
  const response=await fetch(`${frontend}/api/v1/admin/ads/websites/site/policy?source=fixture`,{method:'POST',body});
  assert.equal(response.status,201);
  assert.deepEqual(await response.json(),{path:'/api/v1/adstation/admin/websites/site/policy?source=fixture',method:'POST',body});
 }finally{await Promise.all([proxy,api].map(server=>new Promise(resolve=>server.close(resolve))));}
});
function mount(reply,clipboard=async()=>{},readiness,instructions={},createSlot){
 const state=[],effects=[];let cursor=0,tree;
 const changed=(a,b)=>!a||a.length!==b.length||a.some((v,i)=>v!==b[i]);
 const react={createElement:(type,props,...children)=>({type,props:props||{},children}),useState(initial){const i=cursor++;if(!(i in state))state[i]=initial;return[state[i],value=>{state[i]=typeof value==='function'?value(state[i]):value;}];},useEffect(fn,deps){const i=cursor++;if(changed(state[i],deps)){state[i]=deps;effects.push(fn);}},useCallback(fn,deps){const i=cursor++;if(changed(state[i]?.deps,deps))state[i]={deps,fn};return state[i].fn;}};
 const exports={};
 const sessionFetch=async (url,options)=>{
  if(url.endsWith('/publisher/slots') && options?.method==='POST')return createSlot(JSON.parse(options.body));
  if(url.endsWith('/check-installation'))return reply;
  if(url.endsWith('/embed'))return{ok:true,json:async()=>({data:{...instructions,deliveryReadiness:readiness,htmlSnippet:'<ins>canonical HTML</ins>',nextJsSnippet:'<CrimFigAdSlot slotTagId="cf-slot-test" publisherKey="site" />'}})};
  return{ok:true,json:async()=>({data:url.endsWith('/promoters/websites')?[{id:'site',domain:'example.com',verificationStatus:'verified'}]:[{id:'slot',websiteId:'site',slotTagId:'cf-slot-test',name:'Pilot',format:'banner',lifecycleStatus:'testing'}]})};
 };
 const source=fs.readFileSync(path.resolve(__dirname,'../../../web/ads/src/app/(workspace)/promoter/slots/page.tsx'),'utf8');
 vm.runInNewContext(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.React,esModuleInterop:true}}).outputText,{exports,navigator:{clipboard:{writeText:clipboard}},setTimeout:()=>0,require:name=>name.includes('cfig-format')?cfigHelpers:name==='react'?react:name==='../../../../lib/session'?{sessionFetch}:new Proxy({},{get:(_,k)=>String(k)})});
 const api={render(){cursor=0;tree=exports.default();while(effects.length)effects.shift()();return tree;},async settle(){await new Promise(setImmediate);this.render();},nodes(){const all=[];function visit(n){if(!n||typeof n!=='object')return;if(Array.isArray(n))return n.forEach(visit);all.push(n);n.children?.forEach(visit);}visit(tree);return all;},button(label){return this.nodes().find(n=>['Button','DropdownMenuItem'].includes(n.type)&&text(n).trim()===(label==='Get Embed Code'?'Code':label));},text(){return text(tree);}};
 api.render();return api;
}
async function loaded(reply,clipboard,readiness,instructions){const m=mount(reply,clipboard,readiness,instructions);for(let i=0;i<4;i++)await m.settle();return m;}
test('shared promoter form submits every supported slot type for the selected website',async()=>{
 for(const slotType of ['network','consideration','direct','hybrid']){
  const requests=[];
  const m=mount({},undefined,undefined,{},async body=>{requests.push(body);return {ok:true,json:async()=>({data:{id:'created'}})};});
  for(let i=0;i<4;i++)await m.settle();
  m.button('Create CrimFig Ad Slot').props.onClick();
  m.render();
  m.nodes().find(n=>n.type==='select'&&n.props.value==='network').props.onChange({target:{value:slotType}});
  m.nodes().find(n=>n.props.placeholder?.includes('Header')).props.onChange({target:{value:'Homepage banner'}});
  m.render();
  await m.nodes().find(n=>n.type==='form').props.onSubmit({preventDefault(){}});
  assert.equal(requests.length,1);
  assert.equal(requests[0].websiteId,'site');
  assert.equal(requests[0].slotType,slotType);
 }
});
test('failed installation check shows its error without a verified badge',async()=>{
 const m=await loaded({ok:false,json:async()=>({message:'Evidence temporarily unavailable'})});
 await m.button('Test Installation').props.onClick();await m.settle();
 assert.match(m.text(),/Evidence temporarily unavailable/);assert.doesNotMatch(m.text(),/Verified Rendered/);
});
test('copy failure never shows success and offers manual selection',async()=>{
 const m=await loaded({ok:true,json:async()=>({data:{}})},async()=>{throw Error('clipboard denied');});
 await m.button('Get Embed Code').props.onClick();await m.settle();
 await m.nodes().find(n=>n.type==='Button'&&text(n)==='Copy Code').props.onClick();await m.settle();
 assert.match(m.text(),/Copy failed/);assert.doesNotMatch(m.text(),/Copied!/);
});
test('request-only installation uses the backend response contract and stays render-pending',async()=>{
 const m=await loaded({ok:true,json:async()=>({data:{isInstalled:false,serveCount:3,diagnostic:'No render receipt'}})});
 await m.button('Test Installation').props.onClick();await m.settle();
 assert.match(m.text(),/Ad Request Detected/);assert.doesNotMatch(m.text(),/Verified Rendered/);
});
test('real render verdict and canonical React snippet fields are displayed',async()=>{
 const m=await loaded({ok:true,json:async()=>({data:{isInstalled:true,serveCount:3,diagnostic:'Verified render'}})});
 await m.button('Test Installation').props.onClick();await m.settle();assert.match(m.text(),/Verified Rendered/);
 await m.button('Get Embed Code').props.onClick();await m.settle();assert.match(m.text(),/CrimFigAdSlot slotTagId=/);
});

test('blocked paid readiness remains distinct from installation and copy succeeds',async()=>{const m=await loaded({},undefined,{status:'blocked',blockers:['WEBSITE_APPROVAL_REQUIRED'],remainingChecks:['MEASUREMENT_CONSENT'],message:'Pre-auction checks do not guarantee paid fill.'});await m.button('Get Embed Code').props.onClick();await m.settle();assert.match(m.text(),/website approval required/);assert.match(m.text(),/do not guarantee paid fill/);assert.doesNotMatch(m.text(),/Verified Rendered/);});
test('passing supply checks still explains per-request gates rather than promising paid ads',async()=>{const m=await loaded({},undefined,{status:'request_checks_pending',blockers:[],remainingChecks:['MEASUREMENT_CONSENT'],message:'Not a paid delivery guarantee.'});await m.button('Get Embed Code').props.onClick();await m.settle();assert.match(m.text(),/Traffic, campaign targeting/);assert.match(m.text(),/Not a paid delivery guarantee/);});

test('PLAN0080 copy flow separates one SDK and slot markup without inventing consent',async()=>{const copied=[];const m=await loaded({},async code=>copied.push(code),undefined,{sdkSnippet:'<script>one SDK</script>',slotSnippet:'<ins data-cf-consent="unknown"></ins>',consentInstructions:'Only genuine visitor consent grants measurement.'});await m.button('Get Embed Code').props.onClick();await m.settle();assert.match(m.text(),/Only genuine visitor consent/);assert.match(m.text(),/Step 1: Load the SDK once/);assert.match(m.text(),/Step 2: Copy the slot markup below/);await m.button('Copy SDK').props.onClick();await m.settle();await m.nodes().find(n=>n.type==='Button'&&text(n)==='Copy Code').props.onClick();await m.settle();assert.deepEqual(copied,['<script>one SDK</script>','<ins data-cf-consent="unknown"></ins>']);});
test('PLAN0080 old instruction response still explains consent and the reload boundary',async()=>{const m=await loaded({});await m.button('Get Embed Code').props.onClick();await m.settle();assert.match(m.text(),/only after actual consent/);assert.match(m.text(),/does not retry an initialized slot/);assert.equal(m.button('Copy SDK'),undefined);});
