'use client';
import {Archive,Code,Copy,Pause,Play} from "lucide-react";
import {ConsequentialConfirmDialog} from "./ConsequentialConfirmDialog";
import {useId,useCallback,useEffect,useRef,useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {sessionFetch,dashboardSession} from '../../lib/session';
import {Button} from '../ui/button';
import {Input} from '../ui/input';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '../ui/tabs';
import {Table,TableBody,TableCell,TableHead,TableHeader,TableRow} from '../ui/table';
import {HouseSizeSamples} from './HouseSizeSamples';
import {houseSampleCatalog} from '../../lib/house-samples';
import styles from './WebsiteAdSlots.module.css';

type Slot={id:string;websiteId:string;name:string;slotTagId:string;slotType:string;lifecycleStatus:string;installationStatus:string;width?:number|null;height?:number|null;
  allowedPresetIds:string|null;updatedAt:string;format:string;retiredAt?:string|null;allowedAdTypes?:string|null;manualReviewStatus?:string};
type Snapshot={websiteId:string;slotId?:string;slots:Slot[]};
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const presets=houseSampleCatalog.assets.filter(item=>item.family===houseSampleCatalog.families[0]);
function ids(slot?:Slot):string[]{try{const value=JSON.parse(slot?.allowedPresetIds??'[]');return Array.isArray(value)?value:[];}catch{return [];}}
export function WebsiteAdSlots({websiteId,slotId,mode='list'}:{websiteId:string;slotId?:string;mode?:'list'|'new'|'detail'}){
  const router=useRouter(),base=`/promoter/websites/${websiteId}/slots`;
  const [snapshot,setSnapshot]=useState<Snapshot|null>(null),[loading,setLoading]=useState(true),[error,setError]=useState(''),[query,setQuery]=useState(''),[status,setStatus]=useState('all'),[sort,setSort]=useState<'name'|'updatedAt'>('updatedAt');
  const [notice,setNotice]=useState(''),[busy,setBusy]=useState(false), [decision,setDecision]=useState<"pause"|"resume"|"duplicate"|"retire"|null>(null);
  const [installationOpen,setInstallationOpen]=useState(false);
  const installationId=useId();
  const installationHeading=useRef<HTMLHeadingElement>(null);
  const actionTrigger=useRef<HTMLButtonElement|null>(null);
  const [recovery,setRecovery]=useState<{body:Record<string,unknown>;target?:string}|null>(null);
  const sequence=useRef(0),lock=useRef(false),mutation=useRef<{key:string;requestId:string}|null>(null);
  const slots=snapshot?.websiteId===websiteId&&snapshot.slotId===slotId?snapshot.slots:[],slot=slots.find(item=>item.id===slotId);
  const load=useCallback(async()=>{
    const current=++sequence.current;setLoading(true);setError('');
    if(!uuid.test(websiteId)){setError('Invalid website reference.');setLoading(false);return;}
    try{
      const response=await sessionFetch(`/api/v1/publisher/websites/${websiteId}/slots`,{cache:'no-store'}),json=await response.json();
      if(!response.ok||!Array.isArray(json.data))throw new Error(json.message||'Ad slots could not be loaded.');
      if(current===sequence.current)setSnapshot({websiteId,slotId,slots:json.data});
    }catch(error){if(current===sequence.current)setError(error instanceof Error?error.message:'Ad slots unavailable.');}
    finally{if(current===sequence.current)setLoading(false);}
  },[websiteId,slotId]);
  useEffect(()=>{setNotice('');setDecision(null);setInstallationOpen(false);void load();return()=>{sequence.current++;};},[load]);
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
      mutation.current=null;setDecision(null);setNotice(action==='retire'?'Slot retired. Historical activity is retained.':'Saved.');
      if(action==='create')router.push(`${base}/${json.data.id}`);else await load();
    }catch(error){setDecision(null);setError(error instanceof Error?error.message:'The change could not be confirmed.');}
    finally{lock.current=false;setBusy(false);}
  }
  useEffect(()=>{
    if(installationOpen) installationHeading.current?.focus();
  },[installationOpen,slotId]);
  const paused=slot?.lifecycleStatus==='paused';
  const locked=busy||loading||slot?.lifecycleStatus==='suspended';
  async function confirmAction(){
    if(!slot||!decision)return;
    if(decision==='retire')return mutate('retire',{});
    if(decision==='duplicate')return mutate('create',{
      websiteId,name:(slot.name+' copy').slice(0,150),slotType:'network',format:'general',
      allowedPresetIds:ids(slot),allowedAdTypes:['image'],responsive:true,
    });
    return mutate('update',{lifecycleStatus:decision==='resume'?'active':'paused'});
  }
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
    {mode==='detail'&&slot&&<>
      <div className={styles.actions}>
        <p>{slot.retiredAt?'Retired':slot.lifecycleStatus} · Installation: {slot.installationStatus} · Review: {slot.manualReviewStatus??'not submitted'}</p>
        {!slot.retiredAt&&<Button type="button" variant="outline" disabled={locked} onClick={event=>{actionTrigger.current=event.currentTarget;setDecision(paused?'resume':'pause');}}>
          {paused?<Play size={16} aria-hidden="true"/>:<Pause size={16} aria-hidden="true"/>}{paused?'Resume':'Pause'}
        </Button>}
      </div>
      <p className={styles.identifier}>{slot.slotTagId}</p>
      {!slot.retiredAt&&<>
        <Button type="button" variant="outline" className={styles.installationTrigger} aria-expanded={installationOpen} aria-controls={installationId}
          onClick={()=>setInstallationOpen(open=>!open)}><Code size={16} aria-hidden="true"/>Installation instructions</Button>
        <div id={installationId} hidden={!installationOpen}>
          {installationOpen&&<>
            <h2 tabIndex={-1} ref={installationHeading}>Installation instructions</h2>
            <SlotInstallation key={slot.id} slotId={slot.id} />
          </>}
        </div>
        <SlotForm key={slot.id+':'+slot.updatedAt} slot={slot} busy={busy} onSave={values=>void mutate('update',values)} />
        <section className={styles.confirm} aria-label="Manage slot">
          <h2>Manage slot</h2>
          <div className={styles.actions}>
            {slot.slotType==='network'&&<Button type="button" variant="outline" disabled={busy||loading} onClick={event=>{actionTrigger.current=event.currentTarget;setDecision('duplicate');}}><Copy size={16} aria-hidden="true"/>Duplicate configuration</Button>}
            <Button type="button" variant="destructive" disabled={locked} onClick={event=>{actionTrigger.current=event.currentTarget;setDecision('retire');}}><Archive size={16} aria-hidden="true"/>Retire slot</Button>
          </div>
        </section>
        {decision&&<ConsequentialConfirmDialog open onOpenChange={open=>{if(!open){setDecision(null);setTimeout(()=>actionTrigger.current?.focus(),0);}}}
          title={decision==='duplicate'?'Duplicate configuration':decision==='retire'?'Retire slot':decision==='resume'?'Resume delivery':'Pause delivery'}
          description={<><strong>{slot.name}</strong>{decision==='duplicate'
            ? ' will remain unchanged. The copy uses its approved size selections, with a new tag and no existing installation or history.'
            : decision==='retire'?' will permanently stop serving ads on its installed tag. Historical activity is retained.'
            : decision==='resume'?' can serve ads again when it meets delivery requirements.'
            : ' will temporarily stop serving ads on its installed tag.'}</>}
          confirmLabel={decision==='duplicate'?'Create slot copy':decision==='retire'?'Confirm retirement':decision==='resume'?'Resume delivery':'Pause delivery'}
          confirmVariant={decision==='retire'?'destructive':'default'} isPending={busy} onConfirm={confirmAction} />}
      </>}
      <HouseSizeSamples context="publisher" allowedPresets={ids(slot)} maxWidth={slot.width} maxHeight={slot.height} />
    </>}
  </section>;
}

