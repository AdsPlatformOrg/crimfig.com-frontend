import { billingData } from './billing-api';
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export interface SubscriptionPayment {
  requestId: string; reference: string; status: 'pending' | 'completed'; subscriptionId: string | null;
  amountUsdCents: number; amountNgnKobo: number; checkoutUrl: string | null;
}
export function subscriptionRequest(search: string) {
  const values = new URLSearchParams(search).getAll('subscription_request');
  if (!values.length) return null;
  if (values.length !== 1 || !uuid.test(values[0])) throw new Error('Invalid subscription recovery link.');
  return values[0].toLowerCase();
}
export function validateSubscriptionPayment(data: SubscriptionPayment, requestId: string) {
  if (!data || data.requestId !== requestId.toLowerCase() || !/^cf-sub-[a-f0-9]{64}$/.test(data.reference) ||
    !['pending', 'completed'].includes(data.status) ||
    [data.amountUsdCents, data.amountNgnKobo].some(value => !Number.isSafeInteger(value) || value <= 0 || value > 2147483647) ||
    (data.status === 'completed' && (typeof data.subscriptionId !== 'string' || !uuid.test(data.subscriptionId) || data.checkoutUrl !== null)) ||
    (data.status === 'pending' && data.subscriptionId !== null)) throw new Error('Subscription confirmation could not be validated.');
  if (data.checkoutUrl !== null) {
    const url = new URL(data.checkoutUrl);
    if (url.origin !== 'https://checkout.paystack.com' || url.username || url.password || url.hash) throw new Error('Invalid subscription checkout destination.');
  }
  return data;
}
export async function startSubscription(input: { requestId: string; appSlug: string; planId: string; interval: 'monthly' | 'annual' }, expectedUsdCents: number) {
  if (!uuid.test(input.requestId)) throw new Error('A secure subscription request ID is required.');
  const data = validateSubscriptionPayment(await billingData('/api/v1/subscriptions/subscribe', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input),
  }), input.requestId);
  if (data.amountUsdCents !== expectedUsdCents) throw new Error('Subscription price changed. Recover this payment before continuing.');
  return data;
}
export async function recoverSubscription(requestId: string) {
  if (!uuid.test(requestId)) throw new Error('Invalid subscription request ID.');
  return validateSubscriptionPayment(await billingData(`/api/v1/subscriptions/requests/${encodeURIComponent(requestId)}`), requestId);
}

export interface RenewalPreferences {
  subscriptionId: string; appSlug: string; interval: 'monthly' | 'annual'; amountUsdCents: number;
  currentPeriodEnd: string; entitled: boolean; autoRenew: boolean; savedCardId: string | null;
  maxNgnKobo: number | null; renewalProcessingAvailable: boolean;
}
export async function renewalPreferences(id: string): Promise<RenewalPreferences> {
  if (!uuid.test(id)) throw new Error('Invalid subscription.');
  const data = await billingData(`/api/v1/subscriptions/${id}/preferences`);
  if (data?.subscriptionId !== id || !['monthly', 'annual'].includes(data.interval) ||
    !Number.isSafeInteger(data.amountUsdCents) || data.amountUsdCents <= 0 || !Number.isFinite(Date.parse(data.currentPeriodEnd)) ||
    ['entitled', 'autoRenew', 'renewalProcessingAvailable'].some(key => typeof data[key] !== 'boolean') ||
    (data.maxNgnKobo !== null && (!Number.isSafeInteger(data.maxNgnKobo) || data.maxNgnKobo <= 0)) ||
    (data.savedCardId !== null && !uuid.test(data.savedCardId))) throw new Error('Renewal settings could not be verified.');
  return data;
}
export function renewalLimitKobo(value: string): number {
  if (!/^\d+(\.\d{1,2})?$/.test(value.trim())) throw new Error('Enter a positive NGN limit with up to two decimal places.');
  const [whole, fraction = ''] = value.trim().split('.');
  const kobo = Number(whole) * 100 + Number(fraction.padEnd(2, '0'));
  if (!Number.isSafeInteger(kobo) || kobo < 1 || kobo > 2147483647) throw new Error('Renewal limit is outside the supported range.');
  return kobo;
}
export async function setRenewalConsent(id: string, input: { requestId: string; savedCardId: string; maxNgnKobo: number; expectedPeriodEnd: string }) {
  if (![id, input.requestId, input.savedCardId].every(value => uuid.test(value)) || !Number.isSafeInteger(input.maxNgnKobo) || input.maxNgnKobo <= 0) throw new Error('Invalid renewal consent.');
  const data = await billingData(`/api/v1/subscriptions/${id}/renewal-consent`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input),
  });
  if (data?.subscriptionId !== id || typeof data.autoRenew !== 'boolean') throw new Error('Renewal consent is unconfirmed.');
  return data;
}
export async function stopRenewal(id: string) {
  if (!uuid.test(id)) throw new Error('Invalid subscription.');
  const data = await billingData(`/api/v1/subscriptions/${id}`, { method: 'DELETE' });
  if (data?.cancelAtPeriodEnd !== true || data?.subscription?.id !== id) throw new Error('Cancellation is unconfirmed.');
  return data;
}
