'use client';

import { SessionGate } from '../../components/SessionGate';
import { BillingConsole } from '../../components/console/BillingConsole';

export default function BillingPayoutsPage() {
  return (
    <SessionGate>
      <BillingConsole initialTab="bank_accounts" />
    </SessionGate>
  );
}
