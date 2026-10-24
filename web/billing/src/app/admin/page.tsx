'use client';

import React from 'react';
import Link from 'next/link';
import { SessionGate } from '../../components/SessionGate';
import { BillingAdminGuard } from '../../components/BillingAdminGuard';
import { ShieldCheck, RefreshCw, Layers, DollarSign, ArrowLeft } from 'lucide-react';

export default function BillingAdminPage() {
  return (
    <SessionGate>
      <BillingAdminGuard>
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
                  Billing Operations & Escrow Admin
                </h1>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                  Restricted staff control center for financial batch reconciliation, held earnings clearance, and settlement integrity.
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
            {/* Card 1: Batch Settlements */}
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
                <Layers size={20} color="var(--color-crimson)" />
                <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                  Batch Escrow Settlements
                </h2>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                Auditable event claim engine. Review held advertiser budgets, verified publisher impressions, and atomic settlement batch queues.
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
                  System Status: Active
                </span>
              </div>
            </div>

            {/* Card 2: Gateway Reconciliation */}
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
                <DollarSign size={20} color="var(--color-crimson)" />
                <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                  Payment Gateway Reconciliation
                </h2>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                Verify incoming Paystack and Stripe webhook receipts against Postgres ledger entries. Detect duplicate authorizations or missing callbacks.
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
                  Discrepancies: 0
                </span>
              </div>
            </div>

            {/* Card 3: Clearance Hold Engine */}
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
                <RefreshCw size={20} color="var(--color-crimson)" />
                <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                  72-Hour Clearance Hold Inspector
                </h2>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                Held publisher earnings currently completing 72-hour anti-fraud hold before release into available wallet balance.
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
                  Clearance Pipeline: Stable
                </span>
              </div>
            </div>
          </div>
        </div>
      </BillingAdminGuard>
    </SessionGate>
  );
}
