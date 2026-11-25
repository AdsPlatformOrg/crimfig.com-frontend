import { ecosystemOrigin } from '../../../../shared/ui/origins';
import { safeReturnUrl } from '@crimfig/session';

export function allowedLoginReturnOrigins(): string[] {
  return [
    ecosystemOrigin('ads', process.env.NEXT_PUBLIC_ADS_WEB_URL || process.env.NEXT_PUBLIC_ADS_URL),
    ecosystemOrigin('billing', process.env.NEXT_PUBLIC_BILLING_WEB_URL || process.env.NEXT_PUBLIC_BILLING_URL),
  ];
}

export function defaultAdsDashboardUrl(): string {
  const adsOrigin = ecosystemOrigin('ads', process.env.NEXT_PUBLIC_ADS_WEB_URL || process.env.NEXT_PUBLIC_ADS_URL);
  return `${adsOrigin}/dashboard`;
}

export function safeExplicitLoginReturnUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  return safeReturnUrl(value, allowedLoginReturnOrigins());
}

export function loginDestination(params: URLSearchParams): string {
  if (params.get('client_id') && params.get('redirect_uri')) {
    const oauth = new URLSearchParams(params);
    oauth.delete('token');
    oauth.delete('return_to');
    return `/consent?${oauth.toString()}`;
  }
  return safeExplicitLoginReturnUrl(params.get('return_to')) || defaultAdsDashboardUrl();
}
