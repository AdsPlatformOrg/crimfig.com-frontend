/** Dashboard sessions only. Never use this client in public ad snippets. */
export type SessionStatus = 'idle' | 'loading' | 'authenticated' | 'anonymous' | 'temporary-error';

export type SignOutState = null | 'pending' | 'complete' | 'failed' | 'remote';

export interface SessionSnapshot {
  signOut: SignOutState;
  status: SessionStatus;
  expiresAt: number | null;
}

export interface UserProfile {
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

export class SessionError extends Error {
  constructor(public readonly kind: 'anonymous' | 'temporary' | 'cancelled', message: string) {
    super(message);
    this.name = 'SessionError';
  }
}

export interface SignOutChannel {
  postMessage(message: unknown): void;
  addEventListener(type: 'message', listener: (event: MessageEvent) => void): void;
  removeEventListener(type: 'message', listener: (event: MessageEvent) => void): void;
  close(): void;
}

export interface SessionOptions {
  /** Same-origin notifications only; no tokens or cookies are broadcast. */
  crossTabSignOut?: boolean;
  signOutChannel?: SignOutChannel;
  /** Exact origin, including port. HTTPS outside explicit local development. */
  authOrigin: string;
  /** Only these API origins may receive the in-memory bearer token. */
  apiOrigins: string[];
  allowLocalHttp?: boolean;
  fetch?: typeof globalThis.fetch;
  now?: () => number;
  requestTimeoutMs?: number;
  /** Optional coordinator. Same-origin Web Locks do not coordinate subdomains. */
  coordinateRefresh?: <T>(work: () => Promise<T>) => Promise<T>;
}

function trustedOrigin(value: string, allowLocalHttp: boolean): string {
  const url = new URL(value);
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
  if (url.username || url.password || url.pathname !== '/' || url.search || url.hash ||
      (url.protocol !== 'https:' && !(allowLocalHttp && local && url.protocol === 'http:'))) {
    throw new TypeError('Configure an exact HTTPS origin (or explicit local development origin)');
  }
  return url.origin;
}

/** Returns an allowlisted absolute return URL, or null. Does not navigate. */
export function safeReturnUrl(value: string, allowedOrigins: string[]): string | null {
  try {
    const url = new URL(value);
    if (url.username || url.password || !['https:', 'http:'].includes(url.protocol)) return null;
    return allowedOrigins.includes(url.origin) ? url.href : null;
  } catch {
    return null;
  }
}

export function createSessionClient(options: SessionOptions) {
  const authOrigin = trustedOrigin(options.authOrigin, options.allowLocalHttp === true);
  const apiOrigins = new Set(options.apiOrigins.map(origin =>
    trustedOrigin(origin, options.allowLocalHttp === true)));
  const fetcher = options.fetch ?? globalThis.fetch.bind(globalThis);
  const now = options.now ?? Date.now;
  const timeoutMs = options.requestTimeoutMs ?? 10_000;
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) throw new TypeError('Invalid request timeout');
  let token: string | null = null;
  let profileCache: Promise<UserProfile> | null = null;
  const invalidateProfile = () => { profileCache = null; };
  if (typeof window !== 'undefined') window.addEventListener('crimfig-profile-updated', invalidateProfile);
  let snapshot: SessionSnapshot = { status: 'idle', expiresAt: null, signOut: null };
  let signOut: SignOutState = null;
  let logoutFlight: Promise<void> | null = null;
  let channel = options.signOutChannel;
  if (!channel && options.crossTabSignOut && typeof window !== 'undefined' && typeof BroadcastChannel !== 'undefined') {
    try { channel = new BroadcastChannel('crimfig-dashboard-signout-v1'); } catch { /* Browser may disable cross-tab messaging. */ }
  }
  let generation = 0;
  let signingOut = false;
  let refreshFlight: Promise<string> | null = null;
  const listeners = new Set<(snapshot: SessionSnapshot) => void>();

