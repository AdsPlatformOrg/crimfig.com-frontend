'use client';

import { SessionGate } from '../../components/SessionGate';
import { AdsConsoleShell } from '../../components/console/AdsConsoleShell';
import { CampaignsManager } from '../../components/console/advertiser/CampaignsManager';

export default function AdsCampaignsPage() {
  return (
    <SessionGate>
      <AdsConsoleShell role="advertiser" activeNavId="campaigns">
        <CampaignsManager />
      </AdsConsoleShell>
    </SessionGate>
  );
}
