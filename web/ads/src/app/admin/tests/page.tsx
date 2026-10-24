'use client';

import { SessionGate } from '../../../components/SessionGate';
import { AdsConsoleShell } from '../../../components/console/AdsConsoleShell';
import { AdminApiTestConsole } from '../../../components/console/admin/AdminApiTestConsole';

export default function AdminApiTestPage() {
  return (
    <SessionGate>
      <AdsConsoleShell role="admin" activeNavId="admin_tests">
        <AdminApiTestConsole />
      </AdsConsoleShell>
    </SessionGate>
  );
}