  function publish(status: SessionStatus, expiresAt: number | null = null) {
    snapshot = { status, expiresAt, signOut };
    for (const listener of listeners) {
      // A UI subscriber must not break session transitions for other consumers.
      try { listener({ ...snapshot }); } catch { /* Consumers own their UI errors. */ }
    }
  }

  function clearSession() {
    generation++;
    token = null;
    profileCache = null;
    publish('anonymous');
  }

  async function refresh(): Promise<string> {
    if (signOut) throw new SessionError('anonymous', 'Signed out; sign in again to continue');
    if (refreshFlight) return refreshFlight;
    const started = generation;
    const work = async () => {
      if (started !== generation) throw new SessionError('cancelled', 'Session changed');
      publish('loading');
      try {
        const response = await fetcher(`${authOrigin}/api/v1/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: '{}',
          redirect: 'error',
          signal: AbortSignal.timeout(timeoutMs),
        });
        if (started !== generation) throw new SessionError('cancelled', 'Session changed');
        if (response.status === 401) {
          token = null;
          publish('anonymous');
          throw new SessionError('anonymous', 'No valid session');
        }
        if (!response.ok) throw new SessionError('temporary', 'Session service unavailable');
        // Auth controller returns TokenPair directly, not { data: TokenPair }.
        const data: unknown = await response.json();
        if (started !== generation) throw new SessionError('cancelled', 'Session changed');
        const pair = data as { accessToken?: unknown; expiresIn?: unknown } | null;
        if (!pair || typeof pair.accessToken !== 'string' || !pair.accessToken.trim() ||
            typeof pair.expiresIn !== 'number' || !Number.isFinite(pair.expiresIn) ||
            pair.expiresIn <= 0 || pair.expiresIn > 86_400) {
          throw new SessionError('temporary', 'Invalid session response');
        }
        // Ignore refreshToken in the JSON response; only the HttpOnly cookie is used.
        token = pair.accessToken;
        publish('authenticated', now() + pair.expiresIn * 1000);
        return token;
      } catch (error) {
        if (started !== generation) throw new SessionError('cancelled', 'Session changed');
        if (error instanceof SessionError && error.kind === 'anonymous') throw error;
        token = null;
        publish('temporary-error');
        throw error instanceof SessionError ? error : new SessionError('temporary', 'Cannot reach session service');
      }
    };
    // Defer work so the flight is assigned before a synchronous subscriber can reenter.
    const flight = Promise.resolve().then(() => options.coordinateRefresh
      ? options.coordinateRefresh(work) : work());
    refreshFlight = flight;
    try { return await flight; }
    finally { if (refreshFlight === flight) refreshFlight = null; }
  }

  function onSignOutMessage(event: MessageEvent) {
    const data = event.data;
    if (data?.type !== 'signed-out' || data.version !== 1 || data.authOrigin !== authOrigin) return;
    signOut = 'remote';
    clearSession();
  }
  channel?.addEventListener('message', onSignOutMessage);

  async function accessToken() {
    if (signingOut) throw new SessionError('cancelled', 'Logout is in progress');
    if (signOut) throw new SessionError('anonymous', 'Signed out; sign in again to continue');
    if (token && snapshot.expiresAt !== null && snapshot.expiresAt > now() + 5_000) return token;
    return refresh();
  }

  async function getProfile(): Promise<UserProfile> {
    if (profileCache) return profileCache;
    profileCache = (async () => {
      const bearer = await accessToken();
      const response = await fetcher(`${authOrigin}/api/v1/auth/me`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${bearer}` },
        credentials: 'omit',
        redirect: 'error',
        signal: AbortSignal.timeout(timeoutMs),
      });
      if (!response.ok) throw new SessionError('temporary', 'Profile service unavailable');
      const data = await response.json() as Partial<UserProfile> | null;
      const avatar = data?.avatar;
      if (!data || typeof data.userId !== 'string' || typeof data.email !== 'string' ||
          !avatar || !['default', 'preset'].includes(avatar.kind) ||
          typeof avatar.presetId !== 'string' || typeof avatar.alt !== 'string' ||
          typeof avatar.url !== 'string' || !Number.isSafeInteger(avatar.version)) {
        throw new SessionError('temporary', 'Invalid profile response');
      }
      return data as UserProfile;
    })();
    try {
      return await profileCache;
    } catch (error) {
      profileCache = null;
      throw error;
    }
  }

  async function request(input: string | URL, init: RequestInit = {}): Promise<Response> {
    const url = new URL(input);
    if (url.username || url.password || !apiOrigins.has(url.origin)) {
      throw new TypeError('API origin is not trusted');
    }
    const method = (init.method ?? 'GET').toUpperCase();
    const started = generation;
    const firstToken = await accessToken();
    if (started !== generation) throw new SessionError('cancelled', 'Session changed');
    const send = (bearer: string) => {
      const headers = new Headers(init.headers);
      headers.delete('x-user-id');
      headers.delete('x-user-email');
      headers.set('Authorization', `Bearer ${bearer}`);
      return fetcher(url.href, {
        ...init, method, headers, credentials: 'omit', redirect: 'error',
        signal: init.signal
          ? AbortSignal.any([init.signal, AbortSignal.timeout(timeoutMs)])
          : AbortSignal.timeout(timeoutMs),
      });
    };
    const response = await send(firstToken);
    if (started !== generation) throw new SessionError('cancelled', 'Session changed');
    if (response.status !== 401) return response;
    // Mutations are never automatically replayed, including payment requests.
    if (method !== 'GET' && method !== 'HEAD') {
      if (token === firstToken) { token = null; publish('idle'); }
      return response;
    }
    await response.body?.cancel();
    // Another concurrent request may already have replaced the rejected token.
    const nextToken = token && token !== firstToken ? await accessToken() : await refresh();
    if (started !== generation) throw new SessionError('cancelled', 'Session changed');
    const retried = await send(nextToken);
    if (started !== generation) throw new SessionError('cancelled', 'Session changed');
    if (retried.status === 401 && token === nextToken) clearSession();
    return retried;
  }

  function logout(): Promise<void> {
    if (logoutFlight) return logoutFlight;
    const bearer = token;
    const flight = Promise.resolve().then(async () => {
      try {
        if (!bearer) throw new SessionError('temporary', 'Server logout could not be confirmed; session cookie may remain');
        const response = await fetcher(`${authOrigin}/api/v1/auth/logout`, {
          method: 'POST', credentials: 'include', redirect: 'error',
          headers: { Authorization: `Bearer ${bearer}` },
          signal: AbortSignal.timeout(timeoutMs),
        });
        if (!response.ok) throw new Error('Logout rejected');
        signOut = 'complete';
      } catch {
        signOut = 'failed';
        throw new SessionError('temporary', 'Server logout could not be confirmed; session cookie may remain');
      } finally {
        signingOut = false;
        publish('anonymous');
      }
    });
    logoutFlight = flight;
    signingOut = true;
    signOut = 'pending';
    clearSession();
    // Notify peers immediately, including when server revocation later fails. Never echo peers.
    try { channel?.postMessage({ type: 'signed-out', version: 1, authOrigin }); } catch { /* Local sign-out still applies. */ }
    return flight;
  }

  return {
    getSnapshot: (): SessionSnapshot => ({ ...snapshot }),
    subscribe(listener: (snapshot: SessionSnapshot) => void) {
      listeners.add(listener);
      return () => { listeners.delete(listener); };
    },
    bootstrap: async (): Promise<SessionSnapshot> => {
      try { await accessToken(); }
      catch (error) {
        if (!(error instanceof SessionError) || error.kind === 'cancelled') throw error;
      }
      return { ...snapshot };
    },
    request,
    getProfile,
    logout,
    clearSession,
    dispose() {
      channel?.removeEventListener('message', onSignOutMessage);
      channel?.close();
      if (typeof window !== 'undefined') window.removeEventListener('crimfig-profile-updated', invalidateProfile);
      signOut = 'remote';
      clearSession();
      listeners.clear();
    },
  };
}
