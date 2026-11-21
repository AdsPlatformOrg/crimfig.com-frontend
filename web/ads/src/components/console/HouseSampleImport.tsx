'use client';
import {useRef,useState} from 'react';
import {Button} from '../ui/button';
import {dashboardSession,sessionFetch} from '../../lib/session';
import {importHouseSamples,type HouseSampleJournal} from '../../lib/import-house-samples';
export function HouseSampleImport({onImported}:{onImported:()=>void}){
  const [busy,setBusy]=useState(false),[count,setCount]=useState(0),[error,setError]=useState(''),[done,setDone]=useState(false),lock=useRef(false);
  async function run(){
    if(lock.current)return;lock.current=true;setBusy(true);setError('');setDone(false);
    try{
      const profile=await dashboardSession().getProfile();
      const key=`crimfig:house-sample-import:v1:${location.origin}:${profile.userId}`;
      const stored=localStorage.getItem(key),journal:HouseSampleJournal=stored?JSON.parse(stored):{};
      const accountRequest:typeof sessionFetch=async(input,init)=>{
        if((await dashboardSession().getProfile()).userId!==profile.userId)throw new Error('Account changed. Import stopped.');
        return sessionFetch(input,init);
      };
      await importHouseSamples(accountRequest,location.origin,journal,value=>localStorage.setItem(key,JSON.stringify(value)),setCount);
      setDone(true);onImported();
    }catch(error){setError(error instanceof Error?error.message:'House sample import failed.');}
    finally{lock.current=false;setBusy(false);}
  }
  return <details className="cf-report-panel"><summary>Import the 27 prepared House samples</summary>
    <p>Creates inactive House Ads from three designs in nine sizes. Existing creatives stay unchanged. Activation is a separate action.</p>
    <Button type="button" variant="outline" disabled={busy} onClick={()=>void run()}>{busy?`Importing ${count}/27…`:'Import inactive samples'}</Button>
    {done&&<p role="status">27 samples registered. Newly imported creatives are inactive.</p>}
    {error&&<p role="alert">{error}</p>}
  </details>;
}
