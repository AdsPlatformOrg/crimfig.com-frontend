'use client';

import { SessionGate } from '../../components/SessionGate';
import { AdsConsoleShell } from '../../components/console/AdsConsoleShell';
import { UserProfileView } from '../../components/console/profile/UserProfileView';

export default function AdsProfilePage() {
  return (
    <SessionGate>
      <AdsConsoleShell role="advertiser" activeNavId="profile">
        <UserProfileView />
      </AdsConsoleShell>
    </SessionGate>
  );
}
