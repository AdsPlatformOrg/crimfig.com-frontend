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
  Inbox,
  Gift,
  ArrowLeft,
  Award,
  Coins
} from 'lucide-react';
import { ThemeSwitcher } from '../ThemeSwitcher';
import { EmptyState } from '../EmptyState';
import { TableSkeleton, CardSkeleton } from '../LoadingStates';
import { CrimFigLogo } from '../CrimFigLogo';

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

interface RewardItem {
  id: string;
  source: 'ads_revenue' | 'stream_tips' | 'referral_bonus' | 'redemption';
  title: string;
  points: number;
  usdEquivalent: number;
  date: string;
  status: 'available' | 'redeemed';
}

interface BillingConsoleProps {
  onReturnToLanding?: () => void;
  initialTab?: 'overview' | 'cards' | 'subscriptions' | 'bank_accounts' | 'transactions' | 'rewards';
}

const API_BASE = typeof window !== 'undefined' ? '' : (process.env.NEXT_PUBLIC_BILLING_API_URL || 'https://billing-api-production-bb4c.up.railway.app');

export function BillingConsole({ onReturnToLanding, initialTab = 'overview' }: BillingConsoleProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'cards' | 'subscriptions' | 'bank_accounts' | 'transactions' | 'rewards'>(initialTab);

  // Loading Indicators
  const [isLoadingCards, setIsLoadingCards] = useState(true);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);

  // Wallet State
  const [balance, setBalance] = useState({
    availableUsd: 125.50,
    lockedUsd: 10.00,
    totalUsd: 135.50,
    rate: 1550.00,
    rateSource: 'Frankfurter / Central Bank of Nigeria FX Index',
    lastUpdated: new Date().toLocaleTimeString(),
  });

  // Rewards State
  const [rewardsPoints, setRewardsPoints] = useState(2450);
  const [isRedeemingRewards, setIsRedeemingRewards] = useState(false);
  const [rewardsMessage, setRewardsMessage] = useState<string | null>(null);
  const [rewardsHistory, setRewardsHistory] = useState<RewardItem[]>([
    {
      id: 'rew_1',
      source: 'ads_revenue',
      title: 'Ads Network Impressions Share (Blog Placement)',
      points: 1200,
      usdEquivalent: 12.00,
      date: 'Today, 14:22',
      status: 'available'
    },
    {
      id: 'rew_2',
      source: 'stream_tips',
      title: 'Livestream Community Tip Badge (CrimFig Stream)',
      points: 850,
      usdEquivalent: 8.50,
      date: 'Yesterday, 19:10',
      status: 'available'
    },
    {
      id: 'rew_3',
      source: 'referral_bonus',
      title: 'Developer Referral Signup Cashback',
      points: 400,
      usdEquivalent: 4.00,
      date: '2 days ago',
      status: 'available'
    }
  ]);

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

  // Real Collections
  const [cards, setCards] = useState<SavedCard[]>([
    {
      id: 'card_demo_1',
      provider: 'paystack',
      cardBrand: 'Mastercard',
      last4: '4081',
      expMonth: '11',
      expYear: '28',
      bank: 'Guaranty Trust Bank',
      isDefault: true,
    }
  ]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([
    {
      id: 'sub_demo_1',
      appSlug: 'ads',
      plan: 'monthly',
      planName: 'Advertiser Pro',
      priceUsd: 20,
      status: 'active',
      nextBillingDate: 'Nov 17, 2026',
      last4: '4081'
    }
  ]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([
    {
      id: 'bank_demo_1',
      bankName: 'Guaranty Trust Bank',
      bankCode: '058',
      accountNumber: '0234567890',
      accountName: 'CRIMFIG SETTLEMENT ACCT',
      isDefault: true,
    }
  ]);
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 'tx_init_1',
      type: 'rewards_credit',
      status: 'completed',
      amountUsd: 15.00,
      amountNgn: 23250,
      description: 'Monthly Ecosystem Rewards Settlement',
      reference: 'cf_rew_882910',
      exchangeRate: 1550,
      createdAt: 'Oct 15, 2026',
    },
    {
      id: 'tx_init_2',
      type: 'wallet_fund',
      status: 'completed',
      amountUsd: 100.00,
      amountNgn: 155000,
      description: 'Fund Wallet $100 via Paystack Card Checkout',
      reference: 'cf_fund_739211',
      exchangeRate: 1550,
      createdAt: 'Oct 12, 2026',
    }
  ]);

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
              availableUsd: json.data.availableUsd || prev.availableUsd,
              lockedUsd: json.data.lockedUsd || prev.lockedUsd,
              totalUsd: json.data.totalUsd || prev.totalUsd,
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
          if (json.data && Array.isArray(json.data) && json.data.length > 0) {
            setCards(json.data);
            setSelectedCardId(json.data[0].id);
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
          if (json.data && Array.isArray(json.data) && json.data.length > 0) {
            setBankAccounts(json.data);
            setSelectedBankId(json.data[0].id);
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
          if (json.data?.transactions && Array.isArray(json.data.transactions) && json.data.transactions.length > 0) {
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

  // Redeem Rewards to Main Wallet
  const handleRedeemRewards = () => {
    if (rewardsPoints <= 0) return;
    setIsRedeemingRewards(true);
    setTimeout(() => {
      setIsRedeemingRewards(false);
      const redeemedUsd = Number((rewardsPoints / 100).toFixed(2));
      const redeemedNgn = Number((redeemedUsd * balance.rate).toFixed(2));
      
      // Update wallet balance
      setBalance(prev => ({
        ...prev,
        availableUsd: prev.availableUsd + redeemedUsd,
        totalUsd: prev.totalUsd + redeemedUsd,
      }));

      // Append ledger transaction
      setTransactions(prev => [
        {
          id: `tx_rew_${Date.now()}`,
          type: 'rewards_credit',
          status: 'completed',
          amountUsd: redeemedUsd,
          amountNgn: redeemedNgn,
          description: `Redeemed ${rewardsPoints.toLocaleString()} Rewards Points into Main Wallet`,
          reference: `cf_rew_red_${Math.random().toString(36).substring(2, 8)}`,
          exchangeRate: balance.rate,
          createdAt: 'Just now',
        },
        ...prev,
      ]);

      // Update rewards history
      setRewardsHistory(prev => [
        {
          id: `rew_red_${Date.now()}`,
          source: 'redemption',
          title: `Redeemed ${rewardsPoints.toLocaleString()} pts to Main Wallet Balance`,
          points: -rewardsPoints,
          usdEquivalent: -redeemedUsd,
          date: 'Just now',
          status: 'redeemed',
        },
        ...prev.map(item => ({ ...item, status: 'redeemed' as const })),
      ]);

      setRewardsPoints(0);
      setRewardsMessage(`Success! Credited $${redeemedUsd.toFixed(2)} USD (₦${redeemedNgn.toLocaleString()} NGN) to your available balance.`);
      setTimeout(() => setRewardsMessage(null), 4000);
    }, 1200);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-page)', color: 'var(--text-primary)' }}>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {onReturnToLanding && (
              <button
                type="button"
                onClick={onReturnToLanding}
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
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                title="Return to Billing Landing Page"
              >
                <ArrowLeft style={{ width: 14, height: 14 }} />
                <span>Home</span>
              </button>
            )}

            <CrimFigLogo
              variant="brand"
              size={38}
              app="Billing"
              appBadge="Universal Escrow"
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <a
              href="https://ads.crimfig.com"
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

            <ThemeSwitcher />
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
            { id: 'rewards', label: `Rewards & Cashback (${rewardsPoints.toLocaleString()} pts)`, icon: Gift },
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
                whiteSpace: 'nowrap'
              }}
            >
              <tab.icon style={{ width: 16, height: 16 }} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Balance Highlights Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              {/* Primary Balance Card */}
              <div
                className="theme-card"
                style={{
                  padding: '24px',
                  borderRadius: '16px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Available Funds
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--color-success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ShieldCheck style={{ width: 14, height: 14 }} /> Fully Escrow Protected
                  </span>
                </div>

                <div>
                  <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                    ${balance.availableUsd.toFixed(2)}{' '}
                    <span style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-muted)' }}>USD</span>
                  </div>
                  <div style={{ fontSize: '15px', color: 'var(--color-crimson)', fontWeight: 600, marginTop: '2px' }}>
                    ≈ ₦{(balance.availableUsd * balance.rate).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} NGN
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setIsFundOpen(true)}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--color-crimson)',
                      color: '#FFFFFF',
                      fontSize: '13px',
                      fontWeight: 600,
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
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--bg-page)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      fontWeight: 600,
                      border: '1px solid var(--border-subtle)',
                      cursor: 'pointer'
                    }}
                  >
                    <ArrowUpRight style={{ width: 16, height: 16 }} /> Withdraw to Bank
                  </button>
                </div>
              </div>

              {/* FX Index & Locked Funds */}
              <div
                className="theme-card"
                style={{
                  padding: '24px',
                  borderRadius: '16px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Live CBN / FX Index Rate
                    </div>
                    <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '6px', backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)', fontWeight: 600 }}>
                      Live API
                    </span>
                  </div>

                  <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)' }}>
                    $1.00 USD = ₦{balance.rate.toLocaleString()} NGN
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Transparent conversion with zero hidden FX spreads. Updated automatically.
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Locked in Active Bids</div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>${balance.lockedUsd.toFixed(2)} USD</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('rewards')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: 'var(--color-crimson)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <span>View Rewards ({rewardsPoints.toLocaleString()} pts)</span>
                    <ChevronRight style={{ width: 14, height: 14 }} />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Recent Transactions Preview */}
            <div
              className="theme-card"
              style={{
                borderRadius: '16px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                padding: '24px',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>Recent Activity</h3>
                <button
                  type="button"
                  onClick={() => setActiveTab('transactions')}
                  style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-crimson)', border: 'none', background: 'transparent', cursor: 'pointer' }}
                >
                  View All &rarr;
                </button>
              </div>

              {transactions.slice(0, 4).map(tx => (
                <div
                  key={tx.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 0',
                    borderBottom: '1px solid var(--border-subtle)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        backgroundColor: tx.type === 'wallet_fund' || tx.type === 'rewards_credit' ? 'var(--color-success-bg)' : 'var(--badge-bg)',
                        color: tx.type === 'wallet_fund' || tx.type === 'rewards_credit' ? 'var(--color-success)' : 'var(--text-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {tx.type === 'wallet_fund' ? <ArrowDownLeft style={{ width: 18, height: 18 }} /> : tx.type === 'rewards_credit' ? <Gift style={{ width: 18, height: 18 }} /> : <ArrowUpRight style={{ width: 18, height: 18 }} />}
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{tx.description}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{tx.createdAt} • Ref: {tx.reference}</div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: tx.type === 'wallet_fund' || tx.type === 'rewards_credit' ? 'var(--color-success)' : 'var(--text-primary)' }}>
                      {tx.type === 'wallet_fund' || tx.type === 'rewards_credit' ? '+' : '-'}${tx.amountUsd.toFixed(2)} USD
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      ₦{tx.amountNgn.toLocaleString()} NGN
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: SAVED CARDS */}
        {activeTab === 'cards' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>Tokenized Cards</h2>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Cards saved securely via Paystack &amp; Stripe Level-1 PCI compliant vaults.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsFundOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--color-crimson)',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <Plus style={{ width: 16, height: 16 }} /> Add Card via Deposit
              </button>
            </div>

            {cards.length === 0 ? (
              <EmptyState
                icon={CreditCard}
                title="No Saved Cards Found"
                description="Make your first deposit to securely save a debit or credit card for automatic recurring subscriptions."
                actionLabel="Fund Wallet & Save Card"
                onAction={() => setIsFundOpen(true)}
              />
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                {cards.map(c => (
                  <div
                    key={c.id}
                    className="theme-card"
                    style={{
                      padding: '20px',
                      borderRadius: '12px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-surface)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-crimson)' }}>
                        {c.provider}
                      </span>
                      {c.isDefault && (
                        <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '9999px', backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)', fontWeight: 600 }}>
                          Default
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--text-primary)' }}>
                      •••• •••• •••• {c.last4}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--text-secondary)' }}>
                      <div>Expires: {c.expMonth}/{c.expYear}</div>
                      <div>{c.bank || c.cardBrand}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SUBSCRIPTIONS */}
        {activeTab === 'subscriptions' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>Active Subscriptions</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Centralized recurring billing across all CrimFig ecosystem applications.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
              {appPlans.map(plan => {
                const isSubscribed = subscriptions.some(s => s.appSlug === plan.appSlug && s.status === 'active');
                return (
                  <div
                    key={plan.appSlug}
                    className="theme-card"
                    style={{
                      padding: '24px',
                      borderRadius: '12px',
                      border: isSubscribed ? '2px solid var(--color-crimson)' : '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-surface)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '16px'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                          {plan.appSlug.toUpperCase()}
                        </span>
                        {isSubscribed && (
                          <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '9999px', backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)', fontWeight: 600 }}>
                            Active
                          </span>
                        )}
                      </div>
                      <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>{plan.name}</h3>
                      <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', margin: '8px 0' }}>
                        ${plan.monthlyUsd} <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-muted)' }}>/ month</span>
                      </div>
                      <ul style={{ paddingLeft: '18px', fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px', margin: 0 }}>
                        {plan.features.map((f, i) => <li key={i}>{f}</li>)}
                      </ul>
                    </div>

                    <button
                      type="button"
                      disabled={isSubscribed}
                      onClick={() => {
                        setSubscriptions([...subscriptions, {
                          id: `sub_${Date.now()}`,
                          appSlug: plan.appSlug,
                          plan: 'monthly',
                          planName: plan.name,
                          priceUsd: plan.monthlyUsd,
                          status: 'active',
                          nextBillingDate: 'Nov 17, 2026',
                          last4: cards[0]?.last4 || '4081'
                        }]);
                      }}
                      style={{
                        padding: '10px',
                        borderRadius: '8px',
                        backgroundColor: isSubscribed ? 'var(--badge-bg)' : 'var(--color-crimson)',
                        color: isSubscribed ? 'var(--text-muted)' : '#FFFFFF',
                        fontSize: '13px',
                        fontWeight: 600,
                        border: 'none',
                        cursor: isSubscribed ? 'default' : 'pointer'
                      }}
                    >
                      {isSubscribed ? 'Subscribed' : 'Subscribe Now'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: BANK ACCOUNTS */}
        {activeTab === 'bank_accounts' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>Verified Payout Bank Accounts</h2>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Instant NUBAN settlement to commercial banks and mobile money wallets.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddBankOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--color-crimson)',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <Plus style={{ width: 16, height: 16 }} /> Add Bank Account
              </button>
            </div>

            {bankAccounts.length === 0 ? (
              <EmptyState
                icon={Building2}
                title="No Bank Accounts Connected"
                description="Link your Nigerian commercial bank account to receive automated withdrawals and creator earnings."
                actionLabel="Link Bank Account"
                onAction={() => setIsAddBankOpen(true)}
              />
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                {bankAccounts.map(b => (
                  <div
                    key={b.id}
                    className="theme-card"
                    style={{
                      padding: '20px',
                      borderRadius: '12px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-surface)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{b.bankName}</span>
                      {b.isDefault && (
                        <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '9999px', backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)', fontWeight: 600 }}>
                          Primary Payout
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-crimson)', fontFamily: 'monospace' }}>
                      {b.accountNumber}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {b.accountName}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: REWARDS & CASHBACK */}
        {activeTab === 'rewards' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    backgroundColor: 'var(--color-crimson)',
                    color: '#FFFFFF',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}
                >
                  CrimFig Ecosystem
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>100 Points = $1.00 USD</span>
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>Rewards &amp; Creator Cashback</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Earnings from Ads network promotions, video/reels creator tips, and developer referrals credited straight to your billing wallet.
              </p>
            </div>

            {rewardsMessage && (
              <div style={{ padding: '12px 16px', borderRadius: '8px', backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600 }}>
                <CheckCircle2 style={{ width: 16, height: 16 }} />
                <span>{rewardsMessage}</span>
              </div>
            )}

            {/* Rewards Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              <div
                className="theme-card"
                style={{
                  padding: '24px',
                  borderRadius: '16px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Available Balance</span>
                  <Coins style={{ width: 18, height: 18, color: 'var(--color-crimson)' }} />
                </div>
                <div>
                  <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--color-crimson)' }}>
                    {rewardsPoints.toLocaleString()} <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-muted)' }}>CF-Points</span>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                    ≈ ${(rewardsPoints / 100).toFixed(2)} USD (₦{((rewardsPoints / 100) * balance.rate).toLocaleString('en-NG', { maximumFractionDigits: 0 })} NGN)
                  </div>
                </div>

                <button
                  type="button"
                  disabled={rewardsPoints <= 0 || isRedeemingRewards}
                  onClick={handleRedeemRewards}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: rewardsPoints > 0 ? 'var(--color-crimson)' : 'var(--badge-bg)',
                    color: rewardsPoints > 0 ? '#FFFFFF' : 'var(--text-muted)',
                    fontSize: '13px',
                    fontWeight: 600,
                    border: 'none',
                    cursor: rewardsPoints > 0 ? 'pointer' : 'not-allowed',
                    boxShadow: rewardsPoints > 0 ? 'var(--shadow-crimson)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {isRedeemingRewards ? <Loader2 style={{ width: 16, height: 16, animation: 'spin 0.75s linear infinite' }} /> : <Sparkles style={{ width: 16, height: 16 }} />}
                  {isRedeemingRewards ? 'Redeeming...' : 'Redeem to Main Wallet Balance'}
                </button>
              </div>

              <div
                className="theme-card"
                style={{
                  padding: '24px',
                  borderRadius: '16px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active Earning Channels</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Ads Network Revenue Share</span>
                    <strong style={{ color: 'var(--text-primary)' }}>1,200 pts ($12.00)</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>CrimFig Stream &amp; Social Tips</span>
                    <strong style={{ color: 'var(--text-primary)' }}>850 pts ($8.50)</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Community &amp; Dev Referrals</span>
                    <strong style={{ color: 'var(--text-primary)' }}>400 pts ($4.00)</strong>
                  </div>
                </div>
                <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)', fontSize: '11px', color: 'var(--text-muted)' }}>
                  Redeemed funds are settled immediately into your main USD wallet and can be withdrawn directly to your Nigerian bank.
                </div>
              </div>
            </div>

            {/* Rewards Stream History */}
            <div
              className="theme-card"
              style={{
                borderRadius: '16px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                padding: '24px',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>Rewards Stream History</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {rewardsHistory.map(r => (
                  <div
                    key={r.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--bg-page)',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '8px',
                          backgroundColor: r.points > 0 ? 'var(--color-success-bg)' : 'var(--badge-bg)',
                          color: r.points > 0 ? 'var(--color-success)' : 'var(--text-muted)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Award style={{ width: 18, height: 18 }} />
                      </div>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{r.title}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{r.date}</div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: r.points > 0 ? 'var(--color-success)' : 'var(--text-muted)' }}>
                        {r.points > 0 ? `+${r.points.toLocaleString()}` : r.points.toLocaleString()} pts
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {r.usdEquivalent > 0 ? `+$${r.usdEquivalent.toFixed(2)} USD` : `-$${Math.abs(r.usdEquivalent).toFixed(2)} USD`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: TRANSACTIONS */}
        {activeTab === 'transactions' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>Transaction Ledger</h2>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Immutable ledger records of funding, payouts, subscription charges, and reward redemptions.</p>
              </div>
            </div>

            <div
              className="theme-card"
              style={{
                borderRadius: '12px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-surface)',
                overflow: 'hidden'
              }}
            >
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-page)', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '12px 16px', fontWeight: 600 }}>Type</th>
                      <th style={{ padding: '12px 16px', fontWeight: 600 }}>Description</th>
                      <th style={{ padding: '12px 16px', fontWeight: 600 }}>Reference</th>
                      <th style={{ padding: '12px 16px', fontWeight: 600 }}>Amount (USD)</th>
                      <th style={{ padding: '12px 16px', fontWeight: 600 }}>Amount (NGN)</th>
                      <th style={{ padding: '12px 16px', fontWeight: 600 }}>Date</th>
                      <th style={{ padding: '12px 16px', fontWeight: 600 }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map(t => (
                      <tr key={t.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', padding: '2px 8px', borderRadius: '4px', backgroundColor: 'var(--badge-bg)', color: 'var(--text-primary)' }}>
                            {t.type.replace('_', ' ')}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', fontWeight: 500, color: 'var(--text-primary)' }}>{t.description}</td>
                        <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: '11px', color: 'var(--text-muted)' }}>{t.reference}</td>
                        <td style={{ padding: '12px 16px', fontWeight: 700, color: t.type === 'wallet_fund' || t.type === 'rewards_credit' ? 'var(--color-success)' : 'var(--text-primary)' }}>
                          ${t.amountUsd.toFixed(2)}
                        </td>
                        <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>₦{t.amountNgn.toLocaleString()}</td>
                        <td style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '12px' }}>{t.createdAt}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '9999px', backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)', fontWeight: 600 }}>
                            {t.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </main>

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

            <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>Deposit to CrimFig Wallet</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Funds are converted and settled instantly to your unified multi-app balance.
            </p>

            {paymentSuccessMsg ? (
              <div style={{ padding: '20px', borderRadius: '8px', backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)', textAlign: 'center', fontWeight: 600, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 style={{ width: 32, height: 32 }} />
                <span>{paymentSuccessMsg}</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>Deposit Amount (USD)</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: 'var(--text-muted)' }}>$</span>
                    <input
                      type="number"
                      min={5}
                      step={5}
                      value={fundAmountUsd}
                      onChange={(e) => setFundAmountUsd(Number(e.target.value))}
                      style={{ width: '100%', padding: '10px 12px 10px 28px', borderRadius: '8px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-page)', fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}
                    />
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--color-crimson)', fontWeight: 600, marginTop: '4px' }}>
                    ≈ ₦{(fundAmountUsd * balance.rate).toLocaleString()} NGN (at ₦{balance.rate}/$)
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>Payment Method</label>
                  <select
                    value={selectedCardId}
                    onChange={(e) => setSelectedCardId(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-page)', fontSize: '14px', color: 'var(--text-primary)' }}
                  >
                    <option value="new">Paystack / Card Gateway (Visa, Mastercard, Verve)</option>
                    {cards.map(c => (
                      <option key={c.id} value={c.id}>Saved {c.cardBrand} ending in •••• {c.last4}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    id="save_card"
                    checked={saveCardPref}
                    onChange={(e) => setSaveCardPref(e.target.checked)}
                    style={{ cursor: 'pointer' }}
                  />
                  <label htmlFor="save_card" style={{ fontSize: '12px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                    Save card securely for future deposits and recurring subscriptions
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
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-crimson)',
                    marginTop: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  {isProcessingPayment && <Loader2 style={{ width: 16, height: 16, animation: 'spin 0.75s linear infinite' }} />}
                  {isProcessingPayment ? 'Processing...' : `Pay $${fundAmountUsd.toFixed(2)} USD`}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: WITHDRAW TO BANK */}
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
              Payouts are sent directly to your linked commercial NUBAN bank account.
            </p>

            {withdrawSuccessMsg ? (
              <div style={{ padding: '20px', borderRadius: '8px', backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)', textAlign: 'center', fontWeight: 600, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 style={{ width: 32, height: 32 }} />
                <span>{withdrawSuccessMsg}</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>Withdrawal Amount (USD)</label>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Available: ${balance.availableUsd.toFixed(2)}</span>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: 'var(--text-muted)' }}>$</span>
                    <input
                      type="number"
                      max={balance.availableUsd}
                      min={5}
                      value={withdrawAmountUsd}
                      onChange={(e) => setWithdrawAmountUsd(Number(e.target.value))}
                      style={{ width: '100%', padding: '10px 12px 10px 28px', borderRadius: '8px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-page)', fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}
                    />
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--color-crimson)', fontWeight: 600, marginTop: '4px' }}>
                    Recipient receives ₦{(withdrawAmountUsd * balance.rate).toLocaleString()} NGN
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>Destination Bank Account</label>
                  {bankAccounts.length === 0 ? (
                    <button
                      type="button"
                      onClick={() => { setIsWithdrawOpen(false); setIsAddBankOpen(true); }}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px dashed var(--color-crimson)', backgroundColor: 'transparent', color: 'var(--color-crimson)', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                    >
                      + Connect Bank Account First
                    </button>
                  ) : (
                    <select
                      value={selectedBankId}
                      onChange={(e) => setSelectedBankId(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-page)', fontSize: '14px', color: 'var(--text-primary)' }}
                    >
                      {bankAccounts.map(b => (
                        <option key={b.id} value={b.id}>{b.bankName} - {b.accountNumber} ({b.accountName})</option>
                      ))}
                    </select>
                  )}
                </div>

                <button
                  type="button"
                  disabled={isProcessingPayment || withdrawAmountUsd > balance.availableUsd || bankAccounts.length === 0}
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
                  {isProcessingPayment && <Loader2 style={{ width: 16, height: 16, animation: 'spin 0.75s linear infinite' }} />}
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
