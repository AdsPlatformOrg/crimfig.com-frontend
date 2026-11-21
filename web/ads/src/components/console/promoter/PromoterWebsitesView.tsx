'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {
  Globe,
  Plus,
  ShieldCheck,
  Code2,
  Copy,
  Check,
  ExternalLink,
  Loader2,
  Sparkles,
  Search,
  Filter,
  ArrowRight,
  ShieldAlert,
  Clock,
} from 'lucide-react';
import { apiData } from '../../../lib/api-data';
import { loadWebsites, registerWebsite, verifyWebsite } from '../../../lib/campaigns-api';
import { EmptyState } from '../../EmptyState';
import { TableSkeleton } from '../../LoadingStates';
import {
  generateCrimFigVerifyMetaTag,
} from '../../CrimFigAdSlot';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../../ui/table';

export interface PromoterWebsite {
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
  isVerified: boolean;
  lastPingAt: string;
  activePlacementCount: number;
}

export function PromoterWebsitesView() {
  const router=useRouter();
  const [websites, setWebsites] = useState<PromoterWebsite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingWrites, setPendingWrites] = useState<Set<string>>(new Set());
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'unverified' | 'policy_approved' | 'policy_pending'>('all');

  // Modals
  const [isAddWebsiteOpen, setIsAddWebsiteOpen] = useState(false);
  const [newWebDomain, setNewWebDomain] = useState('');
  const [newWebMethod, setNewWebMethod] = useState<'html_file_and_meta_tag' | 'dns_txt'>('html_file_and_meta_tag');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittingReview, setSubmittingReview] = useState<string | null>(null);
  const [reviewMessage, setReviewMessage] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);

  // Ad Spaces Modal

  useEffect(() => {
    fetchWebsites();
  }, []);

  const fetchWebsites = async () => {
    try {
      setIsLoading(true);
      const data = await loadWebsites();
      setWebsites(data || []);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to load websites.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddWebsite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWebDomain) return;

    try {
      setIsSubmitting(true);
      setActionError(null);
      await registerWebsite(newWebDomain, newWebMethod);
      setIsAddWebsiteOpen(false);
      setNewWebDomain('');
      fetchWebsites();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Website registration could not be confirmed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyWebsite = async (websiteId: string) => {
    if (pendingWrites.has(websiteId)) return;
    setPendingWrites((prev) => new Set(prev).add(websiteId));
    setActionError(null);
    try {
      const outcome = await verifyWebsite(websiteId);
      if (!outcome.isVerified && outcome.error) {
        setActionError(outcome.error);
      }
      fetchWebsites();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Domain verification check could not be completed.');
    } finally {
      setPendingWrites((prev) => {
        const next = new Set(prev);
        next.delete(websiteId);
        return next;
      });
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(id);
    setTimeout(() => setCopiedToken(null), 2500);
  };

  const submitReview = async (id: string) => {
    if (submittingReview) return;
    setSubmittingReview(id);
    setActionError(null);
    setReviewMessage('');
    try {
      await apiData('/api/v1/promoters/websites/' + id + '/submit-review', { method: 'POST' });
      setReviewMessage('Website submitted for suitability review. Ownership verification is not policy approval.');
      await fetchWebsites();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : 'Review submission unavailable');
    } finally {
      setSubmittingReview(null);
    }
  };

  const filteredWebsites = useMemo(() => {
    return websites.filter((site) => {
      const matchesSearch =
        searchQuery === '' ||
        site.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
        site.url.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (statusFilter === 'verified') return site.isVerified;
      if (statusFilter === 'unverified') return !site.isVerified;
      if (statusFilter === 'policy_approved') return site.policyStatus === 'approved';
      if (statusFilter === 'policy_pending') return site.policyStatus === 'pending_approval' || site.policyStatus === 'testing';

      return true;
    });
  }, [websites, searchQuery, statusFilter]);



  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {reviewMessage && (
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
          {reviewMessage}
        </div>
      )}

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

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Registered Websites &amp; Ad Slots
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
            DNS verifies ownership automatically. Suitability approval is a separate existing staff review; TESTING websites earn zero $cfig.
          </p>
        </div>
        <Button
          type="button"
          onClick={() => setIsAddWebsiteOpen(true)}
          style={{
            display: 'flex',
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
          <Plus style={{ width: 16, height: 16 }} /> Add Website
        </Button>
      </div>

      {/* Search and Filters Bar */}
      <div
        className="theme-card"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          padding: '12px 16px',
          borderRadius: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1 1 260px', maxWidth: '420px', position: 'relative' }}>
          <Search style={{ width: 16, height: 16, color: 'var(--text-muted)', position: 'absolute', left: 12 }} />
          <Input
            type="search"
            placeholder="Search registered domain..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '36px', height: '38px', fontSize: '13px' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Filter style={{ width: 14, height: 14 }} /> Status:
          </span>
          {(
            [
              { id: 'all', label: `All (${websites.length})` },
              { id: 'verified', label: `Verified (${websites.filter((w) => w.isVerified).length})` },
              { id: 'unverified', label: `Unverified (${websites.filter((w) => !w.isVerified).length})` },
              { id: 'policy_approved', label: 'Policy Approved' },
              { id: 'policy_pending', label: 'Policy Pending' },
            ] as const
          ).map((filter) => {
            const active = statusFilter === filter.id;
            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => setStatusFilter(filter.id)}
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  padding: '6px 12px',
                  borderRadius: '9999px',
                  border: active ? '1px solid var(--color-crimson)' : '1px solid var(--border-subtle, #E2E8F0)',
                  backgroundColor: active ? 'var(--color-crimson)' : 'var(--bg-surface, #F8FAFC)',
                  color: active ? '#FFFFFF' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content: Table or Empty/Loading State */}
      {isLoading ? (
        <TableSkeleton rows={4} />
      ) : websites.length === 0 ? (
        <EmptyState
          icon={Globe}
          title="No Websites Registered Yet"
          description="Register your domain and complete ownership verification to generate ad space embed codes."
          actionLabel="+ Add Your First Website"
          onAction={() => setIsAddWebsiteOpen(true)}
        />
      ) : filteredWebsites.length === 0 ? (
        <div
          className="theme-card"
          style={{
            padding: '36px 20px',
            textAlign: 'center',
            borderRadius: '12px',
          }}
        >
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)' }}>
            No websites match your current search or filter criteria.
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
            }}
            style={{ marginTop: '8px', fontSize: '12px', color: 'var(--color-crimson)' }}
          >
            Clear filters
          </Button>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead style={{ minWidth: '220px' }}>Website Domain</TableHead>
              <TableHead style={{ minWidth: '150px' }}>Ownership Status</TableHead>
              <TableHead style={{ minWidth: '140px' }}>Policy Status</TableHead>
              <TableHead style={{ minWidth: '110px' }}>Active Ads</TableHead>
              <TableHead style={{ minWidth: '160px' }}>Method &amp; Verification</TableHead>
              <TableHead style={{ minWidth: '180px', textAlign: 'right' }}>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredWebsites.map((site) => {
              const isPending = pendingWrites.has(site.id);
              const policyStatusUpper = (site.policyStatus || (site.isVerified ? 'testing' : 'unverified')).toUpperCase();

              return (
                <TableRow key={site.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <Link
                        href={`/promoter/websites/${site.id}`}
                        style={{
                          fontWeight: 700,
                          fontSize: '14px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          color: 'var(--color-crimson)',
                          textDecoration: 'none',
                        }}
                        className="hover:underline"
                        title="View website inspection and ad space details"
                      >
                        <Globe style={{ width: 15, height: 15 }} />
                        {site.domain}
                        <ArrowRight style={{ width: 13, height: 13, opacity: 0.7 }} />
                      </Link>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {site.url || `https://${site.domain}`}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '9999px',
                          width: 'fit-content',
                          backgroundColor: site.isVerified ? 'var(--color-success-bg, #ECFDF5)' : 'var(--color-warning-bg, #FFFBEB)',
                          color: site.isVerified ? 'var(--color-success, #059669)' : 'var(--color-warning, #D97706)',
                        }}
                      >
                        {site.isVerified ? 'Verified Domain' : 'Verification Required'}
                      </span>
                      {site.verificationExpiresAt && (
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                          Expires: {new Date(site.verificationExpiresAt).toLocaleDateString()}
                        </span>
                      )}
                      {!site.isVerified && site.verificationErrorMessage && (
                        <span style={{ fontSize: '11px', color: 'var(--color-error, #DC2626)', maxWidth: '240px', lineHeight: 1.2 }}>
                          {site.verificationErrorMessage}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <Badge
                        variant={
                          site.policyStatus === 'approved'
                            ? 'default'
                            : site.policyStatus === 'suspended'
                            ? 'destructive'
                            : 'secondary'
                        }
                        style={{ width: 'fit-content', fontSize: '11px' }}
                      >
                        {policyStatusUpper}
                      </Badge>
                      {site.isVerified && site.policyStatus === 'testing' && (
                        <button
                          type="button"
                          disabled={Boolean(submittingReview)}
                          onClick={() => void submitReview(site.id)}
                          style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            color: 'var(--color-crimson)',
                            background: 'none',
                            border: 'none',
                            padding: 0,
                            textAlign: 'left',
                            cursor: 'pointer',
                            textDecoration: 'underline',
                          }}
                        >
                          {submittingReview === site.id ? 'Submitting…' : 'Submit for policy review'}
                        </button>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {site.activePlacementCount || 0} active
                    </span>
                  </TableCell>
                  <TableCell>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '12px' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
                        {site.verificationMethod === 'html_file_and_meta_tag' ? 'HTML Head Meta' : 'DNS TXT Record'}
                      </span>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <code style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                          {site.verificationToken ? `${site.verificationToken.slice(0, 16)}...` : 'No token'}
                        </code>
                        {site.verificationToken && (
                          <button
                            type="button"
                            onClick={() =>
                              handleCopy(
                                site.verificationMethod === 'html_file_and_meta_tag'
                                  ? generateCrimFigVerifyMetaTag(site.verificationToken)
                                  : `crimfig-site-verification=${site.verificationToken}`,
                                site.id
                              )
                            }
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: 'var(--text-muted)' }}
                            title="Copy verification proof snippet"
                          >
                            {copiedToken === site.id ? (
                              <Check style={{ width: 12, height: 12, color: 'var(--color-success)' }} />
                            ) : (
                              <Copy style={{ width: 12, height: 12 }} />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
                      {!site.isVerified ? (
                        <Button
                          type="button"
                          size="sm"
                          disabled={isPending}
                          onClick={() => handleVerifyWebsite(site.id)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '11px',
                            fontWeight: 600,
                            padding: '6px 12px',
                            backgroundColor: 'var(--color-crimson)',
                            color: '#FFFFFF',
                            borderRadius: '6px',
                            border: 'none',
                            cursor: 'pointer',
                          }}
                        >
                          <ShieldCheck style={{ width: 13, height: 13 }} />
                          {isPending ? 'Verifying...' : 'Verify Now'}
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => {
                            router.push('/promoter/websites/'+site.id+'/slots');

                          }}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '11px',
                            fontWeight: 600,
                            padding: '6px 12px',
                            backgroundColor: 'var(--color-fig-dark)',
                            color: '#FFFFFF',
                            borderRadius: '6px',
                            border: 'none',
                            cursor: 'pointer',
                          }}
                        >
                          <Code2 style={{ width: 13, height: 13 }} />
                          Embed Code
                        </Button>
                      )}
                      <Link
                        href={`/promoter/websites/${site.id}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px',
                          fontSize: '11px',
                          fontWeight: 600,
                          padding: '6px 10px',
                          borderRadius: '6px',
                          border: '1px solid var(--border-subtle, #E2E8F0)',
                          backgroundColor: 'var(--bg-surface, #F8FAFC)',
                          color: 'var(--text-primary)',
                          textDecoration: 'none',
                        }}
                      >
                        Inspect
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      {/* Modal: Add Website */}
      {isAddWebsiteOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            padding: '16px',
          }}
        >
          <div
            className="theme-card"
            style={{
              width: '100%',
              maxWidth: '480px',
              padding: '28px',
              borderRadius: '16px',
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Register Website Property
              </h3>
              <Button
                type="button"
                onClick={() => setIsAddWebsiteOpen(false)}
                aria-label="Close website registration"
                style={{ background: 'none', border: 'none', fontSize: '20px', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                ×
              </Button>
            </div>

            <form onSubmit={handleAddWebsite} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label htmlFor="promoter-website-domain" style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  Website Domain or Root URL
                </label>
                <Input
                  id="promoter-website-domain"
                  type="text"
                  placeholder="e.g. example.com or news.portal.org"
                  value={newWebDomain}
                  onChange={(e) => setNewWebDomain(e.target.value)}
                  required
                />
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                  Must be an HTTPS website domain without query parameters or sub-paths.
                </span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  Verification Method
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setNewWebMethod('html_file_and_meta_tag')}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: newWebMethod === 'html_file_and_meta_tag' ? '2px solid var(--color-crimson)' : '1px solid var(--border-subtle)',
                      backgroundColor: newWebMethod === 'html_file_and_meta_tag' ? 'var(--badge-bg)' : 'var(--bg-surface)',
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}
                  >
                    <span style={{ display: 'block', fontWeight: 700, fontSize: '12px', color: 'var(--text-primary)' }}>
                      HTML Meta Tag
                    </span>
                    <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Add tag to &lt;head&gt;</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewWebMethod('dns_txt')}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: newWebMethod === 'dns_txt' ? '2px solid var(--color-crimson)' : '1px solid var(--border-subtle)',
                      backgroundColor: newWebMethod === 'dns_txt' ? 'var(--badge-bg)' : 'var(--bg-surface)',
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}
                  >
                    <span style={{ display: 'block', fontWeight: 700, fontSize: '12px', color: 'var(--text-primary)' }}>
                      DNS TXT Record
                    </span>
                    <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Add TXT record in DNS</span>
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '12px' }}>
                <Button type="button" variant="outline" onClick={() => setIsAddWebsiteOpen(false)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !newWebDomain}
                  style={{
                    backgroundColor: 'var(--color-crimson)',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    border: 'none',
                    boxShadow: 'var(--shadow-crimson)',
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 style={{ width: 14, height: 14, animation: 'spin 1s linear infinite', marginRight: '6px' }} />
                      Registering...
                    </>
                  ) : (
                    'Register Website'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

          </div>
  );
}
