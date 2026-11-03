'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { sessionFetch } from '@/lib/session';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  ArrowLeft,
  History,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Layers,
  Globe,
  DollarSign,
  Copy,
  Check,
  HelpCircle,
} from 'lucide-react';

export default function AuctionDecisionDetailPage({
  params,
}: {
  params: Promise<{ requestId: string }>;
}) {
  const router = useRouter();
  const { requestId } = use(params);

  const [decision, setDecision] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    sessionFetch(`/api/v1/adstation/admin/auction-decisions/${encodeURIComponent(requestId)}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (json.status !== 'success' || !json.data) throw new Error('Auction record unavailable');
        if (active) {
          setDecision(json.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (active) {
          setError(err instanceof Error ? err.message : 'Could not load decision record');
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [requestId]);

  function copyText(txt: string) {
    navigator.clipboard.writeText(txt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return (
      <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading auction decision trace…
      </div>
    );
  }

  if (error || !decision) {
    return (
      <div role="alert" style={{ padding: '32px 0' }}>
        <p style={{ color: 'var(--color-error)' }}>{error || 'Decision trace not found'}</p>
        <Button variant="outline" onClick={() => router.push('/admin/auction-logs')} style={{ marginTop: '12px' }}>
          <ArrowLeft style={{ width: 14, height: 14, marginRight: '6px' }} /> Back to Auction Logs
        </Button>
      </div>
    );
  }

  const isPaid = decision.inventoryClass === 'paid';
  const isHouse = decision.inventoryClass === 'house';
  const exclusions = Array.isArray(decision.excludedCandidates) ? decision.excludedCandidates : [];
  const primaryReason = exclusions[0]?.reasonCode || (isHouse ? 'HOUSE_FALLBACK' : 'PAID_WINNER_SELECTED');
  const terminationStage = (exclusions[0] as any)?.stage || (decision.candidateCount === 0 ? 'supply_admission' : 'auction');

  return (
    <div style={{ padding: '24px 0', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Back button */}
      <div>
        <Link
          href="/admin/auction-logs"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            color: 'var(--color-crimson)',
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          <ArrowLeft style={{ width: 14, height: 14 }} /> Back to Auction Logs
        </Link>
      </div>

      {/* Header Overview Card */}
      <Card style={{ padding: '24px', borderRadius: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                Auction Decision Trace
              </h1>
              <Badge
                variant="outline"
                style={{
                  textTransform: 'uppercase',
                  fontSize: '12px',
                  fontWeight: 700,
                  backgroundColor: isPaid ? 'rgba(16, 185, 129, 0.1)' : isHouse ? 'rgba(245, 158, 11, 0.1)' : 'rgba(100, 116, 139, 0.1)',
                  color: isPaid ? 'var(--color-success)' : isHouse ? '#B45309' : 'var(--text-muted)',
                }}
              >
                ● {decision.inventoryClass.replace('_', ' ')}
              </Badge>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
              <span style={{ fontFamily: 'monospace', fontSize: '13px', color: 'var(--text-muted)' }}>
                Request: {decision.requestId}
              </span>
              <button
                type="button"
                onClick={() => copyText(decision.requestId)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: 'var(--text-muted)' }}
              >
                {copied ? <Check style={{ width: 12, height: 12, color: 'var(--color-success)' }} /> : <Copy style={{ width: 12, height: 12 }} />}
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Recorded At</span>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
              {new Date(decision.createdAt).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Primary Outcome Banner */}
        <div
          style={{
            marginTop: '20px',
            padding: '16px',
            borderRadius: '8px',
            backgroundColor: isPaid ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
            border: `1px solid ${isPaid ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)'}`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 700, color: isPaid ? 'var(--color-success)' : 'var(--color-crimson)' }}>
                Primary Termination Outcome
              </span>
              <div style={{ fontSize: '16px', fontFamily: 'monospace', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
                {primaryReason}
              </div>
            </div>
            <Badge variant="outline" style={{ fontSize: '12px', fontWeight: 600 }}>
              Terminated at: {terminationStage.replaceAll('_', ' ').toUpperCase()}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Seven-Stage Execution Pipeline */}
      <h2 style={{ fontSize: '16px', fontWeight: 700, margin: '8px 0 0 0', color: 'var(--text-primary)' }}>
        Execution Pipeline Evaluation
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
        {/* Stage 1: Supply & Website Admission */}
        <Card style={{ padding: '16px', borderRadius: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Globe style={{ width: 16, height: 16, color: 'var(--color-crimson)' }} />
            <h3 style={{ fontSize: '14px', fontWeight: 700, margin: 0 }}>01. Supply & Website Admission</h3>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 10px 0' }}>
            Website policy, domain ownership, consent and slot lifecycle verification.
          </p>
          <div style={{ fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Slot Tag: </span>
              <code style={{ fontWeight: 600 }}>{decision.slotTagId}</code>
            </div>
            {decision.website && (
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Registered Domain: </span>
                <strong>{decision.website.domain}</strong> (Policy: {decision.website.policyStatus})
              </div>
            )}
            {decision.slot && (
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Slot Lifecycle: </span>
                <Badge variant="outline">{decision.slot.lifecycleStatus}</Badge>
              </div>
            )}
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Consent State: </span>
              <Badge variant="outline" style={{ fontWeight: 600 }}>
                {decision.consentState || (primaryReason.includes('CONSENT') ? 'denied' : 'unknown / not_restricted')}
              </Badge>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Traffic Risk: </span>
              <Badge variant="outline">{decision.trafficRiskStatus}</Badge>
            </div>
          </div>
        </Card>

        {/* Stage 2: Candidate Discovery */}
        <Card style={{ padding: '16px', borderRadius: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Layers style={{ width: 16, height: 16, color: 'var(--color-crimson)' }} />
            <h3 style={{ fontSize: '14px', fontWeight: 700, margin: 0 }}>02. Candidate Discovery</h3>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 10px 0' }}>
            Active campaigns with approved revisions, active creatives, and escrow.
          </p>
          <div style={{ fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Evaluated Candidates: </span>
              <strong>{terminationStage === 'consent_validation' || terminationStage === 'supply_admission' || terminationStage === 'pre_auction' ? 'Not evaluated' : decision.candidateCount}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Eligible Groups: </span>
              <strong>{terminationStage === 'consent_validation' || terminationStage === 'supply_admission' || terminationStage === 'pre_auction' ? 'Not evaluated' : decision.eligibleGroupCount}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Grouping Mode: </span>
              <code>{decision.bidderGroupingMode}</code>
            </div>
          </div>
        </Card>

        {/* Stage 3: Auction Resolution */}
        <Card style={{ padding: '16px', borderRadius: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <DollarSign style={{ width: 16, height: 16, color: 'var(--color-crimson)' }} />
            <h3 style={{ fontSize: '14px', fontWeight: 700, margin: 0 }}>03. Auction & Clearing Price</h3>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 10px 0' }}>
            Generalized second-price resolution and billing nano reservation.
          </p>
          <div style={{ fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Winner Campaign: </span>
              {decision.winnerCampaignId ? (
                <Link
                  href={`/admin/campaigns/readiness/${decision.winnerCampaignId}`}
                  style={{ fontWeight: 600, color: 'var(--color-crimson, #D4143A)', textDecoration: 'none' }}
                >
                  <code>{decision.winnerCampaignId.slice(0, 12)}… (Inspect Readiness)</code>
                </Link>
              ) : (
                <span style={{ color: 'var(--text-muted)' }}>{terminationStage === 'consent_validation' || terminationStage === 'supply_admission' || terminationStage === 'pre_auction' ? 'Not evaluated' : 'None (Fallback triggered)'}</span>
              )}
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Clearing Price: </span>
              <strong>{terminationStage === 'consent_validation' || terminationStage === 'supply_admission' || terminationStage === 'pre_auction' ? 'Not evaluated' : `$${(decision.clearingPriceMicros / 1000000).toFixed(4)}`}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Policy Version: </span>
              <code>{decision.policyVersion}</code>
            </div>
          </div>
        </Card>

        {/* Stage 4: Cryptographic Audit Integrity */}
        <Card style={{ padding: '16px', borderRadius: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <ShieldCheck style={{ width: 16, height: 16, color: 'var(--color-crimson)' }} />
            <h3 style={{ fontSize: '14px', fontWeight: 700, margin: 0 }}>04. Cryptographic Record Hash</h3>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 10px 0' }}>
            Tamper-evident hash ensuring financial and operational audit trail integrity.
          </p>
          <div style={{ fontSize: '11px', fontFamily: 'monospace', wordBreak: 'break-all', color: 'var(--text-secondary)' }}>
            {decision.recordHash}
          </div>
        </Card>
      </div>

      {/* Detailed Exclusion List */}
      <Card style={{ padding: '20px', borderRadius: '12px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 12px 0' }}>
          Candidate Exclusion & Disqualification Audit ({exclusions.length})
        </h3>
        {exclusions.length === 0 ? (
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
            {isPaid ? 'All evaluated candidates qualified for second-price auction selection.' : 'Pre-auction fallback occurred prior to candidate discovery.'}
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {exclusions.map((item: any, idx: number) => (
              <div
                key={idx}
                style={{
                  padding: '10px 14px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '8px',
                }}
              >
                <div>
                  <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--color-crimson)' }}>
                    {item.reasonCode}
                  </span>
                  {item.stage && (
                    <span style={{ marginLeft: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>
                      (Stage: {item.stage})
                    </span>
                  )}
                  {item.campaignId && (
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Campaign: <code style={{ fontFamily: 'monospace' }}>{item.campaignId}</code>
                    </div>
                  )}
                </div>
                {item.count && (
                  <Badge variant="outline" style={{ fontSize: '11px' }}>
                    {item.count} candidate(s)
                  </Badge>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

