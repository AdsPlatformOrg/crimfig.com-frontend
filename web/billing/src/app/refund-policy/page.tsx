import type { Metadata } from 'next';
import { LegalDocumentPage } from '../../../../../shared/ui/legal/LegalPages';

export const metadata: Metadata = {
  title: 'Refund, Escrow & Payout Policy â€” CRIMFIG Billing',
  description: 'Wallet refund processing, escrow release, fees, and chargeback recovery terms for CRIMFIG.',
};

export default function BillingRefundPolicyPage() {
  return <LegalDocumentPage kind="refund-policy" appName="CrimFig Billing" />;
}
