'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LandingPage } from '../components/landing/LandingPage';

export default function BillingRoot() {
  const router = useRouter();

  useEffect(() => {
    // Graceful backward compatibility for legacy links: ?view=console or payment return hashes
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const requestedView = urlParams.get('view');
      const requestedTab = urlParams.get('tab');
      const hasPaymentParams =
        urlParams.has('reference') ||
        urlParams.has('trxref') ||
        urlParams.has('funding_request') ||
        urlParams.has('subscription_request') ||
        urlParams.has('withdrawal_request');

      if (requestedView === 'console' || hasPaymentParams) {
        const targetRoute =
          requestedTab === 'cards'
            ? '/cards'
            : requestedTab === 'subscriptions'
            ? '/subscriptions'
            : requestedTab === 'bank_accounts'
            ? '/payouts'
            : requestedTab === 'transactions'
            ? '/transactions'
            : requestedTab === 'rewards'
            ? '/rewards'
            : requestedTab === 'support'
            ? '/support'
            : '/dashboard';

        router.replace(`${targetRoute}${window.location.search}`);
      }
    }
  }, [router]);

  return (
    <LandingPage
      onLaunchConsole={(tab) => {
        const targetRoute = tab === 'rewards' ? '/rewards' : '/dashboard';
        router.push(targetRoute);
      }}
    />
  );
}
