'use client';

import { CampaignCreationWizard } from '../../../../components/console/CampaignCreationWizard';
import { useRouter } from 'next/navigation';

export default function AdsNewCampaignPage() {
  const router = useRouter();

  return (
    <>
      <>
        <CampaignCreationWizard
          onCancel={() => router.push('/campaigns')}
          onSuccess={() => router.push('/campaigns')}
        />
      </>
    </>
  );
}
