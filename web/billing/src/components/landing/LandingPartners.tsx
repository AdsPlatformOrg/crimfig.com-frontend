'use client';

import React from 'react';
import {
  ShieldCheck,
  Lock,
  Building2,
  CheckCircle2,
  Server,
  Zap,
  Globe,
  Award
} from 'lucide-react';

export function LandingPartners() {
  const supportedBanks = [
    { name: 'Guaranty Trust Bank', code: '058', type: 'Commercial Tier 1' },
    { name: 'Access Bank', code: '044', type: 'Commercial Tier 1' },
    { name: 'Zenith Bank', code: '057', type: 'Commercial Tier 1' },
    { name: 'United Bank for Africa', code: '033', type: 'Pan-African Tier 1' },
    { name: 'First Bank of Nigeria', code: '011', type: 'Commercial Tier 1' },
    { name: 'Kuda Microfinance Bank', code: '090267', type: 'Digital Bank' },
  ];

  const securityPillars = [
    {
      icon: ShieldCheck,
      title: 'Provider Checkout Consent',
      description: 'Zero unauthorized charges. All checkout sessions bind through Paystack with clear, upfront disclosures. We never charge a card without explicit owner consent.'
    },
    {
      icon: Lock,
      title: 'Authenticated Financial Requests',
      description: 'Your funds are guarded with atomic cryptographic safeguards. Sessions require multi-factor verification, and sensitive mutations trigger audit receipts.'
    },
    {
      icon: Zap,
      title: 'Transparent Bank Resolution',
      description: 'Instant account validation verifies account holder names directly with NIBSS before transfers occur, eliminating accidental loss or misrouted funds.'
    },
    {
      icon: Server,
      title: 'Immutable Escrow Audit Trails',
      description: 'Every kobo and cent is tracked on an immutable transaction ledger. You enjoy real-time clarity over cleared, pending, and released funds at all times.'
    }
  ];

  return (
    <section
      id="security"
      style={{
        padding: '80px 24px',
        backgroundColor: 'var(--bg-surface)',
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
            Mutual Trust &amp; Financial Peace of Mind
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
            Stewardship, Verification &amp; Creator Protection
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
            Every interaction is grounded in human dignity and radical transparency. Financial records, bank resolutions, and atomic escrows are built to safeguard your earnings without hidden spreads or surprises.
          </p>
        </div>

        {/* 4 Security Pillars */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            marginBottom: '56px',
          }}
        >
          {securityPillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="theme-card"
                style={{
                  padding: '24px',
                  borderRadius: '16px',
                  backgroundColor: 'var(--bg-page)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(212, 20, 58, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-crimson)',
                  }}
                >
                  <Icon style={{ width: 20, height: 20 }} />
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  {p.title}
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  {p.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Supported Commercial Banks Marquee */}
        <div
          className="theme-card"
          style={{
            padding: '32px',
            borderRadius: '20px',
            backgroundColor: 'var(--bg-page)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Example Bank Directory
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                Bank names below are examples. Use the dashboard provider list to check current availability.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--color-success)', fontWeight: 600 }}>
              <CheckCircle2 style={{ width: 14, height: 14 }} />
              <span>Payouts currently unavailable</span>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
              gap: '12px',
            }}
          >
            {supportedBanks.map((b, i) => (
              <div
                key={i}
                style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
              >
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {b.name}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
                  <span>Example code: {b.code}</span>
                  <span>{b.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
