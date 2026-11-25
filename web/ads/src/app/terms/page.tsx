import type { Metadata } from 'next';
import { LegalDocumentPage } from '../../../../../shared/ui/legal/LegalPages';

export const metadata: Metadata = {
  title: 'Terms of Use â€” CRIMFIG Ads',
  description: 'Terms of Use for CRIMFIG Ads, Billing & Rewards, and Identity Services.',
};

export default function AdsTermsPage() {
  return <LegalDocumentPage kind="terms" appName="CrimFig Ads" />;
}
