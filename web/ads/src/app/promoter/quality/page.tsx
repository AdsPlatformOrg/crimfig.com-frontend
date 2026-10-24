'use client';

import { SessionGate } from '../../../components/SessionGate';
import { AdsConsoleShell } from '../../../components/console/AdsConsoleShell';
import { PromoterQualityCard } from '../../../components/console/PromoterQualityCard';

export default function PromoterQualityPage() {
  return (
    <SessionGate>
      <AdsConsoleShell role="promoter" activeNavId="quality">
        <PromoterQualityCard apiBase="" />
      </AdsConsoleShell>
    </SessionGate>
  );
}
