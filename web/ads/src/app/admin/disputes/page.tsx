'use client';

import { SessionGate } from '../../../components/SessionGate';
import { AdsConsole } from '../../../components/console/AdsConsole';

export default function AdsAdminDisputesPage() {
  return (
    <SessionGate>
      <AdsConsole initialRole="admin" initialAdminTab="disputes" />
    </SessionGate>
  );
}
