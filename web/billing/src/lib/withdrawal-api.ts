import { billingData } from './billing-api';

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export interface WithdrawalQuote {
  quoteId: string; requestId: string; reference: string; bankAccountId: string;
  amountUsdCents: number; grossKobo: number; netKobo: number;
  transferFeeKobo: number; stampDutyKobo: number; totalFeeKobo: number;
  rate: number; expiresAt: string;
}
export interface WithdrawalStatus { reference: string; status: string; confirmation?: string }
export function withdrawalRequest(search: string): string | null {
  const values = new URLSearchParams(search).getAll('withdrawal_request');
  if (!values.length) return null;
  if (values.length !== 1 || !uuid.test(values[0])) throw new Error('Invalid withdrawal recovery link.');
  return values[0];
}
export function validateWithdrawalQuote(data: WithdrawalQuote, input: { requestId: string; bankAccountId: string; amountUsd: number }) {
  const money = [data?.amountUsdCents, data?.grossKobo, data?.netKobo, data?.transferFeeKobo, data?.stampDutyKobo, data?.totalFeeKobo];
  if (!data || !uuid.test(data.quoteId) || data.requestId !== input.requestId || data.bankAccountId !== input.bankAccountId ||
      !/^wd_[a-f0-9]{40}$/.test(data.reference) || money.some(n => !Number.isSafeInteger(n) || n < 0 || n > 2147483647) ||
      data.amountUsdCents !== Math.round(input.amountUsd * 100) || data.netKobo <= 0 ||
      data.grossKobo !== data.netKobo + data.totalFeeKobo || data.totalFeeKobo !== data.transferFeeKobo + data.stampDutyKobo ||
      !Number.isFinite(data.rate) || data.rate <= 0 || !Number.isFinite(Date.parse(data.expiresAt)) || Date.parse(data.expiresAt) <= Date.now()) {
    throw new Error('A current, matching payout quote could not be confirmed.');
  }
  return data;
}
const post = (body: unknown): RequestInit => ({ method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
export async function quoteWithdrawal(input: { requestId: string; bankAccountId: string; amountUsd: number }) {
  return validateWithdrawalQuote(await billingData('/api/v1/withdrawals/quote', post(input)), input);
}
function status(data: WithdrawalStatus, reference?: string) {
  if (!data || !/^wd_[a-f0-9]{40}$/.test(data.reference) || (reference && data.reference !== reference) ||
      !['pending', 'processing', 'completed', 'failed', 'reversed', 'cancelled'].includes(data.status)) throw new Error('Withdrawal status could not be confirmed.');
  return data;
}
export async function confirmWithdrawal(quote: WithdrawalQuote) {
  validateWithdrawalQuote(quote, { requestId: quote.requestId, bankAccountId: quote.bankAccountId, amountUsd: quote.amountUsdCents / 100 });
  return status(await billingData('/api/v1/withdrawals', post({ requestId: quote.requestId, quoteId: quote.quoteId,
    bankAccountId: quote.bankAccountId, amountUsd: quote.amountUsdCents / 100 })), quote.reference);
}
export async function recoverWithdrawal(requestId: string) {
  if (!uuid.test(requestId)) throw new Error('Invalid withdrawal request.');
  return status(await billingData(`/api/v1/withdrawals/requests/${requestId}`));
}
