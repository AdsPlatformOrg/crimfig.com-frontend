'use client';

import React from 'react';
import Link from 'next/link';
import { AuthConsoleShell } from '../../components/AuthConsoleShell';
import { Key, Lock, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function SecuritySettingsPage() {
  return (
    <AuthConsoleShell activePath="/security">
      <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
        <div>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-crimson)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Credentials &amp; Access Controls
          </span>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0 8px' }}>
            Security &amp; Two-Factor Authentication
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
            Protect your CrimFig identity with modern two-factor credentials, biometric passkeys, and robust password policies.
          </p>
        </div>

        {/* Password Section */}
        <div style={{ padding: '24px', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Key size={20} color="var(--color-crimson)" />
            <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Account Password</h2>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
            Choose a strong, unique password with at least 8 characters, numbers, and symbols.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link
              href="/forgot-password"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '8px 16px',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-page)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Change Password
            </Link>
          </div>
        </div>

        {/* 2FA Section */}
        <div style={{ padding: '24px', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Lock size={20} color="var(--color-crimson)" />
            <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Multi-Factor Authentication (MFA)</h2>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
            Require a verification code from Google Authenticator, Authy, or 1Password when signing in from an unrecognized device.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link
              href="/mfa-challenge"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '8px 16px',
                borderRadius: '8px',
                backgroundColor: 'var(--color-crimson)',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Configure Authenticator App
            </Link>
          </div>
        </div>
      </div>
    </AuthConsoleShell>
  );
}
