'use client';

import { SessionGate } from '../../../components/SessionGate';
import { AdminGuard } from '../../../components/AdminGuard';
import { AdsConsoleShell } from '../../../components/console/AdsConsoleShell';
import { AdminApiTestConsole } from '../../../components/console/admin/AdminApiTestConsole';

export default function AdminApiTestPage() {
  return (
    <SessionGate>
      <AdminGuard>
        <AdsConsoleShell role="admin" activeNavId="admin_tests">
          <AdminApiTestConsole />
        </AdsConsoleShell>
      </AdminGuard>
    </SessionGate>
  );
}
