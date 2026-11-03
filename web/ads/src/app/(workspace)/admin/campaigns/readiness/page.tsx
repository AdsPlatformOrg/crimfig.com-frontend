'use client';

import { StaffCampaignsDataTable } from '../../../../../components/console/StaffCampaignsDataTable';
import { ReadinessOperations } from '../../../../../components/console/DeliveryReadinessPanel';

export default function AdminCampaignReadinessPage() {
  return (
    <section className="cf-moderation" aria-label="Campaign delivery readiness">
      <header>
        <p className="cf-mod-eyebrow">Advertising operations</p>
        <h1>Campaign Readiness</h1>
        <p>
          Inspect paid-delivery checks and blocker ownership across all active and pending advertiser campaigns.
        </p>
      </header>

      {/* Paginated Staff Campaigns Data Table */}
      <StaffCampaignsDataTable />

      {/* Global operations health snapshot */}
      <div style={{ marginTop: '40px' }}>
        <ReadinessOperations />
      </div>
    </section>
  );
}
