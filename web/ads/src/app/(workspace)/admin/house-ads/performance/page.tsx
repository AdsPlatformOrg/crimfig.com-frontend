import React from 'react';
import { ProtectedWorkspace } from '@/components/ProtectedWorkspace';
import { AdminHouseAdsView } from '@/components/console/AdminHouseAdsView';

export const metadata = {
  title: 'House Ads Performance & Inventory | CrimFig Platform Admin',
};

export default function AdminHouseAdsPerformancePage() {
  return (
    <ProtectedWorkspace>
      <AdminHouseAdsView />
    </ProtectedWorkspace>
  );
}

