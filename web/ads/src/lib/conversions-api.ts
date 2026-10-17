import { AdsConversionItem, AdvertiserApiKeyItem } from '../types/conversions';

const API_BASE = process.env.NEXT_PUBLIC_ADS_API_URL || 'https://ads-api-production-d889.up.railway.app';

export async function fetchConversions(campaignId?: string): Promise<AdsConversionItem[]> {
  try {
    const url = new URL(`${API_BASE}/api/v1/conversions`);
    if (campaignId) url.searchParams.set('campaignId', campaignId);

    const res = await fetch(url.toString(), {
      headers: { 'x-user-id': 'demo-advertiser' },
    });
    if (res.ok) {
      const json = await res.json();
      if (json.data && Array.isArray(json.data)) {
        return json.data.map((c: any) => ({
          id: c.id,
          advertiserId: c.advertiserId,
          campaignId: c.campaignId,
          campaignTitle: c.campaignTitle || 'General Campaign',
          clickId: c.clickId,
          event: c.event,
          orderId: c.orderId,
          valueMicros: c.valueMicros,
          currency: c.currency || 'USD',
          valueUsd: c.valueUsdMicros ? c.valueUsdMicros / 1_000_000 : (c.valueMicros ? c.valueMicros / 100 : 0),
          source: c.source || 's2s',
          status: c.status || 'attributed',
          attributedPromoterId: c.attributedPromoterId,
          chargedUsd: c.chargedMicros ? c.chargedMicros / 1_000_000 : 0,
          holdbackReleaseAt: c.holdbackReleaseAt,
          settlementBatchId: c.settlementBatchId,
          metadata: typeof c.metadata === 'string' ? JSON.parse(c.metadata) : c.metadata,
          occurredAt: c.occurredAt,
          createdAt: c.createdAt,
        }));
      }
    }
  } catch (err) {
    console.error('Failed to fetch conversions from API:', err);
  }

  // Fallback demo data
  return [
    {
      id: 'conv_001',
      advertiserId: 'demo-advertiser',
      campaignId: 'camp_001',
      campaignTitle: 'CrimFig Cloud Infrastructure Launch',
      clickId: 'clk_20261017_9a8b7c6d5e4f3a2b',
      event: 'purchase',
      orderId: 'ORD-98421',
      valueMicros: 85000000,
      currency: 'USD',
      valueUsd: 85.0,
      source: 's2s',
      status: 'attributed',
      attributedPromoterId: 'prom_001',
      chargedUsd: 12.5,
      holdbackReleaseAt: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
      settlementBatchId: 'batch_20261017_1800',
      occurredAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    },
    {
      id: 'conv_002',
      advertiserId: 'demo-advertiser',
      campaignId: 'camp_001',
      campaignTitle: 'CrimFig Cloud Infrastructure Launch',
      clickId: 'clk_20261017_1122334455667788',
      event: 'sign_up',
      orderId: 'USR-30419',
      valueMicros: 0,
      currency: 'USD',
      valueUsd: 0,
      source: 'pixel',
      status: 'attributed',
      attributedPromoterId: 'prom_002',
      chargedUsd: 2.0,
      holdbackReleaseAt: new Date(Date.now() + 60 * 3600 * 1000).toISOString(),
      settlementBatchId: 'batch_20261017_1830',
      occurredAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    },
    {
      id: 'conv_003',
      advertiserId: 'demo-advertiser',
      campaignId: 'camp_002',
      campaignTitle: 'Pan-African Tech Summit 2026',
      clickId: 'clk_20261017_aabbccddeeff0011',
      event: 'lead',
      orderId: 'LEAD-55102',
      valueMicros: 0,
      currency: 'USD',
      valueUsd: 0,
      source: 's2s',
      status: 'attributed',
      attributedPromoterId: 'prom_001',
      chargedUsd: 5.0,
      holdbackReleaseAt: new Date(Date.now() - 10 * 3600 * 1000).toISOString(), // cleared
      settlementBatchId: 'batch_20261014_1200',
      occurredAt: new Date(Date.now() - 82 * 3600 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 82 * 3600 * 1000).toISOString(),
    },
    {
      id: 'conv_004',
      advertiserId: 'demo-advertiser',
      campaignId: 'camp_001',
      campaignTitle: 'CrimFig Cloud Infrastructure Launch',
      clickId: 'clk_20261017_9988776655443322',
      event: 'purchase',
      orderId: 'ORD-98421', // duplicate attempt
      valueMicros: 85000000,
      currency: 'USD',
      valueUsd: 85.0,
      source: 'pixel',
      status: 'duplicate',
      chargedUsd: 0,
      occurredAt: new Date(Date.now() - 23 * 3600 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 23 * 3600 * 1000).toISOString(),
    },
  ];
}

export async function fetchApiKeys(): Promise<AdvertiserApiKeyItem[]> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/advertisers/api-keys`, {
      headers: { 'x-user-id': 'demo-advertiser' },
    });
    if (res.ok) {
      const json = await res.json();
      if (json.data && Array.isArray(json.data)) {
        return json.data;
      }
    }
  } catch (err) {
    console.error('Failed to fetch API keys:', err);
  }

  // Fallback demo key
  return [
    {
      id: 'key_001',
      advertiserId: 'demo-advertiser',
      name: 'Production Shopify Store Postback',
      prefix: 'cf_adv_live_9a8b',
      scopes: 'conversions:write',
      lastUsedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      createdAt: new Date(Date.now() - 1000 * 3600 * 24 * 7).toISOString(),
    },
  ];
}

export async function createApiKey(name: string, scopes = 'conversions:write'): Promise<AdvertiserApiKeyItem> {
  const res = await fetch(`${API_BASE}/api/v1/advertisers/api-keys`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': 'demo-advertiser',
    },
    body: JSON.stringify({ name, scopes }),
  });
  if (res.ok) {
    const json = await res.json();
    return json.data;
  }
  throw new Error('Failed to create API key');
}

export async function revokeApiKey(id: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/api/v1/advertisers/api-keys/${id}`, {
    method: 'DELETE',
    headers: { 'x-user-id': 'demo-advertiser' },
  });
  return res.ok;
}

export async function reverseConversion(id: string, reason: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/api/v1/conversions/${id}/reverse`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': 'demo-advertiser',
    },
    body: JSON.stringify({ reason }),
  });
  return res.ok;
}
