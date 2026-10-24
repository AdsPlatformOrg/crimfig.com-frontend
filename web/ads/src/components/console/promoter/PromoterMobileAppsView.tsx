'use client';

import React, { useState, useEffect } from 'react';
import { Smartphone, Plus, CheckCircle2, Loader2 } from 'lucide-react';
import { apiData } from '../../../lib/api-data';
import { EmptyState } from '../../EmptyState';
import { CardSkeleton } from '../../LoadingStates';

interface PromoterApp {
  id: string;
  appName: string;
  bundleId: string;
  platform: 'ios' | 'android' | 'both';
  isVerified: boolean;
}

export function PromoterMobileAppsView() {
  const [apps, setApps] = useState<PromoterApp[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadApps();
  }, []);

  const loadApps = async () => {
    try {
      setIsLoading(true);
      const res = await apiData<PromoterApp[]>('/api/v1/promoters/apps');
      if (Array.isArray(res)) setApps(res);
    } catch {
      // Keep UI clean
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
          Registered Mobile Applications
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
          Integrate the CrimFig Ads Native SDK into your Android and iOS applications to monetize app traffic.
        </p>
      </div>

      {isLoading ? (
        <CardSkeleton count={2} />
      ) : apps.length === 0 ? (
        <EmptyState
          icon={Smartphone}
          title="No Mobile Apps Registered"
          description="Connect your mobile applications with our React Native or Native SDK to earn revenue from in-app ads."
          actionLabel="+ Register First Mobile App"
          onAction={() => {}}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {apps.map((app) => (
            <div key={app.id} className="theme-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{app.appName}</span>
                <span style={{ fontSize: '11px', color: 'var(--color-success)', fontWeight: 600 }}>Active</span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{app.bundleId}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
