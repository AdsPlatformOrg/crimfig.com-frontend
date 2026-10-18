'use client';

import React from 'react';
import { Wallet, ShieldCheck, ArrowRight, ExternalLink } from 'lucide-react';
import { CrimFigLogo } from '../CrimFigLogo';

interface LandingFooterProps {
  onLaunchConsole: (tab?: 'overview' | 'rewards') => void;
}

export function LandingFooter({ onLaunchConsole }: LandingFooterProps) {
  return (
    <footer
      style={{
        backgroundColor: 'var(--bg-page)',
        borderTop: '1px solid var(--border-subtle)',
        padding: '64px 24px 32px',
        color: 'var(--text-secondary)',
        fontSize: '13px',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '40px',
            marginBottom: '48px',
          }}
        >
          {/* Brand Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <CrimFigLogo
              variant="brand"
              size={38}
              app="Billing"
            />

            <p style={{ margin: 0, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
              Universal multi-currency escrow, instant Nigerian bank payouts, automated subscriptions, and creator rewards for the CrimFig ecosystem.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-success)', fontSize: '12px', fontWeight: 600 }}>
              <ShieldCheck style={{ width: 14, height: 14 }} />
              <span>PCI-DSS Level 1 &amp; NIBSS Rails</span>
            </div>
          </div>

          {/* Column 1: Financial Platform */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Platform
            </div>
            <a href="#features" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Dual-Currency Escrow</a>
            <a href="#rewards" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Rewards &amp; Cashback</a>
            <a href="#calculator" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>FX Rate Calculator</a>
            <a href="#security" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Commercial Bank Rails</a>
            <button
              type="button"
              onClick={() => onLaunchConsole('overview')}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                textAlign: 'left',
                color: 'var(--color-crimson)',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '13px',
              }}
            >
              Open Console &rarr;
            </button>
          </div>

          {/* Column 2: Ecosystem Apps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Ecosystem
            </div>
            <a
              href="https://ads.crimfig.com"
              target="_blank"
              rel="noreferrer"
              style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <span>Ads Studio</span>
              <ExternalLink style={{ width: 12, height: 12 }} />
            </a>
            <a
              href="https://auth.crimfig.com"
              target="_blank"
              rel="noreferrer"
              style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <span>Auth &amp; SSO Identity</span>
              <ExternalLink style={{ width: 12, height: 12 }} />
            </a>
            <span style={{ color: 'var(--text-muted)' }}>Stream &amp; Social (Live Tips)</span>
            <span style={{ color: 'var(--text-muted)' }}>Chat Enterprise</span>
          </div>

          {/* Column 3: Legal & Regulatory */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Compliance &amp; Terms
            </div>
            <span style={{ color: 'var(--text-secondary)' }}>CBN Regulatory Alignment</span>
            <span style={{ color: 'var(--text-secondary)' }}>Escrow &amp; Dispute Policy</span>
            <span style={{ color: 'var(--text-secondary)' }}>NUBAN Real-Time Settlement</span>
            <span style={{ color: 'var(--text-secondary)' }}>Privacy &amp; Data Security</span>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '24px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            fontSize: '12px',
            color: 'var(--text-muted)',
          }}
        >
          <div>
            &copy; 2026 CrimFig Ecosystem Ltd. All rights reserved. Registered under Nigerian Corporate Affairs Commission.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              type="button"
              onClick={() => onLaunchConsole('rewards')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-crimson)',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '12px',
              }}
            >
              Explore Rewards Program &rarr;
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
