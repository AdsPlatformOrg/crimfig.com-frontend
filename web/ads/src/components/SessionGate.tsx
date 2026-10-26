'use client';

import { useEffect, useState, type ReactNode, type CSSProperties } from 'react';
import type { SessionSnapshot } from '@crimfig/session';
import { dashboardSession, loginUrl } from '../lib/session';
import { Button } from './ui/button';

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
  return <Button type="button" variant="outline" size="sm" onClick={() => { void dashboardSession().logout().catch(() => { /* SessionGate displays revocation failure. */ }); }}>Sign out</Button>;
}

const actionStyle: CSSProperties = { display: 'inline-flex', background: 'var(--color-crimson)', color: 'var(--color-white)', padding: '12px 20px', borderRadius: 8, border: 0, cursor: 'pointer', font: 'inherit', textDecoration: 'none' };

import { CrimFigLogo } from './CrimFigLogo';

export function SessionGate({ children }: { children: ReactNode }) {
  const { status, signOut } = useSessionSnapshot();
  useEffect(() => {
    const client = dashboardSession();
    if (client.getSnapshot().status === 'idle') void client.bootstrap().catch(() => { /* A sign-out can cancel bootstrap. */ });
  }, [status]);
  if (status === 'authenticated' && !signOut) return children;
  const waiting = status === 'idle' || status === 'loading' || signOut === 'pending';

  return (
    <main
      className="auth-centered-container"
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: '24px',
        background: 'var(--bg-page)',
        color: 'var(--text-primary)',
        fontFamily: "'Poppins', Arial, Helvetica, sans-serif",
      }}
    >
      <section
        className="glass-card"
        aria-live="polite"
        style={{
          padding: '36px 32px',
          maxWidth: '460px',
          width: '100%',
          boxSizing: 'border-box',
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          boxShadow: 'var(--shadow-md)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        {/* Animated CrimFig Brand Icon Spinner */}
        <div style={{ position: 'relative', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {waiting && (
            <div
              style={{
                position: 'absolute',
                inset: '-4px',
                borderRadius: '50%',
                border: '2px solid transparent',
                borderTopColor: 'var(--color-crimson)',
                borderRightColor: 'var(--color-crimson-light)',
                animation: 'spin 1.2s cubic-bezier(0.5, 0.1, 0.5, 0.9) infinite',
              }}
            />
          )}
          <CrimFigLogo variant="icon" size={38} priority />
        </div>

        <div>
          <h1
            style={{
              fontSize: '20px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              margin: '0 0 8px 0',
              letterSpacing: '-0.3px',
              lineHeight: 1.3,
            }}
          >
            {signOut === 'pending'
              ? 'Securing your sign-out…'
              : signOut === 'failed'
              ? 'Sign-out could not be confirmed'
              : signOut
              ? 'You have been signed out'
              : waiting
              ? 'Preparing your workspace'
              : status === 'anonymous'
              ? 'Welcome to CrimFig Ads'
              : 'Unable to verify session'}
          </h1>

          <p
            style={{
              fontSize: '13.5px',
              color: 'var(--text-secondary)',
              margin: 0,
              lineHeight: 1.5,
              opacity: 0.9,
            }}
          >
            {signOut === 'failed'
              ? 'This dashboard is locked for your protection, but your server session may still be active. Please sign in again to continue safely.'
              : signOut === 'remote'
              ? 'Your account was signed out from another tab or window. Sign in whenever you are ready.'
              : signOut === 'complete'
              ? 'Thank you for your time. Your session has safely concluded.'
              : waiting
              ? 'Checking your secure session to make sure everything is in place for you…'
              : status === 'anonymous'
              ? 'Sign in with your CrimFig account to manage campaigns, creatives, and publisher inventory.'
              : 'We had trouble reaching the session service. Please retry in a moment.'}
          </p>
        </div>

        {!waiting && (
          <div style={{ marginTop: '8px', width: '100%' }}>
            {status === 'anonymous' ? (
              <a
                style={{ ...actionStyle, width: '100%', boxSizing: 'border-box', justifyContent: 'center', fontWeight: 600, fontSize: '14px', borderRadius: '10px' }}
                href={loginUrl()}
              >
                Sign In to Continue
              </a>
            ) : (
              <Button
                type="button"
                style={{ width: '100%' }}
                size="lg"
                onClick={() => void dashboardSession().bootstrap().catch(() => {})}
              >
                Retry Connection
              </Button>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
