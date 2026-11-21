'use client';
import {useState} from 'react';
import {Button} from '../ui/button';
import {HOUSE_SAMPLE_FAMILIES,fittingSamples,houseSampleCatalog} from '../../lib/house-samples';
import styles from './HouseSizeSamples.module.css';

export function HouseSizeSamples({allowedPresets=[],context='advertiser',maxWidth,maxHeight}:{allowedPresets?:string[];context?:'advertiser'|'publisher';maxWidth?:number|null;maxHeight?:number|null}){
  const [family,setFamily]=useState<string>(HOUSE_SAMPLE_FAMILIES[0].id),[width,setWidth]=useState(320),[preset,setPreset]=useState('medium_rectangle'),[failed,setFailed]=useState<string|null>(null);
  const choices=fittingSamples(family,allowedPresets,Math.min(width,maxWidth??width),Math.min(600,maxHeight??600)),selected=choices.find(item=>item.preset===preset)??choices[0];
  const activeSample=houseSampleCatalog.assets.find(item=>item.family===family&&item.preset===preset);
  const presetIncompatible=choices.length>0&&!choices.some(item=>item.preset===preset);
  return <details open className={styles.samples}>
    <summary>Explore ad sizes with samples</summary>
    <div className={styles.content}>
      <p>{context==='advertiser'?'These examples show display sizes. Your ad can serve only the approved renditions you provide.':'Preview sizes that fit the example container. Your saved slot settings stay unchanged.'}</p>
      <fieldset><legend>Sample design</legend><div className={styles.choices}>{HOUSE_SAMPLE_FAMILIES.map(item=><Button key={item.id} type="button" variant={item.id===family?'default':'outline'} aria-pressed={item.id===family} onClick={()=>setFamily(item.id)}>{item.name}</Button>)}</div></fieldset>
      <fieldset><legend>Example container width</legend><div className={styles.choices}>{[320,375,970].map(value=><Button key={value} type="button" variant={width===value?'default':'outline'} aria-pressed={width===value} onClick={()=>setWidth(value)}>{value} px</Button>)}</div></fieldset>
      <fieldset><legend>Fitting sizes</legend><div className={styles.choices}>{choices.map(item=><Button key={item.preset} type="button" variant={selected?.preset===item.preset?'default':'outline'} aria-pressed={selected?.preset===item.preset} onClick={()=>setPreset(item.preset)}>{item.width} × {item.height}</Button>)}</div></fieldset>
      {presetIncompatible&&selected&&<p role="status">Selected size ({activeSample?`${activeSample.width} × ${activeSample.height} px`:preset}) does not fit this {width} px container and cannot serve on {width} px slots; showing {selected.width} × {selected.height} px instead.</p>}
      {!selected?<p role="status">No approved sample size fits this container and size selection.</p>:<figure>
        <div className={styles.frame}>
          <div className={styles.container} style={{width, maxWidth:"100%"}} aria-label={`Example container: ${width} pixels`}>
          {/* A plain image intentionally avoids the delivery SDK and all ad tracking. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {failed===selected.url?<p role="status">This sample could not be loaded.</p>:<img key={selected.url} src={selected.url} width={selected.width} height={selected.height} style={{width:`${selected.width / width * 100}%`}} alt={`${HOUSE_SAMPLE_FAMILIES.find(item=>item.id===family)?.name}, ${selected.width} by ${selected.height} pixel House Ad sample`} loading="lazy" onError={()=>setFailed(selected.url)} />}
          </div>
        </div>
        <figcaption>{selected.width} × {selected.height} px · {(selected.bytes/1000).toFixed(1)} KB. Scaled down only when needed to fit this preview; original aspect ratio retained.</figcaption>
      </figure>}
    </div>
  </details>;
}
