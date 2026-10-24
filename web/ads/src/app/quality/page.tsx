'use client';

import { SessionGate } from '../../components/SessionGate';
import { AdsConsole } from '../../components/console/AdsConsole';

export default function AdsQualityPage() {
  return (
    <SessionGate>
      <AdsConsole initialRole="promoter" initialPromoterSection="quality" />
    </SessionGate>
  );
}
