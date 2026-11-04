'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { sessionFetch } from '@/lib/session';
import { formatAuctionUsd } from '@/lib/auction-pricing';
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

    sessionFetch(`/api/v1/admin/ads/auction-decisions/${encodeURIComponent(requestId)}`)
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
  const terminationStage = (exclusions[0] as any)?.stage || (isHouse ? 'unknown' : 'auction');
  const admission = (exclusions[0] as { admission?: Record<string, unknown> } | undefined)?.admission;
  const billingFallback = exclusions.find((item: any) => item.stage === 'billing_reserve' || item.stage === 'billing_issue') as {
    campaignId?: string; creativeId?: string; parentOpportunityId?: string; transportRequestId?: string; upstreamStatus?: number;
    creativeCompatibility?: { stackId?: string; format?: string; type?: string; status?: string; approval?: string; stackArchived?: boolean; slotId?: string; slotFormat?: string; allowedTypeSource?: string; allowedTypes?: string[]; submissionId?: string; contentRevision?: number };
    reasonCode?: string; billingHandoff?: { reserve: string; issue: string; elapsedMs: number };
  } | undefined;
  const billingActions: Record<string, [string, string]> = {
    BILLING_ACCOUNT_INELIGIBLE: ['Account support', 'Check the advertiser and promoter account states in Billing.'],
    BILLING_SUPPLY_INELIGIBLE: ['Supply operations', 'Inspect slot installation, ownership and website approval.'],
    BILLING_TRAFFIC_RESTRICTED: ['Traffic operations', 'Review the active restriction in Traffic Adjustments.'],
    BILLING_CAMPAIGN_INELIGIBLE: ['Campaign operations', 'Check the active campaign revision and approval in Campaign Readiness.'],
    BILLING_CREATIVE_INELIGIBLE: ['Campaign operations', 'Check the creative approval, format and slot compatibility.'],
    BILLING_CREATIVE_NOT_FOUND: ['Campaign operations', 'Check that the selected creative belongs to the campaign.'],
    BILLING_CREATIVE_INACTIVE: ['Campaign operations', 'Inspect the selected creative lifecycle.'],
    BILLING_CREATIVE_NOT_APPROVED: ['Campaign operations', 'Inspect the selected creative’s moderation state.'],
    BILLING_CREATIVE_STACK_NOT_FOUND: ['Campaign operations', 'Inspect the creative’s stack association.'],
    BILLING_CREATIVE_STACK_ARCHIVED: ['Campaign operations', 'Select a creative from an eligible stack.'],
    BILLING_CREATIVE_STACK_MISMATCH: ['Campaign operations', 'Verify that the stack belongs to the selected campaign.'],
    BILLING_CREATIVE_FORMAT_MISMATCH: ['Campaign operations', 'Compare the selected creative and slot formats.'],
    BILLING_CREATIVE_VIDEO_DISABLED: ['Ads operations', 'Check the video release policy.'],
    BILLING_CREATIVE_SLOT_TYPES_INVALID: ['Supply operations', 'Correct the slot’s invalid creative type settings.'],
    BILLING_CREATIVE_TYPE_NOT_ALLOWED: ['Supply operations', 'Check whether the selected type is permitted for this slot.'],
    BILLING_MEDIA_UNAVAILABLE: ['Campaign operations', 'Check media readiness for the selected creative.'],
    BILLING_RENDITION_INVALID: ['Campaign operations', 'Check the approved creative rendition for this slot.'],
    BILLING_ESCROW_INACTIVE: ['Billing operations', 'Inspect the campaign escrow and its funding status.'],
    BILLING_FUNDING_PROOF_INVALID: ['Billing operations', 'Reconcile the funding receipt with the escrow.'],
    BILLING_FUNDING_PROOF_UNAVAILABLE: ['Billing operations', 'Locate and verify the escrow funding receipt.'],
    BILLING_CAPACITY_UNAVAILABLE: ['Billing operations', 'Check reservable budget, pacing and frequency limits.'],
    BILLING_QUOTE_INVALID: ['Ads and Billing engineering', 'Compare the clearing quote with the funded pricing contract.'],
    BILLING_DECISION_POLICY_MISMATCH: ['Ads and Billing engineering', 'Compare the auction policy and pricing inputs.'],
    BILLING_DECISION_BINDING_MISMATCH: ['Ads and Billing engineering', 'Compare the decision and reservation binding.'],
    BILLING_IDENTITY_CONFLICT: ['Billing operations', 'Reconcile the existing opportunity before considering a retry.'],
    BILLING_DEADLINE_INVALID: ['Ads and Billing engineering', 'Check the request deadline and service timing.'],
  };
  const billingAction = billingActions[billingFallback?.reasonCode ?? ''];
  const pricing = decision.pricingBreakdown;
  const clearingEcpm = formatAuctionUsd(decision.clearingPriceMicros, 6);
  const eventPrice = formatAuctionUsd(decision.billingPriceNanos, 9);
  const eventUnit = decision.pricingModel === 'cpc' ? 'eligible click' : decision.pricingModel === 'cpm' ? 'eligible viewable impression' : null;

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
                <strong>{decision.website.domain}</strong> (Policy: {decision.website.policyStatus}, Ownership: {decision.website.verificationStatus})
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

            {/* Historical Execution Record */}
            <div
              style={{
                marginTop: '8px',
                padding: '10px',
                borderRadius: '6px',
                backgroundColor: 'rgba(0, 0, 0, 0.03)',
                border: '1px solid var(--border-subtle, rgba(0, 0, 0, 0.08))',
                fontSize: '11px',
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: '4px', color: 'var(--text-primary)' }}>
                Historical Execution Record (Immutable):
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Recorded Outcome: </span>
                <code style={{ fontWeight: 700, color: isPaid ? 'var(--color-success)' : 'var(--color-crimson)' }}>{primaryReason}</code>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Termination Stage: </span>
                <span>{terminationStage}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Policy Version: </span>
                <span>{decision.policyVersion || 'auction_v1'}</span>
              </div>
              {admission && (
                <dl>
                  {Object.entries({
                    'Slot lifecycle': admission.slotLifecycle,
                    'Website policy': admission.websitePolicy,
                    'Paid release ready': admission.paidReady,
                    'Release readiness reason': admission.paidReadinessReason,
                    'Traffic restricted': admission.trafficRestricted,
                    'Traffic risk': admission.trafficRisk,
                    'Consent state': admission.consentState,
                    'Measurement consent': admission.measurementConsent,
                  }).map(([label, value]) => (
                    <div key={label}><dt>{label}</dt><dd>{value == null ? 'Not recorded' : String(value)}</dd></div>
                  ))}
                </dl>
              )}
            </div>

            {/* Live Current Platform Diagnostics (clearly delineated from historical record) */}
            {decision.platformDiagnostics && (
              <div
                style={{
                  marginTop: '8px',
                  padding: '10px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--bg-surface-elevated, rgba(0, 0, 0, 0.03))',
                  border: '1px solid var(--border-subtle, rgba(0, 0, 0, 0.08))',
                  fontSize: '11px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                    Current Platform Readiness (Live):
                  </span>
                  <Badge variant="secondary" style={{ fontSize: '10px' }}>Server Live State</Badge>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Paid Serving Enabled (ADS_PAID_SERVING_ENABLED):</span>
                    <strong>{decision.platformDiagnostics.checks?.servingRequested ? '✓ Enabled' : '✗ Disabled'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Paid Release Approved (ADS_PAID_RELEASE_ENABLED):</span>
                    <strong>{decision.platformDiagnostics.checks?.releaseApproved ? '✓ Approved' : '✗ Approval Required'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Auction Policy Approval (ADS_AUCTION_POLICY_APPROVAL):</span>
                    <strong>{decision.platformDiagnostics.checks?.policyApproved ? '✓ Valid' : '✗ Missing / Invalid JSON'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Billing Authority (INTERNAL_ECOSYSTEM_KEY & URL):</span>
                    <strong>{decision.platformDiagnostics.checks?.billingAuthorityConfigured ? '✓ Configured' : '✗ Unset / Incomplete'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Evidence Key Secret (ADS_EVIDENCE_HASH_SECRET ≥32B):</span>
                    <strong>{decision.platformDiagnostics.checks?.evidenceKeyConfigured ? '✓ Configured' : '✗ Invalid / <32 Bytes'}</strong>
                  </div>
                </div>
                {decision.platformDiagnostics.blockers && decision.platformDiagnostics.blockers.length > 0 && (
                  <div style={{ marginTop: '6px', color: 'var(--color-crimson)', fontWeight: 600 }}>
                    Active Platform Blockers: {decision.platformDiagnostics.blockers.join(', ')}
                  </div>
                )}
              </div>
            )}
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
              <strong>{primaryReason === 'DELIVERY_DEADLINE_EXCEEDED' ? 'Incomplete' : terminationStage === 'unknown' ? 'Unknown' : terminationStage === 'consent_validation' || terminationStage === 'supply_admission' || terminationStage === 'pre_auction' ? 'Not evaluated' : decision.candidateCount}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Eligible Groups: </span>
              <strong>{billingFallback ? 'Not recorded for paid auction' : primaryReason === 'DELIVERY_DEADLINE_EXCEEDED' ? 'Incomplete' : terminationStage === 'unknown' ? 'Unknown' : terminationStage === 'consent_validation' || terminationStage === 'supply_admission' || terminationStage === 'pre_auction' ? 'Not evaluated' : decision.eligibleGroupCount}</strong>
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
                <span style={{ color: 'var(--text-muted)' }}>{billingFallback?.campaignId ? `${billingFallback.campaignId} (selected before fallback)` : primaryReason === 'DELIVERY_DEADLINE_EXCEEDED' ? 'Incomplete' : terminationStage === 'unknown' ? 'Unknown' : terminationStage === 'consent_validation' || terminationStage === 'supply_admission' || terminationStage === 'pre_auction' ? 'Not evaluated' : 'None (Fallback triggered)'}</span>
              )}
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Clearing eCPM: </span>
              <strong>{billingFallback ? 'Not recorded for paid auction' : isPaid ? clearingEcpm ? `${clearingEcpm} per 1,000 impressions` : 'Not recorded' : 'Not applicable'}</strong>
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

      {isPaid && (
        <Card style={{ padding: '20px' }}>
          <h3>Auction Pricing Breakdown</h3>
          <dl>
            <dt>Advertiser bid</dt><dd>{pricing?.bidUsdCents != null ? `${formatAuctionUsd(pricing.bidUsdCents, 2)} ${decision.pricingModel?.toUpperCase()}` : 'Not recorded'}</dd>
            <dt>Predicted click rate</dt><dd>{decision.pricingModel === 'cpc' && pricing?.pctrBasisPoints != null ? `${Number(pricing.pctrBasisPoints) / 100}%` : 'Not recorded or not applicable'}</dd>
            <dt>Winning bid eCPM</dt><dd>{formatAuctionUsd(pricing?.winnerScoreMicros, 6) ?? 'Not recorded'}</dd>
            <dt>Clearing basis</dt><dd>{pricing?.clearingBasis === 'single_group_reserve' ? 'One advertiser group. Reserve floor applied.' : pricing?.clearingBasis === 'runner_up_with_floor' ? 'Runner-up score with reserve floor and winner bid cap' : 'Not recorded'}</dd>
            <dt>Reserve or second-price input eCPM</dt><dd>{formatAuctionUsd(pricing?.secondPriceMicros, 6) ?? 'Not recorded'}</dd>
            <dt>Price per billable event</dt><dd>{eventPrice && eventUnit ? `${eventPrice} per ${eventUnit}` : 'Not recorded'}</dd>
            <dt>Recorded reservation amount</dt><dd>{formatAuctionUsd(pricing?.reservedNanos, 9) ?? 'Not recorded'}{pricing?.reservationState ? ` (${pricing.reservationState})` : ''}</dd>
            <dt>Settlement claim</dt><dd>{pricing?.claimId ? pricing.batchStatus ?? 'Recorded' : 'No correlated claim recorded'}</dd>
            <dt>Recorded advertiser debit</dt><dd>{formatAuctionUsd(pricing?.settledDebitCents, 2) ?? 'No correlated debit recorded'}</dd>
            <dt>Recorded publisher earnings</dt><dd>{formatAuctionUsd(pricing?.publisherEarningsCents, 2) ?? 'No correlated earnings recorded'}{pricing?.publisherClearanceStatus ? ` (${pricing.publisherClearanceStatus})` : ''}</dd>
          </dl>
        </Card>
      )}

      {billingFallback && (
        <Card style={{ padding: '20px' }}>
          <h3>Billing Handoff</h3>
          <dl>
            <dt>Selected campaign</dt><dd>{billingFallback.campaignId ?? 'Unknown'}</dd>
            <dt>Reservation</dt><dd>{billingFallback.billingHandoff?.reserve ?? 'Unknown'}</dd>
            <dt>Issuance</dt><dd>{billingFallback.billingHandoff?.issue ?? 'Unknown'}</dd>
            <dt>Reason</dt><dd>{billingFallback.reasonCode ?? 'Unknown'}</dd>
            <dt>Responsible team</dt><dd>{billingAction?.[0] ?? 'Billing operations'}</dd>
            <dt>Next action</dt><dd>{billingAction?.[1] ?? 'Correlate Billing evidence by opportunity ID. The specific rule was not recorded.'}</dd>
            <dt>Billing HTTP status</dt><dd>{billingFallback.upstreamStatus ?? 'Not recorded'}</dd>
            <dt>Elapsed time</dt><dd>{billingFallback.billingHandoff ? `${billingFallback.billingHandoff.elapsedMs} ms` : 'Not recorded'}</dd>
            <dt>Parent opportunity</dt><dd>{billingFallback.parentOpportunityId ?? 'Not recorded'}</dd>
            <dt>Transport request</dt><dd>{billingFallback.transportRequestId ?? 'Not recorded'}</dd>
          </dl>
          <h4>Selected Creative &amp; Compatibility</h4>
          <dl>
            <dt>Creative ID</dt><dd>{billingFallback.creativeId ?? 'Not recorded'}</dd>
            <dt>Stack ID</dt><dd>{billingFallback.creativeCompatibility?.stackId ?? 'Not recorded'}</dd>
            <dt>Creative format</dt><dd>{billingFallback.creativeCompatibility?.format ?? 'Not recorded'}</dd>
            <dt>Slot format</dt><dd>{billingFallback.creativeCompatibility?.slotFormat ?? 'Not recorded'}</dd>
            <dt>Creative type</dt><dd>{billingFallback.creativeCompatibility?.type ?? 'Not recorded'}</dd>
            <dt>Status at selection</dt><dd>{billingFallback.creativeCompatibility?.status ?? 'Not recorded'}</dd>
            <dt>Approval at selection</dt><dd>{billingFallback.creativeCompatibility?.approval ?? 'Not recorded'}</dd>
            <dt>Stack archived at selection</dt><dd>{typeof billingFallback.creativeCompatibility?.stackArchived === 'boolean' ? billingFallback.creativeCompatibility.stackArchived ? 'Yes' : 'No' : 'Not recorded'}</dd>
            <dt>Allowed type policy</dt><dd>{billingFallback.creativeCompatibility?.allowedTypeSource ?? 'Not recorded'}</dd>
            <dt>Allowed creative types</dt><dd>{billingFallback.creativeCompatibility?.allowedTypes?.join(', ') || (billingFallback.creativeCompatibility?.allowedTypes ? 'None' : 'Not recorded')}</dd>
            <dt>Campaign submission</dt><dd>{billingFallback.creativeCompatibility?.submissionId ?? 'Not recorded'}</dd>
            <dt>Content revision</dt><dd>{billingFallback.creativeCompatibility?.contentRevision ?? 'Not recorded'}</dd>
          </dl>
        </Card>
      )}

      {/* Detailed Exclusion List */}
      <Card style={{ padding: '20px', borderRadius: '12px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 12px 0' }}>
          Candidate Exclusions and Fallback Evidence ({exclusions.length})
        </h3>
        {exclusions.length === 0 ? (
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
            {isPaid ? 'No candidate exclusions were recorded.' : 'No candidate exclusions were recorded for this fallback.'}
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
                  {typeof item.upstreamStatus === 'number' && (
                    <span style={{ marginLeft: '8px' }}>Billing HTTP {item.upstreamStatus}</span>
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

