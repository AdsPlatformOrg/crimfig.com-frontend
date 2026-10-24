'use client';

import { SessionGate } from '../../components/SessionGate';
import { AdsConsole } from '../../components/console/AdsConsole';

export default function AdsCampaignsPage() {
  return (
    <SessionGate>
      <AdsConsole initialRole="advertiser" initialAdvertiserTab="campaigns" />
    </SessionGate>
  );
}
