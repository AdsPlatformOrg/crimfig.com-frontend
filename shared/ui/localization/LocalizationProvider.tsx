'use client';
import React,{createContext,useContext,useState} from 'react';
import {NextIntlClientProvider} from 'next-intl';
import {commonMessages} from './catalog';
import {localeDirection,formattingLocale,locales,type Locale} from './locale';

type LanguageContext={locale:Locale;availableLocales:readonly Locale[];setLanguage:(locale:Locale)=>Promise<void>;pending:boolean;error:boolean};
const Context=createContext<LanguageContext|null>(null);
const allLocales = locales.map(([tag]) => tag);
export function useLanguage(){const context=useContext(Context);if(!context)throw new Error('Language provider is missing');return context;}
export function LocalizationProvider({initialLocale,children,savePreference,availableLocales=allLocales}:{
  initialLocale:Locale;children:React.ReactNode;savePreference?:(locale:Locale)=>Promise<void>;availableLocales?:readonly Locale[];
}) {
  const [locale,setLocale]=useState(availableLocales.includes(initialLocale)?initialLocale:'en'),[pending,setPending]=useState(false),[error,setError]=useState(false);
  const inFlight=React.useRef(false);
  async function setLanguage(next:Locale){
    if(inFlight.current||!availableLocales.includes(next))return;inFlight.current=true;setPending(true);setError(false);
    try{
      if(savePreference)await savePreference(next);
      // Keep the anonymous choice separate from an account's preference.
      else document.cookie=`cf_anonymous_locale=${encodeURIComponent(next)}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol==='https:'?'; Secure':''}`;
      setLocale(next);document.documentElement.lang=next;document.documentElement.dir=localeDirection(next);
      const url=new URL(location.href);url.searchParams.set('lang',next);history.replaceState(history.state,'',url);
    }catch{setError(true);}finally{inFlight.current=false;setPending(false);}
  }
  return <Context.Provider value={{locale,availableLocales,setLanguage,pending,error}}><NextIntlClientProvider locale={formattingLocale(locale)} messages={{common:commonMessages(locale)}} timeZone="Africa/Lagos">{children}</NextIntlClientProvider></Context.Provider>;
}
