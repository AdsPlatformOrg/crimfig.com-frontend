'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AdminDataTable, ColumnDef } from './AdminDataTable';
import { sessionFetch } from '@/lib/session';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShieldCheck, ArrowRight, ExternalLink } from 'lucide-react';

export type StaffCampaignRow = {
  id: string;
  title: string;
  advertiserId: string;
  advertiserEmail: string | null;
  status: string;
  moderationStatus: string;
  budgetUsd: number;
  dailyBudgetUsd: number | null;
  remainingBudgetUsd: number;
  pricingModel: string | null;
  format: string | null;
  createdAt: string;
  updatedAt: string;
};

export function StaffCampaignsDataTable() {
  const router = useRouter();
  const [data, setData] = useState<StaffCampaignRow[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    const query = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
      ...(search.trim() ? { search: search.trim() } : {}),
    });

    sessionFetch(`/api/v1/campaigns/admin/list?${query.toString()}`)
      .then(async res => {
        if (!res.ok) throw new Error('Failed to load campaigns list.');
        const body = await res.json();
        if (body.status !== 'success' || !body.data) throw new Error('Invalid campaign response format.');
        if (active) {
          setData(body.data.items || []);
          setTotal(body.data.total ?? 0);
          setLoading(false);
        }
      })
      .catch(err => {
        if (active) {
          setError(err.message || 'Could not load campaigns.');
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [page, pageSize, search]);

  const columns: ColumnDef<StaffCampaignRow>[] = [
    {
      id: 'title',
      header: 'Campaign & Advertiser',
      cell: row => (
        <div>
          <Link
            href={`/admin/campaigns/readiness/${row.id}`}
            style={{
              fontWeight: 600,
              color: 'var(--color-crimson, #D4143A)',
              textDecoration: 'none',
              fontSize: '14px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            {row.title}
          </Link>
          <div style={{ fontSize: '12px', color: 'var(--text-muted, #64748B)', marginTop: '2px' }}>
            {row.advertiserEmail || row.advertiserId}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted, #94A3B8)', fontFamily: 'monospace', marginTop: '2px' }}>
            ID: {row.id}
          </div>
        </div>
      ),
    },
    {
      id: 'status',
      header: 'Delivery & Review',
      cell: row => {
        const isLive = row.status === 'active';
        const isApproved = row.moderationStatus === 'approved';
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <Badge
              variant="outline"
              style={{
                width: 'fit-content',
                fontSize: '11px',
                fontWeight: 600,
                backgroundColor: isLive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                color: isLive ? 'var(--color-success, #10B981)' : 'var(--color-error, #EF4444)',
                border: isLive ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
              }}
            >
              {row.status.toUpperCase()}
            </Badge>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary, #475569)', textTransform: 'capitalize' }}>
              Moderation: {row.moderationStatus.replaceAll('_', ' ')}
            </span>
          </div>
        );
      },
    },
    {
      id: 'budget',
      header: 'Budget',
      cell: row => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--text-primary, #0F172A)' }}>
            ${row.budgetUsd.toFixed(2)} USD
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted, #64748B)', marginTop: '2px' }}>
            Remaining: ${row.remainingBudgetUsd.toFixed(2)}
          </div>
        </div>
      ),
    },
    {
      id: 'createdAt',
      header: 'Created',
      cell: row => (
        <span style={{ fontSize: '12px', color: 'var(--text-secondary, #475569)' }}>
          {new Date(row.createdAt).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      align: 'right',
      cell: row => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/admin/campaigns/readiness/${row.id}`)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontWeight: 600,
            fontSize: '12px',
          }}
        >
          <ShieldCheck style={{ width: 14, height: 14, color: 'var(--color-crimson, #D4143A)' }} />
          Inspect Readiness
          <ArrowRight style={{ width: 12, height: 12 }} />
        </Button>
      ),
    },
  ];

  return (
    <div style={{ marginTop: '20px' }}>
      <AdminDataTable
        columns={columns}
        data={data}
        totalCount={total}
        loading={loading}
        error={error}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={size => {
          setPageSize(size);
          setPage(1);
        }}
        search={search}
        onSearchChange={val => {
          setSearch(val);
          setPage(1);
        }}
        searchPlaceholder="Search campaigns by title, advertiser email, or ID…"
        emptyMessage="No campaigns found matching your query."
      />
    </div>
  );
}
