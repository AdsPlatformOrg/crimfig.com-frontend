'use client';

import { SessionGate } from '../../components/SessionGate';
import { BillingConsole } from '../../components/console/BillingConsole';

export default function BillingTransactionsPage() {
  return (
    <SessionGate>
      <BillingConsole initialTab="transactions" />
    </SessionGate>
  );
}
