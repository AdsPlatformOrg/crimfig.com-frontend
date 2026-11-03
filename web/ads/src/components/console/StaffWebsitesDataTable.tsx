'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AdminDataTable, ColumnDef } from '@/components/console/AdminDataTable';
import { sessionFetch } from '@/lib/session';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShieldCheck, ArrowRight, ExternalLink, Globe, AlertTriangle } from 'lucide-react';

export type AdminWebsiteRow = {
  id: string;
  domain: string;
  url: string;
  promoterId: string;
  promoterEmail: string | null;
  verificationStatus: 'pending' | 'verified' | 'failed' | 'revoked';
  verificationMethod: 'dns_txt' | 'html_file_and_meta_tag';
  verifiedAt: string | null;
  verificationExpiresAt: string | null;
  policyStatus: 'unverified' | 'testing' | 'pending_approval' | 'approved' | 'rejected' | 'suspended';
  policyRevision: number;
  reviewNote: string | null;
  reviewedAt: string | null;
  isActive: boolean;
  isSuspended: boolean;
  slotCount: number;
  activeSlotCount: number;
  paidEligibility: 'eligible' | 'pending_approval' | 'unverified' | 'blocked';
  createdAt: string;
  updatedAt: string;
};

export function StaffWebsitesDataTable() {
  const router = useRouter();
  const [data, setData] = useState<AdminWebsiteRow[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [search, setSearch] = useState<string>('');
  const [policyStatus, setPolicyStatus] = useState<string>('all');
  const [verificationStatus, setVerificationStatus] = useState<string>('all');
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
      ...(policyStatus !== 'all' ? { policyStatus } : {}),
      ...(verificationStatus !== 'all' ? { verificationStatus } : {}),
    });

    sessionFetch(`/api/v1/adstation/admin/websites?${query.toString()}`)
      .then(async res => {
        if (!res.ok) throw new Error('Failed to load websites directory.');
        const body = await res.json();
        if (body.status !== 'success' || !body.data) throw new Error('Invalid websites response format.');
        if (active) {
          setData(body.data.items || []);
          setTotal(body.data.total ?? 0);
          setLoading(false);
        }
      })
      .catch(err => {
        if (active) {
          setError(err.message || 'Could not load websites.');
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [page, pageSize, search, policyStatus, verificationStatus]);

  const columns: ColumnDef<AdminWebsiteRow>[] = [
    {
      id: 'domain',
      header: 'Website & Domain',
      cell: row => (
        <div>
          <Link
            href={`/admin/websites/review/${row.id}`}
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
            <Globe style={{ width: 14, height: 14 }} />
            {row.domain}
          </Link>
          <div style={{ fontSize: '12px', color: 'var(--text-muted, #64748B)', marginTop: '2px' }}>
            {row.url}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted, #94A3B8)', fontFamily: 'monospace', marginTop: '2px' }}>
            UUID: {row.id}
          </div>
        </div>
      ),
    },
    {
      id: 'promoter',
      header: 'Promoter',
      cell: row => (
        <div>
          <div style={{ fontWeight: 500, fontSize: '13px', color: 'var(--text-primary, #0F172A)' }}>
            {row.promoterEmail || 'Email unavailable'}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted, #64748B)', fontFamily: 'monospace', marginTop: '2px' }}>
            Promoter: {row.promoterId.slice(0, 8)}…
          </div>
        </div>
      ),
    },
    {
      id: 'verificationStatus',
      header: 'Domain Ownership',
      cell: row => {
        const isVerified = row.verificationStatus === 'verified';
        const isExpired = row.verificationExpiresAt ? new Date(row.verificationExpiresAt).getTime() <= Date.now() : false;
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <Badge
              variant="outline"
              style={{
                width: 'fit-content',
                fontSize: '11px',
                fontWeight: 600,
                backgroundColor: isVerified && !isExpired ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                color: isVerified && !isExpired ? 'var(--color-success, #10B981)' : 'var(--color-error, #EF4444)',
                border: isVerified && !isExpired ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
              }}
            >
              {isExpired ? 'EXPIRED' : row.verificationStatus.toUpperCase()}
            </Badge>
            <span style={{ fontSize: '11px', color: 'var(--text-muted, #64748B)' }}>
              Method: {row.verificationMethod === 'dns_txt' ? 'DNS TXT' : 'HTML / Meta'}
            </span>
          </div>
        );
      },
    },
    {
      id: 'policyStatus',
      header: 'Suitability Policy',
      cell: row => {
        const isApproved = row.policyStatus === 'approved';
        const isPending = row.policyStatus === 'pending_approval' || row.policyStatus === 'testing';
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <Badge
              variant="outline"
              style={{
                width: 'fit-content',
                fontSize: '11px',
                fontWeight: 600,
                backgroundColor: isApproved
                  ? 'rgba(16, 185, 129, 0.1)'
                  : isPending
                  ? 'rgba(245, 158, 11, 0.1)'
                  : 'rgba(239, 68, 68, 0.1)',
                color: isApproved
                  ? 'var(--color-success, #10B981)'
                  : isPending
                  ? 'var(--color-warning, #D97706)'
                  : 'var(--color-error, #EF4444)',
              }}
            >
              {row.policyStatus.replaceAll('_', ' ').toUpperCase()}
            </Badge>
            <span style={{ fontSize: '11px', color: 'var(--text-muted, #64748B)' }}>
              Rev {row.policyRevision} {row.reviewedAt ? `· ${new Date(row.reviewedAt).toLocaleDateString()}` : ''}
            </span>
          </div>
        );
      },
    },
    {
      id: 'paidEligibility',
      header: 'Paid Eligibility',
      cell: row => {
        const isEligible = row.paidEligibility === 'eligible';
        const isPending = row.paidEligibility === 'pending_approval';
        const isUnverified = row.paidEligibility === 'unverified';
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span
              style={{
                fontWeight: 600,
                fontSize: '12px',
                color: isEligible
                  ? 'var(--color-success, #10B981)'
                  : isPending
                  ? 'var(--color-warning, #D97706)'
                  : 'var(--color-error, #EF4444)',
              }}
            >
              {isEligible
                ? 'Eligible'
                : isPending
                ? 'Pending Approval'
                : isUnverified
                ? 'Unverified Domain'
                : 'Blocked / Inactive'}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted, #64748B)' }}>
              {isEligible
                ? 'Can receive paid bids'
                : isPending
                ? 'Requires staff suitability review'
                : 'Blocked from ad delivery'}
            </span>
          </div>
        );
      },
    },
    {
      id: 'slots',
      header: 'Ad Slots',
      cell: row => (
        <div>
          <span style={{ fontWeight: 600, fontSize: '13px' }}>{row.slotCount} slots</span>
          <div style={{ fontSize: '11px', color: 'var(--text-muted, #64748B)' }}>
            {row.activeSlotCount} active
          </div>
        </div>
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
          onClick={() => router.push(`/admin/websites/review/${row.id}`)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontWeight: 600,
            fontSize: '12px',
          }}
        >
          <ShieldCheck style={{ width: 14, height: 14, color: 'var(--color-crimson, #D4143A)' }} />
          Inspect Website
          <ArrowRight style={{ width: 12, height: 12 }} />
        </Button>
      ),
    },
  ];

  return (
    <div style={{ marginTop: '20px' }}>
      {/* Filter Row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '16px', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
          <span style={{ color: 'var(--text-muted, #64748B)', fontWeight: 500 }}>Policy Status:</span>
          <select
            value={policyStatus}
            onChange={e => {
              setPolicyStatus(e.target.value);
              setPage(1);
            }}
            style={{
              borderRadius: '6px',
              border: '1px solid var(--border-subtle, #E2E8F0)',
              backgroundColor: 'var(--bg-surface, #F8FAFC)',
              padding: '5px 10px',
              fontSize: '12px',
              color: 'var(--text-primary, #0F172A)',
            }}
          >
            <option value="all">All Policy Statuses</option>
            <option value="approved">Approved</option>
            <option value="pending_approval">Pending Approval</option>
            <option value="testing">Testing</option>
            <option value="unverified">Unverified</option>
            <option value="rejected">Rejected</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
          <span style={{ color: 'var(--text-muted, #64748B)', fontWeight: 500 }}>Domain Verification:</span>
          <select
            value={verificationStatus}
            onChange={e => {
              setVerificationStatus(e.target.value);
              setPage(1);
            }}
            style={{
              borderRadius: '6px',
              border: '1px solid var(--border-subtle, #E2E8F0)',
              backgroundColor: 'var(--bg-surface, #F8FAFC)',
              padding: '5px 10px',
              fontSize: '12px',
              color: 'var(--text-primary, #0F172A)',
            }}
          >
            <option value="all">All Verification</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="revoked">Revoked</option>
          </select>
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
        onPageSizeChange={size => {
          setPageSize(size);
          setPage(1);
        }}
        search={search}
        onSearchChange={val => {
          setSearch(val);
          setPage(1);
        }}
        searchPlaceholder="Search websites by domain, URL, or promoter email…"
        emptyMessage="No promoter websites found matching your query."
      />
    </div>
  );
}
