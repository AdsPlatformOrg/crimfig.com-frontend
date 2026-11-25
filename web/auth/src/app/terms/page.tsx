import type { Metadata } from 'next';
import { LegalDocumentPage } from '../../../../../shared/ui/legal/LegalPages';

export const metadata: Metadata = {
  title: 'Terms of Use â€” CRIMFIG Auth',
  description: 'Terms of Use for CRIMFIG Identity, Ads, and Billing services.',
};

export default function AuthTermsPage() {
  return <LegalDocumentPage kind="terms" appName="CrimFig Auth" />;
}
