"use client";
import { SupportCenter } from '../../../../../shared/ui/support/SupportCenter';
import { sessionFetch } from '../../lib/session';

export function HelpSupportHub({ admin = false }: { admin?: boolean }) {
  return <SupportCenter request={sessionFetch} admin={admin} />;
}
