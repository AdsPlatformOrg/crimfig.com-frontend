/**
 * CrimFig Auth Web — Client Configuration & API URL Helper
 */

export const clientConfig = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? '',
  authWebUrl: process.env.NEXT_PUBLIC_AUTH_WEB_URL ?? 'http://localhost:3000',
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? 'CrimFig Identity',

  apps: {
    ads: process.env.NEXT_PUBLIC_ADS_URL ?? 'http://localhost:3001',
    chat: process.env.NEXT_PUBLIC_CHAT_URL ?? 'http://localhost:3002',
    reels: process.env.NEXT_PUBLIC_REELS_URL ?? 'http://localhost:3005',
    stream: process.env.NEXT_PUBLIC_STREAM_URL ?? 'http://localhost:3006',
    tetris: process.env.NEXT_PUBLIC_TETRIS_URL ?? 'http://localhost:3007',
  },
} as const;

/**
 * Returns the fully qualified or relative API endpoint URL.
 *
 * Examples:
 *   getApiUrl('/api/v1/auth/login')
 *   -> '/api/v1/auth/login' (if NEXT_PUBLIC_API_URL is empty)
 *   -> 'http://localhost:4000/api/v1/auth/login' (if NEXT_PUBLIC_API_URL is set)
 */
export function getApiUrl(path: string): string {
  const base = (clientConfig.apiUrl || '').replace(/\/+$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return base ? `${base}${cleanPath}` : cleanPath;
}
