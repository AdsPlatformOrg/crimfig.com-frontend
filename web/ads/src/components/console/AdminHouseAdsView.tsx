'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Sparkles,
  Plus,
  RefreshCw,
  Eye,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Sliders,
  Image as ImageIcon,
  Type,
  Video,
  BarChart3,
  Trash2,
  Edit2,
  Check,
  X,
  AlertCircle,
} from 'lucide-react';
import { sessionFetch } from '@/lib/session';

interface HouseCreative {
  id: string;
  title: string;
  headline: string;
  bodyText: string;
  ctaText: string;
  destinationUrl: string;
  adType: 'image' | 'text' | 'video';
  format: string;
  imageUrl: string | null;
  videoUrl: string | null;
  width: number | null;
  height: number | null;
  priority: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Analytics {
  totalHouseServes: number;
  totalHouseClicks: number;
  ctr: string;
}

export function AdminHouseAdsView() {
  const [creatives, setCreatives] = useState<HouseCreative[]>([]);
  const [analytics, setAnalytics] = useState<Analytics>({
    totalHouseServes: 0,
    totalHouseClicks: 0,
    ctr: '0.00%',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCreative, setEditingCreative] = useState<HouseCreative | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    headline: '',
    bodyText: '',
    ctaText: 'Start Advertising',
    destinationUrl: 'https://ads.crimfig.com',
    adType: 'image' as 'image' | 'text' | 'video',
    imageUrl: '',
    priority: 10,
    isActive: true,
  });

