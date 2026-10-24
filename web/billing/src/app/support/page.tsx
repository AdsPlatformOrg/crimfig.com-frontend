'use client';

import { SessionGate } from '../../components/SessionGate';
import { BillingConsole } from '../../components/console/BillingConsole';

export default function BillingSupportPage() {
  return (
    <SessionGate>
      <BillingConsole initialTab="support" />
    </SessionGate>
  );
}
