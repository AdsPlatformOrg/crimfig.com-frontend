/** Launch registry. Catalog readiness is a separate release requirement. */
export const locales = [
  ['en','English'],['fr','Français'],['es','Español'],['pt-BR','Português (Brasil)'],
  ['ar','العربية'],['sw','Kiswahili'],['zh-Hans','简体中文'],['zh-Hant','繁體中文'],
  ['hi','हिन्दी'],['bn','বাংলা'],['ur','اردو'],['id','Bahasa Indonesia'],['de','Deutsch'],
  ['ru','Русский'],['tr','Türkçe'],['ja','日本語'],['ko','한국어'],['ha','Hausa'],
  ['yo','Yorùbá'],['ig','Igbo'],['pcm','Naijá'],
] as const;
export type Locale = typeof locales[number][0];
/** Public choices require complete, reviewed catalogs across all three Wave 1 apps. */
export const publishedLocales: readonly Locale[] = ['en'];

export function supportedLocale(value: unknown): Locale | undefined {
  return typeof value === 'string' ? locales.find(([tag])=>tag.toLowerCase()===value.toLowerCase())?.[0] : undefined;
}
export function browserLocale(value: string): Locale | undefined {
  const tag=value.toLowerCase();
  const exact=supportedLocale(tag);
  if(exact)return exact;
  if(/^pt(?:-|$)/.test(tag))return 'pt-BR';
  if(/^zh(?:-|$)/.test(tag))return /(?:hant|tw|hk|mo)/.test(tag)?'zh-Hant':'zh-Hans';
  return supportedLocale(tag.split('-')[0]);
}
export function preferredBrowserLocale(header?: string|null): Locale {
  const candidates=(header??'').slice(0,4096).split(',').map((part,index)=>{
    const [tag,...params]=part.trim().split(';');
    let quality=1;
    for(const param of params){
      const match=/^\s*q=(0(?:\.\d{0,3})?|1(?:\.0{0,3})?)\s*$/.exec(param);
      if(!match){quality=0;break;}quality=Number(match[1]);
    }
    return {tag,index,quality};
  }).filter(item=>item.quality>0).sort((a,b)=>b.quality-a.quality||a.index-b.index);
  for(const candidate of candidates){const locale=browserLocale(candidate.tag);if(locale)return locale;}
  return 'en';
}
export function resolveLocale(input:{explicit?:unknown;signedIn?:unknown;anonymous?:unknown;
  country?:string|null;trustedCountry:boolean;acceptLanguage?:string|null}): Locale {
  for(const value of [input.explicit,input.signedIn,input.anonymous]){
    const locale=supportedLocale(value);if(locale)return locale;
  }
  if(input.trustedCountry&&input.country?.toUpperCase()==='NG')return 'en';
  return preferredBrowserLocale(input.acceptLanguage);
}
export function localeDirection(locale:Locale):'rtl'|'ltr'{return locale==='ar'||locale==='ur'?'rtl':'ltr';}
/** Runtime CLDR may not contain pcm. Never change the user's selected language to format a number. */
export function formattingLocale(locale:Locale):string {
  return locale==='pcm'?'en-NG':locale;
}
/** Preserve origin, destination, IDs, return state and payment/tracking parameters. */
export function localeHandoff(destination:string,locale:Locale,allowedOrigins:readonly string[]):string {
  const url=new URL(destination);
  if(!allowedOrigins.includes(url.origin)||url.username||url.password||url.protocol!=='https:')throw new Error('Unsupported locale handoff origin');
  url.searchParams.set('lang',locale);return url.href;
}
