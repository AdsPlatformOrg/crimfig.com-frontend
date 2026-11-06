'use client';

import React from 'react';
import { Button } from '../ui/button';

interface LandingRewardsProps { onExploreRewards: () => void; }

export function LandingRewards({ onExploreRewards }: LandingRewardsProps) {
  return (
    <section id="rewards" style={{ padding: '48px 24px', backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: 'var(--text-primary)', margin: '0 0 16px' }}>Rewards availability</h2>
        <p style={{ fontSize: '16px', lineHeight: 1.6, color: 'var(--text-secondary)', margin: '0 0 24px' }}>Rewards, referrals and creator gifts are in development. Points issuance and redemption are currently unavailable.</p>
        <Button variant="outline" onClick={onExploreRewards}>View Rewards Status</Button>
      </div>
    </section>
  );
}