  const fetchHouseAds = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await sessionFetch('/api/v1/admin/ads/house-creatives');
      if (!res.ok) {
        throw new Error(`Failed to load house ads: ${res.status}`);
      }
      const json = await res.json();
      setCreatives(json.data || []);
      if (json.analytics) setAnalytics(json.analytics);
    } catch (err: any) {
      setError(err?.message || 'Error loading house ads');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHouseAds();
  }, [fetchHouseAds]);

  const handleOpenCreate = () => {
    setEditingCreative(null);
    setFormData({
      title: '',
      headline: '',
      bodyText: '',
      ctaText: 'Start Advertising',
      destinationUrl: 'https://ads.crimfig.com',
      adType: 'image',
      imageUrl: '',
      priority: 50,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: HouseCreative) => {
    setEditingCreative(c);
    setFormData({
      title: c.title,
      headline: c.headline,
      bodyText: c.bodyText,
      ctaText: c.ctaText,
      destinationUrl: c.destinationUrl,
      adType: c.adType,
      imageUrl: c.imageUrl || '',
      priority: c.priority,
      isActive: c.isActive,
    });
    setIsModalOpen(true);
  };

  const handleToggleActive = async (c: HouseCreative) => {
    try {
      const res = await sessionFetch(`/api/v1/admin/ads/house-creatives/${c.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !c.isActive }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      setSuccessMessage(`Updated "${c.title}"`);
      setTimeout(() => setSuccessMessage(null), 3000);
      fetchHouseAds();
    } catch (err: any) {
      setError(err?.message || 'Update failed');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete house ad "${title}"?`)) return;
    try {
      const res = await sessionFetch(`/api/v1/admin/ads/house-creatives/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete house ad');
      setSuccessMessage(`Deleted "${title}"`);
      setTimeout(() => setSuccessMessage(null), 3000);
      fetchHouseAds();
    } catch (err: any) {
      setError(err?.message || 'Delete failed');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        imageUrl: formData.adType === 'image' && formData.imageUrl ? formData.imageUrl : null,
      };

      if (editingCreative) {
        const res = await sessionFetch(
          `/api/v1/admin/ads/house-creatives/${editingCreative.id}`,
          {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          },
        );
        if (!res.ok) throw new Error('Failed to update house ad');
        setSuccessMessage('House ad updated successfully');
      } else {
        const res = await sessionFetch('/api/v1/admin/ads/house-creatives', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Failed to create house ad');
        setSuccessMessage('House ad created successfully');
      }

      setIsModalOpen(false);
      setTimeout(() => setSuccessMessage(null), 3000);
      fetchHouseAds();
    } catch (err: any) {
      setError(err?.message || 'Submission failed');
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 font-['Poppins',sans-serif]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">House Ads Management</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#D4143A]/20 text-[#D4143A] border border-[#D4143A]/30">
              Platform Admin
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Manage promotional house ads, prioritize creatives, and inspect delivery telemetry.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchHouseAds()}
            className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-300 bg-[#1E2337] hover:bg-[#252B43] rounded-lg border border-white/5 transition"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[#D4143A] to-[#A80F32] hover:opacity-95 rounded-lg shadow-lg shadow-[#D4143A]/20 transition"
          >
            <Plus className="w-4 h-4" />
            Add House Ad
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-[#171B2A] border border-white/10 rounded-xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total House Serves
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">
            {analytics.totalHouseServes.toLocaleString()}
          </div>
          <div className="text-xs text-slate-400 mt-1">Zero-charge promotional impressions</div>
        </div>

        <div className="bg-[#171B2A] border border-white/10 rounded-xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total House Clicks
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#D4143A]/10 flex items-center justify-center text-[#D4143A]">
              <ExternalLink className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">
            {analytics.totalHouseClicks.toLocaleString()}
          </div>
          <div className="text-xs text-slate-400 mt-1">Logged zero-price interaction redirects</div>
        </div>

        <div className="bg-[#171B2A] border border-white/10 rounded-xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              House Click-Through Rate
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{analytics.ctr}</div>
          <div className="text-xs text-slate-400 mt-1">Audited interaction conversion ratio</div>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}
      {successMessage && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{successMessage}</span>
        </div>
      )}

      {/* Creatives Table / Grid */}
      <div className="bg-[#171B2A] border border-white/10 rounded-xl overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-base font-semibold text-white">Active House Creatives ({creatives.length})</h2>
          <span className="text-xs text-slate-400">Ordered by Priority (highest served first)</span>
        </div>

        {isLoading ? (
          <div className="py-20 text-center text-slate-400">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-[#D4143A]" />
            Loading house creatives...
          </div>
        ) : creatives.length === 0 ? (
          <div className="py-20 text-center text-slate-400">
            <Sliders className="w-12 h-12 mx-auto mb-3 text-slate-600" />
            <p className="text-base font-medium text-white mb-1">No house ads configured</p>
            <p className="text-sm text-slate-500 max-w-sm mx-auto mb-4">
              Add your first image or text house ad to serve during promoter testing or unfilled slots.
            </p>
            <button
              onClick={handleOpenCreate}
              className="px-4 py-2 text-sm font-semibold text-white bg-[#D4143A] rounded-lg"
            >
              Add First House Ad
            </button>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {creatives.map((c) => (
              <div
                key={c.id}
                className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:bg-white/[0.02] transition"
              >
                {/* Visual / Thumbnail */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-24 h-16 rounded-lg bg-[#0F121C] border border-white/10 overflow-hidden flex items-center justify-center flex-shrink-0 relative group">
                    {c.adType === 'image' && c.imageUrl ? (
                      <img
                        src={c.imageUrl}
                        alt={c.headline}
                        className="w-full h-full object-cover"
                      />
                    ) : c.adType === 'video' ? (
                      <Video className="w-6 h-6 text-indigo-400" />
                    ) : (
                      <Type className="w-6 h-6 text-slate-400" />
                    )}
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-black/80 text-white">
                      {c.adType}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white text-base leading-snug">{c.title}</h3>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          c.isActive
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                        }`}
                      >
                        {c.isActive ? 'Active' : 'Paused'}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        Priority {c.priority}
                      </span>
                    </div>

                    <p className="text-xs font-medium text-slate-200 mb-1">
                      <span className="text-[#D4143A] font-semibold">{c.headline}</span> — {c.bodyText}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span>CTA: <strong className="text-slate-300">{c.ctaText}</strong></span>
                      <span>Target: <a href={c.destinationUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{c.destinationUrl}</a></span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0 self-end md:self-center">
                  <button
                    onClick={() => handleToggleActive(c)}
                    title={c.isActive ? 'Pause creative' : 'Activate creative'}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${
                      c.isActive
                        ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border-amber-500/30'
                        : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    }`}
                  >
                    {c.isActive ? 'Pause' : 'Activate'}
                  </button>

                  <button
                    onClick={() => handleOpenEdit(c)}
                    className="p-2 text-slate-400 hover:text-white bg-[#1E2337] hover:bg-[#252B43] rounded-lg border border-white/5 transition"
                    title="Edit creative"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(c.id, c.title)}
                    className="p-2 text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 rounded-lg border border-red-500/20 transition"
                    title="Delete creative"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#171B2A] border border-white/10 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">
                {editingCreative ? 'Edit House Ad' : 'Add New House Ad'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Internal Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Hero Woman Laptop Display Ad"
                  className="w-full px-3.5 py-2 text-sm bg-[#0F121C] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#D4143A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Ad Type
                  </label>
                  <select
                    value={formData.adType}
                    onChange={(e: any) => setFormData({ ...formData, adType: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-[#0F121C] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#D4143A]"
                  >
                    <option value="image">Image (Display Hero)</option>
                    <option value="text">Text Only (Fallback)</option>
                    <option value="video">Video</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Priority (Higher wins)
                  </label>
                  <input
                    type="number"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 10 })}
                    className="w-full px-3.5 py-2 text-sm bg-[#0F121C] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#D4143A]"
                  />
                </div>
              </div>

              {formData.adType === 'image' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Image CDN URL
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://media.crimfig.com/house-ads/..."
                    className="w-full px-3.5 py-2 text-sm bg-[#0F121C] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#D4143A]"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Headline
                </label>
                <input
                  type="text"
                  required
                  value={formData.headline}
                  onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                  placeholder="Advertise with CrimFig"
                  className="w-full px-3.5 py-2 text-sm bg-[#0F121C] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#D4143A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Body Text / Value Proposition
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.bodyText}
                  onChange={(e) => setFormData({ ...formData, bodyText: e.target.value })}
                  placeholder="Reach real people. Grow your business."
                  className="w-full px-3.5 py-2 text-sm bg-[#0F121C] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#D4143A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    CTA Button Text
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.ctaText}
                    onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                    placeholder="Start Advertising"
                    className="w-full px-3.5 py-2 text-sm bg-[#0F121C] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#D4143A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Destination URL
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.destinationUrl}
                    onChange={(e) => setFormData({ ...formData, destinationUrl: e.target.value })}
                    placeholder="https://ads.crimfig.com"
                    className="w-full px-3.5 py-2 text-sm bg-[#0F121C] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#D4143A]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[#D4143A] to-[#A80F32] rounded-lg shadow-lg shadow-[#D4143A]/20 hover:opacity-95"
                >
                  {editingCreative ? 'Save Changes' : 'Create Creative'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

