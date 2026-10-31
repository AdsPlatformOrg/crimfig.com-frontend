'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Layers,
  Globe,
  Plus,
  Copy,
  Check,
  ExternalLink,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock,
  RefreshCw,
  Code2,
} from 'lucide-react';
import { sessionFetch } from '../../../../lib/session';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { EmptyState } from '../../../../components/EmptyState';

interface PromoterWebsite {
  id: string;
  domain: string;
  url: string;
  verificationStatus: string;
  policyStatus?: string;
  isVerified?: boolean;
}

interface AdstationSlot {
  id: string;
  websiteId: string;
  name: string;
  slotType: 'network' | 'consideration' | 'direct' | 'hybrid';
  format: string;
  slotTagId: string;
  lifecycleStatus: 'installation_pending' | 'testing' | 'active' | 'paused' | 'suspended';
  width?: number;
  height?: number;
  responsive?: boolean;
  isActive: boolean;
  createdAt: string;
}

interface EmbedSnippet {
  slotTagId: string;
  htmlSnippet: string;
  nextJsSnippet: string;
}

interface InstallationStatus {
  slotId: string;
  slotTagId: string;
  status: 'rendered' | 'script_seen' | 'no_signals' | 'error';
  lastPingAt?: string;
  diagnostics?: string;
}

