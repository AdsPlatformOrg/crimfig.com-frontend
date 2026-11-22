"use client";
import { SupportCenter } from '../../../../../../shared/ui/support/SupportCenter';
import { consentSession } from '../../../lib/consent';
import { AuthAdminGuard } from '../../../components/AuthAdminGuard';
const request=(url:string,init?:RequestInit)=>consentSession().request(new URL(url,window.location.origin),init);
export default function SupportAdminPage(){return <AuthAdminGuard>{staff=>staff.roles.some(r=>r==='super_admin'||r==='support_agent')?<SupportCenter request={request} admin/>:<p role="alert">Platform Support authorization required.</p>}</AuthAdminGuard>;}
