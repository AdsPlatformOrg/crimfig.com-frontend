'use client';

import { SessionGate } from '../../components/SessionGate';
import { AdsConsole } from '../../components/console/AdsConsole';

export default function AdsMarketplacePage() {
  return (
    <SessionGate>
      <AdsConsole initialRole="promoter" initialPromoterSection="marketplace" />
    </SessionGate>
  );
}
