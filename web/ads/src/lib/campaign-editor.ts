import { allDay, inherited, validateSchedule } from './daily-schedule';
import type { adsApi } from './ads-api-client';
import type { StackDraft } from '../components/console/AdStackEditor';
export type CampaignDetails = Awaited<ReturnType<ReturnType<typeof adsApi>['details']>>;
export function hydrateCampaign(c:CampaignDetails) {
  const strings=(v:unknown):string[]=>Array.isArray(v)?v.filter((s):s is string=>typeof s==='string'):[];
  const schedule=(v:unknown,inherit=false)=>v?validateSchedule(v,inherit):inherit?inherited():allDay();
  const stacks:StackDraft[]=c.adStacks.map(s=>({id:s.id,key:s.id,name:s.name,
    geoMode:s.settings?.geoMode==='targeted'?'targeted':s.settings?.geoMode==='global'?'global':'inherit',
    locations:(s.settings?.locations??[]).flatMap(l=>typeof l.id==='string'?[l.id]:[]),
    targetDevices:strings(s.settings?.targetDevices),targetHours:[],schedule:schedule(s.settings?.schedule,true),
    ads:c.creatives.filter(a=>a.adStackId===s.id).map(a=>({id:a.id,key:a.id,adType:a.adType??'text',headline:a.headline??'',bodyText:a.bodyText??'',ctaText:a.ctaText??'',destinationUrl:a.destinationUrl,
      mediaAssetId:a.mediaAssetId??undefined,mediaUrl:a.imageUrl??a.videoUrl??undefined,adFormat:a.adFormat==='banner'?'banner':'card',
      imageInfo:a.imageSpecs&&typeof a.imageSpecs.width==='number'&&typeof a.imageSpecs.height==='number'&&typeof a.imageSpecs.bytes==='number'?{width:a.imageSpecs.width,height:a.imageSpecs.height,bytes:a.imageSpecs.bytes,mimeType:a.imageSpecs.mimeType}:undefined}))}));
  return {title:c.title,description:c.description??'',category:c.category??'Other',stacks,geoMode:c.geoMode==='targeted'?'targeted' as const:'global' as const,
    locations:(c.geoLocations??[]).flatMap(l=>typeof l.id==='string'?[l.id]:[]),devices:strings(c.targetDevices),schedule:schedule(c.schedule),
    frequencyCap:c.frequencyCapPerDay??5,pricingModel:c.pricingModel==='cpc'?'cpc' as const:'cpm' as const,budgetUsd:c.budgetUsdCents/100,
    dailyBudgetUsd:c.dailyBudgetUsdCents==null?null:c.dailyBudgetUsdCents/100,cpmBidCents:c.costPerImpressionUsdCents??50,cpcBidCents:c.costPerClickUsdCents??10};
}
export function editorRecoveryScope(owner:string,id?:string,revision?:number) {return id?`${owner}:${id}:${revision}`:owner;}
