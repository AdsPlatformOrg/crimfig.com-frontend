'use client';

import { SessionGate } from '../../../components/SessionGate';
import { AdsConsoleShell } from '../../../components/console/AdsConsoleShell';
import { CampaignCreationWizard } from '../../../components/console/CampaignCreationWizard';
import { useRouter } from 'next/navigation';

export default function AdsNewCampaignPage() {
  const router = useRouter();

  return (
    <SessionGate>
      <AdsConsoleShell role="advertiser" activeNavId="new_campaign">
        <CampaignCreationWizard
          onCancel={() => router.push('/campaigns')}
          onSuccess={() => router.push('/campaigns')}
        />
      </AdsConsoleShell>
    </SessionGate>
  );
}
