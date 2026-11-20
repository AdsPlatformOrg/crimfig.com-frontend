require('../../../shared/api-client/test/load.cjs');
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),ts=require('typescript');
require.extensions['.tsx']=(mod,file)=>mod._compile(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText,file);
const React=require('react'),{createRoot}=require('react-dom/client'),{JSDOM}=require('jsdom');
const {LocalizationProvider}=require('../../../shared/ui/localization/LocalizationProvider.tsx');
const {LanguagePicker}=require('../../../shared/ui/localization/LanguagePicker.tsx');
test('picker keyboard navigation and locale changes preserve drafts and payment state',async()=>{
  const dom=new JSDOM('<html lang="en"><body><div id="root"></div></body></html>',{url:'https://ads.crimfig.com/campaigns/id?payment=fixture&returnTo=%2Fbilling'});
  const keys=['window','document','location','history','HTMLElement','IS_REACT_ACT_ENVIRONMENT'],prior=Object.fromEntries(keys.map(key=>[key,global[key]]));
  Object.assign(global,{window:dom.window,document:dom.window.document,location:dom.window.location,history:dom.window.history,HTMLElement:dom.window.HTMLElement,IS_REACT_ACT_ENVIRONMENT:true});
  const root=createRoot(document.getElementById('root'));
  try{
    await React.act(async()=>root.render(React.createElement(LocalizationProvider,{initialLocale:'en'},React.createElement('input',{defaultValue:'840.00','aria-label':'Draft budget'}),React.createElement(LanguagePicker))));
    const draft=document.querySelector('input'),trigger=document.querySelector('[aria-haspopup="menu"]');
    await React.act(async()=>trigger.click());assert.equal(document.querySelectorAll('[role="menuitemradio"]').length,21);
    const menu=document.querySelector('[role="menu"]');
    await React.act(async()=>menu.dispatchEvent(new dom.window.KeyboardEvent('keydown',{key:'End',bubbles:true})));
    assert.equal(document.activeElement.lang,'pcm');
    await React.act(async()=>menu.dispatchEvent(new dom.window.KeyboardEvent('keydown',{key:'Escape',bubbles:true})));
    assert.equal(document.activeElement,trigger);assert.equal(menu.hidden,true);
    await React.act(async()=>trigger.click());
    await React.act(async()=>document.querySelector('[role="menuitemradio"][lang="pt-BR"]').click());
    assert.equal(document.documentElement.lang,'pt-BR');assert.equal(document.documentElement.dir,'ltr');
    assert.equal(document.querySelector('input'),draft);assert.equal(draft.value,'840.00');
    assert.equal(new URL(location.href).searchParams.get('payment'),'fixture');assert.equal(new URL(location.href).searchParams.get('returnTo'),'/billing');
    assert.match(document.cookie,/cf_anonymous_locale=pt-BR/);
    await React.act(async()=>trigger.click());await React.act(async()=>document.querySelector('[role="menuitemradio"][lang="ar"]').click());
    assert.equal(document.documentElement.dir,'rtl');
  }finally{await React.act(async()=>root.unmount());dom.window.close();Object.assign(global,prior);}
});
test('failed account preference save retains the current language and anonymous preference',async()=>{
  const dom=new JSDOM('<div id="root"></div>',{url:'https://ads.crimfig.com/?lang=en'});
  const keys=['window','document','location','history','HTMLElement','IS_REACT_ACT_ENVIRONMENT'],prior=Object.fromEntries(keys.map(key=>[key,global[key]]));
  Object.assign(global,{window:dom.window,document:dom.window.document,location:dom.window.location,history:dom.window.history,HTMLElement:dom.window.HTMLElement,IS_REACT_ACT_ENVIRONMENT:true});
  document.cookie='cf_anonymous_locale=yo';let reject;
  const root=createRoot(document.getElementById('root'));
  try{
    await React.act(async()=>root.render(React.createElement(LocalizationProvider,{initialLocale:'en',savePreference:()=>new Promise((_resolve,no)=>{reject=no;})},React.createElement(LanguagePicker))));
    const trigger=document.querySelector('[aria-haspopup="menu"]');await React.act(async()=>trigger.click());
    await React.act(async()=>document.querySelector('[role="menuitemradio"][lang="fr"]').click());
    assert.equal(trigger.disabled,true);assert.match(trigger.textContent,/English/);
    await React.act(async()=>reject(new Error('unavailable')));
    assert.equal(trigger.disabled,false);assert.match(document.querySelector('[role="alert"]').textContent,/Could not save/);
    assert.equal(new URL(location.href).searchParams.get('lang'),'en');assert.match(document.cookie,/cf_anonymous_locale=yo/);
  }finally{await React.act(async()=>root.unmount());dom.window.close();Object.assign(global,prior);}
});
