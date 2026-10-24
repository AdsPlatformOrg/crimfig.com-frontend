'use client';

import React from 'react';
import Link from 'next/link';
import { AuthConsoleShell } from '../../components/AuthConsoleShell';
import { ShieldCheck, UserCheck, Key, Lock, ExternalLink, Smartphone, Clock } from 'lucide-react';

export default function AuthDashboardPage() {
  return (
    <AuthConsoleShell activePath="/dashboard">
      <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
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

        {/* Status Highlights */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {/* Card 1: Session Status */}
          <div style={{ padding: '24px', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(22, 163, 74, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16A34A' }}>
                <ShieldCheck size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Zero-Trust SSO</h3>
                <span style={{ fontSize: '12px', color: '#16A34A', fontWeight: 600 }}>Active &amp; Guarded</span>
              </div>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
              Your session is verified with high-entropy cryptographic token rotation and client fingerprint checks.
            </p>
            <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
              <Link href="/sessions" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-crimson)', textDecoration: 'none' }}>
                Review Active Devices →
              </Link>
            </div>
          </div>

          {/* Card 2: 2FA MFA */}
          <div style={{ padding: '24px', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(212, 20, 58, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-crimson)' }}>
                <Lock size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Two-Factor (2FA)</h3>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Authenticator &amp; SMS</span>
              </div>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
              Add a second layer of security to prevent unauthorized access even if your password is compromised.
            </p>
            <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
              <Link href="/security" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-crimson)', textDecoration: 'none' }}>
                Configure 2FA &amp; Passkeys →
              </Link>
            </div>
          </div>

          {/* Card 3: Connected Apps */}
          <div style={{ padding: '24px', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3B82F6' }}>
                <Key size={22} />
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
              <Link href="/apps" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-crimson)', textDecoration: 'none' }}>
                Manage Authorizations →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AuthConsoleShell>
  );
}
