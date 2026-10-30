'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {adsApi} from '../../lib/ads-api-client';
import {type CampaignDetails} from '../../lib/campaign-editor';
import {CampaignCreationWizard} from './CampaignCreationWizard';
import {MediaPreview} from '../MediaPreview';
import {ActionHelp} from '../ActionHelp';
import {Button} from '../ui/button';
export function CampaignPage({id,edit=false}:{id:string;edit?:boolean}) {
  const router=useRouter();const [campaign,setCampaign]=useState<CampaignDetails|null>(null),[error,setError]=useState(''),[busy,setBusy]=useState(false),[confirmEdit,setConfirmEdit]=useState(false);
  const [reconcile,setReconcile]=useState<{requestId:string;expectedRevision:number}|null>(null);
  async function load(){try{setCampaign(await adsApi().details(id));setError('');}catch(e){setError(e instanceof Error?e.message:'Campaign could not be loaded.');}}
  useEffect(()=>{let active=true;setCampaign(null);void adsApi().details(id).then(c=>{if(active)setCampaign(c);}).catch(e=>{if(active)setError(e instanceof Error?e.message:'Campaign unavailable.');});return()=>{active=false;};},[id]);
  async function begin(){if(!campaign||busy)return;setBusy(true);try{await adsApi().beginEdit(id,{expectedRevision:campaign.contentRevision!,requestId:crypto.randomUUID(),submissionId:campaign.currentSubmissionId??undefined});await load();setConfirmEdit(false);router.push(`/campaigns/${id}/edit`);}catch(e){setError(e instanceof Error?e.message:'Editing could not be confirmed. Reload the campaign.');}finally{setBusy(false);}}
  async function resumeSubmission(){if(!reconcile||busy)return;setBusy(true);try{await adsApi().submit(id,reconcile);setReconcile(null);await load();}catch(e){setError(e instanceof Error?e.message:'Funding remains unconfirmed.');}finally{setBusy(false);}}
  if(error&&!campaign)return <div role="alert">{error}<Button onClick={()=>void load()}>Retry</Button><Link href="/campaigns">Back to campaigns</Link></div>;
  if(!campaign)return <p role="status">Loading campaign…</p>;
  if(edit&&campaign.capabilities?.canEdit)return <CampaignCreationWizard campaign={campaign} onCancel={()=>router.push(`/campaigns/${id}`)} onSuccess={()=>router.push(`/campaigns/${id}`)}/>;
  const can=campaign.capabilities;
  return <section style={{display:'grid',gap:20}}>
    <Link href="/campaigns">Back to campaigns</Link>
    <header><h1>{campaign.title}</h1><p>{campaign.moderationStatus} · Revision {campaign.contentRevision}</p><p>Last saved: {campaign.updatedAt?new Date(campaign.updatedAt).toLocaleString():'Time unavailable'}</p></header>
    {error&&<p role="alert">{error}</p>}
    {can?.canEdit?<Link href={`/campaigns/${id}/edit`}>Continue editing draft</Link>:<div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}>
      <Button disabled={!can?.canBeginEdit||busy} onClick={()=>setConfirmEdit(true)}>Edit and restart review</Button>
      {!can?.canBeginEdit&&<ActionHelp action="Edit" reason={can?.blocker??'Editing is unavailable. Reload the campaign to check its current status.'}/>}
    </div>}
    {confirmEdit&&<div><p>Beginning an edit withdraws the current review and stops new ad delivery. Resubmitting starts a fresh review. Existing funding is retained.</p><Button disabled={busy} onClick={()=>void begin()}>Begin editing</Button><Button variant="outline" disabled={busy} onClick={()=>setConfirmEdit(false)}>Keep current submission</Button></div>}
    {campaign.submissionIntentId&&<div><p>A submission needs funding confirmation. Check its status before changing this campaign.</p>
      <Button disabled={busy} onClick={async()=>{try{const detail=await adsApi().details(id);setCampaign(detail);const requestId=typeof detail.submissionRequestId==='string'?detail.submissionRequestId:undefined;if(requestId)setReconcile({requestId,expectedRevision:detail.contentRevision!});else setError('The request identity is unavailable. Ask support to reconcile this submission.');}catch(e){setError(e instanceof Error?e.message:'Status is unavailable.');}}}>Check submission</Button>
      {reconcile&&<Button disabled={busy} onClick={()=>void resumeSubmission()}>Reconcile this submission</Button>}
    </div>}
    <p>{campaign.description}</p><p>Budget: ${(campaign.budgetUsdCents/100).toFixed(2)} · Remaining: ${(campaign.remainingBudgetUsdCents/100).toFixed(2)}</p>
    {campaign.adStacks.map(stack=><section key={stack.id}><h2>{stack.name}</h2>
      {campaign.creatives.filter(ad=>ad.adStackId===stack.id).map(ad=><article key={ad.id}><h3>{ad.headline||'Artwork ad'}</h3><p>{ad.bodyText}</p>
        {ad.imageUrl&&<MediaPreview source={ad.imageUrl} mode="owner"/>}
        <p>{ad.destinationUrl||'Destination not set'}</p><p>{ad.reviewStatus}</p></article>)}
    </section>)}
  </section>;
}
