'use client';

import { SessionGate } from '../../../components/SessionGate';
import { AdminGuard } from '../../../components/AdminGuard';
import { AdsConsoleShell } from '../../../components/console/AdsConsoleShell';
import { AdminModerationQueue } from '../../../components/console/AdminModerationQueue';

export default function AdsAdminModerationPage() {
  return (
    <SessionGate>
      <AdminGuard>
        <AdsConsoleShell role="admin" activeNavId="moderation">
          <AdminModerationQueue apiBase="" />
        </AdsConsoleShell>
      </AdminGuard>
    </SessionGate>
  );
}
