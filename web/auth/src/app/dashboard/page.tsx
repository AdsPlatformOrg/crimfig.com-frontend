'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, UserCheck, Key, Lock, ArrowLeft, ExternalLink, Smartphone, Clock } from 'lucide-react';
import { ThemeSwitcher } from '../../components/ThemeSwitcher';
import { CrimFigLogo } from '../../components/CrimFigLogo';

export default function AuthDashboardPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-page)', color: 'var(--text-primary)' }}>
      {/* Header */}
      <header
        style={{
          borderBottom: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-page)',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '12px 24px', minHeight: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '8px',
                backgroundColor: 'var(--badge-bg)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                fontSize: '12px',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              <ArrowLeft style={{ width: 14, height: 14 }} />
              <span>Home</span>
            </Link>

            <CrimFigLogo variant="brand" size={38} app="Security" appBadge="Zero-Trust SSO" />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link
              href="/login"
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                backgroundColor: 'var(--color-crimson)',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: 700,
                textDecoration: 'none',
                boxShadow: 'var(--shadow-crimson)',
              }}
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 24px', width: '100%', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <div>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-crimson)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Account Management &amp; Security
          </span>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0 8px' }}>
            Security Dashboard
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
            Manage your single sign-on identity, active sessions, multi-factor authentication, and connected CrimFig portals.
          </p>
        </div>

        {/* Security Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          <div style={{ padding: '24px', borderRadius: '14px', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(212,20,58,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-crimson)' }}>
                <Key style={{ width: 18, height: 18 }} />
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Authentication</h3>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Password &amp; MFA</span>
              </div>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
              Hardware security keys, TOTP authenticator apps, and password rotation.
            </p>
            <div style={{ display: 'flex', gap: '10px', marginTop: 'auto', paddingTop: '10px' }}>
              <Link href="/forgot-password" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-crimson)', textDecoration: 'none' }}>
                Reset Password →
              </Link>
            </div>
          </div>

          <div style={{ padding: '24px', borderRadius: '14px', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-success)' }}>
                <Clock style={{ width: 18, height: 18 }} />
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Active Sessions</h3>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Cross-Subdomain Tokens</span>
              </div>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
              Continuous session verification across *.crimfig.com with rotation family revocation.
            </p>
            <div style={{ display: 'flex', gap: '10px', marginTop: 'auto', paddingTop: '10px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-success)' }}>
                ● Current Device Verified
              </span>
            </div>
          </div>

          <div style={{ padding: '24px', borderRadius: '14px', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3B82F6' }}>
                <Smartphone style={{ width: 18, height: 18 }} />
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Connected Apps</h3>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Single Identity</span>
              </div>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
              Seamlessly sign in to Ads Studio, Billing &amp; Escrow, and Creator Portals.
            </p>
            <div style={{ display: 'flex', gap: '16px', marginTop: 'auto', paddingTop: '10px' }}>
              <a href="https://ads.crimfig.com" target="_blank" rel="noreferrer" style={{ fontSize: '12px', fontWeight: 600, color: '#3B82F6', textDecoration: 'none' }}>
                Ads Studio ↗
              </a>
              <a href="https://billing.crimfig.com" target="_blank" rel="noreferrer" style={{ fontSize: '12px', fontWeight: 600, color: '#3B82F6', textDecoration: 'none' }}>
                Billing ↗
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Auth Dashboard Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-elevated)',
          padding: '18px 24px',
          marginTop: 'auto',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            fontSize: '12px',
            color: 'var(--text-muted)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>CrimFig Central Auth</span>
            <span>•</span>
            <span>© {new Date().getFullYear()} CrimFig Technologies</span>
          </div>

          <ThemeSwitcher showLabel labelPrefix="Theme:" />
        </div>
      </footer>
    </div>
  );
}
