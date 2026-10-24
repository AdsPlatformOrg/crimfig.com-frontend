'use client';

import { SubscriptionCheckout, CheckoutPlan } from './SubscriptionCheckout';
import { SubscriptionPreferences } from './SubscriptionPreferences';
import { WithdrawalForm } from './WithdrawalForm';
import { RewardsHub } from './RewardsHub';
import { BillingSupportHub } from './BillingSupportHub';
import { billingData, resolveBank, saveBank } from '../../lib/billing-api';
import { fundingReturn, fundingRequest, recoverFundingRequest, verifyFundingReference, startFunding, FundingStartError, loadTransactions } from '../../lib/funding-api';
import { walletView } from '../../lib/wallet-view';
import { sessionFetch } from '../../lib/session';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  Coins,
  HelpCircle
} from 'lucide-react';
import { useDialog } from '../../lib/use-dialog';
import { SignOutButton } from '../SessionGate';
import { ThemeSwitcher } from '../ThemeSwitcher';
import { EmptyState } from '../EmptyState';
import { TableSkeleton, CardSkeleton } from '../LoadingStates';
import { CrimFigLogo } from '../CrimFigLogo';
import { DashboardSidebar, NavGroup } from '../DashboardSidebar';
import { Menu } from 'lucide-react';

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
  status: string;
  nextBillingDate: string;
  currentPeriodEnd: string;
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
  amountNgn: number | null;
  description: string;
  reference: string | null;
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
  initialTab?: 'overview' | 'cards' | 'subscriptions' | 'bank_accounts' | 'transactions' | 'rewards' | 'support';
}

const API_BASE = typeof window !== 'undefined' ? '' : (process.env.NEXT_PUBLIC_BILLING_API_URL || 'https://billing-api-production-bb4c.up.railway.app');

