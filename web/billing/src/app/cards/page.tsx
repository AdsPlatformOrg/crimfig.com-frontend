'use client';

import { SessionGate } from '../../components/SessionGate';
import { BillingConsole } from '../../components/console/BillingConsole';

export default function BillingCardsPage() {
  return (
    <SessionGate>
      <BillingConsole initialTab="cards" />
    </SessionGate>
  );
}
