import type { Metadata } from 'next';
import { LegalDocumentPage } from '../../../../../shared/ui/legal/LegalPages';

export const metadata: Metadata = {
  title: 'Terms of Use â€” CRIMFIG Billing',
  description: 'Terms of Use for CRIMFIG Billing, Wallets, Rewards, Ads, and Identity.',
};

export default function BillingTermsPage() {
  return <LegalDocumentPage kind="terms" appName="CrimFig Billing" />;
}
