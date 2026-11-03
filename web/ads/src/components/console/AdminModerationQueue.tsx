'use client';
import { CampaignReadiness } from './DeliveryReadinessPanel';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { RefreshCw, FileImage, X } from 'lucide-react';
import { MediaPreview } from '../MediaPreview';
import { sessionFetch, dashboardSession } from '../../lib/session';
import { adsApi } from '../../lib/ads-api-client';
import { ApiError } from '@crimfig/api-client';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table,TableHeader,TableBody,TableRow,TableHead,TableCell } from '../ui/table';
import {amount,dimensions,fieldValue,humanLabel} from '../../lib/admin-format';
import {ModerationClaimPanel} from './ModerationClaimPanel';
import { ModerationReviewDialog } from './ModerationReviewDialog';

type Kind = 'creative' | 'stack' | 'campaign';
type Stage = 'reviewer' | 'manager';
type Queue = Awaited<ReturnType<ReturnType<typeof adsApi>['queue']>>;
type Summary = Awaited<ReturnType<ReturnType<typeof adsApi>['moderationSummary']>>;
type Detail = Awaited<ReturnType<ReturnType<typeof adsApi>['moderationDetail']>>;
type Form = Parameters<React.ComponentProps<typeof ModerationReviewDialog>['onSubmit']>[0];
type Intent = { key:string; id:string; form:Form; detail:Detail; stage:Stage };
function assertReviewReceipt(result:unknown,intent:Intent){
  if(!result || typeof result!=='object')throw new Error('Review receipt binding is unavailable.');
  const receipt=result as Record<string,unknown>;
  const decision=receipt.decision && typeof receipt.decision==='object'?receipt.decision as Record<string,unknown>:{};
  const campaign=receipt.campaign && typeof receipt.campaign==='object'?receipt.campaign as Record<string,unknown>:{};
  const stage=intent.stage==='reviewer'?'primary':'manager';
  if(receipt.targetId!==intent.detail.targetId || receipt.targetType!==intent.detail.targetType || receipt.stage!==stage || campaign.id!==intent.detail.campaign.id ||
    decision.targetId!==intent.detail.targetId || decision.targetType!==intent.detail.targetType || decision.stage!==stage || decision.requestId!==intent.id ||
    decision.submissionId!==intent.detail.submissionId || decision.contentRevision!==intent.detail.contentRevision || decision.decision!==intent.form.decision)
    throw new Error('Review receipt does not match the original decision. Its outcome remains unconfirmed.');
}
const kinds = ['creative','stack','campaign'] as const;
const headingStyle={fontSize:'.8125rem',textTransform:'none' as const,letterSpacing:'normal'};
const labels = {creative:'Ads',stack:'Ad Stacks',campaign:'Campaigns'};
const plural = {creative:'creatives',stack:'stacks',campaign:'campaigns'} as const;
const uuid = /^[a-f0-9]{8}-[a-f0-9]{4}-[1-8][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i;
const message = (err:unknown) => err instanceof Error ? err.message : 'Request unavailable. Try again.';
const title = (row:Record<string,unknown>) => String(row.title || row.name || row.headline || 'Untitled item');
const display = (value:unknown):string => value === null || value === undefined ? 'Not supplied' : typeof value === 'object' ? JSON.stringify(value,null,2) : String(value);
function age(start:unknown,asOf:unknown,floor?:unknown){const time=typeof start==='string'?Date.parse(start):NaN,now=typeof asOf==='string'?Date.parse(asOf):NaN,min=floor===undefined?time:typeof floor==='string'?Date.parse(floor):NaN;if(!Number.isFinite(time)||!Number.isFinite(now)||!Number.isFinite(min)||time>now||time<min)return 'Unavailable';const minutes=Math.floor((now-time)/60000);return `${Math.floor(minutes/60)}h ${minutes%60}m`;}
function clockTime(row:Record<string,unknown>,key:string){return row.reviewClock&&typeof row.reviewClock==='object'?(row.reviewClock as Record<string,unknown>)[key]:null;}
function safeDestination(value:unknown){try{const url=new URL(String(value));return ['https:','http:'].includes(url.protocol)&&!url.username&&!url.password?url.href:null;}catch{return null;}}
function Fields({value}:{value:Record<string,unknown>}) {return <dl className="cf-mod-fields">{Object.entries(value).filter(([key])=>!/(?:^id$|Id$|Ids$|revision|hash|fingerprint)/i.test(key)).map(([key,value])=><div key={key}><dt>{humanLabel(key.replace(/UsdCents$/,''))}</dt><dd>{fieldValue(key,value)}</dd></div>)}</dl>;}
function Technical({value}:{value:unknown}){return <details className="cf-technical cf-dialog-section"><summary>Technical &amp; audit details</summary><pre>{JSON.stringify(value,null,2)}</pre></details>;}

export function AdminModerationQueue(_props:{apiBase:string}) {
  const [summary,setSummary]=useState<Summary|null>(null);
  const [summaryError,setSummaryError]=useState('');
  const summaryGeneration=useRef(0);
  const [queue,setQueue] = useState<Queue|null>(null);
  const [stage,setStage] = useState<Stage>('reviewer');
  const [kind,setKind] = useState<Kind>('creative');
  const [page,setPage] = useState(1);
  const [actorId,setActorId]=useState('');
  const [roles,setRoles] = useState<string[]>([]);
  const [authority,setAuthority] = useState('loading');
  const [error,setError] = useState('');
  const [notice,setNotice] = useState('');
  const [loading,setLoading] = useState(false);
  const [queueContext,setQueueContext]=useState('');
  const [revalidating,setRevalidating]=useState(false),[workspaceRevision,setWorkspaceRevision]=useState(0);
  const currentContext=`${actorId}:${stage}:${kind}:${page}`;
  const fresh=authority==='ready'&&queueContext===currentContext&&!loading&&!revalidating&&!error;
  const [selection,setSelection] = useState<{type:Kind;id:string}|null>(null);
  const [detail,setDetail] = useState<Detail|null>(null);
  const [detailPage,setDetailPage] = useState(1);
  const [detailError,setDetailError] = useState('');
  const [reviewing,setReviewing] = useState(false);
  const [uncertain,setUncertain] = useState<Intent|null>(null);
  const [writing,setWriting] = useState(false);
  const queueGeneration=useRef(0), detailGeneration=useRef(0), roleGeneration=useRef(0);
  const intent=useRef<Intent|null>(null), busy=useRef(false), alive=useRef(true);
  const reviewAfterLoad=useRef(false), opener=useRef<HTMLElement|null>(null);
  const reloadRoles = useCallback(async (preserve=false) => {
    const generation=++roleGeneration.current;
    ++queueGeneration.current; ++detailGeneration.current;
    setError('');setReviewing(false);if(preserve)setRevalidating(true);else{setAuthority('loading');setActorId('');setRoles([]);setQueue(null);setSummary(null);setDetail(null);}
    try {
      const res=await sessionFetch('/api/v1/ecosystem/staff-status');
      if (!res.ok) throw new Error(res.status===401 ? 'Session expired. Sign in again.' : res.status===403 ? 'Ads staff access denied.' : 'Ads staff authority unavailable.');
      const body=await res.json(); const data=body?.data;
      if (!data || !Array.isArray(data.roles) || data.roles.some((r:unknown)=>typeof r!=='string') || typeof data.userId!=='string' || typeof data.isStaff!=='boolean') throw new Error('Ads staff authority unavailable.');
      if (!alive.current || generation!==roleGeneration.current) return;
      const permitted=data.isStaff && data.roles.some((r:string)=>['ads_reviewer','ads_manager','ads_admin','super_admin','ads_support'].includes(r));
      setActorId(data.userId);setRoles(data.roles);setAuthority(permitted?'ready':'denied');if(preserve)setWorkspaceRevision(value=>value+1);
    } catch(err) {if(alive.current && generation===roleGeneration.current){setAuthority('unavailable');setError(message(err));}}finally{if(alive.current&&generation===roleGeneration.current)setRevalidating(false);}
  },[]);
  useEffect(()=>{
    alive.current=true;void reloadRoles();const session=dashboardSession();let version=session.getSnapshot().identityVersion;
    const unsubscribe=session.subscribe(snapshot=>{
      if(snapshot.signOut || snapshot.status==='anonymous') {intent.current=null;setUncertain(null);setNotice('');++queueGeneration.current;++detailGeneration.current;++roleGeneration.current;setRoles([]);setQueue(null);setDetail(null);setSelection(null);setReviewing(false);setAuthority('denied');return;}
      if(snapshot.identityVersion!==version){intent.current=null;setUncertain(null);setNotice('');version=snapshot.identityVersion;void reloadRoles();}
    });
    return()=>{alive.current=false;++roleGeneration.current;++queueGeneration.current;++detailGeneration.current;unsubscribe();};
  },[reloadRoles]);
  const fetchQueue=useCallback(async()=>{
    const generation=++queueGeneration.current;
    setLoading(true);setError('');
    try {const result=await adsApi().queue(stage,page);if(alive.current && generation===queueGeneration.current){setQueue(result);setQueueContext(currentContext);if(page>1&&result[plural[kind]].length===0)setPage(value=>Math.max(1,value-1));}}
    catch(err){if(alive.current && generation===queueGeneration.current)setError(err instanceof ApiError && err.status===401?'Session expired. Sign in again.':err instanceof ApiError && err.status===403?'Ads staff access denied.':message(err));}
    finally{if(alive.current && generation===queueGeneration.current)setLoading(false);}
  },[stage,page,kind,currentContext,workspaceRevision]);
  useEffect(()=>{if(authority==='ready')void fetchQueue();},[authority,fetchQueue]);
  useEffect(()=>{
    const generation=++summaryGeneration.current;setSummaryError('');
    if(authority!=='ready'||!queue||queueContext!==currentContext){setSummary(null);return;}
    void adsApi().moderationSummary(kind).then(result=>{if(alive.current && generation===summaryGeneration.current)setSummary(result);}).catch(()=>{if(alive.current && generation===summaryGeneration.current)setSummaryError('Backlog summary unavailable. Queue rows remain available.');});
    return()=>{++summaryGeneration.current;};
  },[authority,kind,queue,workspaceRevision,queueContext,currentContext]);
  useEffect(()=>{
    const read=()=>{if(busy.current||intent.current)return;setReviewing(false);setDetail(null);const params=new URLSearchParams(window.location.search);const type=params.get('itemType'),id=params.get('itemId');setSelection(kinds.includes(type as Kind)&&uuid.test(id||'')?{type:type as Kind,id:id!}:null);const queueType=params.get('queueType');if(kinds.includes(queueType as Kind))setKind(queueType as Kind);else if(kinds.includes(type as Kind))setKind(type as Kind);const requestedPage=Number(params.get('page')||1);if(Number.isSafeInteger(requestedPage)&&requestedPage>=1&&requestedPage<=4000)setPage(requestedPage);const selectedStage=params.get('stage');if(selectedStage==='manager'||selectedStage==='reviewer')setStage(selectedStage);};
    read();window.addEventListener('popstate',read);return()=>window.removeEventListener('popstate',read);
  },[]);
  useEffect(()=>{
    const generation=++detailGeneration.current;setDetail(null);setDetailError('');
    if(!selection || authority!=='ready')return;
    void adsApi().moderationDetail(selection.type,selection.id,detailPage).then(result=>{if(alive.current && generation===detailGeneration.current){setDetail(result);if(reviewAfterLoad.current && result.capabilities[stage].allowed)setReviewing(true);reviewAfterLoad.current=false;}}).catch(err=>{if(alive.current && generation===detailGeneration.current)setDetailError(message(err));});
    return()=>{++detailGeneration.current;};
  },[selection,detailPage,authority,stage,workspaceRevision]);
  function open(type:Kind,id:string,beginReview=false){
    if(busy.current||uncertain||!fresh)return;
    setDetail(null);setDetailError('');reviewAfterLoad.current=beginReview;if(!selection)opener.current=document.activeElement instanceof HTMLElement?document.activeElement:null;
    const url=new URL(window.location.href);url.searchParams.set('itemType',type);url.searchParams.set('itemId',id);url.searchParams.set('stage',stage);url.searchParams.set('queueType',kind);url.searchParams.set('page',String(page));
    window.history.pushState(null,'',url);setDetailPage(1);setSelection({type,id});setReviewing(false);
  }
  function close(){if(busy.current||uncertain)return;const url=new URL(window.location.href);url.searchParams.delete('itemType');url.searchParams.delete('itemId');window.history.replaceState(null,'',url);setSelection(null);setReviewing(false);}
  async function apply(saved:Intent){
    const d=saved.detail;
    const payload={...saved.form,expectedRevision:d.contentRevision!,submissionId:d.submissionId!,requestId:saved.id};
    const api=adsApi();return d.targetType==='campaign'?api.reviewCampaign(d.targetId,saved.stage,payload):d.targetType==='stack'?api.reviewStack(d.targetId,saved.stage,payload):api.reviewCreative(d.targetId,saved.stage,payload);
  }
  async function confirm(form:Form){
    if(busy.current)throw new Error('A review is already in progress.');
    if(!fresh)throw new Error('Refresh the current submission before reviewing.');
    if(!detail || !detail.submissionId || !Number.isSafeInteger(detail.contentRevision) || !detail.capabilities[stage].allowed)throw new Error('Inspect a current authorized submission before reviewing.');
    const key=JSON.stringify([detail.targetType,detail.targetId,detail.submissionId,detail.contentRevision,stage,form]);
    if(intent.current && intent.current.key!==key)throw new Error('Resolve the previous review outcome before changing this decision.');
    const saved=intent.current || {key,id:crypto.randomUUID(),form,detail,stage};intent.current=saved;
    const permissionGeneration=roleGeneration.current;
    busy.current=true;setWriting(true);
    try {
      if(uncertain)throw new Error('Use Check outcome or Retry same decision before changing this review.');
      const receipt=await apply(saved);
      if(!alive.current || permissionGeneration!==roleGeneration.current)return;
      assertReviewReceipt(receipt,saved);
      const campaignState=receipt.campaign;
      const lifecycle=campaignState && typeof campaignState==='object' && 'status' in campaignState && typeof campaignState.status==='string' ? campaignState.status : 'unavailable';
      setNotice(`Decision recorded: ${receipt.decision.decision}. Campaign state: ${lifecycle}.`);
      intent.current=null;setUncertain(null);setReviewing(false);setDetail(null);setSelection(null);
      const url=new URL(window.location.href);url.searchParams.delete('itemType');url.searchParams.delete('itemId');window.history.replaceState(null,'',url);
      void fetchQueue();
    } catch(err){
      if(!alive.current || permissionGeneration!==roleGeneration.current)return;
      // A transport/server failure may follow a committed write. Preserve exact payload + UUID.
      if(!(err instanceof ApiError) || err.outcome==='unknown' || !err.status || err.status>=500){setUncertain(saved);setReviewing(false);setSelection(null);}
      else {intent.current=null;if(err.status===409){setDetail(null);setReviewing(false);setDetailError('Submission changed. Close and inspect the current details before reviewing.');}}
      throw err;
    } finally{busy.current=false;if(alive.current)setWriting(false);}
  }
  async function reconcile(retry=false){
    if(!uncertain || busy.current)return;const saved=uncertain;const permissionGeneration=roleGeneration.current;busy.current=true;setWriting(true);
    try {
      const result=retry?await apply(uncertain):(await adsApi().reviewReceipt(uncertain.detail.campaign.id,uncertain.id)).result;
      if(!alive.current || permissionGeneration!==roleGeneration.current)return;
      assertReviewReceipt(result,saved);
      setNotice(`Decision confirmed: ${result.decision.decision}. Check refreshed lifecycle status before assuming delivery is live.`);
      intent.current=null;setUncertain(null);setReviewing(false);setSelection(null);setDetail(null);void fetchQueue();
    }catch(err){if(!alive.current || permissionGeneration!==roleGeneration.current)return;setNotice(`Outcome not confirmed: ${message(err)} The original request ID is retained.`);}finally{busy.current=false;if(alive.current)setWriting(false);}
  }
  async function refreshWorkspace(){
    if(busy.current)return;
    if(uncertain)await reconcile();
    // Authority refresh invalidates pending queue/detail reads and retriggers all workspace reads.
    // It preserves any unresolved decision identity; no decision POST is made here.
    await reloadRoles(true);
  }
  const canRole=roles.some(r=>['ads_admin','super_admin',stage==='reviewer'?'ads_reviewer':'ads_manager'].includes(r));
  const rows=((queueContext===currentContext?queue?.[plural[kind]]:null) || []) as Record<string,unknown>[];
  return <section className="cf-moderation cf-admin-ui" aria-label="Moderation queue">
    <header className="cf-mod-toolbar"><div><p className="cf-mod-eyebrow">Compliance & moderation</p><h1 className="cf-page-title">Moderation</h1><p>Inspect submitted content, then record the permitted review.</p></div><Button data-moderation-refresh variant="outline" disabled={loading||revalidating||writing} onClick={()=>void refreshWorkspace()}><RefreshCw size={16}/> Refresh</Button></header>
    <div className="cf-mod-toolbar" aria-label="Review stage">{(['reviewer','manager'] as const).map((value,i)=><Button key={value} variant={stage===value?'default':'outline'} aria-pressed={stage===value} disabled={writing||!!uncertain} onClick={()=>{setStage(value);setPage(1);setReviewing(false);}}>Review {i+1} ({i===0?'Primary':'Manager Approval'})</Button>)}</div>
    {notice&&<p role="status">{notice}</p>}
    {uncertain&&<aside role="alert"><p>Decision outcome unconfirmed. Request: {uncertain.id}. Do not create another decision.</p><Button disabled={writing} onClick={()=>void reconcile()}>Check outcome</Button> <Button variant="outline" disabled={writing} onClick={()=>void reconcile(true)}>Retry same decision</Button></aside>}
    {authority==='loading'&&<p role="status">Checking Ads staff permissions…</p>}
    {authority==='denied'&&<p role="alert">Ads staff access denied. No review actions are authorized.</p>}
    {error&&<p role="alert">{error}</p>}
    {authority==='ready'&&<>
      <aside className="cf-mod-summary" aria-label="Moderation backlog summary">
        <p className="cf-mod-meta">{labels[kind]} · All pending pages · Counts are moderation work items</p>
        {summaryError?<p role="status">{summaryError}</p>:!summary?<p role="status">Loading backlog summary…</p>:<>
          <div className="cf-mod-toolbar"><Button variant="outline" disabled={writing||!!uncertain} onClick={()=>{setStage('reviewer');setPage(1);}}>Review 1 pending: {summary.reviewerCount}</Button><Button variant="outline" disabled={writing||!!uncertain} onClick={()=>{setStage('manager');setPage(1);}}>Review 2 pending: {summary.managerCount}</Button><span>{summary.submissionCount} distinct submissions</span></div>
          <p>Oldest known submission: {summary.oldestSubmittedAt?`${age(summary.oldestSubmittedAt,summary.asOf)} (${new Date(summary.oldestSubmittedAt).toISOString()})`:summary.reviewerCount+summary.managerCount===0?'No pending submissions':'Unavailable (no valid timestamp)'}{summary.unknownAgeCount>0?` · ${summary.unknownAgeCount} items have unavailable age`:''}</p>
          <p className="cf-mod-meta">As of {summary.asOf} · UTC · Target not configured · Overdue count unavailable</p>
        </>}
      </aside>
      <div className="cf-mod-tabs" aria-label="Item type">{kinds.map(type=><Button key={type} variant={type===kind?'default':'outline'} aria-pressed={type===kind} disabled={writing||!!uncertain} onClick={()=>{setKind(type);setPage(1);}}>{labels[type]}</Button>)}</div>
      {loading&&<p role="status">{queueContext===currentContext?'Updating this queue; previous rows are read-only.':'Loading the current review stage.'}</p>}{queueContext!==currentContext?<div className="cf-mod-skeleton" aria-label="Loading queue"><div/><div/><div/></div>:<>
        <p className="cf-mod-meta">{rows.length} {labels[kind].toLowerCase()} loaded on page {page}. Counts describe this page, not the entire backlog.</p>
<div className="cf-mod-desktop" aria-busy={loading}><Table className="cf-data-table" style={{fontSize:'.875rem'}} aria-label={`${labels[kind]} awaiting review`}><TableHeader><TableRow><TableHead scope="col" style={headingStyle}>{labels[kind]} / stage</TableHead><TableHead scope="col" style={headingStyle}>{kind==='campaign'?'Budget':kind==='stack'?'Parent & delivery':'Format & dimensions'}</TableHead><TableHead scope="col" style={headingStyle}>Actions</TableHead></TableRow></TableHeader><TableBody>{rows.map(row=><TableRow key={String(row.id)}><TableCell><div className="cf-mod-identity">
            {kind==='creative'&&<button disabled={!fresh} className="cf-mod-preview" aria-label={`View preview and details for ${title(row)}`} onClick={()=>open(kind,String(row.id))}>{typeof row.imageUrl==='string'?<MediaPreview source={row.imageUrl} mode="review"/>:<FileImage size={24}/>}</button>}
            <div><button disabled={!fresh} className="cf-mod-title" onClick={()=>open(kind,String(row.id))}>{title(row)}</button><p className="cf-mod-meta">Revision {typeof row.contentRevision==='number'?row.contentRevision:'unavailable'} · {String(row.id)}</p>
              {kind==='campaign'&&<p className="cf-mod-meta">Advertiser: {typeof row.advertiserName==='string'?row.advertiserName:'See technical details'}</p>}{kind==='campaign'&&<p className="cf-mod-meta">Ad approvals: {typeof row.approvedCreativesCount==='number'&&typeof row.totalCreativesCount==='number'?`${row.approvedCreativesCount} / ${row.totalCreativesCount}`:'unavailable'}</p>}
              <Badge variant="outline">{fieldValue('reviewStatus',row.reviewStatus || row.moderationStatus)}</Badge><p className="cf-mod-meta">Submission age: {age(clockTime(row,'submittedAt'),queue?.asOf)} · Review {stage==='reviewer'?1:2} wait: {age(clockTime(row,'stageStartedAt'),queue?.asOf,clockTime(row,'submittedAt'))} · Target not configured</p></div>
          </div>
          </TableCell><TableCell>{kind==='campaign'?<span className="cf-numeric">{amount(row.budgetUsdCents,'USD')}</span>:kind==='stack'?<><p>{typeof row.campaignTitle==='string'?row.campaignTitle:'Parent campaign in details'}</p><p>{fieldValue('schedule',row.schedule)}</p></>:<><p>{fieldValue('adFormat',row.adFormat)}</p><p>{dimensions(row.width??(row.imageSpecs as Record<string,unknown>|undefined)?.width,row.height??(row.imageSpecs as Record<string,unknown>|undefined)?.height)}</p></>}</TableCell><TableCell><div className="cf-mod-actions"><Button variant="outline" disabled={!fresh||writing||!!uncertain} onClick={()=>open(kind,String(row.id))}>View details</Button><Button disabled={!fresh||!canRole||writing||!!uncertain||!row.submissionId||!Number.isSafeInteger(row.contentRevision)} onClick={()=>open(kind,String(row.id),true)}>Review {stage==='reviewer'?1:2}</Button>{!canRole?<p>Your Ads staff role cannot perform this review.</p>:(!row.submissionId||!Number.isSafeInteger(row.contentRevision))&&<p>Review metadata unavailable. Open details to inspect the current submission.</p>}</div>
        </TableCell></TableRow>)}</TableBody></Table></div>        <div className="cf-mod-list cf-mod-mobile">{rows.map(row=><article className="cf-mod-row" key={String(row.id)}>
          <div className="cf-mod-identity">
            {kind==='creative'&&<button disabled={!fresh} className="cf-mod-preview" aria-label={`View preview and details for ${title(row)}`} onClick={()=>open(kind,String(row.id))}>{typeof row.imageUrl==='string'?<MediaPreview source={row.imageUrl} mode="review"/>:<FileImage size={24}/>}</button>}
            <div><button disabled={!fresh} className="cf-mod-title" onClick={()=>open(kind,String(row.id))}>{title(row)}</button><p className="cf-mod-meta">Revision {typeof row.contentRevision==='number'?row.contentRevision:'unavailable'} · {String(row.id)}</p>
              {kind==='campaign'&&<p className="cf-mod-meta">Advertiser: {typeof row.advertiserName==='string'?row.advertiserName:'See technical details'}</p>}{kind==='campaign'&&<p className="cf-mod-meta">Ad approvals: {typeof row.approvedCreativesCount==='number'&&typeof row.totalCreativesCount==='number'?`${row.approvedCreativesCount} / ${row.totalCreativesCount}`:'unavailable'}</p>}
              <Badge variant="outline">{fieldValue('reviewStatus',row.reviewStatus || row.moderationStatus)}</Badge><p className="cf-mod-meta">Submission age: {age(clockTime(row,'submittedAt'),queue?.asOf)} · Review {stage==='reviewer'?1:2} wait: {age(clockTime(row,'stageStartedAt'),queue?.asOf,clockTime(row,'submittedAt'))} · Target not configured</p></div>
          </div>
          <div className="cf-mod-actions"><Button variant="outline" disabled={!fresh||writing||!!uncertain} onClick={()=>open(kind,String(row.id))}>View details</Button><Button disabled={!fresh||!canRole||writing||!!uncertain||!row.submissionId||!Number.isSafeInteger(row.contentRevision)} onClick={()=>open(kind,String(row.id),true)}>Review {stage==='reviewer'?1:2}</Button>{!canRole?<p>Your Ads staff role cannot perform this review.</p>:(!row.submissionId||!Number.isSafeInteger(row.contentRevision))&&<p>Review metadata unavailable. Open details to inspect the current submission.</p>}</div>
        </article>)}</div>
        {queue&&rows.length===0&&<p>No items on this page for the selected review stage.</p>}
        <nav className="cf-mod-toolbar" aria-label="Queue pagination"><Button variant="outline" disabled={page===1||writing||!!uncertain} onClick={()=>setPage(p=>p-1)}>Previous</Button><span>Page {page}</span><Button variant="outline" disabled={!queue?.hasMore?.[plural[kind]]||writing||!!uncertain} onClick={()=>setPage(p=>p+1)}>Next</Button></nav>
      </>}
    </>}
    <Dialog.Root open={!!selection} onOpenChange={value=>{if(!value)close();}}><Dialog.Portal><Dialog.Overlay className="cf-report-overlay"/><Dialog.Content className="cf-report-dialog cf-mod-detail cf-admin-ui" onCloseAutoFocus={event=>{event.preventDefault();if(opener.current?.isConnected)opener.current.focus();else document.querySelector<HTMLButtonElement>('[data-moderation-refresh]')?.focus();}} onEscapeKeyDown={e=>{if(writing||uncertain)e.preventDefault();}} onPointerDownOutside={e=>{if(writing||uncertain)e.preventDefault();}}>
      <header className="cf-mod-toolbar"><div><Dialog.Title>Submitted item details</Dialog.Title><Dialog.Description>Read-only evidence. Previewing does not serve an ad or record delivery events.</Dialog.Description></div><Button variant="outline" aria-label="Close details" disabled={writing||!!uncertain} onClick={close}><X size={18}/></Button></header>
      {!reviewing&&(detailError?<p role="alert">{detailError}</p>:!detail?<p role="status">Loading authorized details…</p>:<>
        <h2>{title(detail.item)}</h2><Button variant="outline" onClick={()=>void navigator.clipboard.writeText(detail.targetId).catch(()=>setDetailError('Could not copy ID. Select the ID text to copy manually.'))}>Copy item ID</Button><p className="cf-muted">Immutable submission; revision {detail.contentRevision??'Unavailable'}</p>
        {detail.targetType==='campaign'&&<p>Review 2 approval activates this campaign if the server accepts its current prerequisites.</p>}{detail.content&&<><h3>Ad content</h3>{typeof detail.content?.destinationUrl==='string'&&safeDestination(detail.content.destinationUrl)&&<p><a href={safeDestination(detail.content.destinationUrl)!} target="_blank" rel="noopener noreferrer">Open advertiser destination (new tab)</a></p>}{typeof detail.content.imageUrl==='string'&&<MediaPreview source={detail.content.imageUrl} mode="review"/>}{typeof detail.content.videoUrl==='string'&&<MediaPreview source={detail.content.videoUrl} mode="review"/>}<Fields value={Object.fromEntries(Object.entries(detail.content).filter(([key])=>['title','name','headline','bodyText','ctaText','destinationUrl','adType','adFormat','imageSpecs','mediaFormat','schedule','geoMode','targetDevices'].includes(key)))}/><Technical value={detail.content}/></>}
        <ModerationClaimPanel key={`${detail.targetType}:${detail.targetId}:${detail.submissionId}:${detail.contentRevision}:${stage}:${actorId}`} type={detail.targetType} id={detail.targetId} submissionId={detail.submissionId} revision={detail.contentRevision} stage={stage} actorId={actorId} canReview={fresh&&detail.capabilities[stage].allowed} isAdmin={roles.some(role=>['ads_admin','super_admin'].includes(role))}/>
        <h3>Current item & review state</h3><Fields value={Object.fromEntries(Object.entries(detail.item).filter(([key])=>['status','reviewStatus','moderationStatus','primaryReviewerId','primaryReviewedAt','managerReviewerId','managerReviewedAt','rejectionReason'].includes(key)))}/><Technical value={{item:detail.item,campaign:detail.campaign,submissionId:detail.submissionId,revision:detail.contentRevision,history:detail.history,targets:detail.targets,children:detail.children}}/>
        <details><summary>Paid delivery readiness</summary><CampaignReadiness key={detail.campaign.id} campaignId={detail.campaign.id} staff /></details><h3>Parent campaign</h3><p>{detail.campaign.title} · {detail.campaign.status} · {detail.campaign.moderationStatus}</p><p>Budget: {typeof detail.campaign.budgetUsdCents==='number'?new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(detail.campaign.budgetUsdCents/100):'Unavailable'} · Pricing: {detail.campaign.pricingModel||'Unavailable'}</p>{detail.targetType!=='creative'&&<p>Approved active ads: {detail.creativeProgress?.approved??'Unavailable'} / {detail.creativeProgress?.total??'Unavailable'}</p>}{detail.targetType!=='campaign'&&<Button variant="outline" disabled={!fresh||writing||!!uncertain} onClick={()=>open('campaign',detail.campaign.id)}>View parent campaign</Button>}{detail.targetType==='creative'&&typeof detail.item.adStackId==='string'&&<Button variant="outline" disabled={!fresh||writing||!!uncertain} onClick={()=>open('stack',detail.item.adStackId as string)}>View parent stack</Button>}<details><summary>Campaign settings and targeting</summary><Fields value={detail.campaign}/></details>
        <h3>Targeting</h3>{detail.targets.length?detail.targets.map((row,i)=><Fields key={i} value={row}/>):<p>No submitted targeting records.</p>}
        <h3>Related submitted items</h3>{detail.children.map((row,i)=><div key={i}>{typeof row.id==='string'&&<Button variant="outline" disabled={!fresh||writing||!!uncertain} onClick={()=>open('adType' in row?'creative':'stack',row.id as string)}>View {title(row)}</Button>}<Fields value={row}/></div>)}
        <h3>Staff review history</h3><p>Internal notes stay within this staff view; advertiser notes have a separate audience.</p>{detail.history.length?detail.history.map((row,i)=><Fields key={i} value={row}/>):<p>No recorded decisions.</p>}
        <div className="cf-mod-toolbar"><Button variant="outline" disabled={detailPage===1||writing||!!uncertain} onClick={()=>setDetailPage(p=>p-1)}>Previous details</Button><span>Details page {detailPage}</span><Button variant="outline" disabled={(!detail.hasMoreChildren&&!detail.hasMoreHistory)||writing||!!uncertain} onClick={()=>setDetailPage(p=>p+1)}>Next details</Button></div>
        <p>{detail.capabilities[stage].reason||'Review is available for this immutable submission. Approval prerequisites are rechecked on the server.'}</p><Button disabled={!fresh||!detail.capabilities[stage].allowed||writing||!!uncertain} onClick={()=>setReviewing(true)}>Review {stage==='reviewer'?1:2}</Button>
      </>)}
    {reviewing&&detail&&<ModerationReviewDialog embedded key={`${detail.targetType}:${detail.targetId}:${detail.submissionId}:${detail.contentRevision}:${stage}`} isOpen={reviewing} onClose={()=>{if(!busy.current&&!uncertain)setReviewing(false);}} targetType={detail.targetType} targetTitle={`${title(detail.item)} · revision ${detail.contentRevision}`} stage={stage} isPlatformAdmin={roles.some(r=>['ads_admin','super_admin'].includes(r))} locked={!!uncertain} reasons={detail.reviewOptions?.reasons} onSubmit={confirm}/>}
    </Dialog.Content></Dialog.Portal></Dialog.Root>

  </section>;
}
