import type { Metadata } from 'next';
import { AboutFooter, AboutNavigation } from '../about/AboutNavigation';
import { HowToUseGuide } from './HowToUseGuide';

export const metadata: Metadata = {
  title: 'How to Use — CrimFig Ads',
  description:
    'Step-by-step visual guide with screenshots and walkthrough clips for funding wallets, launching campaigns, verifying websites, and tracking earnings on CrimFig Ads.',
};

export default function HowToUsePage() {
  return (
    <div className="cf-marketing">
      <AboutNavigation />
      <HowToUseGuide />
      <AboutFooter />
    </div>
  );
}
