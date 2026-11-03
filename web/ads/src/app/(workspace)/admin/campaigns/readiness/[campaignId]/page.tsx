'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CampaignReadiness } from '../../../../../../components/console/DeliveryReadinessPanel';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink, ShieldCheck } from 'lucide-react';

export default function AdminCampaignReadinessDetailPage({
  params,
}: {
  params: Promise<{ campaignId: string }>;
}) {
  const router = useRouter();
  const { campaignId } = use(params);

  return (
    <section className="cf-moderation" aria-label="Campaign readiness inspection">
      <header style={{ marginBottom: '24px' }}>
        <div style={{ marginBottom: '12px' }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              paddingLeft: 0,
              color: 'var(--text-secondary, #475569)',
              fontWeight: 500,
            }}
          >
            <ArrowLeft style={{ width: 16, height: 16 }} />
            Back to Campaigns Readiness Table
          </Button>
        </div>

        <p className="cf-mod-eyebrow">Advertising operations · Deep Readiness Inspection</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div>
            <h1 style={{ margin: '4px 0' }}>Campaign Readiness Details</h1>
            <p style={{ margin: 0, color: 'var(--text-muted, #64748B)', fontFamily: 'monospace', fontSize: '13px' }}>
              Target UUID: {campaignId}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link
              href={`/admin/auction-logs?search=${encodeURIComponent(campaignId)}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--text-primary, #0F172A)',
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid var(--border-subtle, #CBD5E1)',
                backgroundColor: 'var(--bg-surface, #FFFFFF)',
                textDecoration: 'none',
              }}
            >
              <span>Inspect Auction Logs</span>
            </Link>
            <Link
              href={`/campaigns/${campaignId}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--color-crimson, #D4143A)',
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid var(--border-subtle, #E2E8F0)',
                backgroundColor: 'var(--bg-surface, #F8FAFC)',
                textDecoration: 'none',
              }}
            >
              <span>View Campaign Stacks</span>
              <ExternalLink style={{ width: 12, height: 12 }} />
            </Link>
          </div>
        </div>
      </header>

      {/* Authoritative Staff Readiness Panel */}
      <div style={{ marginTop: '20px' }}>
        <CampaignReadiness campaignId={campaignId} staff={true} />
      </div>
    </section>
  );
}
