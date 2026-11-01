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
import { Badge } from '../../../../components/ui/badge';
import { Card } from '../../../../components/ui/card';
import {
  Table as ShadTable,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../../../../components/ui/table';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '../../../../components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';
import { EmptyState } from '../../../../components/EmptyState';
import { SetupGuide } from '../../../../components/console/SetupGuide';

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
  const [newSlotFormat, setNewSlotFormat] = useState('auto');
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

      let allowedPresetIds: string[] | undefined = undefined;
      let slotFormat = 'banner';
      let slotWidth: number | undefined = undefined;
      let slotHeight: number | undefined = undefined;

      if (newSlotFormat === 'auto') {
        allowedPresetIds = undefined; // Auto: any of the 9 approved sizes
        slotFormat = 'banner';
      } else if (newSlotFormat === 'leaderboard') {
        allowedPresetIds = ['leaderboard'];
        slotFormat = 'banner';
        slotWidth = 728;
        slotHeight = 90;
      } else if (newSlotFormat === 'medium_rectangle') {
        allowedPresetIds = ['medium_rectangle'];
        slotFormat = 'card';
        slotWidth = 300;
        slotHeight = 250;
      } else if (newSlotFormat === 'large_rectangle') {
        allowedPresetIds = ['large_rectangle'];
        slotFormat = 'card';
        slotWidth = 336;
        slotHeight = 280;
      } else if (newSlotFormat === 'mobile_banner') {
        allowedPresetIds = ['mobile_banner'];
        slotFormat = 'banner';
        slotWidth = 320;
        slotHeight = 50;
      } else if (newSlotFormat === 'large_mobile_banner') {
        allowedPresetIds = ['large_mobile_banner'];
        slotFormat = 'banner';
        slotWidth = 320;
        slotHeight = 100;
      } else if (newSlotFormat === 'half_page') {
        allowedPresetIds = ['half_page'];
        slotFormat = 'banner';
        slotWidth = 300;
        slotHeight = 600;
      } else if (newSlotFormat === 'billboard') {
        allowedPresetIds = ['billboard'];
        slotFormat = 'banner';
        slotWidth = 970;
        slotHeight = 250;
      } else if (newSlotFormat === 'square') {
        allowedPresetIds = ['square'];
        slotFormat = 'square';
        slotWidth = 250;
        slotHeight = 250;
      } else if (newSlotFormat === 'large_square') {
        allowedPresetIds = ['large_square'];
        slotFormat = 'square';
        slotWidth = 300;
        slotHeight = 300;
      } else if (newSlotFormat === 'interstitial') {
        allowedPresetIds = undefined;
        slotFormat = 'interstitial';
      }

      const res = await sessionFetch('/api/v1/adstation/slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          websiteId: selectedWebsite.id,
          name: newSlotName.trim(),
          slotType: 'network', // CrimFig Publisher Network slot
          format: slotFormat,
          width: slotWidth,
          height: slotHeight,
          allowedPresetIds,
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

      {selectedWebsite && <SetupGuide website={{ id: selectedWebsite.id, domain: selectedWebsite.domain }} slots={slots.map((s) => ({ id: s.id, name: s.name, slotTagId: s.slotTagId }))} />}

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
        <Card style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <ShadTable style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', minWidth: '700px' }}>
              <TableHeader>
                <TableRow style={{ backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)' }}>
                  <TableHead style={{ padding: '12px 16px' }}>Slot Name</TableHead>
                  <TableHead style={{ padding: '12px 16px' }}>Format</TableHead>
                  <TableHead style={{ padding: '12px 16px' }}>Lifecycle Status</TableHead>
                  <TableHead style={{ padding: '12px 16px' }}>Installation Telemetry</TableHead>
                  <TableHead style={{ width: '140px', padding: '12px 16px', textAlign: 'right' }}>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {slots.map((slot) => {
                  const result = installationResults[slot.id];
                  const isChecking = checkingSlotId === slot.id;

                  return (
                    <TableRow key={slot.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <TableCell style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{slot.name}</div>
                        <div style={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {slot.slotTagId}
                        </div>
                      </TableCell>

                      <TableCell style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                        <Badge variant="outline" style={{ textTransform: 'uppercase', fontSize: '11px', fontWeight: 600 }}>
                          {slot.format}
                        </Badge>
                      </TableCell>

                      <TableCell style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                        <Badge
                          variant="outline"
                          style={{
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
                            fontWeight: 600,
                            textTransform: 'uppercase',
                          }}
                        >
                          ● {slot.lifecycleStatus}
                        </Badge>
                      </TableCell>

                      <TableCell style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                        {result ? (
                          result.status === 'rendered' ? (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#10b981', fontWeight: 600, fontSize: '12px' }}>
                              <CheckCircle2 style={{ width: 14, height: 14 }} /> Verified Rendered
                            </span>
                          ) : result.status === 'script_seen' ? (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#3b82f6', fontWeight: 500, fontSize: '12px' }}>
                              <Clock style={{ width: 14, height: 14 }} /> Ad Request Detected
                            </span>
                          ) : (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#f59e0b', fontWeight: 500, fontSize: '12px' }}>
                              <AlertCircle style={{ width: 14, height: 14 }} /> {result.status === 'error' ? result.diagnostics || 'Check unavailable' : 'No Signals'}
                            </span>
                          )
                        ) : (
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Not tested yet</span>
                        )}
                      </TableCell>

                      <TableCell style={{ padding: '12px 16px', textAlign: 'right', verticalAlign: 'middle' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
                          <Button
                            onClick={() => handleOpenInstall(slot)}
                            size="sm"
                            style={{
                              backgroundColor: 'var(--color-crimson)',
                              color: '#FFFFFF',
                              fontSize: '11px',
                              fontWeight: 600,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <Code2 style={{ width: 13, height: 13 }} />
                            Code
                          </Button>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" aria-label={`Actions for ${slot.name}`}>
                                <MoreVertical style={{ width: 14, height: 14 }} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleCheckInstallation(slot.id)} disabled={isChecking}>
                                Test Installation
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleOpenInstall(slot)}>
                                View Embed Snippet
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(slot.slotTagId)}>
                                Copy Tag ID
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </ShadTable>
          </div>
        </Card>
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
                  Image Ad Size & Compatibility
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
                  <option value="auto">Automatic — any approved image size (Recommended)</option>
                  <option value="medium_rectangle">Medium Rectangle (300x250 · 6:5)</option>
                  <option value="large_rectangle">Large Rectangle (336x280 · 6:5)</option>
                  <option value="leaderboard">Leaderboard Banner (728x90 · 364:45)</option>
                  <option value="mobile_banner">Mobile Banner (320x50 · 32:5)</option>
                  <option value="large_mobile_banner">Large Mobile Banner (320x100 · 16:5)</option>
                  <option value="half_page">Half Page (300x600 · 1:2)</option>
                  <option value="billboard">Billboard (970x250 · 97:25)</option>
                  <option value="square">Square (250x250 · 1:1)</option>
                  <option value="large_square">Large Square (300x300 · 1:1)</option>
                  <option value="interstitial">Fluid Interstitial Card</option>
                </select>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Automatic allows all 9 approved presets that fit the usable space. Setting a specific size restricts placement delivery to that preset.
                </p>
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

