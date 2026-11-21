import {houseSampleCatalog} from './house-samples';
type Receipt={phase:'uploading'|'uploaded'|'creating'|'registered';assetId?:string;imageUrl?:string;creativeId?:string};
export type HouseSampleJournal=Record<string,Receipt>;
type Request=(url:string,init?:RequestInit)=>Promise<Response>;
/** Call only from the authenticated House Ads administration surface. Never activates creatives. */
export async function importHouseSamples(request:Request,origin:string,journal:HouseSampleJournal,save:(journal:HouseSampleJournal)=>void,onProgress:(count:number)=>void){
  const destination=new URL(origin);
  if(!['https://ads.crimfig.com','https://staging-ads.crimfig.com'].includes(destination.origin))throw new Error('House import requires a recognized CrimFig Ads environment.');
  const existing:any[]=[];
  for(let page=1;page<=100;page++){
    const response=await request(`/api/v1/admin/ads/house-creatives?page=${page}&limit=100`);
    if(!response.ok)throw new Error('Cannot reconcile existing House Ads. No import was started.');
    const json=await response.json();if(!Array.isArray(json.data))throw new Error('Invalid House catalog response');
    existing.push(...json.data);if(!json.meta?.hasNext)break;if(page===100)throw new Error('Catalog reconciliation limit reached');
  }
  let completed=0;
  for(const sample of houseSampleCatalog.assets){
    const key=`${sample.family}/${sample.preset}`,title=`PLAN0130 ${key} ${sample.sha256.slice(0,16)}`;
    const matches=existing.filter(item=>item.title===title);
    if(matches.length>1)throw new Error(`Duplicate House records require review: ${key}`);
    if(matches.length===1){
      const item=matches[0];
      if(item.targetPreset!==sample.preset||item.width!==sample.width||item.height!==sample.height||!item.imageAssetId)throw new Error(`Existing House record does not match: ${key}`);
      journal[key]={...journal[key],phase:'registered',creativeId:item.id};save({...journal});onProgress(++completed);continue;
    }
    const receipt=journal[key];
    if(receipt&&['uploading','creating','registered'].includes(receipt.phase))throw new Error(`Previous ${receipt.phase} needs administrator reconciliation: ${key}. It will not be repeated automatically.`);
    if(!receipt){
      const source=await fetch(sample.url,{credentials:'omit'});
      if(!source.ok)throw new Error(`Sample file unavailable: ${key}`);
      const blob=await source.blob();if(blob.size!==sample.bytes||blob.type!==sample.mime||blob.size>250000)throw new Error(`Sample verification failed: ${key}`);
      const digest=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',await blob.arrayBuffer())),byte=>byte.toString(16).padStart(2,'0')).join('');
      if(digest!==sample.sha256)throw new Error(`Sample checksum failed: ${key}`);
      const data=new FormData();data.append('file',blob,`${sample.preset}.${sample.mime==='image/webp'?'webp':'png'}`);
      journal[key]={phase:'uploading'};save({...journal});
      const uploaded=await request('/api/v1/uploads/direct',{method:'POST',body:data});
      if(!uploaded.ok)throw new Error(`Upload failed; reconcile before retry: ${key}`);
      const result=(await uploaded.json()).data;
      if(!result?.assetId||!result?.cdnUrl)throw new Error(`Upload acknowledgement missing: ${key}`);
      const imageUrl=new URL(result.cdnUrl,destination.origin).href;
      if(new URL(imageUrl).origin!==destination.origin)throw new Error('Unexpected uploaded media origin');
      journal[key]={phase:'uploaded',assetId:result.assetId,imageUrl};save({...journal});
    }
    const ready=journal[key];journal[key]={...ready,phase:'creating'};save({...journal});
    const created=await request('/api/v1/admin/ads/house-creatives',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({title,headline:'',bodyText:'',ctaText:'',destinationUrl:destination.origin,adType:'image',format:sample.width/sample.height>=3?'banner':'card',
      imageAssetId:ready.assetId,imageUrl:ready.imageUrl,width:sample.width,height:sample.height,targetPreset:sample.preset,renditionWidth:sample.width,renditionHeight:sample.height,isActive:false})});
    if(!created.ok)throw new Error(`House creation failed; reconcile before retry: ${key}`);
    const result=(await created.json()).data;if(!result?.id||result.isActive!==false)throw new Error(`House creation acknowledgement needs review: ${key}`);
    journal[key]={...ready,phase:'registered',creativeId:result.id};save({...journal});onProgress(++completed);
  }
  return journal;
}
