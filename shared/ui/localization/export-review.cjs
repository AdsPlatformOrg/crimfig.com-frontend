// Export editable review artifacts without publishing incomplete translations.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const ts=require('../../../node_modules/typescript');
require('../../../shared/api-client/test/load.cjs');
const {locales}=require('./locale.ts'),{commonMessages}=require('./catalog.ts');
const frontend=path.resolve(__dirname,'../../..'),output=path.resolve(frontend,'../docs/reviews/plan-0110');
fs.mkdirSync(output,{recursive:true});
const routeInventory=[],candidates=[];
const uiProps=new Set(['title','label','placeholder','alt','aria-label','description','subtitle','heading','detail','message','emptyMessage','errorMessage','helperText']);
const excludedPathPattern=/(?:\/admin\/|\/staff\/|\/console\/admin\/|\/(?:Admin|AuthAdmin|BillingAdmin|Staff|Moderation|WebsitePolicyReview|ErrorMonitorView|ErrorRequestDiagnostics)[^/]*\.tsx?$)/;
for(const app of ['ads','auth','billing']){
  const root=path.join(frontend,'web',app,'src');
  function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    const file=path.join(dir,entry.name);if(entry.isDirectory()){walk(file);continue;}
    if(!/\.tsx?$/.test(file))continue;
    const relative=path.relative(frontend,file).replaceAll('\\','/');
    if(/\/app\/.*\/page\.tsx$/.test(relative)||relative.endsWith('/app/page.tsx'))routeInventory.push({app,file:relative,inScope:!excludedPathPattern.test(relative)});
    if(excludedPathPattern.test(relative))continue;
    const source=fs.readFileSync(file,'utf8'),ast=ts.createSourceFile(file,source,ts.ScriptTarget.Latest,true,file.endsWith('tsx')?ts.ScriptKind.TSX:ts.ScriptKind.TS);
    function visit(node){
      let text,context;
      if(ts.isJsxText(node)){text=node.text.replace(/\s+/g,' ').trim();context='jsx-text';}
      else if(ts.isStringLiteral(node)||ts.isNoSubstitutionTemplateLiteral(node)){
        const parent=node.parent;
        if(ts.isJsxAttribute(parent)&&uiProps.has(parent.name.getText(ast))){text=node.text;context=parent.name.getText(ast);}
        if(ts.isPropertyAssignment(parent)&&uiProps.has(parent.name.getText(ast).replace(/['"]/g,''))){text=node.text;context=parent.name.getText(ast);}
      }
      if(text&&/[a-zA-Z]/.test(text)&&text.length>1){
        const line=ast.getLineAndCharacterOfPosition(node.getStart(ast)).line+1;
        candidates.push({key:`${app}.${crypto.createHash('sha256').update(relative+'|'+context+'|'+text).digest('hex').slice(0,16)}`,
          app,file:relative,line,context,source:text,status:'candidate-needs-context-review',translations:Object.fromEntries(locales.filter(([tag])=>tag!=='en').map(([tag])=>[tag,null]))});
      }
      ts.forEachChild(node,visit);
    }visit(ast);
  }}walk(root);
}
const common=Object.fromEntries(locales.map(([tag,name])=>[tag,{name,status:tag==='en'?'source':'draft-unreviewed',reviewer:null,messages:commonMessages(tag)}]));
fs.writeFileSync(path.join(output,'common-translations.review.json'),JSON.stringify({schemaVersion:1,plan:'PLAN-0110',sourceLocale:'en',releaseReady:false,locales:common},null,2)+'\n');
fs.writeFileSync(path.join(output,'page-copy-candidates.review.json'),JSON.stringify({schemaVersion:1,plan:'PLAN-0110',releaseReady:false,
  extractionLimits:'Candidates only. Audit strings in arrays, dynamic errors, plurals and accessibility labels manually. Preserve user content and code. Candidate inclusion does not prove launch scope or runtime integration.',routeInventory,candidates},null,2)+'\n');
console.log(JSON.stringify({locales:locales.length,commonKeys:Object.keys(common.en.messages).length,routeCount:routeInventory.length,candidates:candidates.length,output}));
