'use client';

import { SessionGate } from '../../../components/SessionGate';
import { AdsConsoleShell } from '../../../components/console/AdsConsoleShell';
import { PromoterIndividualsView } from '../../../components/console/promoter/PromoterIndividualsView';

export default function PromoterIndividualsPage() {
  return (
    <SessionGate>
      <AdsConsoleShell role="promoter" activeNavId="individuals">
        <PromoterIndividualsView />
      </AdsConsoleShell>
    </SessionGate>
  );
}
