'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Layers,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Plus,
  Sliders,
  DollarSign,
  TrendingUp,
  Tag,
  ExternalLink,
  Loader2,
  Copy,
  Check,
} from 'lucide-react';
import { sessionFetch } from '../../../lib/session';

interface AdstationSlot {
  id: string;
  websiteId: string;
  name: string;
  slotType: 'consideration' | 'direct' | 'network' | 'hybrid';
  format: string;
  isConsiderationSlot: boolean;
  isConsiderationVerified: boolean;
  slotTagId: string;
  slotDeliveryPreference?: string;
  isActive: boolean;
  createdAt: string;
}

interface DirectCampaign {
  id: string;
  clientName: string;
  campaignTitle: string;
  destinationUrl: string;
  targetImpressions: number;
  deliveredImpressions: number;
  deliveredClicks: number;
  status: string;
}

interface AdStationWorkspaceProps {
  websiteId?: string;
  websiteDomain?: string;
  onClose?: () => void;
}

export function AdStationWorkspace({ websiteId, websiteDomain, onClose }: AdStationWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<'slots' | 'direct_deals' | 'preferences'>('slots');
  const [slots, setSlots] = useState<AdstationSlot[]>([]);
  const [directCampaigns, setDirectCampaigns] = useState<DirectCampaign[]>([]);
  const [deliveryPreference, setDeliveryPreference] = useState<'high' | 'medium' | 'low'>('medium');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedTag, setCopiedTag] = useState<string | null>(null);

  // Modal / Form states
  const [showCreateSlot, setShowCreateSlot] = useState(false);
  const [newSlotName, setNewSlotName] = useState('');
  const [newSlotType, setNewSlotType] = useState<'consideration' | 'direct' | 'network' | 'hybrid'>('direct');
  const [newSlotFormat, setNewSlotFormat] = useState('banner');

  const [showCreateDeal, setShowCreateDeal] = useState(false);
  const [dealClientName, setDealClientName] = useState('');
  const [dealTitle, setDealTitle] = useState('');
  const [dealUrl, setDealUrl] = useState('');
  const [dealTargetImpressions, setDealTargetImpressions] = useState(10000);

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadSlots = useCallback(async () => {
    if (!websiteId) return;
    try {
      setIsLoading(true);
      const res = await sessionFetch(`/api/v1/adstation/websites/${websiteId}/slots`);
      const data = await res.json();
      if (data.status === 'success') {
        setSlots(data.data || []);
      }
    } catch {
      // Keep UI clean
    } finally {
      setIsLoading(false);
    }
  }, [websiteId]);

  const loadDirectCampaigns = useCallback(async () => {
    if (!websiteId) return;
    try {
      const res = await sessionFetch(`/api/v1/adstation/websites/${websiteId}/direct-campaigns`);
      const data = await res.json();
      if (data.status === 'success') {
        setDirectCampaigns(data.data || []);
      }
    } catch {
      // Keep UI clean
    }
  }, [websiteId]);

  useEffect(() => {
    if (websiteId) {
      loadSlots();
      loadDirectCampaigns();
    }
  }, [websiteId, loadSlots, loadDirectCampaigns]);

  const handleCreateSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!websiteId) return;

    try {
      const res = await sessionFetch('/api/v1/adstation/slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          websiteId,
          name: newSlotName,
          slotType: newSlotType,
          format: newSlotFormat,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setNotification({ type: 'success', message: 'Slot created successfully!' });
        setShowCreateSlot(false);
        setNewSlotName('');
        loadSlots();
      } else {
        setNotification({ type: 'error', message: data.message || 'Failed to create slot.' });
      }
    } catch {
      setNotification({ type: 'error', message: 'Network error creating slot.' });
    }
  };

  const handleVerifyConsideration = async (slotId: string) => {
    if (!websiteId) return;
    try {
      const res = await sessionFetch(`/api/v1/adstation/websites/${websiteId}/slots/${slotId}/verify-consideration`, {
        method: 'POST',
      });
      const data = await res.json();
      if (res.ok) {
        setNotification({ type: 'success', message: 'Consideration slot verified!' });
        loadSlots();
      } else {
        setNotification({ type: 'error', message: data.message || 'Verification failed.' });
      }
    } catch {
      setNotification({ type: 'error', message: 'Network error verifying slot.' });
    }
  };

  const handleCreateDirectDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!websiteId) return;

    try {
      const res = await sessionFetch('/api/v1/adstation/direct-campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          websiteId,
          clientName: dealClientName,
          campaignTitle: dealTitle,
          destinationUrl: dealUrl,
          targetImpressions: dealTargetImpressions,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setNotification({ type: 'success', message: 'Direct deal created successfully (0% CrimFig commission)!' });
        setShowCreateDeal(false);
        setDealClientName('');
        setDealTitle('');
        setDealUrl('');
        loadDirectCampaigns();
      } else {
        setNotification({ type: 'error', message: data.message || 'Failed to create direct deal.' });
      }
    } catch {
      setNotification({ type: 'error', message: 'Network error creating deal.' });
    }
  };

  const handleSetPreference = async (pref: 'high' | 'medium' | 'low') => {
    if (!websiteId) return;
    setDeliveryPreference(pref);
    try {
      await sessionFetch(`/api/v1/adstation/websites/${websiteId}/delivery-preference`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preference: pref }),
      });
      setNotification({ type: 'success', message: `Delivery preference set to ${pref.toUpperCase()}` });
    } catch {
      // Error handling
    }
  };

  const handleCopy = (tag: string) => {
    navigator.clipboard.writeText(tag);
    setCopiedTag(tag);
    setTimeout(() => setCopiedTag(null), 2500);
  };

  return (
    <div className="bg-white dark:bg-[#1E2337] border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-200 dark:border-gray-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-red-50 dark:bg-red-950/40 text-[#D4143A]">
              <Layers className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">AdStation Management Tool</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Direct Deals (0% commission) & Consideration Network Slots for {websiteDomain || 'Your Website'}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800/60 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('slots')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
              activeTab === 'slots'
                ? 'bg-white dark:bg-[#171B2A] text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
            }`}
          >
            Ad Slots
          </button>
          <button
            onClick={() => setActiveTab('direct_deals')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
              activeTab === 'direct_deals'
                ? 'bg-white dark:bg-[#171B2A] text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
            }`}
          >
            Direct Deals (0% CF Cut)
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
              activeTab === 'preferences'
                ? 'bg-white dark:bg-[#171B2A] text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
            }`}
          >
            Delivery Ratio
          </button>
        </div>
      </div>

      {notification && (
        <div
          className={`mt-4 p-3 rounded-lg flex items-center justify-between text-xs font-medium ${
            notification.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
              : 'bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
          }`}
        >
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)} className="text-gray-400 hover:text-gray-600">
            ×
          </button>
        </div>
      )}

      {/* Slots Tab */}
      {activeTab === 'slots' && (
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Configured Website Slots</h3>
            <button
              onClick={() => setShowCreateSlot(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#D4143A] text-white hover:bg-[#A80F32] transition"
            >
              <Plus className="w-3.5 h-3.5" /> Create Ad Slot
            </button>
          </div>

          {slots.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
              <Layers className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">No ad slots created yet</p>
              <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                Create a Consideration Slot to unlock AdStation direct deals, or configure Direct/Network slots.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {slots.map((slot) => (
                <div
                  key={slot.id}
                  className="p-4 border border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50/50 dark:bg-gray-900/30 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-sm text-gray-900 dark:text-white">{slot.name}</span>
                      <span className="ml-2 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                        {slot.format}
                      </span>
                    </div>
                    {slot.isConsiderationSlot ? (
                      <span
                        className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1 ${
                          slot.isConsiderationVerified
                            ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400'
                            : 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400'
                        }`}
                      >
                        <ShieldCheck className="w-3 h-3" />
                        {slot.isConsiderationVerified ? 'Consideration Verified' : 'Consideration Pending'}
                      </span>
                    ) : (
                      <span className="text-[11px] px-2 py-0.5 rounded font-medium bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 capitalize">
                        {slot.slotType} Slot
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-200 dark:border-gray-700">
                    <span className="font-mono text-[11px] truncate mr-2">{slot.slotTagId}</span>
                    <button
                      onClick={() => handleCopy(slot.slotTagId)}
                      className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-gray-900"
                    >
                      {copiedTag === slot.slotTagId ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {slot.isConsiderationSlot && !slot.isConsiderationVerified && (
                    <button
                      onClick={() => handleVerifyConsideration(slot.id)}
                      className="w-full py-1.5 px-3 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition flex items-center justify-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verify Consideration Placement
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Direct Deals Tab */}
      {activeTab === 'direct_deals' && (
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Direct Client Campaigns</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                You retain 100% of revenue directly from your clients. CrimFig takes 0% cut.
              </p>
            </div>
            <button
              onClick={() => setShowCreateDeal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#D4143A] text-white hover:bg-[#A80F32] transition"
            >
              <Plus className="w-3.5 h-3.5" /> New Direct Deal
            </button>
          </div>

          {directCampaigns.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
              <DollarSign className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">No direct deals registered yet</p>
              <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                Sell your ad space directly to local businesses, sponsors, or partners at whatever rate you choose.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {directCampaigns.map((deal) => (
                <div
                  key={deal.id}
                  className="p-4 border border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50/50 dark:bg-gray-900/30 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900 dark:text-white">{deal.campaignTitle}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Client: {deal.clientName}</p>
                    <a
                      href={deal.destinationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#D4143A] hover:underline flex items-center gap-1 mt-1"
                    >
                      {deal.destinationUrl} <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <div>
                      <span className="text-gray-400 block">Delivered Impr.</span>
                      <span className="font-bold text-gray-900 dark:text-white">
                        {deal.deliveredImpressions.toLocaleString()} / {deal.targetImpressions.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Clicks</span>
                      <span className="font-bold text-gray-900 dark:text-white">{deal.deliveredClicks.toLocaleString()}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded font-semibold text-[11px] bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 uppercase">
                      {deal.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Delivery Preferences Tab */}
      {activeTab === 'preferences' && (
        <div className="mt-6 space-y-6 max-w-xl">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">CrimFig Network Delivery Allocation</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Select how your website balances direct private client campaigns vs. automated CrimFig Network monetized ads.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              {
                id: 'high',
                label: 'High Network',
                desc: 'Maximizes CrimFig network ads on unsold direct inventory.',
              },
              {
                id: 'medium',
                label: 'Balanced',
                desc: 'Equal priority between direct deals and network monetization.',
              },
              {
                id: 'low',
                label: 'Direct Priority',
                desc: 'Exclusively prioritizes direct client fulfillment before network ads.',
              },
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => handleSetPreference(option.id as any)}
                className={`p-4 rounded-xl border text-left transition ${
                  deliveryPreference === option.id
                    ? 'border-[#D4143A] bg-red-50/30 dark:bg-red-950/20 text-[#D4143A]'
                    : 'border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-300'
                }`}
              >
                <div className="font-bold text-xs uppercase tracking-wider">{option.label}</div>
                <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 leading-snug">{option.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Create Slot */}
      {showCreateSlot && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E2337] rounded-xl max-w-md w-full p-6 shadow-xl border border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Create New Ad Slot</h3>
            <form onSubmit={handleCreateSlot} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Slot Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Header Leaderboard, Sidebar Sticky"
                  value={newSlotName}
                  onChange={(e) => setNewSlotName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Slot Type</label>
                <select
                  value={newSlotType}
                  onChange={(e) => setNewSlotType(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="direct">Direct Deal Slot (0% CF Commission)</option>
                  <option value="consideration">Consideration Slot (Required for AdStation)</option>
                  <option value="network">Network Monetization Slot (55% Publisher cut)</option>
                  <option value="hybrid">Hybrid Co-existence Slot</option>
                </select>
                <p className="text-[10px] text-gray-400 mt-1">
                  Note: Consideration Slots serve exclusively CrimFig network ads and cannot run direct deals.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Format</label>
                <select
                  value={newSlotFormat}
                  onChange={(e) => setNewSlotFormat(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="banner">Banner (Leaderboard / MREC)</option>
                  <option value="card">Card / Feed placement</option>
                  <option value="video">Outstream Video</option>
                  <option value="interstitial">Interstitial</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateSlot(false)}
                  className="px-3 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs rounded-lg bg-[#D4143A] text-white font-semibold hover:bg-[#A80F32]"
                >
                  Create Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create Direct Deal */}
      {showCreateDeal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E2337] rounded-xl max-w-md w-full p-6 shadow-xl border border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Register Direct Deal</h3>
            <form onSubmit={handleCreateDirectDeal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Client / Sponsor Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Corporation"
                  value={dealClientName}
                  onChange={(e) => setDealClientName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Campaign Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Summer Q3 Sponsorship"
                  value={dealTitle}
                  onChange={(e) => setDealTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Destination URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://client-landing-page.com"
                  value={dealUrl}
                  onChange={(e) => setDealUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Target Impressions</label>
                <input
                  type="number"
                  min="100"
                  step="100"
                  value={dealTargetImpressions}
                  onChange={(e) => setDealTargetImpressions(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateDeal(false)}
                  className="px-3 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs rounded-lg bg-[#D4143A] text-white font-semibold hover:bg-[#A80F32]"
                >
                  Save Direct Deal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
