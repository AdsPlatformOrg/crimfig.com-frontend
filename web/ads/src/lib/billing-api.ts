/**
 * Frontend Billing API Client
 * Interfaces with ads-api (/api/v1/ads/billing/*) and billing-api (/api/v1/billing/*)
 */

import type {
  WalletBalance,
  EscrowAllocation,
  BillingTransaction,
  BankAccount,
  SettlementBatch,
} from '../types/billing';

const ADS_API_URL = process.env.NEXT_PUBLIC_ADS_API_URL || 'http://localhost:3004';
const BILLING_API_URL = process.env.NEXT_PUBLIC_BILLING_API_URL || 'http://localhost:3003';

// Sample fallback transactions for immediate rich console display
export const MOCK_TRANSACTIONS: BillingTransaction[] = [
  {
    id: 'tx_001',
    type: 'wallet_fund',
    status: 'completed',
    amountUsd: 500.0,
    grossAmountUsd: 500.0,
    feeAmountUsd: 0.0,
    netAmountUsd: 500.0,
    amountNgn: 812750.0,
    exchangeRate: 1625.5,
    balanceBeforeUsd: 0.0,
    balanceAfterUsd: 500.0,
    description: 'Paystack Card Funding (•••• 4242)',
    reference: 'pstk_fund_982401',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
  {
    id: 'tx_002',
    type: 'ads_spend',
    status: 'completed',
    amountUsd: 48.2,
    grossAmountUsd: 48.2,
    feeAmountUsd: 0.0,
    netAmountUsd: 48.2,
    balanceBeforeUsd: 500.0,
    balanceAfterUsd: 451.8,
    description: 'Campaign Escrow Burn (Batch SB-20261010)',
    reference: 'escrow_burn_001',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'tx_003',
    type: 'ads_earning',
    status: 'completed',
    amountUsd: 26.51, // 55% share
    grossAmountUsd: 48.2,
    netAmountUsd: 26.51,
    balanceBeforeUsd: 112.4,
    balanceAfterUsd: 138.91,
    description: 'Publisher Ad Share Credit (Batch SB-20261010)',
    reference: 'pub_credit_881',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'tx_004',
    type: 'wallet_withdraw',
    status: 'completed',
    amountUsd: 50.0,
    grossAmountUsd: 50.0,
    feeAmountUsd: 0.0,
    netAmountUsd: 50.0,
    amountNgn: 81275.0,
    exchangeRate: 1625.5,
    balanceBeforeUsd: 138.91,
    balanceAfterUsd: 88.91,
    description: 'Bank Payout to GTBank (•••• 5821)',
    reference: 'pstk_trf_77192',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
];

export const MOCK_BANKS = [
  { code: '058', name: 'Guaranty Trust Bank (GTBank)' },
  { code: '044', name: 'Access Bank' },
  { code: '057', name: 'Zenith Bank' },
  { code: '033', name: 'United Bank for Africa (UBA)' },
  { code: '011', name: 'First Bank of Nigeria' },
  { code: '035', name: 'Wema Bank' },
  { code: '50211', name: 'Kuda Bank' },
  { code: '999992', name: 'OPay Digital Services' },
  { code: '999991', name: 'PalmPay' },
];

export const MOCK_SAVED_BANK_ACCOUNTS: BankAccount[] = [
  {
    id: 'ba_001',
    bankName: 'Guaranty Trust Bank',
    bankCode: '058',
    accountNumber: '0234567891',
    accountName: 'JEDIDIAH E. ARCHIBONG',
    isVerified: true,
  },
];

export const MOCK_SETTLEMENT_BATCHES: SettlementBatch[] = [
  {
    id: 'sb_001',
    batchNumber: 'SB-20261010183000',
    periodStart: new Date(Date.now() - 3600000 * 2).toISOString(),
    periodEnd: new Date(Date.now() - 3600000 * 1.5).toISOString(),
    totalImpressions: 48900,
    totalClicks: 1820,
    totalHovers: 3950,
    totalTouches: 1680,
    totalDebitedUsd: 124.5,
    totalCreditedUsd: 68.48, // 55%
    totalCommissionPaidUsd: 12.45, // 10%
    publisherPoolRatio: '0.5500',
    crimfigBaseRevenueRatio: '0.3000',
    commissionPoolRatio: '0.1500',
    status: 'completed',
    createdAt: new Date(Date.now() - 3600000 * 1.5).toISOString(),
    completedAt: new Date(Date.now() - 3600000 * 1.5 + 4000).toISOString(),
  },
  {
    id: 'sb_002',
    batchNumber: 'SB-20261010190000',
    periodStart: new Date(Date.now() - 3600000 * 1.5).toISOString(),
    periodEnd: new Date(Date.now() - 3600000).toISOString(),
    totalImpressions: 59200,
    totalClicks: 2140,
    totalHovers: 4810,
    totalTouches: 2010,
    totalDebitedUsd: 156.8,
    totalCreditedUsd: 86.24, // 55%
    totalCommissionPaidUsd: 15.68, // 10%
    publisherPoolRatio: '0.5500',
    crimfigBaseRevenueRatio: '0.3000',
    commissionPoolRatio: '0.1500',
    status: 'completed',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    completedAt: new Date(Date.now() - 3600000 + 3500).toISOString(),
  },
];

/**
 * Fetch unified billing overview
 */
export async function fetchBillingOverview(userId = 'demo-user-id'): Promise<{
  wallet: WalletBalance;
  escrows: EscrowAllocation[];
}> {
  try {
    const res = await fetch(`${ADS_API_URL}/api/v1/ads/billing/overview`, {
      headers: { 'x-user-id': userId },
    });
    if (res.ok) {
      const json = await res.json();
      return {
        wallet: json.data.wallet,
        escrows: json.data.campaignEscrows?.items || [],
      };
    }
  } catch (err) {
    // console.warn('Using fallback billing overview', err);
  }

  return {
    wallet: {
      availableUsdCents: 45180,
      availableUsd: 451.8,
      lockedUsdCents: 20000,
      lockedUsd: 200.0,
      totalUsdCents: 65180,
      totalUsd: 651.8,
      exchangeRate: 1625.5,
      estimatedNgn: 734401.0,
    },
    escrows: [
      {
        id: 'escrow_001',
        campaignId: 'camp_001',
        campaignTitle: 'CrimFig Cloud Infrastructure Launch',
        allocatedUsd: 500.0,
        consumedUsd: 218.4,
        remainingUsd: 281.6,
        refundedUsd: 0.0,
        burnPercent: 43.7,
        status: 'active',
        updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
      {
        id: 'escrow_002',
        campaignId: 'camp_002',
        campaignTitle: 'Pan-African Tech Summit 2026',
        allocatedUsd: 350.0,
        consumedUsd: 142.1,
        remainingUsd: 207.9,
        refundedUsd: 0.0,
        burnPercent: 40.6,
        status: 'active',
        updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      },
    ],
  };
}

/**
 * Fetch historical settlement batches
 */
export async function fetchSettlementBatches(): Promise<SettlementBatch[]> {
  try {
    const res = await fetch(`${ADS_API_URL}/api/v1/ads/billing/settlements`);
    if (res.ok) {
      const json = await res.json();
      if (json.data?.batches?.length) return json.data.batches;
    }
  } catch (err) {
    // console.warn('Using fallback batches', err);
  }
  return MOCK_SETTLEMENT_BATCHES;
}

/**
 * Trigger manual settlement batch reconciliation
 */
export async function triggerManualSettlement(): Promise<any> {
  const res = await fetch(`${ADS_API_URL}/api/v1/ads/billing/settlements/trigger`, {
    method: 'POST',
  });
  if (res.ok) {
    const json = await res.json();
    return json.data;
  }
  throw new Error('Settlement trigger failed');
}
