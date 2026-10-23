import { apiData, arrayData, jsonBody } from './api-data';
import type { AdsConversionItem, AdvertiserApiKeyItem } from '../types/conversions';

export async function fetchConversions(campaignId?: string): Promise<AdsConversionItem[]> {
  const rows = arrayData<any>(await apiData(`/api/v1/conversions${campaignId ? `?campaignId=${encodeURIComponent(campaignId)}` : ''}`));
  const amount = (value: unknown) => {
    if (value == null) return null;
    if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < 0) throw new Error('Invalid conversion amount.');
    return value / 1_000_000;
  };
  return rows.map(c => {
    if (typeof c?.id !== 'string') throw new Error('Invalid conversion response.');
    // Historical non-USD rows may contain an unproven 1:1 USD value; do not display it as dollars.
    const usd = c.currency == null || c.currency.toUpperCase() === 'USD';
    return { ...c, valueUsd: usd ? amount(c.valueUsdMicros) : null, chargedUsd: amount(c.chargedMicros) };
  });
}
export async function fetchApiKeys(): Promise<AdvertiserApiKeyItem[]> {
  return arrayData(await apiData('/api/v1/advertisers/api-keys'));
}
export async function createApiKey(name: string, scopes = 'conversions:write'): Promise<AdvertiserApiKeyItem> {
  const data = await apiData<any>('/api/v1/advertisers/api-keys', jsonBody({ name, scopes }));
  if (typeof data?.id !== 'string' || typeof data?.key !== 'string' || !data.key) throw new Error('The service did not return the new API key.');
  return { ...data, rawSecretKey: data.key };
}
export async function revokeApiKey(id: string): Promise<boolean> {
  await apiData(`/api/v1/advertisers/api-keys/${encodeURIComponent(id)}`, { method: 'DELETE' });
  return true;
}
export async function reverseConversion(id: string, reason: string): Promise<boolean> {
  await apiData(`/api/v1/conversions/${encodeURIComponent(id)}/reverse`, jsonBody({ reason }));
  return true;
}
