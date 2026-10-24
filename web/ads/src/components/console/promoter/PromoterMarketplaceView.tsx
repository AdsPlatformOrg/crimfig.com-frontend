'use client';

import React, { useState, useEffect } from 'react';
import { Layers, Check, Loader2 } from 'lucide-react';
import { apiData } from '../../../lib/api-data';
import { EmptyState } from '../../EmptyState';
import { CardSkeleton } from '../../LoadingStates';

interface CampaignItem {
  id: string;
  title: string;
  category: string;
  headline?: string;
  format: string;
}

export function PromoterMarketplaceView() {
  const [catalog, setCatalog] = useState<CampaignItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [pendingWrites, setPendingWrites] = useState<Set<string>>(new Set());
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());

  const categories = ['All', 'Technology', 'Finance', 'Lifestyle', 'E-commerce', 'Entertainment'];

  useEffect(() => {
    loadCatalog();
  }, []);

  const loadCatalog = async () => {
    try {
      setIsLoading(true);
      const res = await apiData<CampaignItem[]>('/api/v1/campaigns/catalog');
      if (Array.isArray(res)) setCatalog(res);
    } catch {
      // Keep UI clean
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = async (campaignId: string) => {
    if (pendingWrites.has(campaignId) || appliedIds.has(campaignId)) return;
    setPendingWrites((prev) => new Set(prev).add(campaignId));
    try {
      await apiData('/api/v1/placements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignId }),
      });
      setAppliedIds((prev) => new Set(prev).add(campaignId));
    } catch {
      // Error handling
    } finally {
      setPendingWrites((prev) => {
        const next = new Set(prev);
        next.delete(campaignId);
        return next;
      });
    }
  };

  const filtered = selectedCategory === 'All' ? catalog : catalog.filter((c) => c.category === selectedCategory);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Campaign Marketplace
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
            Browse active sponsor campaigns and apply to display ads on your channels.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: selectedCategory === cat ? 'var(--color-crimson)' : 'var(--badge-bg)',
                color: selectedCategory === cat ? '#FFFFFF' : 'var(--text-secondary)',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <CardSkeleton count={2} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No Campaigns Found"
          description="There are currently no campaigns matching the selected category. Check back soon or browse all categories."
          actionLabel="View All Categories"
          onAction={() => setSelectedCategory('All')}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {filtered.map((camp) => (
            <div
              key={camp.id}
              className="theme-card"
              style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '16px',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-crimson)', textTransform: 'uppercase' }}>
                    {camp.category}
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      backgroundColor: 'var(--badge-bg)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {camp.format?.toUpperCase() || 'CARD'}
                  </span>
                </div>
                <h4 style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text-primary)', marginTop: '8px' }}>
                  {camp.title}
                </h4>
                {camp.headline && (
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>{camp.headline}</p>
                )}

                <div
                  style={{
                    marginTop: '16px',
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-page)',
                    border: '1px solid var(--border-subtle)',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '8px',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Promoter Share</span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-success)' }}>55% Net Revenue</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Settlement</span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>72h Verified Hold</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                disabled={pendingWrites.has(camp.id) || appliedIds.has(camp.id)}
                onClick={() => handleApply(camp.id)}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: appliedIds.has(camp.id) ? 'var(--color-success)' : 'var(--color-crimson)',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 600,
                  borderRadius: '8px',
                  border: 'none',
                  cursor: appliedIds.has(camp.id) ? 'default' : 'pointer',
                  boxShadow: appliedIds.has(camp.id) ? 'none' : 'var(--shadow-crimson)',
                }}
              >
                {appliedIds.has(camp.id) ? '✓ Applied' : pendingWrites.has(camp.id) ? 'Applying...' : 'Apply to Promote'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