export function BillingConsole({ onReturnToLanding, initialTab = 'overview' }: BillingConsoleProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'cards' | 'subscriptions' | 'bank_accounts' | 'transactions' | 'rewards' | 'support'>(initialTab);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Loading Indicators
  const [isLoadingCards, setIsLoadingCards] = useState(true);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);

  const [loadError, setLoadError] = useState<string | null>(null);
  // Wallet State
  const [balance, setBalance] = useState({
    availableUsd: 0,
    lockedUsd: 0,
    totalUsd: 0,
    rate: 0,
    rateSource: 'Not loaded',
    lastUpdated: new Date().toLocaleTimeString(),
  });

  // Rewards State
  const [rewardsPoints, setRewardsPoints] = useState(0);
  const [isRedeemingRewards, setIsRedeemingRewards] = useState(false);
  const [rewardsMessage, setRewardsMessage] = useState<string | null>(null);
  const [rewardsHistory, setRewardsHistory] = useState<RewardItem[]>([]);

  // Funding Modal
  const [isFundOpen, setIsFundOpen] = useState(false);
  const [fundAmountUsd, setFundAmountUsd] = useState<number>(50);
  const [selectedCardId, setSelectedCardId] = useState<string>('new');
  const [saveCardPref, setSaveCardPref] = useState<boolean>(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Withdrawal Modal
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);

  const [checkoutPlan, setCheckoutPlan] = useState<CheckoutPlan | null>(null);

  // Real Collections
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

  const [operationError, setOperationError] = useState<string | null>(null);
  const [supportedBanks, setSupportedBanks] = useState<Array<{ code: string; name: string }>>([]);
  const [resolvedIdentity, setResolvedIdentity] = useState<{ accountNumber: string; bankCode: string } | null>(null);
  const [savingBank, setSavingBank] = useState(false);
  const resolutionGeneration = useRef(0);
  useEffect(() => { resolutionGeneration.current++; setIsResolving(false); setResolvedAccountName(null); setResolvedIdentity(null); }, [newAccountNumber, newBankCode]);

  const fundDialog = useDialog(isFundOpen, () => setIsFundOpen(false));
  const withdrawDialog = useDialog(isWithdrawOpen, () => setIsWithdrawOpen(false));
  const bankDialog = useDialog(isAddBankOpen, () => setIsAddBankOpen(false));

  // Available Ecosystem App Plans
  const [appPlans, setAppPlans] = useState<Array<{ id: string; appSlug: string; name: string; monthlyUsd: number; annualUsd: number; features: string[] }>>([]);

  const [walletStatus, setWalletStatus] = useState<'loading' | 'ready' | 'unavailable'>('loading');
  const [ledgerError, setLedgerError] = useState<string | null>(null);
  const [fundingCheck, setFundingCheck] = useState<{ phase: 'idle' | 'checking' | 'pending' | 'confirmed' | 'unavailable' | 'invalid'; reference: string | null }>({ phase: 'idle', reference: null });
  const [fundAttemptUncertain, setFundAttemptUncertain] = useState(false);
  const [requestRecovery, setRequestRecovery] = useState<{ phase: 'none' | 'loading' | 'ready' | 'pending' | 'missing' | 'unavailable'; id: string | null; url: string | null }>({ phase: 'none', id: null, url: null });
  const recoveryGeneration = useRef(0);
  const requestBlocksFunding = !['none', 'missing'].includes(requestRecovery.phase);
  const accountGeneration = useRef(0), verificationGeneration = useRef(0), lifecycleGeneration = useRef(0), fundingBusy = useRef(false);
  const inFlightVerification = useRef<{ reference: string; promise: ReturnType<typeof verifyFundingReference> } | null>(null);
  const refreshAccountData = useCallback(async () => {
    const generation = ++accountGeneration.current;
    setWalletStatus('loading'); setIsLoadingTransactions(true); setLedgerError(null);
    const [wallet, ledger] = await Promise.allSettled([
      billingData('/api/v1/wallet').then(walletView), loadTransactions(),
    ]);
    if (generation !== accountGeneration.current) return;
    if (wallet.status === 'fulfilled') { setBalance(wallet.value); setWalletStatus('ready'); }
    else setWalletStatus('unavailable');
    if (ledger.status === 'fulfilled') setTransactions(ledger.value);
    else { setTransactions([]); setLedgerError('Transaction history could not be loaded.'); }
    setIsLoadingTransactions(false);
  }, []);
  const checkFunding = useCallback(async (reference: string) => {
    const generation = ++verificationGeneration.current;
    setFundingCheck({ phase: 'checking', reference });
    let request = inFlightVerification.current;
    if (!request || request.reference !== reference) {
      request = { reference, promise: verifyFundingReference(reference) };
      inFlightVerification.current = request;
    }
    try {
      const result = await request.promise;
      if (generation !== verificationGeneration.current) return;
      setFundingCheck({ phase: result.status, reference });
      if (result.status === 'confirmed') { setFundAttemptUncertain(false); await refreshAccountData(); }
    } catch { if (generation === verificationGeneration.current) setFundingCheck({ phase: 'unavailable', reference }); }
    finally { if (inFlightVerification.current === request) inFlightVerification.current = null; }
  }, [refreshAccountData]);
  const recoverRequest = useCallback(async (requestId: string, expectedReference?: string) => {
    const generation = ++recoveryGeneration.current;
    verificationGeneration.current++;
    setRequestRecovery({ phase: 'loading', id: requestId, url: null });
    try {
      const attempt = await recoverFundingRequest(requestId);
      if (generation !== recoveryGeneration.current) return;
      if (attempt.kind === 'missing') { setFundAttemptUncertain(false); setFundingCheck({ phase: 'idle', reference: null }); setRequestRecovery({ phase: 'missing', id: requestId, url: null }); return; }
      if (expectedReference && attempt.reference !== expectedReference) throw new Error('Request/reference mismatch');
      setFundAmountUsd(attempt.amountUsd);
      const url = new URL(window.location.href); url.searchParams.delete('trxref'); url.searchParams.set('reference', attempt.reference); url.searchParams.set('view', 'console');
      window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
      if (attempt.kind === 'checkout') { setFundingCheck({ phase: 'idle', reference: null }); setRequestRecovery({ phase: 'ready', id: requestId, url: attempt.url! }); }
      else { setRequestRecovery({ phase: 'pending', id: requestId, url: null }); void checkFunding(attempt.reference); }
    } catch { if (generation === recoveryGeneration.current) setRequestRecovery({ phase: 'unavailable', id: requestId, url: null }); }
  }, [checkFunding]);
  const invalidateRequests = useCallback(() => { lifecycleGeneration.current++; accountGeneration.current++; verificationGeneration.current++; recoveryGeneration.current++; }, []);
  useEffect(() => {
    lifecycleGeneration.current++;
    void refreshAccountData();
    if (new URLSearchParams(window.location.search).has('withdrawal_request')) setIsWithdrawOpen(true);
    if (new URLSearchParams(window.location.search).has('subscription_request')) { setActiveTab('subscriptions'); return invalidateRequests; }
    const returned = fundingReturn(window.location.search);
    const request = fundingRequest(window.location.search);
    if (request.kind === 'invalid' || returned.kind === 'invalid') { setFundingCheck({ phase: 'invalid', reference: null }); return invalidateRequests; }
    if (request.kind === 'valid') void recoverRequest(request.requestId, returned.kind === 'valid' ? returned.reference : undefined);
    else if (returned.kind === 'valid') void checkFunding(returned.reference);
    return invalidateRequests;
  }, [refreshAccountData, checkFunding, recoverRequest, invalidateRequests]);
  const selectFundingReference = (reference: string) => {
    if (requestRecovery.id) { setOperationError('Recover the current funding request before checking a different payment.'); return; }
    const url = new URL(window.location.href);
    url.searchParams.delete('trxref'); url.searchParams.set('reference', reference); url.searchParams.set('view', 'console');
    window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
    void checkFunding(reference);
  };
  const dismissFundingConfirmation = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('reference'); url.searchParams.delete('trxref'); url.searchParams.delete('funding_request'); url.searchParams.set('view', 'console');
    window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
    setFundingCheck({ phase: 'idle', reference: null }); setRequestRecovery({ phase: 'none', id: null, url: null });
  };

  // Fetch Live Data on mount
  useEffect(() => {
    async function loadBillingData() {
      setIsLoadingCards(true);
      setIsLoadingAccounts(true);

      try {
        const cardsRes = await sessionFetch(`${API_BASE}/api/v1/cards`, {
          headers: {  }
        });
        if (!cardsRes.ok) throw new Error('Billing data unavailable');
        if (cardsRes.ok) {
          const json = await cardsRes.json();
          if (json.data && Array.isArray(json.data)) {
            setCards(json.data.map((card: any) => ({ ...card, cardBrand: card.brand })));
            setSelectedCardId('new');
          }
        }
      } catch (e) {
        console.error('Failed to load cards:', e);
        setLoadError('Saved card or bank-account data could not be loaded.');
      } finally {
        setIsLoadingCards(false);
      }

      try {
        const accsRes = await sessionFetch(`${API_BASE}/api/v1/bank-accounts`, {
          headers: {  }
        });
        if (!accsRes.ok) throw new Error('Billing data unavailable');
        if (accsRes.ok) {
          const json = await accsRes.json();
          if (json.data && Array.isArray(json.data)) {
            setBankAccounts(json.data);
          }
        }
      } catch (e) {
        console.error('Failed to load bank accounts:', e);
        setLoadError('Saved card or bank-account data could not be loaded.');
      } finally {
        setIsLoadingAccounts(false);
      }


    }

    void (async () => {
      try {
        const [catalog, subs, banks] = await Promise.all([billingData('/api/v1/subscriptions/catalog'), billingData('/api/v1/subscriptions'), billingData('/api/v1/bank-accounts/banks')]);
        if (!catalog || typeof catalog !== 'object' || !Array.isArray(subs) || !Array.isArray(banks)) throw new Error('Invalid account/catalog data.');
        const plans = Object.values(catalog).flat() as any[];
        setAppPlans(plans);
        setSubscriptions(subs.map((item: any) => ({ ...item, priceUsd: item.priceUsdCents / 100, planName: plans.find(plan => plan.id === item.plan)?.name || item.plan, nextBillingDate: item.nextBillingDate || '' })));
        setSupportedBanks(banks);
      } catch { setLoadError('Subscription or bank-directory data could not be loaded.'); }
    })();
    loadBillingData();
  }, []);

  const handleResolveBank = async () => {
    const generation = ++resolutionGeneration.current;
    setIsResolving(true); setResolvedAccountName(null); setResolvedIdentity(null); setOperationError(null);
    try {
      const resolved = await resolveBank(newAccountNumber, newBankCode);
      if (generation === resolutionGeneration.current) { setResolvedAccountName(resolved.accountName); setResolvedIdentity(resolved); }
    } catch (err) { if (generation === resolutionGeneration.current) setOperationError(err instanceof Error ? err.message : 'Account could not be verified.'); }
    finally { if (generation === resolutionGeneration.current) setIsResolving(false); }
  };

  const handleAddBank = async (e: React.FormEvent) => {
    e.preventDefault();
    if (savingBank || !resolvedIdentity || resolvedIdentity.accountNumber !== newAccountNumber || resolvedIdentity.bankCode !== newBankCode) return;
    const bank = supportedBanks.find(item => item.code === newBankCode);
    if (!bank) { setOperationError('Select a supported bank.'); return; }
    setSavingBank(true); setOperationError(null);
    try {
      const saved = await saveBank({ accountNumber: newAccountNumber, bankCode: newBankCode, bankName: bank.name });
      setBankAccounts(items => [saved, ...items.filter(item => item.id !== saved.id)]);
      setIsAddBankOpen(false); setNewAccountNumber(''); setResolvedAccountName(null); setResolvedIdentity(null);
    } catch (err) { setOperationError(err instanceof Error ? err.message : 'Account save could not be confirmed.'); }
    finally { setSavingBank(false); }
  };

  // Never replay checkout creation after an ambiguous outcome.
  const handleFundSubmit = async () => {
    if (fundingBusy.current || fundAttemptUncertain || requestBlocksFunding || ['checking', 'pending', 'unavailable'].includes(fundingCheck.phase)) return;
    if (!requestRecovery.id && typeof window.crypto?.randomUUID !== 'function') { setPaymentError('Secure funding request creation is unavailable in this browser.'); return; }
    const lifecycle = lifecycleGeneration.current;
    fundingBusy.current = true; setIsProcessingPayment(true); setPaymentError(null);
    try {
      const requestId = requestRecovery.id || window.crypto.randomUUID();
      const url = new URL(window.location.href); url.searchParams.set('funding_request', requestId); url.searchParams.set('view', 'console');
      window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
      setRequestRecovery({ phase: 'loading', id: requestId, url: null });
      const checkout = await startFunding(fundAmountUsd, saveCardPref, requestId);
      if (lifecycle !== lifecycleGeneration.current) return;
      if (checkout.kind === 'checkout') window.location.assign(checkout.url!);
      else { setIsFundOpen(false); setRequestRecovery({ phase: 'pending', id: checkout.requestId, url: null }); void checkFunding(checkout.reference); }
    } catch (error) {
      if (lifecycle !== lifecycleGeneration.current) return;
      const uncertain = error instanceof FundingStartError ? error.uncertain : true;
      setFundAttemptUncertain(uncertain);
      setRequestRecovery(previous => ({ ...previous, phase: uncertain ? 'unavailable' : 'missing', url: null }));
      setPaymentError(error instanceof Error ? error.message : 'Payment initialization could not be confirmed.');
      if (error instanceof FundingStartError && error.reference) {
        const url = new URL(window.location.href); url.searchParams.delete('trxref'); url.searchParams.set('reference', error.reference); url.searchParams.set('view', 'console');
        window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
        setIsFundOpen(false); void checkFunding(error.reference);
      }
    } finally { fundingBusy.current = false; setIsProcessingPayment(false); }
  };

  const handleRedeemRewards = () => { setOperationError('Rewards redemption is currently unavailable. No balance was changed.'); };

  const billingWorkspace = ['payouts', 'bank_accounts'].includes(activeTab)
    ? 'payouts'
    : activeTab === 'rewards'
      ? 'rewards'
      : 'wallet';

  const walletNavGroups: NavGroup[] = [
    {
      title: 'Wallet & Balances',
      items: [
        { id: 'overview', label: 'Wallet Overview', icon: Wallet },
        { id: 'fund_action', label: 'Fund Wallet', icon: ArrowDownLeft, action: () => setIsFundOpen(true) },
        { id: 'transactions', label: 'Transactions & Receipts', icon: Clock, badge: transactions.length },
      ],
    },
    {
      title: 'Payment Methods',
      items: [
        { id: 'cards', label: 'Saved Cards', icon: CreditCard, badge: cards.length },
        { id: 'subscriptions', label: 'Subscriptions', icon: Sparkles, badge: subscriptions.length },
      ],
    },
    {
      title: 'Support',
      items: [
        { id: 'support', label: 'Help & Inquiries', icon: HelpCircle },
      ],
    },
  ];

  const payoutsNavGroups: NavGroup[] = [
    {
      title: 'Publisher & Payouts',
      items: [
        { id: 'bank_accounts', label: 'Bank Accounts', icon: Building2, badge: bankAccounts.length },
        { id: 'withdraw_action', label: 'Request Withdrawal', icon: ArrowUpRight, action: () => setIsWithdrawOpen(true) },
      ],
    },
    {
      title: 'Settlement History',
      items: [
        { id: 'transactions', label: 'Payout Statements', icon: Clock, badge: transactions.length },
      ],
    },
    {
      title: 'Support',
      items: [
        { id: 'support', label: 'Payout Inquiries', icon: HelpCircle },
      ],
    },
  ];

  const rewardsNavGroups: NavGroup[] = [
    {
      title: 'Rewards & Perks',
      items: [
        { id: 'rewards', label: 'Rewards Hub', icon: Gift, badge: `${rewardsPoints.toLocaleString()} pts` },
      ],
    },
    {
      title: 'Redemption Statements',
      items: [
        { id: 'transactions', label: 'Redemption History', icon: Clock },
      ],
    },
    {
      title: 'Support',
      items: [
        { id: 'support', label: 'Rewards Inquiries', icon: HelpCircle },
      ],
    },
  ];

  const currentBillingNavGroups: NavGroup[] =
    billingWorkspace === 'payouts'
      ? payoutsNavGroups
      : billingWorkspace === 'rewards'
        ? rewardsNavGroups
        : walletNavGroups;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-page)', color: 'var(--text-primary)' }}>
      {operationError && <div role="alert" style={{ position: 'sticky', top: 0, zIndex: 1200, padding: '12px 24px', background: 'var(--bg-elevated)', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-subtle)' }}>{operationError} <button onClick={() => setOperationError(null)} style={{ marginLeft: 12, padding: '6px 12px', borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}>Dismiss</button></div>}
      
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
        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '12px 24px', minHeight: '64px', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', minWidth: 0, maxWidth: '100%' }}>
            {/* Mobile Menu Hamburger */}
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '6px',
                borderRadius: '8px',
                backgroundColor: 'var(--badge-bg)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                cursor: 'pointer',
              }}
              title="Open Navigation Menu"
            >
              <Menu style={{ width: 18, height: 18 }} />
            </button>

            <Link
              href="/"
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
                textDecoration: 'none',
                transition: 'all 0.15s ease'
              }}
              title="Return to Billing Landing Page"
            >
              <ArrowLeft style={{ width: 14, height: 14 }} />
              <span>Home</span>
            </Link>

            <CrimFigLogo
              variant="brand"
              size={38}
              app="Billing"
              appBadge="Universal Escrow"
            />
          </div>

          {/* Segmented Workspace Switcher: Consumer/Business Wallet vs Merchant Payouts vs Rewards Hub */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', maxWidth: '100%', minWidth: 0 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '4px',
                flexWrap: 'wrap',
                maxWidth: '100%',
                boxSizing: 'border-box',
                borderRadius: '12px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  backgroundColor: billingWorkspace === 'wallet' ? 'var(--color-fig-dark)' : 'transparent',
                  color: billingWorkspace === 'wallet' ? '#FFFFFF' : 'var(--text-secondary)',
                }}
              >
                <Wallet style={{ width: 14, height: 14 }} />
                <span>Wallet</span>
              </button>
              <button
                type="button"
                onClick={() => router.push('/payouts')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  backgroundColor: billingWorkspace === 'payouts' ? 'var(--color-crimson)' : 'transparent',
                  color: billingWorkspace === 'payouts' ? '#FFFFFF' : 'var(--text-secondary)',
                }}
              >
                <Building2 style={{ width: 14, height: 14 }} />
                <span>Payouts</span>
              </button>
              <button
                type="button"
                onClick={() => router.push('/rewards')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  backgroundColor: billingWorkspace === 'rewards' ? 'var(--color-crimson)' : 'transparent',
                  color: billingWorkspace === 'rewards' ? '#FFFFFF' : 'var(--text-secondary)',
                }}
              >
                <Gift style={{ width: 14, height: 14 }} />
                <span>Rewards</span>
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', maxWidth: '100%' }}>
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

            <SignOutButton />
          </div>
        </div>
      </header>

      {/* Main Workspace Layout with Unified DashboardSidebar Standard */}
      <div style={{ display: 'flex', flex: 1, minHeight: 'calc(100vh - 65px)', position: 'relative' }}>
        <DashboardSidebar
          app="billing"
          groups={currentBillingNavGroups}
          activeId={activeTab}
          onSelect={(id) => {
            if (id === 'overview') router.push('/dashboard');
            else if (id === 'cards') router.push('/cards');
            else if (id === 'subscriptions') router.push('/subscriptions');
            else if (id === 'bank_accounts') router.push('/payouts');
            else if (id === 'transactions') router.push('/transactions');
            else if (id === 'rewards') router.push('/rewards');
            else if (id === 'support') router.push('/support');
          }}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
          isMobileOpen={isMobileNavOpen}
          onCloseMobile={() => setIsMobileNavOpen(false)}
          switchAppLink={{
            label: 'Ads Studio',
            href: 'https://ads.crimfig.com',
            icon: Layers,
          }}
        />

        {/* Content Area */}
        <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px', flex: 1, width: '100%', display: 'flex', flexDirection: 'column', gap: '28px', minWidth: 0 }}>
        
        {loadError && <p role="alert" style={{ color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 16 }}>{loadError}</p>}
        {(walletStatus === 'unavailable' || ledgerError) && <div role="alert" style={{ border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 16 }}>
          {walletStatus === 'unavailable' ? 'Wallet balance could not be loaded. ' : ''}{ledgerError}
          <button type="button" onClick={() => void refreshAccountData()} style={{ marginLeft: 12, padding: '6px 12px', borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}>Refresh account data</button>
        </div>}
        {requestRecovery.phase !== 'none' && fundingCheck.phase !== 'confirmed' && <section aria-live="polite" style={{ border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 16, overflowWrap: 'anywhere' }}>
          <strong>{requestRecovery.phase === 'ready' ? 'Existing checkout recovered' : requestRecovery.phase === 'missing' ? 'Continue this funding request' : requestRecovery.phase === 'loading' ? 'Recovering funding request' : 'Funding request needs a status check'}</strong>
          <p style={{ color: 'var(--text-secondary)', margin: '8px 0' }}>{requestRecovery.phase === 'ready' ? 'Resume the same checkout. No second payment intent was created.' : requestRecovery.phase === 'missing' ? 'No request was found for this account. Funding will reuse this request ID when you submit the amount.' : 'This request ID is retained across reloads. Recover it before starting another payment.'}</p>
          {requestRecovery.id && <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>Request: {requestRecovery.id}</p>}
          {requestRecovery.phase === 'ready' && requestRecovery.url && <button type="button" onClick={() => window.location.assign(requestRecovery.url!)} style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}>Resume existing checkout</button>}
          {requestRecovery.id && requestRecovery.phase !== 'loading' && <button type="button" onClick={() => void recoverRequest(requestRecovery.id!)} style={{ marginLeft: 8, padding: '6px 12px', borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}>Recover request</button>}
        </section>}
        {fundingCheck.phase !== 'idle' && <section aria-live="polite" style={{ border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 16, overflowWrap: 'anywhere' }}>
          <strong>{fundingCheck.phase === 'checking' ? 'Checking payment status' : fundingCheck.phase === 'confirmed' ? 'Payment confirmed by Billing' : fundingCheck.phase === 'pending' ? 'Payment is still pending' : fundingCheck.phase === 'invalid' ? 'Invalid payment return reference' : 'Payment status could not be confirmed'}</strong>
          <p style={{ color: 'var(--text-secondary)', margin: '8px 0' }}>{fundingCheck.phase === 'confirmed' ? 'The payment was recorded. Your balance and transaction history are refreshed separately below.' : 'A return link does not confirm payment. Check its status before starting another payment.'}</p>
          {fundingCheck.reference && <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>Reference: {fundingCheck.reference}</p>}
          {fundingCheck.reference && fundingCheck.phase !== 'confirmed' && <button type="button" disabled={fundingCheck.phase === 'checking'} onClick={() => void checkFunding(fundingCheck.reference!)} style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}>{fundingCheck.phase === 'checking' ? 'Checking…' : 'Check payment status'}</button>}
          {['confirmed', 'invalid'].includes(fundingCheck.phase) && <button type="button" onClick={dismissFundingConfirmation} style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}>Dismiss</button>}
        </section>}
        {fundAttemptUncertain && fundingCheck.phase === 'idle' && <div role="alert" style={{ border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 16 }}>Payment initialization could not be confirmed. Review pending transactions before starting another payment. <button type="button" onClick={() => { setIsFundOpen(false); setActiveTab('transactions'); void refreshAccountData(); }}>Review transactions</button></div>}
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px', overflowX: 'auto', fontSize: '13px', fontWeight: 600 }}>
          {[
            { id: 'overview', label: 'Wallet Overview', icon: Wallet },
            { id: 'cards', label: `Saved Cards (${cards.length})`, icon: CreditCard },
            { id: 'subscriptions', label: `Subscriptions (${subscriptions.length})`, icon: Sparkles },
            { id: 'bank_accounts', label: `Bank Accounts (${bankAccounts.length})`, icon: Building2 },
            { id: 'rewards', label: `Rewards & Cashback (${rewardsPoints.toLocaleString()} pts)`, icon: Gift },
            { id: 'transactions', label: `Transactions (${isLoadingTransactions ? '…' : ledgerError ? 'unavailable' : transactions.length})`, icon: Clock },
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))', gap: '20px' }}>
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
                    <ShieldCheck style={{ width: 14, height: 14 }} /> Unified wallet balance
                  </span>
                </div>

                <div>
                  <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                    {walletStatus === 'ready' ? `$${balance.availableUsd.toFixed(2)}` : '—'}{' '}
                    <span style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-muted)' }}>USD</span>
                  </div>
                  <div style={{ fontSize: '15px', color: 'var(--color-crimson)', fontWeight: 600, marginTop: '2px' }}>
                    {walletStatus === 'ready' ? `≈ ₦${(balance.availableUsd * balance.rate).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} NGN` : walletStatus === 'loading' ? 'Loading balance…' : 'Balance unavailable'}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                  <button
                    type="button"
                    disabled={walletStatus !== 'ready' || fundAttemptUncertain || requestBlocksFunding || ['checking', 'pending', 'unavailable'].includes(fundingCheck.phase)}
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
                      USD / NGN Quote Rate
                    </div>
                    <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '6px', backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)', fontWeight: 600 }}>
                      {walletStatus === 'ready' ? balance.rateSource : 'Unavailable'}
                    </span>
                  </div>

                  <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {walletStatus === 'ready' ? `$1.00 USD = ₦${balance.rate.toLocaleString()} NGN` : 'Rate unavailable'}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    The payment amount is fixed by the server quote at checkout initialization.
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Reserved funds</div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>{walletStatus === 'ready' ? `$${balance.lockedUsd.toFixed(2)}` : '—'} USD</div>
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

              {isLoadingTransactions && <p role="status" style={{ color: 'var(--text-muted)' }}>Refreshing transaction history…</p>}
              {!isLoadingTransactions && !ledgerError && transactions.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No transactions recorded.</p>}
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
                      {tx.status === 'completed' ? (tx.type === 'wallet_fund' || tx.type === 'rewards_credit' ? '+' : '-') : ''}${tx.amountUsd.toFixed(2)} USD {tx.status !== 'completed' ? `(${tx.status})` : ''}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {tx.amountNgn === null ? '—' : `₦${tx.amountNgn.toLocaleString()} NGN`}
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
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Saved payment authorizations from provider checkout. Saved-card charging is currently unavailable.</p>
              </div>
              <button
                type="button"
                disabled={walletStatus !== 'ready' || fundAttemptUncertain || requestBlocksFunding || ['checking', 'pending', 'unavailable'].includes(fundingCheck.phase)}
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
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Manage paid periods and renewal preferences across CrimFig applications.</p>
            </div>

            <SubscriptionPreferences subscriptions={subscriptions} cards={cards} />
            <SubscriptionCheckout plan={checkoutPlan} onConfirmed={async () => {
              const rows = await billingData('/api/v1/subscriptions');
              if (!Array.isArray(rows)) throw new Error('Subscription list unavailable');
              setSubscriptions(rows.map((item: any) => ({ ...item, priceUsd: item.priceUsdCents / 100, planName: item.plan, nextBillingDate: item.nextBillingDate || '' })));
              await refreshAccountData();
            }} />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))', gap: '16px' }}>
              {appPlans.map(plan => {
                const isSubscribed = subscriptions.some(s => s.appSlug === plan.appSlug && s.status === 'active' && Date.parse(s.currentPeriodEnd) > Date.now());
                return (
                  <div
                    key={plan.id}
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
                      onClick={() => setCheckoutPlan(plan)}
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
                      {isSubscribed ? 'Subscribed' : 'Review subscription'}
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
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Saved account details are verified by the payment provider. Payout availability is shown separately.</p>
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
          <RewardsHub
            onReturnToWallet={() => setActiveTab('overview')}
            onRefreshWalletBalance={() => void refreshAccountData()}
          />
        )}

        {/* TAB 6: SUPPORT & HELPDESK */}
        {activeTab === 'support' && (
          <BillingSupportHub />
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

            {isLoadingTransactions && <p role="status" style={{ color: 'var(--text-muted)' }}>Refreshing transaction history…</p>}
            {!isLoadingTransactions && !ledgerError && transactions.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No transactions recorded.</p>}
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
                        <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{t.amountNgn === null ? '—' : `₦${t.amountNgn.toLocaleString()}`}</td>
                        <td style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '12px' }}>{t.createdAt}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '9999px', backgroundColor: t.status === 'completed' ? 'var(--color-success-bg)' : 'var(--badge-bg)', color: t.status === 'completed' ? 'var(--color-success)' : 'var(--text-secondary)', fontWeight: 600 }}>
                            {t.status}
                          </span>
                          {t.type === 'wallet_fund' && t.status === 'pending' && t.reference && <button type="button" disabled={fundingCheck.phase === 'checking'} onClick={() => selectFundingReference(t.reference!)} style={{ marginLeft: 8, padding: '6px 10px', borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}>Check payment</button>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Billing Console Footer */}
        <footer
          style={{
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-surface)',
            padding: '18px 24px',
            marginTop: 'auto',
          }}
        >
          <div
            style={{
              maxWidth: '1200px',
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
              fontSize: '12px',
              color: 'var(--text-muted)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>CrimFig Billing &amp; Escrow</span>
              <span>•</span>
              <span>© {new Date().getFullYear()} CrimFig Ecosystem</span>
            </div>

            <ThemeSwitcher showLabel labelPrefix="Theme:" />
          </div>
        </footer>
      </main>
      </div>

      {/* MODAL: FUND WALLET */}
      {isFundOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)' }}>
          <div ref={fundDialog} role="dialog" aria-modal="true" aria-label="Deposit to CrimFig Wallet" tabIndex={-1} className="theme-card" style={{ width: '100%', maxWidth: '480px', padding: '32px', backgroundColor: 'var(--bg-page)', position: 'relative', boxSizing: 'border-box', maxHeight: 'calc(100dvh - 32px)', overflowY: 'auto' }}>
            <button
              type="button"
              aria-label="Close Deposit to CrimFig Wallet"
              onClick={() => setIsFundOpen(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <X style={{ width: 20, height: 20 }} />
            </button>

            <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>Deposit to CrimFig Wallet</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Funding is credited after Billing verifies the provider payment. Your return link alone does not confirm payment.
            </p>

            {paymentError ? (
              <div role="alert" style={{ padding: '20px', borderRadius: '8px', backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <AlertCircle style={{ width: 32, height: 32 }} />
                <span>{paymentError}</span>
                {fundAttemptUncertain ? <button type="button" onClick={() => { setIsFundOpen(false); setActiveTab('transactions'); void refreshAccountData(); }}>Review transactions</button> : <button type="button" onClick={() => setPaymentError(null)}>Back to funding</button>}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label htmlFor="billing-fund-amount" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>Deposit Amount (USD)</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: 'var(--text-muted)' }}>$</span>
                    <input id="billing-fund-amount"
                      type="number"
                      min={1}
                      step={0.01}
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
                  <label htmlFor="billing-fund-method" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>Payment Method</label>
                  <select id="billing-fund-method"
                    value={selectedCardId}
                    onChange={(e) => setSelectedCardId(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-page)', fontSize: '14px', color: 'var(--text-primary)' }}
                  >
                    <option value="new">Paystack / Card Gateway (Visa, Mastercard, Verve)</option>
                    {cards.map(c => (
                      <option key={c.id} value={c.id} disabled>Saved {c.cardBrand} ending in •••• {c.last4}</option>
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
                  disabled={isProcessingPayment || fundAttemptUncertain || requestBlocksFunding || walletStatus !== 'ready' || fundAmountUsd < 1 || ['checking', 'pending', 'unavailable'].includes(fundingCheck.phase)}
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
        <div style={{ position: 'fixed', inset: 0, zIndex: 1300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)' }}>
          <div ref={withdrawDialog} role="dialog" aria-modal="true" aria-label="Withdraw to Bank Account" tabIndex={-1} className="theme-card" style={{ width: '100%', maxWidth: '480px', padding: '32px', backgroundColor: 'var(--bg-page)', position: 'relative', boxSizing: 'border-box', maxHeight: 'calc(100dvh - 32px)', overflowY: 'auto' }}>
            <button
              type="button"
              aria-label="Close Withdraw to Bank Account"
              onClick={() => setIsWithdrawOpen(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <X style={{ width: 20, height: 20 }} />
            </button>

            <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>Withdraw to Bank Account</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Review the fees and net payout before confirming your withdrawal.
            </p>

            <WithdrawalForm banks={bankAccounts} availableUsd={walletStatus === 'ready' ? balance.availableUsd : null} onRefresh={refreshAccountData} />
          </div>
        </div>
      )}

      {/* MODAL: ADD BANK ACCOUNT */}
      {isAddBankOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)' }}>
          <div ref={bankDialog} role="dialog" aria-modal="true" aria-label="Connect Bank Account" tabIndex={-1} className="theme-card" style={{ width: '100%', maxWidth: '480px', padding: '32px', backgroundColor: 'var(--bg-page)', position: 'relative', boxSizing: 'border-box', maxHeight: 'calc(100dvh - 32px)', overflowY: 'auto' }}>
            <button
              type="button"
              aria-label="Close Connect Bank Account"
              onClick={() => setIsAddBankOpen(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <X style={{ width: 20, height: 20 }} />
            </button>

            <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>Connect Bank Account</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Verify the account holder before saving this bank account.
            </p>

            <form onSubmit={handleAddBank} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label htmlFor="billing-bank-code" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>Select Bank</label>
                <select id="billing-bank-code"
                  value={newBankCode}
                  onChange={(e) => { setNewBankCode(e.target.value); setResolvedAccountName(null); }}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-page)', fontSize: '14px', color: 'var(--text-primary)' }}
                >
                  <option value="">Choose a supported bank</option>
                  {supportedBanks.map(bank => <option key={bank.code} value={bank.code}>{bank.name}</option>)}
                </select>
              </div>

              <div>
                <label htmlFor="billing-bank-number" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>10-Digit Account Number</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input id="billing-bank-number"
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
                disabled={!resolvedAccountName || savingBank || !resolvedIdentity}
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
