'use client';

import React, { useState } from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Coins,
  Sparkles,
  Building2,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

interface LandingHeroProps {
  onLaunchConsole: (tab?: 'overview' | 'rewards') => void;
}

export function LandingHero({ onLaunchConsole }: LandingHeroProps) {
  const [demoAmount, setDemoAmount] = useState<number>(100);
  const fxRate = 1550;

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
          gridTemplateColumns: '1fr',
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
              Protected by Atomic Escrow • Zero Hidden Spreads
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
            Financial peace of mind.{' '}
            <span
              style={{
                background: 'var(--gradient-crimson)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Atomic escrow
            </span>{' '}
            &amp; absolute transparency.
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
            CrimFig Billing protects buyers, sellers, advertisers, and creators with atomic transactional integrity. Every fee is disclosed upfront, every transfer is verified, and genuine zero balances are honored honestly with zero hidden charges.
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
            <button
              type="button"
              onClick={() => onLaunchConsole('overview')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '14px 28px',
                borderRadius: '12px',
                backgroundColor: 'var(--color-crimson)',
                color: '#FFFFFF',
                fontSize: '15px',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-crimson)',
                transition: 'transform 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <Wallet style={{ width: 18, height: 18 }} />
              <span>Launch Billing Console</span>
              <ArrowRight style={{ width: 16, height: 16 }} />
            </button>

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
              <span>Explore Rewards &amp; Cashback</span>
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

        {/* Right Column: Interactive Financial Showcase Card */}
        <div style={{ width: '100%' }}>
          <div
            className="theme-card"
            style={{
              borderRadius: '24px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              padding: '32px',
              boxShadow: 'var(--shadow-xl)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Top decorative gradient glow */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'var(--gradient-crimson)',
              }}
            />

            {/* Header: Status & Live Rate */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--badge-bg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-crimson)',
                  }}
                >
                  <Wallet style={{ width: 16, height: 16 }} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Universal Wallet
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    Illustrative Wallet Preview
                  </div>
                </div>
              </div>

              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  backgroundColor: 'var(--color-success-bg)',
                  color: 'var(--color-success)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <CheckCircle2 style={{ width: 12, height: 12 }} />
                <span>Example Rate: ₦{fxRate.toLocaleString()}/$</span>
              </div>
            </div>

            {/* Dual Balance Display */}
            <div
              style={{
                padding: '20px',
                borderRadius: '16px',
                backgroundColor: 'var(--bg-page)',
                border: '1px solid var(--border-subtle)',
                marginBottom: '20px',
              }}
            >
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Simulated Balance
              </div>
              <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                ${demoAmount.toFixed(2)}{' '}
                <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-muted)' }}>USD</span>
              </div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-crimson)', marginTop: '2px' }}>
                ≈ ₦{(demoAmount * fxRate).toLocaleString()} NGN
              </div>

              {/* Slider for Interactive Feel */}
              <div style={{ marginTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  <span>Quick Test Amount</span>
                  <span>Drag to simulate: <strong>${demoAmount} USD</strong></span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="1000"
                  step="20"
                  value={demoAmount}
                  onChange={(e) => setDemoAmount(Number(e.target.value))}
                  style={{
                    width: '100%',
                    accentColor: 'var(--color-crimson)',
                    cursor: 'pointer',
                  }}
                />
              </div>
            </div>

            {/* Integrated Features Preview */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              <div
                style={{
                  padding: '14px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--bg-page)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  <Zap style={{ width: 14, height: 14, color: 'var(--color-crimson)' }} />
                  <span>Illustrative NGN Value</span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Illustrative conversion only. Bank withdrawals are unavailable.
                </div>
              </div>

              <div
                style={{
                  padding: '14px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--bg-page)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  <Sparkles style={{ width: 14, height: 14, color: '#F59E0B' }} />
                  <span>Rewards Engine</span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Example only. Rewards issuance and redemption are not available.
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => onLaunchConsole('overview')}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '12px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--color-crimson)',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-crimson)',
                }}
              >
                <ArrowDownLeft style={{ width: 15, height: 15 }} />
                <span>Deposit Funds</span>
              </button>

              <button
                type="button"
                onClick={() => onLaunchConsole('overview')}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '12px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--bg-page)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  fontWeight: 600,
                  border: '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                }}
              >
                <ArrowUpRight style={{ width: 15, height: 15 }} />
                <span>Check Withdrawal Availability</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (min-width: 960px) {
          .hero-grid {
            grid-template-columns: 1.15fr 0.85fr !important;
          }
        }
      `}</style>
    </section>
  );
}
