'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { adsApi } from '@/lib/ads-api-client';
import { type CampaignDetails } from '@/lib/campaign-editor';
import { CampaignBreadcrumbs } from '@/components/console/CampaignBreadcrumbs';
import { MediaPreview } from '@/components/MediaPreview';
import { ReplaceCreativeModal } from '@/components/console/ReplaceCreativeModal';
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
} from '@/components/ui';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, ArrowLeft, RefreshCw, Layers, Image as ImageIcon, Sparkles, AlertCircle } from 'lucide-react';

export default function AdStackDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const stackId = params?.stackId as string;

  const [campaign, setCampaign] = useState<CampaignDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Creative replacement modal
  const [replacementCreative, setReplacementCreative] = useState<React.ComponentProps<typeof ReplaceCreativeModal>['creative']>(null);

  const loadData = async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      const data = await adsApi().details(id);
      setCampaign(data);
      setError(null);
    } catch (err: any) {
      setError(err?.message || 'Failed to load stack details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id, stackId]);

  if (isLoading) {
    return (
      <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
        <p>Loading stack and creatives...</p>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div style={{ padding: '24px 0' }}>
        <div style={{ color: 'var(--color-error)', marginBottom: '16px' }}>{error || 'Campaign not found'}</div>
        <Button onClick={loadData} variant="outline" size="sm">Retry</Button>
      </div>
    );
  }

  const stack = campaign.adStacks.find((s) => s.id === stackId);
  const creatives = campaign.creatives.filter((c) => c.adStackId === stackId);

  const approvedCount = creatives.filter((c) => c.reviewStatus === 'approved').length;
  const totalCount = creatives.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <CampaignBreadcrumbs
        items={[
          { label: campaign.title || 'Campaign', href: `/campaigns/${campaign.id}` },
          { label: stack?.name || 'Ad Stack', href: `/campaigns/${campaign.id}` },
          { label: 'Ads (Creatives)' },
        ]}
      />

      {/* Header Overview Card */}
      <Card style={{ padding: '20px', borderRadius: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Layers style={{ width: 22, height: 22, color: 'var(--color-crimson)' }} />
              <h1 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>{stack?.name || 'Ad Stack'}</h1>
              <Badge
                variant={stack?.reviewStatus === 'approved' ? 'secondary' : 'outline'}
                style={{
                  backgroundColor: stack?.reviewStatus === 'approved' ? 'rgba(16, 185, 129, 0.1)' : undefined,
                  color: stack?.reviewStatus === 'approved' ? 'var(--color-success)' : undefined,
                  fontWeight: 600,
                }}
              >
                ● {String(stack?.reviewStatus || 'PENDING').toUpperCase()}
              </Badge>
            </div>
            <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
              Campaign: <strong>{campaign.title}</strong> · Geo Mode: <strong>{stack?.geoMode || 'inherit'}</strong> · Position: <strong>{stack?.position ?? 0}</strong>
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Badge
              variant="outline"
              style={{
                fontSize: '13px',
                padding: '6px 12px',
                fontWeight: 700,
                backgroundColor: approvedCount > 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                color: approvedCount > 0 ? 'var(--color-success)' : 'var(--color-error)',
                border: approvedCount > 0 ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
              }}
            >
              {approvedCount}/{totalCount} Ads Approved
            </Badge>

            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/campaigns/${campaign.id}`)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <ArrowLeft style={{ width: 14, height: 14 }} /> Back to Stacks
            </Button>
          </div>
        </div>
      </Card>

      {/* Creatives Table */}
      <Card style={{ overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '15px', fontWeight: 700, margin: 0 }}>Stack Creatives</h2>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
              Each ad is reviewed independently. Only approved creatives deliver when the campaign is active.
            </p>
          </div>
          <Button
            size="sm"
            onClick={loadData}
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
                <TableHead style={{ width: '80px', padding: '12px 16px' }}>Preview</TableHead>
                <TableHead style={{ padding: '12px 16px' }}>Headline & Body</TableHead>
                <TableHead style={{ width: '110px', padding: '12px 16px' }}>Format</TableHead>
                <TableHead style={{ width: '150px', padding: '12px 16px' }}>Review Status</TableHead>
                <TableHead style={{ width: '180px', padding: '12px 16px' }}>Destination</TableHead>
                <TableHead style={{ width: '60px', padding: '12px 16px', textAlign: 'right' }}>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {creatives.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                    No creatives found in this stack.
                  </TableCell>
                </TableRow>
              ) : (
                creatives.map((ad) => {
                  const status = String(ad.reviewStatus || 'pending');
                  const isApproved = status === 'approved';
                  const isPendingTier2 = status === 'pending_manager_approval';
                  const isPendingTier1 = status === 'pending';
                  const isRejected = status === 'rejected';

                  return (
                    <TableRow key={ad.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      {/* Thumbnail Preview */}
                      <TableCell style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                        <div
                          style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '8px',
                            backgroundColor: 'var(--bg-surface)',
                            border: '1px solid var(--border-subtle)',
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {ad.imageUrl ? (
                            <MediaPreview source={ad.imageUrl} mode="owner" />
                          ) : (
                            <ImageIcon style={{ width: 20, height: 20, color: 'var(--text-muted)' }} />
                          )}
                        </div>
                      </TableCell>

                      {/* Headline & Body */}
                      <TableCell style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                          {ad.headline || 'Artwork Creative'}
                        </div>
                        {ad.bodyText && (
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {ad.bodyText}
                          </div>
                        )}
                        {ad.rejectionReason && (
                          <div style={{ fontSize: '11px', color: 'var(--color-error)', marginTop: '4px', fontWeight: 600 }}>
                            Rejection: {ad.rejectionReason}
                          </div>
                        )}
                      </TableCell>

                      {/* Format */}
                      <TableCell style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                        <Badge variant="outline" style={{ textTransform: 'uppercase', fontSize: '11px', fontWeight: 600 }}>
                          {ad.adFormat || ad.adType}
                        </Badge>
                      </TableCell>

                      {/* Review Status */}
                      <TableCell style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                        <Badge
                          variant={isRejected ? 'destructive' : isApproved ? 'secondary' : 'outline'}
                          style={{
                            backgroundColor: isApproved
                              ? 'rgba(16, 185, 129, 0.1)'
                              : isPendingTier2
                                ? 'rgba(99, 102, 241, 0.1)'
                                : isPendingTier1
                                  ? 'var(--color-warning-bg)'
                                  : 'var(--color-error-bg)',
                            color: isApproved
                              ? 'var(--color-success)'
                              : isPendingTier2
                                ? '#4f46e5'
                                : isPendingTier1
                                  ? 'var(--color-warning)'
                                  : 'var(--color-error)',
                            fontWeight: 600,
                            letterSpacing: '0.02em',
                          }}
                        >
                          {isApproved
                            ? '● APPROVED'
                            : isPendingTier2
                              ? '● REVIEW 2'
                              : isPendingTier1
                                ? '● REVIEW 1'
                                : '● REJECTED'}
                        </Badge>
                      </TableCell>

                      {/* Destination URL */}
                      <TableCell style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                        <span
                          style={{
                            fontSize: '12px',
                            color: 'var(--color-crimson)',
                            maxWidth: '160px',
                            display: 'inline-block',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {ad.destinationUrl || 'Not set'}
                        </span>
                      </TableCell>

                      {/* Actions with 3 vertical dots */}
                      <TableCell style={{ padding: '12px 16px', textAlign: 'right', verticalAlign: 'middle' }}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" aria-label={`Actions for ${ad.headline || 'ad'}`}>
                              <MoreVertical style={{ width: 16, height: 16 }} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {isRejected && (
                              <DropdownMenuItem
                                onClick={() => {
                                  const specs = ad.imageSpecs;
                                  setReplacementCreative({
                                    ...ad,
                                    expectedRevision: campaign.contentRevision ?? 1,
                                    imageUrl: ad.imageUrl ?? undefined,
                                    videoUrl: ad.videoUrl ?? undefined,
                                    mediaFormat: ad.mediaFormat ?? undefined,
                                    mediaAssetId: ad.mediaAssetId ?? undefined,
                                    rejectionReason: ad.rejectionReason ?? undefined,
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
                                }}
                              >
                                Replace Creative
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => {
                                router.push(`/campaigns/${campaign.id}/edit`);
                              }}
                            >
                              Edit in Campaign Editor
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                navigator.clipboard.writeText(ad.id);
                              }}
                            >
                              Copy Asset ID
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

      {/* Replacement Modal if active */}
      {replacementCreative && (
        <ReplaceCreativeModal
          creative={replacementCreative}
          isOpen={true}
          onClose={() => setReplacementCreative(null)}
          onReplaceSuccess={() => {
            setReplacementCreative(null);
            loadData();
          }}
        />
      )}
    </div>
  );
}
