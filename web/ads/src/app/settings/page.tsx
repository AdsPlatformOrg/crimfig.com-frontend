'use client';

import { SessionGate } from '../../components/SessionGate';
import { AdsConsoleShell } from '../../components/console/AdsConsoleShell';
import { AccountSettingsView } from '../../components/console/settings/AccountSettingsView';

export default function AdsSettingsPage() {
  return (
    <SessionGate>
      <AdsConsoleShell role="advertiser" activeNavId="settings">
        <AccountSettingsView />
      </AdsConsoleShell>
    </SessionGate>
  );
}
