import { apiData, arrayData, jsonBody } from './api-data';

export type LocationScope = 'global' | 'continent' | 'region' | 'country' | 'state' | 'city';

export interface GeoPlace {
  id: string;
  scope: Exclude<LocationScope, 'global'>;
  name: string;
  parentId: string | null;
  countryCode: string | null;
  subdivisionCode: string | null;
}

export interface NormalizedSuggestion {
  scope: Exclude<LocationScope, 'global'>;
  canonicalId: string | null;
  providerPlaceId: string;
  label: string;
  description?: string;
  countryCode?: string;
  subdivisionCode?: string;
  provider: 'google' | 'geoapify';
  latitude?: number;
  longitude?: number;
}

export async function createLocationSession(): Promise<{ sessionToken: string; expiresAt: string }> {
  return apiData('/api/v1/locations/session', { method: 'POST' });
}

export async function getLocation(canonicalId: string): Promise<GeoPlace> {
  return apiData(`/api/v1/locations/place/${encodeURIComponent(canonicalId)}`);
}

export async function loadHierarchy(parentId?: string): Promise<GeoPlace[]> {
  const query = parentId ? `?parentId=${encodeURIComponent(parentId)}` : '';
  return arrayData(await apiData(`/api/v1/locations/hierarchy${query}`));
}

export async function searchLocations(input: {
  query: string;
  scope: Exclude<LocationScope, 'global'>;
  sessionToken: string;
  parentId?: string;
  countryCode?: string;
}): Promise<{ suggestions: NormalizedSuggestion[]; provider: 'google' | 'geoapify'; attribution: string }> {
  const params = new URLSearchParams({
    q: input.query,
    scope: input.scope,
    sessionToken: input.sessionToken,
  });
  if (input.parentId) params.set('parentId', input.parentId);
  if (input.countryCode) params.set('countryCode', input.countryCode);
  return apiData(`/api/v1/locations/suggestions?${params.toString()}`);
}

export async function resolveLocation(input: {
  provider: 'google' | 'geoapify';
  providerPlaceId: string;
  scope: Exclude<LocationScope, 'global'>;
  sessionToken: string;
}): Promise<GeoPlace> {
  return apiData('/api/v1/locations/resolve', jsonBody(input));
}
