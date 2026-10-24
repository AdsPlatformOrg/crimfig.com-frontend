'use client';

import { SessionGate } from '../../components/SessionGate';
import { AdsConsoleShell } from '../../components/console/AdsConsoleShell';
import { HelpSupportHub } from '../../components/console/HelpSupportHub';

export default function AdsSupportPage() {
  return (
    <SessionGate>
      <AdsConsoleShell role="advertiser" activeNavId="support">
        <HelpSupportHub />
      </AdsConsoleShell>
    </SessionGate>
  );
}
