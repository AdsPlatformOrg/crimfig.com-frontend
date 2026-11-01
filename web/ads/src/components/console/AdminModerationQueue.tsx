'use client';

import { MediaPreview } from '../MediaPreview';
import { sessionFetch } from '../../lib/session';
import { adsApi } from '../../lib/ads-api-client';
import { ApiError } from '@crimfig/api-client';
import { Button } from '../ui/button';
import { ModerationReviewDialog } from './ModerationReviewDialog';

import React, { useCallback, useEffect, useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Layers,
  FileImage,
  Tv,
} from 'lucide-react';

type ModerationQueue = Awaited<ReturnType<ReturnType<typeof adsApi>['queue']>>;

interface AdminModerationQueueProps {
  apiBase: string;
}

export function AdminModerationQueue({ apiBase }: AdminModerationQueueProps) {
  const [queue, setQueue] = useState<ModerationQueue | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isForbidden, setIsForbidden] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'campaigns' | 'stacks' | 'creatives'>('campaigns');

  const [roles, setRoles] = useState<string[]>([]);
  const isPlatformAdmin = roles.includes('super_admin');
  const canReview = isPlatformAdmin || roles.includes('ads_reviewer') || roles.includes('ads_admin');
  const canManage = isPlatformAdmin || roles.includes('ads_manager') || roles.includes('ads_admin');

  const [reviewStage, setReviewStage] = useState<'reviewer' | 'manager'>('reviewer');

  // Modal dialog state
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    targetType: 'campaign' | 'stack' | 'creative';
    targetTitle: string;
    stage: 'reviewer' | 'manager';
    item: any;
  }>({
    isOpen: false,
    targetType: 'campaign',
    targetTitle: '',
    stage: 'reviewer',
    item: null,
  });

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    setRoles([]);
    void sessionFetch(`${apiBase}/api/v1/ecosystem/staff-status`, { signal: controller.signal })
      .then(async (response) => (response.ok ? response.json() : null))
      .then((body) => {
        if (active && body?.data?.isStaff === true && Array.isArray(body.data.roles)) {
          setRoles(body.data.roles.filter((role: unknown): role is string => typeof role === 'string'));
        }
      })
      .catch(() => {
        if (active) setRoles([]);
      });
    return () => {
      active = false;
      controller.abort();
    };
  }, [apiBase]);

  const fetchQueue = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setIsForbidden(false);
    try {
      const next = await adsApi().queue(reviewStage);
      setQueue(next);
    } catch (err) {
      if (err instanceof ApiError && err.status === 403) setIsForbidden(true);
      setQueue(null);
      setError(err instanceof Error ? err.message : 'Moderation queue unavailable.');
    } finally {
      setIsLoading(false);
    }
  }, [apiBase, reviewStage]);

  useEffect(() => {
    void fetchQueue();
  }, [fetchQueue]);

  const openReviewModal = (
    targetType: 'campaign' | 'stack' | 'creative',
    targetTitle: string,
    stage: 'reviewer' | 'manager',
    item: any,
  ) => {
    setDialogState({
      isOpen: true,
      targetType,
      targetTitle,
      stage,
      item,
    });
  };

  const closeReviewModal = () => {
    setDialogState((prev) => ({ ...prev, isOpen: false, item: null }));
  };

  const handleModalSubmit = async (data: {
    decision: 'approved' | 'rejected';
    advertiserNote?: string;
    internalNote?: string;
    reasonCode?: string;
  }) => {
    const { targetType, stage, item } = dialogState;
    if (!item) return;

    const payload = {
      expectedRevision: item.contentRevision,
      submissionId: item.submissionId,
      requestId: crypto.randomUUID(),
      decision: data.decision,
      advertiserNote: data.advertiserNote,
      internalNote: data.internalNote,
      note: data.internalNote || data.advertiserNote || '',
      reasonCode: data.reasonCode,
    };

    if (targetType === 'campaign') {
      await adsApi().reviewCampaign(item.id, stage, payload);
      setActionMessage(
        `Campaign "${dialogState.targetTitle}" ${data.decision === 'approved' ? (stage === 'manager' ? 'fully APPROVED and is now LIVE!' : 'passed Review 1 and forwarded to Review 2') : 'REJECTED'}.`,
      );
      setQueue((prev) =>
        prev
          ? {
              ...prev,
              campaigns: prev.campaigns.filter((c) => c.id !== item.id),
              totalPending: Math.max(0, prev.totalPending - 1),
            }
          : null,
      );
    } else if (targetType === 'stack') {
      await adsApi().reviewStack(item.id, stage, payload);
      setActionMessage(
        `Ad Stack "${dialogState.targetTitle}" ${data.decision === 'approved' ? (stage === 'manager' ? 'fully APPROVED!' : 'passed Review 1') : 'REJECTED'}.`,
      );
      setQueue((prev) =>
        prev
          ? {
              ...prev,
              stacks: (prev.stacks || []).filter((s: any) => s.id !== item.id),
              totalPending: Math.max(0, prev.totalPending - 1),
            }
          : null,
      );
    } else if (targetType === 'creative') {
      await adsApi().reviewCreative(item.id, stage, payload);
      setActionMessage(
        `Creative "${dialogState.targetTitle}" ${data.decision === 'approved' ? (stage === 'manager' ? 'fully APPROVED!' : 'passed Review 1') : 'REJECTED'}.`,
      );
      setQueue((prev) =>
        prev
          ? {
              ...prev,
              creatives: prev.creatives.filter((c) => c.id !== item.id),
              totalPending: Math.max(0, prev.totalPending - 1),
            }
          : null,
      );
    }
  };

  if (isForbidden) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-crimson)', letterSpacing: '0.05em' }}>
              Compliance &amp; Moderation
            </span>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
              Staff Reviewer Access Required
            </h2>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '48px 24px',
            textAlign: 'center',
            borderRadius: '16px',
            border: '1px dashed var(--border-subtle)',
            backgroundColor: 'var(--bg-surface)',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'var(--badge-bg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-crimson)',
              marginBottom: '16px',
            }}
          >
            <ShieldCheck style={{ width: '28px', height: '28px' }} />
          </div>
          <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '18px', marginBottom: '8px' }}>
            Restricted Moderation Queue
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '520px', lineHeight: 1.6, marginBottom: '20px' }}>
            This workspace queue is reserved for assigned compliance reviewers, managers, and platform administrators.
          </p>
          <a
            href="/dashboard"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '10px 20px',
              borderRadius: '8px',
              backgroundColor: 'var(--color-crimson)',
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: '13px',
              textDecoration: 'none',
            }}
          >
            Return to Dashboard
          </a>
        </div>
      </div>
    );
  }

  const currentCanReview = reviewStage === 'reviewer' ? canReview : canManage;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {error && <p role="alert" className="text-destructive text-sm">{error}</p>}
      {actionMessage && (
        <div
          role="status"
          style={{
            padding: 16,
            borderRadius: 8,
            border: '1px solid var(--border-subtle)',
            background: 'var(--bg-surface)',
            color: 'var(--text-primary)',
            overflowWrap: 'anywhere',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span>{actionMessage}</span>
          <Button
            type="button"
            variant="outline"
            onClick={() => setActionMessage(null)}
            style={{ padding: '6px 10px', fontSize: '12px' }}
          >
            Dismiss
          </Button>
        </div>
      )}

      {/* Header bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-crimson)', letterSpacing: '0.05em' }}>
            Compliance &amp; Moderation
          </span>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
            {error ? 'Review Queue Unavailable' : isLoading ? 'Loading review queue...' : `Review Queue (${queue?.totalPending ?? 0} Pending)`}
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', maxWidth: '100%', alignItems: 'center' }}>
          {/* Stage toggle */}
          <div style={{ display: 'inline-flex', padding: '2px', backgroundColor: 'var(--badge-bg)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <Button
              type="button"
              onClick={() => setReviewStage('reviewer')}
              aria-pressed={reviewStage === 'reviewer'}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '11px',
                fontWeight: 700,
                backgroundColor: reviewStage === 'reviewer' ? 'var(--color-crimson)' : 'transparent',
                color: reviewStage === 'reviewer' ? '#FFFFFF' : 'var(--text-secondary)',
              }}
            >
              Review 1 (Reviewer)
            </Button>
            <Button
              type="button"
              onClick={() => setReviewStage('manager')}
              aria-pressed={reviewStage === 'manager'}
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
              Review 2 (Manager)
            </Button>
          </div>

          {/* Section tabs */}
          <Button
            type="button"
            onClick={() => setActiveTab('campaigns')}
            aria-pressed={activeTab === 'campaigns'}
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
          </Button>
          <Button
            type="button"
            onClick={() => setActiveTab('stacks')}
            aria-pressed={activeTab === 'stacks'}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '13px',
              backgroundColor: activeTab === 'stacks' ? 'var(--color-crimson)' : 'var(--bg-surface)',
              color: activeTab === 'stacks' ? '#FFFFFF' : 'var(--text-secondary)',
            }}
          >
            Ad Stacks ({error ? '—' : (queue?.stacks as any)?.length ?? 0})
          </Button>
          <Button
            type="button"
            onClick={() => setActiveTab('creatives')}
            aria-pressed={activeTab === 'creatives'}
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
            Creatives ({error ? '—' : queue?.creatives.length ?? 0})
          </Button>

          <Button
            type="button"
            aria-label="Refresh moderation queue"
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
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="theme-card" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading pending submissions...
        </div>
      ) : activeTab === 'campaigns' ? (
        queue?.campaigns.length === 0 ? (
          <div className="theme-card" style={{ padding: '48px 24px', textAlign: 'center' }}>
            <CheckCircle2 style={{ width: 40, height: 40, color: '#10B981', margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>Campaign Queue Clear</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
              No campaigns currently waiting for {reviewStage === 'reviewer' ? 'Review 1' : 'Review 2'}.
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
                  borderLeft: '4px solid var(--color-crimson)',
                }}
              >
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Model: {camp.pricingModel.toUpperCase()} · Budget: ${(camp.budgetUsdCents / 100).toFixed(2)} · Stage: {camp.moderationStatus}
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
                    {camp.title}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  {currentCanReview && (
                    <Button
                      type="button"
                      onClick={() => openReviewModal('campaign', camp.title, reviewStage, camp)}
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
                      {reviewStage === 'reviewer' ? 'Perform Review 1' : 'Perform Review 2 (Go Live)'}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      ) : activeTab === 'stacks' ? (
        ((queue?.stacks as any)?.length ?? 0) === 0 ? (
          <div className="theme-card" style={{ padding: '48px 24px', textAlign: 'center' }}>
            <CheckCircle2 style={{ width: 40, height: 40, color: '#10B981', margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>Ad Stack Queue Clear</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
              No ad stacks waiting for {reviewStage === 'reviewer' ? 'Review 1' : 'Review 2'}.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {(queue?.stacks as any)?.map((stk: any) => (
              <div
                key={stk.id}
                className="theme-card"
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                  borderLeft: '4px solid #3B82F6',
                }}
              >
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Campaign: {stk.campaignTitle || 'Campaign'} · Review: {stk.reviewStatus}
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
                    {stk.name}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  {currentCanReview && (
                    <Button
                      type="button"
                      onClick={() => openReviewModal('stack', stk.name, reviewStage, stk)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '6px',
                        border: 'none',
                        backgroundColor: '#3B82F6',
                        color: '#FFFFFF',
                        fontWeight: 600,
                        fontSize: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      {reviewStage === 'reviewer' ? 'Perform Review 1' : 'Perform Review 2'}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        queue?.creatives.length === 0 ? (
          <div className="theme-card" style={{ padding: '48px 24px', textAlign: 'center' }}>
            <CheckCircle2 style={{ width: 40, height: 40, color: '#10B981', margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>Creative Queue Clear</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
              All submitted advertiser headlines, copies, and media assets have been moderated for this stage.
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
                      Type: {crt.adType || crt.mediaFormat} · ID: {crt.id.slice(0, 8)}... · Status: {crt.reviewStatus}
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
                      {crt.headline || 'Creative Headline'}
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

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '180px' }}>
                    {currentCanReview && (
                      <Button
                        type="button"
                        onClick={() => openReviewModal('creative', crt.headline || crt.id.slice(0, 8), reviewStage, crt)}
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
                        {reviewStage === 'reviewer' ? 'Perform Review 1' : 'Perform Review 2'}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Standard Dialog for Review Decisions */}
      <ModerationReviewDialog
        isOpen={dialogState.isOpen}
        onClose={closeReviewModal}
        targetType={dialogState.targetType}
        targetTitle={dialogState.targetTitle}
        stage={dialogState.stage}
        isPlatformAdmin={isPlatformAdmin}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
}
