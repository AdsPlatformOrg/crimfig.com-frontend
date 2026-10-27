'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BarChart3,
  Plus,
  Play,
  Pause,
  SlidersHorizontal,
  Table,
} from 'lucide-react';
import { apiData, arrayData } from '../../../lib/api-data';
import { loadCampaigns, setCampaignStatus } from '../../../lib/campaigns-api';
import { EmptyState } from '../../EmptyState';
import { TableSkeleton } from '../../LoadingStates';
import { TablePreferencesModal, type ColumnConfig } from '../TablePreferencesModal';
import { ReplaceCreativeModal } from '../ReplaceCreativeModal';
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
} from '../../ui';

interface CampaignCreativeItem {
  id?: string;
  headline?: string | null;
  destinationUrl: string;
  adFormat: 'banner' | 'card' | 'video' | 'interstitial';
  mediaFormat?: 'image' | 'gif' | 'video';
  imageUrl?: string;
  videoUrl?: string;
  reviewStatus?: string;
  rejectionReason?: string;
}

interface Campaign {
  id: string;
  title: string;
  category: string;
  format: 'banner' | 'card' | 'video' | 'interstitial';
  formats?: ('banner' | 'card' | 'video' | 'interstitial')[];
  creatives?: CampaignCreativeItem[];
  channels: ('websites' | 'individuals' | 'mobile_apps')[];
  budgetUsd: number;
  spentUsd: number;
  cpcUsd: number;
  cpmUsd: number;
  status: 'active' | 'paused' | 'under_review' | 'draft' | 'rejected' | 'suspended' | 'trash';
  moderationStatus?: 'draft' | 'pending_primary_review' | 'pending_manager_approval' | 'approved' | 'rejected';
  metricsLoaded?: boolean;
  impressions: number;
  clicks: number;
  hovers?: number;
  touches?: number;
  headline?: string | null;
  destinationUrl: string;
  imageUrl?: string;
  videoUrl?: string;
  rejectionReason?: string;
}

