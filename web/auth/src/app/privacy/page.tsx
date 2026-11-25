import type { Metadata } from 'next';
import { LegalDocumentPage } from '../../../../../shared/ui/legal/LegalPages';

export const metadata: Metadata = {
  title: 'Privacy Policy â€” CRIMFIG Auth',
  description: 'Privacy Policy and data protection compliance for CRIMFIG.',
};

export default function AuthPrivacyPage() {
  return <LegalDocumentPage kind="privacy" appName="CrimFig Auth" />;
}
