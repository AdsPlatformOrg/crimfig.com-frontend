import type { Metadata } from 'next';
import { LegalDocumentPage } from '../../../../../shared/ui/legal/LegalPages';

export const metadata: Metadata = {
  title: 'Cookie & Session Policy â€” CRIMFIG Billing',
  description: 'Strictly essential cookies and local storage used by CRIMFIG Billing.',
};

export default function BillingCookiesPage() {
  return <LegalDocumentPage kind="cookies" appName="CrimFig Billing" />;
}
