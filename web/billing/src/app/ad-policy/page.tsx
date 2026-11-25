import type { Metadata } from 'next';
import { LegalDocumentPage } from '../../../../../shared/ui/legal/LegalPages';

export const metadata: Metadata = {
  title: 'Ad Content & Traffic Policy â€” CRIMFIG',
  description: 'Allowed and prohibited ad content, HTTPS landing page requirements, and traffic quality rules.',
};

export default function BillingAdPolicyPage() {
  return <LegalDocumentPage kind="ad-policy" appName="CrimFig Billing" />;
}
