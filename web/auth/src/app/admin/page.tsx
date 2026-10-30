'use client';

import React from 'react';
import Link from 'next/link';
import { AuthAdminGuard } from '../../components/AuthAdminGuard';
import { ShieldCheck, ShieldAlert, ArrowLeft, Users, Activity } from 'lucide-react';
import { Badge, Button, Card } from '../../components/ui';

export default function AuthAdminPage() {
  return (
    <AuthAdminGuard>
      {(staff) => {
        const isSuperAdmin = Array.isArray(staff?.roles) && staff.roles.includes('super_admin');
        return (
      <div
        style={{
          maxWidth: '1200px',
          width: '100%',
          boxSizing: 'border-box',
          margin: '0 auto',
          padding: '32px 24px',
          fontFamily: "'Poppins', Arial, Helvetica, sans-serif",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '32px',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1 1 260px', minWidth: 0 }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                flexShrink: 0,
                borderRadius: '12px',
                backgroundColor: 'rgba(212, 20, 58, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-crimson)',
              }}
            >
              <ShieldCheck size={24} />
            </div>
            <div style={{ minWidth: 0, overflowWrap: 'anywhere' }}>
              <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Identity &amp; Security Administration
              </h1>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                Restricted staff console for account lockouts, identity audit logs, and fine-grained authorization management.
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
            {isSuperAdmin && (
              <Button asChild>
                <Link href="/admin/error-monitor">
                  <Activity size={14} />
                  <span>Error Monitor</span>
                </Link>
              </Button>
            )}
            <Button
              asChild
              variant="outline"
            >
              <Link href="/dashboard">
                <ArrowLeft size={14} />
                <span>Exit Admin</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Operational Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
            gap: '24px',
          }}
        >
          {/* Card 1: User Directory */}
          <Card
            style={{
              padding: '24px',
              backgroundColor: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Users size={20} color="var(--color-crimson)" />
              <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                User Directory &amp; Status
              </h2>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
              Search platform accounts, inspect verification states (Email, Phone, KYC), and manage account locks.
            </p>
            <div style={{ marginTop: 'auto', paddingTop: '12px' }}>
              <Badge variant="secondary" style={{ textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-crimson)' }}>
                Directory Service: Healthy
              </Badge>
            </div>
          </Card>

          {/* Card 2: Security Audit Logs */}
          <Card
            style={{
              padding: '24px',
              backgroundColor: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldAlert size={20} color="var(--color-crimson)" />
              <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                Authentication Audit Trail
              </h2>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
              Review failed login attempts, anomalous IP rate-limiting triggers, and credential rotation timestamps.
            </p>
            <div style={{ marginTop: 'auto', paddingTop: '12px' }}>
              <Badge variant="secondary" style={{ textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-crimson)' }}>
                Audit Stream: Online
              </Badge>
            </div>
          </Card>

          {/* Card 3: Platform Error Monitor (super_admin only) */}
          {isSuperAdmin && (
            <Card
              style={{
                padding: '24px',
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Activity size={20} color="var(--color-crimson)" />
                <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                  Platform Error Monitor
                </h2>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                Inspect sanitized HTTP 4xx/5xx error groups across Auth, Ads, and Billing, trace correlated request IDs, and audit email alert suppression windows.
              </p>
              <div style={{ marginTop: 'auto', paddingTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
                <Badge variant="secondary" style={{ textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-crimson)' }}>
                  Platform Admin Only
                </Badge>
                <Button asChild size="sm" variant="outline">
                  <Link href="/admin/error-monitor">Open Error Monitor</Link>
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
        );
      }}
    </AuthAdminGuard>
  );
}
