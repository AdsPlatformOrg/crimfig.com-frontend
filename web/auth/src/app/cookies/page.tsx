import type { Metadata } from 'next';
import { LegalDocumentPage } from '../../../../../shared/ui/legal/LegalPages';

export const metadata: Metadata = {
  title: 'Cookie & Session Policy â€” CRIMFIG Auth',
  description: 'Strictly essential cookies and local storage used by CRIMFIG Auth.',
};

export default function AuthCookiesPage() {
  return <LegalDocumentPage kind="cookies" appName="CrimFig Auth" />;
}
