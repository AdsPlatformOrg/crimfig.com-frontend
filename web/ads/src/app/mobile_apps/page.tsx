'use client';

import { SessionGate } from '../../components/SessionGate';
import { AdsConsole } from '../../components/console/AdsConsole';

export default function AdsMobileAppsPage() {
  return (
    <SessionGate>
      <AdsConsole initialRole="promoter" initialPromoterSection="mobile_apps" />
    </SessionGate>
  );
}
