import { apiData, arrayData } from './api-data';
import type { WalletBalance, EscrowAllocation, SettlementBatch } from '../types/billing';

// Static options for the unused legacy withdrawal modal; not a verified bank/account response.
export const BANK_OPTIONS = [
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

export async function fetchBillingOverview(): Promise<{ wallet: WalletBalance; escrows: EscrowAllocation[] }> {
  const data = await apiData<any>('/api/v1/ads/billing/overview');
  const wallet = data?.wallet;
  if (![wallet?.availableUsdCents, wallet?.lockedUsdCents, wallet?.totalUsdCents].every(value => Number.isSafeInteger(value) && value >= 0) ||
      wallet.totalUsdCents !== wallet.availableUsdCents + wallet.lockedUsdCents || !Number.isFinite(wallet.exchangeRate) || wallet.exchangeRate <= 0 ||
      !Number.isFinite(wallet.estimatedNgn)) throw new Error('Invalid wallet response.');
  const escrows = arrayData<any>(data?.campaignEscrows?.items).map(item => ({
    ...item,
    burnPercent: item.allocatedUsd > 0 ? item.consumedUsd / item.allocatedUsd * 100 : 0,
  }));
  return { wallet: { ...wallet, availableUsd: wallet.availableUsdCents / 100, lockedUsd: wallet.lockedUsdCents / 100, totalUsd: wallet.totalUsdCents / 100 }, escrows };
}
export async function fetchSettlementBatches(): Promise<SettlementBatch[]> {
  const data = await apiData<any>('/api/v1/ads/billing/settlements');
  return arrayData(data?.batches);
}
export async function triggerManualSettlement(): Promise<unknown> {
  return apiData('/api/v1/ads/billing/settlements/trigger', { method: 'POST' });
}
