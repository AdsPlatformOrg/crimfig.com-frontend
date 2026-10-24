'use client';

import { SessionGate } from '../../components/SessionGate';
import { AdsConsoleShell } from '../../components/console/AdsConsoleShell';
import { ConsoleDashboard } from '../../components/console/ConsoleDashboard';
import { useRouter } from 'next/navigation';

export default function AdvertiserOverviewPage() {
  const router = useRouter();

  return (
    <SessionGate>
      <AdsConsoleShell role="advertiser" activeNavId="overview_dash">
        <ConsoleDashboard
          onNavigateToCampaigns={() => router.push('/campaigns')}
          onNavigateToPromoterHub={(section) => router.push(section ? `/promoter/${section}` : '/promoter')}
          onOpenCreateCampaign={() => router.push('/campaigns/new')}
        />
      </AdsConsoleShell>
    </SessionGate>
  );
}
