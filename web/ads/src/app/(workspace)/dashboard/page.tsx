'use client';

import { ConsoleDashboard } from '../../../components/console/ConsoleDashboard';
import { useRouter } from 'next/navigation';

export default function AdsDashboardPage() {
  const router = useRouter();

  return (
    <>
      <>
        <ConsoleDashboard
          onNavigateToCampaigns={() => router.push('/campaigns')}
          onNavigateToPromoterHub={(section) => router.push(section ? `/promoter/${section}` : '/promoter')}
          onOpenCreateCampaign={() => router.push('/campaigns/new')}
        />
      </>
    </>
  );
}

