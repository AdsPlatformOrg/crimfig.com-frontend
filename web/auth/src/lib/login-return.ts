import { ecosystemOrigin } from '../../../../shared/ui/origins';
import { safeReturnUrl } from '@crimfig/session';

export function loginDestination(params: URLSearchParams): string {
  if (params.get('client_id') && params.get('redirect_uri')) {
    const oauth = new URLSearchParams(params);
    oauth.delete('token'); oauth.delete('return_to');
    return `/consent?${oauth.toString()}`;
  }
  const origins = [ecosystemOrigin('ads',process.env.NEXT_PUBLIC_ADS_WEB_URL||process.env.NEXT_PUBLIC_ADS_URL),ecosystemOrigin('billing',process.env.NEXT_PUBLIC_BILLING_WEB_URL||process.env.NEXT_PUBLIC_BILLING_URL)];
  return safeReturnUrl(params.get('return_to') || '', origins) || '/';
}
