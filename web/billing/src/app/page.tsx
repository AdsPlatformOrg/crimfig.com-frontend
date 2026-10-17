'use client';

import React, { useState, useEffect } from 'react';
import { LandingPage } from '../components/landing/LandingPage';
import { BillingConsole } from '../components/console/BillingConsole';

export default function BillingRoot() {
  const [view, setView] = useState<'landing' | 'console'>('landing');
  const [initialTab, setInitialTab] = useState<'overview' | 'cards' | 'subscriptions' | 'bank_accounts' | 'transactions' | 'rewards'>('overview');

  useEffect(() => {
    // Check if URL has ?view=console or #console
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const requestedView = urlParams.get('view');
      const requestedTab = urlParams.get('tab');

      if (requestedView === 'console') {
        setView('console');
      }
      if (requestedTab && ['overview', 'cards', 'subscriptions', 'bank_accounts', 'transactions', 'rewards'].includes(requestedTab)) {
        setInitialTab(requestedTab as any);
        setView('console');
      }
    }
  }, []);

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
    <BillingConsole
      initialTab={initialTab}
      onReturnToLanding={() => {
        setView('landing');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
    />
  );
}
