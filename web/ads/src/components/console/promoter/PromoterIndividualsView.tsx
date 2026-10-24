'use client';

import React, { useState, useEffect } from 'react';
import { Share2, Video, Copy, Check, Loader2 } from 'lucide-react';
import { apiData } from '../../../lib/api-data';
import { EmptyState } from '../../EmptyState';
import { CardSkeleton } from '../../LoadingStates';

interface Placement {
  id: string;
  shareLink: string;
  campaign: {
    id: string;
    title: string;
    category: string;
    headline?: string;
  };
}

export function PromoterIndividualsView() {
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reelsConsent, setReelsConsent] = useState(false);
  const [pendingConsent, setPendingConsent] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  useEffect(() => {
    loadPlacementsAndConsent();
  }, []);

  const loadPlacementsAndConsent = async () => {
    try {
      setIsLoading(true);
      const [consentRes, placementsRes] = await Promise.allSettled([
        apiData<{ consentGiven: boolean }>('/api/v1/promoters/reels-consent'),
        apiData<Placement[]>('/api/v1/placements'),
      ]);

      if (consentRes.status === 'fulfilled' && consentRes.value) {
        setReelsConsent(Boolean(consentRes.value.consentGiven));
      }
      if (placementsRes.status === 'fulfilled' && Array.isArray(placementsRes.value)) {
        setPlacements(placementsRes.value);
      }
    } catch {
      // Keep UI clean
    } finally {
      setIsLoading(false);
    }
  };

  const toggleReelsConsent = async () => {
    try {
      setPendingConsent(true);
      const newConsent = !reelsConsent;
      await apiData('/api/v1/promoters/reels-consent', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ consent: newConsent }),
      });
      setReelsConsent(newConsent);
    } catch {
      // Error handling
    } finally {
      setPendingConsent(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(id);
    setTimeout(() => setCopiedToken(null), 2500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Reels Sync Card */}
      <div className="theme-card" style={{ padding: '24px', background: 'var(--bg-surface)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: 'var(--badge-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-crimson)',
              }}
            >
              <Video style={{ width: 24, height: 24 }} />
            </div>
            <div>
              <h4 style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text-primary)' }}>CrimFig Reels Social Sync</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Auto-publish sponsored promotional cards directly to your verified CrimFig Reels profile.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={toggleReelsConsent}
            disabled={pendingConsent}
            style={{
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '12px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: reelsConsent ? 'var(--color-success-bg)' : 'var(--badge-bg)',
              color: reelsConsent ? 'var(--color-success)' : 'var(--text-muted)',
            }}
          >
            {pendingConsent ? 'Saving...' : reelsConsent ? '✓ Reels Sync Enabled' : 'Reels Sync Off'}
          </button>
        </div>
      </div>

      {/* Share Links List */}
      <div>
        <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '14px' }}>
          Active Individual Share Links
        </h3>

        {isLoading ? (
          <CardSkeleton count={2} />
        ) : placements.length === 0 ? (
          <EmptyState
            icon={Share2}
            title="No Active Share Campaigns"
            description="There are currently no active ad campaigns accepting individual promoters. Check back soon or browse the marketplace."
          />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {placements.map((placement) => (
              <div
                key={placement.id}
                className="theme-card"
                style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-crimson)' }}>
                    {placement.campaign?.category || 'General'}
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      backgroundColor: 'var(--badge-bg)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    Verified settlement
                  </span>
                </div>
                <h4 style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text-primary)' }}>
                  {placement.campaign?.title || 'Sponsored Campaign'}
                </h4>
                {placement.campaign?.headline && (
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{placement.campaign.headline}</p>
                )}

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: 'auto' }}>
                  <input
                    type="text"
                    readOnly
                    value={placement.shareLink}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-page)',
                      fontSize: '12px',
                      color: 'var(--text-secondary)',
                      fontFamily: 'monospace',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleCopy(placement.shareLink, placement.id)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '6px',
                      backgroundColor: 'var(--color-crimson)',
                      color: '#FFFFFF',
                      border: 'none',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    {copiedToken === placement.id ? <Check style={{ width: 14, height: 14 }} /> : <Copy style={{ width: 14, height: 14 }} />}
                    {copiedToken === placement.id ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
