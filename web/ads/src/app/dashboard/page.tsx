'use client';

import { SessionGate } from '../../components/SessionGate';
import { ThreeColumnSocialDashboardTemplate, defaultPrimaryNav } from '../../components/templates/ThreeColumnSocialDashboardTemplate';
import { ConsoleDashboard } from '../../components/console/ConsoleDashboard';
import { useRouter } from 'next/navigation';

export default function AdsDashboardPage() {
  const router = useRouter();

  return (
    <SessionGate>
      <ThreeColumnSocialDashboardTemplate
        headerProps={{
          appName: 'Advertiser Studio',
          searchPlaceholder: 'Search campaigns, creatives, or metrics...',
          primaryAction: {
            label: 'New Campaign',
            href: '/campaigns/new',
          },
        }}
        activeNavId="home"
        primaryNav={defaultPrimaryNav}
        tabs={[
          { id: 'overview', label: 'Console Overview' },
          { id: 'recent', label: 'Campaigns & Deals' },
        ]}
      >
        <ConsoleDashboard
          onNavigateToCampaigns={() => router.push('/campaigns')}
          onNavigateToPromoterHub={(section) => router.push(section ? `/${section}` : '/websites')}
          onOpenCreateCampaign={() => router.push('/campaigns/new')}
        />
      </ThreeColumnSocialDashboardTemplate>
    </SessionGate>
  );
}

