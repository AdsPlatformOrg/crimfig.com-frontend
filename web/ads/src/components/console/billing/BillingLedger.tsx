'use client';

import { ecosystemOrigin } from '../../../../../../shared/ui/origins';

import { useState, useEffect } from 'react';
import {
  DollarSign,
  Lock,
  RefreshCw,
  CreditCard,
  TrendingUp,
} from 'lucide-react';
import type { WalletBalance, EscrowAllocation } from '../../../types/billing';
import {
  fetchBillingOverview,
} from '../../../lib/billing-api';
import { EscrowBreakdownDrawer } from './EscrowBreakdownDrawer';
import { Card, Button } from '../../ui';

export function BillingLedger() {
  const [wallet, setWallet] = useState<WalletBalance | null>(null);
  const [escrows, setEscrows] = useState<EscrowAllocation[]>([]);

  // Modals
  const [isEscrowDrawerOpen, setIsEscrowDrawerOpen] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const overview = await fetchBillingOverview(); setWallet(overview.wallet); setEscrows(overview.escrows);
      } catch (err) { setLoadError(err instanceof Error ? err.message : 'Billing overview unavailable.'); }

    }
    loadData();
  }, []);

  const openBilling = () => {
    const base = ecosystemOrigin('billing',process.env.NEXT_PUBLIC_BILLING_WEB_URL);
    window.location.assign(new URL('/?view=console', base).href);
  };



  const availableUsd = wallet ? wallet.availableUsd : 0;
  const lockedEscrowUsd = escrows.reduce((sum, e) => sum + e.remainingUsd, 0);
  const exchangeRate = wallet ? wallet.exchangeRate : 0;

  if (!wallet) return <div role={loadError ? 'alert' : 'status'} style={{ padding: 24, color: 'var(--text-secondary)' }}>
    <p>{loadError || 'Loading billing overview…'}</p>
    <Button type="button" onClick={openBilling} variant="outline" size="sm">Open Billing</Button>
  </div>;

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px', width: '100%', boxSizing: 'border-box' }}>
      {loadError && <p role="alert">{loadError}</p>}
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
            Billing &amp; Escrow
          </h2>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>
            Check your wallet balance and campaign funds reserved for delivery.
          </p>
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

        {/* KPI 2: Campaign escrow */}
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
              Locked Campaign Escrow
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
            ${lockedEscrowUsd.toFixed(2)}
          </div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
            {escrows.length} Active Campaign Escrows
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
              Total Ad Spend Burned
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
            ${escrows.reduce((sum, e) => sum + (e.consumedUsd || 0), 0).toFixed(2)}
          </div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Calculated from campaign escrow activity
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
              Reference Exchange Rate
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>
            <span>Estimate only; see Billing for final charges.</span>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <Button
            type="button"
            onClick={openBilling}
            size="lg"
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
            <span>Fund Wallet</span>
          </Button>
          <Button
            type="button"
            onClick={() => setIsEscrowDrawerOpen(true)}
            variant="outline"
            size="lg"
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
          </Button>

        </div>

      </div>

      <Card style={{ padding: 20 }}>
        <h2>Transaction history</h2>
        <p>View wallet deposits, charges and refunds in Billing.</p>
        <Button type="button" variant="outline" onClick={openBilling}>Open Billing history</Button>
      </Card>

      {/* Modals */}
      <EscrowBreakdownDrawer
        isOpen={isEscrowDrawerOpen}
        onClose={() => setIsEscrowDrawerOpen(false)}
        escrows={escrows}
      />
    </div>
  );
}
