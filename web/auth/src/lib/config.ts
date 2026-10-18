/**
 * CrimFig Auth Web — Client Configuration & API URL Helper
 */

export const clientConfig = {
  apiUrl: process.env.NEXT_PUBLIC_AUTH_API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? '',
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
 * In the browser, client-side requests ALWAYS use clean, relative URLs
 * (e.g. '/api/v1/auth/signup') so the browser uses the current domain/subdomain
 * (e.g. https://auth.crimfig.com/api/v1/auth/signup). This ensures:
 * 1. The public subdomain (auth.crimfig.com) is used for all XHR/Fetch requests.
 * 2. Zero CORS errors (same-origin request, seamlessly proxied by Next.js).
 * 3. First-party cookies are maintained properly on auth.crimfig.com.
 */
export function getApiUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  // In the browser, always use relative paths on the current subdomain
  if (typeof window !== 'undefined') {
    return cleanPath;
  }

  // During SSR, prepend backend URL if configured
  const base = (clientConfig.apiUrl || '').replace(/\/+$/, '');
  return base ? `${base}${cleanPath}` : cleanPath;
}
