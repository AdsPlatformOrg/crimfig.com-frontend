'use client';

import { SessionGate } from '../../components/SessionGate';
import { AdsConsoleShell } from '../../components/console/AdsConsoleShell';
import { NotificationCenter } from '../../components/console/NotificationCenter';

export default function AdsNotificationsPage() {
  return (
    <SessionGate>
      <AdsConsoleShell role="advertiser" activeNavId="notifications">
        <NotificationCenter />
      </AdsConsoleShell>
    </SessionGate>
  );
}
