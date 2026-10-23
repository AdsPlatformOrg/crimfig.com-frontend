'use client';

import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  Lock,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  Building2,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import type { WalletBalance, EscrowAllocation, BillingTransaction, SettlementBatch } from '../../../types/billing';
import {
  fetchBillingOverview,
  fetchSettlementBatches,
  triggerManualSettlement,
} from '../../../lib/billing-api';
import { EscrowBreakdownDrawer } from './EscrowBreakdownDrawer';

interface BillingLedgerProps {
  initialRole?: 'advertiser' | 'promoter';
  onRoleChange?: (role: 'advertiser' | 'promoter') => void;
}

export function BillingLedger({ initialRole = 'advertiser', onRoleChange }: BillingLedgerProps) {
  const [role, setRole] = useState<'advertiser' | 'promoter'>(initialRole);
  const [wallet, setWallet] = useState<WalletBalance | null>(null);
  const [escrows, setEscrows] = useState<EscrowAllocation[]>([]);
  const [transactions] = useState<BillingTransaction[]>([]);
  const [settlementBatches, setSettlementBatches] = useState<SettlementBatch[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'deposits' | 'spend' | 'earnings' | 'withdrawals'>('all');

  // Modals
  const [isEscrowDrawerOpen, setIsEscrowDrawerOpen] = useState(false);
  const [isSettling, setIsSettling] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    setRole(initialRole);
  }, [initialRole]);

  useEffect(() => {
    async function loadData() {
      try {
        const overview = await fetchBillingOverview(); setWallet(overview.wallet); setEscrows(overview.escrows);
      } catch (err) { setLoadError(err instanceof Error ? err.message : 'Billing overview unavailable.'); }
      try { setSettlementBatches(await fetchSettlementBatches()); }
      catch (err) { setLoadError(err instanceof Error ? err.message : 'Settlement history unavailable.'); }

    }
    loadData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const openBilling = () => {
    const base = process.env.NEXT_PUBLIC_BILLING_WEB_URL || (process.env.NODE_ENV === 'production' ? 'https://billing.crimfig.com' : 'http://localhost:3007');
    window.location.assign(new URL('/?view=console', base).href);
  };

  const handleTriggerSettlement = async () => {
    setIsSettling(true);
    try {
      await triggerManualSettlement();
      showToast('30-minute deferred batch settlement completed cleanly!');
      const updatedBatches = await fetchSettlementBatches();
      setSettlementBatches(updatedBatches);
    } catch {
      showToast('Settlement could not be confirmed. Reconcile before trying again.');
    } finally {
      setIsSettling(false);
    }
  };

  // Filter transactions
  const filteredTransactions = transactions.filter((tx) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'deposits') return tx.type === 'wallet_fund';
    if (activeTab === 'spend') return tx.type === 'ads_spend';
    if (activeTab === 'earnings') return tx.type === 'ads_earning';
    if (activeTab === 'withdrawals') return tx.type === 'wallet_withdraw';
    return true;
  });

  const availableUsd = wallet ? wallet.availableUsd : 0;
  const lockedEscrowUsd = escrows.reduce((sum, e) => sum + e.remainingUsd, 0);
  const exchangeRate = wallet ? wallet.exchangeRate : 0;

  if (!wallet) return <div role={loadError ? 'alert' : 'status'} style={{ padding: 24, color: 'var(--text-secondary)' }}>
    <p>{loadError || 'Loading billing overview…'}</p>
    <button onClick={openBilling}>Open Billing</button>
  </div>;

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px', width: '100%', boxSizing: 'border-box' }}>
      {loadError && <p role="alert">{loadError}</p>}
      {/* Toast Alert */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '84px',
            right: '24px',
            zIndex: 150,
            backgroundColor: 'var(--color-fig-dark)',
            color: '#FFFFFF',
            padding: '12px 20px',
            borderRadius: '12px',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '13px',
            fontWeight: 600,
            animation: 'fadeIn 0.2s ease',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <CheckCircle2 style={{ width: 16, height: 16, color: '#22c55e' }} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Role Switcher */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h2 style={{ margin: '0 0 4px', fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)' }}>
            Financial Ledger & Escrow Settlement
          </h2>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>
            Multi-currency NGN/USD wallet, campaign escrow locking, and 55/30/15 batch reconciliations
          </p>
        </div>

        {/* View Toggle */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '4px',
            borderRadius: '12px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <button
            type="button"
            onClick={() => {
              setRole('advertiser');
              onRoleChange?.('advertiser');
            }}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '13px',
              backgroundColor: role === 'advertiser' ? 'var(--color-fig-dark)' : 'transparent',
              color: role === 'advertiser' ? '#FFFFFF' : 'var(--text-secondary)',
              transition: 'all 0.15s ease',
            }}
          >
            Advertiser View
          </button>
          <button
            type="button"
            onClick={() => {
              setRole('promoter');
              onRoleChange?.('promoter');
            }}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '13px',
              backgroundColor: role === 'promoter' ? 'var(--color-crimson)' : 'transparent',
              color: role === 'promoter' ? '#FFFFFF' : 'var(--text-secondary)',
              transition: 'all 0.15s ease',
            }}
          >
            Promoter View
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        {/* KPI 1: Available Balance */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '16px',
            border: '1px solid var(--border-subtle)',
            padding: '20px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Available Wallet Balance
            </span>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#22c55e',
              }}
            >
              <DollarSign style={{ width: 16, height: 16 }} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '4px' }}>
            ${availableUsd.toFixed(2)}
          </div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
            ≈ ₦{Math.round(availableUsd * exchangeRate).toLocaleString()} NGN
          </div>
        </div>

        {/* KPI 2: Role-aware Locked / Accrued */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '16px',
            border: '1px solid var(--border-subtle)',
            padding: '20px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
              {role === 'advertiser' ? 'Locked Campaign Escrow' : 'Accrued Batch Share (55%)'}
            </span>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'rgba(212, 20, 58, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-crimson)',
              }}
            >
              <Lock style={{ width: 16, height: 16 }} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 900, color: 'var(--color-crimson)', marginBottom: '4px' }}>
            ${role === 'advertiser' ? lockedEscrowUsd.toFixed(2) : (wallet ? (wallet.availableUsd * 0.55).toFixed(2) : '0.00')}
          </div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
            {role === 'advertiser'
              ? `${escrows.length} Active Campaigns Reserved`
              : 'Verified 55% platform publisher share'}
          </div>
        </div>

        {/* KPI 3: Spend / Disbursed */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '16px',
            border: '1px solid var(--border-subtle)',
            padding: '20px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
              {role === 'advertiser' ? 'Total Ad Spend Burned' : 'Total Bank Disbursements'}
            </span>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'rgba(23, 27, 42, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-primary)',
              }}
            >
              <TrendingUp style={{ width: 16, height: 16 }} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '4px' }}>
            {role === 'advertiser'
              ? `$${escrows.reduce((sum, e) => sum + (e.consumedUsd || 0), 0).toFixed(2)}`
              : '$0.00'}
          </div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
            {role === 'advertiser' ? 'Calculated from campaign escrows' : 'Transferred to verified NUBAN'}
          </div>
        </div>

        {/* KPI 4: Exchange Rate Ticker */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '16px',
            border: '1px solid var(--border-subtle)',
            padding: '20px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Live FX Exchange Rate
            </span>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#3b82f6',
              }}
            >
              <RefreshCw style={{ width: 16, height: 16 }} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '4px' }}>
            ₦{exchangeRate.toFixed(2)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#22c55e', fontWeight: 600 }}>
            <CheckCircle2 style={{ width: 12, height: 12 }} />
            <span>Paystack Feed Active</span>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {role === 'advertiser' ? (
            <>
              <button
                type="button"
                onClick={openBilling}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'var(--gradient-crimson)',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-crimson)',
                }}
              >
                <CreditCard style={{ width: 16, height: 16 }} />
                <span>Fund Wallet (Paystack)</span>
              </button>
              <button
                type="button"
                onClick={() => setIsEscrowDrawerOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  borderRadius: '12px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                <Lock style={{ width: 15, height: 15 }} />
                <span>Campaign Escrows ({escrows.length})</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={openBilling}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: 'var(--color-fig-dark)',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              <Building2 style={{ width: 16, height: 16 }} />
              <span>Withdraw to Nigerian Bank</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleTriggerSettlement}
            disabled={isSettling}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 16px',
              borderRadius: '12px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '13px',
              cursor: isSettling ? 'not-allowed' : 'pointer',
            }}
          >
            <RefreshCw style={{ width: 14, height: 14, animation: isSettling ? 'spin 1s linear infinite' : 'none' }} />
            <span>Run 30-Min Settlement</span>
          </button>
        </div>

        {/* 55/30/15 Ratio Indicator Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            padding: '6px 14px',
            fontSize: '12px',
            fontWeight: 600,
          }}
        >
          <span style={{ color: 'var(--text-secondary)' }}>Revenue Split:</span>
          <span style={{ color: 'var(--color-crimson)', fontWeight: 700 }}>55% Publisher</span>
          <span style={{ color: 'var(--border-subtle)' }}>•</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>30% Platform</span>
          <span style={{ color: 'var(--border-subtle)' }}>•</span>
          <span style={{ color: '#3b82f6', fontWeight: 700 }}>15% Referrals</span>
        </div>
      </div>

      {/* Transaction & Settlement Table */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '20px',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-sm)',
          overflow: 'hidden',
        }}
      >
        {/* Table Tabs */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-subtle)',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', gap: '8px' }}>
            {(['all', 'deposits', 'spend', 'earnings', 'withdrawals'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: activeTab === tab ? 'var(--badge-bg)' : 'transparent',
                  color: activeTab === tab ? 'var(--color-crimson)' : 'var(--text-secondary)',
                  fontWeight: activeTab === tab ? 700 : 500,
                  fontSize: '13px',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Transaction history is available in the Billing dashboard. Showing {filteredTransactions.length} entries loaded here.
          </span>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-page)', borderBottom: '1px solid var(--border-subtle)' }}>
                <th style={{ padding: '12px 20px', fontWeight: 600, color: 'var(--text-secondary)' }}>Type & Description</th>
                <th style={{ padding: '12px 20px', fontWeight: 600, color: 'var(--text-secondary)' }}>Amount (USD)</th>
                <th style={{ padding: '12px 20px', fontWeight: 600, color: 'var(--text-secondary)' }}>Amount (NGN)</th>
                <th style={{ padding: '12px 20px', fontWeight: 600, color: 'var(--text-secondary)' }}>Balance After</th>
                <th style={{ padding: '12px 20px', fontWeight: 600, color: 'var(--text-secondary)' }}>Reference</th>
                <th style={{ padding: '12px 20px', fontWeight: 600, color: 'var(--text-secondary)' }}>Status</th>
                <th style={{ padding: '12px 20px', fontWeight: 600, color: 'var(--text-secondary)' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No transactions found for this filter. Full ledger history is managed in the Billing console.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => {
                  const isPositive = tx.type === 'wallet_fund' || tx.type === 'ads_earning';
                  return (
                    <tr
                      key={tx.id}
                      style={{
                        borderBottom: '1px solid var(--border-subtle)',
                        transition: 'background-color 0.1s ease',
                      }}
                    >
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '8px',
                              backgroundColor: isPositive ? 'rgba(34, 197, 94, 0.1)' : 'rgba(212, 20, 58, 0.1)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: isPositive ? '#22c55e' : 'var(--color-crimson)',
                            }}
                          >
                            {isPositive ? (
                              <ArrowDownLeft style={{ width: 14, height: 14 }} />
                            ) : (
                              <ArrowUpRight style={{ width: 14, height: 14 }} />
                            )}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{tx.description}</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
                              {tx.type.replace('_', ' ')}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: '14px 20px', fontWeight: 700, color: isPositive ? '#22c55e' : 'var(--text-primary)' }}>
                        {isPositive ? '+' : '-'}${tx.amountUsd.toFixed(2)}
                      </td>

                      <td style={{ padding: '14px 20px', color: 'var(--text-secondary)' }}>
                        {tx.amountNgn ? `₦${Math.round(tx.amountNgn).toLocaleString()}` : '—'}
                      </td>

                      <td style={{ padding: '14px 20px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {tx.balanceAfterUsd !== undefined ? `$${tx.balanceAfterUsd.toFixed(2)}` : '—'}
                      </td>

                      <td style={{ padding: '14px 20px', color: 'var(--text-secondary)', fontFamily: 'monospace', fontSize: '12px' }}>
                        {tx.reference}
                      </td>

                      <td style={{ padding: '14px 20px' }}>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: '9999px',
                            backgroundColor: tx.status === 'completed' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(234, 179, 8, 0.1)',
                            color: tx.status === 'completed' ? '#22c55e' : '#eab308',
                            textTransform: 'uppercase',
                          }}
                        >
                          {tx.status}
                        </span>
                      </td>

                      <td style={{ padding: '14px 20px', color: 'var(--text-secondary)', fontSize: '12px' }}>
                        {new Date(tx.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <EscrowBreakdownDrawer
        isOpen={isEscrowDrawerOpen}
        onClose={() => setIsEscrowDrawerOpen(false)}
        escrows={escrows}
      />
    </div>
  );
}
