'use client';

import { SessionGate } from '../../../components/SessionGate';
import { AdsConsoleShell } from '../../../components/console/AdsConsoleShell';
import { AdminModerationQueue } from '../../../components/console/AdminModerationQueue';

export default function AdsAdminModerationPage() {
  return (
    <SessionGate>
      <AdsConsoleShell role="admin" activeNavId="moderation">
        <AdminModerationQueue apiBase="" />
      </AdsConsoleShell>
    </SessionGate>
  );
}
