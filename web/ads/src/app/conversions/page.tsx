'use client';

import { SessionGate } from '../../components/SessionGate';
import { AdsConsole } from '../../components/console/AdsConsole';

export default function AdsConversionsPage() {
  return (
    <SessionGate>
      <AdsConsole initialRole="advertiser" initialAdvertiserTab="conversions" />
    </SessionGate>
  );
}
