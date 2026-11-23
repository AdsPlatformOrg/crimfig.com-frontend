const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),ts=require('typescript'),React=require('react'),{JSDOM}=require('jsdom'),{createRoot}=require('react-dom/client');
const id='00000000-0000-4000-8000-000000000001',other='00000000-0000-4000-8000-000000000002';
const overview=(requests=[])=>({actorId:id,grants:[],requests,audit:[],roles:[{key:'super_admin',label:'Platform Admin',scopes:['auth','ads']}]});
async function mount(fetcher,run){
 const dom=new JSDOM('<div id="root"></div>',{url:'https://ads.example.test/admin/access'}),prior={window:global.window,document:global.document,IS_REACT_ACT_ENVIRONMENT:global.IS_REACT_ACT_ENVIRONMENT};Object.assign(global,{window:dom.window,document:dom.window.document,IS_REACT_ACT_ENVIRONMENT:true});
 const native=tag=>React.forwardRef(({children,asChild,variant,...props},ref)=>asChild?children:React.createElement(tag,{...props,ref},children));
 const dependencies={'@/lib/session':{sessionFetch:fetcher},'../ui':{Button:native('button'),Card:native('div'),CardContent:native('div'),Input:native('input'),Badge:native('span')},'../ui/dropdown-menu':{DropdownMenu:native('div'),DropdownMenuContent:native('div'),DropdownMenuTrigger:native('div'),DropdownMenuItem:native('span')}};
 const exports={};vm.runInNewContext(ts.transpileModule(fs.readFileSync(path.join(__dirname,'../src/components/console/PlatformAccessView.tsx'),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText,{exports,require:name=>dependencies[name]??require(name),crypto:require('node:crypto').webcrypto});
 const root=createRoot(document.getElementById('root'));try{await React.act(async()=>root.render(React.createElement(exports.PlatformAccessView)));await run(dom);}finally{await React.act(async()=>root.unmount());Object.assign(global,prior);dom.window.close();}
}
const result=data=>({ok:true,json:async()=>({status:'success',data})});
const change=async(element,value)=>{const props=element[Object.keys(element).find(key=>key.startsWith('__reactProps'))];await React.act(async()=>props.onChange({target:{value}}));};
test('authority failure shows an honest error and no role-management form',async()=>{
 await mount(async()=>({ok:false}),async()=>{assert.match(document.body.textContent,/unavailable|permission/);assert.equal(document.querySelector('form'),null);});
});
test('requester cannot approve own proposal; a different reviewer needs a six-digit fresh code',async()=>{
 const requests=[{id:'own',target_user_id:other,role_key:'super_admin',scope:'auth',action:'grant',reason:'Owner proposal',requested_by:id,state:'pending',expires_at:'2099-01-01T00:00:00Z'},{id:'other',target_user_id:other,role_key:'super_admin',scope:'auth',action:'grant',reason:'Independent proposal',requested_by:other,state:'pending',expires_at:'2099-01-01T00:00:00Z'}];
 const calls=[];await mount(async(url,options)=>{calls.push({url,options});return result(overview(requests));},async()=>{
  assert.match(document.body.textContent,/different Platform Admin must review your proposal/);const approve=[...document.querySelectorAll('button')].filter(button=>button.textContent==='Approve exact change');assert.equal(approve.length,1);assert.equal(approve[0].disabled,true);
  const input=document.querySelector('input[aria-label="Review code for other"]');assert.equal(input.type,'password');await change(input,'123456');assert.equal(approve[0].disabled,false);
  await React.act(async()=>approve[0].click());const sent=calls.find(call=>call.options?.method==='POST');assert.match(sent.url,/other\/decision$/);assert.deepEqual(JSON.parse(sent.options.body),{decision:'approve',code:'123456'});assert.equal(document.querySelector('input[aria-label="Review code for other"]').value,'');
 });
});
test('ambiguous proposal retries retain business identity and clear the MFA field',async()=>{
 const posts=[];await mount(async(url,options)=>{if(options?.method==='POST'){posts.push(JSON.parse(options.body));throw Error('Lost acknowledgement');}return result(overview());},async dom=>{
  const inputs=document.querySelectorAll('form input');await change(inputs[0],other);await change(inputs[1],'Access for support lead');await change(inputs[2],'123456');
  await React.act(async()=>document.querySelector('form').dispatchEvent(new dom.window.Event('submit',{bubbles:true,cancelable:true})));assert.equal(inputs[2].value,'');
  await change(inputs[2],'654321');await React.act(async()=>document.querySelector('form').dispatchEvent(new dom.window.Event('submit',{bubbles:true,cancelable:true})));
  assert.equal(posts.length,2);assert.equal(posts[0].requestId,posts[1].requestId);assert.equal(posts[0].targetUserId,other);assert.match(document.body.textContent,/Proposal was not confirmed|Lost acknowledgement/);
 });
});
