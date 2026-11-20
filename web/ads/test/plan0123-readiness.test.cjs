const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const React = require('react');
const {JSDOM} = require('jsdom');
const {createRoot} = require('react-dom/client');

function load(file, imports) {
  const exports = {};
  const source = fs.readFileSync(path.join(__dirname,'../src',file),'utf8');
  const code = ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText;
  vm.runInNewContext(code,{exports,require:name=>imports[name]??require(name)});
  return exports;
}

test('readiness refresh retains expansion, handles failure, and isolates a different campaign',async()=>{
  const dom = new JSDOM('<div id="root"></div>',{url:'https://ads.example.test'});
  const original = {window:global.window,document:global.document,HTMLElement:global.HTMLElement,IS_REACT_ACT_ENVIRONMENT:global.IS_REACT_ACT_ENVIRONMENT};
  Object.assign(global,{window:dom.window,document:dom.window.document,HTMLElement:dom.window.HTMLElement,IS_REACT_ACT_ENVIRONMENT:true});
  const requests = [];
  const api = {deliveryReadiness:(id)=>new Promise((resolve,reject)=>requests.push({id,resolve,reject}))};
  const helpers = load('lib/delivery-readiness-view.ts',{});
  const {CampaignReadiness} = load('components/console/DeliveryReadinessPanel.tsx',{
    '@radix-ui/react-dialog':{},'../ui':{Button:({children,variant,size,...props})=>React.createElement('button',props,children)},
    '../../lib/session':{},'../../lib/ads-api-client':{adsApi:()=>api},
    '../../lib/delivery-readiness-view':helpers,'./DeliveryReadinessPanel.module.css':{default:{}},
  });
  const root = createRoot(document.getElementById('root'));
  const report = {version:1,evaluatedAt:'2026-11-20T00:00:00Z',gates:[{gateCode:'ADVERTISER_ACCOUNT',status:'eligible',owner:'Advertiser',source:'Auth',explanation:'Old account details',observedAt:null}]};
  try {
    await React.act(async()=>root.render(React.createElement(CampaignReadiness,{campaignId:'one'})));
    await React.act(async()=>requests[0].resolve(report));
    const details = document.querySelector('details');
    details.open = true;
    await React.act(async()=>document.querySelector('button').click());
    assert.equal(document.querySelector('details'),details);
    assert.equal(details.open,true);
    assert.equal(document.querySelector('button').disabled,true);
    await React.act(async()=>requests[1].reject(new Error('offline')));
    assert.equal(document.querySelector('details'),details);
    assert.equal(details.open,true);
    assert.match(document.body.textContent,/last checked results/);
    assert.equal(document.querySelector('button').disabled,false);
    await React.act(async()=>document.querySelector('button').click());
    await React.act(async()=>requests[2].resolve({...report,evaluatedAt:'2026-11-20T01:00:00Z'}));
    assert.equal(document.querySelector('details'),details);
    assert.equal(details.open,true);
    assert.doesNotMatch(document.body.textContent,/refresh failed/);
    await React.act(async()=>root.render(React.createElement(CampaignReadiness,{campaignId:'two'})));
    assert.doesNotMatch(document.body.textContent,/Old account details/);
    assert.equal(requests[3].id,'two');
  } finally {
    await React.act(async()=>root.unmount());
    dom.window.close();
    Object.assign(global,original);
  }
});

test('burn percentage preserves zero, rounds up, and bounds display values',()=>{
  const {displayBurnPercent} = load('lib/display-burn-percent.ts',{});
  assert.equal(displayBurnPercent(0,50),0);
  assert.equal(displayBurnPercent(NaN,50),0);
  assert.equal(displayBurnPercent(.9,50),2);
  assert.equal(displayBurnPercent(51,50),100);
});
