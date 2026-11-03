'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { adsApi } from '../../lib/ads-api-client';
import { type CampaignDetails } from '../../lib/campaign-editor';
import { CampaignCreationWizard } from './CampaignCreationWizard';
import { CampaignReadiness } from './DeliveryReadinessPanel';
import { CampaignBreadcrumbs } from './CampaignBreadcrumbs';
import { ActionHelp } from '../ActionHelp';
import {
  Card,
  Table as ShadTable,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Button,
  Badge,
} from '../ui';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu';
import {
  Layers,
  ArrowRight,
  MoreVertical,
  Edit,
  Play,
  Pause,
  AlertCircle,
  RefreshCw,
  Plus,
} from 'lucide-react';

export function CampaignPage({ id, edit = false }: { id: string; edit?: boolean }) {
  const router = useRouter();
  const [campaign, setCampaign] = useState<CampaignDetails | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [confirmEdit, setConfirmEdit] = useState(false);
  const [reconcile, setReconcile] = useState<{ requestId: string; expectedRevision: number } | null>(null);

  async function load() {
    try {
      const data = await adsApi().details(id);
      setCampaign(data);
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Campaign could not be loaded.');
    }
  }

  useEffect(() => {
    let active = true;
    setCampaign(null);
    void adsApi()
      .details(id)
      .then((c) => {
        if (active) setCampaign(c);
      })
      .catch((e) => {
        if (active) setError(e instanceof Error ? e.message : 'Campaign unavailable.');
      });
    return () => {
      active = false;
    };
  }, [id]);

  async function begin() {
    if (!campaign || busy) return;
    setBusy(true);
    try {
      await adsApi().beginEdit(id, {
        expectedRevision: campaign.contentRevision!,
        requestId: crypto.randomUUID(),
        submissionId: campaign.currentSubmissionId ?? undefined,
      });
      await load();
      setConfirmEdit(false);
      router.push(`/campaigns/${id}/edit`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Editing could not be confirmed. Reload the campaign.');
    } finally {
      setBusy(false);
    }
  }

  async function resumeSubmission() {
    if (!reconcile || busy) return;
    setBusy(true);
    try {
      await adsApi().submit(id, reconcile);
      setReconcile(null);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Funding remains unconfirmed.');
    } finally {
      setBusy(false);
    }
  }

  if (error && !campaign) {
    return (
      <div role="alert" style={{ padding: '24px 0' }}>
        <p style={{ color: 'var(--color-error)' }}>{error}</p>
        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
          <Button onClick={() => void load()}>Retry</Button>
          <Button variant="outline" onClick={() => router.push('/campaigns')}>Back to campaigns</Button>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return <p role="status" style={{ padding: '32px 0', color: 'var(--text-muted)' }}>Loading campaign details…</p>;
  }

  if (edit && campaign.capabilities?.canEdit) {
    return (
      <CampaignCreationWizard
        campaign={campaign}
        onCancel={() => router.push(`/campaigns/${id}`)}
        onSuccess={() => router.push(`/campaigns/${id}`)}
      />
    );
  }

  const can = campaign.capabilities;
  const totalApprovedAds = campaign.creatives.filter((c) => c.reviewStatus === 'approved').length;
  const totalAds = campaign.creatives.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <CampaignBreadcrumbs items={[{ label: campaign.title || 'Campaign' }]} />

      <CampaignReadiness key={id} campaignId={id} />

      {/* Campaign Summary Card */}
      <Card style={{ padding: '24px', borderRadius: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '22px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>{campaign.title}</h1>
              <Badge
                variant={campaign.status === 'active' ? 'secondary' : 'outline'}
                style={{
                  backgroundColor: campaign.status === 'active' ? 'var(--color-success-bg)' : undefined,
                  color: campaign.status === 'active' ? 'var(--color-success)' : undefined,
                  fontWeight: 600,
                }}
              >
                ● {campaign.status.replace('_', ' ').toUpperCase()}
              </Badge>
              <Badge
                variant="outline"
                style={{
                  backgroundColor:
                    campaign.moderationStatus === 'approved'
                      ? 'rgba(16, 185, 129, 0.1)'
                      : campaign.moderationStatus === 'pending_manager_approval'
                        ? 'rgba(99, 102, 241, 0.1)'
                        : 'var(--color-warning-bg)',
                  color:
                    campaign.moderationStatus === 'approved'
                      ? 'var(--color-success)'
                      : campaign.moderationStatus === 'pending_manager_approval'
                        ? '#4f46e5'
                        : 'var(--color-warning)',
                  fontWeight: 600,
                }}
              >
                {campaign.moderationStatus.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>

            <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
              Revision {campaign.contentRevision} · Category: {campaign.category || 'General'} · Pricing: {campaign.pricingModel?.toUpperCase()} · Last updated: {campaign.updatedAt ? new Date(campaign.updatedAt).toLocaleString() : 'Time unavailable'}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <Badge
              variant="outline"
              style={{
                fontSize: '13px',
                padding: '6px 12px',
                fontWeight: 700,
                backgroundColor: totalApprovedAds > 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                color: totalApprovedAds > 0 ? 'var(--color-success)' : 'var(--color-error)',
                border: totalApprovedAds > 0 ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
              }}
            >
              {totalApprovedAds}/{totalAds} Ads Approved
            </Badge>

            {can?.canEdit ? (
              <Button onClick={() => router.push(`/campaigns/${id}/edit`)}>Continue editing draft</Button>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Button disabled={!can?.canBeginEdit || busy} onClick={() => setConfirmEdit(true)}>
                  Edit and restart review
                </Button>
                {!can?.canBeginEdit && (
                  <ActionHelp
                    action="Edit"
                    reason={can?.blocker ?? 'Editing is unavailable. Reload the campaign to check its current status.'}
                  />
                )}
              </div>
            )}
          </div>
        </div>

        {confirmEdit && (
          <div
            style={{
              marginTop: '16px',
              padding: '16px',
              borderRadius: '8px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: 'var(--text-muted)' }}>
              Beginning an edit withdraws the current review and stops new ad delivery. Resubmitting starts a fresh review. Existing funding is retained.
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button disabled={busy} onClick={() => void begin()}>Begin editing</Button>
              <Button variant="outline" disabled={busy} onClick={() => setConfirmEdit(false)}>Keep current submission</Button>
            </div>
          </div>
        )}

        {campaign.submissionIntentId && (
          <div
            style={{
              marginTop: '16px',
              padding: '16px',
              borderRadius: '8px',
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
            }}
          >
            <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#B45309' }}>
              A submission needs funding confirmation. Check its status before changing this campaign.
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button
                disabled={busy}
                onClick={async () => {
                  try {
                    const detail = await adsApi().details(id);
                    setCampaign(detail);
                    const requestId = typeof detail.submissionRequestId === 'string' ? detail.submissionRequestId : undefined;
                    if (requestId) setReconcile({ requestId, expectedRevision: detail.contentRevision! });
                    else setError('The request identity is unavailable. Ask support to reconcile this submission.');
                  } catch (e) {
                    setError(e instanceof Error ? e.message : 'Status is unavailable.');
                  }
                }}
              >
                Check submission
              </Button>
              {reconcile && <Button disabled={busy} onClick={() => void resumeSubmission()}>Reconcile this submission</Button>}
            </div>
          </div>
        )}

        {/* Budget Row */}
        <div style={{ display: 'flex', gap: '24px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', flexWrap: 'wrap' }}>
          <div>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Total Budget</span>
            <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>${(campaign.budgetUsdCents / 100).toFixed(2)} USD</div>
          </div>
          <div>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Remaining Budget</span>
            <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-crimson)' }}>${(campaign.remainingBudgetUsdCents / 100).toFixed(2)} USD</div>
          </div>
          <div>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Pricing</span>
            <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>{campaign.pricingModel?.toUpperCase()}</div>
          </div>
        </div>
      </Card>

      {/* Ad Stacks Table */}
      <Card style={{ overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Ad Stacks</h2>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
              Click on any ad stack to view and manage its individual creatives.
            </p>
          </div>
          <Button
            size="sm"
            onClick={load}
            variant="outline"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <RefreshCw style={{ width: 12, height: 12 }} /> Refresh
          </Button>
        </div>

        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <ShadTable style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', minWidth: '600px' }}>
            <TableHeader>
              <TableRow style={{ backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)' }}>
                <TableHead style={{ padding: '12px 16px' }}>Stack Name</TableHead>
                <TableHead style={{ padding: '12px 16px' }}>Geo Mode</TableHead>
                <TableHead style={{ padding: '12px 16px' }}>Approved Ads</TableHead>
                <TableHead style={{ padding: '12px 16px' }}>Review Status</TableHead>
                <TableHead style={{ padding: '12px 16px', width: '60px', textAlign: 'right' }}>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaign.adStacks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                    No ad stacks created yet for this campaign.
                  </TableCell>
                </TableRow>
              ) : (
                campaign.adStacks.map((stack) => {
                  const stackAds = campaign.creatives.filter((c) => c.adStackId === stack.id);
                  const stackApproved = stackAds.filter((c) => c.reviewStatus === 'approved').length;
                  const isApproved = stack.reviewStatus === 'approved';

                  return (
                    <TableRow
                      key={stack.id}
                      style={{ borderBottom: '1px solid var(--border-subtle)', cursor: 'pointer' }}
                      onClick={() => router.push(`/campaigns/${campaign.id}/stacks/${stack.id}`)}
                    >
                      <TableCell style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Layers style={{ width: 16, height: 16, color: 'var(--color-crimson)', flexShrink: 0 }} />
                          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{stack.name}</span>
                        </div>
                      </TableCell>

                      <TableCell style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                        <Badge variant="outline" style={{ textTransform: 'capitalize' }}>
                          {stack.geoMode || 'inherit'}
                        </Badge>
                      </TableCell>

                      <TableCell style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                        <span
                          style={{
                            fontWeight: 700,
                            color: stackApproved > 0 ? 'var(--color-success)' : 'var(--color-error)',
                          }}
                        >
                          {stackApproved}/{stackAds.length} Ads
                        </span>
                      </TableCell>

                      <TableCell style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                        <Badge
                          variant={isApproved ? 'secondary' : 'outline'}
                          style={{
                            backgroundColor: isApproved ? 'rgba(16, 185, 129, 0.1)' : undefined,
                            color: isApproved ? 'var(--color-success)' : undefined,
                            fontWeight: 600,
                          }}
                        >
                          ● {String(stack.reviewStatus || 'PENDING').toUpperCase()}
                        </Badge>
                      </TableCell>

                      <TableCell
                        style={{ padding: '12px 16px', textAlign: 'right', verticalAlign: 'middle' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" aria-label={`Actions for ${stack.name}`}>
                              <MoreVertical style={{ width: 16, height: 16 }} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => router.push(`/campaigns/${campaign.id}/stacks/${stack.id}`)}>
                              View Creatives Table
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/campaigns/${campaign.id}/edit`)}>
                              Edit in Editor
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(stack.id)}>
                              Copy Stack ID
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </ShadTable>
        </div>
      </Card>
    </div>
  );
}
