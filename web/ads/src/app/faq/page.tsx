import type { Metadata } from 'next';
import { AboutFooter, AboutNavigation } from '../about/AboutNavigation';
import { FaqContent } from './FaqContent';

export const metadata: Metadata = {
  title: 'FAQ — CrimFig Ads',
  description:
    'Frequently asked questions about advertising budgets, CPM and CPC pricing, promoter earnings, AdStation, and traffic protection on CrimFig Ads.',
};

export default function AdsFaqPage() {
  return (
    <div className="cf-marketing">
      <AboutNavigation />
      <FaqContent />
      <AboutFooter />
    </div>
  );
}
