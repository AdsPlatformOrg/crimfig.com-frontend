'use client';

import { SessionGate } from '../../../components/SessionGate';
import { AdminGuard } from '../../../components/AdminGuard';
import { AdsConsoleShell } from '../../../components/console/AdsConsoleShell';
import { DisputesTab } from '../../../components/console/disputes/DisputesTab';

export default function AdsAdminDisputesPage() {
  return (
    <SessionGate>
      <AdminGuard>
        <AdsConsoleShell role="admin" activeNavId="admin_disputes">
          <DisputesTab role="advertiser" />
        </AdsConsoleShell>
      </AdminGuard>
    </SessionGate>
  );
}
