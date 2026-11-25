import type { Metadata } from 'next';
import { LegalDocumentPage } from '../../../../../shared/ui/legal/LegalPages';

export const metadata: Metadata = {
  title: 'Privacy Policy â€” CRIMFIG Ads',
  description: 'Privacy Policy and data protection compliance for CRIMFIG Ads.',
};

export default function AdsPrivacyPage() {
  return <LegalDocumentPage kind="privacy" appName="CrimFig Ads" />;
}
