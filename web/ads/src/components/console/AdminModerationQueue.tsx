'use client';
import { MediaPreview } from '../MediaPreview';
import { sessionFetch } from '../../lib/session';

import React, { useCallback, useEffect, useState } from 'react';
import { ShieldCheck, CheckCircle2, XCircle, AlertCircle, RefreshCw, Eye, ExternalLink, Filter } from 'lucide-react';

interface PendingCampaign {
  id: string;
  advertiserId: string;
  title: string;
  status: string;
  pricingModel: string;
  budgetUsdCents: number;
  createdAt: string;
}

interface PendingCreative {
  id: string;
  campaignId: string;
  headline: string;
  bodyText: string;
  ctaText: string;
  imageUrl?: string;
  videoUrl?: string;
  destinationUrl: string;
  mediaFormat: string;
  adFormat?: string;
  reviewStatus: string;
  createdAt: string;
}

interface ModerationQueue {
  campaigns: PendingCampaign[];
  creatives: PendingCreative[];
  totalPending: number;
}

interface AdminModerationQueueProps {
  apiBase: string;
}

export function AdminModerationQueue({ apiBase }: AdminModerationQueueProps) {
  const [queue, setQueue] = useState<ModerationQueue | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'creatives' | 'campaigns'>('creatives');
  const [decisionNote, setDecisionNote] = useState<{ [id: string]: string }>({});
  const [decisionReason, setDecisionReason] = useState<{ [id: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState<{ [id: string]: boolean }>({});

  const [reviewStage, setReviewStage] = useState<'reviewer' | 'manager'>('reviewer');

  const fetchQueue = useCallback(async () => {
    setIsLoading(true); setError(null);
    try {
      const res = await sessionFetch(`${apiBase}/api/v1/admin/ads/moderation/queue?stage=${reviewStage}`);
      if (!res.ok) throw new Error(res.status === 403 ? 'You do not have permission to view this queue.' : 'Moderation queue unavailable.');
      const json = await res.json();
      if (!Array.isArray(json.data?.campaigns) || !Array.isArray(json.data?.creatives)) throw new Error('Invalid moderation queue response.');
      setQueue(json.data);
    } catch (err) {
      setQueue(null); setError(err instanceof Error ? err.message : 'Moderation queue unavailable.');
    } finally { setIsLoading(false); }
  }, [apiBase, reviewStage]);

  useEffect(() => { void fetchQueue(); }, [fetchQueue]);

  const handleCreativeDecision = async (id: string, decision: 'approved' | 'rejected') => {
    setIsSubmitting((prev) => ({ ...prev, [id]: true }));
    try {
      const res = await sessionFetch(`${apiBase}/api/v1/admin/ads/moderation/creatives/${id}/decision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decision,
          reasonCode: decision === 'rejected' ? (decisionReason[id] || 'POLICY_VIOLATION') : undefined,
          note: decisionNote[id] || '',
        }),
      });
      if (res.ok) {
        setQueue((prev) =>
          prev
            ? {
                ...prev,
                creatives: prev.creatives.filter((c) => c.id !== id),
                totalPending: Math.max(0, prev.totalPending - 1),
              }
            : null,
        );
      } else {
        setActionMessage('Action failed. Please verify admin permissions.');
      }
    } catch (e) {
      setActionMessage('Network error communicating with moderation API.');
    } finally {
      setIsSubmitting((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleCampaignDecision = async (id: string, decision: 'approved' | 'rejected') => {
    setIsSubmitting((prev) => ({ ...prev, [id]: true }));
    try {
      const endpoint =
        reviewStage === 'reviewer'
          ? `${apiBase}/api/v1/admin/ads/moderation/campaigns/${id}/primary-review`
          : `${apiBase}/api/v1/admin/ads/moderation/campaigns/${id}/manager-approval`;

      const res = await sessionFetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decision,
          reasonCode: decision === 'rejected' ? (decisionReason[id] || 'BUDGET_OR_TARGETING_ISSUE') : undefined,
          note: decisionNote[id] || '',
        }),
      });
      if (res.ok) {
        setQueue((prev) =>
          prev
            ? {
                ...prev,
                campaigns: prev.campaigns.filter((c) => c.id !== id),
                totalPending: Math.max(0, prev.totalPending - 1),
              }
            : null,
        );
      } else {
        const errorJson = await res.json().catch(() => null);
        setActionMessage(errorJson?.message || 'Action failed. Please verify admin permissions.');
      }
    } catch (e) {
      setActionMessage('Network error communicating with moderation API.');
    } finally {
      setIsSubmitting((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleEmergencyOverride = async (id: string) => {
    const reason = window.prompt(
      'SUPER ADMIN EMERGENCY OVERRIDE:\nEnter a mandatory, documented justification for overriding the dual-reviewer workflow (min 10 chars):'
    );
    if (!reason || reason.trim().length < 10) {
      setActionMessage('Override cancelled: A valid documented reason (at least 10 characters) is required for immutable audit logging.');
      return;
    }

    setIsSubmitting((prev) => ({ ...prev, [id]: true }));
    try {
      const res = await sessionFetch(`${apiBase}/api/v1/admin/ads/moderation/campaigns/${id}/emergency-override`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          overrideReason: reason.trim(),
          decision: 'approved',
        }),
      });
      if (res.ok) {
        setActionMessage('Campaign emergency override successful. Status set to Approved with audit trail.');
        setQueue((prev) =>
          prev
            ? {
                ...prev,
                campaigns: prev.campaigns.filter((c) => c.id !== id),
                totalPending: Math.max(0, prev.totalPending - 1),
              }
            : null,
        );
      } else {
        const errorJson = await res.json().catch(() => null);
        setActionMessage(errorJson?.message || 'Emergency override failed. Ensure you have super_admin privileges.');
      }
    } catch (e) {
      setActionMessage('Network error communicating with moderation API.');
    } finally {
      setIsSubmitting((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {error && <p role="alert">{error}</p>}
      {actionMessage && <div role="status" style={{ padding: 16, borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-primary)', overflowWrap: 'anywhere' }}>{actionMessage} <button type="button" onClick={() => setActionMessage(null)} style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--bg-page)', color: 'var(--text-primary)' }}>Dismiss</button></div>}
      {/* Header bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-crimson)', letterSpacing: '0.05em' }}>
            Compliance &amp; Moderation
          </span>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
            {error ? 'Review Queue Unavailable' : isLoading ? 'Loading review queue' : `Review Queue (${queue?.totalPending ?? 0} Pending)`}
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', maxWidth: '100%' }}>
          <button
            type="button"
            onClick={() => setActiveTab('creatives')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '13px',
              backgroundColor: activeTab === 'creatives' ? 'var(--color-crimson)' : 'var(--bg-surface)',
              color: activeTab === 'creatives' ? '#FFFFFF' : 'var(--text-secondary)',
            }}
          >
            Creative Assets ({error ? '—' : queue?.creatives.length ?? 0})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('campaigns')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '13px',
              backgroundColor: activeTab === 'campaigns' ? 'var(--color-crimson)' : 'var(--bg-surface)',
              color: activeTab === 'campaigns' ? '#FFFFFF' : 'var(--text-secondary)',
            }}
          >
            Campaigns ({error ? '—' : queue?.campaigns.length ?? 0})
          </button>
          {activeTab === 'campaigns' && (
            <div style={{ display: 'inline-flex', flexWrap: 'wrap', padding: '2px', backgroundColor: 'var(--badge-bg)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <button
                type="button"
                onClick={() => setReviewStage('reviewer')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontWeight: 700,
                  backgroundColor: reviewStage === 'reviewer' ? 'var(--color-fig-dark)' : 'transparent',
                  color: reviewStage === 'reviewer' ? '#FFFFFF' : 'var(--text-secondary)',
                }}
              >
                Tier-1: Reviewer
              </button>
              <button
                type="button"
                onClick={() => setReviewStage('manager')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontWeight: 700,
                  backgroundColor: reviewStage === 'manager' ? 'var(--color-fig-dark)' : 'transparent',
                  color: reviewStage === 'manager' ? '#FFFFFF' : 'var(--text-secondary)',
                }}
              >
                Tier-2: Manager Approval
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={fetchQueue}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            <RefreshCw style={{ width: 14, height: 14 }} />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="theme-card" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading pending submissions...
        </div>
      ) : activeTab === 'creatives' ? (
        queue?.creatives.length === 0 ? (
          <div className="theme-card" style={{ padding: '48px 24px', textAlign: 'center' }}>
            <CheckCircle2 style={{ width: 40, height: 40, color: '#10B981', margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>Creative Queue Clear</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
              All submitted advertiser headlines, copies, and media assets have been moderated.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {queue?.creatives.map((crt) => (
              <div
                key={crt.id}
                className="theme-card"
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  borderLeft: '4px solid var(--color-crimson)',
                }}
              >
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
                  <div style={{ maxWidth: '640px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Format: {crt.mediaFormat} · ID: {crt.id.slice(0, 8)}...
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
                      {crt.headline}
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      {crt.bodyText}
                    </p>
                    {(crt.imageUrl || crt.videoUrl) && <MediaPreview source={(crt.videoUrl || crt.imageUrl)!} mode="review" />}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', fontSize: '12px', color: 'var(--color-crimson)' }}>
                      <span>CTA: {crt.ctaText}</span>
                      <span>·</span>
                      <a href={crt.destinationUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span>Destination</span>
                        <ExternalLink style={{ width: 12, height: 12 }} />
                      </a>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '220px' }}>
                    <select
                      value={decisionReason[crt.id] || ''}
                      onChange={(e) => setDecisionReason({ ...decisionReason, [crt.id]: e.target.value })}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid var(--border-subtle)',
                        backgroundColor: 'var(--bg-page)',
                        fontSize: '12px',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <option value="">Select rejection reason (if rejecting)...</option>
                      <option value="MISLEADING">Misleading / Clickbait Claims</option>
                      <option value="PROHIBITED">Prohibited Financial / Gambling Products</option>
                      <option value="BROKEN_URL">Destination URL Unreachable (404/500)</option>
                      <option value="LOW_QUALITY">Low Resolution / Distorted Media</option>
                      <option value="TRADEMARK">Unverified Trademark / Impersonation</option>
                    </select>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        disabled={isSubmitting[crt.id]}
                        onClick={() => handleCreativeDecision(crt.id, 'approved')}
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          borderRadius: '6px',
                          border: 'none',
                          backgroundColor: '#10B981',
                          color: '#FFFFFF',
                          fontWeight: 600,
                          fontSize: '12px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                        }}
                      >
                        <CheckCircle2 style={{ width: 14, height: 14 }} />
                        Approve
                      </button>
                      <button
                        type="button"
                        disabled={isSubmitting[crt.id]}
                        onClick={() => handleCreativeDecision(crt.id, 'rejected')}
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          borderRadius: '6px',
                          border: 'none',
                          backgroundColor: 'var(--color-crimson)',
                          color: '#FFFFFF',
                          fontWeight: 600,
                          fontSize: '12px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                        }}
                      >
                        <XCircle style={{ width: 14, height: 14 }} />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        queue?.campaigns.length === 0 ? (
          <div className="theme-card" style={{ padding: '48px 24px', textAlign: 'center' }}>
            <CheckCircle2 style={{ width: 40, height: 40, color: '#10B981', margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>Campaign Queue Clear</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
              No campaigns currently waiting for administrative review.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {queue?.campaigns.map((camp) => (
              <div
                key={camp.id}
                className="theme-card"
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                }}
              >
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Model: {camp.pricingModel.toUpperCase()} · Budget: ${(camp.budgetUsdCents / 100).toFixed(2)}
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
                    {camp.title}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    disabled={isSubmitting[camp.id]}
                    onClick={() => handleCampaignDecision(camp.id, 'approved')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: '#10B981',
                      color: '#FFFFFF',
                      fontWeight: 600,
                      fontSize: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    {reviewStage === 'reviewer' ? 'Approve & Pass to Manager' : 'Approve Campaign'}
                  </button>
                  <button
                    type="button"
                    disabled={isSubmitting[camp.id]}
                    onClick={() => handleCampaignDecision(camp.id, 'rejected')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: 'var(--color-crimson)',
                      color: '#FFFFFF',
                      fontWeight: 600,
                      fontSize: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    title="Super Admin Emergency Override: Requires mandatory justification audit entry"
                    disabled={isSubmitting[camp.id]}
                    onClick={() => handleEmergencyOverride(camp.id)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-surface)',
                      color: 'var(--text-muted)',
                      fontWeight: 600,
                      fontSize: '11px',
                      cursor: 'pointer',
                    }}
                  >
                    Emergency Override
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
