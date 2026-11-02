'use client';
import React,{useCallback,useEffect,useRef,useState} from 'react';
import {adsApi} from '../../lib/ads-api-client';
import {ApiError} from '@crimfig/api-client';
import {Button} from '../ui/button';
type State=Awaited<ReturnType<ReturnType<typeof adsApi>['moderationClaim']>>;
type Action='acquire'|'renew'|'release'|'takeover';
type Body=Parameters<ReturnType<typeof adsApi>['changeModerationClaim']>[3];
export function ModerationClaimPanel({type,id,submissionId,revision,stage,actorId,canReview,isAdmin}:{type:'creative'|'stack'|'campaign';id:string;submissionId:string|null;revision:number|null;stage:'reviewer'|'manager';actorId:string;canReview:boolean;isAdmin:boolean}){
 const [state,setState]=useState<State|null>(null),[error,setError]=useState(''),[notice,setNotice]=useState(''),[busy,setBusy]=useState(false),[uncertain,setUncertain]=useState(false),[reason,setReason]=useState('');
 const generation=useRef(0),alive=useRef(true),flight=useRef(false),intent=useRef<{action:Action;body:Body}|null>(null);
 const refresh=useCallback(async()=>{const version=++generation.current;setError('');try{const result=await adsApi().moderationClaim(type,id,stage);if(alive.current&&version===generation.current)setState(result);}catch{if(alive.current&&version===generation.current){setState(null);setError('Claim status unavailable. Normal review remains available.');}}},[type,id,stage]);
 useEffect(()=>{alive.current=true;void refresh();return()=>{alive.current=false;++generation.current;};},[refresh]);
 useEffect(()=>{if(!state?.claim)return;const remaining=Date.parse(state.claim.expiresAt)-Date.parse(state.serverTime);if(!Number.isFinite(remaining)||remaining<=0)return;const timer=setTimeout(()=>void refresh(),Math.min(remaining+100,3600100));return()=>clearTimeout(timer);},[state,refresh]);
 const own=state?.claim?.claimantId===actorId;
 async function run(action:Action,retry=false){
  if(flight.current)return;
  if(!canReview||!state?.enabled||!submissionId||!Number.isSafeInteger(revision)){setError('Current review eligibility is required to change a claim.');return;}
  if(uncertain&&!retry){setError('Retry the original claim request before changing its action.');return;}
  if(action==='takeover'&&(!isAdmin||!reason.trim()||reason.length>2000)){setError('Administrative takeover requires a recorded reason of at most 2,000 characters.');return;}
  const saved=retry?intent.current:{action,body:{stage,submissionId,expectedRevision:revision!,requestId:crypto.randomUUID(),...(action!=='acquire'?{claimId:state.claim?.id}:{}),...(action==='takeover'?{reason:reason.trim()}:{} )}};
  if(!saved)return;intent.current=saved;flight.current=true;setBusy(true);setError('');
  try{const result=await adsApi().changeModerationClaim(type,id,saved.action,saved.body);if(!alive.current)return;
   setNotice(result.outcome==='held_by_other'?'Another moderator holds this advisory claim. You may still review.':result.outcome==='held_by_you'?'You already hold this claim; its expiry was not extended.':`Claim ${result.outcome.replaceAll('_',' ')}.`);
   intent.current=null;setUncertain(false);setReason('');await refresh();
  }catch(err){if(!alive.current)return;const unknown=!(err instanceof ApiError)||err.outcome==='unknown'||!err.status||err.status>=500;setUncertain(unknown);if(!unknown)intent.current=null;setError(unknown?'Claim outcome unconfirmed. Retry uses the same request ID.':'Claim change rejected. Refresh status before trying again.');}
  finally{flight.current=false;if(alive.current)setBusy(false);}
 }
 return <aside className="cf-mod-claims" aria-label="Advisory review claim"><h3>Review coordination</h3><p>Optional claims never block another authorized review. Viewing details does not claim the item.</p>
  {error&&<p role="status">{error}</p>}{notice&&<p role="status">{notice}</p>}
  {!state&&!error&&<p role="status">Loading claim status…</p>}
  {state&&!state.enabled&&<p>Advisory claims are not enabled. Normal review remains available.</p>}
  {state?.enabled&&<><p>{state.claim?`${own?'Claimed by you':`Being reviewed by ${state.claim.claimantId}`} · expires ${state.claim.expiresAt} UTC`:'No active claim.'}</p><p className="cf-mod-meta">Server time: {state.serverTime} · {state.policy.ttlSeconds/60}-minute claims · Manual renewal up to {state.policy.maxLifetimeSeconds/60} minutes per claim. No automatic renewal.</p>
   <div className="cf-mod-actions"><Button variant="outline" disabled={busy} onClick={()=>void refresh()}>Refresh claim status</Button>
    {!state.claim&&<Button disabled={!canReview||busy||uncertain} onClick={()=>void run('acquire')}>Claim review</Button>}
    {own&&<><Button variant="outline" disabled={!canReview||busy||uncertain} onClick={()=>void run('renew')}>Renew claim</Button><Button variant="outline" disabled={!canReview||busy||uncertain} onClick={()=>void run('release')}>Release claim</Button></>}
   </div>
   {state.claim&&!own&&isAdmin&&canReview&&<div><label htmlFor={`claim-reason-${id}`}>Takeover audit reason</label><textarea id={`claim-reason-${id}`} aria-label="Takeover audit reason" maxLength={2000} value={reason} disabled={busy||uncertain} onChange={event=>setReason(event.target.value)}/><Button variant="outline" disabled={busy||uncertain||!reason.trim()} onClick={()=>void run('takeover')}>Take over claim</Button></div>}
   {!canReview&&<p>Your current role or review eligibility does not permit claim changes.</p>}
  </>}
  {uncertain&&<Button variant="outline" disabled={busy} onClick={()=>intent.current&&void run(intent.current.action,true)}>Retry original claim request</Button>}
  {error&&!state&&<Button variant="outline" disabled={busy} onClick={()=>void refresh()}>Refresh claim status</Button>}
 </aside>;
}
