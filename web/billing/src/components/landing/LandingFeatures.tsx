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
      title: 'Atomic Multi-App Escrow',
      description: 'Your funds are secured within strict atomic transactions with explicit timeouts. Transparent dual-currency balances (USD & NGN) with zero hidden currency spreads.',
      badge: 'Atomic Locks'
    },
    {
      icon: CreditCard,
      title: 'Tokenized Card Security',
      description: 'Bank-grade PCI tokenization through Paystack with explicit user consent. We never store raw card numbers, CVVs, or unverified authorization credentials.',
      badge: 'Zero Storage Risk'
    },
    {
      icon: Building2,
      title: 'Transparent Bank Verification',
      description: 'Real-time account name resolution before any withdrawal attempt. Full pre-transaction disclosure of CBN statutory stamp charges and provider switch fees.',
      badge: 'Fee Disclosed Upfront'
    },
    {
      icon: Coins,
      title: 'Fund-Backed Rewards Utility',
      description: 'Ground all platform points in verifiable platform reserves. We reject speculative tokens and artificial pump-and-dump loops.',
      badge: 'Zero Speculation'
    },
    {
      icon: Sparkles,
      title: 'Fair Subscription Management',
      description: 'Transparent billing cycles with instant self-service cancellation. Zero deceptive renewal traps or hidden auto-debit loops.',
      badge: 'Human Autonomy'
    },
    {
      icon: FileText,
      title: 'Immutable Audit Accounting',
      description: 'Integer-cent precision ledger ensures mathematical accuracy. Every debit, credit, fee, and escrow release is tied to an immutable audit receipt.',
      badge: 'Mathematical Truth'
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
              Financial Stewardship &amp; Integrity
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
            Engineered for Creator Dignity &amp; Absolute Truth
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
            Every naira and dollar is stewarded with care. Atomic transactions, pre-disclosed bank transfer fees, and verifiable multi-signature reserves protect your work and capital.
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
