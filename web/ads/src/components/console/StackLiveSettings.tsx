'use client';
import { useId, useRef, useState } from 'react';
import { adsApi } from '../../lib/ads-api-client';
import type { CampaignDetails } from '../../lib/campaign-editor';
import { inherited, type DailySchedule } from '../../lib/daily-schedule';
import { ScheduleEditor } from './ScheduleEditor';
import { LocationTargeting } from './LocationTargeting';
import { Button, Input } from '../ui';

export function StackLiveSettings({ campaign, stackId, onSaved }: { campaign: CampaignDetails; stackId: string; onSaved:()=>Promise<void> }) {
  const stack = campaign.adStacks.find(row=>row.id===stackId)!;
  const id = useId();
  const [name,setName] = useState(stack.name);
  const [schedule,setSchedule] = useState<DailySchedule>(stack.settings?.schedule ?? inherited());
  const [devices,setDevices] = useState<string[]>(stack.settings?.targetDevices ?? []);
  const [geo,setGeo] = useState<'inherit'|'global'|'targeted'>(stack.settings?.geoMode === 'targeted' ? 'targeted' : stack.settings?.geoMode === 'global' ? 'global' : 'inherit');
  const [locations,setLocations] = useState((stack.settings?.locations ?? []).flatMap(place=>typeof place.id==='string'?[place.id]:[]));
  const [error,setError] = useState('');
  const [pending,setPending] = useState(false);
  const lock = useRef(false);
  return <details>
    <summary style={{minHeight:44,cursor:'pointer'}}>Edit stack delivery settings</summary>
    <form style={{display:'grid',gap:12}} onSubmit={async event=>{
      event.preventDefault();
      if(lock.current)return;
      lock.current=true;setPending(true);setError('');
      try {
        await adsApi().liveStackSettings(campaign.id,stackId,{
          requestId:crypto.randomUUID(),expectedRevision:campaign.contentRevision??1,expectedUpdatedAt:campaign.updatedAt,
          name,schedule,targetDevices:devices,geoMode:geo,locations:geo==='targeted'?locations:[],
        });
        await onSaved();
      } catch(failure) {setError(failure instanceof Error?failure.message:'Stack settings could not be saved.');}
      finally {lock.current=false;setPending(false);}
    }}>
      <label htmlFor={id+'name'}>Stack name</label><Input id={id+'name'} required maxLength={100} value={name} onChange={event=>setName(event.target.value)} />
      <ScheduleEditor value={schedule} campaign={campaign.schedule ?? undefined} onChange={setSchedule} disabled={pending} />
      <fieldset><legend>Devices (none selected inherits campaign settings)</legend>
        {['desktop','mobile','android','ios','tablet'].map(device=><label key={device} style={{display:'inline-flex',padding:8,gap:8}}>
          <input type="checkbox" checked={devices.includes(device)} onChange={event=>setDevices(previous=>event.target.checked?[...previous,device]:previous.filter(item=>item!==device))} />{device}
        </label>)}
      </fieldset>
      <label htmlFor={id+'geo'}>Locations</label><select id={id+'geo'} value={geo} onChange={event=>setGeo(event.target.value as typeof geo)} style={{minHeight:44}}>
        <option value="inherit">Inherit campaign locations</option><option value="global">All countries</option><option value="targeted">Selected locations</option>
      </select>
      {geo==='targeted' && <LocationTargeting value={locations} onChange={setLocations} disabled={pending} />}
      {error && <p role="alert">{error}</p>}
      <Button disabled={pending} type="submit">{pending?'Saving…':'Save stack settings'}</Button>
    </form>
  </details>;
}
