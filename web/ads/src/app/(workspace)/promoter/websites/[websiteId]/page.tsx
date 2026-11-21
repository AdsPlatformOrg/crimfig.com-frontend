'use client';

import React, { use, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as Dialog from '@radix-ui/react-dialog';
import {
  Globe,
  ArrowLeft,
  ShieldCheck,
  ShieldAlert,
  Copy,
  Check,
  Code2,
  ExternalLink,
  Loader2,
  Sparkles,
  Plus,
  Layers,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  X,
  FileCode,
} from 'lucide-react';
import { loadWebsites, verifyWebsite } from '@/lib/campaigns-api';
import { sessionFetch } from '@/lib/session';
import { apiData } from '@/lib/api-data';
import { houseRewardEligibility } from '@/lib/cfig-format';
import {
  generateCrimFigVerifyMetaTag,
} from '@/components/CrimFigAdSlot';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';

interface PromoterWebsite {
  id: string;
  domain: string;
  url: string;
  verificationToken: string;
  verificationMethod: 'html_file_and_meta_tag' | 'dns_txt';
  verificationStatus?: string;
  verificationExpiresAt?: string;
  isSuspended?: boolean;
  isActive?: boolean;
  verificationErrorMessage?: string | null;
  policyStatus?: string;
  policyRevision?: number;
  isVerified: boolean;
  lastPingAt: string;
  activePlacementCount: number;
}

interface PublisherSlot {
  id: string;
  websiteId: string;
  name: string;
  slotType: 'network' | 'consideration' | 'direct' | 'hybrid';
  format?: string;
  width?: number;
  height?: number;
  lifecycleStatus?: string;
  installationStatus?: string;
  isActive?: boolean;
}

export default function PromoterWebsiteDetailPage({
  params,
}: {
  params: Promise<{ websiteId: string }>;
}) {
  const { websiteId } = use(params);
  return <WebsiteDetail key={websiteId} websiteId={websiteId} />;
}

function WebsiteDetail({ websiteId }: { websiteId: string }) {
  const router = useRouter();
  const detailRequest = useRef(0);
  const slotRequest = useRef(0);
  const copyRequest = useRef(0);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [copyFallback, setCopyFallback] = useState<string | null>(null);
  const [slotState, setSlotState] = useState<'loading' | 'ready' | 'failed'>('loading');

  const [website, setWebsite] = useState<PromoterWebsite | null>(null);
  const [slots, setSlots] = useState<PublisherSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Verification & Copy actions
  const [verifying, setVerifying] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [verificationResultDialog, setVerificationResultDialog] = useState<{
    open: boolean;
    isVerified: boolean;
    message: string;
  }>({ open: false, isVerified: false, message: '' });

  // Policy Review submission
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccessMessage, setReviewSuccessMessage] = useState<string | null>(null);

  // Embed Code Modal

  const loadSlots = async () => {
    const request = ++slotRequest.current;
    setSlots([]);
    setSlotState('loading');
    try {
      const response = await sessionFetch(`/api/v1/publisher/websites/${encodeURIComponent(websiteId)}/slots`);
      if (!response.ok) throw new Error('Slots unavailable');
      const { data } = await response.json();
      if (!Array.isArray(data)) throw new Error('Invalid slots response');
      if (request !== slotRequest.current) return;
      setSlots(data);
      setSlotState('ready');
    } catch {
      if (request === slotRequest.current) setSlotState('failed');
    }
  };

  const loadData = async () => {
    const request = ++detailRequest.current;
    setLoading(true);
    setError(null);
    try {
      const sites = await loadWebsites();
      if (request !== detailRequest.current) return;
      const currentSite = sites.find((site) => site.id === websiteId);
      if (!currentSite) {
        setError('Website not found.');
        return;
      }
      setWebsite(currentSite);
      void loadSlots();
    } catch (err) {
      if (request === detailRequest.current) {
        setError(err instanceof Error ? err.message : 'Failed to load website details.');
      }
    } finally {
      if (request === detailRequest.current) setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
    return () => {
      detailRequest.current++;
      slotRequest.current++;
      copyRequest.current++;
      clearTimeout(copyTimer.current);
    };
    // The keyed detail view remounts when the website changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCopy = async (text: string, id: string) => {
    const request = ++copyRequest.current;
    clearTimeout(copyTimer.current);
    setCopiedToken(null);
    setCopyFallback(null);
    try {
      await navigator.clipboard.writeText(text);
      if (request !== copyRequest.current) return;
      setCopiedToken(id);
      copyTimer.current = setTimeout(() => setCopiedToken(null), 2500);
    } catch {
      if (request === copyRequest.current) setCopyFallback(text);
    }
  };

  const handleTriggerVerification = async () => {
    if (!website || verifying) return;
    setVerifying(true);
    try {
      const outcome = await verifyWebsite(website.id);
      const isOk = outcome.isVerified === true;
      const msg = isOk
        ? `Domain ownership for "${website.domain}" was verified successfully!`
        : outcome.error || 'Verification check failed. Ensure the DNS TXT record or HTML meta tag is correctly published and publicly accessible.';

      setVerificationResultDialog({
        open: true,
        isVerified: isOk,
        message: msg,
      });

      // Refresh state
      await loadData();
    } catch (err) {
      setVerificationResultDialog({
        open: true,
        isVerified: false,
        message: err instanceof Error ? err.message : 'Verification check could not be completed.',
      });
    } finally {
      setVerifying(false);
    }
  };

  const handleSubmitForReview = async () => {
    if (!website || submittingReview) return;
    setSubmittingReview(true);
    setReviewSuccessMessage(null);
    try {
      await apiData(`/api/v1/promoters/websites/${website.id}/submit-review`, { method: 'POST' });
      setReviewSuccessMessage('Website submitted for suitability review. Ads staff will review your property.');
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit website for review.');
    } finally {
      setSubmittingReview(false);
    }
  };


  if (loading) {
    return (
      <div style={{ padding: '24px 0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Loading website details...</p>
      </div>
    );
  }

  if (error || !website) {
    return (
      <div style={{ padding: '24px 0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Button variant="ghost" size="sm" onClick={() => router.push('/promoter/websites')} style={{ width: 'fit-content', paddingLeft: 0 }}>
          <ArrowLeft style={{ width: 16, height: 16, marginRight: 6 }} /> Back to Registered Websites
        </Button>
        <div
          role="alert"
          style={{
            padding: '16px',
            borderRadius: '8px',
            backgroundColor: 'var(--color-error-bg)',
            color: 'var(--color-error)',
            fontSize: '14px',
            border: '1px solid rgba(220, 38, 38, 0.25)',
          }}
        >
          {error || 'Website not found.'}
        </div>
      </div>
    );
  }

  const isExpired = website.verificationExpiresAt ? new Date(website.verificationExpiresAt).getTime() <= Date.now() : false;
  const isOwnershipVerified = website.isVerified && !isExpired;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
      {copyFallback !== null && (
        <label style={{ display: 'grid', gap: 6 }} role="alert">
          Copy manually
          <textarea readOnly value={copyFallback} rows={3} onFocus={(event) => event.currentTarget.select()} />
        </label>
      )}
      {/* Navigation header */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/promoter/websites')}
          style={{ paddingLeft: 0, marginBottom: '8px', color: 'var(--text-secondary)' }}
        >
          <ArrowLeft style={{ width: 15, height: 15, marginRight: 6 }} /> Back to Registered Websites
        </Button>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Globe style={{ width: 24, height: 24, color: 'var(--color-crimson)' }} />
              <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                {website.domain}
              </h1>
              <a
                href={website.url || `https://${website.domain}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center' }}
                title="Open domain in new tab"
              >
                <ExternalLink style={{ width: 16, height: 16 }} />
              </a>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
              URL: {website.url || `https://${website.domain}`} &bull; Registered Property ID: <code>{website.id}</code>
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Button
              type="button"
              onClick={() => router.push('/promoter/websites/'+websiteId+'/slots')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                backgroundColor: 'var(--color-fig-dark)',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: 600,
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <Code2 style={{ width: 16, height: 16 }} /> Get Embed Code
            </Button>
            <Button
              type="button"
              disabled={verifying}
              onClick={handleTriggerVerification}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                backgroundColor: 'var(--color-crimson)',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: 700,
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-crimson)',
              }}
            >
              {verifying ? (
                <>
                  <Loader2 style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} /> Verifying...
                </>
              ) : (
                <>
                  <ShieldCheck style={{ width: 16, height: 16 }} /> Verify Ownership
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {reviewSuccessMessage && (
        <div
          role="status"
          style={{
            padding: '12px 16px',
            borderRadius: '8px',
            backgroundColor: 'var(--color-success-bg, #ECFDF5)',
            color: 'var(--color-success, #059669)',
            fontSize: '13px',
            border: '1px solid rgba(16, 185, 129, 0.25)',
          }}
        >
          {reviewSuccessMessage}
        </div>
      )}

      {/* Snapshot Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        <div className="theme-card" style={{ padding: '20px', borderRadius: '12px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
            Domain Ownership
          </span>
          <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 700,
                padding: '3px 10px',
                borderRadius: '9999px',
                backgroundColor: isOwnershipVerified ? 'var(--color-success-bg, #ECFDF5)' : 'var(--color-warning-bg, #FFFBEB)',
                color: isOwnershipVerified ? 'var(--color-success, #059669)' : 'var(--color-warning, #D97706)',
              }}
            >
              {isOwnershipVerified ? 'Verified Domain' : 'Verification Required'}
            </span>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px', margin: 0 }}>
            {website.verificationExpiresAt
              ? `Ownership active until ${new Date(website.verificationExpiresAt).toLocaleDateString()}`
              : 'Requires promoter DNS TXT or HTML meta verification.'}
          </p>
        </div>

        <div className="theme-card" style={{ padding: '20px', borderRadius: '12px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
            Suitability Policy
          </span>
          <div style={{ marginTop: '8px' }}>
            <Badge
              variant={
                website.policyStatus === 'approved'
                  ? 'default'
                  : website.policyStatus === 'suspended'
                  ? 'destructive'
                  : 'secondary'
              }
            >
              {(website.policyStatus || 'UNVERIFIED').toUpperCase()}
            </Badge>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px', margin: 0 }}>
            {website.policyStatus === 'approved'
              ? 'Approved for paid advertiser supply.'
              : website.policyStatus === 'pending_approval'
              ? 'Pending staff review.'
              : 'House Ads only until suitability approval.'}
          </p>
        </div>

        <div className="theme-card" style={{ padding: '20px', borderRadius: '12px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
            Reward Eligibility
          </span>
          <div style={{ marginTop: '8px' }}>
            <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
              {houseRewardEligibility(website)}
            </p>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px', margin: 0 }}>
            Testing websites earn zero $cfig.
          </p>
        </div>

        <div className="theme-card" style={{ padding: '20px', borderRadius: '12px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
            Configured Ad Slots
          </span>
          <div style={{ marginTop: '8px', display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)' }}>
              {slotState === 'ready' ? slots.length : slotState === 'failed' ? 'Unavailable' : 'Loading…'}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {slotState === 'ready' && `(${slots.filter((s) => s.isActive !== false).length} active)`}
            </span>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', margin: 0 }}>
            Placements ready to serve ads.
          </p>
        </div>
      </div>

      {/* Domain Ownership Verification Proof Instructions */}
      <div className="theme-card" style={{ padding: '24px', borderRadius: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Domain Ownership Verification Evidence
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
              Publish either the HTML Head Meta Tag or the DNS TXT Record on your website host to prove ownership.
            </p>
          </div>
          <Badge variant="outline">
            Preferred Method: {website.verificationMethod === 'html_file_and_meta_tag' ? 'HTML Meta Tag' : 'DNS TXT'}
          </Badge>
        </div>

        {website.verificationErrorMessage && !isOwnershipVerified && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              backgroundColor: 'var(--color-error-bg)',
              color: 'var(--color-error)',
              fontSize: '13px',
              marginBottom: '16px',
              border: '1px solid rgba(220, 38, 38, 0.25)',
            }}
          >
            {website.verificationErrorMessage}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {/* Option A: HTML Head Meta Tag */}
          <div
            style={{
              padding: '16px',
              borderRadius: '8px',
              border: website.verificationMethod === 'html_file_and_meta_tag' ? '2px solid var(--color-crimson)' : '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-surface, #F8FAFC)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-crimson)', textTransform: 'uppercase' }}>
                Option 1: HTML Head Meta Tag
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Place in &lt;head&gt;</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '0 0 10px' }}>
              Add this meta tag anywhere inside the root <code>&lt;head&gt;</code> section of <code>https://{website.domain}/</code>:
            </p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: '8px',
                alignItems: 'center',
                fontSize: '12px',
                backgroundColor: 'var(--bg-page)',
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <code style={{ fontFamily: 'monospace', color: 'var(--color-crimson)', wordBreak: 'break-all', fontSize: '11px' }}>
                {generateCrimFigVerifyMetaTag(website.verificationToken)}
              </code>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => handleCopy(generateCrimFigVerifyMetaTag(website.verificationToken), 'copy-meta')}
                style={{ height: '30px', padding: '0 8px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                title="Copy HTML Meta Tag"
              >
                {copiedToken === 'copy-meta' ? (
                  <>
                    <Check style={{ width: 12, height: 12, color: 'var(--color-success)' }} /> Copied
                  </>
                ) : (
                  <>
                    <Copy style={{ width: 12, height: 12 }} /> Copy
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Option B: DNS TXT Record */}
          <div
            style={{
              padding: '16px',
              borderRadius: '8px',
              border: website.verificationMethod === 'dns_txt' ? '2px solid var(--color-crimson)' : '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-surface, #F8FAFC)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-crimson)', textTransform: 'uppercase' }}>
                Option 2: DNS TXT Record
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Type: TXT</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '0 0 10px' }}>
              Add a DNS TXT record at your domain registrar or DNS hosting provider:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '80px 1fr auto',
                  gap: '8px',
                  alignItems: 'center',
                  fontSize: '12px',
                  backgroundColor: 'var(--bg-page)',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Host / Name:</span>
                <code style={{ fontFamily: 'monospace', color: 'var(--text-primary)' }}>@ (or {website.domain})</code>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => handleCopy('@', 'copy-dns-host')}
                  style={{ height: '26px', padding: '0 6px' }}
                >
                  {copiedToken === 'copy-dns-host' ? <Check style={{ width: 12, height: 12, color: 'var(--color-success)' }} /> : <Copy style={{ width: 12, height: 12 }} />}
                </Button>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '80px 1fr auto',
                  gap: '8px',
                  alignItems: 'center',
                  fontSize: '12px',
                  backgroundColor: 'var(--bg-page)',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Value:</span>
                <code style={{ fontFamily: 'monospace', color: 'var(--color-crimson)', wordBreak: 'break-all', fontSize: '11px' }}>
                  crimfig-site-verification={website.verificationToken}
                </code>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => handleCopy(`crimfig-site-verification=${website.verificationToken}`, 'copy-dns-val')}
                  style={{ height: '26px', padding: '0 6px' }}
                >
                  {copiedToken === 'copy-dns-val' ? <Check style={{ width: 12, height: 12, color: 'var(--color-success)' }} /> : <Copy style={{ width: 12, height: 12 }} />}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Status: {website.lastPingAt || 'Pending verification'} &bull; Verification Token: <code>{website.verificationToken}</code>
          </span>
          <Button
            type="button"
            disabled={verifying}
            onClick={handleTriggerVerification}
            style={{
              backgroundColor: 'var(--color-crimson)',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '12px',
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {verifying ? 'Checking Proof...' : 'Check Verification Now'}
          </Button>
        </div>
      </div>

      {/* Associated Ad Slots */}
      <div className="theme-card" style={{ padding: '24px', borderRadius: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Associated Ad Spaces &amp; Slots{slotState === 'ready' && ` (${slots.length})`}
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
              Ad spaces configured on this website property.
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            onClick={() => router.push('/promoter/websites/'+websiteId+'/slots')}
            style={{
              backgroundColor: 'var(--color-crimson)',
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: '12px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <Plus style={{ width: 14, height: 14, marginRight: 4 }} /> Setup Ad Space
          </Button>
        </div>

        {slotState === 'failed' ? (
          <div role="alert">
            <p>Ad slots could not be loaded.</p>
            <Button type="button" size="sm" variant="outline" onClick={() => void loadSlots()}>Retry loading ad slots</Button>
          </div>
        ) : slotState === 'loading' ? (
          <p role="status">Loading ad slots…</p>
        ) : slots.length === 0 ? (
          <div
            style={{
              padding: '32px 16px',
              textAlign: 'center',
              backgroundColor: 'var(--bg-surface, #F8FAFC)',
              borderRadius: '8px',
              border: '1px dashed var(--border-subtle)',
            }}
          >
            <Layers style={{ width: 32, height: 32, color: 'var(--text-muted)', margin: '0 auto 8px' }} />
            <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
              No ad slots configured on this website yet.
            </p>
            <p style={{ margin: '4px 0 12px', fontSize: '12px', color: 'var(--text-muted)' }}>
              Generate placement embed codes to monetize traffic on this domain.
            </p>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => router.push('/promoter/websites/'+websiteId+'/slots')}
            >
              <Code2 style={{ width: 14, height: 14, marginRight: 6 }} /> Get Embed Snippet
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Slot Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Format</TableHead>
                <TableHead>Status</TableHead>
                <TableHead style={{ textAlign: 'right' }}>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {slots.map((slot) => (
                <TableRow key={slot.id}>
                  <TableCell>
                    <span style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)' }}>
                      {slot.name}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{slot.slotType}</Badge>
                  </TableCell>
                  <TableCell>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {slot.format || (slot.width && slot.height ? `${slot.width}x${slot.height}` : 'Responsive')}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={slot.isActive !== false ? 'default' : 'secondary'}>
                      {slot.lifecycleStatus || (slot.isActive !== false ? 'Active' : 'Draft')}
                    </Badge>
                  </TableCell>
                  <TableCell style={{ textAlign: 'right' }}>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => router.push('/promoter/websites/'+websiteId+'/slots')}
                      style={{ fontSize: '12px' }}
                    >
                      <Code2 style={{ width: 13, height: 13, marginRight: 4 }} /> Embed Code
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Suitability Review Banner */}
      {website.isVerified && website.policyStatus === 'testing' && (
        <div
          className="theme-card"
          style={{
            padding: '20px',
            borderRadius: '12px',
            borderLeft: '4px solid var(--color-crimson)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              Ready for Paid Advertiser Supply?
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
              Your domain ownership is verified. Submit your website to our staff review queue for paid ad network approval.
            </p>
          </div>
          <Button
            type="button"
            disabled={submittingReview}
            onClick={handleSubmitForReview}
            style={{
              backgroundColor: 'var(--color-crimson)',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '12px',
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {submittingReview ? 'Submitting…' : 'Submit for Policy Approval'}
          </Button>
        </div>
      )}

      {/* Dialog: Verification Check Result Confirmation */}
      <Dialog.Root
        open={verificationResultDialog.open}
        onOpenChange={(open) => setVerificationResultDialog((prev) => ({ ...prev, open }))}
      >
        <Dialog.Portal>
          <Dialog.Overlay
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(4px)',
              zIndex: 1000,
            }}
          />
          <Dialog.Content
            style={{
              position: 'fixed',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '90%',
              maxWidth: '460px',
              backgroundColor: 'var(--bg-surface, #FFFFFF)',
              padding: '24px',
              borderRadius: '16px',
              boxShadow: 'var(--shadow-xl)',
              zIndex: 1001,
              border: '1px solid var(--border-subtle, #E2E8F0)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              {verificationResultDialog.isVerified ? (
                <CheckCircle2 style={{ width: 22, height: 22, color: 'var(--color-success, #059669)' }} />
              ) : (
                <XCircle style={{ width: 22, height: 22, color: 'var(--color-error, #DC2626)' }} />
              )}
              <Dialog.Title style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>
                {verificationResultDialog.isVerified ? 'Ownership Verified' : 'Verification Incomplete'}
              </Dialog.Title>
            </div>
            <Dialog.Description style={{ margin: '0 0 20px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {verificationResultDialog.message}
            </Dialog.Description>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="button"
                onClick={() => setVerificationResultDialog((prev) => ({ ...prev, open: false }))}
                style={{
                  backgroundColor: verificationResultDialog.isVerified ? 'var(--color-success, #059669)' : 'var(--color-crimson)',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '12px',
                  borderRadius: '8px',
                  border: 'none',
                }}
              >
                Done
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

          </div>
  );
}
