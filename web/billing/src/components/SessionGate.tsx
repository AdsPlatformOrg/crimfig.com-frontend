'use client';

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import type { SessionSnapshot } from '@crimfig/session';
import { dashboardSession as sessionClient, loginUrl } from '../lib/session';
import { Button } from './ui/button';

const initialSnapshot: SessionSnapshot = Object.freeze({ status: 'idle', expiresAt: null, signOut: null });
const getServerSnapshot = () => initialSnapshot;
const getSnapshot = () => typeof window === 'undefined' ? initialSnapshot : sessionClient().getSnapshot();
const subscribe = (listener: () => void) => sessionClient().subscribe(listener);

export function useSessionSnapshot() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
export function useSessionStatus() { return useSessionSnapshot().status; }
export function SignOutButton() {
  return <Button type="button" variant="outline" size="sm" onClick={() => { void sessionClient().logout().catch(() => {}); }}>Sign out</Button>;
}

function WorkspaceSkeleton() {
  const [slow, setSlow] = useState(false);
  useEffect(() => { const id = window.setTimeout(() => setSlow(true), 200); return () => window.clearTimeout(id); }, []);
  return <div aria-busy="true" aria-label="Loading workspace" style={{ minHeight: '100dvh', background: 'var(--bg-page)', color: 'var(--text-secondary)' }}>
    <div aria-hidden="true" style={{ height: 72, borderBottom: '1px solid var(--border-subtle)', padding: '20px 24px' }}>
      <div style={{ height: 28, width: 144, maxWidth: '60%', borderRadius: 6, background: 'var(--bg-surface)' }} />
    </div>
    <div aria-hidden="true" style={{ maxWidth: 1000, margin: '32px auto', padding: 24, display: 'grid', gap: 20 }}>
      {[60, 100, 100].map((width, index) => <div key={index} style={{ height: index ? 112 : 28, width: `${width}%`, borderRadius: 10, background: 'var(--bg-surface)' }} />)}
    </div>
    <p role="status" style={{ textAlign: 'center', minHeight: 24 }}>{slow ? 'Loading workspace…' : ''}</p>
  </div>;
}

export function SessionGate({ children }: { children: ReactNode }) {
  const { status, signOut, renewal, identityVersion } = useSessionSnapshot();
  const hasAuthenticated = useRef(false);
  const retainedContent = useRef<HTMLDivElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);
  if (status === 'authenticated' && !signOut) hasAuthenticated.current = true;
  if (status === 'anonymous' || signOut) hasAuthenticated.current = false;
  const retry = useCallback(() => { void sessionClient().bootstrap().catch(() => {}); }, []);
  useEffect(() => { if (sessionClient().getSnapshot().status === 'idle') retry(); }, [retry]);
  const authorized = status === 'authenticated' && !signOut;
  const retainDraft = hasAuthenticated.current && !signOut && status !== 'anonymous';
  useEffect(() => {
    if (!retainDraft) lastFocused.current = null;
    if (authorized && lastFocused.current?.isConnected && retainedContent.current?.contains(lastFocused.current)) {
      lastFocused.current.focus({ preventScroll: true });
    }
  }, [authorized, retainDraft, identityVersion]);
  return <>
    {/* Never unmount a live form during renewal. Locked content is hidden and unfocusable. */}
    {(authorized || retainDraft) && <div key={identityVersion ?? 0} ref={retainedContent} hidden={!authorized} onFocusCapture={(event) => { lastFocused.current = event.target as HTMLElement; }}>{children}</div>}
    {authorized && renewal === 'connection-error' && <div role="status" style={{ position: 'fixed', bottom: 16, left: 16, right: 16, zIndex: 60, padding: 12, border: '1px solid var(--border-subtle)', borderRadius: 8, background: 'var(--bg-elevated)', color: 'var(--text-primary)' }}>
      Connection interrupted. Your current session is still valid. <Button type="button" variant="outline" onClick={retry}>Retry connection</Button>
    </div>}
    {!authorized && (status === 'idle' || status === 'loading') && !signOut && <WorkspaceSkeleton />}
    {!authorized && status !== 'idle' && status !== 'loading' && !signOut && <main style={{ minHeight: '100dvh', display: 'grid', placeItems: 'center', padding: 24, background: 'var(--bg-page)', color: 'var(--text-primary)' }}>
      <section style={{ maxWidth: 460, width: '100%' }} aria-live="polite">
        <h1>{status === 'temporary-error' ? 'Connection interrupted' : 'Sign in to continue'}</h1>
        <p>{status === 'temporary-error' ? 'Your workspace is locked until we can verify your session. Your open form stays in this tab while you reconnect.' : 'Sign in with your CrimFig account to continue to this page.'}</p>
        {status === 'temporary-error' && <Button type="button" onClick={retry}>Retry connection</Button>}
        <p><a href={loginUrl()}>Sign in to continue</a></p>
      </section>
    </main>}
    {signOut && <main style={{ minHeight: '100dvh', display: 'grid', placeItems: 'center', padding: 24, color: 'var(--text-primary)', background: 'var(--bg-page)' }}>
      <section aria-live="polite"><h1>{signOut === 'pending' ? 'Signing out…' : signOut === 'failed' ? 'Sign-out could not be confirmed' : 'You have been signed out'}</h1>
      <p>{signOut === 'failed' ? 'This workspace is locked, but your server session may still be active. Sign in again to continue safely.' : signOut === 'remote' ? 'Your account was signed out in another tab.' : 'Your private workspace is locked.'}</p>
      {signOut !== 'pending' && <a href={loginUrl()}>Sign in to continue</a>}</section>
    </main>}
  </>;
}
