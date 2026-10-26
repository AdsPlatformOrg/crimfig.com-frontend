'use client';

import React from 'react';
import Link from 'next/link';
import { AuthConsoleShell } from '../../components/AuthConsoleShell';
import { Key, Lock, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';

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
        <Card style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Key size={20} color="var(--color-crimson)" />
            <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Account Password</h2>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
            Choose a strong, unique password with at least 8 characters, numbers, and symbols.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Button asChild variant="outline" size="sm">
              <Link href="/forgot-password">Change Password</Link>
            </Button>
          </div>
        </Card>

        {/* 2FA Section */}
        <Card style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Lock size={20} color="var(--color-crimson)" />
            <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Multi-Factor Authentication (MFA)</h2>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
            Require a verification code from Google Authenticator, Authy, or 1Password when signing in from an unrecognized device.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Button asChild size="sm">
              <Link href="/mfa-challenge">Configure Authenticator App</Link>
            </Button>
          </div>
        </Card>
      </div>
    </AuthConsoleShell>
  );
}
