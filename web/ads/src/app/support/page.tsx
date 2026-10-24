'use client';

import { SessionGate } from '../../components/SessionGate';
import { AdsConsole } from '../../components/console/AdsConsole';

export default function AdsSupportPage() {
  return (
    <SessionGate>
      <AdsConsole initialRole="advertiser" initialAdvertiserTab="support" />
    </SessionGate>
  );
}
