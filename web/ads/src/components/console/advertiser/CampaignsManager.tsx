'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  BarChart3,
  Plus,
  Play,
  Pause,
  SlidersHorizontal,
  Table,
  MoreVertical,
  Layers,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '../../ui/dropdown-menu';
import { loadCampaignPage, loadCampaignDetails, setCampaignStatus, type CampaignListItem } from '../../../lib/campaigns-api';
import { EmptyState } from '../../EmptyState';
import { TableSkeleton } from '../../LoadingStates';
import { TablePreferencesModal, type ColumnConfig } from '../TablePreferencesModal';
import { ReplaceCreativeModal } from '../ReplaceCreativeModal';
import { ActionHelp } from '../../ActionHelp';
import { withCampaignReturnTo } from '../../../lib/campaign-navigation';
import { campaignListStatus } from '../../../lib/campaign-list-status';
import { campaignSortOptions, parseCampaignSort, campaignColumnSort } from '../../../lib/campaign-list-sort';
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

type Campaign = CampaignListItem;
export function CampaignsManager() {
  const router = useRouter();
  const query = useSearchParams();
  const initialSort = query.get('sort');
  const initialPage = Number(query.get('page'));
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState(() => query.get('status') || 'all');
  const [page,setPage]=useState(() => Number.isSafeInteger(initialPage) && initialPage > 0 && initialPage <= 100000 ? initialPage : 1);
  const [search, setSearch] = useState(() => (query.get('search') ?? '').slice(0, 100));
  const [sort, setSort] = useState(() => parseCampaignSort(initialSort));
  const [total,setTotal]=useState(0);
  const [counts,setCounts]=useState<Record<string,number>>({});
  const generation=useRef(0);
  const pageSize=25;
  const [pendingWrites, setPendingWrites] = useState<Set<string>>(new Set());
  const [actionError, setActionError] = useState<string | null>(null);
  const listParams = new URLSearchParams();
  if (statusFilter !== 'all') listParams.set('status', statusFilter);
  if (page > 1) listParams.set('page', String(page));
  if (search) listParams.set('search', search);
  if (sort !== 'newest') listParams.set('sort', sort);
  const returnTo = `/campaigns${listParams.size ? `?${listParams.toString()}` : ''}`;

  // Table Preferences Modal
  const [isTablePrefsOpen, setIsTablePrefsOpen] = useState(false);
  const [columnsConfig, setColumnsConfig] = useState<ColumnConfig[]>([
    { key: 'campaign', label: 'Campaign Title', visible: true, order: 0 },
    { key: 'status', label: 'Status', visible: true, order: 1 },
    { key: 'creatives', label: 'Creative Progress', visible: true, order: 2 },
    { key: 'budget', label: 'Total Budget', visible: true, order: 3 },
    { key: 'spend', label: 'Spend', visible: true, order: 4 },
    { key: 'views', label: 'Views (Impressions)', visible: true, order: 5 },
    { key: 'clicks', label: 'Observed clicks', visible: true, order: 6 },
    { key: 'ctr', label: 'Observed CTR (%)', visible: true, order: 7 },
    { key: 'actions', label: 'Actions', visible: true, order: 8 },
  ]);

  // Inline Creative Replacement Modal
  const [replacementCreative, setReplacementCreative] = useState<React.ComponentProps<typeof ReplaceCreativeModal>['creative']>(null);

  useEffect(() => {
    const url = new URL(window.location.href);
    const options = { status: statusFilter === 'all' ? '' : statusFilter, page: page === 1 ? '' : String(page), search, sort: sort === 'newest' ? '' : sort };
    for (const [key, value] of Object.entries(options)) {
      if (value) url.searchParams.set(key, value);
      else url.searchParams.delete(key);
    }
    if (url.href !== window.location.href) window.history.replaceState(null, '', url);
  }, [statusFilter, page, search, sort]);

  useEffect(() => {
    fetchCampaigns();
    return()=>{generation.current++;};
  }, [page,statusFilter,search,sort]);

  const fetchCampaigns = async () => {
    const current=++generation.current;
    try {
      setIsLoading(true);
      const data = await loadCampaignPage(statusFilter,page,pageSize,search,sort);
      if(current!==generation.current)return;
      if(page>1&&data.items.length===0){setPage(Math.max(1,Math.ceil(data.total/pageSize)));return;}
      setCampaigns(data.items);setTotal(data.total);setCounts(data.counts);setActionError(null);
    } catch (err) {
      if(current===generation.current)setActionError(err instanceof Error ? err.message : 'Failed to load campaigns.');
    } finally {
      if(current===generation.current)setIsLoading(false);
    }
  };

  const handleToggleStatus = async (campaignId: string, recoveryStatus?: "trash" | "draft") => {
    if (pendingWrites.has(campaignId)) return;
    const camp = campaigns.find((c) => c.id === campaignId);
    if (!camp) return;

    const nextStatus = recoveryStatus ?? (camp.status === 'active' ? 'paused' : 'active');
    const canToggle = nextStatus === 'paused' ? (camp.capabilities?.canPause ?? true) : (camp.capabilities?.canActivate ?? false);
    if (!recoveryStatus && !canToggle) return;
    setPendingWrites((prev) => new Set(prev).add(campaignId));
    try {
      const updated = await setCampaignStatus(campaignId, nextStatus);
      setCampaigns((prev) =>
        prev.map((c) => (c.id === campaignId ? { ...c, status: updated.status, moderationStatus: updated.moderationStatus ?? c.moderationStatus, capabilities: updated.capabilities ?? c.capabilities } : c)),
      );
      await fetchCampaigns();
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

  const displayList = campaigns;

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
            My Ad Campaigns
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
        <label>Search campaigns <input type="search" maxLength={100} value={search} onChange={event => { setPage(1); setSearch(event.target.value); }} /></label>
        <label>Sort campaigns <select value={sort} onChange={event => { setPage(1); setSort(parseCampaignSort(event.target.value)); }}>
          {campaignSortOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select></label>
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
          const count = counts[tab.id]??0;
          const isSelected = statusFilter === tab.id;
          return (
            <Button
              key={tab.id}
              type="button"
              onClick={() => {setPage(1);setStatusFilter(tab.id);}}
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
                aria-label={isLoading ? 'Loading campaign count' : `${count} campaigns`}
                style={{
                  fontSize: '11px',
                  padding: '1px 6px',
                  borderRadius: '9999px',
                  backgroundColor: isSelected ? 'rgba(255,255,255,0.25)' : 'var(--badge-bg)',
                  color: isSelected ? '#FFFFFF' : 'var(--text-muted)',
                }}
              >
                {isLoading ? '…' : count}
              </span>
            </Button>
          );
        })}
      </div>

      {/* Table Area */}
      <Card style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <ShadTable density="compact">
            <TableHeader>
              <TableRow style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', backgroundColor: 'var(--bg-surface)' }}>
                {visibleCols.map((c) => {
                  const columnSort = campaignColumnSort(c.key, sort);
                  return (
                    <TableHead key={c.key} aria-sort={columnSort?.direction} style={{ padding: '14px 16px', textAlign: c.key === 'actions' ? 'right' : 'left' }}>
                      {columnSort ? <Button type="button" variant="ghost" size="sm"
                        aria-label={`Sort ${c.label} ${columnSort.nextDirection}`}
                        onClick={() => { setPage(1); setSort(columnSort.next); }}>
                        {c.label} <span aria-hidden="true">{columnSort.direction === 'ascending' ? '↑' : columnSort.direction === 'descending' ? '↓' : '↕'}</span>
                      </Button> : c.label}
                    </TableHead>
                  );
                })}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={Math.max(1, visibleCols.length)}>
                    <div role="status">Loading campaigns…</div>
                    <TableSkeleton rows={3} cols={Math.max(1, visibleCols.length)} />
                  </TableCell>
                </TableRow>
              ) : displayList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={Math.max(1, visibleCols.length)}>
                    <EmptyState
                      icon={BarChart3}
                      title="No matching campaigns"
                      description="Try another search or status filter."
                      actionLabel="+ Launch New Campaign"
                      onAction={() => router.push('/campaigns/new')}
                    />
                  </TableCell>
                </TableRow>
              ) : displayList.map((camp) => (
                <TableRow key={camp.id}>
                  {visibleCols.map((col) => {
                    if (col.key === 'campaign') {
                      return (
                        <TableCell key={col.key}>
                          <Link href={withCampaignReturnTo(`/campaigns/${camp.id}`, returnTo)} style={{ color: 'var(--text-primary)' }}>{camp.title}</Link>
                          {camp.headline && camp.headline !== camp.title && <div style={{ color: 'var(--text-muted)' }}>{camp.headline}</div>}
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
                      const listStatus = campaignListStatus(camp.status, camp.moderationStatus);
                      const isActive = listStatus === 'active';
                      const isPaused = listStatus === 'paused';
                      const statusLabel = listStatus.replace(/_/g, ' ').toUpperCase();
                      const moderationLabel = isApproved
                        ? 'COMPLIANT'
                        : isPendingTier2
                          ? 'TIER-2 APPROVAL'
                          : isPendingTier1
                            ? 'TIER-1 REVIEW'
                            : isRejected
                              ? 'REJECTED'
                              : camp.moderationStatus?.replace(/_/g, ' ').toUpperCase();

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
                              ● {statusLabel}
                            </Badge>
                            {moderationLabel && moderationLabel !== statusLabel && (
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
                                {moderationLabel}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                      );
                    }
                    if (col.key === 'creatives') {
                      const approved = camp.approvedCreativesCount ?? 0;
                      const totalAds = camp.totalCreativesCount ?? 0;
                      return (
                        <TableCell key={col.key}>
                          <Badge
                            variant="outline"
                            style={{
                              fontSize: '11px',
                              fontWeight: 700,
                              backgroundColor: approved > 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                              color: approved > 0 ? 'var(--color-success)' : 'var(--color-error)',
                              border: approved > 0 ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
                            }}
                          >
                            {approved}/{totalAds} Ads Approved
                          </Badge>
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
                          {camp.validClicks != null && camp.billedClicks != null && (
                            <div style={{ color: 'var(--text-secondary)', fontSize: '.75rem' }}>
                              {camp.validClicks.toLocaleString()} valid · {camp.billedClicks.toLocaleString()} billed
                            </div>
                          )}
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
                      const deliveryAction = camp.status === 'active'
                        ? (camp.capabilities?.canPause ?? true) ? 'pause' : null
                        : camp.status === 'paused' && (camp.capabilities?.canActivate ?? camp.moderationStatus === 'approved') ? 'resume' : null;
                      const actionBlocked = (camp.status === 'active' || camp.status === 'paused') && !deliveryAction;
                      const actionReason = camp.capabilities?.blocker ||
                        (camp.status === 'active'
                          ? 'Pausing this campaign is currently unavailable.'
                          : 'This campaign needs current approval before delivery can resume.');
                      return (
                        <TableCell key={col.key} style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" aria-label={`Actions for ${camp.title}`}>
                                  <MoreVertical style={{ width: 16, height: 16 }} />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {camp.capabilities?.canEdit && (
                                  <DropdownMenuItem onClick={() => router.push(withCampaignReturnTo(`/campaigns/${camp.id}/edit`, returnTo))}>
                                    Edit Draft Campaign
                                  </DropdownMenuItem>
                                )}
                                {camp.moderationStatus === 'draft' && (camp.status === 'draft' || camp.status === 'trash') && (
                                  <DropdownMenuItem disabled={pendingWrites.has(camp.id)} onSelect={() => void handleToggleStatus(camp.id, camp.status === 'trash' ? 'draft' : 'trash')}>
                                    {camp.status === 'trash' ? 'Restore to Draft' : 'Move to Trash'}
                                  </DropdownMenuItem>
                                )}
                                {deliveryAction && (
                                  <DropdownMenuItem onClick={() => handleToggleStatus(camp.id)}>
                                    {deliveryAction === 'pause' ? 'Pause Campaign' : 'Resume Campaign'}
                                  </DropdownMenuItem>
                                )}
                                {camp.status === 'rejected' && (
                                  <DropdownMenuItem
                                    onClick={async () => {
                                      try {
                                        const details = await loadCampaignDetails(camp.id);
                                        const creative = details.creatives.find((item) => item.reviewStatus === 'rejected');
                                        if (!creative) throw new Error('No rejected creative is available for replacement.');
                                        const specs = creative.imageSpecs;
                                        setReplacementCreative({
                                          ...creative,
                                          expectedRevision: details.contentRevision ?? 1,
                                          imageUrl: creative.imageUrl ?? undefined,
                                          videoUrl: creative.videoUrl ?? undefined,
                                          mediaFormat: creative.mediaFormat ?? undefined,
                                          mediaAssetId: creative.mediaAssetId ?? undefined,
                                          rejectionReason: creative.rejectionReason ?? undefined,
                                          imageSpecs:
                                            specs &&
                                            typeof specs.width === 'number' &&
                                            typeof specs.height === 'number' &&
                                            typeof specs.bytes === 'number'
                                              ? {
                                                  width: specs.width,
                                                  height: specs.height,
                                                  bytes: specs.bytes,
                                                  mimeType: specs.mimeType,
                                                }
                                              : undefined,
                                        });
                                      } catch (err) {
                                        setActionError(err instanceof Error ? err.message : 'Creative details unavailable.');
                                      }
                                    }}
                                  >
                                    Replace Rejected Creative
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(camp.id)}>
                                  Copy Campaign ID
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>

                            {actionBlocked && (
                              <ActionHelp
                                action={`${camp.status === 'active' ? 'Pause' : 'Resume'} ${camp.title}`}
                                reason={actionReason}
                              />
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
      {!isLoading && (
        <nav aria-label="Campaign pages" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Button variant="outline" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
          {page === 1 && <ActionHelp action="Previous page" reason="You are on the first page." />}
          <span aria-live="polite">Page {page} of {Math.max(1, Math.ceil(total / pageSize))} · {total} campaigns</span>
          <Button variant="outline" disabled={page * pageSize >= total} onClick={() => setPage(p => p + 1)}>Next</Button>
          {page * pageSize >= total && <ActionHelp action="Next page" reason="There are no more campaign pages in this filter." />}
        </nav>
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
