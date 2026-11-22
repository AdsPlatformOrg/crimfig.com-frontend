"use client";
import { SupportCenter } from '../../../../../../shared/ui/support/SupportCenter';
import { consentSession } from '../../../lib/consent';
const request=(url:string,init?:RequestInit)=>consentSession().request(new URL(url,window.location.origin),init);
export default function SupportPage(){return <SupportCenter request={request}/>;}
