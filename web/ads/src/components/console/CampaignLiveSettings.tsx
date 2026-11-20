'use client';

import { useId, useRef, useState } from 'react';
import { adsApi } from '../../lib/ads-api-client';
import type { CampaignDetails } from '../../lib/campaign-editor';
import { legacySchedule } from '../../lib/daily-schedule';
import { ScheduleEditor } from './ScheduleEditor';
import { LocationTargeting } from './LocationTargeting';
import { Button, Input, Textarea } from '../ui';

function list(value: unknown): string[] {
  if (typeof value === 'string') {
    try { return list(JSON.parse(value)); } catch { return []; }
  }
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

export function CampaignLiveSettings({ campaign, onSaved }: { campaign: CampaignDetails; onSaved: () => Promise<void> }) {
  const prefix = useId();
  const [title,setTitle] = useState(campaign.title);
  const [description,setDescription] = useState(campaign.description ?? '');
  const [daily,setDaily] = useState(campaign.dailyBudgetUsdCents == null ? '' : String(campaign.dailyBudgetUsdCents / 100));
  const [frequency,setFrequency] = useState(campaign.frequencyCapPerDay ?? 5);
  const [bid,setBid] = useState(campaign.pricingModel === 'cpc' ? campaign.costPerClickUsdCents ?? 10 : campaign.costPerImpressionUsdCents ?? 50);
  const [schedule,setSchedule] = useState(campaign.schedule ?? legacySchedule(campaign.targetHours));
  const [devices,setDevices] = useState<string[]>(list(campaign.targetDevices));
  const [channels,setChannels] = useState<string[]>(list(campaign.channels));
  const [geo,setGeo] = useState<'global'|'targeted'>(campaign.geoMode === 'targeted' ? 'targeted' : 'global');
  const [locations,setLocations] = useState((campaign.geoLocations ?? []).flatMap(location => typeof location.id === 'string' ? [location.id] : []));
  const [endsAt,setEndsAt] = useState('');
  const [pending,setPending] = useState(false);
  const [error,setError] = useState('');
  const lock = useRef(false);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (lock.current) return;
    lock.current = true;
    setPending(true);
    setError('');
    try {
      await adsApi().liveSettings(campaign.id,{
        requestId:crypto.randomUUID(),expectedRevision:campaign.contentRevision ?? 1,expectedUpdatedAt:campaign.updatedAt,
        title,description,dailyBudgetUsd:daily === '' ? null : Number(daily),frequencyCapPerDay:frequency,
        ...(campaign.pricingModel === 'cpc' ? {costPerClickCents:bid} : {costPerImpressionCents:bid}),
        schedule,targetDevices:devices,channels:channels.filter((channel): channel is 'websites'|'individuals'|'mobile_apps' => ['websites','individuals','mobile_apps'].includes(channel)),geoMode:geo,locations:geo === 'targeted' ? locations : [],
        ...(endsAt ? {endsAt:new Date(endsAt).toISOString()} : {}),
      });
      await onSaved();
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'Settings could not be saved. Reload the campaign before retrying.');
    } finally {
      lock.current = false;
      setPending(false);
    }
  }

  return <details>
    <summary style={{minHeight:44,cursor:'pointer'}}>Edit delivery settings</summary>
    <form onSubmit={save} style={{display:'grid',gap:12,paddingBlock:12}}>
      <label htmlFor={prefix+'title'}>Campaign name</label>
      <Input id={prefix+'title'} required maxLength={255} value={title} onChange={event=>setTitle(event.target.value)} />
      <label htmlFor={prefix+'description'}>Internal description</label>
      <Textarea id={prefix+'description'} maxLength={5000} value={description} onChange={event=>setDescription(event.target.value)} />
      <label htmlFor={prefix+'daily'}>Daily budget (USD, leave blank for no daily limit)</label>
      <Input id={prefix+'daily'} type="number" min="1" max={campaign.budgetUsdCents/100} step=".01" value={daily} onChange={event=>setDaily(event.target.value)} />
      <label htmlFor={prefix+'bid'}>Bid (USD cents per {campaign.pricingModel === 'cpc' ? 'click' : '1,000 impressions'})</label>
      <Input id={prefix+'bid'} type="number" required min={campaign.pricingModel === 'cpc' ? 10 : 50} step="1" value={bid} onChange={event=>setBid(Number(event.target.value))} />
      <label htmlFor={prefix+'frequency'}>Views per visitor per day</label>
      <Input id={prefix+'frequency'} type="number" min="1" max="100" required value={frequency} onChange={event=>setFrequency(Number(event.target.value))} />
      <label htmlFor={prefix+'end'}>New end date (optional, your local time)</label>
      <Input id={prefix+'end'} type="datetime-local" value={endsAt} onChange={event=>setEndsAt(event.target.value)} />
      <ScheduleEditor value={schedule} onChange={setSchedule} disabled={pending} />
      <fieldset><legend>Devices</legend>{['desktop','mobile','android','ios','tablet'].map(device=><label key={device} style={{display:'inline-flex',gap:8,padding:8}}>
        <input type="checkbox" checked={devices.includes(device)} onChange={event=>setDevices(previous=>event.target.checked?[...previous,device]:previous.filter(item=>item!==device))} />{device}
      </label>)}</fieldset>
      <fieldset><legend>Supply channels</legend>{['websites','individuals','mobile_apps'].map(channel=><label key={channel} style={{display:'inline-flex',gap:8,padding:8}}>
        <input type="checkbox" checked={channels.includes(channel)} onChange={event=>setChannels(previous=>event.target.checked?[...previous,channel]:previous.filter(item=>item!==channel))} />{channel.replaceAll('_',' ')}
      </label>)}</fieldset>
      <label htmlFor={prefix+'geo'}>Locations</label>
      <select id={prefix+'geo'} value={geo} onChange={event=>setGeo(event.target.value as 'global'|'targeted')} style={{minHeight:44}}>
        <option value="global">All countries</option><option value="targeted">Selected locations</option>
      </select>
      {geo === 'targeted' && <LocationTargeting value={locations} onChange={setLocations} disabled={pending} />}
      {error && <p role="alert">{error}</p>}
      <Button type="submit" disabled={pending}>{pending?'Saving…':'Save delivery settings'}</Button>
    </form>
  </details>;
}
