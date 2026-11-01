'use client';

import { MediaPreview } from '../MediaPreview';
import { sessionFetch } from '../../lib/session';
import { adsApi } from '../../lib/ads-api-client';
import { ApiError } from '@crimfig/api-client';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import {
  Table as ShadTable,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../ui/table';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu';
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
  MoreVertical,
  ImageIcon,
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

  const fetchQueue = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await adsApi().queue(reviewStage);
      setQueue(data);
    } catch (err) {
      if (err instanceof ApiError && (err.status === 403 || err.status === 401)) {
        setIsForbidden(true);
        return;
      }
      setError(err instanceof Error ? err.message : 'Failed to load moderation queue');
    } finally {
      setIsLoading(false);
    }
  }, [reviewStage]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await sessionFetch('/api/v1/auth/me');
        if (res.ok) {
          const user = await res.json();
          setRoles(user.roles || (user.role ? [user.role] : []));
        }
      } catch {
        // Fallback: roles remain empty
      }
    };
    fetchUser();
    fetchQueue();
  }, [fetchQueue]);

  const currentCanReview = reviewStage === 'reviewer' ? canReview : canManage;

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

    // Concurrency / freshness verification: ensure snapshot metadata is present
    let submissionId = item.submissionId;
    let expectedRevision = item.contentRevision;

    if (!submissionId || !expectedRevision) {
      // Re-fetch submission detail snapshot before dispatching
      try {
        const campaignId = targetType === 'campaign' ? item.id : item.campaignId;
        if (campaignId) {
          const detail = await adsApi().submission(campaignId);
          submissionId = detail.submissionId;
          expectedRevision = detail.contentRevision;
        }
      } catch {
        // Fallback to item fields
      }
    }

    if (!submissionId || !expectedRevision) {
      throw new Error('Authoritative submission snapshot unavailable. Refresh queue.');
    }

    // Whitelisted DTO payload with no undefined or extraneous properties
    const payload: any = {
      expectedRevision,
      submissionId,
      requestId: crypto.randomUUID(),
      decision: data.decision,
    };
    if (data.advertiserNote) payload.advertiserNote = data.advertiserNote;
    if (data.internalNote) payload.internalNote = data.internalNote;
    if (data.internalNote || data.advertiserNote) payload.note = data.internalNote || data.advertiserNote;
    if (data.reasonCode && data.decision === 'rejected') payload.reasonCode = data.reasonCode;

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-crimson)', letterSpacing: '0.05em' }}>
            Compliance &amp; Moderation
          </span>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0 0 0' }}>
            Review Queue ({error ? '—' : queue?.totalPending ?? 0} Pending)
          </h1>
        </div>

        {/* Stage Toggle: Reviewer (Tier-1) vs Manager (Tier-2) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--bg-surface)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <Button
            type="button"
            size="sm"
            variant={reviewStage === 'reviewer' ? 'default' : 'ghost'}
            onClick={() => setReviewStage('reviewer')}
            style={{
              fontSize: '12px',
              fontWeight: 600,
              backgroundColor: reviewStage === 'reviewer' ? 'var(--color-crimson)' : 'transparent',
              color: reviewStage === 'reviewer' ? '#FFFFFF' : 'var(--text-secondary)',
            }}
          >
            Review 1 (Primary)
          </Button>
          <Button
            type="button"
            size="sm"
            variant={reviewStage === 'manager' ? 'default' : 'ghost'}
            onClick={() => setReviewStage('manager')}
            style={{
              fontSize: '12px',
              fontWeight: 600,
              backgroundColor: reviewStage === 'manager' ? '#4f46e5' : 'transparent',
              color: reviewStage === 'manager' ? '#FFFFFF' : 'var(--text-secondary)',
            }}
          >
            Review 2 (Manager Approval)
          </Button>
        </div>
      </div>

      {actionMessage && (
        <div
          role="status"
          style={{
            padding: '12px 16px',
            borderRadius: '8px',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: 'var(--color-success)',
            fontSize: '13px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span>{actionMessage}</span>
          <button
            onClick={() => setActionMessage(null)}
            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontWeight: 700 }}
          >
            ×
          </button>
        </div>
      )}

      {error && (
        <div
          role="alert"
          style={{
            padding: '12px 16px',
            borderRadius: '8px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: 'var(--color-error)',
            fontSize: '13px',
            fontWeight: 600,
          }}
        >
          {error}
        </div>
      )}

      {/* Tabs Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            type="button"
            variant={activeTab === 'creatives' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('creatives')}
            style={{
              fontWeight: 700,
              backgroundColor: activeTab === 'creatives' ? 'var(--color-crimson)' : undefined,
              color: activeTab === 'creatives' ? '#FFFFFF' : undefined,
            }}
          >
            Creatives ({error ? '—' : queue?.creatives.length ?? 0})
          </Button>
          <Button
            type="button"
            variant={activeTab === 'stacks' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('stacks')}
            style={{
              fontWeight: 700,
              backgroundColor: activeTab === 'stacks' ? '#3B82F6' : undefined,
              color: activeTab === 'stacks' ? '#FFFFFF' : undefined,
            }}
          >
            Ad Stacks ({error ? '—' : (queue?.stacks as any)?.length ?? 0})
          </Button>
          <Button
            type="button"
            variant={activeTab === 'campaigns' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('campaigns')}
            style={{
              fontWeight: 700,
              backgroundColor: activeTab === 'campaigns' ? 'var(--color-fig-dark, #171B2A)' : undefined,
              color: activeTab === 'campaigns' ? '#FFFFFF' : undefined,
            }}
          >
            Campaigns ({error ? '—' : queue?.campaigns.length ?? 0})
          </Button>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={fetchQueue}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <RefreshCw style={{ width: 12, height: 12 }} /> Refresh
        </Button>
      </div>

      {/* Tab Content Tables */}
      {isLoading ? (
        <Card style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading queue items...
        </Card>
      ) : activeTab === 'creatives' ? (
        /* Creatives Table */
        <Card style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <ShadTable style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', minWidth: '700px' }}>
              <TableHeader>
                <TableRow style={{ backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)' }}>
                  <TableHead style={{ width: '70px', padding: '12px 16px' }}>Preview</TableHead>
                  <TableHead style={{ padding: '12px 16px' }}>Creative Headline &amp; Body</TableHead>
                  <TableHead style={{ width: '100px', padding: '12px 16px' }}>Format</TableHead>
                  <TableHead style={{ width: '140px', padding: '12px 16px' }}>Status</TableHead>
                  <TableHead style={{ width: '180px', padding: '12px 16px' }}>Destination</TableHead>
                  <TableHead style={{ width: '120px', padding: '12px 16px', textAlign: 'right' }}>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {queue?.creatives.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                      No creatives waiting for {reviewStage === 'reviewer' ? 'Review 1' : 'Review 2'}.
                    </TableCell>
                  </TableRow>
                ) : (
                  queue?.creatives.map((crt) => (
                    <TableRow key={crt.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <TableCell style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                        <div
                          style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '6px',
                            backgroundColor: 'var(--bg-surface)',
                            border: '1px solid var(--border-subtle)',
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {(crt.imageUrl || crt.videoUrl) ? (
                            <MediaPreview source={(crt.videoUrl || crt.imageUrl)!} mode="review" />
                          ) : (
                            <ImageIcon style={{ width: 18, height: 18, color: 'var(--text-muted)' }} />
                          )}
                        </div>
                      </TableCell>

                      <TableCell style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                          {crt.headline || 'Creative Headline'}
                        </div>
                        {crt.bodyText && (
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {crt.bodyText}
                          </div>
                        )}
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          ID: {crt.id.slice(0, 8)}...
                        </div>
                      </TableCell>

                      <TableCell style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                        <Badge variant="outline" style={{ textTransform: 'uppercase', fontSize: '11px', fontWeight: 600 }}>
                          {crt.adFormat || crt.adType}
                        </Badge>
                      </TableCell>

                      <TableCell style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                        <Badge
                          variant="outline"
                          style={{
                            backgroundColor: reviewStage === 'reviewer' ? 'var(--color-warning-bg)' : 'rgba(99, 102, 241, 0.1)',
                            color: reviewStage === 'reviewer' ? 'var(--color-warning)' : '#4f46e5',
                            fontWeight: 600,
                          }}
                        >
                          ● {reviewStage === 'reviewer' ? 'PENDING R1' : 'PENDING R2'}
                        </Badge>
                      </TableCell>

                      <TableCell style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                        <a
                          href={crt.destinationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontSize: '12px',
                            color: 'var(--color-crimson)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            textDecoration: 'none',
                            maxWidth: '160px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          <span>{crt.destinationUrl || 'Destination'}</span>
                          <ExternalLink style={{ width: 11, height: 11 }} />
                        </a>
                      </TableCell>

                      <TableCell style={{ padding: '12px 16px', textAlign: 'right', verticalAlign: 'middle' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          {currentCanReview && (
                            <Button
                              size="sm"
                              onClick={() => openReviewModal('creative', crt.headline || crt.id.slice(0, 8), reviewStage, crt)}
                              style={{
                                fontSize: '11px',
                                fontWeight: 700,
                                backgroundColor: reviewStage === 'reviewer' ? 'var(--color-crimson)' : '#4f46e5',
                                color: '#FFFFFF',
                              }}
                            >
                              {reviewStage === 'reviewer' ? 'Review 1' : 'Review 2'}
                            </Button>
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" aria-label="Creative options">
                                <MoreVertical style={{ width: 14, height: 14 }} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(crt.id)}>
                                Copy Creative ID
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </ShadTable>
          </div>
        </Card>
      ) : activeTab === 'stacks' ? (
        /* Ad Stacks Table */
        <Card style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <ShadTable style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', minWidth: '600px' }}>
              <TableHeader>
                <TableRow style={{ backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)' }}>
                  <TableHead style={{ padding: '12px 16px' }}>Stack Name</TableHead>
                  <TableHead style={{ padding: '12px 16px' }}>Campaign</TableHead>
                  <TableHead style={{ padding: '12px 16px' }}>Review Stage</TableHead>
                  <TableHead style={{ width: '120px', padding: '12px 16px', textAlign: 'right' }}>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {((queue?.stacks as any)?.length ?? 0) === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                      No ad stacks waiting for {reviewStage === 'reviewer' ? 'Review 1' : 'Review 2'}.
                    </TableCell>
                  </TableRow>
                ) : (
                  (queue?.stacks as any)?.map((stk: any) => (
                    <TableRow key={stk.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <TableCell style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Layers style={{ width: 16, height: 16, color: '#3B82F6', flexShrink: 0 }} />
                          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{stk.name}</span>
                        </div>
                      </TableCell>

                      <TableCell style={{ padding: '12px 16px', verticalAlign: 'middle', color: 'var(--text-secondary)' }}>
                        {stk.campaignTitle || 'Campaign'}
                      </TableCell>

                      <TableCell style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                        <Badge
                          variant="outline"
                          style={{
                            backgroundColor: reviewStage === 'reviewer' ? 'var(--color-warning-bg)' : 'rgba(99, 102, 241, 0.1)',
                            color: reviewStage === 'reviewer' ? 'var(--color-warning)' : '#4f46e5',
                            fontWeight: 600,
                          }}
                        >
                          ● {reviewStage === 'reviewer' ? 'REVIEW 1 PENDING' : 'REVIEW 2 PENDING'}
                        </Badge>
                      </TableCell>

                      <TableCell style={{ padding: '12px 16px', textAlign: 'right', verticalAlign: 'middle' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          {currentCanReview && (
                            <Button
                              size="sm"
                              onClick={() => openReviewModal('stack', stk.name, reviewStage, stk)}
                              style={{
                                fontSize: '11px',
                                fontWeight: 700,
                                backgroundColor: '#3B82F6',
                                color: '#FFFFFF',
                              }}
                            >
                              {reviewStage === 'reviewer' ? 'Review 1' : 'Review 2'}
                            </Button>
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" aria-label="Stack options">
                                <MoreVertical style={{ width: 14, height: 14 }} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(stk.id)}>
                                Copy Stack ID
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </ShadTable>
          </div>
        </Card>
      ) : (
        /* Campaigns Table */
        <Card style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <ShadTable style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', minWidth: '700px' }}>
              <TableHeader>
                <TableRow style={{ backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)' }}>
                  <TableHead style={{ padding: '12px 16px' }}>Campaign Title</TableHead>
                  <TableHead style={{ padding: '12px 16px' }}>Pricing &amp; Budget</TableHead>
                  <TableHead style={{ padding: '12px 16px' }}>Creative Progress</TableHead>
                  <TableHead style={{ padding: '12px 16px' }}>Moderation Stage</TableHead>
                  <TableHead style={{ width: '140px', padding: '12px 16px', textAlign: 'right' }}>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {queue?.campaigns.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                      No campaigns waiting for {reviewStage === 'reviewer' ? 'Review 1' : 'Review 2'}.
                    </TableCell>
                  </TableRow>
                ) : (
                  queue?.campaigns.map((camp: any) => {
                    const approvedAds = camp.approvedCreativesCount ?? 0;
                    const totalAds = camp.totalCreativesCount ?? 0;
                    return (
                      <TableRow key={camp.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <TableCell style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{camp.title}</span>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                            Revision: {camp.contentRevision ?? 1} · ID: {camp.id.slice(0, 8)}...
                          </div>
                        </TableCell>

                        <TableCell style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                          <div style={{ fontWeight: 600 }}>${(camp.budgetUsdCents / 100).toFixed(2)} USD</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                            Model: {camp.pricingModel?.toUpperCase()}
                          </div>
                        </TableCell>

                        <TableCell style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                          <Badge
                            variant="outline"
                            style={{
                              fontSize: '11px',
                              fontWeight: 700,
                              backgroundColor: approvedAds > 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                              color: approvedAds > 0 ? 'var(--color-success)' : 'var(--color-error)',
                              border: approvedAds > 0 ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
                            }}
                          >
                            {approvedAds}/{totalAds} Ads Approved
                          </Badge>
                        </TableCell>

                        <TableCell style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                          <Badge
                            variant="outline"
                            style={{
                              backgroundColor: reviewStage === 'reviewer' ? 'var(--color-warning-bg)' : 'rgba(99, 102, 241, 0.1)',
                              color: reviewStage === 'reviewer' ? 'var(--color-warning)' : '#4f46e5',
                              fontWeight: 600,
                            }}
                          >
                            ● {reviewStage === 'reviewer' ? 'REVIEW 1 PENDING' : 'REVIEW 2 (GO LIVE)'}
                          </Badge>
                        </TableCell>

                        <TableCell style={{ padding: '12px 16px', textAlign: 'right', verticalAlign: 'middle' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            {currentCanReview && (
                              <Button
                                size="sm"
                                onClick={() => openReviewModal('campaign', camp.title, reviewStage, camp)}
                                style={{
                                  fontSize: '11px',
                                  fontWeight: 700,
                                  backgroundColor: reviewStage === 'reviewer' ? 'var(--color-crimson)' : 'var(--color-success)',
                                  color: '#FFFFFF',
                                }}
                              >
                                {reviewStage === 'reviewer' ? 'Review 1' : 'Approve Live'}
                              </Button>
                            )}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" aria-label="Campaign options">
                                  <MoreVertical style={{ width: 14, height: 14 }} />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(camp.id)}>
                                  Copy Campaign ID
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </ShadTable>
          </div>
        </Card>
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
