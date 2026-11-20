'use client';
import React,{useEffect,useId,useRef,useState} from 'react';
import {useLanguage} from './LocalizationProvider';
import {commonMessages} from './catalog';
import {locales,localeDirection} from './locale';

/** Shares the existing AccountMenu keyboard/outside-dismiss interaction contract. */
export function LanguagePicker(){
  const {locale,setLanguage,pending,error}=useLanguage(),messages=commonMessages(locale);
  const [open,setOpen]=useState(false),id=useId(),root=useRef<HTMLDivElement>(null),trigger=useRef<HTMLButtonElement>(null);
  const menu=useRef<HTMLDivElement>(null);
  const choices=()=>Array.from(menu.current?.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]')??[]);
  const close=()=>{setOpen(false);trigger.current?.focus();};
  useEffect(()=>{
    if(!open)return;
    const selected=menu.current?.querySelector<HTMLButtonElement>('[aria-checked="true"]');selected?.focus();
    const outside=(event:PointerEvent)=>{if(!root.current?.contains(event.target as Node))setOpen(false);};
    document.addEventListener('pointerdown',outside);return()=>document.removeEventListener('pointerdown',outside);
  },[open]);
  return <div ref={root} className="cf-language" onBlur={event=>{if(!event.currentTarget.contains(event.relatedTarget as Node|null))setOpen(false);}}>
    <button ref={trigger} type="button" className="cf-language-trigger" disabled={pending} aria-haspopup="menu"
      aria-expanded={open} aria-controls={id} aria-label={`${messages.language}: ${locales.find(([tag])=>tag===locale)?.[1]}`}
      onClick={()=>setOpen(value=>!value)} onKeyDown={event=>{if(['ArrowDown','ArrowUp'].includes(event.key)){event.preventDefault();setOpen(true);}}}>
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c5 5 5 13 0 18-5-5-5-13 0-18Z"/></svg>
      <span>{locales.find(([tag])=>tag===locale)?.[1]}</span>
    </button>
    <div ref={menu} id={id} hidden={!open} role="menu" aria-label={messages.language} className="cf-language-menu"
      onKeyDown={event=>{
        if(event.key==='Escape'){event.preventDefault();event.stopPropagation();close();return;}
        if(!['ArrowDown','ArrowUp','Home','End'].includes(event.key))return;
        event.preventDefault();const list=choices(),index=list.indexOf(document.activeElement as HTMLButtonElement);
        const next=event.key==='Home'?0:event.key==='End'?list.length-1:(index+(event.key==='ArrowDown'?1:-1)+list.length)%list.length;
        list[next]?.focus();
      }}>
      {locales.map(([tag,name])=><button key={tag} type="button" role="menuitemradio" aria-checked={locale===tag} tabIndex={-1}
        lang={tag} dir={localeDirection(tag)} disabled={pending} onClick={()=>{void setLanguage(tag).then(close);}}>{name}<span aria-hidden="true">{locale===tag?'✓':''}</span></button>)}
    </div>
    {error&&<p role="alert">{messages.saveError}</p>}
  </div>;
}
