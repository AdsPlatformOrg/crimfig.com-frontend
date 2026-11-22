"use client";
import { SupportCenter } from '../../../../../shared/ui/support/SupportCenter';
import { sessionFetch } from '../../lib/session';
export function HelpSupportHub(){return <SupportCenter request={sessionFetch}/>;}
