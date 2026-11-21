'use client';
import {Button} from '../ui/button';
import {useId} from 'react';
import {houseSampleCatalog} from '../../lib/house-samples';
import {HouseSizeSamples} from './HouseSizeSamples';
export type AdSizeMode='legacy'|'dynamic'|'single'|'selected';
export function AdSizePolicy({value,selected=[],image,onChange}:{value:AdSizeMode;selected?:string[];image?:{width:number;height:number;bytes:number};onChange:(value:AdSizeMode,ids:string[])=>void}){
  const fieldId=useId();
  const presets=houseSampleCatalog.assets.filter(item=>item.family===houseSampleCatalog.families[0]);
  const matches=presets.filter(item=>image&&image.bytes<=250000&&image.width>=item.width&&image.height>=item.height&&Math.abs(image.width/image.height-item.width/item.height)<=.01);
  return <section style={{display:'grid',gap:'12px',minWidth:0}} aria-label="Ad size policy">
    <fieldset style={{border:0,padding:0,minWidth:0}}><legend>Ad sizes</legend><div style={{display:'flex',flexWrap:'wrap',gap:'8px'}}>
      {([['dynamic','Dynamic Ad'],['single','One Size'],['selected','Selected Sizes']] as const).map(([mode,label])=><Button key={mode} type="button" variant={value===mode?'default':'outline'} aria-pressed={value===mode} onClick={()=>onChange(mode,mode==='dynamic'?[]:mode==='single'?selected.slice(0,1):selected)}>{label}</Button>)}
    </div></fieldset>
    {value==='legacy'?<p>Existing size policy retained. Choose a new policy only if you want to change this ad.</p>:<p>Dynamic Ad uses the compatible approved sizes your image supports. Supply another creative for a different shape.</p>}
    {(value==='single'||value==='selected')&&<fieldset style={{border:0,padding:0,minWidth:0}}><legend>Approved sizes</legend><div style={{display:'flex',flexWrap:'wrap',gap:'12px'}}>{presets.map(item=><label key={item.preset} style={{display:'flex',alignItems:'center',gap:'6px',minHeight:44}}><input type={value==='single'?'radio':'checkbox'} name={fieldId} checked={selected.includes(item.preset)} onChange={event=>onChange(value,value==='single'?[item.preset]:event.target.checked?[...selected,item.preset]:selected.filter(id=>id!==item.preset))}/>{item.width} × {item.height}</label>)}</div></fieldset>}
    {image&&<p>{matches.length?`Source dimensions match: ${matches.map(item=>`${item.width} × ${item.height}`).join(', ')}. Final eligibility is validated when saving.`:'This image does not match an approved display size within the delivery byte limit.'}</p>}
    <HouseSizeSamples allowedPresets={value==='single'||value==='selected'?selected:[]} />
  </section>;
}
