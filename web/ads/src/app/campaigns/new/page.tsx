'use client';

import { SessionGate } from '../../../components/SessionGate';
import { AdsConsole } from '../../../components/console/AdsConsole';

export default function AdsNewCampaignPage() {
  return (
    <SessionGate>
      <AdsConsole initialRole="advertiser" initialAdvertiserTab="new_campaign" />
    </SessionGate>
  );
}
