'use client';

import { AdminGuard } from '../../../../components/AdminGuard';
import { HelpSupportHub } from '../../../../components/console/HelpSupportHub';

export default function AdsAdminSupportPage() {
  return (
    <AdminGuard>
      <HelpSupportHub admin />
    </AdminGuard>
  );
}
