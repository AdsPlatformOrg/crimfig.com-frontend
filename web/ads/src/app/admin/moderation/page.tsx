'use client';

import { SessionGate } from '../../../components/SessionGate';
import { AdsConsole } from '../../../components/console/AdsConsole';

export default function AdsAdminModerationPage() {
  return (
    <SessionGate>
      <AdsConsole initialRole="admin" initialAdminTab="moderation" />
    </SessionGate>
  );
}
