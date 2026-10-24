'use client';

import { SessionGate } from '../../components/SessionGate';
import { AdsConsoleShell } from '../../components/console/AdsConsoleShell';
import { PromoterWebsitesView } from '../../components/console/promoter/PromoterWebsitesView';

export default function AdsWebsitesPage() {
  return (
    <SessionGate>
      <AdsConsoleShell role="promoter" activeNavId="websites">
        <PromoterWebsitesView />
      </AdsConsoleShell>
    </SessionGate>
  );
}
