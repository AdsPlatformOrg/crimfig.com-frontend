'use client';

import React from 'react';
import { X, Lock, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import type { EscrowAllocation } from '../../../types/billing';

interface EscrowBreakdownDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  escrows: EscrowAllocation[];
  onReleaseEscrow?: (campaignId: string) => void;
}

export function EscrowBreakdownDrawer({
  isOpen,
  onClose,
  escrows,
  onReleaseEscrow,
}: EscrowBreakdownDrawerProps) {
  if (!isOpen) return null;

  const totalAllocated = escrows.reduce((sum, e) => sum + e.allocatedUsd, 0);
  const totalConsumed = escrows.reduce((sum, e) => sum + e.consumedUsd, 0);
  const totalRemaining = escrows.reduce((sum, e) => sum + e.remainingUsd, 0);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        backgroundColor: 'rgba(23, 27, 42, 0.65)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        justifyContent: 'flex-end',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '520px',
          height: '100%',
          backgroundColor: 'var(--bg-surface)',
          borderLeft: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-xl)',
          padding: '32px 24px',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'rgba(212, 20, 58, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-crimson)',
              }}
            >
              <Lock style={{ width: 18, height: 18 }} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                Campaign Escrow Ledger
              </h3>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>
                Locked advertiser budgets reserved for batch settlements
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              padding: '6px',
            }}
          >
            <X style={{ width: 20, height: 20 }} />
          </button>
        </div>

        {/* Aggregate Summary Card */}
        <div
          style={{
            backgroundColor: 'var(--bg-page)',
            borderRadius: '16px',
            padding: '16px',
            border: '1px solid var(--border-subtle)',
            marginBottom: '24px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '12px',
          }}
        >
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              Total Allocated
            </span>
            <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>
              ${totalAllocated.toFixed(2)}
            </span>
          </div>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              Consumed Burn
            </span>
            <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-crimson)' }}>
              ${totalConsumed.toFixed(2)}
            </span>
          </div>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              Locked Remaining
            </span>
            <span style={{ fontSize: '16px', fontWeight: 800, color: '#22c55e' }}>
              ${totalRemaining.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Campaign Escrows List */}
        <h4 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
          Active Campaign Reservations ({escrows.length})
        </h4>

        {escrows.length === 0 ? (
          <div
            style={{
              padding: '40px 20px',
              textAlign: 'center',
              backgroundColor: 'var(--bg-page)',
              borderRadius: '14px',
              border: '1px dashed var(--border-subtle)',
            }}
          >
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>
              No active campaign escrows reserved at this time.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {escrows.map((e) => (
              <div
                key={e.id}
                style={{
                  backgroundColor: 'var(--bg-page)',
                  borderRadius: '14px',
                  padding: '16px',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h5 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {e.campaignTitle || `Campaign ${e.campaignId.slice(0, 8)}`}
                  </h5>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      backgroundColor: e.status === 'active' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(23, 27, 42, 0.1)',
                      color: e.status === 'active' ? '#22c55e' : 'var(--text-secondary)',
                    }}
                  >
                    {e.status.toUpperCase()}
                  </span>
                </div>

                {/* Progress Bar */}
                <div style={{ width: '100%', height: '6px', borderRadius: '3px', backgroundColor: 'var(--border-subtle)', overflow: 'hidden', marginBottom: '10px' }}>
                  <div
                    style={{
                      width: `${Math.min(100, e.burnPercent)}%`,
                      height: '100%',
                      backgroundColor: 'var(--color-crimson)',
                      borderRadius: '3px',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  <span>Consumed: ${e.consumedUsd.toFixed(2)} ({e.burnPercent}%)</span>
                  <span>Remaining: <strong style={{ color: 'var(--text-primary)' }}>${e.remainingUsd.toFixed(2)}</strong></span>
                </div>

                {e.remainingUsd > 0 && onReleaseEscrow && (
                  <button
                    type="button"
                    onClick={() => onReleaseEscrow(e.campaignId)}
                    style={{
                      marginTop: '6px',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-surface)',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                    }}
                  >
                    Release Remaining to Available Wallet
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
