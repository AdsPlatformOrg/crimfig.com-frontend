'use client';

import React from 'react';
import { LandingNavbar } from './LandingNavbar';
import { LandingHero } from './LandingHero';
import { LandingFeatures } from './LandingFeatures';
import { LandingSecurityDemo } from './LandingSecurityDemo';
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
        <LandingSecurityDemo />
        <LandingFAQ />
      </main>

      <LandingFooter />
    </div>
  );
}
