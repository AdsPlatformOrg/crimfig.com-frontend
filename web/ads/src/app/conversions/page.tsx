'use client';

import { SessionGate } from '../../components/SessionGate';
import { AdsConsoleShell } from '../../components/console/AdsConsoleShell';
import { ConversionsTab } from '../../components/console/conversions/ConversionsTab';

export default function AdsConversionsPage() {
  return (
    <SessionGate>
      <AdsConsoleShell role="advertiser" activeNavId="conversions">
        <ConversionsTab />
      </AdsConsoleShell>
    </SessionGate>
  );
}
