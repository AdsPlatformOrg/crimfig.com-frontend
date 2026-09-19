'use client';

import React, { useState } from 'react';
import {
  Globe,
  UserCheck,
  Smartphone,
  Plus,
  Play,
  Pause,
  ExternalLink,
  Copy,
  Check,
  BarChart3,
  TrendingUp,
  ShieldCheck,
  Radio,
  Layers,
  Sparkles,
  Share2,
  DollarSign,
  Eye,
  MousePointer,
  CheckCircle2,
  AlertCircle,
  X,
  Code2,
  Video
} from 'lucide-react';

interface Campaign {
  id: string;
  title: string;
  category: string;
  format: 'banner' | 'card' | 'video' | 'interstitial';
  channels: ('websites' | 'individuals' | 'mobile_apps')[];
  budgetUsd: number;
  spentUsd: number;
  cpcUsd: number;
  cpmUsd: number;
  status: 'active' | 'paused';
  impressions: number;
  clicks: number;
  headline: string;
  destinationUrl: string;
  imageUrl?: string;
}

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

interface PromoterApp {
  id: string;
  appName: string;
  bundleId: string;
  platform: 'ios' | 'android' | 'both';
  isVerified: boolean;
}

interface InteractionLog {
  id: string;
  type: 'impression' | 'click' | 'embed_ping' | 'reels_view';
  source: 'website' | 'individual' | 'mobile_app' | 'reels';
  identifier: string;
  earningUsd: number;
  timestamp: string;
}

