const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');const vm=require('node:vm');const ts=require('typescript');const React=require('react');const {JSDOM}=require('jsdom');
function load(file,deps={}){const exports={};vm.runInNewContext(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true,target:ts.ScriptTarget.ES2020}}).outputText,{exports,require:n=>deps[n]??require(n),window:global.window,crypto:require('node:crypto').webcrypto,URLSearchParams,setTimeout});return exports;}
async function fixture(run){const dom=new JSDOM('<div id="root"></div>',{url:'https://ads.example.test/support'});const old={window:global.window,document:global.document,act:global.IS_REACT_ACT_ENVIRONMENT};global.window=dom.window;global.document=dom.window.document;global.IS_REACT_ACT_ENVIRONMENT=true;const {createRoot}=require('react-dom/client');const root=createRoot(document.getElementById('root'));try{await run(root,document.getElementById('root'),dom.window);}finally{await React.act(()=>root.unmount());global.window=old.window;global.document=old.document;global.IS_REACT_ACT_ENVIRONMENT=old.act;dom.window.close();}}
const response=(data,status=200)=>({ok:status<400,status,json:async()=>({data})});
const component=()=>load(path.resolve(__dirname,'../../../shared/ui/support/SupportCenter.tsx'),{'./SupportCenter.module.css':{default:{}}}).SupportCenter;
async function input(win,node,value){await React.act(()=>{const setter=Object.getOwnPropertyDescriptor(node.tagName==='TEXTAREA'?win.HTMLTextAreaElement.prototype:win.HTMLInputElement.prototype,'value').set;setter.call(node,value);node.dispatchEvent(new win.Event('input',{bubbles:true}));node.dispatchEvent(new win.Event('change',{bubbles:true}));});}
test('support validates before writes, retains draft on failure and reuses retry key',async()=>fixture(async(root,el,win)=>{
 const writes=[];let fail=true;const request=async(url,init)=>{if(init?.method==='POST'){writes.push(JSON.parse(init.body));return fail?response(null,503):response({id:'ticket',ticket_number:'#01'});}return url.includes('/ticket')&&!url.includes('?')?response({id:'ticket',ticket_number:'#01',subject:'A problem',status:'open',updated_at:new Date().toISOString(),messages:[]}):response([]);};
 await React.act(()=>root.render(React.createElement(component(),{request})));const form=el.querySelector('form');await React.act(()=>form.dispatchEvent(new win.Event('submit',{bubbles:true,cancelable:true})));assert.equal(writes.length,0);assert.match(el.textContent,/at least 3/);
 await input(win,el.querySelector('#support-subject'),'A problem');await input(win,el.querySelector('#support-body'),'Please help with this issue.');await React.act(()=>form.dispatchEvent(new win.Event('submit',{bubbles:true,cancelable:true})));assert.equal(writes.length,1);assert.equal(el.querySelector('#support-body').value,'Please help with this issue.');assert.match(el.textContent,/written message has been kept/);
 fail=false;await React.act(()=>form.dispatchEvent(new win.Event('submit',{bubbles:true,cancelable:true})));assert.equal(writes[0].requestId,writes[1].requestId);assert.match(el.textContent,/#01 received/);
}));
test('support admin separates public reply and private note controls',async()=>fixture(async(root,el)=>{await React.act(()=>root.render(React.createElement(component(),{admin:true,request:async()=>response([])})));assert.match(el.textContent,/Internal notes stay private/);assert.ok([...el.querySelectorAll('label')].some(x=>x.textContent.startsWith('Category')));assert.doesNotMatch(el.textContent,/New request/);}));
test('support displays active support@crimfig.com email and honors defaultCategory without fake data',async()=>fixture(async(root,el,win)=>{
 const writes=[];const request=async(url,init)=>{if(init?.method==='POST'){writes.push(JSON.parse(init.body));return response({id:'ticket-b',ticket_number:'#0000002'});}return url.includes('/ticket-b')?response({id:'ticket-b',ticket_number:'#0000002',subject:'Payout help',category:'billing',status:'open',updated_at:new Date().toISOString(),messages:[]}):response([]);};
 await React.act(()=>root.render(React.createElement(component(),{request,defaultCategory:'billing'})));
 const mailLink=el.querySelector('a[href="mailto:support@crimfig.com"]');assert.ok(mailLink);assert.equal(mailLink.textContent,'support@crimfig.com');
 const select=el.querySelector('select');assert.equal(select.value,'billing');
 await input(win,el.querySelector('#support-subject'),'Payout help');await input(win,el.querySelector('#support-body'),'Please verify my payout reference.');
 await React.act(()=>el.querySelector('form').dispatchEvent(new win.Event('submit',{bubbles:true,cancelable:true})));
 assert.equal(writes.length,1);assert.equal(writes[0].category,'billing');
}));
test('billing, auth, and ads support wiring removes mock tickets and exposes support@crimfig.com',()=>{
 const billingHub=fs.readFileSync(path.resolve(__dirname,'../../billing/src/components/console/BillingSupportHub.tsx'),'utf8');
 assert.doesNotMatch(billingHub,/BIL-202610-001/);assert.match(billingHub,/SupportCenter/);assert.match(billingHub,/defaultCategory="billing"/);
 const billingNext=fs.readFileSync(path.resolve(__dirname,'../../billing/next.config.ts'),'utf8');
 assert.match(billingNext,/\/api\/v1\/auth\/:path\*/);
 const authShell=fs.readFileSync(path.resolve(__dirname,'../../auth/src/components/AuthConsoleShell.tsx'),'utf8');
 assert.match(authShell,/href:\s*'\/support'/);
 for (const rel of ['../src/components/landing/LandingFooter.tsx','../../auth/src/components/landing/LandingFooter.tsx','../../billing/src/components/landing/LandingFooter.tsx']){
  const footer=fs.readFileSync(path.resolve(__dirname,rel),'utf8');
  assert.match(footer,/mailto:support@crimfig\.com/,rel);
 }
});
test('affiliate links fetch only placements and preserve readable links and copy controls',async()=>fixture(async(root,el)=>{
 const urls=[];const Button=({children,size,variant,...p})=>React.createElement('button',p,children);const Input=p=>React.createElement('input',p);const deps={'../../../lib/api-data':{apiData:async url=>{urls.push(url);return [{id:'p1',shareLink:'https://ads.example.test/share/approved',campaign:{title:'Approved campaign'}}];}},'../../EmptyState':{EmptyState:({title})=>React.createElement('p',{},title)},'../../LoadingStates':{CardSkeleton:()=>React.createElement('p',{},'Loading')},'../../ui/button':{Button},'../../ui/input':{Input},'../../ui/badge':{Badge:({children})=>React.createElement('span',{},children)}};
 const C=load(path.resolve(__dirname,'../src/components/console/promoter/PromoterIndividualsView.tsx'),deps).PromoterIndividualsView;await React.act(()=>root.render(React.createElement(C)));assert.deepEqual(urls,['/api/v1/placements']);assert.equal(el.querySelector('input').value,'https://ads.example.test/share/approved');assert.ok(el.textContent.indexOf('Affiliate & Creator Link Rules')>el.textContent.indexOf('Approved campaign'));assert.doesNotMatch(el.textContent,/Reels/);
}));
