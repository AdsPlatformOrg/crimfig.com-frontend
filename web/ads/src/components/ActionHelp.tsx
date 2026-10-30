'use client';
import {useEffect,useId,useRef,useState} from 'react';
import {CircleHelp} from 'lucide-react';
/** Independent from the disabled action so keyboard/touch users can still read its reason. */
export function ActionHelp({action,reason}:{action:string;reason:string}) {
  const id=useId(),root=useRef<HTMLSpanElement>(null),button=useRef<HTMLButtonElement>(null);
  const [open,setOpen]=useState(false),[pinned,setPinned]=useState(false);
  useEffect(()=>{if(!open)return;const dismiss=(e:PointerEvent)=>{if(!root.current?.contains(e.target as Node)){setOpen(false);setPinned(false);}};
    const escape=(e:KeyboardEvent)=>{if(e.key==='Escape'){setOpen(false);setPinned(false);button.current?.focus();}};
    document.addEventListener('pointerdown',dismiss);document.addEventListener('keydown',escape);return()=>{document.removeEventListener('pointerdown',dismiss);document.removeEventListener('keydown',escape);};},[open]);
  return <span ref={root} style={{position:'relative',display:'inline-flex'}} onMouseEnter={()=>setOpen(true)} onMouseLeave={()=>{if(!pinned)setOpen(false);}}>
    <button ref={button} type="button" aria-label={`Why is ${action} unavailable?`} aria-expanded={open} aria-controls={id} aria-describedby={open?id:undefined}
      onFocus={()=>setOpen(true)} onBlur={e=>{if(!pinned&&!root.current?.contains(e.relatedTarget))setOpen(false);}}
      onClick={()=>{setPinned(!pinned);setOpen(!pinned);}} style={{display:'inline-flex',alignItems:'center',justifyContent:'center',minWidth:44,minHeight:44,color:'var(--text-secondary)',background:'transparent',border:0,borderRadius:8,cursor:'pointer'}}>
      <CircleHelp size={17} aria-hidden="true" />
    </button>
    {open&&<span id={id} role="note" style={{position:'absolute',insetInlineEnd:0,bottom:'100%',zIndex:30,width:'min(260px, 75vw)',padding:12,border:'1px solid var(--border-subtle)',borderRadius:8,background:'var(--bg-surface)',color:'var(--text-primary)',boxShadow:'var(--shadow-md)',fontSize:13,whiteSpace:'normal'}}>{reason}</span>}
  </span>;
}
