import { sessionFetch } from './session';

export async function billingData<T = any>(path: string, init?: RequestInit): Promise<T> {
  const res = await sessionFetch(path, init);
  if (!res.ok) throw new Error('The billing request could not be confirmed. Check the result before retrying.');
  const body = await res.json();
  if (body?.status !== 'success' || !Object.prototype.hasOwnProperty.call(body, 'data')) throw new Error('Invalid billing response.');
  return body.data;
}
export async function resolveBank(accountNumber: string, bankCode: string) {
  if (!/^\d{10}$/.test(accountNumber) || !/^\d{3,9}$/.test(bankCode)) throw new Error('Choose a bank and enter a 10-digit account number.');
  const data = await billingData(`/api/v1/bank-accounts/resolve?${new URLSearchParams({ accountNumber, bankCode })}`);
  if (typeof data?.account_name !== 'string' || !data.account_name.trim() || (data.account_number && data.account_number !== accountNumber)) throw new Error('Account-holder verification could not be confirmed.');
  return { accountName: data.account_name, accountNumber, bankCode };
}
export async function saveBank(input: { accountNumber: string; bankCode: string; bankName: string }) {
  const data = await billingData('/api/v1/bank-accounts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input) });
  if (typeof data?.id !== 'string' || data.accountNumber !== input.accountNumber || data.bankCode !== input.bankCode || data.isVerified !== true) throw new Error('Bank account save could not be confirmed. Refresh your accounts before retrying.');
  return data;
}
export function checkoutUrl(value: unknown): string {
  if (typeof value !== 'string') throw new Error('Checkout URL unavailable.');
  const url = new URL(value);
  if (url.origin !== 'https://checkout.paystack.com' || url.username || url.password || url.hash) throw new Error('Unrecognized checkout destination.');
  return url.href;
}
