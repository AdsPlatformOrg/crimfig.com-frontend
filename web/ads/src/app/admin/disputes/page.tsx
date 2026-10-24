'use client';

import { SessionGate } from '../../../components/SessionGate';
import { AdsConsoleShell } from '../../../components/console/AdsConsoleShell';
import { DisputesTab } from '../../../components/console/disputes/DisputesTab';

export default function AdsAdminDisputesPage() {
  return (
    <SessionGate>
      <AdsConsoleShell role="admin" activeNavId="admin_disputes">
        <DisputesTab role="advertiser" />
      </AdsConsoleShell>
    </SessionGate>
  );
}