type SlotEmbed = {
  sdkSnippet?: string;
  slotSnippet?: string;
  htmlSnippet?: string;
  nextJsSnippet?: string;
  consentInstructions?: string;
};

function SlotInstallation({slotId}: {slotId: string}) {
  const [embed, setEmbed] = useState<SlotEmbed | null>(null);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    async function loadEmbed() {
      try {
        const response = await sessionFetch(`/api/v1/publisher/slots/${slotId}/embed`, {
          cache: 'no-store',
          signal: controller.signal,
        });
        const json = await response.json();
        if (!response.ok || !json.data) {
          throw new Error(json.message || 'Installation instructions unavailable.');
        }
        if (!controller.signal.aborted) setEmbed(json.data);
      } catch (reason) {
        if (!controller.signal.aborted) {
          setError(reason instanceof Error ? reason.message : 'Installation instructions unavailable.');
        }
      }
    }
    void loadEmbed();
    return () => controller.abort();
  }, [slotId, attempt]);

  const combinedHtml = embed?.sdkSnippet && embed.slotSnippet ? undefined : embed?.htmlSnippet;

  return <section className={styles.installation}>
    {error && <div>
      <p role="alert">{error}</p>
      <Button type="button" variant="outline" onClick={() => {
        setError('');
        setAttempt(current => current + 1);
      }}>Retry installation instructions</Button>
    </div>}
    {!embed && !error && <p role="status">Loading installation instructions…</p>}
    {embed && <Tabs defaultValue="html">
      <TabsList aria-label="Installation format" className={styles.installationTabs}>
        <TabsTrigger value="html">HTML</TabsTrigger>
        <TabsTrigger value="react">React / Next.js</TabsTrigger>
        <TabsTrigger value="wordpress" disabled>WordPress (Coming soon)</TabsTrigger>
      </TabsList>
      <TabsContent value="html">
        <p>Load the SDK once per page. Place the slot markup where you want the ad to appear.</p>
        {combinedHtml ? <InstallationSnippet label="HTML installation" code={combinedHtml} /> : <>
          {embed.sdkSnippet ? <InstallationSnippet label="Page SDK" code={embed.sdkSnippet} /> : <p>Page SDK snippet unavailable.</p>}
          {embed.slotSnippet ? <InstallationSnippet label="Slot markup" code={embed.slotSnippet} /> : <p>Slot markup snippet unavailable.</p>}
        </>}
        {embed.consentInstructions && <p>{embed.consentInstructions}</p>}
      </TabsContent>
      <TabsContent value="react">
        {embed.nextJsSnippet ? <>
          <p>Use this example with your application's existing CrimFigAdSlot component. Pass your visitor's measurement consent choice before mounting.</p>
          <InstallationSnippet label="React / Next.js snippet" code={embed.nextJsSnippet} />
        </> : <p>React / Next.js snippet unavailable.</p>}
      </TabsContent>
    </Tabs>}
  </section>;
}

function InstallationSnippet({label, code}: {label: string; code: string}) {
  const [message, setMessage] = useState('');

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setMessage('Copied.');
    } catch {
      setMessage('Could not copy. Select and copy the code manually.');
    }
  }

  return <div>
    <h3>{label}</h3>
    <Button type="button" variant="outline" aria-label={`Copy ${label}`} onClick={() => void copy()}>Copy</Button>
    <pre className={styles.code}><code>{code}</code></pre>
    <p role="status">{message}</p>
  </div>;
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
