'use client';

import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { apiData } from '../../../lib/api-data';
import { loadWebsites, registerWebsite, verifyWebsite } from '../../../lib/campaigns-api';
import { EmptyState } from '../../EmptyState';
import { TableSkeleton, CardSkeleton } from '../../LoadingStates';
import { CRIMFIG_PLACEMENTS, type CrimFigPlacement, generateCrimFigEmbedCode } from '../../CrimFigAdSlot';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';

interface PromoterWebsite {
  id: string;
  domain: string;
  url: string;
  verificationToken: string;
  verificationMethod: 'html_file_and_meta_tag' | 'dns_txt';
  isVerified: boolean;
  lastPingAt: string;
  activePlacementCount: number;
}

export function PromoterWebsitesView() {
  const [websites, setWebsites] = useState<PromoterWebsite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingWrites, setPendingWrites] = useState<Set<string>>(new Set());
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // Modals
  const [isAddWebsiteOpen, setIsAddWebsiteOpen] = useState(false);
  const [newWebDomain, setNewWebDomain] = useState('');
  const [newWebMethod, setNewWebMethod] = useState<'html_file_and_meta_tag' | 'dns_txt'>('html_file_and_meta_tag');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Ad Spaces Modal
  const [isAdSpacesModalOpen, setIsAdSpacesModalOpen] = useState(false);
  const [selectedPlacementSite, setSelectedPlacementSite] = useState<PromoterWebsite | null>(null);
  const [adSpaceMode, setAdSpaceMode] = useState<'publisher_network' | 'owned_site_direct'>('publisher_network');
  const [allowHomeNetworkFill, setAllowHomeNetworkFill] = useState(true);
  const [selectedPlacement, setSelectedPlacement] = useState<CrimFigPlacement>('banner_top');

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
      await verifyWebsite(websiteId);
      fetchWebsites();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'DNS verification check could not be completed.');
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

  const generatedCode = selectedPlacementSite
    ? generateCrimFigEmbedCode({
        placement: selectedPlacement,
        publisherKey: selectedPlacementSite.id,
        domain: selectedPlacementSite.domain,
        mode: adSpaceMode,
        allowHomeNetworkFill: allowHomeNetworkFill,
      })
    : '';

  const placementMeta = CRIMFIG_PLACEMENTS[selectedPlacement];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Registered Websites &amp; Ad Slots
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
            Verify website domain ownership and configure CrimFig ad placement codes.
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

      {isLoading ? (
        <CardSkeleton count={2} />
      ) : websites.length === 0 ? (
        <EmptyState
          icon={Globe}
          title="No Websites Registered Yet"
          description="Register your domain and complete ownership verification to generate ad space embed codes."
          actionLabel="+ Add Your First Website"
          onAction={() => setIsAddWebsiteOpen(true)}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {websites.map((site) => (
            <div
              key={site.id}
              className="theme-card"
              style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '16px',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: 'var(--text-primary)',
                    }}
                  >
                    <Globe style={{ width: 16, height: 16, color: 'var(--color-crimson)' }} />
                    {site.domain}
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      backgroundColor: site.isVerified ? 'var(--color-success-bg)' : 'var(--color-warning-bg)',
                      color: site.isVerified ? 'var(--color-success)' : 'var(--color-warning)',
                    }}
                  >
                    {site.isVerified ? 'Verified Domain' : 'Verification Required'}
                  </span>
                </div>

                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
                  Status: {site.lastPingAt || 'Pending verification'}
                </p>

                {!site.isVerified && (
                  <div
                    style={{
                      marginTop: '12px',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--badge-bg)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          color: 'var(--color-crimson)',
                          letterSpacing: '0.05em',
                        }}
                      >
                        DNS TXT Verification Record
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Type: TXT</span>
                    </div>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '80px 1fr auto',
                        gap: '8px',
                        alignItems: 'center',
                        fontSize: '12px',
                        backgroundColor: 'var(--bg-page)',
                        padding: '8px',
                        borderRadius: '6px',
                      }}
                    >
                      <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Host:</span>
                      <code style={{ fontFamily: 'monospace', color: 'var(--text-primary)' }}>@ (or {site.domain})</code>
                      <Button
                        type="button"
                        onClick={() => handleCopy('@', `host-${site.id}`)}
                        aria-label={`Copy Host for ${site.domain}`}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '2px' }}
                        title="Copy Host"
                      >
                        {copiedToken === `host-${site.id}` ? <Check style={{ width: 12, height: 12, color: 'var(--color-success)' }} /> : <Copy style={{ width: 12, height: 12 }} />}
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
                        padding: '8px',
                        borderRadius: '6px',
                        marginTop: '6px',
                      }}
                    >
                      <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Value:</span>
                      <code style={{ fontFamily: 'monospace', color: 'var(--color-crimson)', wordBreak: 'break-all' }}>
                        crimfig-site-verification={site.verificationToken}
                      </code>
                      <Button
                        type="button"
                        onClick={() => handleCopy(`crimfig-site-verification=${site.verificationToken}`, `val-${site.id}`)}
                        aria-label={`Copy TXT Value for ${site.domain}`}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '2px' }}
                        title="Copy TXT Value"
                      >
                        {copiedToken === `val-${site.id}` ? <Check style={{ width: 12, height: 12, color: 'var(--color-success)' }} /> : <Copy style={{ width: 12, height: 12 }} />}
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div
                style={{
                  paddingTop: '16px',
                  borderTop: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  flexWrap: 'wrap',
                }}
              >
                {!site.isVerified ? (
                  <Button
                    type="button"
                    disabled={pendingWrites.has(site.id)}
                    onClick={() => handleVerifyWebsite(site.id)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 16px',
                      backgroundColor: 'var(--color-crimson)',
                      color: '#FFFFFF',
                      fontSize: '12px',
                      fontWeight: 600,
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: 'var(--shadow-crimson)',
                    }}
                  >
                    <ShieldCheck style={{ width: 14, height: 14 }} />{' '}
                    {pendingWrites.has(site.id) ? 'Checking DNS...' : 'Verify DNS Record Now'}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={() => {
                      setSelectedPlacementSite(site);
                      setIsAdSpacesModalOpen(true);
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 16px',
                      backgroundColor: 'var(--color-fig-dark)',
                      color: '#FFFFFF',
                      fontSize: '12px',
                      fontWeight: 600,
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <Code2 style={{ width: 14, height: 14 }} /> Manage Ad Spaces &amp; Get Code
                  </Button>
                )}
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{site.activePlacementCount || 0} active ads</span>
              </div>
            </div>
          ))}
        </div>
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
                  Domain Name (Host)
                </label>
                <Input
                  id="promoter-website-domain"
                  type="text"
                  required
                  placeholder="e.g. yourpublication.com"
                  value={newWebDomain}
                  onChange={(e) => setNewWebDomain(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  Verification Method
                </label>
                <select
                  value={newWebMethod}
                  onChange={(e) => setNewWebMethod(e.target.value as any)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-page)',
                    fontSize: '13px',
                    color: 'var(--text-primary)',
                    boxSizing: 'border-box',
                  }}
                >
                  <option value="dns_txt">DNS TXT Record (Recommended for root domains)</option>
                  <option value="html_file_and_meta_tag">HTML Meta Tag</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <Button
                  type="button"
                  onClick={() => setIsAddWebsiteOpen(false)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-page)',
                    color: 'var(--text-secondary)',
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    padding: '8px 20px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--color-crimson)',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {isSubmitting ? 'Registering...' : 'Register Website'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Ad Spaces Code Generator */}
      {isAdSpacesModalOpen && selectedPlacementSite && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(4px)',
            padding: '16px',
          }}
        >
          <div
            className="theme-card"
            style={{
              width: '100%',
              maxWidth: '680px',
              padding: '28px',
              borderRadius: '16px',
              boxShadow: 'var(--shadow-xl)',
              maxHeight: '90vh',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  Embed Code Generator — {selectedPlacementSite.domain}
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                  Generate lightweight HTML snippets to embed ads on your publication.
                </p>
              </div>
              <Button
                type="button"
                onClick={() => setIsAdSpacesModalOpen(false)}
                aria-label="Close ad spaces"
                style={{ background: 'none', border: 'none', fontSize: '20px', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                ×
              </Button>
            </div>

            {/* Inventory Mode Selector */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase' }}>
                Inventory Mode
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '8px' }}>
                <Button
                  type="button"
                  onClick={() => setAdSpaceMode('publisher_network')}
                  aria-pressed={adSpaceMode === 'publisher_network'}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    border: adSpaceMode === 'publisher_network' ? '2px solid var(--color-crimson)' : '1px solid var(--border-subtle)',
                    backgroundColor: adSpaceMode === 'publisher_network' ? 'rgba(212, 20, 58, 0.05)' : 'var(--bg-page)',
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-primary)' }}>Monetized Network Slot</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Earn 55% verified revenue share from CrimFig advertiser network.
                  </div>
                </Button>

                <Button
                  type="button"
                  onClick={() => setAdSpaceMode('owned_site_direct')}
                  aria-pressed={adSpaceMode === 'owned_site_direct'}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    border: adSpaceMode === 'owned_site_direct' ? '2px solid var(--color-crimson)' : '1px solid var(--border-subtle)',
                    backgroundColor: adSpaceMode === 'owned_site_direct' ? 'rgba(212, 20, 58, 0.05)' : 'var(--bg-page)',
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-primary)' }}>Direct Deal Slot (0% Cut)</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Retain 100% of revenue from your direct clients.
                  </div>
                </Button>
              </div>
            </div>

            {/* Placement format selector */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase' }}>
                Placement Slot &amp; Dimensions
              </label>
              <select
                value={selectedPlacement}
                onChange={(e) => setSelectedPlacement(e.target.value as CrimFigPlacement)}
                style={{
                  width: '100%',
                  marginTop: '8px',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-page)',
                  fontSize: '13px',
                  color: 'var(--text-primary)',
                }}
              >
                {Object.entries(CRIMFIG_PLACEMENTS).map(([key, val]) => (
                  <option key={key} value={key}>
                    {(val as any).label}
                  </option>
                ))}
              </select>
              {placementMeta && (
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>💡 {placementMeta.recommended}</p>
              )}
            </div>

            {/* Code Snippet Box */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase' }}>
                  HTML Installation Snippet
                </label>
                <Button
                  type="button"
                  onClick={() => handleCopy(generatedCode, 'ad_space_code')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    backgroundColor: copiedToken === 'ad_space_code' ? 'var(--color-success)' : 'var(--color-crimson)',
                    color: '#FFFFFF',
                    fontSize: '11px',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {copiedToken === 'ad_space_code' ? <Check style={{ width: 12, height: 12 }} /> : <Copy style={{ width: 12, height: 12 }} />}
                  {copiedToken === 'ad_space_code' ? 'Copied' : 'Copy'}
                </Button>
              </div>
              <div style={{ borderRadius: '8px', backgroundColor: 'var(--bg-page)', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
                <pre
                  style={{
                    margin: 0,
                    padding: '12px',
                    overflowX: 'auto',
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'monospace',
                    fontSize: '11px',
                    color: 'var(--text-primary)',
                    lineHeight: 1.5,
                  }}
                >
                  {generatedCode}
                </pre>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
              <Button
                type="button"
                onClick={() => setIsAdSpacesModalOpen(false)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-page)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
