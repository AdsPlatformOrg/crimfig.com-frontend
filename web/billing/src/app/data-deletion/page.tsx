import type { Metadata } from 'next';
import { LegalDocumentPage } from '../../../../../shared/ui/legal/LegalPages';

export const metadata: Metadata = {
  title: 'Data Deletion & Account Closure â€” CRIMFIG Billing',
  description: 'How to request personal data deletion and account closure on CRIMFIG.',
};

export default function BillingDataDeletionPage() {
  return <LegalDocumentPage kind="data-deletion" appName="CrimFig Billing" />;
}
