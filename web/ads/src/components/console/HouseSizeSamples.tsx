'use client';
import {useState} from 'react';
import {Button} from '../ui/button';
import {HOUSE_SAMPLE_FAMILIES,fittingSamples} from '../../lib/house-samples';
import styles from './HouseSizeSamples.module.css';

export function HouseSizeSamples({allowedPresets=[],context='advertiser',maxWidth,maxHeight}:{allowedPresets?:string[];context?:'advertiser'|'publisher';maxWidth?:number|null;maxHeight?:number|null}){
  const [family,setFamily]=useState<string>(HOUSE_SAMPLE_FAMILIES[0].id),[width,setWidth]=useState(320),[preset,setPreset]=useState('medium_rectangle'),[failed,setFailed]=useState<string|null>(null);
  const choices=fittingSamples(family,allowedPresets,Math.min(width,maxWidth??width),Math.min(600,maxHeight??600)),selected=choices.find(item=>item.preset===preset)??choices[0];
  return <details className={styles.samples}>
    <summary>Explore ad sizes with samples</summary>
    <div className={styles.content}>
      <p>{context==='advertiser'?'These examples show display sizes. Your ad can serve only the approved renditions you provide.':'Preview sizes that fit the example container. Your saved slot settings stay unchanged.'}</p>
      <fieldset><legend>Sample design</legend><div className={styles.choices}>{HOUSE_SAMPLE_FAMILIES.map(item=><Button key={item.id} type="button" variant={item.id===family?'default':'outline'} aria-pressed={item.id===family} onClick={()=>setFamily(item.id)}>{item.name}</Button>)}</div></fieldset>
      <fieldset><legend>Example container width</legend><div className={styles.choices}>{[320,375,970].map(value=><Button key={value} type="button" variant={width===value?'default':'outline'} aria-pressed={width===value} onClick={()=>setWidth(value)}>{value} px</Button>)}</div></fieldset>
      <fieldset><legend>Fitting sizes</legend><div className={styles.choices}>{choices.map(item=><Button key={item.preset} type="button" variant={selected?.preset===item.preset?'default':'outline'} aria-pressed={selected?.preset===item.preset} onClick={()=>setPreset(item.preset)}>{item.width} × {item.height}</Button>)}</div></fieldset>
      {!selected?<p role="status">No approved sample size fits this container and size selection.</p>:<figure>
        <div className={styles.frame}>
          {/* A plain image intentionally avoids the delivery SDK and all ad tracking. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {failed===selected.url?<p role="status">This sample could not be loaded.</p>:<img key={selected.url} src={selected.url} width={selected.width} height={selected.height} alt={`${HOUSE_SAMPLE_FAMILIES.find(item=>item.id===family)?.name}, ${selected.width} by ${selected.height} pixel House Ad sample`} loading="lazy" onError={()=>setFailed(selected.url)} />}
        </div>
        <figcaption>{selected.width} × {selected.height} px · {(selected.bytes/1000).toFixed(1)} KB. Scaled down only when needed to fit this preview; original aspect ratio retained.</figcaption>
      </figure>}
    </div>
  </details>;
}
