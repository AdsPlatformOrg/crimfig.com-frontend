'use client';
import { createAdsClient } from '@crimfig/api-client';
import { createAdsOperations } from '@crimfig/api-client/src/ads-operations';
import { sessionFetch } from './session';

/** Factory stays browser-lazy: no session access during module import or server rendering. */
export function adsApi() {
  return createAdsOperations(createAdsClient({ origin: window.location.origin, sessionFetch }));
}
