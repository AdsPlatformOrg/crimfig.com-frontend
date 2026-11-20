require('./load.cjs');
const {test}=require('node:test');const assert=require('node:assert/strict');
const {locales,resolveLocale,preferredBrowserLocale,localeDirection,localeHandoff}=require('../../ui/localization/locale.ts');
const {parseLocalizedMoney}=require('../../ui/localization/money.ts');
const {validateCommonCatalogs}=require('../../ui/localization/catalog.ts');
const {serverLocale}=require('../../ui/localization/server-locale.ts');
test('all common draft catalogs are complete; raw country headers never establish trust',()=>{
  validateCommonCatalogs();
  const headers=new Headers({'cf-ipcountry':'NG','accept-language':'fr'});
  assert.equal(serverLocale({headers}),'fr');assert.equal(serverLocale({headers,verifiedCountry:'NG'}),'en');
});
test('all 21 locales exist, including Portuguese and both RTL scripts',()=>{
  assert.equal(locales.length,21);assert.equal(new Set(locales.map(([id])=>id)).size,21);
  assert.equal(localeDirection('ar'),'rtl');assert.equal(localeDirection('ur'),'rtl');assert.equal(localeDirection('pt-BR'),'ltr');
});
test('Nigeria defaults to English only with trusted geolocation and no saved choice',()=>{
  for(const acceptLanguage of ['en','yo','ha','ig','pcm','fr'])assert.equal(resolveLocale({trustedCountry:true,country:'NG',acceptLanguage}),'en');
  assert.equal(resolveLocale({trustedCountry:false,country:'NG',acceptLanguage:'fr'}),'fr');
  for(const key of ['explicit','signedIn','anonymous'])assert.equal(resolveLocale({trustedCountry:true,country:'NG',acceptLanguage:'en',[key]:'pt-BR'}),'pt-BR');
  assert.equal(resolveLocale({trustedCountry:true,country:'NG',explicit:'fr',signedIn:'de',anonymous:'es'}),'fr');
});
test('weighted browser matching respects language, not foreign country',()=>{
  for(const [header,expected] of [['fr-FR','fr'],['pt','pt-BR'],['ja-JP','ja'],['en-GB','en'],['zh-CN','zh-Hans'],['zh-TW','zh-Hant'],['zz','en'],['de;q=0.2,fr;q=0.9','fr'],['fr;q=0,en;q=0.5','en'],['fr;q=NaN,de;q=1','de']])assert.equal(preferredBrowserLocale(header),expected);
  assert.equal(resolveLocale({trustedCountry:true,country:'DE',acceptLanguage:'en'}),'en');
});
test('handoffs preserve payment state and reject attacker origins',()=>{
  const url=new URL(localeHandoff('https://billing.crimfig.com/fund?returnTo=%2Fcampaigns%2Fid&payment=abc&lang=en','pt-BR',['https://billing.crimfig.com']));
  assert.equal(url.searchParams.get('lang'),'pt-BR');assert.equal(url.searchParams.get('payment'),'abc');assert.equal(url.searchParams.get('returnTo'),'/campaigns/id');
  assert.throws(()=>localeHandoff('https://attacker.example/fund','en',['https://billing.crimfig.com']));
});
test('localized amounts preserve exact minor units and reject ambiguity or overprecision',()=>{
  for(const [locale,text] of [['en','1,234.50'],['fr','1\u202f234,50'],['pt-BR','1.234,50'],['ar','١٬٢٣٤٫٥٠'],['hi','1,234.50'],['pcm','1,234.50']])assert.equal(parseLocalizedMoney(text,locale,2,1000000n),123450n);
  assert.equal(parseLocalizedMoney('0','en',2,1000n),0n);
  for(const text of ['1,23.40','-1','1e3','1.001','NaN','1 234.50'])assert.throws(()=>parseLocalizedMoney(text,'en',2,1000000n));
  assert.throws(()=>parseLocalizedMoney('100.01','en',2,10000n));
});
