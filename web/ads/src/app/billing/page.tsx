'use client';

import { SessionGate } from '../../components/SessionGate';
import { AdsConsole } from '../../components/console/AdsConsole';

export default function AdsBillingPage() {
  return (
    <SessionGate>
      <AdsConsole initialRole="advertiser" initialAdvertiserTab="billing" />
    </SessionGate>
  );
}
