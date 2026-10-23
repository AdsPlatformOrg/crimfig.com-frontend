import { safeReturnUrl } from '@crimfig/session';

export function loginDestination(params: URLSearchParams): string {
  if (params.get('client_id') && params.get('redirect_uri')) {
    const oauth = new URLSearchParams(params);
    oauth.delete('token'); oauth.delete('return_to');
    return `/consent?${oauth.toString()}`;
  }
  const origins = [
    process.env.NEXT_PUBLIC_ADS_URL || (process.env.NODE_ENV === 'production' ? 'https://ads.crimfig.com' : 'http://localhost:3005'),
    process.env.NEXT_PUBLIC_BILLING_URL || (process.env.NODE_ENV === 'production' ? 'https://billing.crimfig.com' : 'http://localhost:3007'),
  ].map(value => new URL(value).origin);
  return safeReturnUrl(params.get('return_to') || '', origins) || '/';
}
