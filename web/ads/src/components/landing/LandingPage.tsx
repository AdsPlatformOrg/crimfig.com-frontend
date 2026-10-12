'use client';

import React from 'react';
import { LandingNavbar } from './LandingNavbar';
import { LandingHero } from './LandingHero';
import { LandingFeatures } from './LandingFeatures';
import { LandingPartners } from './LandingPartners';
import { LandingCalculator } from './LandingCalculator';
import { LandingFooter } from './LandingFooter';

interface LandingPageProps {
  onLaunchConsole: (defaultRole?: 'advertiser' | 'promoter', section?: string) => void;
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
      <LandingNavbar onLaunchConsole={() => onLaunchConsole('advertiser')} />

      <main style={{ flex: 1 }}>
        <LandingHero
          onStartAdvertising={() => onLaunchConsole('advertiser')}
          onBecomePromoter={() => onLaunchConsole('promoter')}
        />

        <LandingFeatures />

        <LandingPartners
          onJoinAsPromoter={(type) => onLaunchConsole('promoter', type)}
        />

        <LandingCalculator
          onStartEarning={() => onLaunchConsole('promoter')}
        />
      </main>

      <LandingFooter onLaunchConsole={(role) => onLaunchConsole(role)} />
    </div>
  );
}
