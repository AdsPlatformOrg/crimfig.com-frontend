'use client';

import { useEffect, useState, type ReactNode, type CSSProperties } from 'react';
import type { SessionSnapshot } from '@crimfig/session';
import { dashboardSession, loginUrl } from '../lib/session';

export function useSessionSnapshot() {
  const [snapshot, setSnapshot] = useState<SessionSnapshot>({ status: 'idle', expiresAt: null, signOut: null });
  useEffect(() => {
    const client = dashboardSession();
    setSnapshot(client.getSnapshot());
    return client.subscribe(setSnapshot);
  }, []);
  return snapshot;
}
export function useSessionStatus() { return useSessionSnapshot().status; }

export function SignOutButton() {
  return <button type="button" onClick={() => { void dashboardSession().logout().catch(() => { /* SessionGate displays revocation failure. */ }); }} style={{ display: 'inline-flex', alignItems: 'center', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-primary)', cursor: 'pointer', font: 'inherit', fontSize: 13, whiteSpace: 'nowrap' }}>Sign out</button>;
}

const actionStyle: CSSProperties = { display: 'inline-flex', background: 'var(--color-crimson)', color: 'var(--color-white)', padding: '12px 20px', borderRadius: 8, border: 0, cursor: 'pointer', font: 'inherit', textDecoration: 'none' };

export function SessionGate({ children }: { children: ReactNode }) {
  const { status, signOut } = useSessionSnapshot();
  useEffect(() => {
    const client = dashboardSession();
    if (client.getSnapshot().status === 'idle') void client.bootstrap().catch(() => { /* A sign-out can cancel bootstrap. */ });
  }, [status]);
  if (status === 'authenticated' && !signOut) return children;
  const waiting = status === 'idle' || status === 'loading' || signOut === 'pending';
  return <main className="auth-centered-container" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, background: 'var(--bg-page)', color: 'var(--text-primary)' }}>
    <section className="glass-card" aria-live="polite" style={{ padding: 32, maxWidth: 480, width: '100%', boxSizing: 'border-box', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 12 }}>
      <h1>{signOut === 'pending' ? 'Signing out' : signOut === 'failed' ? 'Server sign-out could not be confirmed' : signOut ? 'Signed out' : waiting ? 'Checking your session' : status === 'anonymous' ? 'Sign in to your dashboard' : 'Your session could not be checked'}</h1>
      <p>{signOut === 'failed' ? 'This dashboard is locked, but the server session cookie may remain. Sign in again before continuing.' : signOut === 'remote' ? 'This dashboard was signed out from another tab.' : signOut === 'complete' ? 'Your session has been signed out.' : waiting ? 'Please wait…' : status === 'anonymous' ? 'Use your CrimFig account to continue.' : 'Please retry when the session service is available.'}</p>
      {!waiting && (status === 'anonymous'
        ? <a style={actionStyle} href={loginUrl()}>Sign in</a>
        : <button style={actionStyle} onClick={() => void dashboardSession().bootstrap().catch(() => { /* Snapshot owns feedback. */ })}>Retry</button>)}
    </section>
  </main>;
}
