'use client';

import { SessionGate } from '../../components/SessionGate';
import { BillingConsole } from '../../components/console/BillingConsole';

export default function BillingSubscriptionsPage() {
  return (
    <SessionGate>
      <BillingConsole initialTab="subscriptions" />
    </SessionGate>
  );
}
