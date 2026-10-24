'use client';

import { SessionGate } from '../../components/SessionGate';
import { AdsConsoleShell } from '../../components/console/AdsConsoleShell';
import { ConsoleDashboard } from '../../components/console/ConsoleDashboard';
import { useRouter } from 'next/navigation';

export default function AdsDashboardPage() {
  const router = useRouter();

  return (
    <SessionGate>
      <AdsConsoleShell role="advertiser" activeNavId="overview">
        <ConsoleDashboard
          onNavigateToCampaigns={() => router.push('/campaigns')}
          onNavigateToPromoterHub={(section) => router.push(section ? `/${section}` : '/websites')}
          onOpenCreateCampaign={() => router.push('/campaigns/new')}
        />
      </AdsConsoleShell>
    </SessionGate>
  );
}

