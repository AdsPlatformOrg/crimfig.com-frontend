'use client';

import { SessionGate } from '../../../components/SessionGate';
import { AdsConsoleShell } from '../../../components/console/AdsConsoleShell';
import { PromoterMobileAppsView } from '../../../components/console/promoter/PromoterMobileAppsView';

export default function PromoterMobileAppsPage() {
  return (
    <SessionGate>
      <AdsConsoleShell role="promoter" activeNavId="mobile_apps">
        <PromoterMobileAppsView />
      </AdsConsoleShell>
    </SessionGate>
  );
}
