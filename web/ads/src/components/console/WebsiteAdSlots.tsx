'use client';
import {useCallback,useEffect,useRef,useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {sessionFetch,dashboardSession} from '../../lib/session';
import {Button} from '../ui/button';
import {Input} from '../ui/input';
import {Table,TableBody,TableCell,TableHead,TableHeader,TableRow} from '../ui/table';
import {HouseSizeSamples} from './HouseSizeSamples';
import {houseSampleCatalog} from '../../lib/house-samples';
import styles from './WebsiteAdSlots.module.css';

type Slot={id:string;websiteId:string;name:string;slotTagId:string;slotType:string;lifecycleStatus:string;installationStatus:string;width?:number|null;height?:number|null;
  allowedPresetIds:string|null;updatedAt:string;format:string;retiredAt?:string|null;allowedAdTypes?:string|null;manualReviewStatus?:string};
type Snapshot={websiteId:string;slots:Slot[]};
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const presets=houseSampleCatalog.assets.filter(item=>item.family===houseSampleCatalog.families[0]);
function ids(slot?:Slot):string[]{try{const value=JSON.parse(slot?.allowedPresetIds??'[]');return Array.isArray(value)?value:[];}catch{return [];}}
export function WebsiteAdSlots({websiteId,slotId,mode='list'}:{websiteId:string;slotId?:string;mode?:'list'|'new'|'detail'}){
  const router=useRouter(),base=`/promoter/websites/${websiteId}/slots`;
  const [snapshot,setSnapshot]=useState<Snapshot|null>(null),[loading,setLoading]=useState(true),[error,setError]=useState(''),[query,setQuery]=useState(''),[status,setStatus]=useState('all'),[sort,setSort]=useState<'name'|'updatedAt'>('updatedAt');
  const [embed,setEmbed]=useState<any>(null),[notice,setNotice]=useState(''),[busy,setBusy]=useState(false),[confirmRetire,setConfirmRetire]=useState(false);
  const [recovery,setRecovery]=useState<{body:Record<string,unknown>;target?:string}|null>(null);
  const sequence=useRef(0),lock=useRef(false),mutation=useRef<{key:string;requestId:string}|null>(null);
  const slots=snapshot?.websiteId===websiteId?snapshot.slots:[],slot=slots.find(item=>item.id===slotId);
  const load=useCallback(async()=>{
    const current=++sequence.current;setLoading(true);setError('');
    if(!uuid.test(websiteId)){setError('Invalid website reference.');setLoading(false);return;}
    try{
      const response=await sessionFetch(`/api/v1/publisher/websites/${websiteId}/slots`,{cache:'no-store'}),json=await response.json();
      if(!response.ok||!Array.isArray(json.data))throw new Error(json.message||'Ad slots could not be loaded.');
      if(current===sequence.current)setSnapshot({websiteId,slots:json.data});
    }catch(error){if(current===sequence.current)setError(error instanceof Error?error.message:'Ad slots unavailable.');}
    finally{if(current===sequence.current)setLoading(false);}
  },[websiteId]);
  useEffect(()=>{setEmbed(null);setNotice('');setConfirmRetire(false);void load();return()=>{sequence.current++;};},[load,slotId]);
  const filtered=slots.filter(item=>(status==='all'?!item.retiredAt:status==='retired'?!!item.retiredAt:item.lifecycleStatus===status&&!item.retiredAt)&&`${item.name} ${item.slotTagId}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a,b)=>sort==='name'?a.name.localeCompare(b.name):Date.parse(b.updatedAt)-Date.parse(a.updatedAt));
  async function mutate(action:string,body:Record<string,unknown>,target=slotId){
    if(lock.current)return;lock.current=true;setBusy(true);setError('');setNotice('');
    const key=JSON.stringify({action,target,body,version:action==='create'?null:slot?.updatedAt});
    if(mutation.current?.key!==key)mutation.current={key,requestId:crypto.randomUUID()};
    let receiptKey='';
    try{
      if(action==='create'){
        const profile=await dashboardSession().getProfile();receiptKey=`crimfig:slot-create:v1:${profile.userId}:${websiteId}`;
        const saved=localStorage.getItem(receiptKey);
        if(saved){const pending=JSON.parse(saved);if(pending.key!==key){setRecovery({body:pending.body,target:pending.target});throw new Error('An earlier slot creation is unconfirmed. Reconcile it before creating another slot.');}mutation.current={key,requestId:pending.requestId};}
        else localStorage.setItem(receiptKey,JSON.stringify({...mutation.current,body,target}));
      }
      const url=action==='create'?'/api/v1/publisher/slots/managed':`/api/v1/publisher/slots/${target}/managed`;
      const response=await sessionFetch(url,{method:action==='create'?'POST':action==='retire'?'DELETE':'PATCH',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({...body,requestId:mutation.current!.requestId,...(action!=='create'?{expectedUpdatedAt:slot?.updatedAt}:{})})});
      const json=await response.json();if(!response.ok||!json.data?.id){if(receiptKey&&response.status>=400&&response.status<500)localStorage.removeItem(receiptKey);throw new Error(json.message||'The change could not be confirmed.');}
      if(receiptKey)localStorage.removeItem(receiptKey);setRecovery(null);
      mutation.current=null;setConfirmRetire(false);setNotice(action==='retire'?'Slot retired. Historical activity is retained.':'Saved.');
      if(action==='create')router.push(`${base}/${json.data.id}`);else await load();
    }catch(error){setError(error instanceof Error?error.message:'The change could not be confirmed.');}
    finally{lock.current=false;setBusy(false);}
  }
  async function getEmbed(){
    if(!slot)return;setBusy(true);setError('');
    try{const response=await sessionFetch(`/api/v1/publisher/slots/${slot.id}/embed`,{cache:'no-store'}),json=await response.json();if(!response.ok||!json.data)throw new Error(json.message||'Installation instructions unavailable.');setEmbed(json.data);}
    catch(error){setError(error instanceof Error?error.message:'Installation instructions unavailable.');}finally{setBusy(false);}
  }
  useEffect(()=>{if(mode==='detail'&&slot&&!slot.retiredAt&&!embed)void getEmbed();},[mode,slot?.id,slot?.retiredAt]);// eslint-disable-line react-hooks/exhaustive-deps
  async function copy(text:string){try{await navigator.clipboard.writeText(text);setNotice('Copied.');}catch{setError('Could not copy. Select and copy the code manually.');}}
  return <section className={styles.page}>
    <nav aria-label="Breadcrumb"><Link href={`/promoter/websites/${websiteId}`}>Website</Link> / <Link href={base}>Ad Slots</Link></nav>
    <header className={styles.header}><div><h1>{mode==='new'?'Create ad slot':mode==='detail'?slot?.name??'Ad slot':'Ad Slots'}</h1><p>Reusable placements for this website. Existing embed code stays unchanged.</p><p>Creating a saved slot produces a new tag. Replace an existing installation only when you intend to.</p></div>{mode==='list'&&<Button asChild><Link href={`${base}/new`}>Add ad slot</Link></Button>}</header>
    {error&&<div role="alert"><p>{error}</p><Button type="button" variant="outline" onClick={()=>void load()}>Reload slots</Button></div>}
    {notice&&<p role="status">{notice}</p>}
    {recovery&&<section><p>Unconfirmed creation: {String(recovery.body.name??'Ad slot')}</p><Button type="button" variant="outline" disabled={busy} onClick={()=>void mutate('create',recovery.body,recovery.target)}>Reconcile pending creation</Button></section>}
    {loading&&<p role="status">Loading ad slots…</p>}
    {mode==='list'&&<>
      <div className={styles.filters}><label>Search slots<Input value={query} onChange={event=>setQuery(event.target.value)} /></label><fieldset><legend>Show</legend><div className={styles.actions}>{['all','active','testing','paused','retired'].map(value=><Button key={value} type="button" variant={status===value?'default':'outline'} aria-pressed={status===value} onClick={()=>setStatus(value)}>{value==='all'?'Current slots':value}</Button>)}</div></fieldset></div>
      {!loading&&!error&&!filtered.length&&<p>No matching ad slots. Add a slot or change the filters.</p>}
      {!!filtered.length&&<div className={styles.table}><Table><TableHeader><TableRow><TableHead><button type="button" onClick={()=>setSort('name')}>Slot name</button></TableHead><TableHead>Mode / Ad Sizes</TableHead><TableHead>Lifecycle / installation</TableHead><TableHead><button type="button" onClick={()=>setSort('updatedAt')}>Updated</button></TableHead><TableHead>Action</TableHead></TableRow></TableHeader><TableBody>{filtered.map(item=><TableRow key={item.id}><TableCell><Link href={`${base}/${item.id}`}>{item.name}</Link></TableCell><TableCell>{item.slotType}<br/>{ids(item).length===0?'Dynamic Ad Slot':ids(item).length===1?'1 selected size':`${ids(item).length} selected sizes`}</TableCell><TableCell>{item.retiredAt?'Retired':item.lifecycleStatus}<br/>{item.installationStatus}</TableCell><TableCell>{new Date(item.updatedAt).toLocaleString()}</TableCell><TableCell><Link href={`${base}/${item.id}`}>Open</Link></TableCell></TableRow>)}</TableBody></Table></div>}
    </>}
    {mode==='new'&&!loading&&!error&&<SlotForm key={websiteId} busy={busy} onSave={values=>void mutate('create',{...values,websiteId})} />}
    {mode==='detail'&&!loading&&!error&&!slot&&<p>This ad slot is unavailable for this website.</p>}
    {mode==='detail'&&slot&&!error&&<>
      <p>{slot.retiredAt?'Retired':slot.lifecycleStatus} · Installation: {slot.installationStatus} · Review: {slot.manualReviewStatus??'not submitted'}</p>
      <p className={styles.identifier}>{slot.slotTagId}</p>
      {!slot.retiredAt&&<><SlotForm key={`${slot.id}:${slot.updatedAt}`} slot={slot} busy={busy} onSave={values=>void mutate('update',values)} />
        <div className={styles.actions}><Button type="button" variant="outline" disabled={busy||slot.lifecycleStatus==='suspended'} onClick={()=>void mutate('update',{lifecycleStatus:slot.lifecycleStatus==='paused'?'active':'paused'})}>{slot.lifecycleStatus==='paused'?'Resume':'Pause'}</Button>
          <Button type="button" variant="outline" disabled={busy} onClick={()=>void getEmbed()}>Installation instructions</Button>
          {slot.slotType==='network'&&<Button type="button" variant="outline" disabled={busy} onClick={()=>void mutate('create',{websiteId,name:`${slot.name} copy`.slice(0,150),slotType:'network',format:'general',allowedPresetIds:ids(slot),allowedAdTypes:['image'],responsive:true})}>Duplicate configuration</Button>}
          <Button type="button" variant="outline" disabled={busy||slot.lifecycleStatus==='suspended'} onClick={()=>setConfirmRetire(true)}>Retire slot</Button>
        </div>
      </>}
      {confirmRetire&&<section className={styles.confirm} aria-label="Confirm slot retirement"><h2>Retire this slot?</h2><p>Stops future delivery for this tag. Historical activity is retained. Create a new slot if you need another placement.</p><div className={styles.actions}><Button type="button" variant="destructive" disabled={busy} onClick={()=>void mutate('retire',{})}>Confirm retirement</Button><Button type="button" variant="outline" disabled={busy} onClick={()=>setConfirmRetire(false)}>Cancel</Button></div></section>}
      <HouseSizeSamples context="publisher" allowedPresets={ids(slot)} maxWidth={slot.width} maxHeight={slot.height} />
      {embed&&<section><h2>Installation</h2><p>Reuse this slot on pages of this website. Load the SDK once per page; different positions can have their own saved slot.</p>{(['sdkSnippet','slotSnippet','htmlSnippet','nextJsSnippet'] as const).filter(key=>embed[key]&&(key!=='htmlSnippet'||!embed.slotSnippet)).map(key=><div key={key}><h3>{key==='sdkSnippet'?'Page SDK':key==='nextJsSnippet'?'Next.js':'Slot markup'}</h3><Button type="button" variant="outline" onClick={()=>void copy(embed[key])}>Copy</Button><pre className={styles.code}>{embed[key]}</pre></div>)}</section>}
    </>}
  </section>;
}
function SlotForm({slot,busy,onSave}:{slot?:Slot;busy:boolean;onSave:(value:Record<string,unknown>)=>void}){
  const initial=ids(slot),[name,setName]=useState(slot?.name??''),[policy,setPolicy]=useState(initial.length===0?'dynamic':'selected'),[selected,setSelected]=useState(initial),[type,setType]=useState(slot?.slotType??'network');
    const [width,setWidth]=useState(slot?.width?.toString()??''),[height,setHeight]=useState(slot?.height?.toString()??'');
  const valid=name.trim().length>0&&name.trim().length<=150&&(policy==='dynamic'||selected.length>0);
  return <form className={styles.form} onSubmit={event=>{event.preventDefault();if(valid)onSave({name:name.trim(),...(!slot?{slotType:type,format:'general',allowedAdTypes:['image'],responsive:true}:{}),...(slot?{width:width?Number(width):null,height:height?Number(height):null}:{}),allowedPresetIds:policy==='dynamic'?[]:selected});}}>
    <label>Slot name<Input required maxLength={150} value={name} onChange={event=>setName(event.target.value)} /></label>
    {!slot&&<fieldset><legend>Inventory mode</legend><div className={styles.actions}>{[['network','CrimFig Ad Network'],['direct','AdStation Direct']].map(([value,label])=><Button key={value} type="button" variant={type===value?'default':'outline'} aria-pressed={type===value} onClick={()=>setType(value)}>{label}</Button>)}</div>{type==='direct'&&<p>Direct slots retain network-integration and manual-review requirements.</p>}</fieldset>}
    <fieldset><legend>Ad Sizes</legend><div className={styles.actions}>{[['dynamic','Dynamic Ad Slot'],['selected','Selected Sizes']].map(([value,label])=><Button key={value} type="button" variant={policy===value?'default':'outline'} aria-pressed={policy===value} onClick={()=>setPolicy(value)}>{label}</Button>)}</div><p>Dynamic accepts approved sizes that fit the available space. Selected Sizes lets you pick one or more sizes.</p></fieldset>
    {policy!=='dynamic'&&<fieldset><legend>Approved sizes</legend><div className={styles.sizes}>{presets.map(item=><label key={item.preset}><input type="checkbox" name="approved-size" checked={selected.includes(item.preset)} onChange={event=>setSelected(current=>event.target.checked?[...current,item.preset]:current.filter(id=>id!==item.preset))}/>{item.width} × {item.height}</label>)}</div></fieldset>}
    <p>Images available. Text ads and video ads are coming soon.</p>
    {slot&&<details><summary>Placement space limits</summary><p>Sizes are matched to saved placement limits. Without limits, ads may scale down to fit the page. Live selection from each visitor’s container dimensions is unavailable with the current embed.</p><div className={styles.sizes}><label>Maximum width (px, optional)<Input type="number" min={50} max={3840} value={width} onChange={event=>setWidth(event.target.value)}/></label><label>Maximum height (px, optional)<Input type="number" min={50} max={2160} value={height} onChange={event=>setHeight(event.target.value)}/></label></div></details>}
    <HouseSizeSamples context="publisher" allowedPresets={policy==='dynamic'?[]:selected} maxWidth={width?Number(width):null} maxHeight={height?Number(height):null} />
    <Button type="submit" disabled={busy||!valid}>{busy?'Saving…':slot?'Save settings':'Create ad slot'}</Button>
  </form>;
}
