'use client';

import { SessionGate } from '../../../components/SessionGate';
import { AdsConsoleShell } from '../../../components/console/AdsConsoleShell';
import { PromoterMarketplaceView } from '../../../components/console/promoter/PromoterMarketplaceView';

export default function PromoterMarketplacePage() {
  return (
    <SessionGate>
      <AdsConsoleShell role="promoter" activeNavId="marketplace">
        <PromoterMarketplaceView />
      </AdsConsoleShell>
    </SessionGate>
  );
}
