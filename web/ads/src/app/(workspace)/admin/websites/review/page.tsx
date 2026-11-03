'use client';

import { StaffWebsitesDataTable } from '@/components/console/StaffWebsitesDataTable';
import { ReadinessOperations } from '@/components/console/DeliveryReadinessPanel';

export default function AdminWebsitesReviewPage() {
  return (
    <section className="cf-moderation" aria-label="Promoter website review directory">
      <header>
        <p className="cf-mod-eyebrow">Advertising operations</p>
        <h1>Website Approvals</h1>
        <p>
          Inspect registered promoter websites, verify domain ownership records, and manage suitability policy decisions to unblock paid ad delivery.
        </p>
      </header>

      {/* Paginated Staff Websites Data Table */}
      <StaffWebsitesDataTable />

      {/* Global operations health snapshot */}
      <div style={{ marginTop: '40px' }}>
        <ReadinessOperations />
      </div>
    </section>
  );
}
