import { billingData, checkoutUrl } from './billing-api';
import { sessionFetch } from './session';

export function validFundingReference(value: unknown): value is string {
  return typeof value === 'string' && /^[a-zA-Z0-9._=-]{1,200}$/.test(value);
}
export function fundingReturn(search: string): { kind: 'none' | 'invalid'; reference?: never } | { kind: 'valid'; reference: string } {
  const query = new URLSearchParams(search);
  const references = [...query.getAll('reference'), ...query.getAll('trxref')];
  if (!references.length) return { kind: 'none' };
  if (!references.every(validFundingReference) || new Set(references).size !== 1) return { kind: 'invalid' };
  return { kind: 'valid', reference: references[0] };
}
export async function verifyFundingReference(reference: string): Promise<{ status: 'pending' | 'confirmed'; reference: string }> {
  if (!validFundingReference(reference)) throw new Error('The payment reference is invalid.');
  const data = await billingData(`/api/v1/wallet/verify/${encodeURIComponent(reference)}`);
  if (data?.status === 'pending' && data.reference === reference && typeof data.transactionId === 'string' && data.transactionId) {
    return { status: 'pending', reference };
  }
  const tx = data?.transaction;
  if (['completed', 'already_completed'].includes(data?.status) && tx?.status === 'completed' &&
      tx.type === 'wallet_fund' && tx.provider === 'paystack' && tx.reference === reference &&
      typeof tx.id === 'string' && tx.id && Number.isSafeInteger(tx.amountUsdCents) && tx.amountUsdCents > 0) {
    return { status: 'confirmed', reference };
  }
  throw new Error('Payment confirmation could not be validated. Check its status again before starting another payment.');
}
export function validFundingRequestId(value: unknown): value is string {
  return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}
export function fundingRequest(search: string): { kind: 'none' | 'invalid'; requestId?: never } | { kind: 'valid'; requestId: string } {
  const values = new URLSearchParams(search).getAll('funding_request');
  if (!values.length) return { kind: 'none' };
  if (!values.every(validFundingRequestId) || new Set(values.map(value => value.toLowerCase())).size !== 1) return { kind: 'invalid' };
  return { kind: 'valid', requestId: values[0].toLowerCase() };
}
type FundingAttempt = { kind: 'checkout' | 'pending' | 'completed'; requestId: string; reference: string; amountUsd: number; url?: string };
function fundingAttempt(data: any, requestId: string): FundingAttempt {
  if (data?.requestId !== requestId.toLowerCase() || !validFundingReference(data.reference) ||
      !['pending', 'completed'].includes(data.status) || typeof data.transactionId !== 'string' || !data.transactionId ||
      !Number.isFinite(data.amountUsd) || data.amountUsd < 1 || data.amountUsd * 100 > 2147483647 || Math.abs(data.amountUsd * 100 - Math.round(data.amountUsd * 100)) > 0.000001 ||
      typeof data.checkoutReady !== 'boolean' || (data.status === 'completed' && data.checkoutReady)) throw new Error('Funding request recovery could not be validated.');
  if (data.checkoutReady) return { kind: 'checkout', requestId, reference: data.reference, amountUsd: data.amountUsd, url: checkoutUrl(data.authorizationUrl) };
  return { kind: data.status === 'completed' ? 'completed' : 'pending', requestId, reference: data.reference, amountUsd: data.amountUsd };
}
export async function recoverFundingRequest(requestId: string): Promise<FundingAttempt | { kind: 'missing'; requestId: string }> {
  if (!validFundingRequestId(requestId)) throw new Error('Invalid funding request ID.');
  const response = await sessionFetch(`/api/v1/wallet/funding-requests/${encodeURIComponent(requestId)}`);
  if (response.status === 404) return { kind: 'missing', requestId };
  if (!response.ok) throw new Error('Funding request recovery is unavailable. Do not start another payment.');
  const body = await response.json();
  if (body?.status !== 'success') throw new Error('Funding request recovery could not be validated.');
  return fundingAttempt(body.data, requestId);
}
export class FundingStartError extends Error {
  constructor(message: string, readonly uncertain: boolean, readonly reference?: string) { super(message); }
}
export async function startFunding(amountUsd: number, saveCard: boolean, requestId: string) {
  if (!validFundingRequestId(requestId)) throw new FundingStartError('A valid funding request ID is required.', false);
  const cents = Math.round(amountUsd * 100);
  if (!Number.isFinite(amountUsd) || cents < 100 || cents > 2147483647 || Math.abs(amountUsd * 100 - cents) > 0.000001) {
    throw new FundingStartError('Enter at least $1.00 using whole cents.', false);
  }
  let res: Response;
  try {
    res = await sessionFetch('/api/v1/wallet/fund', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ amountUsd, saveCard, requestId }) });
  } catch { throw new FundingStartError('Payment initialization could not be confirmed. Review pending transactions before starting another payment.', true); }
  let json: any;
  try { json = await res.json(); } catch { throw new FundingStartError('Payment initialization could not be confirmed. Review pending transactions.', true); }
  if (!res.ok) {
    throw new FundingStartError('Payment initialization could not be confirmed. Check the payment status before trying again.',
      ![400, 401, 403].includes(res.status), validFundingReference(json?.reference) ? json.reference : undefined);
  }
  try {
    if (json?.status !== 'success') throw new Error('Invalid acknowledgement');
    const attempt = fundingAttempt(json.data, requestId);
    if (attempt.amountUsd !== cents / 100) throw new Error('Funding amount mismatch');
    return attempt;
  } catch { throw new FundingStartError('Checkout could not be confirmed. Recover this funding request before retrying.', true,
    validFundingReference(json?.data?.reference) ? json.data.reference : undefined); }
}

export async function loadTransactions() {
  const data = await billingData('/api/v1/transactions');
  if (!Array.isArray(data?.items) || !Number.isSafeInteger(data.total) || data.total < data.items.length) throw new Error('Transaction history is unavailable.');
  return data.items.map((row: any) => {
    if (typeof row?.id !== 'string' || !row.id || typeof row.type !== 'string' || typeof row.status !== 'string' ||
        !Number.isSafeInteger(row.amountUsdCents) || row.amountUsdCents < 0 ||
        (row.amountNgnKobo !== null && (!Number.isSafeInteger(row.amountNgnKobo) || row.amountNgnKobo < 0)) ||
        !Number.isFinite(new Date(row.createdAt).getTime()) || typeof row.description !== 'string' ||
        (row.reference !== null && typeof row.reference !== 'string')) throw new Error('Transaction history returned an invalid entry.');
    return { id: row.id, type: row.type, status: row.status, description: row.description,
      reference: row.reference, amountUsd: row.amountUsdCents / 100,
      amountNgn: row.amountNgnKobo === null ? null : row.amountNgnKobo / 100,
      createdAt: new Date(row.createdAt).toLocaleString() };
  });
}
