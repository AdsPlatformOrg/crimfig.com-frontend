'use client';

import { SessionGate } from '../../../components/SessionGate';
import { BillingConsole } from '../../../components/console/BillingConsole';

export default function RewardsLeaderboardPage() {
  return (
    <SessionGate>
      <BillingConsole initialTab="rewards" />
    </SessionGate>
  );
}
