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
      description: 'View your USD wallet and a quoted NGN equivalent. Funding and campaign escrow use server-confirmed records; other ecosystem payment features remain in development.',
      badge: 'Core Engine'
    },
    {
      icon: CreditCard,
      title: 'Tokenized Card Vaults',
      description: 'Paystack checkout can save a reusable authorization with your consent. Saved-card charging and Stripe payments are not currently available.',
      badge: 'Explicit Consent'
    },
    {
      icon: Building2,
      title: 'Nigerian Bank Account Checks',
      description: 'Resolve supported bank account details before saving an account. Withdrawals are currently unavailable; no payout speed is promised.',
      badge: 'Account Resolution'
    },
    {
      icon: Coins,
      title: 'Integrated Rewards & Cashback',
      description: 'Rewards and referral features are planned. Points issuance, cash conversion and redemption are not currently available.',
      badge: 'Planned'
    },
    {
      icon: Sparkles,
      title: 'Unified App Subscriptions',
      description: 'Browse available app plans and existing subscription records. Subscription charging and activation are not currently available.',
      badge: 'Plan Catalog'
    },
    {
      icon: FileText,
      title: 'Transaction History',
      description: 'Review recorded funding and campaign escrow transactions. Pending records remain pending until confirmed by the server.',
      badge: 'Recorded Activity'
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
            Review confirmed funding and campaign escrow records. Feature availability is shown in the dashboard; unconfirmed operations do not create a balance.
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
