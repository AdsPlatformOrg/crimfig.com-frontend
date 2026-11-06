'use client';

import React from 'react';
import { Card } from '../ui/card';
import { ShieldCheck, Lock, Server } from 'lucide-react';

export function LandingPartners() {
  const securityPillars = [
    {
      icon: ShieldCheck,
      title: 'Provider Checkout Consent',
      description: 'Review the amount and provider details before confirming checkout.'
    },
    {
      icon: Lock,
      title: 'Authenticated Financial Requests',
      description: 'Sign in to access your wallet and financial requests.'
    },
    {
      icon: Server,
      title: 'Immutable Escrow Audit Trails',
      description: 'Use transaction records to review charges, references and escrow activity.'
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
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '12px'
            }}
          >
            Security
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
            Account security
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
            Review checkout details and account activity from your authenticated dashboard. Bank withdrawals are currently unavailable.
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
              <Card
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
              </Card>
            );
          })}
        </div>


      </div>
    </section>
  );
}
