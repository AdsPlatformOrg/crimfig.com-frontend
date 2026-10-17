export interface AdsConversionItem {
  id: string;
  advertiserId: string;
  campaignId?: string | null;
  campaignTitle?: string | null;
  clickId?: string | null;
  event: 'purchase' | 'lead' | 'sign_up' | 'add_to_cart' | 'app_install' | 'custom';
  orderId?: string | null;
  valueMicros?: number | null;
  currency?: string | null;
  valueUsd?: number | null;
  source: 'pixel' | 's2s';
  status: 'attributed' | 'unattributed' | 'duplicate' | 'reversed' | 'disputed';
  attributedPromoterId?: string | null;
  chargedUsd?: number | null;
  holdbackReleaseAt?: string | null;
  settlementBatchId?: string | null;
  metadata?: Record<string, any> | null;
  occurredAt: string;
  createdAt: string;
}

export interface AdvertiserApiKeyItem {
  id: string;
  advertiserId: string;
  name: string;
  prefix: string;
  scopes: string;
  lastUsedAt?: string | null;
  revokedAt?: string | null;
  createdAt: string;
  rawSecretKey?: string; // Only present immediately upon creation
}

export interface PixelConfig {
  advertiserId: string;
  scriptUrl: string;
  endpointUrl: string;
}
