'use client';

import { SessionGate } from '../../components/SessionGate';
import { AdsConsoleShell } from '../../components/console/AdsConsoleShell';
import { BillingLedger } from '../../components/console/billing/BillingLedger';

export default function AdsBillingPage() {
  return (
    <SessionGate>
      <AdsConsoleShell role="advertiser" activeNavId="billing_escrow">
        <BillingLedger initialRole="advertiser" />
      </AdsConsoleShell>
    </SessionGate>
  );
}
