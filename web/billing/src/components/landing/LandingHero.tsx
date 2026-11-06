'use client';

import React from 'react';
import { ArrowRight, ShieldCheck, Zap, Wallet, Coins, Building2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

interface LandingHeroProps {
  onLaunchConsole: (tab?: 'overview' | 'rewards') => void;
}

export function LandingHero({ onLaunchConsole }: LandingHeroProps) {

  return (
    <section
      style={{
        position: 'relative',
        padding: '72px 24px 80px',
        overflow: 'hidden',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(212, 20, 58, 0.08), transparent 70%)',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr)',
          gap: '48px',
          alignItems: 'center',
        }}
        className="hero-grid"
      >
        {/* Left Column: Messaging & CTAs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Eyebrow badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', width: 'fit-content' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(212, 20, 58, 0.08)',
                border: '1px solid rgba(212, 20, 58, 0.2)',
                color: 'var(--color-crimson)',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              <Zap style={{ width: 14, height: 14 }} />
              CrimFig Billing
            </span>
          </div>

          {/* Headline */}
          <h1
            style={{
              fontSize: 'clamp(2.25rem, 5vw, 3.5rem)',
              fontWeight: 800,
              lineHeight: 1.12,
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
              margin: 0,
            }}
          >
            Your CrimFig wallet.{' '}
            <span
              style={{
                background: 'var(--gradient-crimson)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Funding, escrow
            </span>{' '}
            &amp; transaction history.
          </h1>

          {/* Subheading */}
          <p
            style={{
              fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              margin: 0,
              maxWidth: '640px',
            }}
          >
            Manage wallet funding, campaign escrow and transaction history. Check current payment availability and funding quotes in your dashboard.
          </p>

          {/* CTAs */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '14px',
              paddingTop: '8px',
            }}
          >
            <Button
              type="button"
              onClick={() => onLaunchConsole('overview')}
              size="lg"
            >
              <Wallet style={{ width: 18, height: 18 }} />
              <span>Launch Billing Console</span>
              <ArrowRight style={{ width: 16, height: 16 }} />
            </Button>

            <a
              href="#rewards"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '14px 26px',
                borderRadius: '12px',
                backgroundColor: 'var(--badge-bg)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                fontSize: '15px',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-crimson)';
                e.currentTarget.style.color = 'var(--color-crimson)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.color = 'var(--text-primary)';
              }}
            >
              <Coins style={{ width: 18, height: 18, color: 'var(--color-crimson)' }} />
              <span>Rewards Status</span>
            </a>
          </div>

          {/* Trust proof points */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '24px',
              paddingTop: '16px',
              borderTop: '1px solid var(--border-subtle)',
              fontSize: '13px',
              color: 'var(--text-muted)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck style={{ width: 16, height: 16, color: 'var(--color-success)' }} />
              <span>Authenticated Account Access</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Zap style={{ width: 16, height: 16, color: 'var(--color-crimson)' }} />
              <span>Withdrawals Currently Unavailable</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Building2 style={{ width: 16, height: 16, color: 'var(--color-info)' }} />
              <span>Server-Confirmed Funding Quotes</span>
            </div>
          </div>
        </div>

        <Card style={{ padding: '32px', borderRadius: '20px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
          <Wallet size={28} style={{ color: 'var(--color-crimson)', marginBottom: '20px' }} aria-hidden="true" />
          <h2 style={{ fontSize: '22px', margin: '0 0 16px', color: 'var(--text-primary)' }}>Before you get started</h2>
          <p style={{ fontSize: '16px', lineHeight: 1.6, color: 'var(--text-secondary)', margin: '0 0 16px' }}>Sign in to view your balance, funding options and transaction history.</p>
          <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--text-secondary)', margin: 0 }}>Bank withdrawals and rewards redemption are currently unavailable. Review provider-confirmed quotes before funding your wallet.</p>
        </Card>
      </div>

      <style jsx>{`
        @media (min-width: 960px) {
          .hero-grid {
            grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr) !important;
          }
        }
      `}</style>
    </section>
  );
}
