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
  DollarSign
} from 'lucide-react';

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

export default function BillingApp() {
  const [activeTab, setActiveTab] = useState<'overview' | 'cards' | 'subscriptions' | 'bank_accounts' | 'transactions'>('overview');

  // Wallet State
  const [balance, setBalance] = useState({
    availableUsd: 145.50,
    lockedUsd: 20.00,
    totalUsd: 165.50,
    rate: 1550.00,
    rateSource: 'Frankfurter (Live Primary API)',
    lastUpdated: new Date().toLocaleTimeString(),
  });

  // Funding Modal
  const [isFundOpen, setIsFundOpen] = useState(false);
  const [fundAmountUsd, setFundAmountUsd] = useState<number>(50);
  const [selectedCardId, setSelectedCardId] = useState<string>('card_1');
  const [saveCardPref, setSaveCardPref] = useState<boolean>(true); // Default true
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState<string | null>(null);

  // Withdrawal Modal
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [withdrawAmountUsd, setWithdrawAmountUsd] = useState<number>(25);
  const [selectedBankId, setSelectedBankId] = useState<string>('bank_1');
  const [withdrawSuccessMsg, setWithdrawSuccessMsg] = useState<string | null>(null);

  // Saved Cards
  const [cards, setCards] = useState<SavedCard[]>([
    { id: 'card_1', provider: 'paystack', cardBrand: 'visa', last4: '4081', expMonth: '12', expYear: '28', bank: 'Access Bank', isDefault: true },
    { id: 'card_2', provider: 'paystack', cardBrand: 'mastercard', last4: '8820', expMonth: '08', expYear: '27', bank: 'Zenith Bank', isDefault: false },
  ]);

  // Subscriptions
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([
    { id: 'sub_1', appSlug: 'chat', plan: 'monthly', planName: 'CrimFig Chat Pro', priceUsd: 5.00, status: 'active', nextBillingDate: '2026-10-15', last4: '4081' },
    { id: 'sub_2', appSlug: 'reels', plan: 'monthly', planName: 'CrimFig Reels Creator+', priceUsd: 8.00, status: 'active', nextBillingDate: '2026-10-01', last4: '4081' },
  ]);

  // Bank Accounts
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([
    { id: 'bank_1', bankName: 'Guaranty Trust Bank', bankCode: '058', accountNumber: '0123456789', accountName: 'JEDIDIAH OKAFOR', isDefault: true },
  ]);

  // Add Bank Modal
  const [isAddBankOpen, setIsAddBankOpen] = useState(false);
  const [newBankCode, setNewBankCode] = useState('058');
  const [newAccountNumber, setNewAccountNumber] = useState('');
  const [resolvedAccountName, setResolvedAccountName] = useState<string | null>(null);
  const [isResolving, setIsResolving] = useState(false);

  // Transactions
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 'tx_1', type: 'wallet_fund', status: 'completed', amountUsd: 50.00, amountNgn: 77500, description: 'Wallet Fund via Paystack (Visa **** 4081)', reference: 'cf_fund_991823', exchangeRate: 1550, createdAt: '2026-09-19 11:30' },
    { id: 'tx_2', type: 'subscription_charge', status: 'completed', amountUsd: 5.00, amountNgn: 7750, description: 'CrimFig Chat Pro Subscription', reference: 'cf_sub_827162', exchangeRate: 1550, createdAt: '2026-09-15 09:12' },
    { id: 'tx_3', type: 'ads_earning', status: 'completed', amountUsd: 28.50, amountNgn: 44175, description: 'Promoter Ad Revenue (Reels & Web Embeds)', reference: 'cf_earning_451829', exchangeRate: 1550, createdAt: '2026-09-12 18:45' },
    { id: 'tx_4', type: 'wallet_withdraw', status: 'completed', amountUsd: 20.00, amountNgn: 31000, description: 'Withdrawal to GTBank (0123456789)', reference: 'cf_wdr_102938', exchangeRate: 1550, createdAt: '2026-09-08 14:20' },
  ]);

  // Available Ecosystem App Plans
  const appPlans = [
    { appSlug: 'chat', name: 'Chat Enterprise', monthlyUsd: 15, annualUsd: 150, features: ['Compliance Archive', '200-person video rooms', 'Dedicated SLA'] },
    { appSlug: 'stream', name: 'Stream Creator', monthlyUsd: 12, annualUsd: 120, features: ['1080p60 RTMP ingestion', 'VOD Unlimited', 'Affiliate badges'] },
    { appSlug: 'ads', name: 'Advertiser Pro', monthlyUsd: 20, annualUsd: 200, features: ['Zero platform commission', 'Priority placement bid', 'API Webhooks'] },
  ];

  // Resolve Bank Account
  const handleResolveBank = () => {
    if (newAccountNumber.length < 10) return;
    setIsResolving(true);
    setTimeout(() => {
      setIsResolving(false);
      setResolvedAccountName('JEDIDIAH OKAFOR (VERIFIED)');
    }, 800);
  };

  // Add Bank Account
  const handleAddBank = (e: React.FormEvent) => {
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
      bankName: bankNames[newBankCode] || 'Nigerian Bank',
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
  const handleFundSubmit = () => {
    setIsProcessingPayment(true);
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
          description: selectedCardId === 'new' ? `Fund Wallet $${fundAmountUsd} via Paystack New Card` : `Fund Wallet $${fundAmountUsd} via Saved Card`,
          reference: `cf_fund_${Math.random().toString(36).substring(2, 8)}`,
          exchangeRate: balance.rate,
          createdAt: 'Just now',
        },
        ...transactions,
      ]);
      setPaymentSuccessMsg(`Successfully funded $${fundAmountUsd.toFixed(2)} USD (₦${ngn.toLocaleString()} NGN)!`);
      setTimeout(() => {
        setPaymentSuccessMsg(null);
        setIsFundOpen(false);
      }, 2000);
    }, 1200);
  };

  // Process Withdrawal
  const handleWithdrawSubmit = () => {
    if (withdrawAmountUsd > balance.availableUsd) return;
    const ngn = withdrawAmountUsd * balance.rate;
    setBalance(prev => ({
      ...prev,
      availableUsd: prev.availableUsd - withdrawAmountUsd,
      lockedUsd: prev.lockedUsd + withdrawAmountUsd,
    }));
    setTransactions([
      {
        id: `tx_${Date.now()}`,
        type: 'wallet_withdraw',
        status: 'pending',
        amountUsd: withdrawAmountUsd,
        amountNgn: ngn,
        description: `Withdrawal to Bank (Payout in Progress)`,
        reference: `cf_wdr_${Math.random().toString(36).substring(2, 8)}`,
        exchangeRate: balance.rate,
        createdAt: 'Just now',
      },
      ...transactions,
    ]);
    setWithdrawSuccessMsg(`Withdrawal requested! $${withdrawAmountUsd.toFixed(2)} USD (₦${ngn.toLocaleString()} NGN) is queued for bank payout.`);
    setTimeout(() => {
      setWithdrawSuccessMsg(null);
      setIsWithdrawOpen(false);
    }, 2500);
  };

  // Delete Card
  const handleDeleteCard = (cardId: string) => {
    setCards(cards.filter(c => c.id !== cardId));
  };

  // Set Default Card
  const handleSetDefaultCard = (cardId: string) => {
    setCards(cards.map(c => ({ ...c, isDefault: c.id === cardId })));
  };

  // Cancel Subscription
  const handleCancelSub = (subId: string) => {
    setSubscriptions(subscriptions.map(s => s.id === subId ? { ...s, status: 'cancelled' } : s));
  };

  return (
    <div className="min-h-screen text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <header className="border-b border-white/10 bg-slate-900/60 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-500 flex items-center justify-center font-black text-xl text-white shadow-lg shadow-indigo-500/25">
              CF
            </div>
            <div>
              <div className="font-bold text-lg leading-tight flex items-center gap-2">
                CrimFig <span className="bg-gradient-to-r from-indigo-400 to-sky-400 bg-clip-text text-transparent">Billing</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">Ecosystem Hub</span>
              </div>
            </div>
          </div>

          {/* FX Rate Ticker */}
          <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-800/60 border border-white/10 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>1 USD = ₦{balance.rate.toLocaleString()} NGN</span>
            </div>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">Live Dual-FX</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-xs text-slate-400">Signed in as</div>
              <div className="text-sm font-semibold">jedhppc@gmail.com</div>
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-sm">
              J
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-8">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'overview'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Wallet className="w-4 h-4" />
            Wallet & Balance
          </button>
          <button
            onClick={() => setActiveTab('cards')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'cards'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            Saved Cards ({cards.length})
          </button>
          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'subscriptions'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Layers className="w-4 h-4" />
            Subscriptions ({subscriptions.filter(s => s.status === 'active').length})
          </button>
          <button
            onClick={() => setActiveTab('bank_accounts')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'bank_accounts'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Building2 className="w-4 h-4" />
            Bank Accounts ({bankAccounts.length})
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'transactions'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Clock className="w-4 h-4" />
            Ledger & History
          </button>
        </div>

        {/* TAB 1: OVERVIEW & WALLET */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Hero Wallet Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 glass-card p-6 sm:p-8 relative overflow-hidden bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-indigo-950/40">
                <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">CrimFig Unified Balance</span>
                    <h2 className="text-3xl sm:text-4xl font-black mt-1 tracking-tight">
                      ${balance.availableUsd.toFixed(2)}{' '}
                      <span className="text-sm font-normal text-slate-400">USD</span>
                    </h2>
                    <div className="text-sm font-medium text-emerald-400 mt-1 flex items-center gap-1.5">
                      <span>≈ ₦{(balance.availableUsd * balance.rate).toLocaleString('en-US', { minimumFractionDigits: 2 })} NGN</span>
                      <span className="text-[10px] text-slate-400 font-normal">(@ ₦{balance.rate.toLocaleString()}/$)</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsFundOpen(true)}
                      className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-500 hover:from-indigo-500 hover:to-sky-400 font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all"
                    >
                      <ArrowDownLeft className="w-4 h-4" />
                      Fund Wallet
                    </button>
                    <button
                      onClick={() => setIsWithdrawOpen(true)}
                      className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 font-semibold text-slate-200 border border-white/10 transition-all"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                      Withdraw
                    </button>
                  </div>
                </div>

                {/* Sub balances */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-white/10 text-sm">
                  <div>
                    <span className="text-xs text-slate-400 block">Available Balance</span>
                    <span className="font-bold text-slate-100 text-base">${balance.availableUsd.toFixed(2)} USD</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Reserved / Locked</span>
                    <span className="font-bold text-amber-400 text-base">${balance.lockedUsd.toFixed(2)} USD</span>
                    <span className="text-[10px] text-slate-500 block">Ad budgets & payouts</span>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <span className="text-xs text-slate-400 block">Total Balance</span>
                    <span className="font-bold text-slate-200 text-base">${balance.totalUsd.toFixed(2)} USD</span>
                  </div>
                </div>
              </div>

              {/* Live FX Transparency Box */}
              <div className="glass-card p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-sky-400" />
                      Live Exchange Rate
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Active
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-slate-800/50 border border-white/5">
                      <div className="text-xs text-slate-400">Current Base Rate</div>
                      <div className="text-xl font-bold text-white mt-0.5">1 USD = ₦{balance.rate.toLocaleString()} NGN</div>
                      <div className="text-[11px] text-slate-400 mt-1">Source: {balance.rateSource}</div>
                    </div>
                    <div className="text-xs text-slate-400 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                        <span>All ecosystem fees calculated in USD</span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Funding and withdrawals automatically convert to/from Naira at the instant of transaction.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                  <span>Synced at: {balance.lastUpdated}</span>
                  <button
                    onClick={() => setBalance(prev => ({ ...prev, lastUpdated: new Date().toLocaleTimeString() }))}
                    className="hover:text-indigo-400 flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" /> Refresh
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Actions & Recent Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Active Subscriptions Preview */}
              <div className="glass-card p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-400" />
                    Active Ecosystem Subscriptions
                  </h3>
                  <button onClick={() => setActiveTab('subscriptions')} className="text-xs text-indigo-400 hover:underline">
                    Manage All &rarr;
                  </button>
                </div>
                <div className="space-y-3">
                  {subscriptions.map((sub) => (
                    <div key={sub.id} className="p-3.5 rounded-xl bg-slate-800/40 border border-white/5 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-sm">{sub.planName}</div>
                        <div className="text-xs text-slate-400">${sub.priceUsd.toFixed(2)}/month • Card **** {sub.last4}</div>
                      </div>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-medium">
                        Renews {sub.nextBillingDate}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Transactions Preview */}
              <div className="glass-card p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base flex items-center gap-2">
                    <Clock className="w-4 h-4 text-sky-400" />
                    Recent Financial Events
                  </h3>
                  <button onClick={() => setActiveTab('transactions')} className="text-xs text-indigo-400 hover:underline">
                    Full Ledger &rarr;
                  </button>
                </div>
                <div className="space-y-3">
                  {transactions.slice(0, 3).map((tx) => (
                    <div key={tx.id} className="p-3.5 rounded-xl bg-slate-800/40 border border-white/5 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-sm">{tx.description}</div>
                        <div className="text-xs text-slate-400">{tx.createdAt} • Ref: {tx.reference}</div>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold text-sm ${tx.type === 'wallet_fund' || tx.type === 'ads_earning' ? 'text-emerald-400' : 'text-slate-200'}`}>
                          {tx.type === 'wallet_fund' || tx.type === 'ads_earning' ? '+' : '-'}${tx.amountUsd.toFixed(2)}
                        </div>
                        <div className="text-[11px] text-slate-400">₦{tx.amountNgn.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SAVED CARDS */}
        {activeTab === 'cards' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Saved Payment Methods</h2>
                <p className="text-sm text-slate-400 mt-0.5">
                  Manage your tokenized cards for automatic renewals and 1-click wallet funding.
                </p>
              </div>
              <button
                onClick={() => setIsFundOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all w-fit"
              >
                <Plus className="w-4 h-4" /> Add Card via Fund
              </button>
            </div>

            {/* PCI DSS Notice */}
            <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-start gap-3 text-xs text-indigo-300">
              <ShieldCheck className="w-5 h-5 flex-shrink-0 text-indigo-400 mt-0.5" />
              <div>
                <span className="font-bold">PCI-DSS Compliant Storage:</span> We never store your full card number, CVV, or PIN on CrimFig servers. Transactions are secured via Paystack and Stripe tokenization authorizations.
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cards.map((card) => (
                <div key={card.id} className="glass-card p-6 relative overflow-hidden flex flex-col justify-between border-slate-700/60">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400">{card.bank || 'Bank Card'}</span>
                      {card.isDefault && (
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30 flex items-center gap-1">
                          <Star className="w-3 h-3 fill-indigo-400" /> Default
                        </span>
                      )}
                    </div>
                    <div className="text-xl font-mono tracking-widest text-slate-100 mb-4">
                      •••• •••• •••• {card.last4}
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <div>
                        <span>Expires</span>
                        <div className="font-semibold text-slate-200">{card.expMonth}/{card.expYear}</div>
                      </div>
                      <div>
                        <span>Brand</span>
                        <div className="font-semibold uppercase text-slate-200">{card.cardBrand}</div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-6 border-t border-white/10 flex items-center justify-between">
                    {!card.isDefault ? (
                      <button
                        onClick={() => handleSetDefaultCard(card.id)}
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                      >
                        Set as Default
                      </button>
                    ) : (
                      <span className="text-xs text-slate-500">Default Card</span>
                    )}

                    <button
                      onClick={() => handleDeleteCard(card.id)}
                      className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: SUBSCRIPTIONS */}
        {activeTab === 'subscriptions' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold">App Subscriptions</h2>
              <p className="text-sm text-slate-400 mt-0.5">
                Manage your recurring subscriptions across all CrimFig apps. Auto-billed to saved cards.
              </p>
            </div>

            {/* Current Subscriptions */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-200">Active Plans</h3>
              {subscriptions.map((sub) => (
                <div key={sub.id} className="glass-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="font-bold text-lg">{sub.planName}</span>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                        sub.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400'
                      }`}>
                        {sub.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 mt-1">
                      ${sub.priceUsd.toFixed(2)} USD / {sub.plan} • Auto-renewing via Saved Card (**** {sub.last4})
                    </p>
                    <div className="text-xs text-slate-500 mt-1">
                      Next billing cycle: <span className="text-slate-300">{sub.nextBillingDate}</span>
                    </div>
                  </div>

                  {sub.status === 'active' && (
                    <button
                      onClick={() => handleCancelSub(sub.id)}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-red-400 border border-red-500/20 text-xs font-semibold self-start sm:self-auto"
                    >
                      Cancel Subscription
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* App Catalog to Subscribe */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <h3 className="text-base font-bold text-slate-200">Available Ecosystem Upgrades</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {appPlans.map((plan) => (
                  <div key={plan.appSlug} className="glass-card p-6 flex flex-col justify-between">
                    <div>
                      <div className="font-bold text-lg">{plan.name}</div>
                      <div className="text-2xl font-black mt-2 text-indigo-400">
                        ${plan.monthlyUsd.toFixed(2)}{' '}
                        <span className="text-xs font-normal text-slate-400">/ month</span>
                      </div>
                      <ul className="mt-4 space-y-2 text-xs text-slate-300">
                        {plan.features.map((f, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={() => {
                        setSubscriptions([
                          ...subscriptions,
                          {
                            id: `sub_${Date.now()}`,
                            appSlug: plan.appSlug,
                            plan: 'monthly',
                            planName: plan.name,
                            priceUsd: plan.monthlyUsd,
                            status: 'active',
                            nextBillingDate: '2026-10-19',
                            last4: cards[0]?.last4 || '4081',
                          }
                        ]);
                        alert(`Subscribed to ${plan.name}! Billed to saved card.`);
                      }}
                      className="mt-6 w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-xs text-white transition-all shadow-md shadow-indigo-600/20"
                    >
                      Subscribe with Saved Card
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: BANK ACCOUNTS */}
        {activeTab === 'bank_accounts' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Nigerian Withdrawal Accounts</h2>
                <p className="text-sm text-slate-400 mt-0.5">
                  Register your NUBAN bank accounts to receive USD wallet withdrawals in Naira via Paystack.
                </p>
              </div>
              <button
                onClick={() => setIsAddBankOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all w-fit"
              >
                <Plus className="w-4 h-4" /> Add Bank Account
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bankAccounts.map((acc) => (
                <div key={acc.id} className="glass-card p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-base text-slate-100">{acc.bankName}</span>
                      {acc.isDefault && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                          Default Payout
                        </span>
                      )}
                    </div>
                    <div className="text-sm font-mono text-indigo-300 tracking-wider">
                      Account: {acc.accountNumber}
                    </div>
                    <div className="text-xs text-slate-400 mt-2">
                      Beneficiary: <span className="text-slate-200 font-semibold">{acc.accountName}</span>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-emerald-400 flex items-center gap-1 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Paystack Verified
                    </span>
                    <button
                      onClick={() => setBankAccounts(bankAccounts.filter(b => b.id !== acc.id))}
                      className="text-red-400 hover:text-red-300 flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: TRANSACTIONS LEDGER */}
        {activeTab === 'transactions' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Immutable Financial Ledger</h2>
              <p className="text-sm text-slate-400 mt-0.5">
                Every funding, withdrawal, ad spend, and subscription event with exchange rate snapshots.
              </p>
            </div>

            <div className="glass-card overflow-hidden border border-slate-700/60">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-800/60 text-slate-400 text-xs uppercase tracking-wider border-b border-white/10">
                    <tr>
                      <th className="p-4">Type & Description</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Amount (USD)</th>
                      <th className="p-4">Amount (NGN)</th>
                      <th className="p-4">Rate Snapshot</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="p-4">
                          <div className="font-semibold text-slate-200">{tx.description}</div>
                          <div className="text-[11px] text-slate-500 font-mono">Ref: {tx.reference}</div>
                        </td>
                        <td className="p-4 text-xs text-slate-400 whitespace-nowrap">{tx.createdAt}</td>
                        <td className="p-4 font-bold text-slate-200 whitespace-nowrap">
                          ${tx.amountUsd.toFixed(2)}
                        </td>
                        <td className="p-4 text-xs text-slate-300 whitespace-nowrap">
                          ₦{tx.amountNgn.toLocaleString()}
                        </td>
                        <td className="p-4 text-xs text-indigo-300 whitespace-nowrap font-mono">
                          ₦{tx.exchangeRate.toLocaleString()}/$
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                            tx.status === 'completed'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}>
                            {tx.status}
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

      {/* MODAL 1: FUND WALLET */}
      {isFundOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-card w-full max-w-md p-6 sm:p-8 bg-slate-900 border-slate-700 shadow-2xl relative">
            <button
              onClick={() => setIsFundOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold mb-1">Fund CrimFig Wallet</h3>
            <p className="text-xs text-slate-400 mb-6">
              Balance held in USD. Converted to NGN for Paystack payment.
            </p>

            {paymentSuccessMsg ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>{paymentSuccessMsg}</span>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Preset USD amounts */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-2">Select Amount (USD)</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[10, 25, 50, 100].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setFundAmountUsd(amt)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                          fundAmountUsd === amt
                            ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                            : 'bg-slate-800/60 text-slate-300 border-white/10 hover:bg-slate-700'
                        }`}
                      >
                        ${amt}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    min="1"
                    value={fundAmountUsd}
                    onChange={(e) => setFundAmountUsd(Math.max(1, Number(e.target.value)))}
                    className="w-full mt-2 px-3 py-2 rounded-xl bg-slate-800/80 border border-white/10 text-sm text-white focus:outline-none focus:border-indigo-500"
                    placeholder="Custom amount"
                  />
                </div>

                {/* Conversion breakdown */}
                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-white/5 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Paystack Charge Amount:</span>
                    <span className="font-bold text-white">₦{(fundAmountUsd * balance.rate).toLocaleString()} NGN</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Exchange Rate:</span>
                    <span>1 USD = ₦{balance.rate.toLocaleString()} NGN</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Wallet Credit:</span>
                    <span className="text-emerald-400 font-semibold">+${fundAmountUsd.toFixed(2)} USD</span>
                  </div>
                </div>

                {/* Payment Option: Saved Cards or New Card */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-2">Payment Method</label>
                  <div className="space-y-2">
                    {cards.map((c) => (
                      <label
                        key={c.id}
                        className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                          selectedCardId === c.id ? 'bg-indigo-950/40 border-indigo-500/50' : 'bg-slate-800/40 border-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="paymentCard"
                            checked={selectedCardId === c.id}
                            onChange={() => setSelectedCardId(c.id)}
                            className="text-indigo-600 focus:ring-0"
                          />
                          <span className="font-medium text-slate-200">
                            Saved {c.cardBrand.toUpperCase()} (•••• {c.last4})
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400">{c.bank}</span>
                      </label>
                    ))}
                    <label
                      className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                        selectedCardId === 'new' ? 'bg-indigo-950/40 border-indigo-500/50' : 'bg-slate-800/40 border-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="paymentCard"
                          checked={selectedCardId === 'new'}
                          onChange={() => setSelectedCardId('new')}
                          className="text-indigo-600 focus:ring-0"
                        />
                        <span className="font-medium text-slate-200">Pay with New Card / Paystack</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Save card opt-out checkbox (required by user specifications) */}
                {selectedCardId === 'new' && (
                  <div className="flex items-start gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="saveCardOpt"
                      checked={saveCardPref}
                      onChange={(e) => setSaveCardPref(e.target.checked)}
                      className="mt-0.5 rounded text-indigo-600 focus:ring-0"
                    />
                    <label htmlFor="saveCardOpt" className="text-xs text-slate-300 select-none cursor-pointer">
                      Save this card for 1-click funding and subscriptions (you can remove it anytime)
                    </label>
                  </div>
                )}

                <button
                  type="button"
                  disabled={isProcessingPayment}
                  onClick={handleFundSubmit}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-500 hover:from-indigo-500 hover:to-sky-400 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
                >
                  {isProcessingPayment ? 'Processing with Paystack...' : `Pay ₦${(fundAmountUsd * balance.rate).toLocaleString()} & Credit $${fundAmountUsd} USD`}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: WITHDRAW FUNDS */}
      {isWithdrawOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-card w-full max-w-md p-6 sm:p-8 bg-slate-900 border-slate-700 shadow-2xl relative">
            <button
              onClick={() => setIsWithdrawOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold mb-1">Withdraw to Bank</h3>
            <p className="text-xs text-slate-400 mb-6">
              Funds will be converted from USD and sent to your Nigerian bank account.
            </p>

            {withdrawSuccessMsg ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>{withdrawSuccessMsg}</span>
              </div>
            ) : (
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="font-semibold text-slate-300">Amount (USD)</span>
                    <span className="text-slate-400">Available: ${balance.availableUsd.toFixed(2)}</span>
                  </div>
                  <input
                    type="number"
                    min="5"
                    max={balance.availableUsd}
                    value={withdrawAmountUsd}
                    onChange={(e) => setWithdrawAmountUsd(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-white/10 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">Minimum withdrawal: $5.00 USD</span>
                </div>

                {/* Conversion Preview */}
                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-white/5 space-y-1 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>You Receive in Bank:</span>
                    <span className="font-bold text-emerald-400 text-sm">₦{(withdrawAmountUsd * balance.rate).toLocaleString()} NGN</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Rate Applied:</span>
                    <span>1 USD = ₦{balance.rate.toLocaleString()} NGN</span>
                  </div>
                </div>

                {/* Bank Account Selection */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-2">Payout Bank Account</label>
                  <select
                    value={selectedBankId}
                    onChange={(e) => setSelectedBankId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800/80 border border-white/10 text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    {bankAccounts.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.bankName} — {b.accountNumber} ({b.accountName})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300">
                  Withdrawal requests lock your USD funds immediately and initiate automated NGN Paystack Transfer to your verified bank account.
                </div>

                <button
                  type="button"
                  disabled={withdrawAmountUsd < 5 || withdrawAmountUsd > balance.availableUsd}
                  onClick={handleWithdrawSubmit}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all disabled:opacity-50"
                >
                  Withdraw ₦{(withdrawAmountUsd * balance.rate).toLocaleString()} NGN
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 3: ADD BANK ACCOUNT */}
      {isAddBankOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-card w-full max-w-md p-6 sm:p-8 bg-slate-900 border-slate-700 shadow-2xl relative">
            <button
              onClick={() => setIsAddBankOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold mb-1">Add Nigerian Bank Account</h3>
            <p className="text-xs text-slate-400 mb-6">
              Details are validated in real-time via Paystack NUBAN resolution.
            </p>

            <form onSubmit={handleAddBank} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Select Bank</label>
                <select
                  value={newBankCode}
                  onChange={(e) => {
                    setNewBankCode(e.target.value);
                    setResolvedAccountName(null);
                  }}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800/80 border border-white/10 text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="058">Guaranty Trust Bank</option>
                  <option value="044">Access Bank</option>
                  <option value="057">Zenith Bank</option>
                  <option value="033">United Bank for Africa (UBA)</option>
                  <option value="011">First Bank of Nigeria</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">10-Digit Account Number</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={10}
                    value={newAccountNumber}
                    onChange={(e) => {
                      setNewAccountNumber(e.target.value);
                      setResolvedAccountName(null);
                    }}
                    placeholder="0123456789"
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-800/80 border border-white/10 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleResolveBank}
                    disabled={newAccountNumber.length < 10 || isResolving}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-400 font-semibold text-xs border border-indigo-500/30 disabled:opacity-50"
                  >
                    {isResolving ? 'Resolving...' : 'Verify'}
                  </button>
                </div>
              </div>

              {resolvedAccountName && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <div>
                    <span className="text-[10px] text-emerald-400 uppercase font-bold block">Account Name Found</span>
                    <span className="font-bold">{resolvedAccountName}</span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={!resolvedAccountName}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50 mt-2"
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
