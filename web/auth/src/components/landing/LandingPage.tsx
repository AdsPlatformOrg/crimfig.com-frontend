'use client';

import React from 'react';
import { LandingNavbar } from './LandingNavbar';
import { LandingHero } from './LandingHero';
import { LandingFeatures } from './LandingFeatures';
import { LandingFAQ } from './LandingFAQ';
import { LandingFooter } from './LandingFooter';

export function AuthLandingPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--bg-page)',
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-primary)',
      }}
    >
      <LandingNavbar />

      <main style={{ flex: 1 }}>
        <LandingHero />
        <LandingFeatures />
        <LandingFAQ />
      </main>

      <LandingFooter />
    </div>
  );
}
