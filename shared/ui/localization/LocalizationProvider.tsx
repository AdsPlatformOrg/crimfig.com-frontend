'use client';
import React,{createContext,useContext,useEffect,useState} from 'react';
import {NextIntlClientProvider} from 'next-intl';
import {commonMessages} from './catalog';
import {localeDirection,formattingLocale,locales,supportedLocale,type Locale} from './locale';

type LanguageSession = {
  getSnapshot: () => {status:string;signOut:unknown;identityVersion?:number};
  subscribe: (listener: () => void) => () => void;
  bootstrap: () => Promise<{status:string}>;
  getProfile: () => Promise<{preferredLocale?:string}>;
  updatePreferredLocale: (locale:Locale) => Promise<void>;
};

type LanguageContext={locale:Locale;availableLocales:readonly Locale[];setLanguage:(locale:Locale)=>Promise<void>;pending:boolean;error:boolean};
const Context=createContext<LanguageContext|null>(null);
const allLocales = locales.map(([tag]) => tag);
export function useLanguage(){const context=useContext(Context);if(!context)throw new Error('Language provider is missing');return context;}
export function LocalizationProvider({initialLocale,children,savePreference,availableLocales=allLocales,getSession}:{
  initialLocale:Locale;children:React.ReactNode;savePreference?:(locale:Locale)=>Promise<void>;availableLocales?:readonly Locale[];
  getSession?:()=>LanguageSession;
}) {
  const [locale,setLocale]=useState(availableLocales.includes(initialLocale)?initialLocale:'en'),[pending,setPending]=useState(false),[error,setError]=useState(false);
  const inFlight=React.useRef(false);
  const changeVersion=React.useRef(0);
  useEffect(()=>{
    if(!getSession||availableLocales.length<2)return;
    const session=getSession();
    let active=true;
    let observedIdentity:string|undefined;
    function restore(){
      const snapshot=session.getSnapshot();
      const identity=`${snapshot.status}:${snapshot.identityVersion??0}:${snapshot.signOut??''}`;
      if(identity===observedIdentity)return;
      observedIdentity=identity;
      const version=changeVersion.current;
      const apply=(preferred?:string)=>{
        if(!active||observedIdentity!==identity||version!==changeVersion.current)return;
        const explicit=new URL(location.href).searchParams.get('lang');
        const anonymous=document.cookie.match(/(?:^|;\s*)cf_anonymous_locale=([^;]*)/)?.[1];
        const next=[explicit,preferred,anonymous,initialLocale]
          .map(supportedLocale)
          .find((candidate):candidate is Locale=>candidate!==undefined&&availableLocales.includes(candidate))??'en';
        setLocale(next);
        document.documentElement.lang=next;
        document.documentElement.dir=localeDirection(next);
      };
      if(snapshot.status==='authenticated'&&!snapshot.signOut){
        void session.getProfile().then(profile=>apply(profile.preferredLocale),()=>apply());
      }else apply();
    }
    const unsubscribe=session.subscribe(restore);
    restore();
    return ()=>{active=false;unsubscribe();};
  },[availableLocales,getSession,initialLocale]);

  async function setLanguage(next:Locale){
    if(inFlight.current||!availableLocales.includes(next))return;inFlight.current=true;changeVersion.current++;setPending(true);setError(false);
    try{
      const session=getSession?.();
      if(savePreference)await savePreference(next);
      else {
        const snapshot=session?.getSnapshot();
        const status=session&&snapshot?.status!=='authenticated'&&snapshot?.status!=='anonymous'
          ? (await session.bootstrap()).status : snapshot?.status;
        if(session&&status==='authenticated')await session.updatePreferredLocale(next);
        else if(!session||status==='anonymous'){
          document.cookie=`cf_anonymous_locale=${encodeURIComponent(next)}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol==='https:'?'; Secure':''}`;
        }else throw new Error('Language preference could not be saved');
      }
      setLocale(next);document.documentElement.lang=next;document.documentElement.dir=localeDirection(next);
      const url=new URL(location.href);url.searchParams.set('lang',next);history.replaceState(history.state,'',url);
    }catch{setError(true);}finally{inFlight.current=false;setPending(false);}
  }
  return <Context.Provider value={{locale,availableLocales,setLanguage,pending,error}}><NextIntlClientProvider locale={formattingLocale(locale)} messages={{common:commonMessages(locale)}} timeZone="Africa/Lagos">{children}</NextIntlClientProvider></Context.Provider>;
}
