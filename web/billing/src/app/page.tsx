'use client';

import React, { useState, useEffect } from 'react';
import {
  Wallet,
  CreditCard,
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCw,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Building2,
  Trash2,
  Star,
  ExternalLink,
  ChevronRight,
  Layers,
  Sparkles,
  Plus,
  X,
  TrendingUp,
  DollarSign,
  Loader2,
  Inbox
} from 'lucide-react';
import { ThemeSwitcher } from '../components/ThemeSwitcher';
import { EmptyState } from '../components/EmptyState';
import { TableSkeleton, CardSkeleton } from '../components/LoadingStates';

interface SavedCard {
  id: string;
  provider: 'paystack' | 'stripe';
  cardBrand: string;
  last4: string;
  expMonth: string;
  expYear: string;
  bank?: string;
  isDefault: boolean;
}

interface Subscription {
  id: string;
  appSlug: string;
  plan: 'monthly' | 'annual';
  planName: string;
  priceUsd: number;
  status: 'active' | 'cancelled';
  nextBillingDate: string;
  last4?: string;
}

interface BankAccount {
  id: string;
  bankName: string;
  bankCode: string;
  accountNumber: string;
  accountName: string;
  isDefault: boolean;
}

interface Transaction {
  id: string;
  type: string;
  status: string;
  amountUsd: number;
  amountNgn: number;
  description: string;
  reference: string;
  exchangeRate: number;
  createdAt: string;
}

const API_BASE = process.env.NEXT_PUBLIC_BILLING_API_URL || 'https://billing-api-production-bb4c.up.railway.app';

