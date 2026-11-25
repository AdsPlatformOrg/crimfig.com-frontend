import type { Metadata } from 'next';
import { LegalDocumentPage } from '../../../../../shared/ui/legal/LegalPages';

export const metadata: Metadata = {
  title: 'Cookie & Session Policy â€” CRIMFIG Ads',
  description: 'Strictly essential cookies and local storage used by CRIMFIG Ads.',
};

export default function AdsCookiesPage() {
  return <LegalDocumentPage kind="cookies" appName="CrimFig Ads" />;
}
