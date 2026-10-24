'use client';

import { SessionGate } from '../../components/SessionGate';
import { AdsConsole } from '../../components/console/AdsConsole';

export default function AdsIndividualsPage() {
  return (
    <SessionGate>
      <AdsConsole initialRole="promoter" initialPromoterSection="individuals" />
    </SessionGate>
  );
}