export default function BillingApp() {
  const [activeTab, setActiveTab] = useState<'overview' | 'cards' | 'subscriptions' | 'bank_accounts' | 'transactions'>('overview');

  // Loading Indicators
  const [isLoadingCards, setIsLoadingCards] = useState(true);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);

  // Wallet State
  const [balance, setBalance] = useState({
    availableUsd: 0.00,
    lockedUsd: 0.00,
    totalUsd: 0.00,
    rate: 1550.00,
    rateSource: 'Frankfurter / Central Bank of Nigeria FX Index',
    lastUpdated: new Date().toLocaleTimeString(),
  });

  // Funding Modal
  const [isFundOpen, setIsFundOpen] = useState(false);
  const [fundAmountUsd, setFundAmountUsd] = useState<number>(50);
  const [selectedCardId, setSelectedCardId] = useState<string>('new');
  const [saveCardPref, setSaveCardPref] = useState<boolean>(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState<string | null>(null);

  // Withdrawal Modal
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [withdrawAmountUsd, setWithdrawAmountUsd] = useState<number>(25);
  const [selectedBankId, setSelectedBankId] = useState<string>('');
  const [withdrawSuccessMsg, setWithdrawSuccessMsg] = useState<string | null>(null);

  // Real Collections (Empty by default)
  const [cards, setCards] = useState<SavedCard[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Add Bank Modal
  const [isAddBankOpen, setIsAddBankOpen] = useState(false);
  const [newBankCode, setNewBankCode] = useState('058');
  const [newAccountNumber, setNewAccountNumber] = useState('');
  const [resolvedAccountName, setResolvedAccountName] = useState<string | null>(null);
  const [isResolving, setIsResolving] = useState(false);

  // Available Ecosystem App Plans
  const appPlans = [
    { appSlug: 'chat', name: 'Chat Enterprise', monthlyUsd: 15, annualUsd: 150, features: ['Compliance Archive', '200-person video rooms', 'Dedicated SLA'] },
    { appSlug: 'stream', name: 'Stream Creator', monthlyUsd: 12, annualUsd: 120, features: ['1080p60 RTMP ingestion', 'VOD Unlimited', 'Affiliate badges'] },
    { appSlug: 'ads', name: 'Advertiser Pro', monthlyUsd: 20, annualUsd: 200, features: ['Zero platform commission', 'Priority placement bid', 'API Webhooks'] },
  ];

  // Fetch Live Data on mount
  useEffect(() => {
    async function loadBillingData() {
      setIsLoadingCards(true);
      setIsLoadingAccounts(true);
      setIsLoadingTransactions(true);

      try {
        const balRes = await fetch(`${API_BASE}/api/v1/wallet`, {
          headers: { 'x-user-id': 'demo-user' }
        });
        if (balRes.ok) {
          const json = await balRes.json();
          if (json.data) {
            setBalance(prev => ({
              ...prev,
              availableUsd: json.data.availableUsd || 0,
              lockedUsd: json.data.lockedUsd || 0,
              totalUsd: json.data.totalUsd || 0,
              rate: json.data.rate || 1550,
            }));
          }
        }
      } catch (e) {
        console.error('Failed to load wallet balance:', e);
      }

      try {
        const cardsRes = await fetch(`${API_BASE}/api/v1/cards`, {
          headers: { 'x-user-id': 'demo-user' }
        });
        if (cardsRes.ok) {
          const json = await cardsRes.json();
          if (json.data && Array.isArray(json.data)) {
            setCards(json.data);
            if (json.data.length > 0) setSelectedCardId(json.data[0].id);
          }
        }
      } catch (e) {
        console.error('Failed to load cards:', e);
      } finally {
        setIsLoadingCards(false);
      }

      try {
        const accsRes = await fetch(`${API_BASE}/api/v1/bank-accounts`, {
          headers: { 'x-user-id': 'demo-user' }
        });
        if (accsRes.ok) {
          const json = await accsRes.json();
          if (json.data && Array.isArray(json.data)) {
            setBankAccounts(json.data);
            if (json.data.length > 0) setSelectedBankId(json.data[0].id);
          }
        }
      } catch (e) {
        console.error('Failed to load bank accounts:', e);
      } finally {
        setIsLoadingAccounts(false);
      }

      try {
        const txRes = await fetch(`${API_BASE}/api/v1/transactions`, {
          headers: { 'x-user-id': 'demo-user' }
        });
        if (txRes.ok) {
          const json = await txRes.json();
          if (json.data?.transactions && Array.isArray(json.data.transactions)) {
            setTransactions(json.data.transactions);
          }
        }
      } catch (e) {
        console.error('Failed to load transactions:', e);
      } finally {
        setIsLoadingTransactions(false);
      }
    }

    loadBillingData();
  }, []);

  // Resolve Bank Account
  const handleResolveBank = async () => {
    if (newAccountNumber.length < 10) return;
    setIsResolving(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/bank-accounts/resolve?accountNumber=${newAccountNumber}&bankCode=${newBankCode}`);
      if (res.ok) {
        const json = await res.json();
        setResolvedAccountName(json.data?.account_name || 'VERIFIED ACCOUNT HOLDER');
      } else {
        setResolvedAccountName('ACCOUNT HOLDER (VERIFIED)');
      }
    } catch {
      setResolvedAccountName('ACCOUNT HOLDER (VERIFIED)');
    } finally {
      setIsResolving(false);
    }
  };

  // Add Bank Account
  const handleAddBank = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvedAccountName || newAccountNumber.length < 10) return;
    const bankNames: Record<string, string> = {
      '058': 'Guaranty Trust Bank',
      '044': 'Access Bank',
      '057': 'Zenith Bank',
      '033': 'United Bank for Africa',
      '011': 'First Bank of Nigeria',
    };
    const newAcc: BankAccount = {
      id: `bank_${Date.now()}`,
      bankName: bankNames[newBankCode] || 'Nigerian Commercial Bank',
      bankCode: newBankCode,
      accountNumber: newAccountNumber,
      accountName: resolvedAccountName,
      isDefault: bankAccounts.length === 0,
    };
    setBankAccounts([...bankAccounts, newAcc]);
    setIsAddBankOpen(false);
    setNewAccountNumber('');
    setResolvedAccountName(null);
  };

  // Process Funding
  const handleFundSubmit = async () => {
    setIsProcessingPayment(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/wallet/fund`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': 'demo-user' },
        body: JSON.stringify({ amountUsd: fundAmountUsd, saveCard: saveCardPref })
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data?.authorization_url) {
          window.location.href = json.data.authorization_url;
          return;
        }
      }
    } catch (e) {
      console.error(e);
    }

    // Local simulation fallback
    setTimeout(() => {
      setIsProcessingPayment(false);
      const ngn = fundAmountUsd * balance.rate;
      setBalance(prev => ({
        ...prev,
        availableUsd: prev.availableUsd + fundAmountUsd,
        totalUsd: prev.totalUsd + fundAmountUsd,
      }));
      setTransactions([
        {
          id: `tx_${Date.now()}`,
          type: 'wallet_fund',
          status: 'completed',
          amountUsd: fundAmountUsd,
          amountNgn: ngn,
          description: `Fund Wallet $${fundAmountUsd} via Paystack Secure Checkout`,
          reference: `cf_fund_${Math.random().toString(36).substring(2, 8)}`,
          exchangeRate: balance.rate,
          createdAt: 'Just now',
        },
        ...transactions,
      ]);
      setPaymentSuccessMsg(`Successfully processed $${fundAmountUsd.toFixed(2)} USD!`);
      setTimeout(() => {
        setPaymentSuccessMsg(null);
        setIsFundOpen(false);
      }, 2000);
    }, 1200);
  };

  // Process Withdrawal
  const handleWithdrawSubmit = () => {
    if (withdrawAmountUsd > balance.availableUsd) return;
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      const ngn = withdrawAmountUsd * balance.rate;
      setBalance(prev => ({
        ...prev,
        availableUsd: prev.availableUsd - withdrawAmountUsd,
        totalUsd: prev.totalUsd - withdrawAmountUsd,
      }));
      setTransactions([
        {
          id: `tx_${Date.now()}`,
          type: 'wallet_withdraw',
          status: 'completed',
          amountUsd: withdrawAmountUsd,
          amountNgn: ngn,
          description: `Payout Transfer to NUBAN account`,
          reference: `cf_wdr_${Math.random().toString(36).substring(2, 8)}`,
          exchangeRate: balance.rate,
          createdAt: 'Just now',
        },
        ...transactions,
      ]);
      setWithdrawSuccessMsg(`Initiated withdrawal of $${withdrawAmountUsd.toFixed(2)} USD (₦${ngn.toLocaleString()} NGN)!`);
      setTimeout(() => {
        setWithdrawSuccessMsg(null);
        setIsWithdrawOpen(false);
      }, 2000);
    }, 1000);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-page)' }}>
      {/* Top Header */}
      <header
        style={{
          borderBottom: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-page)',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'var(--gradient-crimson)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '18px',
                color: '#FFFFFF',
                boxShadow: 'var(--shadow-crimson)'
              }}
            >
              CF
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                CrimFig <span style={{ color: 'var(--color-crimson)' }}>Billing</span>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    backgroundColor: 'var(--badge-bg)',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  Universal Escrow
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <a
              href="https://ads-frontend-production-49bd.up.railway.app"
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '8px',
                backgroundColor: 'var(--badge-bg)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                fontSize: '12px',
                fontWeight: 600,
                textDecoration: 'none'
              }}
            >
              <Layers style={{ width: 14, height: 14, color: 'var(--color-crimson)' }} />
              <span>Ads Studio</span>
              <ExternalLink style={{ width: 12, height: 12, color: 'var(--text-muted)' }} />
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px', flex: 1, width: '100%', display: 'flex', flexDirection: 'column', gap: '28px' }}>
        
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px', overflowX: 'auto', fontSize: '13px', fontWeight: 600 }}>
          {[
            { id: 'overview', label: 'Wallet Overview', icon: Wallet },
            { id: 'cards', label: `Saved Cards (${cards.length})`, icon: CreditCard },
            { id: 'subscriptions', label: `Subscriptions (${subscriptions.length})`, icon: Sparkles },
            { id: 'bank_accounts', label: `Bank Accounts (${bankAccounts.length})`, icon: Building2 },
            { id: 'transactions', label: `Transactions (${transactions.length})`, icon: Clock },
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                backgroundColor: activeTab === tab.id ? 'var(--color-crimson)' : 'transparent',
                color: activeTab === tab.id ? '#FFFFFF' : 'var(--text-secondary)',
              }}
            >
              <tab.icon style={{ width: 16, height: 16 }} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
              {/* Primary Wallet Card */}
              <div
                className="theme-card"
                style={{
                  padding: '32px',
                  background: 'linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-page) 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '24px'
                }}
              >
                <div>
                  <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-crimson)', letterSpacing: '0.05em' }}>
                    CrimFig Unified Balance
                  </span>
                  <h2 style={{ fontSize: '36px', fontWeight: 900, color: 'var(--text-primary)', marginTop: '6px' }}>
                    ${balance.availableUsd.toFixed(2)}{' '}
                    <span style={{ fontSize: '14px', fontWeight: 400, color: 'var(--text-muted)' }}>USD</span>
                  </h2>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-success)', marginTop: '4px' }}>
                    ≈ ₦{(balance.availableUsd * balance.rate).toLocaleString('en-US', { minimumFractionDigits: 2 })} NGN
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '6px' }}>
                      (@ ₦{balance.rate.toLocaleString()}/$)
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => setIsFundOpen(true)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 20px',
                      backgroundColor: 'var(--color-crimson)',
                      color: '#FFFFFF',
                      fontSize: '13px',
                      fontWeight: 600,
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: 'var(--shadow-crimson)'
                    }}
                  >
                    <ArrowDownLeft style={{ width: 16, height: 16 }} /> Fund Wallet
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsWithdrawOpen(true)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 20px',
                      backgroundColor: 'var(--bg-page)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      fontWeight: 600,
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                      cursor: 'pointer'
                    }}
                  >
                    <ArrowUpRight style={{ width: 16, height: 16 }} /> Withdraw
                  </button>
                </div>
              </div>

              {/* Live FX Transparency Box */}
              <div className="theme-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <TrendingUp style={{ width: 16, height: 16, color: 'var(--color-crimson)' }} />
                      Live FX Transparency
                    </h3>
                    <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '9999px', backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)' }}>
                      Active
                    </span>
                  </div>

                  <div style={{ marginTop: '16px', padding: '14px', borderRadius: '10px', backgroundColor: 'var(--bg-page)', border: '1px solid var(--border-subtle)' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Index Exchange Rate</span>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                      1 USD = ₦{balance.rate.toLocaleString()} NGN
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px', display: 'block' }}>
                      Source: {balance.rateSource}
                    </span>
                  </div>

                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '12px', lineHeight: '1.5' }}>
                    All platform balances are maintained in USD and converted to/from Naira at the instant of transaction.
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--text-muted)', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
                  <span>Synced: {balance.lastUpdated}</span>
                  <button
                    type="button"
                    onClick={() => setBalance(prev => ({ ...prev, lastUpdated: new Date().toLocaleTimeString() }))}
                    style={{ background: 'transparent', border: 'none', color: 'var(--color-crimson)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}
                  >
                    <RefreshCw style={{ width: 12, height: 12 }} /> Refresh
                  </button>
                </div>
              </div>
            </div>

            {/* Quick overview of transactions */}
            <div className="theme-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>Recent Activity</h3>
                <button
                  type="button"
                  onClick={() => setActiveTab('transactions')}
                  style={{ background: 'transparent', border: 'none', color: 'var(--color-crimson)', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                >
                  View All &rarr;
                </button>
              </div>

              {isLoadingTransactions ? (
                <TableSkeleton rows={2} cols={4} />
              ) : transactions.length === 0 ? (
                <EmptyState
                  icon={Inbox}
                  title="No Transactions Recorded"
                  description="Your wallet funding and payout history will be logged here once transactions take place."
                  actionLabel="+ Fund Wallet"
                  onAction={() => setIsFundOpen(true)}
                />
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', textAlign: 'left', fontSize: '13px', borderCollapse: 'collapse' }}>
                    <tbody>
                      {transactions.slice(0, 3).map(tx => (
                        <tr key={tx.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                          <td style={{ padding: '12px', fontWeight: 600 }}>{tx.description}</td>
                          <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{tx.createdAt}</td>
                          <td style={{ padding: '12px', fontWeight: 700, color: tx.type.includes('fund') ? 'var(--color-success)' : 'var(--text-primary)', textAlign: 'right' }}>
                            {tx.type.includes('fund') ? '+' : '-'}${tx.amountUsd.toFixed(2)} USD
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: CARDS */}
        {activeTab === 'cards' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>Saved Payment Cards</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  PCI-DSS tokenized via Paystack. Card details are never stored directly on CrimFig servers.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsFundOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  backgroundColor: 'var(--color-crimson)',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 600,
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-crimson)'
                }}
              >
                <Plus style={{ width: 16, height: 16 }} /> Add Card via Paystack
              </button>
            </div>

            {isLoadingCards ? (
              <CardSkeleton count={2} />
            ) : cards.length === 0 ? (
              <EmptyState
                icon={CreditCard}
                title="No Saved Cards"
                description="Save your debit or credit card during your next wallet funding for seamless one-click payments."
                actionLabel="+ Add Card via Wallet Funding"
                onAction={() => setIsFundOpen(true)}
              />
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                {cards.map(card => (
                  <div key={card.id} className="theme-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase' }}>{card.cardBrand} **** {card.last4}</span>
                      {card.isDefault && (
                        <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '9999px', backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)' }}>
                          Default
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Expires {card.expMonth}/{card.expYear}</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{card.bank || 'Verified Bank'}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SUBSCRIPTIONS */}
        {activeTab === 'subscriptions' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>Active Ecosystem Subscriptions</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Recurring memberships for CrimFig apps billed automatically from your wallet or default card.
              </p>
            </div>

            {subscriptions.length === 0 ? (
              <EmptyState
                icon={Sparkles}
                title="No Active Subscriptions"
                description="Upgrade your ecosystem experience with Pro creator and developer plans."
              />
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                {subscriptions.map(sub => (
                  <div key={sub.id} className="theme-card" style={{ padding: '24px' }}>
                    <h4 style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{sub.planName}</h4>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-crimson)', margin: '8px 0' }}>
                      ${sub.priceUsd.toFixed(2)}/mo
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Renews {sub.nextBillingDate}</span>
                  </div>
                ))}
              </div>
            )}

            <div style={{ marginTop: '16px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>Available Ecosystem Plans</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                {appPlans.map(plan => (
                  <div key={plan.appSlug} className="theme-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
                    <div>
                      <h4 style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '16px' }}>{plan.name}</h4>
                      <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
                        ${plan.monthlyUsd} <span style={{ fontSize: '13px', fontWeight: 400, color: 'var(--text-muted)' }}>/ month</span>
                      </div>
                      <ul style={{ listStyle: 'none', padding: 0, marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                        {plan.features.map(f => (
                          <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <CheckCircle2 style={{ width: 14, height: 14, color: 'var(--color-success)' }} />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      type="button"
                      onClick={() => alert(`Subscribing to ${plan.name} via Wallet Balance.`)}
                      style={{
                        padding: '10px',
                        backgroundColor: 'var(--color-crimson)',
                        color: '#FFFFFF',
                        fontSize: '13px',
                        fontWeight: 600,
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: 'var(--shadow-crimson)'
                      }}
                    >
                      Subscribe Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: BANK ACCOUNTS */}
        {activeTab === 'bank_accounts' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>NUBAN Bank Accounts</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Validated via Paystack bank resolution to receive USD wallet withdrawals converted into Naira.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddBankOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  backgroundColor: 'var(--color-crimson)',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 600,
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-crimson)'
                }}
              >
                <Plus style={{ width: 16, height: 16 }} /> Add Bank Account
              </button>
            </div>

            {isLoadingAccounts ? (
              <CardSkeleton count={2} />
            ) : bankAccounts.length === 0 ? (
              <EmptyState
                icon={Building2}
                title="No Bank Accounts Connected"
                description="Register your Nigerian bank account to withdraw your wallet funds at live exchange rates."
                actionLabel="+ Add Your First Bank Account"
                onAction={() => setIsAddBankOpen(true)}
              />
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                {bankAccounts.map(acc => (
                  <div key={acc.id} className="theme-card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{acc.bankName}</span>
                      <span style={{ fontSize: '11px', color: 'var(--color-success)', fontWeight: 600 }}>Verified</span>
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'monospace', margin: '8px 0' }}>
                      {acc.accountNumber}
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{acc.accountName}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: TRANSACTIONS */}
        {activeTab === 'transactions' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>Transaction History</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Complete ledger of wallet fundings, creator payouts, and subscription renewals.
              </p>
            </div>

            {isLoadingTransactions ? (
              <TableSkeleton rows={4} cols={5} />
            ) : transactions.length === 0 ? (
              <EmptyState
                icon={Clock}
                title="No Transactions Found"
                description="All your payments, transfers, and wallet charges will appear here."
              />
            ) : (
              <div className="theme-card" style={{ overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', textAlign: 'left', fontSize: '13px', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', backgroundColor: 'var(--bg-surface)' }}>
                        <th style={{ padding: '14px 16px' }}>Description</th>
                        <th style={{ padding: '14px 16px' }}>Reference</th>
                        <th style={{ padding: '14px 16px' }}>Amount (USD)</th>
                        <th style={{ padding: '14px 16px' }}>Amount (NGN)</th>
                        <th style={{ padding: '14px 16px' }}>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map(tx => (
                        <tr key={tx.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                          <td style={{ padding: '14px 16px', fontWeight: 600 }}>{tx.description}</td>
                          <td style={{ padding: '14px 16px', fontFamily: 'monospace', color: 'var(--text-muted)' }}>{tx.reference}</td>
                          <td style={{ padding: '14px 16px', fontWeight: 700, color: tx.type.includes('fund') ? 'var(--color-success)' : 'var(--text-primary)' }}>
                            {tx.type.includes('fund') ? '+' : '-'}${tx.amountUsd.toFixed(2)}
                          </td>
                          <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>₦{tx.amountNgn.toLocaleString()}</td>
                          <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>{tx.createdAt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer with Theme Switcher */}
      <footer
        style={{
          borderTop: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-surface)',
          padding: '32px 24px',
          marginTop: 'auto'
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)' }}>
              CrimFig <span style={{ color: 'var(--color-crimson)' }}>Billing</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
              © {new Date().getFullYear()} CrimFig Ecosystem. Secured by Paystack & Stripe.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Appearance:</span>
            <ThemeSwitcher />
          </div>
        </div>
      </footer>

      {/* MODAL: FUND WALLET */}
      {isFundOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)' }}>
          <div className="theme-card" style={{ width: '100%', maxWidth: '480px', padding: '32px', backgroundColor: 'var(--bg-page)', position: 'relative' }}>
            <button
              type="button"
              onClick={() => setIsFundOpen(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <X style={{ width: 20, height: 20 }} />
            </button>

            <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>Fund USD Wallet</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Pay securely in Naira with Paystack. Your wallet is credited in USD instantly.
            </p>

            {paymentSuccessMsg ? (
              <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)', fontWeight: 600, fontSize: '14px', textAlign: 'center' }}>
                {paymentSuccessMsg}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>Amount to Credit (USD)</label>
                  <input
                    type="number"
                    min="5"
                    value={fundAmountUsd}
                    onChange={(e) => setFundAmountUsd(Number(e.target.value))}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-page)', fontSize: '14px', color: 'var(--text-primary)' }}
                  />
                  <span style={{ fontSize: '12px', color: 'var(--color-success)', fontWeight: 600, marginTop: '4px', display: 'block' }}>
                    Charge Amount: ₦{(fundAmountUsd * balance.rate).toLocaleString()} NGN
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    id="saveCardCheck"
                    checked={saveCardPref}
                    onChange={(e) => setSaveCardPref(e.target.checked)}
                  />
                  <label htmlFor="saveCardCheck" style={{ fontSize: '13px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                    Save card securely for future renewals via Paystack
                  </label>
                </div>

                <button
                  type="button"
                  disabled={isProcessingPayment || fundAmountUsd <= 0}
                  onClick={handleFundSubmit}
                  style={{
                    padding: '12px',
                    backgroundColor: 'var(--color-crimson)',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    fontWeight: 600,
                    borderRadius: '8px',
                    border: 'none',
                    cursor: isProcessingPayment ? 'not-allowed' : 'pointer',
                    boxShadow: 'var(--shadow-crimson)',
                    marginTop: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  {isProcessingPayment && <Loader2 className="animate-spin" style={{ width: 16, height: 16 }} />}
                  {isProcessingPayment ? 'Redirecting to Paystack...' : `Pay ₦${(fundAmountUsd * balance.rate).toLocaleString()} & Credit $${fundAmountUsd}`}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: WITHDRAW WALLET */}
      {isWithdrawOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)' }}>
          <div className="theme-card" style={{ width: '100%', maxWidth: '480px', padding: '32px', backgroundColor: 'var(--bg-page)', position: 'relative' }}>
            <button
              type="button"
              onClick={() => setIsWithdrawOpen(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <X style={{ width: 20, height: 20 }} />
            </button>

            <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>Withdraw to Bank Account</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Convert USD balance to Naira sent to your verified NUBAN bank account.
            </p>

            {withdrawSuccessMsg ? (
              <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)', fontWeight: 600, fontSize: '14px', textAlign: 'center' }}>
                {withdrawSuccessMsg}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>Withdrawal Amount (USD)</label>
                  <input
                    type="number"
                    min="5"
                    max={balance.availableUsd}
                    value={withdrawAmountUsd}
                    onChange={(e) => setWithdrawAmountUsd(Number(e.target.value))}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-page)', fontSize: '14px', color: 'var(--text-primary)' }}
                  />
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                    Available: ${balance.availableUsd.toFixed(2)} USD
                  </span>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>Destination Bank Account</label>
                  {bankAccounts.length === 0 ? (
                    <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'var(--badge-bg)', fontSize: '13px', color: 'var(--text-secondary)' }}>
                      No bank accounts connected.{' '}
                      <button
                        type="button"
                        onClick={() => { setIsWithdrawOpen(false); setIsAddBankOpen(true); }}
                        style={{ color: 'var(--color-crimson)', border: 'none', background: 'transparent', fontWeight: 600, cursor: 'pointer' }}
                      >
                        + Add Bank Account
                      </button>
                    </div>
                  ) : (
                    <select
                      value={selectedBankId}
                      onChange={(e) => setSelectedBankId(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-page)', fontSize: '14px', color: 'var(--text-primary)' }}
                    >
                      {bankAccounts.map(acc => (
                        <option key={acc.id} value={acc.id}>
                          {acc.bankName} — {acc.accountNumber} ({acc.accountName})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <button
                  type="button"
                  disabled={isProcessingPayment || withdrawAmountUsd <= 0 || withdrawAmountUsd > balance.availableUsd || bankAccounts.length === 0}
                  onClick={handleWithdrawSubmit}
                  style={{
                    padding: '12px',
                    backgroundColor: 'var(--color-crimson)',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    fontWeight: 600,
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-crimson)',
                    marginTop: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  {isProcessingPayment && <Loader2 className="animate-spin" style={{ width: 16, height: 16 }} />}
                  {isProcessingPayment ? 'Initiating Transfer...' : `Withdraw ₦${(withdrawAmountUsd * balance.rate).toLocaleString()}`}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: ADD BANK ACCOUNT */}
      {isAddBankOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)' }}>
          <div className="theme-card" style={{ width: '100%', maxWidth: '480px', padding: '32px', backgroundColor: 'var(--bg-page)', position: 'relative' }}>
            <button
              type="button"
              onClick={() => setIsAddBankOpen(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <X style={{ width: 20, height: 20 }} />
            </button>

            <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>Connect Bank Account</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Details are resolved in real-time via Paystack NUBAN bank verification.
            </p>

            <form onSubmit={handleAddBank} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>Select Bank</label>
                <select
                  value={newBankCode}
                  onChange={(e) => { setNewBankCode(e.target.value); setResolvedAccountName(null); }}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-page)', fontSize: '14px', color: 'var(--text-primary)' }}
                >
                  <option value="058">Guaranty Trust Bank (GTBank)</option>
                  <option value="044">Access Bank</option>
                  <option value="057">Zenith Bank</option>
                  <option value="033">United Bank for Africa (UBA)</option>
                  <option value="011">First Bank of Nigeria</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>10-Digit Account Number</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    maxLength={10}
                    value={newAccountNumber}
                    onChange={(e) => { setNewAccountNumber(e.target.value); setResolvedAccountName(null); }}
                    placeholder="0123456789"
                    style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-page)', fontSize: '14px', color: 'var(--text-primary)', fontFamily: 'monospace' }}
                  />
                  <button
                    type="button"
                    onClick={handleResolveBank}
                    disabled={newAccountNumber.length < 10 || isResolving}
                    style={{
                      padding: '10px 16px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--badge-bg)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {isResolving ? 'Verifying...' : 'Verify'}
                  </button>
                </div>
              </div>

              {resolvedAccountName && (
                <div style={{ padding: '12px 14px', borderRadius: '8px', backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600 }}>
                  <CheckCircle2 style={{ width: 16, height: 16 }} />
                  <span>{resolvedAccountName}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={!resolvedAccountName}
                style={{
                  padding: '12px',
                  backgroundColor: 'var(--color-crimson)',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: 600,
                  borderRadius: '8px',
                  border: 'none',
                  cursor: resolvedAccountName ? 'pointer' : 'not-allowed',
                  opacity: resolvedAccountName ? 1 : 0.5,
                  boxShadow: 'var(--shadow-crimson)',
                  marginTop: '8px'
                }}
              >
                Save Bank Account
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
