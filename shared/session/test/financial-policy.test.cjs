const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm'), ts = require('typescript');
const source=fs.readFileSync(path.resolve(__dirname,'../../../web/billing/src/lib/financial-policy.ts'),'utf8');
const exportsObject={};
vm.runInNewContext(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{exports:exportsObject});
const {validateFinancialPolicy,financialPolicyFigures}=exportsObject;
const valid={...Object.fromEntries(financialPolicyFigures.map(([key])=>[key,10000])),mode:'not_activated',version:'v1',recipients:['jed@crimfig.com','jedacctwo@gmail.com'],alertSubmissionTargetMs:10000,acknowledgementTargetMs:300000};
test('rejects incomplete, fabricated active or invalid policy figures',()=>{
  for(const bad of [null,{}, {...valid,mode:'active'},{...valid,withdrawalUsdCents:NaN},{...valid,outstandingUsdCents:-1},{...valid,recipients:[]},{...valid,alertSubmissionTargetMs:0}]) assert.throws(()=>validateFinancialPolicy(bad));
});
test('preserves real configured figures without fallback defaults',()=>{
  const input={...valid,outstandingUsdCents:0}; assert.equal(validateFinancialPolicy(input),input); assert.equal(input.outstandingUsdCents,0);
});
