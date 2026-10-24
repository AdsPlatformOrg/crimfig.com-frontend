'use client';

import { SessionGate } from '../../components/SessionGate';
import { BillingConsole } from '../../components/console/BillingConsole';

export default function BillingDashboardPage() {
  return (
    <SessionGate>
      <BillingConsole initialTab="overview" />
    </SessionGate>
  );
}
