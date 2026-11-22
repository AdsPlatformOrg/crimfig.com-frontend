"use client";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './SupportCenter.module.css';
type Request = (url: string, init?: RequestInit) => Promise<Response>;
type Ticket = {id:string;ticket_number:string;subject:string;category:string;status:string;priority:string;updated_at:string;assigned_to_staff_id?:string;messages?:Message[];audit?:{actor_id:string;action:string;created_at:string}[]};
type Message = {id:string;body:string;is_staff_reply:boolean;is_internal_note:boolean;created_at:string};
const statuses=['open','in_progress','waiting_on_user','resolved','closed'];
const categories=['technical','billing','campaign_moderation','account','other'];
const readable=(s:string)=>s.replaceAll('_',' ');
export function SupportCenter({request,admin=false}: {request:Request;admin?:boolean}) {
 const [tickets,setTickets]=useState<Ticket[]>([]),[selected,setSelected]=useState<Ticket|null>(null);
 const [loading,setLoading]=useState(true),[pending,setPending]=useState(false),[error,setError]=useState(''),[notice,setNotice]=useState('');
 const [subject,setSubject]=useState(''),[body,setBody]=useState(''),[category,setCategory]=useState('technical'),[reply,setReply]=useState(''),[internal,setInternal]=useState(false);
 const [filterCategory,setFilterCategory]=useState('');
 const [status,setStatus]=useState(''),[priority,setPriority]=useState(''),[search,setSearch]=useState(''),[queue,setQueue]=useState(''),[offset,setOffset]=useState(0);
 const [assign,setAssign]=useState(''),[editStatus,setEditStatus]=useState(''),[editPriority,setEditPriority]=useState('');
 const [fieldErrors,setFieldErrors]=useState<Record<string,string>>({});const summary=useRef<HTMLDivElement>(null);const busy=useRef(false);const keys=useRef(new Map<string,string>());const generation=useRef(0);
 const base='/api/v1/auth/support/'+(admin?'admin/':'')+'tickets';
 const api=useCallback(async (path:string,init?:RequestInit)=>{const res=await request(path,init);if(!res.ok)throw new Error(res.status===404?'Request not found.':res.status===403?'Your account does not have access to this action.':res.status===409?'This request changed or the retry key conflicts. Refresh and review before trying again.':'Support is unavailable. Your written message has been kept. Please retry.');return (await res.json()).data;},[request]);
 const load=useCallback(async()=>{const current=++generation.current;setLoading(true);setError('');try{const q=new URLSearchParams({offset:String(offset)});if(admin){if(status)q.set('status',status);if(priority)q.set('priority',priority);if(filterCategory)q.set('category',filterCategory);if(search)q.set('search',search);if(queue)q.set('queue',queue);}const list=await api(base+'?'+q);if(current===generation.current)setTickets(list);}catch(e){if(current===generation.current)setError((e as Error).message);}finally{if(current===generation.current)setLoading(false);}},[api,base,offset,status,priority,filterCategory,search,queue,admin]);
 useEffect(()=>{void load();return()=>{generation.current++;};},[load]);
 const open=useCallback(async(id:string)=>{setError('');try{const ticket=await api(base+'/'+id);setSelected(ticket);setEditStatus(ticket.status);setEditPriority(ticket.priority);setAssign(ticket.assigned_to_staff_id||'');}catch(e){setError((e as Error).message);}},[api,base]);
 useEffect(()=>{const id=new URLSearchParams(window.location.search).get('ticket');if(id&&/^[0-9a-f-]{36}$/i.test(id))void open(id);},[open]);
 const mutation=async(path:string,payload:Record<string,unknown>,method='POST')=>{
  if(busy.current)return;busy.current=true;setPending(true);setError('');setNotice('');
  const fingerprint=path+JSON.stringify(payload);let key=keys.current.get(fingerprint);if(!key){key=crypto.randomUUID();keys.current.set(fingerprint,key);}
  try{const data=await api(path,{method,headers:{'Content-Type':'application/json'},body:JSON.stringify(method==='PATCH'?payload:{...payload,requestId:key})});keys.current.delete(fingerprint);return data;}catch(e){setError((e as Error).message);return null;}finally{busy.current=false;setPending(false);}
 };
 async function create(e:React.FormEvent){e.preventDefault();const errors:Record<string,string>={};if(subject.trim().length<3)errors.subject='Enter a subject of at least 3 characters.';if(body.trim().length<10)errors.body='Describe your request in at least 10 characters.';setFieldErrors(errors);if(Object.keys(errors).length){setTimeout(()=>summary.current?.focus(),0);return;}const data=await mutation(base,{category,subject,body});if(data){setSubject('');setBody('');setNotice('Request '+data.ticket_number+' received. An email acknowledgement is queued.');await open(data.id);await load();}}
 async function sendReply(e:React.FormEvent){e.preventDefault();if(!selected||!reply.trim())return;const data=await mutation(base+'/'+selected.id+'/replies',{body:reply,...(admin?{internal}:{})});if(data){setReply('');setNotice(internal?'Internal note saved.':'Reply sent.');await open(selected.id);await load();}}
 const field=(name:string,label:string,value:string,onChange:(s:string)=>void,max:number,multiline=false)=>{const props={id:'support-'+name,value,onChange:(e:React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>)=>onChange(e.target.value),maxLength:max,required:true,'aria-invalid':!!fieldErrors[name],'aria-describedby':fieldErrors[name]?'support-error-'+name:undefined,disabled:pending};return <label>{label}{multiline?<textarea {...props} rows={5}/>:<input {...props}/>} {fieldErrors[name]&&<span id={'support-error-'+name}>{fieldErrors[name]}</span>}</label>;};
 return <section className={styles.root} aria-busy={pending}>
  <header><h1>{admin?'Support Center':'Help & Support'}</h1><p>{admin?'Triage requests and reply to customers. Internal notes stay private.':'Ask for help and follow your requests here.'}</p></header>
  {error&&<div role="alert"><p>{error}</p><button onClick={()=>void load()} disabled={pending}>Retry list</button></div>}
  {notice&&<p role="status">{notice}</p>}
  <div className={styles.layout}><div>
   {admin&&<form className={styles.filters} onSubmit={e=>{e.preventDefault();setOffset(0);void load();}}>
    <label>Ticket number<input value={search} onChange={e=>setSearch(e.target.value)} placeholder="#0000001" maxLength={40}/></label>
    <label>Queue<select value={queue} onChange={e=>{setQueue(e.target.value);setOffset(0);}}><option value="">All</option>{['new','assigned','waiting','resolved'].map(s=><option key={s}>{s}</option>)}</select></label>
    <label>Status<select value={status} onChange={e=>{setStatus(e.target.value);setOffset(0);}}><option value="">All</option>{statuses.map(s=><option key={s} value={s}>{readable(s)}</option>)}</select></label>
    <label>Category<select value={filterCategory} onChange={e=>{setFilterCategory(e.target.value);setOffset(0);}}><option value="">All</option>{categories.map(s=><option key={s} value={s}>{readable(s)}</option>)}</select></label>
    <label>Priority<select value={priority} onChange={e=>{setPriority(e.target.value);setOffset(0);}}><option value="">All</option>{['low','medium','high','urgent'].map(s=><option key={s}>{s}</option>)}</select></label>
    <button type="submit">Search</button>
   </form>}
   <h2>{admin?'Requests':'My requests'}</h2>
   {loading?<p role="status">Loading requests...</p>:tickets.length===0?<p>No requests found.</p>:<ul className={styles.list}>{tickets.map(t=><li key={t.id}><a href={'?ticket='+t.id} aria-current={selected?.id===t.id?'page':undefined} onClick={e=>{e.preventDefault();void open(t.id);}}><strong>{t.ticket_number} {t.subject}</strong><span>{readable(t.status)} · {readable(t.category)} · {new Date(t.updated_at).toLocaleString()}</span></a></li>)}</ul>}
   <div className={styles.actions}><button disabled={offset===0||loading} onClick={()=>setOffset(n=>Math.max(0,n-50))}>Previous</button><span>Page {offset/50+1}</span><button disabled={tickets.length<50||loading} onClick={()=>setOffset(n=>n+50)}>Next</button></div>
   {!admin&&<form onSubmit={create} noValidate><h2>New request</h2>
    {Object.keys(fieldErrors).length>0&&<div ref={summary} tabIndex={-1} role="alert">{Object.entries(fieldErrors).map(([key,message])=><p key={key}><a href={'#support-'+key}>{message}</a></p>)}</div>}
    <label>Category<select value={category} onChange={e=>setCategory(e.target.value)} disabled={pending}>{categories.map(c=><option key={c} value={c}>{readable(c)}</option>)}</select></label>
    {field('subject','Subject',subject,setSubject,200)}{field('body','Description',body,setBody,10000,true)}
    <p>Your verified account email is used for updates. Attachments are not available.</p><button disabled={pending} type="submit">{pending?'Sending...':'Send request'}</button>
   </form>}
  </div><div>
  {selected?<article><h2>{selected.ticket_number} {selected.subject}</h2><p>Status: {readable(selected.status)}</p><p>Last update: {new Date(selected.updated_at).toLocaleString()}</p>
   <ol className={styles.thread}>{selected.messages?.map(m=><li key={m.id} className={m.is_internal_note?styles.note:styles.message}><strong>{m.is_internal_note?'Internal note':m.is_staff_reply?'Support':'Customer'}</strong><time dateTime={m.created_at}>{new Date(m.created_at).toLocaleString()}</time><p>{m.body}</p></li>)}</ol>
   {admin&&<form onSubmit={async e=>{e.preventDefault();const data=await mutation(base+'/'+selected.id,{status:editStatus,priority:editPriority,...(assign?{assignedTo:assign}:{unassign:true})},'PATCH');if(data){await open(selected.id);await load();}}}>
    <h3>Manage request</h3><label>Status<select value={editStatus} onChange={e=>setEditStatus(e.target.value)}>{statuses.map(s=><option value={s} key={s}>{readable(s)}</option>)}</select></label>
    <label>Priority<select value={editPriority} onChange={e=>setEditPriority(e.target.value)}>{['low','medium','high','urgent'].map(s=><option key={s}>{s}</option>)}</select></label>
    <label>Assigned staff UUID (blank to unassign)<input value={assign} onChange={e=>setAssign(e.target.value)}/></label><button disabled={pending}>Save changes</button>
   </form>}
   {admin||!['resolved','closed'].includes(selected.status)?<form onSubmit={sendReply}>
    {admin&&<label>Message visibility<select value={internal?'internal':'public'} onChange={e=>setInternal(e.target.value==='internal')}><option value="public">Public reply — visible to customer</option><option value="internal">Internal note — staff only</option></select></label>}
    <label>{internal?'Internal note':'Reply'}<textarea value={reply} onChange={e=>setReply(e.target.value)} maxLength={10000} required rows={5} disabled={pending}/></label>
    <button disabled={pending||!reply.trim()}>{pending?'Sending...':internal?'Save internal note':'Send reply'}</button>
   </form>:<p>This request is {selected.status}. You can review the conversation or start a new request.</p>}
   {admin&&<details><summary>Audit trail</summary><ul>{selected.audit?.map((a,i)=><li key={i}>{a.action} · {a.actor_id} · {new Date(a.created_at).toLocaleString()}</li>)}</ul></details>}
  </article>:<p>Select a request to read the conversation.</p>}
  </div></div>
 </section>;
}
