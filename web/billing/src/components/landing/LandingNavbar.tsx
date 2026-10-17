'use client';

import React from 'react';
import { ArrowRight, Sparkles, Wallet, ShieldCheck, Gift } from 'lucide-react';
import { ThemeSwitcher } from '../ThemeSwitcher';
import { CrimFigLogo } from '../CrimFigLogo';

interface LandingNavbarProps {
  onLaunchConsole: (tab?: 'overview' | 'rewards') => void;
}

export function LandingNavbar({ onLaunchConsole }: LandingNavbarProps) {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'var(--bg-page)',
        borderBottom: '1px solid var(--border-subtle)',
        backdropFilter: 'blur(12px)',
        transition: 'all 0.2s ease',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 24px',
          height: '72px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand identity */}
        <CrimFigLogo
          variant="brand"
          size={42}
          app="Billing"
          appBadge="Fintech Engine"
          subtext="Multi-Currency Escrow, Instant Payouts & Rewards"
        />

        {/* Navigation Anchor Links */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '28px',
            fontSize: '14px',
            fontWeight: 500,
          }}
          className="landing-nav-links"
        >
          <a
            href="#features"
            style={{
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              transition: 'color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-crimson)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            Features
          </a>
          <a
            href="#rewards"
            style={{
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              transition: 'color 0.15s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-crimson)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            <Gift style={{ width: 14, height: 14, color: 'var(--color-crimson)' }} />
            <span>Rewards &amp; Cashback</span>
          </a>
          <a
            href="#calculator"
            style={{
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              transition: 'color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-crimson)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            FX Calculator
          </a>
          <a
            href="#security"
            style={{
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              transition: 'color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-crimson)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            Security &amp; Rails
          </a>
        </nav>

        {/* CTA & Theme Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ThemeSwitcher />

          <button
            type="button"
            onClick={() => onLaunchConsole('overview')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '10px',
              backgroundColor: 'var(--color-crimson)',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-crimson)',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            <Wallet style={{ width: 15, height: 15 }} />
            <span>Launch Console</span>
            <ArrowRight style={{ width: 14, height: 14 }} />
          </button>
        </div>
      </div>

      <style jsx>{`
        @media (min-width: 860px) {
          .landing-nav-links {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
}
