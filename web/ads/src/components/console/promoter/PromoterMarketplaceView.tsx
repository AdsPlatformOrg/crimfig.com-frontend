'use client';

import React, { useState, useEffect } from 'react';
import { Layers, Check, Loader2 } from 'lucide-react';
import { apiData } from '../../../lib/api-data';
import { EmptyState } from '../../EmptyState';
import { CardSkeleton } from '../../LoadingStates';
import { FeedCardItem } from '../../templates/FeedCardItem';

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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filtered.map((camp) => (
            <FeedCardItem
              key={camp.id}
              id={camp.id}
              author={{
                name: camp.category + ' Sponsor Network',
                subtitle: `Verified Brand • ${camp.format.toUpperCase()} Placement`,
                roleBadge: '55% RevShare',
              }}
              title={camp.title}
              content={
                <div>
                  {camp.headline && (
                    <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: 'var(--text-secondary)' }}>
                      {camp.headline}
                    </p>
                  )}
                  <div
                    style={{
                      padding: '12px 16px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '12px',
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Settlement Window</span>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>72h Clearance Hold</span>
                    </div>

                    <button
                      type="button"
                      disabled={pendingWrites.has(camp.id) || appliedIds.has(camp.id)}
                      onClick={() => handleApply(camp.id)}
                      style={{
                        padding: '8px 18px',
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
                      {appliedIds.has(camp.id) ? '✓ Placement Active' : pendingWrites.has(camp.id) ? 'Activating...' : 'Apply for Ad Placement'}
                    </button>
                  </div>
                </div>
              }
              tags={[camp.category.toLowerCase(), camp.format.toLowerCase(), 'revshare']}
              metrics={{
                likes: 24,
                replies: 5,
                views: '1.8k',
                shares: 12,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
