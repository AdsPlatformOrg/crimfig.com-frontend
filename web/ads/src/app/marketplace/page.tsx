'use client';

import { SessionGate } from '../../components/SessionGate';
import { ThreeColumnSocialDashboardTemplate, defaultPrimaryNav } from '../../components/templates/ThreeColumnSocialDashboardTemplate';
import { PromoterMarketplaceView } from '../../components/console/promoter/PromoterMarketplaceView';

export default function AdsMarketplacePage() {
  return (
    <SessionGate>
      <ThreeColumnSocialDashboardTemplate
        headerProps={{
          appName: 'Marketplace',
          searchPlaceholder: 'Search placement opportunities & campaigns...',
          primaryAction: {
            label: 'Register Ad Slot',
            href: '/websites',
          },
        }}
        activeNavId="popular"
        primaryNav={defaultPrimaryNav}
        tabs={[
          { id: 'all', label: 'All Opportunities' },
          { id: 'featured', label: 'Featured Deals' },
          { id: 'high-yield', label: 'High Yield' },
        ]}
      >
        <PromoterMarketplaceView />
      </ThreeColumnSocialDashboardTemplate>
    </SessionGate>
  );
}