export default function PromoterSlotsPage() {
  const [websites, setWebsites] = useState<PromoterWebsite[]>([]);
  const [selectedWebsite, setSelectedWebsite] = useState<PromoterWebsite | null>(null);
  const [slots, setSlots] = useState<AdstationSlot[]>([]);
  const [isLoadingWebsites, setIsLoadingWebsites] = useState(true);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  // Modals & Panels
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedSlotForInstall, setSelectedSlotForInstall] = useState<AdstationSlot | null>(null);
  const [embedSnippet, setEmbedSnippet] = useState<EmbedSnippet | null>(null);
  const [isLoadingEmbed, setIsLoadingEmbed] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState<'html' | 'react' | null>(null);
  const [copyError, setCopyError] = useState<string | null>(null);

  // Test Installation State
  const [checkingSlotId, setCheckingSlotId] = useState<string | null>(null);
  const [installationResults, setInstallationResults] = useState<Record<string, InstallationStatus>>({});

  // Form State
  const [newSlotName, setNewSlotName] = useState('');
  const [newSlotFormat, setNewSlotFormat] = useState('banner');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Load Websites on mount
  useEffect(() => {
    loadWebsites();
  }, []);

  const loadWebsites = async () => {
    try {
      setIsLoadingWebsites(true);
      const res = await sessionFetch('/api/v1/promoters/websites');
      if (res.ok) {
        const json = await res.json();
        const list: PromoterWebsite[] = Array.isArray(json?.data) ? json.data : [];
        setWebsites(list);
        if (list.length > 0) {
          setSelectedWebsite(list[0]);
        }
      }
    } catch {
      // Clean fallback
    } finally {
      setIsLoadingWebsites(false);
    }
  };

  // Load Slots when selectedWebsite changes
  const loadSlots = useCallback(async (websiteId: string) => {
    try {
      setIsLoadingSlots(true);
      const res = await sessionFetch(`/api/v1/adstation/websites/${websiteId}/slots`);
      if (res.ok) {
        const json = await res.json();
        setSlots(Array.isArray(json?.data) ? json.data : []);
      }
    } catch {
      setSlots([]);
    } finally {
      setIsLoadingSlots(false);
    }
  }, []);

  useEffect(() => {
    if (selectedWebsite?.id) {
      loadSlots(selectedWebsite.id);
    } else {
      setSlots([]);
    }
  }, [selectedWebsite, loadSlots]);

  // Handle Slot Creation
  const handleCreateSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWebsite?.id || !newSlotName.trim()) return;

    try {
      setIsSubmitting(true);
      setFormError(null);
      const res = await sessionFetch('/api/v1/adstation/slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          websiteId: selectedWebsite.id,
          name: newSlotName.trim(),
          slotType: 'network', // CrimFig Publisher Network slot
          format: newSlotFormat === 'interstitial' ? 'interstitial' : 'banner',
          width: newSlotFormat === 'mpu' ? 300 : newSlotFormat === 'sidebar' ? 160 : newSlotFormat === 'banner' ? 728 : undefined,
          height: newSlotFormat === 'mpu' ? 250 : newSlotFormat === 'sidebar' ? 600 : newSlotFormat === 'banner' ? 90 : undefined,
          responsive: true,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || 'Failed to create slot.');
      }

      setShowCreateModal(false);
      setNewSlotName('');
      loadSlots(selectedWebsite.id);
    } catch (err: any) {
      setFormError(err.message || 'Slot creation failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Load Embed Instructions
  const handleOpenInstall = async (slot: AdstationSlot) => {
    setSelectedSlotForInstall(slot);
    setEmbedSnippet(null);
    setIsLoadingEmbed(true);

    try {
      const res = await sessionFetch(`/api/v1/adstation/slots/${slot.id}/embed`);
      if (res.ok) {
        const json = await res.json();
        setEmbedSnippet(json.data);
      }
    } catch {
      // Handled via state
    } finally {
      setIsLoadingEmbed(false);
    }
  };

  // Check Installation Evidence
  const handleCheckInstallation = async (slotId: string) => {
    setCheckingSlotId(slotId);
    try {
      const res = await sessionFetch(`/api/v1/adstation/slots/${slotId}/check-installation`, {
        method: 'POST',
      });
      const json = await res.json();
      if (res.ok) {
        setInstallationResults((prev) => ({
          ...prev,
          [slotId]: {
            slotId,
            slotTagId: slots.find((slot) => slot.id === slotId)?.slotTagId || '',
            status: json.data.isInstalled ? 'rendered' : json.data.serveCount > 0 ? 'script_seen' : 'no_signals',
            lastPingAt: json.data.lastServedAt,
            diagnostics: json.data.diagnostic,
          },
        }));
      } else {
        throw new Error(json.message || 'Installation check failed. Please retry.');
      }
    } catch (error) {
      setInstallationResults((prev) => ({ ...prev, [slotId]: { slotId, slotTagId: '', status: 'error', diagnostics: error instanceof Error ? error.message : 'Installation check unavailable.' } }));
    } finally {
      setCheckingSlotId(null);
    }
  };

  const copyToClipboard = async (text: string, type: 'html' | 'react') => {
    setCopyError(null);
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSnippet(type);
      setTimeout(() => setCopiedSnippet(null), 2500);
    } catch {
      setCopiedSnippet(null);
      setCopyError('Copy failed. Select the code below and copy it manually.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', margin: 0, fontFamily: 'Poppins, sans-serif' }}>
            CrimFig Ads Slots
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            Create and install canonical ad slots to display CrimFig ads on your website and earn revenue.
          </p>
        </div>

        {selectedWebsite && (
          <Button
            onClick={() => setShowCreateModal(true)}
            style={{
              backgroundColor: 'var(--color-crimson)',
              color: '#FFFFFF',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Plus style={{ width: 16, height: 16 }} />
            Create CrimFig Ad Slot
          </Button>
        )}
      </div>

      {/* Website Selector Dropdown */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', backgroundColor: 'var(--bg-elevated)', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
        <Globe style={{ width: 18, height: 18, color: 'var(--color-crimson)' }} />
        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Selected Domain:</span>
        {isLoadingWebsites ? (
          <Loader2 style={{ width: 16, height: 16, animation: 'spin 1s linear infinite', color: 'var(--text-secondary)' }} />
        ) : websites.length > 0 ? (
          <select
            value={selectedWebsite?.id || ''}
            onChange={(e) => {
              const target = websites.find((w) => w.id === e.target.value);
              setSelectedWebsite(target || null);
            }}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-subtle)',
              fontSize: '13px',
              fontWeight: 500,
              fontFamily: 'Poppins, sans-serif',
              cursor: 'pointer',
            }}
          >
            {websites.map((w) => (
              <option key={w.id} value={w.id}>
                {w.domain} ({w.verificationStatus})
              </option>
            ))}
          </select>
        ) : (
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No registered websites found. Add a website first.</span>
        )}
      </div>

      {/* Slots List or Empty State */}
      {isLoadingSlots ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px' }}>
          <Loader2 style={{ width: 28, height: 28, animation: 'spin 1s linear infinite', color: 'var(--color-crimson)' }} />
        </div>
      ) : slots.length === 0 ? (
        <EmptyState
          title="No Ad Slots Created Yet"
          description="Create your first canonical CrimFig ad slot for this domain to generate an embed code snippet and start testing ad delivery."
          icon={Layers}
          actionLabel="Create CrimFig Ad Slot"
          onAction={() => setShowCreateModal(true)}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {slots.map((slot) => {
            const result = installationResults[slot.id];
            const isChecking = checkingSlotId === slot.id;

            return (
              <div
                key={slot.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '18px 20px',
                  backgroundColor: 'var(--bg-elevated)',
                  borderRadius: '12px',
                  border: '1px solid var(--border-subtle)',
                  flexWrap: 'wrap',
                  gap: '16px',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '240px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>{slot.name}</span>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: '999px',
                        textTransform: 'uppercase',
                        backgroundColor:
                          slot.lifecycleStatus === 'active'
                            ? 'rgba(16, 185, 129, 0.15)'
                            : slot.lifecycleStatus === 'testing'
                            ? 'rgba(59, 130, 246, 0.15)'
                            : 'rgba(148, 163, 184, 0.15)',
                        color:
                          slot.lifecycleStatus === 'active'
                            ? '#10b981'
                            : slot.lifecycleStatus === 'testing'
                            ? '#3b82f6'
                            : '#94a3b8',
                      }}
                    >
                      {slot.lifecycleStatus}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    <span>Format: <strong style={{ color: 'var(--text-primary)' }}>{slot.format}</strong></span>
                    <span>•</span>
                    <span style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>{slot.slotTagId}</span>
                  </div>
                </div>

                {/* Status Telemetry */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {result && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                      {result.status === 'rendered' ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#10b981', fontWeight: 600 }}>
                          <CheckCircle2 style={{ width: 14, height: 14 }} /> Verified Rendered
                        </span>
                  ) : result.status === 'script_seen' ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#3b82f6', fontWeight: 500 }}>
                          <Clock style={{ width: 14, height: 14 }} /> Ad Request Detected (Render Pending)
                        </span>
                      ) : (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#f59e0b', fontWeight: 500 }}>
                          <AlertCircle style={{ width: 14, height: 14 }} /> {result.status === 'error' ? result.diagnostics || 'Installation check unavailable.' : 'No Signals Yet'}
                        </span>
                      )}
                    </div>
                  )}

                  <Button
                    onClick={() => handleCheckInstallation(slot.id)}
                    disabled={isChecking}
                    variant="outline"
                    size="sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}
                  >
                    <RefreshCw style={{ width: 13, height: 13, animation: isChecking ? 'spin 1s linear infinite' : 'none' }} />
                    {isChecking ? 'Checking...' : 'Test Installation'}
                  </Button>

                  <Button
                    onClick={() => handleOpenInstall(slot)}
                    style={{
                      backgroundColor: 'var(--color-crimson)',
                      color: '#FFFFFF',
                      fontSize: '12px',
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                    size="sm"
                  >
                    <Code2 style={{ width: 14, height: 14 }} />
                    Get Embed Code
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Slot Modal */}
      {showCreateModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px',
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '14px',
              padding: '24px',
              maxWidth: '480px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
            }}
          >
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Create CrimFig Ad Slot
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
              Bind a new canonical slot to <strong style={{ color: 'var(--text-primary)' }}>{selectedWebsite?.domain}</strong> to display network ads.
            </p>

            {formError && (
              <div style={{ padding: '10px 14px', borderRadius: '8px', backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', fontSize: '13px' }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateSlot} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Slot Name
                </label>
                <Input
                  value={newSlotName}
                  onChange={(e) => setNewSlotName(e.target.value)}
                  placeholder="e.g. Article Header Banner"
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Format Preset
                </label>
                <select
                  value={newSlotFormat}
                  onChange={(e) => setNewSlotFormat(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    backgroundColor: 'var(--bg-surface)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '13px',
                    fontFamily: 'Poppins, sans-serif',
                  }}
                >
                  <option value="banner">Leaderboard Banner (728x90 / Responsive)</option>
                  <option value="mpu">In-Content MPU (300x250)</option>
                  <option value="sidebar">Sidebar Sticky (160x600 / 300x600)</option>
                  <option value="interstitial">Fluid Interstitial Card</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <Button type="button" variant="ghost" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  style={{ backgroundColor: 'var(--color-crimson)', color: '#FFFFFF', fontWeight: 600 }}
                >
                  {isSubmitting ? 'Creating...' : 'Create Slot'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Embed Code Modal */}
      {selectedSlotForInstall && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px',
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '14px',
              padding: '24px',
              maxWidth: '620px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Install Code: {selectedSlotForInstall.name}
              </h2>
              <Button variant="ghost" size="sm" onClick={() => setSelectedSlotForInstall(null)}>
                Close
              </Button>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
              Paste this snippet into your HTML or Next.js page where you want the ad to appear. Unfilled slots automatically collapse without leaving empty whitespace.
            </p>

            {isLoadingEmbed ? (
              <div style={{ padding: '36px', display: 'flex', justifyContent: 'center' }}>
                <Loader2 style={{ width: 24, height: 24, animation: 'spin 1s linear infinite', color: 'var(--color-crimson)' }} />
              </div>
            ) : embedSnippet ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* HTML Snippet */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>Standard HTML Snippet</span>
                    {copyError && <p role="alert">{copyError}</p>}
                    <Button
                      onClick={() => copyToClipboard(embedSnippet.htmlSnippet, 'html')}
                      variant="outline"
                      size="sm"
                      style={{ fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      {copiedSnippet === 'html' ? <Check style={{ width: 12, height: 12, color: '#10b981' }} /> : <Copy style={{ width: 12, height: 12 }} />}
                      {copiedSnippet === 'html' ? 'Copied!' : 'Copy Code'}
                    </Button>
                  </div>
                  <pre
                    style={{
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '11px',
                      fontFamily: 'monospace',
                      overflowX: 'auto',
                      color: 'var(--text-primary)',
                      margin: 0,
                    }}
                  >
                    {embedSnippet.htmlSnippet}
                  </pre>
                </div>

                {/* React / Next.js Snippet */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>Next.js / React Component</span>
                    <Button
                      onClick={() => copyToClipboard(embedSnippet.nextJsSnippet, 'react')}
                      variant="outline"
                      size="sm"
                      style={{ fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      {copiedSnippet === 'react' ? <Check style={{ width: 12, height: 12, color: '#10b981' }} /> : <Copy style={{ width: 12, height: 12 }} />}
                      {copiedSnippet === 'react' ? 'Copied!' : 'Copy Code'}
                    </Button>
                  </div>
                  <pre
                    style={{
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '11px',
                      fontFamily: 'monospace',
                      overflowX: 'auto',
                      color: 'var(--text-primary)',
                      margin: 0,
                    }}
                  >
                    {embedSnippet.nextJsSnippet}
                  </pre>
                </div>
              </div>
            ) : (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                Unable to load embed instructions for this slot.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

