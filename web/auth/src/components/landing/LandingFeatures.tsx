'use client';

import React from 'react';
import { ShieldCheck, Key, Lock, Users, Smartphone, RefreshCw, Cpu, Database } from 'lucide-react';

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
      title: 'Two-Step Verification (2FA)',
      description:
        'Safeguard your wallet and business assets with Google Authenticator, Apple Passwords, Authy, or Microsoft Authenticator.',
    },
    {
      icon: <Users style={{ width: 22, height: 22, color: 'var(--color-crimson)' }} />,
      title: 'Team & Agency Workspaces',
      description:
        'Collaborate across marketing agencies and businesses. Delegate campaign publishing, wallet funding, and analytics without sharing personal passwords.',
    },
    {
      icon: <Cpu style={{ width: 22, height: 22, color: 'var(--color-crimson)' }} />,
      title: 'Instant Cross-Device Sync',
      description:
        'Switch effortlessly between your phone, tablet, and office computer. Your profile, balances, and permissions remain synchronized in real time.',
    },
    {
      icon: <RefreshCw style={{ width: 22, height: 22, color: 'var(--color-crimson)' }} />,
      title: 'Active Device & Login History',
      description:
        'View all authorized devices and locations connected to your profile. Terminate unrecognized logins with a single click from any smartphone or browser.',
    },
    {
      icon: <Database style={{ width: 22, height: 22, color: 'var(--color-crimson)' }} />,
      title: 'Strict Privacy & Data Protection',
      description:
        'Fully compliant with the Nigerian Data Protection Act (NDPA) and global privacy standards. Sensitive personal records remain confidential with zero third-party data sharing.',
    },
  ];

  return (
    <section
      id="features"
      style={{
        padding: '96px 24px',
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
            Digital Sanctuary &amp; Sovereign Stewardship
          </h2>
          <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Built for individuals who cherish privacy and teams that value structural clarity, psychological safety, and absolute zero data exploitation.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
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
