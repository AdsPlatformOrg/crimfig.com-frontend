const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),ts=require('typescript');
const root=path.resolve(__dirname,'../../..');
function load(file,deps={}){const exports={};const react={createElement:(type,props,...children)=>({type,props:props||{},children}),useState:v=>[v,()=>{}],useRef:v=>({current:v}),useEffect:()=>{},useId:()=> 'test-menu'};const code=ts.transpileModule(fs.readFileSync(path.join(root,file),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.React,esModuleInterop:true}}).outputText;vm.runInNewContext(code,{exports,process:{env:{}},require:n=>n==='react'?(deps.react??react):deps[n]??new Proxy({},{get:(_t,k)=>k})});return exports;}
function nodes(tree){const out=[];function walk(n){if(Array.isArray(n))return n.forEach(walk);if(!n||typeof n!=='object')return;out.push(n);n.children?.forEach(walk);}walk(tree);return out;}
function ads(url,role='advertiser'){return load('web/ads/src/components/console/AdsConsoleShell.tsx',{'next/navigation':{usePathname:()=>url,useRouter:()=>({push:()=>{}})},'../../lib/session':{dashboardSession:()=>({})},'../../../../../shared/ui/origins':{ecosystemOrigin:app=>`https://staging-${app}.crimfig.com`}}).AdsConsoleShell({children:null,role,activeNavId:'new_campaign'});}
test('campaign creation header does not offer a redundant New Campaign action',()=>{const header=nodes(ads('/campaigns/new')).find(n=>n.type==='header');assert.ok(!nodes(header).some(n=>n.children?.includes('New Campaign')));});
test('campaign overview keeps its contextual creation link and account menu',()=>{const header=nodes(ads('/dashboard')).find(n=>n.type==='header');assert.ok(nodes(header).some(n=>n.props.href==='/campaigns/new'));assert.ok(nodes(header).some(n=>n.type==='AccountMenu'));assert.ok(!nodes(header).some(n=>n.type==='SignOutButton'));});

test('account menu remains available without a profile and invokes logout only once while pending',async()=>{
  let resolve,calls=0;const promise=new Promise(r=>resolve=r);
  const {AccountMenu}=load('shared/ui/account-menu.tsx');
  const tree=AccountMenu({session:{getProfile:async()=>{throw Error('offline');},logout:()=>{calls++;return promise;}},links:[{label:'Profile',href:'/profile'}]});
  const all=nodes(tree);assert.ok(all.some(n=>n.props['aria-label']==='Open account menu'));assert.ok(all.some(n=>n.props.role==='menuitem'&&n.props.href==='/profile'));assert.ok(all.some(n=>n.type==='svg'));
  const menu=all.find(n=>n.props.role==='menu');const children=nodes(menu);assert.ok(children.findIndex(n=>n.props.role==='separator')<children.findIndex(n=>n.type==='button'));
  const logout=children.find(n=>n.type==='button');logout.props.onClick();logout.props.onClick();assert.equal(calls,1);resolve();await promise;
});
test('ecosystem navigation retains staging and respects configured non-staging origins',()=>{
 const {ecosystemOrigin}=load('shared/ui/origins.ts');assert.equal(ecosystemOrigin('billing',undefined,'https://staging-auth.crimfig.com'),'https://staging-billing.crimfig.com');assert.equal(ecosystemOrigin('auth','https://staging-auth.crimfig.com/'),'https://staging-auth.crimfig.com');assert.equal(ecosystemOrigin('ads','https://ads.crimfig.com/'),'https://ads.crimfig.com');
});
