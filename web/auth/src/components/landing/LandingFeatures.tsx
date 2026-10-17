'use client';

import React from 'react';
import { ShieldCheck, Key, Lock, Users, Smartphone, RefreshCw, Cpu, Database } from 'lucide-react';

export function LandingFeatures() {
  const features = [
    {
      icon: <Lock style={{ width: 22, height: 22, color: 'var(--color-crimson)' }} />,
      title: '3-Layer Hybrid Auth Model',
      description:
        'HttpOnly SameSite strict session cookies combined with short-lived in-memory JWT tokens. Zero tokens stored in vulnerable localStorage or sessionStorage.',
    },
    {
      icon: <Smartphone style={{ width: 22, height: 22, color: 'var(--color-crimson)' }} />,
      title: 'Time-Based One-Time Passwords (MFA)',
      description:
        'Standard RFC 6238 TOTP engine. Compatible with Google Authenticator, Microsoft Authenticator, 1Password, and physical security keys.',
    },
    {
      icon: <Users style={{ width: 22, height: 22, color: 'var(--color-crimson)' }} />,
      title: 'Multi-Owner Organizations & Workspaces',
      description:
        'Manage campaigns, billing, and content as an organization. Invite team members with role-based permissions (Owner, Admin, Manager, Member).',
    },
    {
      icon: <Cpu style={{ width: 22, height: 22, color: 'var(--color-crimson)' }} />,
      title: 'High-Throughput OAuth2 & OIDC',
      description:
        'RFC 6749 compliant Authorization Code Grant with PKCE protection. Built for sub-millisecond token issuance and identity verification.',
    },
    {
      icon: <RefreshCw style={{ width: 22, height: 22, color: 'var(--color-crimson)' }} />,
      title: 'Active Session Governance & Device Revocation',
      description:
        'Real-time visibility into all active device sessions, IP geolocations, and browser user-agents. Instant single-click global sign-out.',
    },
    {
      icon: <Database style={{ width: 22, height: 22, color: 'var(--color-crimson)' }} />,
      title: 'NDPA 2023 & GDPR Privacy Compliance',
      description:
        'Strict Nigerian Data Protection Act (NDPA) and global privacy compliance. Sensitive personal records encrypted at rest with zero data sharing.',
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
            Engineered for Uncompromising Security & Scale
          </h2>
          <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Every interaction across the CrimFig Ecosystem is protected by multi-layered defensive cryptography and
            strict identity safeguards.
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
