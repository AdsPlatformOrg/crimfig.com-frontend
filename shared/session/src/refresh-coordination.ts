/** Lock messages contain no credentials. The actual request stays in its owning app. */
const scope = 'crimfig-refresh-lock';
const lockName = 'crimfig-refresh-cookie-v1';
const idPattern = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
const waitMs = 45_000;

export function refreshCoordinatorOrigins(authOrigin: string): string[] {
  if (authOrigin === 'https://auth.crimfig.com') return [authOrigin, 'https://ads.crimfig.com', 'https://billing.crimfig.com'];
  if (authOrigin === 'https://staging-auth.crimfig.com') return [authOrigin, 'https://staging-ads.crimfig.com', 'https://staging-billing.crimfig.com'];
  const url = new URL(authOrigin);
  if (url.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(url.hostname)) {
    return [3000, 3005, 3006, 3100, 3105, 3106].map(port => `http://${url.hostname}:${port}`);
  }
  return [];
}

/** Runs only on the public, inert Auth coordinator document. No API access here. */
export function installRefreshLockHost(win: Window = window, manager: LockManager | undefined = navigator.locks) {
  const params = new URLSearchParams(win.location.search);
  const origin = params.get('parent_origin') || '';
  const id = params.get('id') || '';
  if (win.parent === win || !idPattern.test(id) || !refreshCoordinatorOrigins(win.location.origin).includes(origin)) return () => {};
  let disposed = false, requested = false;
  let release: (() => void) | undefined;
  const controller = new AbortController();
  const send = (type: string) => win.parent.postMessage({scope, version: 1, id, type}, origin);
  const cleanup = () => {
    disposed = true;
    controller.abort();
    release?.();
    win.removeEventListener('message', receive);
  };
  function receive(event: MessageEvent) {
    const data = event.data;
    if (event.origin !== origin || event.source !== win.parent || data?.scope !== scope || data.version !== 1 || data.id !== id) return;
    if (data.type === 'release') { cleanup(); return; }
    if (data.type !== 'acquire' || requested || disposed) return;
    requested = true;
    if (!manager) { send('unsupported'); return; }
    void manager.request(lockName, {signal: controller.signal}, async () => {
      if (disposed) return;
      const held = new Promise<void>(resolve => {release = resolve;});
      // Never steal a live holder's lock: its HTTP request may still be committing.
      // The parent releases after its bounded fetch; document destruction also
      // releases Web Locks. Other callers have bounded acquisition waits.
      send('granted');
      await held;
    }).catch(() => { if (!disposed) send('unavailable'); });
  }
  win.addEventListener('message', receive);
  send('ready');
  return cleanup;
}

interface BrowserEnvironment {
  window: Window;
  document?: Document;
  locks?: LockManager | null;
}

export async function withBrowserRefreshLock<T>(authOrigin: string, work: () => Promise<T>, environment?: BrowserEnvironment): Promise<T> {
  if (!environment && typeof window === 'undefined') return work();
  const win = environment?.window ?? window;
  const manager = environment ? environment.locks : navigator.locks;
  if (win.location.origin === authOrigin) {
    // Unsupported browsers retain the previous one-attempt server-protected behavior.
    return manager ? manager.request(lockName, {signal: AbortSignal.timeout(waitMs)}, work) : work();
  }
  if (!refreshCoordinatorOrigins(authOrigin).includes(win.location.origin)) throw new Error('Session coordination origin is not allowed');
  const doc = environment?.document ?? document;
  const frame = doc.createElement('iframe');
  const id = win.crypto.randomUUID();
  const url = new URL('/session-coordinator', authOrigin);
  url.searchParams.set('parent_origin', win.location.origin);
  url.searchParams.set('id', id);
  frame.src = url.href;
  frame.hidden = true;
  frame.title = 'Session coordination';
  frame.referrerPolicy = 'no-referrer';
  frame.setAttribute('aria-hidden', 'true');
  return new Promise<T>((resolve, reject) => {
    let started = false, settled = false;
    const send = (type: string) => frame.contentWindow?.postMessage({scope, version: 1, id, type}, authOrigin);
    const cleanup = () => { clearTimeout(timer); win.removeEventListener('message', receive); send('release'); frame.remove(); };
    const finish = (error: unknown, value?: T) => {
      if (settled) return;
      settled = true; cleanup();
      if (error) reject(error); else resolve(value as T);
    };
    const run = () => {
      if (started) return;
      started = true; clearTimeout(timer);
      void Promise.resolve().then(work).then(value => finish(null, value), error => finish(error));
    };
    function receive(event: MessageEvent) {
      const data = event.data;
      if (event.origin !== authOrigin || event.source !== frame.contentWindow || data?.scope !== scope || data.version !== 1 || data.id !== id) return;
      if (data.type === 'ready') { send('acquire'); return; }
      if (data.type === 'granted' || data.type === 'unsupported') { run(); return; }
      if (data.type === 'unavailable' || data.type === 'expired') finish(new Error('Session coordination unavailable'));
    }
    // Blocked/failed coordinator never falls back into an uncoordinated retry.
    const timer = setTimeout(() => finish(new Error('Session coordination timed out')), waitMs);
    frame.addEventListener('error', () => finish(new Error('Session coordination unavailable')), {once: true});
    win.addEventListener('message', receive);
    doc.body.appendChild(frame);
  });
}
