'use client';

import { ecosystemOrigin } from '../../../../../../shared/ui/origins';

import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  Lock,
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
import type { WalletBalance, EscrowAllocation } from '../../../types/billing';
import {
  fetchBillingOverview,
} from '../../../lib/billing-api';
import { EscrowBreakdownDrawer } from './EscrowBreakdownDrawer';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  Button,
} from '../../ui';

interface BillingLedgerProps {
  initialRole?: 'advertiser' | 'promoter';
  onRoleChange?: (role: 'advertiser' | 'promoter') => void;
}

export function BillingLedger({ initialRole = 'advertiser', onRoleChange }: BillingLedgerProps) {
  const [role, setRole] = useState<'advertiser' | 'promoter'>(initialRole);
  const [wallet, setWallet] = useState<WalletBalance | null>(null);
  const [escrows, setEscrows] = useState<EscrowAllocation[]>([]);

  // Modals
  const [isEscrowDrawerOpen, setIsEscrowDrawerOpen] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    setRole(initialRole);
  }, [initialRole]);

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
      {/* Toast Alert */}


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
            Billing &amp; Escrow
          </h2>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>
            Check your wallet balance and campaign funds reserved for delivery.
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
          <Button
            type="button"
            onClick={() => {
              setRole('advertiser');
              onRoleChange?.('advertiser');
            }}
            variant={role === 'advertiser' ? 'default' : 'ghost'}
            size="sm"
            aria-pressed={role === 'advertiser'}
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
          </Button>
          <Button
            type="button"
            onClick={() => {
              setRole('promoter');
              onRoleChange?.('promoter');
            }}
            variant={role === 'promoter' ? 'default' : 'ghost'}
            size="sm"
            aria-pressed={role === 'promoter'}
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
          </Button>
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
                <span>Fund Wallet (Paystack)</span>
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
            </>
          ) : (
            <Button
              type="button"
              onClick={openBilling}
              variant="secondary"
              size="lg"
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
            </Button>
          )}


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
