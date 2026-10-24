import { createSessionClient } from '@crimfig/session';

let session: ReturnType<typeof createSessionClient> | undefined;

/** Auth first-party proxy only. Refresh cookie stays at Auth; bearer stays in memory. */
export function consentSession() {
  if (typeof window === 'undefined') throw new Error('Consent requires a browser');
  return session ??= createSessionClient({
    authOrigin: window.location.origin,
    apiOrigins: [window.location.origin],
    allowLocalHttp: process.env.NODE_ENV !== 'production',
    crossTabSignOut: true,
  });
}

interface ConsentRequest {
  client_id: string;
  redirect_uri: string;
  response_type: string;
  scope?: string;
  state?: string;
  code_challenge?: string;
  code_challenge_method?: string;
}

export function consentRequest(params: URLSearchParams): ConsentRequest {
  const keys = ['client_id', 'redirect_uri', 'response_type', 'scope', 'state', 'code_challenge', 'code_challenge_method'];
  for (const key of keys) if (params.getAll(key).length > 1) throw new Error('Conflicting authorization parameters');
  const client_id = params.get('client_id'), redirect_uri = params.get('redirect_uri');
  if (!client_id || !redirect_uri) throw new Error('Missing application or callback');
  const callback = new URL(redirect_uri);
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(callback.hostname);
  if (callback.username || callback.password || callback.hash ||
      (callback.protocol !== 'https:' && !(callback.protocol === 'http:' && local))) {
    throw new Error('Unsupported authorization callback');
  }
  if ((params.get('response_type') || 'code') !== 'code') throw new Error('Unsupported authorization response type');
  if (params.get('code_challenge_method') !== 'S256' || !/^[a-zA-Z0-9_-]{43}$/.test(params.get('code_challenge') || '')) throw new Error('S256 PKCE is required');
  const scopes = [...new Set((params.get('scope') || 'openid').split(' ').filter(Boolean))];
  if (!scopes.length || scopes.some(scope => !['openid', 'profile', 'email'].includes(scope))) throw new Error('Unsupported authorization scope');
  if (client_id.length > 100 || redirect_uri.length > 2048 || (params.get('state') || '').length > 512) throw new Error('Authorization parameters are too long');
  return {
    client_id, redirect_uri, response_type: 'code',
    ...Object.fromEntries(keys.slice(3).filter(key => params.has(key)).map(key => [key, params.get(key)!])),
    scope: scopes.join(' '),
  };
}

/** Server must validate registration before returning a code. A failed/ambiguous POST is never replayed. */
export async function approveConsent(params: URLSearchParams, request: (url: string, init: RequestInit) => Promise<Response>) {
  const body = consentRequest(params);
  const response = await request('/api/v1/oauth/authorize/approve', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error(response.status === 401 ? 'Session expired. Sign in again before authorizing.' :
    'Authorization was not confirmed. Start again from the requesting application.');
  const data = await response.json();
  if (!data || typeof data.code !== 'string' || !data.code.trim() || data.code.length > 4096 ||
      data.state !== body.state) throw new Error('Invalid authorization response. Start again from the requesting application.');
  const callback = new URL(body.redirect_uri);
  callback.searchParams.set('code', data.code);
  if (body.state !== undefined) callback.searchParams.set('state', body.state);
  else callback.searchParams.delete('state');
  return callback.href;
}
