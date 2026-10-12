/**
 * Billing & Escrow Settlement Types
 * Adheres strictly to the CrimFig financial architecture and design system.
 */

export interface WalletBalance {
  availableUsdCents: number;
  availableUsd: number;
  lockedUsdCents: number;
  lockedUsd: number;
  totalUsdCents: number;
  totalUsd: number;
  exchangeRate: number;
  estimatedNgn: number;
}

export interface EscrowAllocation {
  id: string;
  campaignId: string;
  campaignTitle?: string;
  allocatedUsd: number;
  consumedUsd: number;
  remainingUsd: number;
  refundedUsd: number;
  burnPercent: number;
  status: 'active' | 'exhausted' | 'released';
  updatedAt: string;
}

export interface BillingTransaction {
  id: string;
  type:
    | 'wallet_fund'
    | 'wallet_withdraw'
    | 'ads_spend'
    | 'ads_earning'
    | 'rewards_credit'
    | 'subscription_charge'
    | 'reversal';
  status: 'pending' | 'completed' | 'failed' | 'reversed';
  amountUsd: number;
  grossAmountUsd?: number;
  feeAmountUsd?: number;
  netAmountUsd?: number;
  amountNgn?: number;
  exchangeRate?: number;
  balanceBeforeUsd?: number;
  balanceAfterUsd?: number;
  description: string;
  reference: string;
  createdAt: string;
}

export interface BankAccount {
  id: string;
  bankName: string;
  bankCode: string;
  accountNumber: string;
  accountName: string;
  isVerified: boolean;
}

export interface SettlementBatch {
  id: string;
  batchNumber: string;
  periodStart: string;
  periodEnd: string;
  totalImpressions: number;
  totalClicks: number;
  totalHovers: number;
  totalTouches: number;
  totalDebitedUsd: number;
  totalCreditedUsd: number;
  totalCommissionPaidUsd: number;
  publisherPoolRatio: string;
  crimfigBaseRevenueRatio: string;
  commissionPoolRatio: string;
  status: 'processing' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
}

export interface PromoterSettlementItem {
  id: string;
  batchId: string;
  promoterId: string;
  campaignId: string;
  impressionsCount: number;
  clicksCount: number;
  hoversCount: number;
  touchesCount: number;
  earnedUsd: number;
  billedUsd: number;
  tierSnapshot: string;
  status: string;
  createdAt: string;
}
