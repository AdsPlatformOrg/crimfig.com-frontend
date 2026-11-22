'use client';

import React, { useState, useEffect } from 'react';
import { Share2, Copy, Check } from 'lucide-react';
import { apiData } from '../../../lib/api-data';
import { EmptyState } from '../../EmptyState';
import { CardSkeleton } from '../../LoadingStates';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';

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
  const [error, setError] = useState<string | null>(null);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  useEffect(() => {
    loadPlacements();
  }, []);

  const loadPlacements = async () => {
    try {
      setIsLoading(true); setError(null);
      const result = await apiData<Placement[]>('/api/v1/placements');
      if (!Array.isArray(result)) throw new Error('Invalid links response');
      setPlacements(result);
    } catch {
      setError('Your approved links could not be loaded. Please retry.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(id);
    setTimeout(() => setCopiedToken(null), 2500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <header><h1 className="cf-page-title">Affiliate Links</h1><Badge variant="outline">Coming Soon</Badge><p>New affiliate link issuance is not available yet. Existing approved links remain available below.</p></header>
      {/* Share Links List */}
      <div>
        <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '14px' }}>
          Active Individual Share Links
        </h3>

        {isLoading ? (
          <CardSkeleton count={2} />
        ) : error ? (<div role="alert"><p>{error}</p><Button onClick={loadPlacements}>Retry</Button></div>) : placements.length === 0 ? (
          <EmptyState
            icon={Share2}
            title="No Active Share Campaigns"
            description="You have no approved share links to display. New link issuance is coming soon."
          />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '20px' }}>
            {placements.map((placement) => (
              <div
                key={placement.id}
                className="theme-card"
                style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-crimson)' }}>
                    {placement.campaign?.category || 'General'}
                  </span>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      backgroundColor: 'var(--badge-bg)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    Approved link
                  </span>
                </div>
                <h4 style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text-primary)' }}>
                  {placement.campaign?.title || 'Sponsored Campaign'}
                </h4>
                {placement.campaign?.headline && (
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{placement.campaign.headline}</p>
                )}

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: 'auto' }}>
                  <Input
                    type="text"
                    aria-label={`Share link for ${placement.campaign?.title || "campaign"}`}
                    readOnly
                    value={placement.shareLink}
                    style={{
                      flex: 1, minWidth: 0,
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-page)',
                      fontSize: '12px',
                      color: 'var(--text-secondary)',
                      fontFamily: 'monospace',
                    }}
                  />
                  <Button
                    type="button"
                    onClick={() => handleCopy(placement.shareLink, placement.id)}
                    size="sm"
                  >
                    {copiedToken === placement.id ? <Check style={{ width: 14, height: 14 }} /> : <Copy style={{ width: 14, height: 14 }} />}
                    {copiedToken === placement.id ? 'Copied' : 'Copy'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <section className="theme-card" style={{ padding: 20 }} aria-labelledby="affiliate-rules">
        <h2 id="affiliate-rules" style={{ fontSize: 16 }}>Affiliate &amp; Creator Link Rules</h2>
        <ul style={{ paddingInlineStart: 20, lineHeight: 1.6 }}>
          <li>Share only your approved links with people interested in the offer.</li>
          <li>Fake, automated, repeated or encouraged clicks may be rejected.</li>
          <li>Follow the approved campaign rules and limits. New links and earning schedules require separate approval.</li>
        </ul>
      </section>
    </div>
  );
}
