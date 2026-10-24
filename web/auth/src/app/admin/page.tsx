'use client';

import React from 'react';
import Link from 'next/link';
import { AuthAdminGuard } from '../../components/AuthAdminGuard';
import { ShieldCheck, UserCheck, ShieldAlert, ArrowLeft, Users, Lock } from 'lucide-react';

export default function AuthAdminPage() {
  return (
    <AuthAdminGuard>
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '32px 24px',
          fontFamily: "'Poppins', Arial, Helvetica, sans-serif",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '32px',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
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
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Identity &amp; Security Administration
              </h1>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                Restricted staff console for account lockouts, identity audit logs, and fine-grained authorization management.
              </p>
            </div>
          </div>
          <Link
            href="/dashboard"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-elevated)',
              color: 'var(--text-primary)',
              fontSize: '13px',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            <ArrowLeft size={14} />
            <span>Exit Admin</span>
          </Link>
        </div>

        {/* Operational Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
          }}
        >
          {/* Card 1: User Directory */}
          <div
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
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--color-crimson)',
                  backgroundColor: 'rgba(212, 20, 58, 0.08)',
                  padding: '4px 8px',
                  borderRadius: '6px',
                }}
              >
                Directory Service: Healthy
              </span>
            </div>
          </div>

          {/* Card 2: Security Audit Logs */}
          <div
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
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--color-crimson)',
                  backgroundColor: 'rgba(212, 20, 58, 0.08)',
                  padding: '4px 8px',
                  borderRadius: '6px',
                }}
              >
                Audit Stream: Online
              </span>
            </div>
          </div>
        </div>
      </div>
    </AuthAdminGuard>
  );
}
