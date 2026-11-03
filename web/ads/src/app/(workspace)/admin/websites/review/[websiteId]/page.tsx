'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { sessionFetch } from '@/lib/session';
import { WebsitePolicyReview } from '@/components/console/WebsitePolicyReview';
import { DeliveryReadinessPanel } from '@/components/console/DeliveryReadinessPanel';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  ExternalLink,
  Globe,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Layers,
  History,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

export default function AdminWebsiteDetailPage({
  params,
}: {
  params: Promise<{ websiteId: string }>;
}) {
  const router = useRouter();
  const { websiteId } = use(params);

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshCount, setRefreshCount] = useState(0);
  const [checkingSlotId, setCheckingSlotId] = useState<string | null>(null);
  const [slotCheckMessage, setSlotCheckMessage] = useState<{ id: string; text: string; ok: boolean } | null>(null);

  async function handleCheckSlot(slotId: string) {
    setCheckingSlotId(slotId);
    setSlotCheckMessage(null);
    try {
      const res = await sessionFetch(`/api/v1/adstation/admin/slots/${slotId}/check-installation`, {
        method: 'POST',
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || `Check failed with HTTP ${res.status}`);
      }
      setSlotCheckMessage({
        id: slotId,
        text: json.data?.diagnostic || `Status: ${json.data?.installationStatus}`,
        ok: json.data?.isInstalled === true || json.data?.installationStatus === 'verified',
      });
      setRefreshCount((v) => v + 1);
    } catch (err) {
      setSlotCheckMessage({
        id: slotId,
        text: err instanceof Error ? err.message : 'Failed to verify slot installation',
        ok: false,
      });
    } finally {
      setCheckingSlotId(null);
    }
  }

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    sessionFetch(`/api/v1/adstation/admin/websites/${websiteId}`)
      .then(async res => {
        if (!res.ok) throw new Error(`Failed to load website inspection data (HTTP ${res.status}).`);
        const json = await res.json();
        if (json.status !== 'success' || !json.data) throw new Error('Invalid website payload.');
        if (active) {
          setData(json.data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (active) {
          setError(err.message || 'Could not load website inspection.');
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [websiteId, refreshCount]);

  if (loading) {
    return (
      <section className="cf-moderation" aria-label="Loading website inspection">
        <p role="status">Loading website review details…</p>
      </section>
    );
  }

  if (error || !data?.website) {
    return (
      <section className="cf-moderation" aria-label="Website error">
        <header>
          <Button variant="ghost" size="sm" onClick={() => router.back()} style={{ paddingLeft: 0 }}>
            <ArrowLeft style={{ width: 16, height: 16, marginRight: 6 }} />
            Back to Website Approvals
          </Button>
          <h1 style={{ color: 'var(--color-crimson)' }}>Website Unavailable</h1>
          <p>{error || 'Website not found.'}</p>
        </header>
      </section>
    );
  }

  const { website, slots, history, readiness } = data;
  const isExpired = website.verificationExpiresAt ? new Date(website.verificationExpiresAt).getTime() <= Date.now() : false;
  const isOwnershipVerified = website.verificationStatus === 'verified' && !isExpired;
  const isPolicyApproved = website.policyStatus === 'approved';

  return (
    <section className="cf-moderation" aria-label="Website review and approval">
      <header style={{ marginBottom: '24px' }}>
        <div style={{ marginBottom: '12px' }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/admin/websites/review')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              paddingLeft: 0,
              color: 'var(--text-secondary, #475569)',
              fontWeight: 500,
            }}
          >
            <ArrowLeft style={{ width: 16, height: 16 }} />
            Back to Website Approvals Directory
          </Button>
        </div>

        <p className="cf-mod-eyebrow">Advertising operations · Supply Policy Inspection</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div>
            <h1 style={{ margin: '4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Globe style={{ width: 24, height: 24, color: 'var(--color-crimson)' }} />
              {website.domain}
            </h1>
            <p style={{ margin: 0, color: 'var(--text-muted, #64748B)', fontFamily: 'monospace', fontSize: '13px' }}>
              URL: {website.url} · Promoter: {website.promoterEmail || website.promoterId}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link
              href={`/admin/websites/${website.id}/performance`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--color-crimson, #D4143A)',
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid var(--border-subtle, #E2E8F0)',
                backgroundColor: 'var(--bg-surface, #F8FAFC)',
                textDecoration: 'none',
              }}
            >
              <span>View Traffic Performance</span>
              <ExternalLink style={{ width: 12, height: 12 }} />
            </Link>
          </div>
        </div>
      </header>

      {/* Overview Status Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <div style={{ padding: '16px', backgroundColor: 'var(--bg-elevated)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted, #64748B)', fontWeight: 500 }}>Domain Ownership</div>
          <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            {isOwnershipVerified ? <CheckCircle2 size={18} color="var(--color-success, #10B981)" /> : <XCircle size={18} color="var(--color-error, #EF4444)" />}
            <span style={{ fontWeight: 700, fontSize: '15px', color: isOwnershipVerified ? 'var(--color-success)' : 'var(--color-error)' }}>
              {isExpired ? 'Expired' : website.verificationStatus === 'verified' ? 'Verified' : 'Unverified'}
            </span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            {isExpired ? 'Domain ownership expired.' : isOwnershipVerified ? 'Domain DNS ownership confirmed.' : 'Requires promoter DNS/HTML token.'}
          </div>
        </div>

        <div style={{ padding: '16px', backgroundColor: 'var(--bg-elevated)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted, #64748B)', fontWeight: 500 }}>Suitability Policy</div>
          <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            {isPolicyApproved ? <ShieldCheck size={18} color="var(--color-success, #10B981)" /> : <Clock size={18} color="var(--color-warning, #D97706)" />}
            <span style={{ fontWeight: 700, fontSize: '15px', textTransform: 'capitalize' }}>
              {website.policyStatus.replaceAll('_', ' ')}
            </span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Policy Revision {website.policyRevision}
          </div>
        </div>

        <div style={{ padding: '16px', backgroundColor: 'var(--bg-elevated)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted, #64748B)', fontWeight: 500 }}>Paid Ad Eligibility</div>
          <div style={{ marginTop: '6px', fontWeight: 700, fontSize: '15px', color: isOwnershipVerified && isPolicyApproved ? 'var(--color-success)' : 'var(--color-warning)' }}>
            {isOwnershipVerified && isPolicyApproved ? 'Eligible for Paid Ads' : 'Blocked / Pending'}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            {!isOwnershipVerified ? 'Blocked: Domain ownership unverified' : !isPolicyApproved ? 'Blocked: Staff suitability approval required' : 'Meets network supply criteria'}
          </div>
        </div>

        <div style={{ padding: '16px', backgroundColor: 'var(--bg-elevated)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted, #64748B)', fontWeight: 500 }}>Configured Ad Slots</div>
          <div style={{ marginTop: '6px', fontWeight: 700, fontSize: '15px' }}>
            {slots.length} Slots
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            {slots.filter((s: any) => s.isActive).length} active · {slots.filter((s: any) => s.installationStatus === 'verified').length} verified code
          </div>
        </div>
      </div>

      {/* Section 1: Domain Ownership Proof Details */}
      <div style={{ padding: '20px', backgroundColor: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border-subtle)', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 12px 0' }}>Domain Ownership Verification Evidence</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', fontSize: '13px' }}>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Verification Method:</span>
            <div style={{ fontWeight: 600, marginTop: '2px' }}>{website.verificationMethod === 'dns_txt' ? 'DNS TXT Record' : 'HTML File + Meta Tag'}</div>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Verification Token:</span>
            <div style={{ fontFamily: 'monospace', fontWeight: 600, marginTop: '2px', wordBreak: 'break-all' }}>{website.verificationToken}</div>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Verified At:</span>
            <div style={{ marginTop: '2px' }}>{website.verifiedAt ? new Date(website.verifiedAt).toLocaleString() : 'Never verified'}</div>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Token Expiry:</span>
            <div style={{ marginTop: '2px', color: isExpired ? 'var(--color-error)' : 'inherit' }}>
              {website.verificationExpiresAt ? new Date(website.verificationExpiresAt).toLocaleString() : 'No expiry recorded'}
              {isExpired && ' (EXPIRED)'}
            </div>
          </div>
        </div>
        {website.verificationErrorMessage && (
          <div style={{ marginTop: '12px', padding: '10px 14px', backgroundColor: 'rgba(239, 68, 68, 0.08)', borderRadius: '6px', border: '1px solid rgba(239, 68, 68, 0.2)', color: 'var(--color-crimson)', fontSize: '12px' }}>
            Last verification attempt error: {website.verificationErrorMessage}
          </div>
        )}
      </div>

      {/* Section 2: Reused Website Policy Review Form */}
      <div style={{ marginBottom: '28px' }}>
        <WebsitePolicyReview
          websiteId={website.id}
          currentPolicy={website.policyStatus}
          onSaved={() => setRefreshCount(v => v + 1)}
        />
      </div>

      {/* Section 3: Associated Ad Slots */}
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>Associated Ad Slots ({slots.length})</h2>
        {slots.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No ad slots configured on this website yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Slot Name & Tag</TableHead>
                <TableHead>Format & Dimensions</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Installation Status</TableHead>
                <TableHead>Lifecycle</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {slots.map((slot: any) => (
                <TableRow key={slot.id}>
                  <TableCell>
                    <div style={{ fontWeight: 600 }}>{slot.name}</div>
                    <div style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-muted)' }}>{slot.slotTagId}</div>
                  </TableCell>
                  <TableCell>
                    <div style={{ textTransform: 'capitalize' }}>{slot.format}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {slot.responsive ? 'Responsive' : `${slot.width} × ${slot.height} px`}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span style={{ fontSize: '12px', textTransform: 'capitalize' }}>{slot.slotType}</span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      style={{
                        fontSize: '11px',
                        backgroundColor: slot.installationStatus === 'verified' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                        color: slot.installationStatus === 'verified' ? 'var(--color-success)' : 'var(--color-warning)',
                      }}
                    >
                      {slot.installationStatus.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span style={{ fontSize: '12px', textTransform: 'capitalize' }}>{slot.lifecycleStatus}</span>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={checkingSlotId === slot.id}
                      onClick={() => handleCheckSlot(slot.id)}
                      style={{ fontSize: '11px', height: '28px', padding: '0 8px' }}
                    >
                      {checkingSlotId === slot.id ? 'Checking...' : 'Check Install'}
                    </Button>
                    <Link
                      href={`/admin/ad-slots/${slot.id}`}
                      style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: 'var(--color-crimson)',
                        textDecoration: 'none',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        border: '1px solid var(--border-subtle)',
                        backgroundColor: 'var(--bg-surface)',
                      }}
                    >
                      Inspect Slot
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {slotCheckMessage && (
          <div
            style={{
              marginTop: '12px',
              padding: '10px 14px',
              borderRadius: '6px',
              fontSize: '12px',
              backgroundColor: slotCheckMessage.ok ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              border: `1px solid ${slotCheckMessage.ok ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
              color: slotCheckMessage.ok ? 'var(--color-success)' : 'var(--color-danger, #ef4444)',
            }}
          >
            <strong>Slot Verification Result:</strong> {slotCheckMessage.text}
          </div>
        )}
      </div>

      {/* Section 4: Paid Delivery Readiness Gates */}
      {readiness && (
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>Paid Delivery Readiness Assessment</h2>
          <DeliveryReadinessPanel report={readiness} canAct={false} onReload={() => setRefreshCount(v => v + 1)} />
        </div>
      )}

      {/* Section 5: Immutable Audit Ledger */}
      <div>
        <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>Policy Decision Audit History ({history.length})</h2>
        {history.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No recorded state transitions for this website.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Actor / Role</TableHead>
                <TableHead>Transition</TableHead>
                <TableHead>Reviewer Note / Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((entry: any) => (
                <TableRow key={entry.id}>
                  <TableCell style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {new Date(entry.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell style={{ fontSize: '12px' }}>
                    <div style={{ fontWeight: 500 }}>{entry.actorRole || 'staff'}</div>
                    <div style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                      {entry.actorId ? String(entry.actorId).slice(0, 8) + '…' : 'system'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span style={{ fontSize: '12px', fontFamily: 'monospace' }}>
                      {entry.fromState || 'initial'} → <strong style={{ color: 'var(--color-crimson)' }}>{entry.toState}</strong>
                    </span>
                  </TableCell>
                  <TableCell style={{ fontSize: '12px', maxWidth: '300px' }}>
                    {entry.reason || 'No note recorded'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </section>
  );
}

