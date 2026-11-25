import type { Metadata } from 'next';
import { LegalDocumentPage } from '../../../../../shared/ui/legal/LegalPages';

export const metadata: Metadata = {
  title: 'Privacy Policy â€” CRIMFIG Billing',
  description: 'Privacy Policy and data protection compliance for CRIMFIG Billing.',
};

export default function BillingPrivacyPage() {
  return <LegalDocumentPage kind="privacy" appName="CrimFig Billing" />;
}
