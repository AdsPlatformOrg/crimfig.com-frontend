const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),ts=require('typescript');
const text=n=>typeof n==='string'?n:Array.isArray(n)?n.map(text).join(''):n?.children?.map(text).join('')||'';
function mount(reply,clipboard=async()=>{}){
 const state=[],effects=[];let cursor=0,tree;
 const changed=(a,b)=>!a||a.length!==b.length||a.some((v,i)=>v!==b[i]);
 const react={createElement:(type,props,...children)=>({type,props:props||{},children}),useState(initial){const i=cursor++;if(!(i in state))state[i]=initial;return[state[i],value=>{state[i]=typeof value==='function'?value(state[i]):value;}];},useEffect(fn,deps){const i=cursor++;if(changed(state[i],deps)){state[i]=deps;effects.push(fn);}},useCallback(fn,deps){const i=cursor++;if(changed(state[i]?.deps,deps))state[i]={deps,fn};return state[i].fn;}};
 const exports={};
 const sessionFetch=async url=>{
  if(url.endsWith('/check-installation'))return reply;
  if(url.endsWith('/embed'))return{ok:true,json:async()=>({data:{htmlSnippet:'<ins>canonical HTML</ins>',nextJsSnippet:'<CrimFigAdSlot slotTagId="cf-slot-test" publisherKey="site" />'}})};
  return{ok:true,json:async()=>({data:url.endsWith('/promoters/websites')?[{id:'site',domain:'example.com',verificationStatus:'verified'}]:[{id:'slot',websiteId:'site',slotTagId:'cf-slot-test',name:'Pilot',format:'banner',lifecycleStatus:'testing'}]})};
 };
 const source=fs.readFileSync(path.resolve(__dirname,'../../../web/ads/src/app/(workspace)/promoter/slots/page.tsx'),'utf8');
 vm.runInNewContext(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.React,esModuleInterop:true}}).outputText,{exports,navigator:{clipboard:{writeText:clipboard}},setTimeout:()=>0,require:name=>name==='react'?react:name==='../../../../lib/session'?{sessionFetch}:new Proxy({},{get:(_,k)=>String(k)})});
 const api={render(){cursor=0;tree=exports.default();while(effects.length)effects.shift()();return tree;},async settle(){await new Promise(setImmediate);this.render();},nodes(){const all=[];function visit(n){if(!n||typeof n!=='object')return;if(Array.isArray(n))return n.forEach(visit);all.push(n);n.children?.forEach(visit);}visit(tree);return all;},button(label){return this.nodes().find(n=>n.type==='Button'&&text(n)===label);},text(){return text(tree);}};
 api.render();return api;
}
async function loaded(reply,clipboard){const m=mount(reply,clipboard);for(let i=0;i<4;i++)await m.settle();return m;}
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
 assert.match(m.text(),/Ad Request Detected \(Render Pending\)/);assert.doesNotMatch(m.text(),/Verified Rendered/);
});
test('real render verdict and canonical React snippet fields are displayed',async()=>{
 const m=await loaded({ok:true,json:async()=>({data:{isInstalled:true,serveCount:3,diagnostic:'Verified render'}})});
 await m.button('Test Installation').props.onClick();await m.settle();assert.match(m.text(),/Verified Rendered/);
 await m.button('Get Embed Code').props.onClick();await m.settle();assert.match(m.text(),/CrimFigAdSlot slotTagId=/);
});