export default function AdsPlatformApp() {
  // Main View: 'advertiser' vs 'promoter'
  const [role, setRole] = useState<'advertiser' | 'promoter'>('promoter');

  // Promoter Sub-section
  const [promoterSection, setPromoterSection] = useState<'websites' | 'individuals' | 'mobile_apps' | 'marketplace'>('websites');

  // Copied State Tracker
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // Reels Consent State
  const [reelsConsent, setReelsConsent] = useState(true);

  // Advertiser Campaigns
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: 'camp_1',
      title: 'CrimFig Stream Creator Program',
      category: 'Entertainment',
      format: 'card',
      channels: ['websites', 'individuals', 'mobile_apps'],
      budgetUsd: 500,
      spentUsd: 142.30,
      cpcUsd: 0.10,
      cpmUsd: 0.01,
      status: 'active',
      impressions: 14230,
      clicks: 680,
      headline: 'Broadcast in 1080p60 on CrimFig Stream',
      destinationUrl: 'https://stream.crimfig.com',
      imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=60',
    },
    {
      id: 'camp_2',
      title: 'AI Video Upscaling Tool Launch',
      category: 'Technology',
      format: 'banner',
      channels: ['websites', 'individuals'],
      budgetUsd: 1200,
      spentUsd: 489.10,
      cpcUsd: 0.15,
      cpmUsd: 0.015,
      status: 'active',
      impressions: 32600,
      clicks: 1840,
      headline: 'Upscale Any Video to 4K in Real Time',
      destinationUrl: 'https://crimfig.com',
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60',
    },
  ]);

  // Promoter Websites
  const [websites, setWebsites] = useState<PromoterWebsite[]>([
    {
      id: 'web_1',
      domain: 'techtrends.ng',
      url: 'https://techtrends.ng',
      verificationToken: 'cf_verify_8a7d2b9e1c4f',
      verificationMethod: 'html_file_and_meta_tag',
      isVerified: true,
      lastPingAt: '3 mins ago (embed.js active)',
      activePlacementCount: 2,
    },
    {
      id: 'web_2',
      domain: 'dailyafricannews.com',
      url: 'https://dailyafricannews.com',
      verificationToken: 'cf_verify_5d3e8a1f9c0b',
      verificationMethod: 'dns_txt',
      isVerified: false,
      lastPingAt: 'Never pinged',
      activePlacementCount: 0,
    },
  ]);

  // Promoter Mobile Apps
  const [apps, setApps] = useState<PromoterApp[]>([
    { id: 'app_1', appName: 'Naija Scoreboard Pro', bundleId: 'com.naijascores.live', platform: 'both', isVerified: true },
  ]);

  // Interaction Logs (User requested interaction logging on websites & apps)
  const [logs, setLogs] = useState<InteractionLog[]>([
    { id: 'log_1', type: 'impression', source: 'website', identifier: 'techtrends.ng/news/ai', earningUsd: 0.007, timestamp: '1 min ago' },
    { id: 'log_2', type: 'click', source: 'individual', identifier: 'CrimFig Reels (Share Link)', earningUsd: 0.07, timestamp: '4 mins ago' },
    { id: 'log_3', type: 'embed_ping', source: 'website', identifier: 'techtrends.ng [Embed Verification Ping]', earningUsd: 0.0, timestamp: '7 mins ago' },
    { id: 'log_4', type: 'impression', source: 'mobile_app', identifier: 'Naija Scoreboard Pro (Android)', earningUsd: 0.007, timestamp: '12 mins ago' },
    { id: 'log_5', type: 'click', source: 'website', identifier: 'techtrends.ng/article/stream', earningUsd: 0.07, timestamp: '18 mins ago' },
  ]);

  // Modals
  const [isCreateCampaignOpen, setIsCreateCampaignOpen] = useState(false);
  const [isAddWebsiteOpen, setIsAddWebsiteOpen] = useState(false);
  const [isEmbedCodeModalOpen, setIsEmbedCodeModalOpen] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Form: Create Campaign
  const [newCampTitle, setNewCampTitle] = useState('');
  const [newCampBudget, setNewCampBudget] = useState(100);
  const [newCampCategory, setNewCampCategory] = useState('Technology');
  const [newCampFormat, setNewCampFormat] = useState<'banner' | 'card' | 'video' | 'interstitial'>('card');
  const [newCampChannels, setNewCampChannels] = useState<('websites' | 'individuals' | 'mobile_apps')[]>(['websites', 'individuals']);
  const [newCampHeadline, setNewCampHeadline] = useState('');
  const [newCampUrl, setNewCampUrl] = useState('');

  // Form: Add Website
  const [newWebDomain, setNewWebDomain] = useState('');
  const [newWebMethod, setNewWebMethod] = useState<'html_file_and_meta_tag' | 'dns_txt'>('html_file_and_meta_tag');

  // Copy helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(id);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  // Add Campaign Submit
  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampTitle || !newCampHeadline || !newCampUrl) return;
    const newCamp: Campaign = {
      id: `camp_${Date.now()}`,
      title: newCampTitle,
      category: newCampCategory,
      format: newCampFormat,
      channels: newCampChannels,
      budgetUsd: Number(newCampBudget),
      spentUsd: 0,
      cpcUsd: 0.10,
      cpmUsd: 0.01,
      status: 'active',
      impressions: 0,
      clicks: 0,
      headline: newCampHeadline,
      destinationUrl: newCampUrl,
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60',
    };
    setCampaigns([newCamp, ...campaigns]);
    setIsCreateCampaignOpen(false);
    setNewCampTitle('');
    setNewCampHeadline('');
    setNewCampUrl('');
  };

  // Add Website Submit
  const handleAddWebsite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWebDomain) return;
    const clean = newWebDomain.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    const newSite: PromoterWebsite = {
      id: `web_${Date.now()}`,
      domain: clean,
      url: `https://${clean}`,
      verificationToken: `cf_verify_${Math.random().toString(36).substring(2, 12)}`,
      verificationMethod: newWebMethod,
      isVerified: false,
      lastPingAt: 'Pending verification',
      activePlacementCount: 0,
    };
    setWebsites([...websites, newSite]);
    setIsAddWebsiteOpen(false);
    setNewWebDomain('');
  };

  // Verify Website action
  const handleVerifyWebsite = (siteId: string) => {
    setWebsites(websites.map(w => w.id === siteId ? { ...w, isVerified: true, lastPingAt: 'Just now (verified)' } : w));
  };

  // Toggle Campaign status
  const handleToggleStatus = (campId: string) => {
    setCampaigns(campaigns.map(c => {
      if (c.id === campId) {
        return { ...c, status: c.status === 'active' ? 'paused' : 'active' };
      }
      return c;
    }));
  };

  // Compute stats
  const totalAdvertiserBudget = campaigns.reduce((a, b) => a + b.budgetUsd, 0);
  const totalAdvertiserSpent = campaigns.reduce((a, b) => a + b.spentUsd, 0);
  const totalPromoterEarned = logs.reduce((a, b) => a + b.earningUsd, 0);

  const categories = ['All', 'Technology', 'Entertainment', 'Finance', 'Lifestyle', 'Gaming'];

  const filteredCampaigns = selectedCategory === 'All'
    ? campaigns
    : campaigns.filter(c => c.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="min-h-screen text-slate-100 flex flex-col">
      {/* Top Header */}
      <header className="border-b border-white/10 bg-slate-900/60 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center font-black text-xl text-white shadow-lg shadow-purple-500/25">
              AD
            </div>
            <div>
              <div className="font-bold text-lg leading-tight flex items-center gap-2">
                CrimFig <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Ads</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  Global Network
                </span>
              </div>
            </div>
          </div>

          {/* Mode Switcher: Advertiser vs Promoter */}
          <div className="flex items-center p-1 rounded-xl bg-slate-800/80 border border-white/10 text-xs font-semibold">
            <button
              onClick={() => setRole('promoter')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                role === 'promoter' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              Promoter Hub
            </button>
            <button
              onClick={() => setRole('advertiser')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                role === 'advertiser' ? 'bg-gradient-to-r from-indigo-600 to-sky-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Advertiser Studio
            </button>
          </div>

          {/* Wallet Link */}
          <div className="hidden sm:flex items-center gap-3 text-xs">
            <a
              href="https://billing.crimfig.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/60 border border-white/10 text-slate-300 hover:text-white hover:border-indigo-500/40 transition-all"
            >
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span>Billing Wallet</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-8">
        
        {/* ========================================================================= */}
        {/* ROLE 1: PROMOTER HUB */}
        {/* ========================================================================= */}
        {role === 'promoter' && (
          <div className="space-y-8">
            {/* Promoter Banner */}
            <div className="glass-card p-6 sm:p-8 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-purple-950/40 relative overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Monetize Your Traffic & Audience
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">
                    Promoter Monetization Hub
                  </h1>
                  <p className="text-sm text-slate-400 mt-1 max-w-2xl">
                    Display active ecosystem ads on your websites, mobile apps, or share verified links across social channels and auto-sync with your Crimfig Reels.
                  </p>
                </div>

                {/* Earnings card */}
                <div className="p-4 rounded-2xl bg-slate-800/60 border border-white/10 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-black text-xl">
                    $
                  </div>
                  <div>
                    <span className="text-xs text-slate-400">Total Accrued Earnings</span>
                    <div className="text-2xl font-black text-white">${totalPromoterEarned.toFixed(2)} USD</div>
                    <span className="text-[11px] text-emerald-400">Ready for instant bank payout</span>
                  </div>
                </div>
              </div>

              {/* Promoter Section Navigation */}
              <div className="flex items-center gap-2 mt-8 pt-6 border-t border-white/10 overflow-x-auto pb-1 text-sm font-medium">
                <button
                  onClick={() => setPromoterSection('websites')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                    promoterSection === 'websites' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <Globe className="w-4 h-4" />
                  Websites & Embeds ({websites.length})
                </button>
                <button
                  onClick={() => setPromoterSection('individuals')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                    promoterSection === 'individuals' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <Share2 className="w-4 h-4" />
                  Individual Share Links & Reels
                </button>
                <button
                  onClick={() => setPromoterSection('mobile_apps')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                    promoterSection === 'mobile_apps' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  Mobile Apps ({apps.length})
                </button>
                <button
                  onClick={() => setPromoterSection('marketplace')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                    promoterSection === 'marketplace' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  Browse Ad Campaigns ({campaigns.length})
                </button>
              </div>
            </div>

            {/* SECTION 1: WEBSITES */}
            {promoterSection === 'websites' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold">Registered Websites</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Verify ownership and embed script tags. Each embed load pings the server to verify site authenticity.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsAddWebsiteOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 font-semibold text-xs text-white shadow-lg shadow-purple-600/25 transition-all w-fit"
                  >
                    <Plus className="w-4 h-4" /> Add Website
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {websites.map((site) => (
                    <div key={site.id} className="glass-card p-6 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-base flex items-center gap-2">
                            <Globe className="w-4 h-4 text-purple-400" />
                            {site.domain}
                          </span>
                          <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                            site.isVerified ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}>
                            {site.isVerified ? 'Verified Domain' : 'Verification Required'}
                          </span>
                        </div>

                        <div className="mt-3 p-3 rounded-xl bg-slate-800/50 border border-white/5 space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Embed Status:</span>
                            <span className="text-slate-200 font-mono">{site.lastPingAt}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Verification Token:</span>
                            <span className="font-mono text-purple-300">{site.verificationToken}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Method:</span>
                            <span className="text-slate-300 capitalize">{site.verificationMethod.replace(/_/g, ' ')}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-2">
                        {!site.isVerified ? (
                          <button
                            onClick={() => handleVerifyWebsite(site.id)}
                            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-all"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" /> Check Verification Now
                          </button>
                        ) : (
                          <button
                            onClick={() => setIsEmbedCodeModalOpen(site.domain)}
                            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-all"
                          >
                            <Code2 className="w-3.5 h-3.5" /> Get Embed Code
                          </button>
                        )}

                        <span className="text-xs text-slate-500">{site.activePlacementCount} active ads</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION 2: INDIVIDUAL PROMOTERS & REELS */}
            {promoterSection === 'individuals' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold">Individual Promoters & Social Sharing</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Share links across social platforms, blogs, and automatically publish to your CrimFig Reels.
                  </p>
                </div>

                {/* CrimFig Reels Auto-Sync Card */}
                <div className="glass-card p-6 bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/30 border-purple-500/30">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Video className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-base">CrimFig Reels Sync</h4>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 font-bold">
                            Direct Creator Integration
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 max-w-xl">
                          When enabled, applying to an active campaign can automatically post a sponsored card on your verified Crimfig Reels profile, crediting your wallet on every view and click.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-slate-300">
                        {reelsConsent ? 'Auto-Sync Active' : 'Consent Off'}
                      </span>
                      <button
                        onClick={() => setReelsConsent(!reelsConsent)}
                        className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                          reelsConsent ? 'bg-pink-600' : 'bg-slate-700'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                          reelsConsent ? 'translate-x-6' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Share Links for Active Campaigns */}
                <div className="space-y-4">
                  <h4 className="font-bold text-sm text-slate-300">Your Share Links</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {campaigns.map((camp) => {
                      const shareLink = `https://ads.crimfig.com/api/v1/delivery/go/token_${camp.id}?pid=promoter_991`;
                      return (
                        <div key={camp.id} className="glass-card p-6 space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase text-purple-400">{camp.category}</span>
                            <span className="text-xs text-emerald-400 font-bold">${camp.cpcUsd.toFixed(2)} / Click</span>
                          </div>
                          <h5 className="font-bold text-base text-slate-100">{camp.title}</h5>
                          <p className="text-xs text-slate-400">{camp.headline}</p>

                          <div className="p-2.5 rounded-xl bg-slate-800/80 border border-white/5 flex items-center justify-between text-xs font-mono">
                            <span className="truncate text-slate-300 max-w-[240px]">{shareLink}</span>
                            <button
                              onClick={() => handleCopy(shareLink, camp.id)}
                              className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-sans text-xs font-semibold flex items-center gap-1 transition-all"
                            >
                              {copiedToken === camp.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                              {copiedToken === camp.id ? 'Copied' : 'Copy'}
                            </button>
                          </div>

                          <div className="flex items-center gap-2 pt-2 text-xs text-slate-400">
                            <span>Share on:</span>
                            <a
                              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(camp.headline + ' ' + shareLink)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                            >
                              X (Twitter)
                            </a>
                            <a
                              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(camp.headline + ' ' + shareLink)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                            >
                              WhatsApp
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 3: MOBILE APPS */}
            {promoterSection === 'mobile_apps' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold">Registered Mobile Apps</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Integrate CrimFig Ads Native SDK into iOS and Android applications.
                    </p>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 font-semibold text-xs text-white shadow-lg shadow-purple-600/25 transition-all w-fit">
                    <Plus className="w-4 h-4" /> Add Mobile App
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {apps.map((app) => (
                    <div key={app.id} className="glass-card p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-base flex items-center gap-2">
                          <Smartphone className="w-4 h-4 text-purple-400" />
                          {app.appName}
                        </span>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                          Verified App
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 space-y-1">
                        <div>Bundle ID: <span className="font-mono text-slate-200">{app.bundleId}</span></div>
                        <div>Platform: <span className="text-slate-200 uppercase">{app.platform}</span></div>
                      </div>
                      <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                        <button className="text-xs text-purple-400 hover:underline">
                          View SDK Documentation &rarr;
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION 4: MARKETPLACE & APPLY */}
            {promoterSection === 'marketplace' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold">Ad Campaigns Marketplace</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Select categories matching your audience. Apply to display ads on websites or share links.
                    </p>
                  </div>

                  {/* Category Filter */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                          selectedCategory === cat ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredCampaigns.map((camp) => (
                    <div key={camp.id} className="glass-card p-6 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs uppercase font-extrabold text-purple-400">{camp.category}</span>
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold border border-white/5 uppercase">
                            {camp.format}
                          </span>
                        </div>
                        <h4 className="font-bold text-lg text-slate-100">{camp.title}</h4>
                        <p className="text-xs text-slate-400 mt-1">{camp.headline}</p>

                        <div className="mt-4 grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-800/40 border border-white/5 text-xs">
                          <div>
                            <span className="text-slate-400 block">Promoter Payout</span>
                            <span className="font-bold text-emerald-400">${(camp.cpcUsd * 0.7).toFixed(3)} / Click</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block">Impression Payout</span>
                            <span className="font-bold text-emerald-400">${(camp.cpmUsd * 0.7).toFixed(4)} / View</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                        <div className="text-xs text-slate-400">
                          Targeting: {camp.channels.join(', ')}
                        </div>
                        <button
                          onClick={() => {
                            setPromoterSection('individuals');
                            alert(`Applied to ${camp.title}! Share link generated in Individual Promoters tab.`);
                          }}
                          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 font-semibold text-xs text-white shadow-md transition-all"
                        >
                          Apply to Display Ad
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* REAL-TIME INTERACTION LOGS TABLE */}
            <div className="glass-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-base flex items-center gap-2">
                    <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                    Live Interaction & Verification Stream
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Real-time log of impressions, clicks, and site verification pings across your promoter channels.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-800/60 text-slate-400 uppercase tracking-wider border-b border-white/10">
                    <tr>
                      <th className="p-3">Event Type</th>
                      <th className="p-3">Source Channel</th>
                      <th className="p-3">Placement / Host</th>
                      <th className="p-3">Accrued Earning</th>
                      <th className="p-3">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {logs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-800/30">
                        <td className="p-3 font-semibold capitalize text-slate-200">
                          <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                            log.type === 'click' ? 'bg-emerald-400' : log.type === 'impression' ? 'bg-sky-400' : 'bg-purple-400'
                          }`} />
                          {log.type.replace('_', ' ')}
                        </td>
                        <td className="p-3 text-slate-400 capitalize">{log.source.replace('_', ' ')}</td>
                        <td className="p-3 font-mono text-slate-300">{log.identifier}</td>
                        <td className="p-3 font-bold text-emerald-400">
                          {log.earningUsd > 0 ? `+$${log.earningUsd.toFixed(3)} USD` : 'Verification Only'}
                        </td>
                        <td className="p-3 text-slate-500">{log.timestamp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ROLE 2: ADVERTISER STUDIO */}
        {/* ========================================================================= */}
        {role === 'advertiser' && (
          <div className="space-y-8">
            {/* Top Advertiser Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="glass-card p-6">
                <span className="text-xs text-slate-400 block">Total Budget Allocated</span>
                <span className="text-2xl font-black text-white mt-1 block">${totalAdvertiserBudget.toFixed(2)} USD</span>
                <span className="text-[11px] text-slate-500 mt-1 block">{campaigns.length} campaigns</span>
              </div>
              <div className="glass-card p-6">
                <span className="text-xs text-slate-400 block">Total Spend Realized</span>
                <span className="text-2xl font-black text-indigo-400 mt-1 block">${totalAdvertiserSpent.toFixed(2)} USD</span>
                <span className="text-[11px] text-emerald-400 mt-1 block">Deducted from billing wallet</span>
              </div>
              <div className="glass-card p-6">
                <span className="text-xs text-slate-400 block">Total Network Impressions</span>
                <span className="text-2xl font-black text-white mt-1 block">46,830</span>
                <span className="text-[11px] text-slate-500 mt-1 block">Web, Mobile & Social</span>
              </div>
              <div className="glass-card p-6">
                <span className="text-xs text-slate-400 block">Total Clicks & CTR</span>
                <span className="text-2xl font-black text-emerald-400 mt-1 block">2,520 (5.38%)</span>
                <span className="text-[11px] text-slate-500 mt-1 block">Average conversion rate</span>
              </div>
            </div>

            {/* Campaign Management Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Active Ad Campaigns</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Launch ads across verified websites, mobile apps, and individual creator networks.
                </p>
              </div>

              <button
                onClick={() => setIsCreateCampaignOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-500 hover:from-indigo-500 hover:to-sky-400 font-semibold text-xs text-white shadow-lg shadow-indigo-600/25 transition-all w-fit"
              >
                <Plus className="w-4 h-4" /> Create New Campaign
              </button>
            </div>

            {/* Campaigns Table */}
            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-800/60 text-slate-400 text-xs uppercase tracking-wider border-b border-white/10">
                    <tr>
                      <th className="p-4">Campaign</th>
                      <th className="p-4">Target Channels</th>
                      <th className="p-4">Budget & Spend</th>
                      <th className="p-4">Impressions / Clicks</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {campaigns.map((camp) => (
                      <tr key={camp.id} className="hover:bg-slate-800/30">
                        <td className="p-4">
                          <div className="font-bold text-slate-200">{camp.title}</div>
                          <div className="text-xs text-slate-400">{camp.headline}</div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1">
                            {camp.channels.map((ch) => (
                              <span key={ch} className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 font-medium">
                                {ch.replace('_', ' ')}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-semibold text-slate-200">
                            ${camp.spentUsd.toFixed(2)} / ${camp.budgetUsd.toFixed(2)}
                          </div>
                          {/* Progress bar */}
                          <div className="w-32 h-1.5 rounded-full bg-slate-800 mt-1 overflow-hidden">
                            <div
                              className="h-full bg-indigo-500 rounded-full"
                              style={{ width: `${Math.min(100, (camp.spentUsd / camp.budgetUsd) * 100)}%` }}
                            />
                          </div>
                        </td>
                        <td className="p-4 text-xs text-slate-300">
                          <div>{camp.impressions.toLocaleString()} views</div>
                          <div className="text-emerald-400 font-semibold">{camp.clicks.toLocaleString()} clicks</div>
                        </td>
                        <td className="p-4">
                          <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                            camp.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}>
                            {camp.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleToggleStatus(camp.id)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                            title={camp.status === 'active' ? 'Pause Campaign' : 'Resume Campaign'}
                          >
                            {camp.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL: CREATE CAMPAIGN */}
      {isCreateCampaignOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-card w-full max-w-lg p-6 sm:p-8 bg-slate-900 border-slate-700 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsCreateCampaignOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold mb-1">Launch Ad Campaign</h3>
            <p className="text-xs text-slate-400 mb-6">
              Reach audiences across websites, creators, and mobile apps. Budget is locked in USD.
            </p>

            <form onSubmit={handleCreateCampaign} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Campaign Title</label>
                <input
                  type="text"
                  required
                  value={newCampTitle}
                  onChange={(e) => setNewCampTitle(e.target.value)}
                  placeholder="e.g. Summer App Promo"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-white/10 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Budget (USD)</label>
                  <input
                    type="number"
                    min="5"
                    required
                    value={newCampBudget}
                    onChange={(e) => setNewCampBudget(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-white/10 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Format</label>
                  <select
                    value={newCampFormat}
                    onChange={(e: any) => setNewCampFormat(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-white/10 text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="card">Card Ad</option>
                    <option value="banner">Banner</option>
                    <option value="video">Video</option>
                    <option value="interstitial">Interstitial</option>
                  </select>
                </div>
              </div>

              {/* Channel Distribution Checkboxes */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-2">Target Distribution Channels</label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {[
                    { id: 'websites', label: 'Websites', icon: Globe },
                    { id: 'individuals', label: 'Individuals / Reels', icon: Share2 },
                    { id: 'mobile_apps', label: 'Mobile Apps', icon: Smartphone },
                  ].map((ch) => {
                    const isChecked = newCampChannels.includes(ch.id as any);
                    return (
                      <button
                        type="button"
                        key={ch.id}
                        onClick={() => {
                          if (isChecked) {
                            if (newCampChannels.length > 1) {
                              setNewCampChannels(newCampChannels.filter(c => c !== ch.id));
                            }
                          } else {
                            setNewCampChannels([...newCampChannels, ch.id as any]);
                          }
                        }}
                        className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 text-center transition-all ${
                          isChecked ? 'bg-indigo-600/30 border-indigo-500 text-white' : 'bg-slate-800/40 border-white/5 text-slate-400'
                        }`}
                      >
                        <ch.icon className="w-4 h-4" />
                        <span className="font-semibold text-[11px]">{ch.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Headline Copy</label>
                <input
                  type="text"
                  required
                  value={newCampHeadline}
                  onChange={(e) => setNewCampHeadline(e.target.value)}
                  placeholder="e.g. Try CrimFig Stream in 1080p today"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-white/10 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Destination URL</label>
                <input
                  type="url"
                  required
                  value={newCampUrl}
                  onChange={(e) => setNewCampUrl(e.target.value)}
                  placeholder="https://yourwebsite.com/landing"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-white/10 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300">
                Campaign budget of ${newCampBudget} USD will be reserved in your CrimFig Billing Wallet and spent only on tracked views and clicks.
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-500 hover:from-indigo-500 hover:to-sky-400 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all"
              >
                Launch Campaign & Lock Budget
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD WEBSITE */}
      {isAddWebsiteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-card w-full max-w-md p-6 sm:p-8 bg-slate-900 border-slate-700 shadow-2xl relative">
            <button
              onClick={() => setIsAddWebsiteOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold mb-1">Register Website</h3>
            <p className="text-xs text-slate-400 mb-6">
              You must verify domain control before embed ads will be served.
            </p>

            <form onSubmit={handleAddWebsite} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Domain or URL</label>
                <input
                  type="text"
                  required
                  value={newWebDomain}
                  onChange={(e) => setNewWebDomain(e.target.value)}
                  placeholder="e.g. mytechblog.com"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-white/10 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Verification Method</label>
                <select
                  value={newWebMethod}
                  onChange={(e: any) => setNewWebMethod(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800/80 border border-white/10 text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="html_file_and_meta_tag">HTML Meta Tag (&lt;meta name="crimfig-site-verification" ...&gt;)</option>
                  <option value="dns_txt">DNS TXT Record (crimfig-site-verification=...)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 transition-all mt-2"
              >
                Register & Get Token
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EMBED CODE SNIPPET */}
      {isEmbedCodeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-card w-full max-w-lg p-6 sm:p-8 bg-slate-900 border-slate-700 shadow-2xl relative">
            <button
              onClick={() => setIsEmbedCodeModalOpen(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold mb-1">Website Embed Code</h3>
            <p className="text-xs text-slate-400 mb-4">
              Copy and paste this snippet into the HTML of <span className="text-white font-mono">{isEmbedCodeModalOpen}</span> where you want ads to appear.
            </p>

            <div className="p-4 rounded-xl bg-slate-950 border border-white/10 font-mono text-xs text-slate-300 space-y-2 relative">
              <pre className="overflow-x-auto whitespace-pre-wrap">
{`<div id="cf-ad-slot-1092" class="crimfig-ad-slot"></div>
<script src="https://ads.crimfig.com/api/v1/delivery/embed.js" data-placement="slot_1092" async></script>`}
              </pre>
              <button
                onClick={() => handleCopy(`<div id="cf-ad-slot-1092" class="crimfig-ad-slot"></div>\n<script src="https://ads.crimfig.com/api/v1/delivery/embed.js" data-placement="slot_1092" async></script>`, 'embed_code')}
                className="absolute top-3 right-3 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-sans text-xs font-semibold flex items-center gap-1"
              >
                {copiedToken === 'embed_code' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copiedToken === 'embed_code' ? 'Copied' : 'Copy Snippet'}
              </button>
            </div>

            <div className="p-3 mt-4 rounded-xl bg-slate-800/60 border border-white/5 text-xs text-slate-400">
              <span className="font-bold text-slate-200">How it works:</span> When a visitor lands on your site, this script pings the verification endpoint with your domain, fetches high-converting ads, and records your revenue in USD cents.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