export function CampaignsManager() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [pendingWrites, setPendingWrites] = useState<Set<string>>(new Set());
  const [actionError, setActionError] = useState<string | null>(null);

  // Table Preferences Modal
  const [isTablePrefsOpen, setIsTablePrefsOpen] = useState(false);
  const [columnsConfig, setColumnsConfig] = useState<ColumnConfig[]>([
    { key: 'campaign', label: 'Campaign Title', visible: true, order: 0 },
    { key: 'status', label: 'Status', visible: true, order: 1 },
    { key: 'budget', label: 'Total Budget', visible: true, order: 2 },
    { key: 'spend', label: 'Spend', visible: true, order: 3 },
    { key: 'views', label: 'Views (Impressions)', visible: true, order: 4 },
    { key: 'clicks', label: 'Clicks', visible: true, order: 5 },
    { key: 'hovers', label: 'Hovers', visible: true, order: 6 },
    { key: 'touches', label: 'Touches', visible: true, order: 7 },
    { key: 'ctr', label: 'CTR (%)', visible: true, order: 8 },
    { key: 'actions', label: 'Actions', visible: true, order: 9 },
  ]);

  // Inline Creative Replacement Modal
  const [replacementCreative, setReplacementCreative] = useState<any | null>(null);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setIsLoading(true);
      const data = await loadCampaigns(true);
      setCampaigns(data || []);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to load campaigns.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (campaignId: string) => {
    if (pendingWrites.has(campaignId)) return;
    const camp = campaigns.find((c) => c.id === campaignId);
    if (!camp) return;

    const nextStatus = camp.status === 'active' ? 'paused' : 'active';
    setPendingWrites((prev) => new Set(prev).add(campaignId));
    try {
      await setCampaignStatus(campaignId, nextStatus);
      setCampaigns((prev) =>
        prev.map((c) => (c.id === campaignId ? { ...c, status: nextStatus } : c)),
      );
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to update status.');
    } finally {
      setPendingWrites((prev) => {
        const next = new Set(prev);
        next.delete(campaignId);
        return next;
      });
    }
  };

  const displayList =
    statusFilter === 'all' ? campaigns : campaigns.filter((c) => c.status === statusFilter);

  const visibleCols = columnsConfig.filter((c) => c.visible);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {actionError && (
        <div
          role="alert"
          style={{
            padding: '12px 16px',
            borderRadius: '8px',
            backgroundColor: 'var(--color-error-bg)',
            color: 'var(--color-error)',
            fontSize: '13px',
            border: '1px solid rgba(220, 38, 38, 0.25)',
          }}
        >
          {actionError}
        </div>
      )}

      {/* Header with Title and Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Campaigns &amp; Creative Assets
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
            Filter by moderation status, customize performance columns, and manage live delivery.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsTablePrefsOpen(true)}
          >
            <SlidersHorizontal style={{ width: 14, height: 14, color: 'var(--color-crimson)' }} />
            <span>Customize Columns</span>
          </Button>
          <Button
            type="button"
            onClick={() => router.push('/campaigns/new')}
          >
            <Plus style={{ width: 16, height: 16 }} /> Create Campaign
          </Button>
        </div>
      </div>

      {/* Status Tabs */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
        {[
          { id: 'all', label: 'All Campaigns' },
          { id: 'active', label: 'Active' },
          { id: 'paused', label: 'Paused' },
          { id: 'under_review', label: 'Under Review' },
          { id: 'draft', label: 'Draft' },
          { id: 'rejected', label: 'Rejected' },
          { id: 'suspended', label: 'Suspended' },
          { id: 'trash', label: 'Trash' },
        ].map((tab) => {
          const count = tab.id === 'all' ? campaigns.length : campaigns.filter((c) => c.status === tab.id).length;
          const isSelected = statusFilter === tab.id;
          return (
            <Button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              variant={isSelected ? 'default' : 'outline'}
              size="sm"
              aria-pressed={isSelected}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                minHeight: '36px',
              }}
            >
              <span>{tab.label}</span>
              <span
                style={{
                  fontSize: '11px',
                  padding: '1px 6px',
                  borderRadius: '9999px',
                  backgroundColor: isSelected ? 'rgba(255,255,255,0.25)' : 'var(--badge-bg)',
                  color: isSelected ? '#FFFFFF' : 'var(--text-muted)',
                }}
              >
                {count}
              </span>
            </Button>
          );
        })}
      </div>

      {/* Table Area */}
      {isLoading ? (
        <TableSkeleton rows={3} cols={6} />
      ) : displayList.length === 0 ? (
        <EmptyState
          icon={BarChart3}
          title={`No ${statusFilter.replace('_', ' ')} campaigns`}
          description={`There are currently no campaigns marked as ${statusFilter.replace('_', ' ')}.`}
          actionLabel="+ Launch New Campaign"
          onAction={() => router.push('/campaigns/new')}
        />
      ) : (
        <Card style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <ShadTable style={{ width: '100%', textAlign: 'left', fontSize: '13px', borderCollapse: 'collapse' }}>
              <TableHeader>
                <TableRow style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', backgroundColor: 'var(--bg-surface)' }}>
                  {visibleCols.map((c) => (
                    <TableHead key={c.key} style={{ padding: '14px 16px', textAlign: c.key === 'actions' ? 'right' : 'left' }}>
                      {c.label}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayList.map((camp) => (
                  <TableRow key={camp.id}>
                    {visibleCols.map((col) => {
                      if (col.key === 'campaign') {
                        return (
                          <TableCell key={col.key}>
                            <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{camp.title}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{camp.headline}</div>
                            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '6px' }}>
                              {(camp.formats && camp.formats.length > 0 ? camp.formats : [camp.format]).map((fmt) => (
                                <Badge
                                  key={fmt}
                                  variant="secondary"
                                  style={{ textTransform: 'uppercase', color: 'var(--color-crimson)' }}
                                >
                                  {fmt}
                                </Badge>
                              ))}
                            </div>
                            {camp.rejectionReason && (
                              <div style={{ fontSize: '11px', color: 'var(--color-error)', marginTop: '4px', fontWeight: 600 }}>
                                Reason: {camp.rejectionReason}
                              </div>
                            )}
                          </TableCell>
                        );
                      }
                      if (col.key === 'status') {
                        const isRejected = camp.moderationStatus === 'rejected' || camp.status === 'rejected';
                        const isApproved = camp.moderationStatus === 'approved';
                        const isPendingTier1 = camp.moderationStatus === 'pending_primary_review' || camp.status === 'under_review';
                        const isPendingTier2 = camp.moderationStatus === 'pending_manager_approval';
                        const isActive = camp.status === 'active';
                        const isPaused = camp.status === 'paused';

                        return (
                          <TableCell key={col.key}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start' }}>
                              <Badge
                                variant={isRejected ? 'destructive' : isActive ? 'secondary' : 'outline'}
                                style={{
                                  letterSpacing: '0.04em',
                                  backgroundColor: isActive ? 'var(--color-success-bg)' : isPaused ? 'var(--color-soft-gray)' : undefined,
                                  color: isActive ? 'var(--color-success)' : isPaused ? 'var(--color-slate-500)' : undefined,
                                }}
                              >
                                ● {camp.status.replace('_', ' ').toUpperCase()}
                              </Badge>
                              <Badge
                                variant={isRejected ? 'destructive' : isApproved ? 'secondary' : 'outline'}
                                style={{
                                  backgroundColor: isApproved
                                    ? 'rgba(16, 185, 129, 0.1)'
                                    : isPendingTier2
                                      ? 'rgba(99, 102, 241, 0.1)'
                                      : isPendingTier1
                                        ? 'var(--color-warning-bg)'
                                        : isRejected
                                          ? 'var(--color-error-bg)'
                                          : 'rgba(0,0,0,0.04)',
                                  color: isApproved
                                    ? 'var(--color-success)'
                                    : isPendingTier2
                                      ? '#4f46e5'
                                      : isPendingTier1
                                        ? 'var(--color-warning)'
                                        : isRejected
                                          ? 'var(--color-error)'
                                          : 'var(--color-slate-500)',
                                }}
                              >
                                {isApproved
                                  ? 'COMPLIANT'
                                  : isPendingTier2
                                    ? 'TIER-2 APPROVAL'
                                    : isPendingTier1
                                      ? 'TIER-1 REVIEW'
                                      : isRejected
                                        ? 'REJECTED'
                                        : (camp.moderationStatus || 'DRAFT').toUpperCase()}
                              </Badge>
                            </div>
                          </TableCell>
                        );
                      }
                      if (col.key === 'budget') {
                        return <TableCell key={col.key}>${camp.budgetUsd.toFixed(2)} USD</TableCell>;
                      }
                      if (col.key === 'spend') {
                        return (
                          <TableCell key={col.key} style={{ fontWeight: 600, color: 'var(--color-crimson)' }}>
                            ${camp.spentUsd.toFixed(2)} USD
                          </TableCell>
                        );
                      }
                      if (col.key === 'views') {
                        return (
                          <TableCell key={col.key}>
                            {camp.metricsLoaded ? camp.impressions.toLocaleString() : '—'}
                          </TableCell>
                        );
                      }
                      if (col.key === 'clicks') {
                        return (
                          <TableCell key={col.key} style={{ color: 'var(--color-success)', fontWeight: 600 }}>
                            {camp.metricsLoaded ? camp.clicks.toLocaleString() : '—'}
                          </TableCell>
                        );
                      }
                      if (col.key === 'hovers') {
                        return (
                          <TableCell key={col.key}>
                            {camp.metricsLoaded ? (camp.hovers ?? 0).toLocaleString() : '—'}
                          </TableCell>
                        );
                      }
                      if (col.key === 'touches') {
                        return (
                          <TableCell key={col.key}>
                            {camp.metricsLoaded ? (camp.touches ?? 0).toLocaleString() : '—'}
                          </TableCell>
                        );
                      }
                      if (col.key === 'ctr') {
                        const ctr = camp.impressions > 0 ? (camp.clicks / camp.impressions) * 100 : 0;
                        return (
                          <TableCell key={col.key} style={{ fontWeight: 700 }}>
                            {camp.metricsLoaded ? `${ctr.toFixed(2)}%` : '—'}
                          </TableCell>
                        );
                      }
                      if (col.key === 'actions') {
                        return (
                          <TableCell key={col.key} style={{ textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                              {camp.status === 'rejected' && (
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  onClick={async () => {
                                    try {
                                      const details = await apiData<any>(`/api/v1/campaigns/${encodeURIComponent(camp.id)}`);
                                      const creative = arrayData<any>(details.creatives).find((item: any) => item.reviewStatus === 'rejected');
                                      if (!creative) throw new Error('No rejected creative is available for replacement.');
                                      setReplacementCreative({ ...creative, title: camp.title });
                                    } catch (err) {
                                      setActionError(err instanceof Error ? err.message : 'Creative details unavailable.');
                                    }
                                  }}
                                >
                                  Replace Creative
                                </Button>
                              )}
                              {camp.status !== 'rejected' && camp.status !== 'trash' && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  aria-label={camp.status === 'active' ? `Pause ${camp.title}` : `Resume ${camp.title}`}
                                  disabled={pendingWrites.has(camp.id)}
                                  onClick={() => handleToggleStatus(camp.id)}
                                >
                                  {camp.status === 'active' ? <Pause style={{ width: 14, height: 14 }} /> : <Play style={{ width: 14, height: 14 }} />}
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        );
                      }
                      return <TableCell key={col.key}>-</TableCell>;
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </ShadTable>
          </div>
        </Card>
      )}

      {/* Table Preferences Modal */}
      <TablePreferencesModal
        isOpen={isTablePrefsOpen}
        onClose={() => setIsTablePrefsOpen(false)}
        columns={columnsConfig}
        onSave={(updated: ColumnConfig[]) => setColumnsConfig(updated)}
      />

      {/* Replace Creative Modal */}
      {replacementCreative && (
        <ReplaceCreativeModal
          creative={replacementCreative}
          isOpen={true}
          onClose={() => setReplacementCreative(null)}
          onReplaceSuccess={() => {
            setReplacementCreative(null);
            fetchCampaigns();
          }}
        />
      )}
    </div>
  );
}
