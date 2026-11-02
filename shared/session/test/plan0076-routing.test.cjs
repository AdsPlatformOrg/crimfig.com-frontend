const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),ts=require('typescript');
const root=path.resolve(__dirname,'../../../web/billing');
function load(file,env={},window){const exports={};const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;vm.runInNewContext(code,{exports,process:{env},window,URL,require:name=>name.endsWith('/shared/ui/origins')?load(path.resolve(__dirname,'../../ui/origins.ts'),env,window):name==='@crimfig/session'?{createSessionClient:options=>({options,request(){}})}:assert.fail('Unexpected import '+name)});return exports;}
const backends=()=>load(path.join(root,'src/lib/backend-origins.ts')).billingBackends;
const staging={NODE_ENV:'production',RAILWAY_ENVIRONMENT_NAME:'staging'};
test('optimized staging refuses absent or production/legacy backend routes instead of leaking credentials',()=>{
 assert.throws(()=>backends()(staging),/required for staging/);
 for(const bad of ['https://billing-api-production-bb4c.up.railway.app','https://billing.crimfig.com','https://billing.staging.crimfig.com','https://u:p@billing-api-staging.up.railway.app','https://billing-api-staging.up.railway.app/path'])assert.throws(()=>backends()({...staging,BILLING_API_BACKEND_URL:bad,AUTH_API_BACKEND_URL:'https://auth-api-staging.up.railway.app'}));
 assert.throws(()=>backends()({NODE_ENV:'production',NEXT_PUBLIC_AUTH_WEB_URL:'https://staging-auth.crimfig.com'}),/required for staging/);
});
test('staging rewrite config accepts explicit public or private isolated backends',()=>{
 const result=backends()({...staging,BILLING_API_BACKEND_URL:'https://billing-api-staging.up.railway.app/',AUTH_API_BACKEND_URL:'http://auth-api.railway.internal:4000'});assert.equal(result.billing,'https://billing-api-staging.up.railway.app');assert.equal(result.auth,'http://auth-api.railway.internal:4000');
});
test('production and local rewrite defaults remain distinct, including optimized local builds',()=>{
 assert.equal(backends()({NODE_ENV:'production'}).billing,'https://billing-api-production-bb4c.up.railway.app');assert.equal(backends()({NODE_ENV:'development'}).billing,'http://127.0.0.1:3008');assert.equal(backends()({NODE_ENV:'production',NEXT_PUBLIC_AUTH_WEB_URL:'http://localhost:3000'}).billing,'http://127.0.0.1:3008');
});
test('staging Billing session and login use staging Auth even with an obsolete production default',()=>{
 const window={location:{hostname:'staging-billing.crimfig.com',origin:'https://staging-billing.crimfig.com',href:'https://staging-billing.crimfig.com/?view=console'}};
 const api=load(path.join(root,'src/lib/session.ts'),{NODE_ENV:'production',NEXT_PUBLIC_AUTH_WEB_URL:'https://auth.crimfig.com'},window);assert.equal(api.dashboardSession().options.authOrigin,'https://staging-auth.crimfig.com');const login=new URL(api.loginUrl());assert.equal(login.origin,'https://staging-auth.crimfig.com');assert.equal(new URL(login.searchParams.get('return_to')).origin,window.location.origin);
});


test('changed Billing funding component and helpers agree at their TypeScript call boundaries',()=>{
 const roots=['src/components/console/BillingConsole.tsx','src/lib/funding-api.ts','src/lib/backend-origins.ts','src/lib/session.ts'].map(file=>path.join(root,file));
 const options={target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext,moduleResolution:ts.ModuleResolutionKind.Bundler,jsx:ts.JsxEmit.ReactJSX,strict:true,typeRoots:[path.join(root,"node_modules/@types")],types:["node"],esModuleInterop:true,resolveJsonModule:true,skipLibCheck:true,noEmit:true,baseUrl:root,paths:{'@/*':['src/*']}};
 const host=ts.createCompilerHost(options);host.resolveModuleNames=(names,containing)=>names.map(name=>name==='next/navigation'?{resolvedFileName:path.resolve(__dirname,'../../api-client/test/navigation-stub.d.ts'),extension:ts.Extension.Dts}:ts.resolveModuleName(name,containing,options,host).resolvedModule);
 const program=ts.createProgram(roots,options,host),selected=new Set(roots.map(file=>path.normalize(file)));
 const errors=ts.getPreEmitDiagnostics(program).filter(error=>!error.file||selected.has(path.normalize(error.file.fileName)));assert.equal(errors.length,0,ts.formatDiagnosticsWithColorAndContext(errors,{getCurrentDirectory:()=>root,getCanonicalFileName:name=>name,getNewLine:()=>String.fromCharCode(10)}));
});
