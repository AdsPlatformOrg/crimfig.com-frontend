import { consentSession } from './consent';

export interface AuthProfile {
  userId: string;
  email: string;
  avatar: {
    kind: 'default' | 'preset';
    presetId: string;
    label: string;
    alt: string;
    url: string;
    version: number;
  };
}

export interface AvatarPreset {
  id: string;
  label: string;
  file: string;
  alt: string;
}

export interface AvatarAttribution {
  title: string;
  artist: string;
  sourceUrl: string;
  license: string;
  licenseUrl: string;
  summary: string;
  modifications: string;
}

export interface AvatarCatalog {
  defaultId: string;
  presets: AvatarPreset[];
  attribution: AvatarAttribution;
}

function authUrl(path: string): URL {
  return new URL(path, window.location.origin);
}

async function client() {
  const session = consentSession();
  await session.bootstrap();
  return session;
}

export async function loadProfile(): Promise<AuthProfile> {
  const session = await client();
  const response = await session.request(authUrl('/api/v1/auth/me'));
  if (!response.ok) throw new Error(response.status === 401 ? 'Sign in again to manage your avatar.' : 'Your profile could not be loaded.');
  const data = await response.json() as AuthProfile;
  if (!data?.avatar || typeof data.avatar.url !== 'string') throw new Error('The profile response was invalid.');
  return data;
}

export async function loadAvatarCatalog(): Promise<AvatarCatalog> {
  const session = await client();
  const response = await session.request(authUrl('/api/v1/auth/avatar-presets'));
  if (!response.ok) throw new Error('Avatar choices could not be loaded.');
  return response.json() as Promise<AvatarCatalog>;
}

export async function saveAvatarPreset(presetId: string | null): Promise<AuthProfile> {
  const session = await client();
  const response = await session.request(authUrl('/api/v1/auth/profile/avatar'), {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ presetId }),
  });
  if (!response.ok) throw new Error(response.status === 400 ? 'Choose a valid avatar.' : 'Your avatar could not be saved.');
  const data = await response.json() as AuthProfile;
  if (!data?.avatar) throw new Error('The avatar response was invalid.');
  window.dispatchEvent(new Event('crimfig-profile-updated'));
  return data;
}
