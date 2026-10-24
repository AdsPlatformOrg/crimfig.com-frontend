'use client';

import { SessionGate } from '../../components/SessionGate';
import { AdsConsoleShell } from '../../components/console/AdsConsoleShell';
import { DisputesTab } from '../../components/console/disputes/DisputesTab';

export default function AdsDisputesPage() {
  return (
    <SessionGate>
      <AdsConsoleShell role="advertiser" activeNavId="disputes">
        <DisputesTab role="advertiser" />
      </AdsConsoleShell>
    </SessionGate>
  );
}
