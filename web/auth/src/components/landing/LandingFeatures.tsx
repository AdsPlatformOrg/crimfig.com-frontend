'use client';

import React from 'react';
import { Lock, Users, Smartphone, RefreshCw, Cpu, Database } from 'lucide-react';

export function LandingFeatures() {
  const features = [
    {
      icon: <Lock style={{ width: 22, height: 22, color: 'var(--color-crimson)' }} />,
      title: 'Zero-Friction Single Sign-On',
      description:
        'Log in once on your phone or desktop and navigate between Ads, Billing, Reels, Stream, and Chat without repeatedly entering credentials.',
    },
    {
      icon: <Smartphone style={{ width: 22, height: 22, color: 'var(--color-crimson)' }} />,
      title: 'Two-Step Verification (Coming soon)',
      description:
        'Authenticator app setup is coming soon to add a second verification step for your wallet and business assets.',
    },
    {
      icon: <Users style={{ width: 22, height: 22, color: 'var(--color-crimson)' }} />,
      title: 'Team Workspaces (Coming soon)',
      description:
        'Shared workspaces and role-scoped member invitations for teams and agencies are coming soon.',
    },
    {
      icon: <Cpu style={{ width: 22, height: 22, color: 'var(--color-crimson)' }} />,
      title: 'Unified Account Sync',
      description:
        'Use the same CrimFig profile, avatar, and language settings across Auth, Ads, and Billing.',
    },
    {
      icon: <RefreshCw style={{ width: 22, height: 22, color: 'var(--color-crimson)' }} />,
      title: 'Protected Active Sessions',
      description:
        'Active sessions are protected by rotating refresh tokens; per-device session management is coming soon.',
    },
    {
      icon: <Database style={{ width: 22, height: 22, color: 'var(--color-crimson)' }} />,
      title: 'Privacy & Data Protection',
      description:
        'Review how your information is handled in our Privacy Policy.',
    },
  ];

  return (
    <section
      id="features"
      style={{
        padding: '64px 24px',
        backgroundColor: 'var(--bg-page)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 64px' }}>
          <h2
            style={{
              fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '-0.8px',
              marginBottom: '16px',
            }}
          >
            Your account, under your control
          </h2>
          <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Manage sign-in, security and team access from your CrimFig account.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: '28px',
          }}
        >
          {features.map((feat, idx) => (
            <div
              key={idx}
              style={{
                padding: '32px',
                borderRadius: '16px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                transition: 'transform 0.2s ease, border-color 0.2s ease',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--badge-bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                }}
              >
                {feat.icon}
              </div>
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: '12px',
                }}
              >
                {feat.title}
              </h3>
              <p
                style={{
                  fontSize: '14px',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {feat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
