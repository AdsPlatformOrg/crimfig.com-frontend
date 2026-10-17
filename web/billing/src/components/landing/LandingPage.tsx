'use client';

import React from 'react';
import { LandingNavbar } from './LandingNavbar';
import { LandingHero } from './LandingHero';
import { LandingFeatures } from './LandingFeatures';
import { LandingRewards } from './LandingRewards';
import { LandingCalculator } from './LandingCalculator';
import { LandingPartners } from './LandingPartners';
import { LandingFooter } from './LandingFooter';

interface LandingPageProps {
  onLaunchConsole: (tab?: 'overview' | 'rewards') => void;
}

export function LandingPage({ onLaunchConsole }: LandingPageProps) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--bg-page)',
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-primary)',
      }}
    >
      <LandingNavbar onLaunchConsole={(tab) => onLaunchConsole(tab)} />

      <main style={{ flex: 1 }}>
        <LandingHero onLaunchConsole={(tab) => onLaunchConsole(tab)} />

        <LandingFeatures />

        <LandingRewards onExploreRewards={() => onLaunchConsole('rewards')} />

        <LandingCalculator onCalculate={() => onLaunchConsole('overview')} />

        <LandingPartners />
      </main>

      <LandingFooter onLaunchConsole={(tab) => onLaunchConsole(tab)} />
    </div>
  );
}
