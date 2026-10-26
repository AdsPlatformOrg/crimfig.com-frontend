'use client';

import React from 'react';
import Link from 'next/link';
import { AuthConsoleShell } from '../../components/AuthConsoleShell';
import { Smartphone, Monitor, ShieldAlert, LogOut, CheckCircle2 } from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';

export default function SessionsPage() {
  return (
    <AuthConsoleShell activePath="/sessions">
      <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
        <div>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-crimson)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Device Security
          </span>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0 8px' }}>
            Active Browser &amp; Device Sessions
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
            Review hardware devices, browsers, and IP locations that currently have access to your CrimFig account.
          </p>
        </div>

        {/* Current Active Session */}
        <Card style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(22, 163, 74, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16A34A' }}>
                <Monitor size={22} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0 }}>Current Web Browser</h3>
                  <Badge variant="secondary">
                    This Device
                  </Badge>
                </div>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Authenticated • Active Now</span>
              </div>
            </div>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
            Protected by rotating cryptographically signed JWT access tokens and secure HTTP-only refresh cookies.
          </p>
        </Card>

        {/* Remote Logout Danger Zone */}
        <Card variant="outline" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldAlert size={20} color="var(--color-crimson)" />
            <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Remote Session Invalidation</h2>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
            Lost a laptop or phone? Sign out of all other active sessions across all devices to protect your campaigns and billing balance.
          </p>
          <div>
            <Button asChild variant="destructive" size="sm">
              <Link href="/login">
                <LogOut size={14} />
                <span>Sign Out All Other Sessions</span>
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </AuthConsoleShell>
  );
}
