'use client';

import { SessionGate } from '../components/SessionGate';
import React, { useState, useEffect } from 'react';
import { LandingPage } from '../components/landing/LandingPage';
import { BillingConsole } from '../components/console/BillingConsole';

export default function BillingRoot() {
  const [view, setView] = useState<'landing' | 'console' | 'loading'>('loading');
  const [initialTab, setInitialTab] = useState<'overview' | 'cards' | 'subscriptions' | 'bank_accounts' | 'transactions' | 'rewards'>('overview');

  useEffect(() => {
    // Resolve console links and provider references before showing the landing page.
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      setView('landing');
      const requestedView = urlParams.get('view');
      const requestedTab = urlParams.get('tab');

      if (requestedView === 'console' || urlParams.has('reference') || urlParams.has('trxref') || urlParams.has('funding_request')) {
        setView('console');
      }
      if (requestedTab && ['overview', 'cards', 'subscriptions', 'bank_accounts', 'transactions', 'rewards'].includes(requestedTab)) {
        setInitialTab(requestedTab as any);
        setView('console');
      }
    }
  }, []);

  if (view === 'loading') return <main role="status" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: 'var(--bg-page)', color: 'var(--text-primary)' }}>Opening Billing…</main>;

  if (view === 'landing') {
    return (
      <LandingPage
        onLaunchConsole={(tab) => {
          if (tab) setInitialTab(tab);
          setView('console');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }

  return (
    <SessionGate><BillingConsole
      initialTab={initialTab}
      onReturnToLanding={() => {
        setView('landing');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
    /></SessionGate>
  );
}
