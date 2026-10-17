'use client';

import React from 'react';
import {
  Wallet,
  CreditCard,
  Building2,
  Sparkles,
  ShieldCheck,
  Zap,
  RefreshCw,
  Coins,
  FileText,
  Lock
} from 'lucide-react';

export function LandingFeatures() {
  const features = [
    {
      icon: Wallet,
      title: 'Dual-Currency Multi-App Escrow',
      description: 'Unified USD & NGN balance. Hold USD, convert at transparent live FX rates, and seamlessly fund campaigns, gifts, and services across all CrimFig apps.',
      badge: 'Core Engine'
    },
    {
      icon: CreditCard,
      title: 'Tokenized Card Vaults',
      description: 'Integrated with Paystack & Stripe Level-1 PCI-DSS vaults. Supports Visa, Mastercard, and Verve with 3D-Secure authentication and zero server-side card storage.',
      badge: 'PCI-DSS Level 1'
    },
    {
      icon: Building2,
      title: 'Sub-5s NUBAN Bank Payouts',
      description: 'Real-time account resolution and instant automated transfers to Nigerian commercial banks (GTBank, Access, Zenith, UBA, FirstBank, Kuda) with zero manual delay.',
      badge: '< 5s Latency'
    },
    {
      icon: Coins,
      title: 'Integrated Rewards & Cashback',
      description: 'Monetize Ads publisher shares, video gifts, and referrals. 100 Points = $1.00 USD, redeemable with a single click directly into your main spending wallet.',
      badge: '100 pts = $1'
    },
    {
      icon: Sparkles,
      title: 'Unified App Subscriptions',
      description: 'One card on file powers enterprise tiers for Chat, Creator badges for Stream, and commission-free features for Ads Studio without re-entering payment info.',
      badge: 'Zero Friction'
    },
    {
      icon: FileText,
      title: 'Immutable Ledger & Auditing',
      description: 'Every deposit, transfer, escrow lock, and withdrawal is recorded in a cryptographically verifiable double-entry transaction ledger with audit exports.',
      badge: 'Double-Entry'
    }
  ];

  return (
    <section
      id="features"
      style={{
        padding: '80px 24px',
        backgroundColor: 'var(--bg-page)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 56px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(212, 20, 58, 0.08)',
              border: '1px solid rgba(212, 20, 58, 0.2)',
              color: 'var(--color-crimson)',
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '12px'
            }}
          >
            Fintech Architecture
          </div>
          <h2
            style={{
              fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              margin: '0 0 16px',
            }}
          >
            Engineered for High-Velocity Creator &amp; Business Cashflow
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
            CrimFig Billing eliminates cross-border friction, banking delays, and isolated wallets with a single unified financial ledger designed specifically for the African digital creator economy.
          </p>
        </div>

        {/* Feature Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
          }}
        >
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="theme-card"
                style={{
                  padding: '28px',
                  borderRadius: '16px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'transform 0.2s ease, border-color 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.borderColor = 'var(--color-crimson)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      backgroundColor: 'var(--badge-bg)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--color-crimson)',
                    }}
                  >
                    <Icon style={{ width: 22, height: 22 }} />
                  </div>

                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '9999px',
                      backgroundColor: 'var(--badge-bg)',
                      color: 'var(--text-secondary)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    {feat.badge}
                  </span>
                </div>

                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 8px' }}>
                    {feat.title}
                  </h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                    {feat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
