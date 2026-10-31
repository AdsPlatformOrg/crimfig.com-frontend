import { billingData } from './billing-api';

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export interface WithdrawalQuote {
  quoteId: string; requestId: string; reference: string; bankAccountId: string;
  amountUsdCents: number; grossKobo: number; netKobo: number;
  transferFeeKobo: number; stampDutyKobo: number; totalFeeKobo: number;
  rate: number; expiresAt: string;
}
export interface WithdrawalStatus { reference: string; status: string; confirmation?: string; refund?: { grossUsdCents: number; refundUsdCents: number; retainedUsdCents: number; retainedKobo: number } }

export interface FinancialProof {
  version: 1;
  keyId: string;
  purpose: 'owner_authorization' | 'independent_review';
  audience: 'financial-executor';
  environment: 'test' | 'live';
  digest: string;
  actorId: string;
  personId: string;
  nonce: string;
  issuedAt: number;
  expiresAt: number;
  signature: string;
}

export interface FinancialChallengeResponse {
  challengeId: string;
  purpose: string;
  binding?: any;
  expiresAt: number | string;
  consumed?: boolean;
}
export async function withdrawalAvailability(): Promise<{ available: boolean; reason: string | null }> {
  const data = await billingData('/api/v1/withdrawals/availability');
  if (!data || typeof data.available !== 'boolean' || (data.reason !== null && !['security_setup','security_unavailable'].includes(data.reason))) throw new Error('Withdrawal availability could not be confirmed.');
  return data;
}
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
  if (data.refund && (!['failed', 'reversed'].includes(data.status) ||
      ![data.refund.grossUsdCents, data.refund.refundUsdCents, data.refund.retainedUsdCents, data.refund.retainedKobo].every(n => Number.isSafeInteger(n) && n >= 0 && n <= 2147483647) ||
      data.refund.refundUsdCents + data.refund.retainedUsdCents !== data.refund.grossUsdCents)) throw new Error('Refund breakdown could not be confirmed.');
  return data;
}
export async function prepareWithdrawalAuthorization(quote: WithdrawalQuote): Promise<{ reference: string; digest: string; state: string }> {
  validateWithdrawalQuote(quote, { requestId: quote.requestId, bankAccountId: quote.bankAccountId, amountUsd: quote.amountUsdCents / 100 });
  const data = await billingData('/api/v1/withdrawals/authorizations', post({
    requestId: quote.requestId, quoteId: quote.quoteId, bankAccountId: quote.bankAccountId, amountUsd: quote.amountUsdCents / 100,
  }));
  if (!data || typeof data.reference !== 'string' || !/^wd_[a-f0-9]{40}$/.test(data.reference) || typeof data.digest !== 'string') {
    throw new Error('Withdrawal authorization could not be prepared.');
  }
  return data;
}

export async function beginWithdrawalChallenge(reference: string): Promise<FinancialChallengeResponse> {
  if (!/^wd_[a-f0-9]{40}$/.test(reference)) throw new Error('Invalid withdrawal reference.');
  const data = await billingData<FinancialChallengeResponse>(`/api/v1/financial-authorizations/withdrawals/${encodeURIComponent(reference)}/challenges`, post({}));
  if (!data || !uuid.test(data.challengeId)) throw new Error('Financial authorization challenge could not be retrieved.');
  return data;
}

export async function confirmWithdrawalChallenge(challengeId: string, code: string): Promise<{ id: string; proof: FinancialProof }> {
  if (!uuid.test(challengeId)) throw new Error('Invalid challenge ID.');
  if (!/^\d{6}$/.test(code)) throw new Error('Enter a valid 6-digit authenticator code.');
  const data = await billingData<{ id: string; proof: FinancialProof }>(`/api/v1/financial-authorizations/challenges/${encodeURIComponent(challengeId)}/confirm`, post({ code }));
  if (!data || !data.proof || data.proof.version !== 1 || !data.proof.signature) throw new Error('Financial authorization proof could not be confirmed.');
  return data;
}

export async function submitReviewAuthorization(reference: string, proof: FinancialProof): Promise<{ reference: string; state: string }> {
  if (!/^wd_[a-f0-9]{40}$/.test(reference)) throw new Error('Invalid withdrawal reference.');
  if (!proof || proof.purpose !== 'independent_review' || !proof.signature) throw new Error('Valid reviewer proof required.');
  const data = await billingData<{ reference: string; state: string }>(`/api/v1/withdrawals/${encodeURIComponent(reference)}/reviews`, post({ proof }));
  if (!data || data.reference !== reference) throw new Error('Review could not be submitted.');
  return data;
}

export async function confirmWithdrawal(quote: WithdrawalQuote, ownerProof?: FinancialProof) {
  validateWithdrawalQuote(quote, { requestId: quote.requestId, bankAccountId: quote.bankAccountId, amountUsd: quote.amountUsdCents / 100 });
  const payload: Record<string, any> = {
    requestId: quote.requestId,
    quoteId: quote.quoteId,
    bankAccountId: quote.bankAccountId,
    amountUsd: quote.amountUsdCents / 100,
  };
  if (ownerProof) payload.ownerProof = ownerProof;
  return status(await billingData('/api/v1/withdrawals', post(payload)), quote.reference);
}
export async function recoverWithdrawal(requestId: string) {
  if (!uuid.test(requestId)) throw new Error('Invalid withdrawal request.');
  return status(await billingData(`/api/v1/withdrawals/requests/${requestId}`));
}
export async function cancelUndispatchedWithdrawal(reference: string) {
  if (!/^wd_[a-f0-9]{40}$/.test(reference)) throw new Error('Invalid withdrawal reference.');
  const data = await billingData(`/api/v1/withdrawals/${reference}/cancel`, post({}));
  if (!data || data.status !== 'cancelled' || data.reference !== reference || typeof data.withdrawalId !== 'string') throw new Error('Cancellation could not be confirmed. Check withdrawal status.');
  return { reference, status: 'cancelled', confirmation: 'confirmed' };
}
