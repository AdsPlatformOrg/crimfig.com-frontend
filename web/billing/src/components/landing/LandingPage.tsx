'use client';

import { LandingNavbar } from './LandingNavbar';
import { LandingHero } from './LandingHero';
import { LandingRewards } from './LandingRewards';
import { LandingFooter } from './LandingFooter';

export function LandingPage({ onLaunchConsole }: { onLaunchConsole: (tab?: 'overview' | 'rewards') => void }) {
  return (
    <div className="cf-marketing">
      <LandingNavbar onLaunchConsole={onLaunchConsole} />
      <main>
        <LandingHero onLaunchConsole={() => onLaunchConsole('overview')} />
        <LandingRewards onExploreRewards={() => onLaunchConsole('rewards')} />
      </main>
      <LandingFooter onLaunchConsole={onLaunchConsole} />
    </div>
  );
}
