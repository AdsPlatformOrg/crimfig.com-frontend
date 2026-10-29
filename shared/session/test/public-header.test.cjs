const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const ts=require('typescript');
const root=path.resolve(__dirname,'../../../web/auth/src');
function load(file,deps){const exports={};const code=ts.transpileModule(fs.readFileSync(path.join(root,file),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.React,esModuleInterop:true}}).outputText;vm.runInNewContext(code,{exports,require:n=>deps[n]??new Proxy({},{get:(_t,k)=>k})});return exports;}
function header(snapshot){const react={createElement:(type,props,...children)=>({type,props:props||{},children}),useRef:()=>({current:null}),useState:()=>[false,()=>{}]};const helpers=fs.existsSync(path.join(root,'lib/public-header.ts'))?load('lib/public-header.ts',{}):{};const {LandingNavbar}=load('components/landing/LandingNavbar.tsx',{'react':react,'../SessionGate':{useSessionSnapshot:()=>snapshot},'../../lib/public-header':helpers});const links=[];function walk(n){if(Array.isArray(n))return n.forEach(walk);if(!n||typeof n!=='object')return;if(n.props?.href)links.push(n.props.href);n.children?.forEach(walk);}walk(LandingNavbar());return links;}
test('authenticated public header replaces both desktop and mobile sign-in links',()=>{const links=header({status:'authenticated',signOut:null});assert.equal(links.filter(v=>v==='/dashboard').length,2);assert.equal(links.filter(v=>v==='/profile').length,2);assert.ok(!links.includes('/login'));assert.ok(!links.includes('/signup'));});
test('anonymous public header retains both desktop and mobile sign-in choices',()=>{for (const signOut of [null,'complete','remote']) { const links=header({status:'anonymous',signOut});assert.equal(links.filter(v=>v==='/login').length,2);assert.equal(links.filter(v=>v==='/signup').length,2);assert.ok(!links.includes('/profile'));}});
test('unknown, outage and sign-out states never assert an authenticated identity',()=>{for(const state of [{status:'idle'},{status:'loading'},{status:'temporary-error'},{status:'authenticated',signOut:'pending'}]){const links=header(state);assert.ok(!links.includes('/profile'));assert.ok(!links.includes('/signup'));assert.equal(links.filter(v=>v==='/dashboard').length,2);}});

test('persistent discovery bootstraps once on public home, never on login or menu rerenders',async()=>{
  let pathname='/login',status='idle',calls=0;const effects=[],ref={current:false};
  const {PublicSessionDiscovery}=load('components/PublicSessionDiscovery.tsx',{'react':{useRef:()=>ref,useEffect:fn=>effects.push(fn)},'next/navigation':{usePathname:()=>pathname},'../lib/consent':{consentSession:()=>({getSnapshot:()=>({status}),bootstrap:async()=>{calls++;status='temporary-error';}})}});
  const render=()=>{assert.equal(PublicSessionDiscovery(),null);while(effects.length)effects.shift()();};
  render();assert.equal(calls,0);pathname='/';render();render();assert.equal(calls,1);status='idle';render();assert.equal(calls,1);
});

test('public discovery reuses an existing authenticated session',()=>{
  let calls=0;const {PublicSessionDiscovery}=load('components/PublicSessionDiscovery.tsx',{'react':{useRef:()=>({current:false}),useEffect:fn=>fn()},'next/navigation':{usePathname:()=> '/'},'../lib/consent':{consentSession:()=>({getSnapshot:()=>({status:'authenticated'}),bootstrap:async()=>{calls++;}})}});
  PublicSessionDiscovery();assert.equal(calls,0);
});

