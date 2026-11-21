require('../../../shared/api-client/test/load.cjs');
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),ts=require('typescript');
require.extensions['.tsx']=(mod,file)=>mod._compile(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText,file);
const React=require('react'),{createRoot}=require('react-dom/client'),{JSDOM}=require('jsdom');
const {LocalizationProvider,useLanguage}=require('../../../shared/ui/localization/LocalizationProvider.tsx');
const {LanguagePicker}=require('../../../shared/ui/localization/LanguagePicker.tsx');
const {AboutContent}=require('../src/app/about/AboutContent.tsx');
const {publishedLocales}=require('../../../shared/ui/localization/locale.ts');
const {adsPreviewHref}=require('../src/components/landing/usePreviewCopy.ts');

test('public Ads links carry the preview locale before section fragments',()=>{
  assert.equal(adsPreviewHref('/about','fr'),'/about?lang=fr');
  assert.equal(adsPreviewHref('/#partners','es'),'/?lang=es#partners');
  assert.equal(adsPreviewHref('/#what-we-do','en'),'/#what-we-do');
});

test('the public launch gate hides the picker and blocks unpublished locale changes',async()=>{
  const dom=new JSDOM('<html lang="en"><body><div id="root"></div></body></html>',{url:'https://ads.crimfig.com/?payment=fixture'});
  const keys=['window','document','location','history','HTMLElement','IS_REACT_ACT_ENVIRONMENT'],prior=Object.fromEntries(keys.map(key=>[key,global[key]]));
  Object.assign(global,{window:dom.window,document:dom.window.document,location:dom.window.location,history:dom.window.history,HTMLElement:dom.window.HTMLElement,IS_REACT_ACT_ENVIRONMENT:true});
  const root=createRoot(document.getElementById('root'));
  const saved=[];
  function Probe(){
    const {locale,setLanguage}=useLanguage();
    return React.createElement('button',{onClick:()=>void setLanguage('es')},locale);
  }
  try{
    await React.act(async()=>root.render(React.createElement(LocalizationProvider,{
      initialLocale:'fr',availableLocales:publishedLocales,savePreference:async locale=>saved.push(locale),
    },React.createElement(Probe),React.createElement(LanguagePicker))));
    assert.equal(document.querySelector('[aria-haspopup="menu"]'),null);
    const probe=document.querySelector('button');
    assert.equal(probe.textContent,'en');
    await React.act(async()=>probe.click());
    assert.deepEqual(saved,[]);
    assert.equal(document.documentElement.lang,'en');
    assert.equal(location.search,'?payment=fixture');
  }finally{await React.act(async()=>root.unmount());dom.window.close();Object.assign(global,prior);}
});

test('session-backed picker restores account language and preserves anonymous and payment state',async()=>{
  const dom=new JSDOM('<html lang="en"><body><div id="root"></div></body></html>',{
    url:'https://ads.crimfig.com/?payment=fixture&returnTo=%2Fbilling',
  });
  const keys=['window','document','location','history','HTMLElement','IS_REACT_ACT_ENVIRONMENT'];
  const prior=Object.fromEntries(keys.map(key=>[key,global[key]]));
  Object.assign(global,{window:dom.window,document:dom.window.document,location:dom.window.location,
    history:dom.window.history,HTMLElement:dom.window.HTMLElement,IS_REACT_ACT_ENVIRONMENT:true});
  document.cookie='cf_anonymous_locale=en';
  const saved=[];
  const session={
    getSnapshot:()=>({status:'authenticated',signOut:null,identityVersion:1}),
    subscribe:()=>()=>{},
    bootstrap:async()=>{throw new Error('Known sessions should not need bootstrap');},
    getProfile:async()=>({preferredLocale:'fr'}),
    updatePreferredLocale:async locale=>saved.push(locale),
  };
  const root=createRoot(document.getElementById('root'));
  try{
    await React.act(async()=>root.render(React.createElement(LocalizationProvider,{
      initialLocale:'en',availableLocales:['en','fr','es'],getSession:()=>session,
    },React.createElement(LanguagePicker),React.createElement(AboutContent))));
    assert.equal(document.documentElement.lang,'fr');
    assert.equal(document.querySelector('h1').textContent,'Qui sommes-nous ?');
    assert.match(document.querySelector('img').alt,/Des collègues/);
    await React.act(async()=>document.querySelector('[aria-haspopup="menu"]').click());
    assert.equal(document.querySelectorAll('[role="menuitemradio"]').length,3);
    await React.act(async()=>document.querySelector('[role="menuitemradio"][lang="es"]').click());
    assert.deepEqual(saved,['es']);
    assert.equal(document.documentElement.lang,'es');
    assert.equal(document.querySelector('h1').textContent,'Quiénes somos');
    assert.match(document.querySelector('img').alt,/Un grupo de colegas/);
    assert.match(document.cookie,/cf_anonymous_locale=en/);
    const url=new URL(location.href);
    assert.equal(url.searchParams.get('lang'),'es');
    assert.equal(url.searchParams.get('payment'),'fixture');
    assert.equal(url.searchParams.get('returnTo'),'/billing');
  }finally{await React.act(async()=>root.unmount());dom.window.close();Object.assign(global,prior);}
});
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
