'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { sessionFetch } from '@/lib/session';
import { AdminDataTable, ColumnDef } from '@/components/console/AdminDataTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { History, Eye, Copy, Check, Filter } from 'lucide-react';

export type AuctionDecisionRow = {
  id: string;
  requestId: string;
  createdAt: string;
  inventoryClass: string;
  deliveryMode: string;
  slotTagId: string;
  websiteId: string | null;
  candidateCount: number;
  eligibleGroupCount: number;
  winnerCampaignId: string | null;
  excludedCandidates: any[];
  policyVersion: string;
};

export default function AdminAuctionLogsPage() {
  const router = useRouter();
  const [data, setData] = useState<AuctionDecisionRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [search, setSearch] = useState('');
  const [inventoryClass, setInventoryClass] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
      });
      if (search.trim()) params.set('search', search.trim());
      if (inventoryClass && inventoryClass !== 'all') params.set('inventoryClass', inventoryClass);

      const res = await sessionFetch(`/api/v1/admin/ads/auction-decisions?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.status !== 'success' || !json.data) throw new Error('Invalid response structure');

      setData(json.data.items || []);
      setTotal(json.data.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load auction logs');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, inventoryClass]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  }

  const columns: ColumnDef<AuctionDecisionRow>[] = [
    {
      id: 'timestamp',
      header: 'Timestamp',
      cell: (row) => (
        <div style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>
          {new Date(row.createdAt).toLocaleString()}
        </div>
      ),
    },
    {
      id: 'requestId',
      header: 'Request ID',
      cell: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--text-primary)' }}>
            {row.requestId.slice(0, 12)}…
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              copyToClipboard(row.requestId);
            }}
            title="Copy Request ID"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: 'var(--text-muted)' }}
          >
            {copiedId === row.requestId ? <Check style={{ width: 12, height: 12, color: 'var(--color-success)' }} /> : <Copy style={{ width: 12, height: 12 }} />}
          </button>
        </div>
      ),
    },
    {
      id: 'slotTagId',
      header: 'Slot Handle',
      cell: (row) => (
        <span style={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--text-muted)' }}>
          {row.slotTagId}
        </span>
      ),
    },
    {
      id: 'inventoryClass',
      header: 'Result',
      cell: (row) => {
        const isPaid = row.inventoryClass === 'paid';
        const isHouse = row.inventoryClass === 'house';
        return (
          <Badge
            variant="outline"
            style={{
              textTransform: 'uppercase',
              fontSize: '11px',
              fontWeight: 700,
              backgroundColor: isPaid ? 'rgba(16, 185, 129, 0.1)' : isHouse ? 'rgba(245, 158, 11, 0.1)' : 'rgba(100, 116, 139, 0.1)',
              color: isPaid ? 'var(--color-success)' : isHouse ? '#B45309' : 'var(--text-muted)',
              border: isPaid ? '1px solid rgba(16, 185, 129, 0.3)' : isHouse ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid var(--border-subtle)',
            }}
          >
            ● {row.inventoryClass.replace('_', ' ')}
          </Badge>
        );
      },
    },
    {
      id: 'candidates',
      header: 'Candidates',
      cell: (row) => (
        <span style={{ fontSize: '12px', fontWeight: 600 }}>
          {row.candidateCount} evaluated
        </span>
      ),
    },
    {
      id: 'fallbackReason',
      header: 'Decision / Fallback Reason',
      cell: (row) => {
        const exclusions = Array.isArray(row.excludedCandidates) ? row.excludedCandidates : [];
        const primaryReason = exclusions[0]?.reasonCode || (row.inventoryClass === 'house' ? 'HOUSE_SERVE' : 'PAID_WINNER_SELECTED');
        const stage = (exclusions[0] as any)?.stage;

        return (
          <div style={{ fontSize: '12px' }}>
            <span style={{ fontFamily: 'monospace', fontWeight: 600, color: row.inventoryClass === 'paid' ? 'var(--color-success)' : 'var(--color-crimson)' }}>
              {primaryReason}
            </span>
            {stage && (
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>
                Stage: {stage.replace('_', ' ')}
              </span>
            )}
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: 'Action',
      align: 'right',
      cell: (row) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => router.push(`/admin/auction-logs/${row.requestId}`)}
          style={{ fontSize: '11px', height: '28px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
        >
          <Eye style={{ width: 12, height: 12 }} /> Inspect Trace
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px 0', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <History style={{ width: 22, height: 22, color: 'var(--color-crimson)' }} />
            <h1 style={{ fontSize: '22px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              Auction Decision Logs
            </h1>
          </div>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
            Tamper-evident audit trail of ad request auctions, candidate drop-offs, and House Ad fallback gates across the CrimFig ecosystem.
          </p>
        </div>

        <Button asChild variant="outline"><a href="/admin/click-audit">Click Audit</a></Button>

        {/* Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {(['all', 'paid', 'house', 'shadow'] as const).map((cls) => (
            <Button
              key={cls}
              size="sm"
              variant={inventoryClass === cls ? 'default' : 'outline'}
              onClick={() => {
                setInventoryClass(cls);
                setPage(1);
              }}
              style={{ textTransform: 'capitalize', fontSize: '12px', height: '32px' }}
            >
              {cls === 'all' ? 'All Results' : cls}
            </Button>
          ))}
        </div>
      </div>

      <AdminDataTable
        columns={columns}
        data={data}
        totalCount={total}
        loading={loading}
        error={error}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(sz) => {
          setPageSize(sz);
          setPage(1);
        }}
        search={search}
        onSearchChange={(s) => {
          setSearch(s);
          setPage(1);
        }}
        searchPlaceholder="Search by Request ID, Slot Tag ID, or Result..."
        emptyMessage="No auction decision logs found matching your criteria."
      />
    </div>
  );
}
