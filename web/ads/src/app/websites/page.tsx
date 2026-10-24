'use client';

import { SessionGate } from '../../components/SessionGate';
import { AdsConsole } from '../../components/console/AdsConsole';

export default function AdsWebsitesPage() {
  return (
    <SessionGate>
      <AdsConsole initialRole="promoter" initialPromoterSection="websites" />
    </SessionGate>
  );
}
