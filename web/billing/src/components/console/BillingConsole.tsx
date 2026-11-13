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
import { AccountMenu } from '../../../../../shared/ui/account-menu';
import { ecosystemOrigin } from '../../../../../shared/ui/origins';
import { ThemeSwitcher } from '../ThemeSwitcher';
import { EmptyState } from '../EmptyState';
import { TableSkeleton, CardSkeleton } from '../LoadingStates';
import { CrimFigLogo } from '../CrimFigLogo';
import { DashboardSidebar, NavGroup } from '../DashboardSidebar';
import { dashboardSession } from '../../lib/session';
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
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
  fundingRequestId?:string|null;
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

type FundingIntent={requestId:string;amountUsd:number;saveCard:boolean;reference?:string};

interface BillingConsoleProps {
  onReturnToLanding?: () => void;
  initialTab?: 'overview' | 'cards' | 'subscriptions' | 'bank_accounts' | 'transactions' | 'rewards' | 'support';
}

const API_BASE = typeof window !== 'undefined' ? '' : (process.env.NEXT_PUBLIC_BILLING_API_URL || 'https://billing-api-production-bb4c.up.railway.app');

export function BillingConsole({ onReturnToLanding, initialTab = 'overview' }: BillingConsoleProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'cards' | 'subscriptions' | 'bank_accounts' | 'transactions' | 'rewards' | 'support'>(initialTab);
  useEffect(() => { setActiveTab(initialTab); setIsMobileNavOpen(false); }, [initialTab]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const authBase = ecosystemOrigin('auth', process.env.NEXT_PUBLIC_AUTH_WEB_URL);
  const adsBase = ecosystemOrigin('ads', process.env.NEXT_PUBLIC_ADS_WEB_URL, authBase);
  useEffect(() => {
    if (!isMobileNavOpen) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileNavOpen(false);
        document.getElementById('billing-mobile-menu-toggle')?.focus();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobileNavOpen]);

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
  const fundDialogEpoch=useRef(0);
  const closeDeposit=()=>{fundDialogEpoch.current++;setIsFundOpen(false);};

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
  const [bankDirectoryStatus, setBankDirectoryStatus] = useState<'idle' | 'loading' | 'ready' | 'unavailable'>('idle');
  const loadBankDirectory = useCallback(async () => {
    setBankDirectoryStatus('loading');
    try {
      const banks = await billingData('/api/v1/bank-accounts/banks');
      if (!Array.isArray(banks) || !banks.length || banks.some(bank => !bank || typeof bank.code !== 'string' || !bank.code.trim() || typeof bank.name !== 'string' || !bank.name.trim())) {
        throw new Error('Invalid bank directory');
      }
      setSupportedBanks(banks);
      setBankDirectoryStatus('ready');
    } catch {
      setSupportedBanks([]);
      setBankDirectoryStatus('unavailable');
    }
  }, []);
  const [resolvedIdentity, setResolvedIdentity] = useState<{ accountNumber: string; bankCode: string } | null>(null);
  const [savingBank, setSavingBank] = useState(false);
  const resolutionGeneration = useRef(0);
  useEffect(() => { resolutionGeneration.current++; setIsResolving(false); setResolvedAccountName(null); setResolvedIdentity(null); }, [newAccountNumber, newBankCode]);

  const fundDialog = useDialog(isFundOpen, closeDeposit);
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
  const fundingIntent = useRef<FundingIntent|null>(null);
  const accountGeneration = useRef(0), verificationGeneration = useRef(0), lifecycleGeneration = useRef(0), fundingBusy = useRef(false);
  const fundingPoll=useRef<{reference:string|null;attempts:number}>({reference:null,attempts:0});
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
      if (result.status === 'confirmed') { if(fundingIntent.current?.reference===reference){setFundAttemptUncertain(false);fundingIntent.current=null;} await refreshAccountData(); }
    } catch { if (generation === verificationGeneration.current) setFundingCheck({ phase: 'unavailable', reference }); }
    finally { if (inFlightVerification.current === request) inFlightVerification.current = null; }
  }, [refreshAccountData]);
  useEffect(()=>{
    if(fundingCheck.phase!=='pending'||!fundingCheck.reference)return;
    if(fundingPoll.current.reference!==fundingCheck.reference)fundingPoll.current={reference:fundingCheck.reference,attempts:0};
    if(fundingPoll.current.attempts>=6)return;
    const reference=fundingCheck.reference;
    const timer=setTimeout(()=>{fundingPoll.current.attempts++;void checkFunding(reference);},5000);
    return()=>clearTimeout(timer);
  },[fundingCheck,checkFunding]);
  const recoverRequest = useCallback(async (requestId: string, expectedReference?: string) => {
    const generation = ++recoveryGeneration.current;
    verificationGeneration.current++;
    setRequestRecovery({ phase: 'loading', id: requestId, url: null });
    try {
      const attempt = await recoverFundingRequest(requestId);
      if (generation !== recoveryGeneration.current) return;
      if (attempt.kind === 'missing') { setFundingCheck({ phase: 'idle', reference: null }); setRequestRecovery({ phase: 'missing', id: requestId, url: null }); return; }
      if (expectedReference && attempt.reference !== expectedReference) throw new Error('Request/reference mismatch');
      // Optional recovery never overwrites a separately edited deposit amount.
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
    if(returned.kind==='invalid'){setFundingCheck({phase:'invalid',reference:null});return invalidateRequests;}
    // A valid provider return is verified by owner/reference; stale lookup parameters cannot gate it.
    if(returned.kind==='valid')void checkFunding(returned.reference);
    else if(request.kind==='valid')void recoverRequest(request.requestId);
    else if(request.kind==='invalid')setFundingCheck({phase:'invalid',reference:null});
    return invalidateRequests;
  }, [refreshAccountData, checkFunding, recoverRequest, invalidateRequests]);
  const selectFundingReference = (reference: string) => {
    ++recoveryGeneration.current;setRequestRecovery({phase:'none',id:null,url:null});
    const url = new URL(window.location.href);
    url.searchParams.delete('funding_request');url.searchParams.delete('trxref'); url.searchParams.set('reference', reference); url.searchParams.set('view', 'console');
    window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
    void checkFunding(reference);
  };
  const dismissFundingConfirmation = () => {
    ++verificationGeneration.current;++recoveryGeneration.current;
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
        const [catalog, subs] = await Promise.all([billingData('/api/v1/subscriptions/catalog'), billingData('/api/v1/subscriptions')]);
        if (!catalog || typeof catalog !== 'object' || !Array.isArray(subs)) throw new Error('Invalid account/catalog data.');
        const plans = Object.values(catalog).flat() as any[];
        setAppPlans(plans);
        setSubscriptions(subs.map((item: any) => ({ ...item, priceUsd: item.priceUsdCents / 100, planName: plans.find(plan => plan.id === item.plan)?.name || item.plan, nextBillingDate: item.nextBillingDate || '' })));
      } catch { setLoadError('Subscription data could not be loaded.'); }
    })();
    loadBillingData();
  }, []);

  useEffect(() => {
    if (isAddBankOpen && bankDirectoryStatus === 'idle') void loadBankDirectory();
  }, [isAddBankOpen, bankDirectoryStatus, loadBankDirectory]);

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

  // A new deposit is an explicit new intent; recovery of an older payment is optional.
  const openDeposit = () => {
    if(fundingBusy.current)return;
    ++recoveryGeneration.current;fundDialogEpoch.current++;fundingIntent.current=null;setFundAttemptUncertain(false);setPaymentError(null);setIsFundOpen(true);
  };
  const handleFundSubmit = async (retrySame=false) => {
    if(fundingBusy.current || (fundAttemptUncertain&&!retrySame))return;
    if(typeof window.crypto?.randomUUID!=='function'){setPaymentError('Secure funding request creation is unavailable in this browser.');return;}
    if(walletStatus!=='ready'||!Number.isFinite(fundAmountUsd)||fundAmountUsd<1)return;
    const saved:FundingIntent|null=retrySame?fundingIntent.current:{requestId:window.crypto.randomUUID(),amountUsd:fundAmountUsd,saveCard:saveCardPref};
    if(!saved){setPaymentError('Select Deposit to start a new payment.');return;}
    fundingIntent.current=saved;
    const lifecycle=lifecycleGeneration.current,dialogEpoch=fundDialogEpoch.current;
    fundingBusy.current=true;setIsProcessingPayment(true);setPaymentError(null);++recoveryGeneration.current;
    try{
      const url=new URL(window.location.href);url.searchParams.delete('reference');url.searchParams.delete('trxref');url.searchParams.set('funding_request',saved.requestId);url.searchParams.set('view','console');
      window.history.replaceState(window.history.state,'',`${url.pathname}${url.search}${url.hash}`);
      setRequestRecovery({phase:'loading',id:saved.requestId,url:null});
      const checkout=await startFunding(saved.amountUsd,saved.saveCard,saved.requestId);
      if(lifecycle!==lifecycleGeneration.current)return;
      saved.reference=checkout.reference;setFundAttemptUncertain(false);
      if(checkout.kind==='checkout'){if(dialogEpoch===fundDialogEpoch.current)window.location.assign(checkout.url!);else setRequestRecovery({phase:'ready',id:checkout.requestId,url:checkout.url!});}
      else{setIsFundOpen(false);setRequestRecovery({phase:'pending',id:checkout.requestId,url:null});void checkFunding(checkout.reference);}
    }catch(error){
      if(lifecycle!==lifecycleGeneration.current)return;
      const uncertain=error instanceof FundingStartError?error.uncertain:true;
      setFundAttemptUncertain(uncertain);
      if (!uncertain) {
        fundingIntent.current = null;
        const url = new URL(window.location.href);
        if (url.searchParams.get('funding_request') === saved.requestId) {
          url.searchParams.delete('funding_request');
          window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
        }
        setRequestRecovery({ phase: 'none', id: null, url: null });
      } else {
        setRequestRecovery({ phase: 'unavailable', id: saved.requestId, url: null });
      }
      setPaymentError(error instanceof Error?error.message:'Payment initialization could not be confirmed.');
      if(error instanceof FundingStartError&&error.reference){saved.reference=error.reference;void checkFunding(error.reference);}
    }finally{fundingBusy.current=false;if(lifecycle===lifecycleGeneration.current)setIsProcessingPayment(false);}
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
        { id: 'fund_action', label: 'Fund Wallet', icon: ArrowDownLeft, action: openDeposit },
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
      {operationError && (
        <Alert variant="destructive" style={{ position: 'sticky', top: 0, zIndex: 1200, justifyContent: 'space-between' }}>
          <AlertDescription>{operationError}</AlertDescription>
          <Button type="button" variant="outline" size="sm" onClick={() => setOperationError(null)}>Dismiss</Button>
        </Alert>
      )}
      
      <header style={{borderBottom:'1px solid var(--border-subtle)',background:'var(--bg-page)',position:'sticky',top:0,zIndex:40}}>
        <div className="cf-console-row">
          <div className="cf-console-brand">
            <Button id="billing-mobile-menu-toggle" type="button" variant="outline" size="icon" className="cf-console-mobile-menu" aria-label="Open navigation menu" aria-expanded={isMobileNavOpen} aria-controls="billing-dashboard-sidebar" onClick={()=>setIsMobileNavOpen(true)}><Menu size={20} aria-hidden="true" /></Button>
            <CrimFigLogo variant="brand" app="Billing" href="/" />
          </div>
          <nav className="cf-workspace-nav" aria-label="Billing workspaces">
            <a href="/dashboard" aria-current={billingWorkspace==='wallet'?'page':undefined}>Wallet</a>
            <a href="/payouts" aria-current={billingWorkspace==='payouts'?'page':undefined}>Payouts</a>
            <a href="/rewards" aria-current={billingWorkspace==='rewards'?'page':undefined}>Rewards</a>
          </nav>
          <div className="cf-console-actions">
            <Button asChild variant="outline" size="sm" className="cf-console-context-action"><a href={adsBase}>Ads Studio</a></Button>
            <AccountMenu session={dashboardSession()} links={[{label:'Profile & Avatar',href:`${authBase}/profile`},{label:'Account Security',href:`${authBase}/security`}]} />
          </div>
        </div>
      </header>

      {/* Main Workspace Layout with Unified DashboardSidebar Standard */}
      <div style={{ display: 'flex', flex: 1, minHeight: 'calc(100vh - 65px)', position: 'relative' }}>
        <DashboardSidebar
          app="billing"
          groups={[{title:'Workspaces',items:[{id:'workspace_wallet',label:'Wallet',icon:Wallet,href:'/dashboard'},{id:'workspace_payouts',label:'Payouts',icon:Building2,href:'/payouts'},{id:'workspace_rewards',label:'Rewards',icon:Gift,href:'/rewards'}]},...currentBillingNavGroups]}
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
            href: adsBase,
            icon: Layers,
          }}
        />

        {/* Content Area */}
        <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px', flex: 1, width: '100%', display: 'flex', flexDirection: 'column', gap: '28px', minWidth: 0 }}>
        
        {loadError && <Alert variant="destructive"><AlertDescription>{loadError}</AlertDescription></Alert>}
        {(walletStatus === 'unavailable' || ledgerError) && <Alert variant="destructive" style={{ flexWrap: 'wrap' }}>
          <AlertDescription style={{ minWidth: 0, flex: '1 1 200px' }}>{walletStatus === 'unavailable' ? 'Wallet balance could not be loaded. ' : ''}{ledgerError}</AlertDescription>
          <Button type="button" variant="outline" size="sm" style={{ flexShrink: 0 }} onClick={() => void refreshAccountData()}>Refresh account data</Button>
        </Alert>}
        {fundingCheck.phase==='confirmed'&&<Alert variant="success"><AlertDescription>Payment confirmed. Updated balance is shown when available.</AlertDescription></Alert>}
        <details className="billing-payment-help"><summary>Find or check a payment (optional)</summary><p>Previous payments remain in Transactions. A pending payment may still complete; a separate deposit creates a separate payment.</p><Button type="button" variant="outline" onClick={()=>setActiveTab('transactions')}>View transactions</Button>
        {requestRecovery.phase !== 'none' && fundingCheck.phase !== 'confirmed' && <Alert variant="info" style={{ overflowWrap: 'anywhere' }}>
          <div>
          <strong>{requestRecovery.phase === 'ready' ? 'Existing checkout recovered' : requestRecovery.phase === 'missing' ? 'Continue this funding request' : requestRecovery.phase === 'loading' ? 'Recovering funding request' : 'Funding request needs a status check'}</strong>
          <p style={{ color: 'var(--text-secondary)', margin: '8px 0' }}>{requestRecovery.phase === 'ready' ? 'Continue the existing checkout without creating a new payment.' : requestRecovery.phase === 'missing' ? 'No matching request was found for this account. You can start a new deposit.' : 'Check this existing payment if you need help. It does not prevent you starting a separate deposit.'}</p>
          {requestRecovery.id && <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>Request: {requestRecovery.id}</p>}
          {requestRecovery.phase === 'ready' && requestRecovery.url && <Button type="button" variant="outline" size="sm" onClick={() => window.location.assign(requestRecovery.url!)}>Resume existing checkout</Button>}
          {requestRecovery.id && requestRecovery.phase !== 'loading' && <Button type="button" variant="outline" size="sm" onClick={() => void recoverRequest(requestRecovery.id!)}>Find existing payment</Button>}
          </div>
        </Alert>}
        {fundingCheck.phase !== 'idle' && <Alert variant={fundingCheck.phase === 'confirmed' ? 'success' : fundingCheck.phase === 'invalid' || fundingCheck.phase === 'unavailable' ? 'destructive' : 'info'} style={{ overflowWrap: 'anywhere' }}>
          <div>
          <strong>{fundingCheck.phase === 'checking' ? 'Checking payment status' : fundingCheck.phase === 'confirmed' ? 'Payment confirmed by Billing' : fundingCheck.phase === 'pending' ? 'Payment is still pending' : fundingCheck.phase === 'invalid' ? 'Invalid payment return reference' : 'Payment status could not be confirmed'}</strong>
          <p style={{ color: 'var(--text-secondary)', margin: '8px 0' }}>{fundingCheck.phase === 'confirmed' ? 'The payment was recorded. Your balance and transaction history are refreshed separately below.' : 'This payment may still complete. Check it here, or deliberately start a separate deposit.'}</p>
          {fundingCheck.reference && <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>Reference: {fundingCheck.reference}</p>}
          {fundingCheck.reference && fundingCheck.phase !== 'confirmed' && <Button type="button" variant="outline" size="sm" disabled={fundingCheck.phase === 'checking'} loading={fundingCheck.phase === 'checking'} onClick={() => void checkFunding(fundingCheck.reference!)}>{fundingCheck.phase === 'checking' ? 'Checking…' : 'Check payment status'}</Button>}
          {['confirmed', 'invalid'].includes(fundingCheck.phase) && <Button type="button" variant="outline" size="sm" onClick={dismissFundingConfirmation}>Dismiss</Button>}
          </div>
        </Alert>}
        {fundAttemptUncertain && fundingCheck.phase === 'idle' && <Alert variant="warning"><div>An earlier payment is unconfirmed and may still complete. Check it below or deliberately start a separate deposit. <Button type="button" variant="outline" size="sm" onClick={() => { closeDeposit(); setActiveTab('transactions'); void refreshAccountData(); }}>Review transactions</Button></div></Alert>}
        </details>
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
            <Button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              size="sm"
              variant={activeTab === tab.id ? 'default' : 'ghost'}
              aria-pressed={activeTab === tab.id}
              style={{ flexShrink: 0 }}
            >
              <tab.icon style={{ width: 16, height: 16 }} />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Balance Highlights Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))', gap: '20px' }}>
              {/* Primary Balance Card */}
              <Card
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
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
                  <Button
                    type="button"
                    disabled={walletStatus !== 'ready' || isProcessingPayment}
                    onClick={openDeposit}
                    style={{ flex: 1 }}
                  >
                    <ArrowDownLeft style={{ width: 16, height: 16 }} /> Fund Wallet
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsWithdrawOpen(true)}
                    style={{ flex: 1 }}
                  >
                    <ArrowUpRight style={{ width: 16, height: 16 }} /> Withdraw to Bank
                  </Button>
                </div>
              </Card>

              {/* FX Index & Locked Funds */}
              <Card
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
                    <Badge variant={walletStatus === 'ready' ? 'secondary' : 'outline'}>
                      {walletStatus === 'ready' ? balance.rateSource : 'Unavailable'}
                    </Badge>
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
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setActiveTab('rewards')}
                  >
                    <span>View Rewards ({rewardsPoints.toLocaleString()} pts)</span>
                    <ChevronRight style={{ width: 14, height: 14 }} />
                  </Button>
                </div>
              </Card>
            </div>

            {/* Quick Recent Transactions Preview */}
            <Card
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
                <Button
                  type="button"
                  variant="link"
                  onClick={() => setActiveTab('transactions')}
                >
                  View All &rarr;
                </Button>
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
            </Card>
          </div>
        )}

        {/* TAB 2: SAVED CARDS */}
        {activeTab === 'cards' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>Tokenized Cards</h2>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Saved payment authorizations from provider checkout. Saved-card charging is currently unavailable.</p>
              </div>
              <Button
                type="button"
                disabled={walletStatus !== 'ready' || isProcessingPayment}
                onClick={openDeposit}
              >
                <Plus style={{ width: 16, height: 16 }} /> Add Card via Deposit
              </Button>
            </div>

            {cards.length === 0 ? (
              <EmptyState
                icon={CreditCard}
                title="No Saved Cards Found"
                description="Make your first deposit to securely save a debit or credit card for automatic recurring subscriptions."
                actionLabel="Fund Wallet & Save Card"
                onAction={openDeposit}
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-crimson)' }}>
                        {c.provider}
                      </span>
                      {c.isDefault && (
                      <Badge variant="secondary">
                          Default
                      </Badge>
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
                          <Badge variant="secondary">
                            Active
                          </Badge>
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

                    <Button
                      type="button"
                      disabled={isSubscribed}
                      onClick={() => setCheckoutPlan(plan)}
                      variant={isSubscribed ? 'secondary' : 'default'}
                      style={{ width: '100%' }}
                    >
                      {isSubscribed ? 'Subscribed' : 'Review subscription'}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: BANK ACCOUNTS */}
        {activeTab === 'bank_accounts' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>Verified Payout Bank Accounts</h2>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Saved account details are verified by the payment provider. Payout availability is shown separately.</p>
              </div>
              <Button
                type="button"
                onClick={() => setIsAddBankOpen(true)}
              >
                <Plus style={{ width: 16, height: 16 }} /> Add Bank Account
              </Button>
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{b.bankName}</span>
                      {b.isDefault && (
                        <Badge variant="secondary">
                          Primary Payout
                        </Badge>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>Transaction Ledger</h2>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Immutable ledger records of funding, payouts, subscription charges, and reward redemptions.</p>
              </div>
            </div>

            {isLoadingTransactions && <p role="status" style={{ color: 'var(--text-muted)' }}>Refreshing transaction history…</p>}
            {!isLoadingTransactions && !ledgerError && transactions.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No transactions recorded.</p>}
            <Card
              className="theme-card"
              style={{
                borderRadius: '12px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-surface)',
                overflow: 'hidden'
              }}
            >
              <Table>
                  <TableHeader>
                    <TableRow style={{ backgroundColor: 'var(--bg-page)', color: 'var(--text-muted)' }}>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Amount (USD)</TableHead>
                      <TableHead>Amount (NGN)</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map(t => (
                      <TableRow key={t.id}>
                        <TableCell>
                          <Badge variant="secondary">
                            {t.type.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell style={{ fontWeight: 500 }}>{t.description}</TableCell>
                        <TableCell style={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--text-muted)' }}>{t.reference}</TableCell>
                        <TableCell style={{ fontWeight: 700, color: t.type === 'wallet_fund' || t.type === 'rewards_credit' ? 'var(--color-success)' : 'var(--text-primary)' }}>
                          ${t.amountUsd.toFixed(2)}
                        </TableCell>
                        <TableCell style={{ color: 'var(--text-secondary)' }}>{t.amountNgn === null ? '—' : `₦${t.amountNgn.toLocaleString()}`}</TableCell>
                        <TableCell style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{t.createdAt}</TableCell>
                        <TableCell>
                          <Badge variant={t.status === 'completed' ? 'secondary' : 'outline'}>
                            {t.status}
                          </Badge>
                          {t.type === 'wallet_fund' && t.status === 'pending' && t.reference && <Button type="button" variant="outline" size="sm" disabled={fundingCheck.phase === 'checking'&&fundingCheck.reference===t.reference} onClick={() => selectFundingReference(t.reference!)}>Check payment</Button>}{t.type==='wallet_fund'&&t.status==='pending'&&t.fundingRequestId&&<Button type="button" variant="outline" size="sm" disabled={requestRecovery.phase==='loading'&&requestRecovery.id===t.fundingRequestId} onClick={()=>void recoverRequest(t.fundingRequestId!,t.reference||undefined)}>Find checkout</Button>}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
              </Table>
            </Card>
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
          <div ref={fundDialog} role="dialog" aria-modal="true" aria-label="Deposit to CrimFig Wallet" tabIndex={-1} className="theme-card" style={{ width: '100%', maxWidth: '480px', padding: '24px', backgroundColor: 'var(--bg-page)', position: 'relative', boxSizing: 'border-box', maxHeight: 'calc(100dvh - 32px)', overflowY: 'auto' }}>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Close Deposit to CrimFig Wallet"
              onClick={closeDeposit}
              style={{ position: 'absolute', top: '16px', right: '16px' }}
            >
              <X style={{ width: 20, height: 20 }} />
            </Button>

            <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>Deposit to CrimFig Wallet</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Choose an amount and continue to secure Paystack checkout. Your wallet updates after payment is verified.
            </p>

            {paymentError && (
              <Alert variant="destructive" style={{ alignItems: 'center', flexDirection: 'column', textAlign: 'center' }}>
                <AlertCircle style={{ width: 32, height: 32 }} />
                <AlertDescription>{paymentError}</AlertDescription>
                {fundAttemptUncertain&&fundingIntent.current&&<p>Retry keeps the original ${fundingIntent.current.amountUsd.toFixed(2)} request.</p>}
                {fundAttemptUncertain&&<><Button type="button" variant="outline" disabled={isProcessingPayment} onClick={()=>void handleFundSubmit(true)}>Retry same request</Button><Button type="button" variant="outline" disabled={isProcessingPayment} onClick={openDeposit}>Start a separate deposit</Button></>}
              </Alert>
            )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label htmlFor="billing-fund-amount" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>Deposit Amount (USD)</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: 'var(--text-muted)' }}>$</span>
                    <Input id="billing-fund-amount"
                      disabled={isProcessingPayment||fundAttemptUncertain}
                      type="number"
                      min={1}
                      step={0.01}
                      value={fundAmountUsd}
                      onChange={(e) => setFundAmountUsd(Number(e.target.value))}
                      style={{ paddingLeft: '28px', fontSize: '16px', fontWeight: 700 }}
                    />
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--color-crimson)', fontWeight: 600, marginTop: '4px' }}>
                    ≈ ₦{(fundAmountUsd * balance.rate).toLocaleString()} NGN (at ₦{balance.rate}/$)
                  </div>
                </div>

                <details><summary>Payment options</summary>
                  <label htmlFor="billing-fund-method" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>Payment Method</label>
                  <select id="billing-fund-method" className="cf-input" disabled={isProcessingPayment||fundAttemptUncertain}
                    value={selectedCardId}
                    onChange={(e) => setSelectedCardId(e.target.value)}
                  >
                    <option value="new">Paystack / Card Gateway (Visa, Mastercard, Verve)</option>
                    {cards.map(c => (
                      <option key={c.id} value={c.id} disabled>Saved {c.cardBrand} ending in •••• {c.last4}</option>
                    ))}
                  </select>
                </details>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    id="save_card"
                    disabled={isProcessingPayment||fundAttemptUncertain}
                    checked={saveCardPref}
                    onChange={(e) => setSaveCardPref(e.target.checked)}
                    style={{ cursor: 'pointer' }}
                  />
                  <label htmlFor="save_card" style={{ fontSize: '12px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                    Save this card with Paystack for eligible future payments
                  </label>
                </div>

                <Button
                  type="button"
                  disabled={isProcessingPayment || fundAttemptUncertain || walletStatus !== 'ready' || !Number.isFinite(fundAmountUsd) || fundAmountUsd < 1}
                  loading={isProcessingPayment}
                  onClick={() => void handleFundSubmit()}
                  style={{ marginTop: '8px' }}
                >
                  {isProcessingPayment && <Loader2 style={{ width: 16, height: 16, animation: 'spin 0.75s linear infinite' }} />}
                  {isProcessingPayment ? 'Processing...' : `Pay $${fundAmountUsd.toFixed(2)} USD`}
                </Button>
              </div>
          </div>
        </div>
      )}

      {/* MODAL: WITHDRAW TO BANK */}
      {isWithdrawOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)' }}>
          <div ref={withdrawDialog} role="dialog" aria-modal="true" aria-label="Withdraw to Bank Account" tabIndex={-1} className="theme-card" style={{ width: '100%', maxWidth: '480px', padding: '32px', backgroundColor: 'var(--bg-page)', position: 'relative', boxSizing: 'border-box', maxHeight: 'calc(100dvh - 32px)', overflowY: 'auto' }}>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Close Withdraw to Bank Account"
              onClick={() => setIsWithdrawOpen(false)}
              style={{ position: 'absolute', top: '16px', right: '16px' }}
            >
              <X style={{ width: 20, height: 20 }} />
            </Button>

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
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Close Connect Bank Account"
              onClick={() => setIsAddBankOpen(false)}
              style={{ position: 'absolute', top: '16px', right: '16px' }}
            >
              <X style={{ width: 20, height: 20 }} />
            </Button>

            <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>Connect Bank Account</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Verify the account holder before saving this bank account.
            </p>

            <form onSubmit={handleAddBank} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label htmlFor="billing-bank-code" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>Select Bank</label>
                <select id="billing-bank-code" className="cf-input"
                  value={newBankCode}
                  disabled={bankDirectoryStatus !== 'ready'}
                  onChange={(e) => { setNewBankCode(e.target.value); setResolvedAccountName(null); }}
                >
                  <option value="">{bankDirectoryStatus === 'loading' ? 'Loading banks…' : 'Choose a supported bank'}</option>
                  {supportedBanks.map(bank => <option key={bank.code} value={bank.code}>{bank.name}</option>)}
                </select>
                {bankDirectoryStatus === 'unavailable' && (
                  <div role="alert">
                    <p>Bank directory is temporarily unavailable.</p>
                    <Button type="button" variant="outline" onClick={() => void loadBankDirectory()}>Retry bank list</Button>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="billing-bank-number" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>10-Digit Account Number</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Input id="billing-bank-number"
                    type="text"
                    maxLength={10}
                    value={newAccountNumber}
                    onChange={(e) => { setNewAccountNumber(e.target.value); setResolvedAccountName(null); }}
                    placeholder="0123456789"
                    style={{ flex: 1, fontFamily: 'monospace' }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleResolveBank}
                    disabled={newAccountNumber.length < 10 || isResolving}
                    loading={isResolving}
                  >
                    {isResolving ? 'Verifying...' : 'Verify'}
                  </Button>
                </div>
              </div>

              {resolvedAccountName && (
                <Alert variant="success">
                  <CheckCircle2 style={{ width: 16, height: 16 }} />
                  <AlertDescription>{resolvedAccountName}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                disabled={!resolvedAccountName || savingBank || !resolvedIdentity}
                loading={savingBank}
                style={{ marginTop: '8px' }}
              >
                Save Bank Account
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
