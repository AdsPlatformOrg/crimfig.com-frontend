'use client';

import { ReadinessOperations, StaffCampaignLookup } from '../../../../../components/console/DeliveryReadinessPanel';

export default function AdminCampaignReadinessPage() {
  return (
    <section className="cf-moderation" aria-label="Campaign delivery readiness">
      <header>
        <p className="cf-mod-eyebrow">Advertising operations</p>
        <h1>Campaign Readiness</h1>
        <p>Look up any campaign to see which paid-delivery checks pass, who owns each blocker and when it was observed.</p>
      </header>
      <StaffCampaignLookup />
      <ReadinessOperations />
    </section>
  );
}
