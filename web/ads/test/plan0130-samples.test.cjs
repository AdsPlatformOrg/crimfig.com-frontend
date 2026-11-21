const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),ts=require('typescript');
const React=require('react'),{createRoot}=require('react-dom/client'),{JSDOM}=require('jsdom');
require('../../../shared/api-client/test/load.cjs');
const helpers=require('../src/lib/house-samples.ts');
function load(){const exports={};const filename=path.join(__dirname,'../src/components/console/HouseSizeSamples.tsx');
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText,{exports,require:name=>name==='../ui/button'?{Button:({variant,...props})=>React.createElement('button',props)}:name==='../../lib/house-samples'?helpers:name.endsWith('.css')?{default:{}}:require(name)});return exports.HouseSizeSamples;}
test('sample controls stay local, show fitting sizes, handle image errors and never submit the enclosing draft',async()=>{
  const dom=new JSDOM('<div id="root"></div>',{url:'https://ads.example.test'});
  const previous={window:global.window,document:global.document,IS_REACT_ACT_ENVIRONMENT:global.IS_REACT_ACT_ENVIRONMENT};
  Object.assign(global,{window:dom.window,document:dom.window.document,IS_REACT_ACT_ENVIRONMENT:true});
  const root=createRoot(document.getElementById('root')),Component=load();let submissions=0;
  try{
    await React.act(async()=>root.render(React.createElement('form',{onSubmit:()=>submissions++},React.createElement('input',{defaultValue:'Keep this campaign'}),React.createElement(Component,{context:'publisher'}))));
    const draft=document.querySelector('input');
    assert.ok(!document.querySelector('script'));assert.equal(document.querySelectorAll('img').length,1);
    assert.ok(!Array.from(document.querySelectorAll('button')).some(button=>button.textContent==='728 × 90'));
    const button=text=>Array.from(document.querySelectorAll('button')).find(item=>item.textContent===text);
    await React.act(async()=>button('970 px').click());assert.ok(button('728 × 90'));
    await React.act(async()=>button('728 × 90').click());assert.equal(document.querySelector('img').width,728);
    await React.act(async()=>button('Plaid woman').click());assert.match(document.querySelector('img').src,/sample_03_plaid_woman/);
    assert.equal(document.querySelector('input'),draft);assert.equal(draft.value,'Keep this campaign');assert.equal(submissions,0);
    await React.act(async()=>document.querySelector('img').dispatchEvent(new dom.window.Event('error')));
    assert.match(document.querySelector('[role="status"]').textContent,/could not be loaded/);
    await React.act(async()=>root.render(React.createElement(Component,{allowedPresets:['unsupported']})));
    assert.equal(document.querySelector('img'),null);assert.match(document.querySelector('[role="status"]').textContent,/No approved sample/);
  }finally{await React.act(async()=>root.unmount());dom.window.close();Object.assign(global,previous);}
});
