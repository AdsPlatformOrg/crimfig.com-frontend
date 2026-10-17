'use client';

import React, { useState, useEffect } from 'react';
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
  Hand,
  CheckCircle2,
  AlertCircle,
  X,
  Code2,
  Video,
  Loader2,
  Inbox,
  ArrowLeft,
  SlidersHorizontal,
  RefreshCw,
  CreditCard,
  UploadCloud,
} from 'lucide-react';
import { ThemeSwitcher } from '../components/ThemeSwitcher';
import { EmptyState } from '../components/EmptyState';
import { TableSkeleton, CardSkeleton } from '../components/LoadingStates';
import {
  CRIMFIG_PLACEMENTS,
  type CrimFigPlacement,
  generateCrimFigEmbedCode,
  generateCrimFigVerifyMetaTag,
} from '../components/CrimFigAdSlot';
import { LandingPage } from '../components/landing/LandingPage';
import { ConsoleDashboard } from '../components/console/ConsoleDashboard';
import { TablePreferencesModal, type ColumnConfig } from '../components/console/TablePreferencesModal';
import { ReplaceCreativeModal } from '../components/console/ReplaceCreativeModal';
import { BillingLedger } from '../components/console/billing/BillingLedger';
import { PromoterQualityCard } from '../components/console/PromoterQualityCard';
import { AdminModerationQueue } from '../components/console/AdminModerationQueue';


interface CampaignCreativeItem {
  id?: string;
  headline: string;
  destinationUrl: string;
  adFormat: 'banner' | 'card' | 'video' | 'interstitial';
  mediaFormat?: 'image' | 'gif' | 'video';
  imageUrl?: string;
  videoUrl?: string;
  reviewStatus?: string;
  rejectionReason?: string;
}

interface Campaign {
  id: string;
  title: string;
  category: string;
  format: 'banner' | 'card' | 'video' | 'interstitial';
  formats?: ('banner' | 'card' | 'video' | 'interstitial')[];
  creatives?: CampaignCreativeItem[];
  channels: ('websites' | 'individuals' | 'mobile_apps')[];
  budgetUsd: number;
  spentUsd: number;
  cpcUsd: number;
  cpmUsd: number;
  status: 'active' | 'paused' | 'under_review' | 'draft' | 'rejected' | 'suspended' | 'trash';
  moderationStatus?: 'draft' | 'pending_primary_review' | 'pending_manager_approval' | 'approved' | 'rejected';
  impressions: number;
  clicks: number;
  hovers?: number;
  touches?: number;
  headline: string;
  destinationUrl: string;
  imageUrl?: string;
  videoUrl?: string;
  rejectionReason?: string;
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

const API_BASE = process.env.NEXT_PUBLIC_ADS_API_URL || 'https://ads-api-production-d889.up.railway.app';

export default function AdsPlatformApp() {
  // Top Level View: Landing Page vs Management Console
  const [view, setView] = useState<'landing' | 'console'>('landing');

  // Main Console Role: 'advertiser' vs 'promoter' vs 'admin'
  const [role, setRole] = useState<'advertiser' | 'promoter' | 'admin'>('advertiser');

  // Advertiser Sub-Tab: Dashboard (Primary) vs Campaigns vs Billing & Escrow
  const [advertiserTab, setAdvertiserTab] = useState<'dashboard' | 'campaigns' | 'billing'>('dashboard');

  // Campaign Status Filter Tab: all, active, paused, under_review, draft, rejected, suspended, trash
  const [campaignStatusFilter, setCampaignStatusFilter] = useState<string>('all');

  // Table Preferences Modal
  const [isTablePrefsOpen, setIsTablePrefsOpen] = useState(false);
  const [columnsConfig, setColumnsConfig] = useState<ColumnConfig[]>([
    { key: 'campaign', label: 'Campaign Title', visible: true, order: 0 },
    { key: 'status', label: 'Status', visible: true, order: 1 },
    { key: 'budget', label: 'Total Budget', visible: true, order: 2 },
    { key: 'spend', label: 'Spend', visible: true, order: 3 },
    { key: 'views', label: 'Views (Impressions)', visible: true, order: 4 },
    { key: 'clicks', label: 'Clicks', visible: true, order: 5 },
    { key: 'hovers', label: 'Hovers', visible: true, order: 6 },
    { key: 'touches', label: 'Touches', visible: true, order: 7 },
    { key: 'ctr', label: 'CTR (%)', visible: true, order: 8 },
    { key: 'actions', label: 'Actions', visible: true, order: 9 },
  ]);

  // Inline Creative Replacement Modal
  const [replacementCreative, setReplacementCreative] = useState<any | null>(null);

  // Promoter Sub-section: websites, individuals, mobile_apps, marketplace, billing, quality
  const [promoterSection, setPromoterSection] = useState<'websites' | 'individuals' | 'mobile_apps' | 'marketplace' | 'billing' | 'quality'>('websites');


  // Loading States
  const [isLoadingCampaigns, setIsLoadingCampaigns] = useState<boolean>(true);
  const [isLoadingWebsites, setIsLoadingWebsites] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Copied State Tracker
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // Reels Consent State
  const [reelsConsent, setReelsConsent] = useState(true);

  // Default Campaigns including active, paused, under_review, and rejected for rich demonstration
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: 'camp_001',
      title: 'CrimFig Cloud Infrastructure Launch',
      category: 'Technology',
      format: 'card',
      channels: ['websites', 'mobile_apps'],
      budgetUsd: 500,
      spentUsd: 218.4,
      cpcUsd: 0.15,
      cpmUsd: 0.02,
      status: 'active',
      impressions: 48900,
      clicks: 1820,
      hovers: 3950,
      touches: 1680,
      headline: 'Deploy globally distributed microservices with <15ms latency',
      destinationUrl: 'https://crimfig.com',
      imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'camp_002',
      title: 'Pan-African Tech Summit 2026',
      category: 'Technology',
      format: 'banner',
      channels: ['websites', 'individuals'],
      budgetUsd: 350,
      spentUsd: 142.1,
      cpcUsd: 0.12,
      cpmUsd: 0.015,
      status: 'active',
      impressions: 34100,
      clicks: 1240,
      hovers: 2420,
      touches: 980,
      headline: 'Register now for Lagos & Nairobi developer conference passes',
      destinationUrl: 'https://crimfig.com/summit',
      imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'camp_003',
      title: 'High-Yield Cloud Mining Promo',
      category: 'Finance',
      format: 'card',
      channels: ['websites'],
      budgetUsd: 200,
      spentUsd: 0,
      cpcUsd: 0.25,
      cpmUsd: 0.03,
      status: 'rejected',
      impressions: 0,
      clicks: 0,
      hovers: 0,
      touches: 0,
      headline: 'Earn up to 25% passive crypto returns daily',
      destinationUrl: 'https://example.com/mining',
      rejectionReason: 'Financial claim flagged by compliance policy. Guaranteed returns are not permitted.',
    },
    {
      id: 'camp_004',
      title: 'CrimFig Reels Creator Fund',
      category: 'Entertainment',
      format: 'video',
      channels: ['individuals'],
      budgetUsd: 400,
      spentUsd: 221.9,
      cpcUsd: 0.18,
      cpmUsd: 0.025,
      status: 'active',
      impressions: 59850,
      clicks: 1830,
      hovers: 6050,
      touches: 3520,
      headline: 'Get paid directly for your viral reels and creator posts',
      destinationUrl: 'https://reels.crimfig.com',
      videoUrl: 'https://cdn.crimfig.com/creatives/reels.mp4',
    },
  ]);

  const [websites, setWebsites] = useState<PromoterWebsite[]>([]);
  const [apps, setApps] = useState<PromoterApp[]>([]);
  const [logs, setLogs] = useState<InteractionLog[]>([]);

  // Modals
  const [isCreateCampaignOpen, setIsCreateCampaignOpen] = useState(false);
  const [isAddWebsiteOpen, setIsAddWebsiteOpen] = useState(false);
  const [isEmbedCodeModalOpen, setIsEmbedCodeModalOpen] = useState<{ domain: string; publisherKey: string } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPlacement, setSelectedPlacement] = useState<CrimFigPlacement>('banner_top');

  // Form: Create Campaign
  const [newCampTitle, setNewCampTitle] = useState('');
  const [newCampBudget, setNewCampBudget] = useState(100);
  const [newCampCategory, setNewCampCategory] = useState('Technology');
  const [newCampChannels, setNewCampChannels] = useState<('websites' | 'individuals' | 'mobile_apps')[]>(['websites', 'individuals']);
  const [newCampCreatives, setNewCampCreatives] = useState<CampaignCreativeItem[]>([
    {
      headline: '',
      destinationUrl: '',
      adFormat: 'card',
      mediaFormat: 'image',
    },
  ]);

  // Form: Add Website
  const [newWebDomain, setNewWebDomain] = useState('');
  const [newWebMethod, setNewWebMethod] = useState<'html_file_and_meta_tag' | 'dns_txt'>('html_file_and_meta_tag');

  // Fetch Live Data on mount
  useEffect(() => {
    async function loadData() {
      setIsLoadingCampaigns(true);
      setIsLoadingWebsites(true);

      try {
        const campRes = await fetch(`${API_BASE}/api/v1/campaigns/catalog`);
        if (campRes.ok) {
          const json = await campRes.json();
          if (json.data && Array.isArray(json.data)) {
            setCampaigns(json.data.map((c: any) => ({
              id: c.id,
              title: c.title,
              category: c.category || 'General',
              format: c.format || 'card',
              channels: c.channels || ['websites'],
              budgetUsd: c.budgetUsdCents ? c.budgetUsdCents / 100 : 0,
              spentUsd: c.spentUsdCents ? c.spentUsdCents / 100 : 0,
              cpcUsd: c.costPerClickCents ? c.costPerClickCents / 100 : 0.1,
              cpmUsd: c.costPerImpressionCents ? c.costPerImpressionCents / 100 : 0.01,
              status: c.status || 'active',
              impressions: c.impressionsCount || 0,
              clicks: c.clicksCount || 0,
              headline: c.headline || c.title,
              destinationUrl: c.destinationUrl || 'https://crimfig.com',
            })));
          }
        }
      } catch (e) {
        console.error('Failed to load campaigns:', e);
      } finally {
        setIsLoadingCampaigns(false);
      }

      try {
        const webRes = await fetch(`${API_BASE}/api/v1/promoters/sites`, {
          headers: { 'x-user-id': 'demo-promoter' }
        });
        if (webRes.ok) {
          const json = await webRes.json();
          if (json.data && Array.isArray(json.data)) {
            setWebsites(json.data);
          }
        }
      } catch (e) {
        console.error('Failed to load sites:', e);
      } finally {
        setIsLoadingWebsites(false);
      }
    }

    loadData();
  }, []);

  // Copy helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(id);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  // Add Campaign Submit
  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampTitle || newCampCreatives.length === 0) return;
    const validCreatives = newCampCreatives.filter((c) => c.headline.trim() && c.destinationUrl.trim());
    if (validCreatives.length === 0) {
      alert('Please provide at least one complete ad creative with headline and destination URL.');
      return;
    }
    setIsSubmitting(true);

    try {
      // 1. Create Campaign
      const primaryFormat = validCreatives[0].adFormat || 'card';
      const res = await fetch(`${API_BASE}/api/v1/campaigns`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': 'demo-advertiser' },
        body: JSON.stringify({
          title: newCampTitle,
          budgetUsd: Number(newCampBudget),
          format: primaryFormat,
          costPerClickCents: 10,
          costPerImpressionCents: 1,
        }),
      });

      const created = res.ok ? (await res.json()).data : null;
      const campaignId = created?.id || `camp_${Date.now()}`;

      // 2. Attach each creative to the campaign via API
      for (const crt of validCreatives) {
        try {
          await fetch(`${API_BASE}/api/v1/campaigns/${campaignId}/creatives`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-user-id': 'demo-advertiser' },
            body: JSON.stringify({
              headline: crt.headline,
              destinationUrl: crt.destinationUrl,
              adFormat: crt.adFormat,
              mediaFormat: crt.mediaFormat || 'image',
              imageUrl: crt.imageUrl,
              videoUrl: crt.videoUrl,
            }),
          });
        } catch (crtErr) {
          console.warn('Creative upload deferred:', crtErr);
        }
      }

      const distinctFormats = Array.from(new Set(validCreatives.map((c) => c.adFormat)));

      const newCamp: Campaign = {
        id: campaignId,
        title: newCampTitle,
        category: newCampCategory,
        format: primaryFormat,
        formats: distinctFormats,
        creatives: validCreatives,
        channels: newCampChannels,
        budgetUsd: Number(newCampBudget),
        spentUsd: 0,
        cpcUsd: 0.10,
        cpmUsd: 0.01,
        status: 'under_review',
        impressions: 0,
        clicks: 0,
        headline: validCreatives[0].headline,
        destinationUrl: validCreatives[0].destinationUrl,
      };

      setCampaigns([newCamp, ...campaigns]);
      setIsCreateCampaignOpen(false);
      setNewCampTitle('');
      setNewCampCreatives([
        {
          headline: '',
          destinationUrl: '',
          adFormat: 'card',
          mediaFormat: 'image',
        },
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add Website Submit
  const handleAddWebsite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWebDomain) return;
    setIsSubmitting(true);

    const clean = newWebDomain.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    const token = `cf_verify_${Math.random().toString(36).substring(2, 12)}`;

    try {
      await fetch(`${API_BASE}/api/v1/promoters/sites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': 'demo-promoter' },
        body: JSON.stringify({ domain: clean, verificationMethod: newWebMethod })
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }

    const newSite: PromoterWebsite = {
      id: `web_${Date.now()}`,
      domain: clean,
      url: `https://${clean}`,
      verificationToken: token,
      verificationMethod: newWebMethod,
      isVerified: false,
      lastPingAt: 'Pending verification',
      activePlacementCount: 0,
    };

    setWebsites([newSite, ...websites]);
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

  if (view === 'landing') {
    return (
      <LandingPage
        onLaunchConsole={(defaultRole, section) => {
          setView('console');
          if (defaultRole) setRole(defaultRole);
          if (section) setPromoterSection(section as any);
        }}
      />
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-page)' }}>
      {/* Top Console Navigation Bar */}
      <header
        style={{
          borderBottom: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-page)',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '0 24px',
            height: '70px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          {/* Brand Identity & Back to Landing */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'var(--gradient-crimson)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '18px',
                color: '#FFFFFF',
                boxShadow: 'var(--shadow-crimson)',
              }}
            >
              CF
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                CrimFig <span style={{ color: 'var(--color-crimson)' }}>Ads</span>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    backgroundColor: 'var(--badge-bg)',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  Console
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setView('landing')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-secondary)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'border-color 0.15s ease',
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--color-crimson)')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--border-subtle)')}
            >
              <ArrowLeft style={{ width: 13, height: 13 }} />
              <span>Overview</span>
            </button>
          </div>

          {/* Mode Switcher: Advertiser Studio vs Promoter Hub */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '4px',
                borderRadius: '12px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              <button
                type="button"
                onClick={() => setRole('advertiser')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  backgroundColor: role === 'advertiser' ? 'var(--color-fig-dark)' : 'transparent',
                  color: role === 'advertiser' ? '#FFFFFF' : 'var(--text-secondary)',
                }}
              >
                <BarChart3 style={{ width: 14, height: 14 }} />
                <span>Advertiser Studio</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('promoter')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  backgroundColor: role === 'promoter' ? 'var(--color-crimson)' : 'transparent',
                  color: role === 'promoter' ? '#FFFFFF' : 'var(--text-secondary)',
                }}
              >
                <UserCheck style={{ width: 14, height: 14 }} />
                <span>Promoter Hub</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  backgroundColor: role === 'admin' ? 'var(--color-fig-dark)' : 'transparent',
                  color: role === 'admin' ? '#FFFFFF' : 'var(--text-secondary)',
                }}
              >
                <ShieldCheck style={{ width: 14, height: 14 }} />
                <span>Admin Console</span>
              </button>
            </div>

            {/* If Advertiser: Sub-tab switcher between Dashboard and Campaigns */}
            {role === 'advertiser' && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '4px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              >
                <button
                  type="button"
                  onClick={() => setAdvertiserTab('dashboard')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    backgroundColor: advertiserTab === 'dashboard' ? 'var(--color-crimson)' : 'transparent',
                    color: advertiserTab === 'dashboard' ? '#FFFFFF' : 'var(--text-secondary)',
                  }}
                >
                  <TrendingUp style={{ width: 14, height: 14 }} />
                  <span>Dashboard</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAdvertiserTab('campaigns')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    backgroundColor: advertiserTab === 'campaigns' ? 'var(--color-crimson)' : 'transparent',
                    color: advertiserTab === 'campaigns' ? '#FFFFFF' : 'var(--text-secondary)',
                  }}
                >
                  <Layers style={{ width: 14, height: 14 }} />
                  <span>Campaigns</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAdvertiserTab('billing')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    backgroundColor: advertiserTab === 'billing' ? 'var(--color-crimson)' : 'transparent',
                    color: advertiserTab === 'billing' ? '#FFFFFF' : 'var(--text-secondary)',
                  }}
                >
                  <CreditCard style={{ width: 14, height: 14 }} />
                  <span>Billing &amp; Escrow</span>
                </button>
              </div>
            )}
          </div>

          {/* Right Controls: Theme Switcher & Wallet Trigger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ThemeSwitcher />

            <button
              type="button"
              onClick={() => {
                if (role === 'advertiser') {
                  setAdvertiserTab('billing');
                } else {
                  setPromoterSection('billing');
                }
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '8px',
                backgroundColor: 'var(--badge-bg)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'border-color 0.15s ease',
              }}
            >
              <DollarSign style={{ width: 14, height: 14, color: 'var(--color-success)' }} />
              <span>Financial Ledger</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px', flex: 1, width: '100%', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* ========================================================================= */}
        {/* ROLE 1: PROMOTER HUB */}
        {/* ========================================================================= */}
        {role === 'promoter' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {/* Promoter Banner */}
            <div
              className="theme-card"
              style={{
                padding: '32px',
                background: 'linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-page) 100%)',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>
                <div>
                  <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-crimson)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sparkles style={{ width: 14, height: 14 }} /> Monetize Your Traffic & Audience
                  </span>
                  <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
                    Promoter Monetization Hub
                  </h1>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px', maxWidth: '640px' }}>
                    Display verified ecosystem ads on your websites, mobile apps, or share trackable referral links to earn USD revenue for every impression and click.
                  </p>
                </div>

                {/* Earnings card */}
                <div
                  style={{
                    padding: '16px 20px',
                    borderRadius: '16px',
                    backgroundColor: 'var(--bg-page)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      backgroundColor: 'var(--color-success-bg)',
                      color: 'var(--color-success)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 900,
                      fontSize: '20px'
                    }}
                  >
                    $
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Total Accrued Earnings</span>
                    <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)' }}>${totalPromoterEarned.toFixed(2)} USD</div>
                    <span style={{ fontSize: '11px', color: 'var(--color-success)', fontWeight: 600 }}>Ready for instant bank withdrawal</span>
                  </div>
                </div>
              </div>

              {/* Promoter Section Navigation */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: '28px',
                  paddingTop: '20px',
                  borderTop: '1px solid var(--border-subtle)',
                  overflowX: 'auto',
                  fontSize: '13px',
                  fontWeight: 600
                }}
              >
                <button
                  type="button"
                  onClick={() => setPromoterSection('websites')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    backgroundColor: promoterSection === 'websites' ? 'var(--color-crimson)' : 'transparent',
                    color: promoterSection === 'websites' ? '#FFFFFF' : 'var(--text-secondary)',
                  }}
                >
                  <Globe style={{ width: 16, height: 16 }} />
                  Websites & Embeds ({websites.length})
                </button>
                <button
                  type="button"
                  onClick={() => setPromoterSection('individuals')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    backgroundColor: promoterSection === 'individuals' ? 'var(--color-crimson)' : 'transparent',
                    color: promoterSection === 'individuals' ? '#FFFFFF' : 'var(--text-secondary)',
                  }}
                >
                  <Share2 style={{ width: 16, height: 16 }} />
                  Individual Share Links & Reels
                </button>
                <button
                  type="button"
                  onClick={() => setPromoterSection('mobile_apps')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    backgroundColor: promoterSection === 'mobile_apps' ? 'var(--color-crimson)' : 'transparent',
                    color: promoterSection === 'mobile_apps' ? '#FFFFFF' : 'var(--text-secondary)',
                  }}
                >
                  <Smartphone style={{ width: 16, height: 16 }} />
                  Mobile Apps ({apps.length})
                </button>
                <button
                  type="button"
                  onClick={() => setPromoterSection('marketplace')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    backgroundColor: promoterSection === 'marketplace' ? 'var(--color-crimson)' : 'transparent',
                    color: promoterSection === 'marketplace' ? '#FFFFFF' : 'var(--text-secondary)',
                  }}
                >
                  <Layers style={{ width: 16, height: 16 }} />
                  Browse Ad Campaigns ({campaigns.length})
                </button>
                <button
                  type="button"
                  onClick={() => setPromoterSection('billing')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    backgroundColor: promoterSection === 'billing' ? 'var(--color-crimson)' : 'transparent',
                    color: promoterSection === 'billing' ? '#FFFFFF' : 'var(--text-secondary)',
                  }}
                >
                  <CreditCard style={{ width: 16, height: 16 }} />
                  Earnings &amp; Payouts
                </button>
                <button
                  type="button"
                  onClick={() => setPromoterSection('quality')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    backgroundColor: promoterSection === 'quality' ? 'var(--color-crimson)' : 'transparent',
                    color: promoterSection === 'quality' ? '#FFFFFF' : 'var(--text-secondary)',
                  }}
                >
                  <ShieldCheck style={{ width: 16, height: 16 }} />
                  Quality &amp; Trust Score
                </button>
              </div>
            </div>

            {/* SECTION: QUALITY & TRUST */}
            {promoterSection === 'quality' && (
              <PromoterQualityCard apiBase={API_BASE} />
            )}

            {/* SECTION 0: BILLING & LEDGER (PROMOTER VIEW) */}
            {promoterSection === 'billing' && (
              <BillingLedger initialRole="promoter" onRoleChange={(r) => setRole(r)} />
            )}

            {/* SECTION 1: WEBSITES */}
            {promoterSection === 'websites' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>Registered Websites</h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      Verify ownership and embed script tags to start serving ads.
                    </p>
                  </div>
                  <button
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
                      fontWeight: 600,
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: 'var(--shadow-crimson)'
                    }}
                  >
                    <Plus style={{ width: 16, height: 16 }} /> Add Website
                  </button>
                </div>

                {isLoadingWebsites ? (
                  <CardSkeleton count={2} />
                ) : websites.length === 0 ? (
                  <EmptyState
                    icon={Globe}
                    title="No Websites Registered Yet"
                    description="Register your domain or blog to earn USD by embedding verified CrimFig display ad units."
                    actionLabel="+ Add Your First Website"
                    onAction={() => setIsAddWebsiteOpen(true)}
                  />
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                    {websites.map((site) => (
                      <div key={site.id} className="theme-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontWeight: 700, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
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
                            Status: {site.lastPingAt}
                          </p>
                        </div>

                        <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          {!site.isVerified ? (
                            <button
                              type="button"
                              onClick={() => handleVerifyWebsite(site.id)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '6px 12px',
                                backgroundColor: 'var(--color-success)',
                                color: '#FFFFFF',
                                fontSize: '12px',
                                fontWeight: 600,
                                borderRadius: '6px',
                                border: 'none',
                                cursor: 'pointer'
                              }}
                            >
                              <ShieldCheck style={{ width: 14, height: 14 }} /> Verify Ownership
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setIsEmbedCodeModalOpen({ domain: site.domain, publisherKey: site.verificationToken })}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '6px 12px',
                                backgroundColor: 'var(--color-fig-dark)',
                                color: '#FFFFFF',
                                fontSize: '12px',
                                fontWeight: 600,
                                borderRadius: '6px',
                                border: 'none',
                                cursor: 'pointer'
                              }}
                            >
                              <Code2 style={{ width: 14, height: 14 }} /> Get Embed Tag
                            </button>
                          )}
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{site.activePlacementCount} active ads</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SECTION 2: INDIVIDUALS */}
            {promoterSection === 'individuals' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="theme-card" style={{ padding: '24px', background: 'var(--bg-surface)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--badge-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-crimson)' }}>
                        <Video style={{ width: 24, height: 24 }} />
                      </div>
                      <div>
                        <h4 style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text-primary)' }}>CrimFig Reels Social Sync</h4>
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          Auto-publish sponsored promotional cards directly to your verified CrimFig Reels profile.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setReelsConsent(!reelsConsent)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '9999px',
                        fontSize: '12px',
                        fontWeight: 600,
                        border: 'none',
                        cursor: 'pointer',
                        backgroundColor: reelsConsent ? 'var(--color-success-bg)' : 'var(--badge-bg)',
                        color: reelsConsent ? 'var(--color-success)' : 'var(--text-muted)'
                      }}
                    >
                      {reelsConsent ? '✓ Reels Sync Enabled' : 'Reels Sync Off'}
                    </button>
                  </div>
                </div>

                {isLoadingCampaigns ? (
                  <CardSkeleton count={2} />
                ) : campaigns.length === 0 ? (
                  <EmptyState
                    icon={Share2}
                    title="No Active Share Campaigns"
                    description="There are currently no active ad campaigns accepting individual promoters. Check back soon or launch a campaign in Advertiser Studio."
                  />
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                    {campaigns.map((camp) => {
                      const shareLink = `https://ads.crimfig.com/api/v1/delivery/go/token_${camp.id}?pid=promoter_live`;
                      return (
                        <div key={camp.id} className="theme-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-crimson)' }}>{camp.category}</span>
                            <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '9999px', backgroundColor: 'var(--badge-bg)', color: 'var(--text-secondary)' }}>
                              ${camp.cpcUsd.toFixed(2)} / Click
                            </span>
                          </div>
                          <h4 style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text-primary)' }}>{camp.title}</h4>
                          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{camp.headline}</p>

                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: 'auto' }}>
                            <input
                              type="text"
                              readOnly
                              value={shareLink}
                              style={{
                                flex: 1,
                                padding: '8px 12px',
                                borderRadius: '6px',
                                border: '1px solid var(--border-subtle)',
                                backgroundColor: 'var(--bg-page)',
                                fontSize: '12px',
                                color: 'var(--text-secondary)',
                                fontFamily: 'monospace'
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => handleCopy(shareLink, camp.id)}
                              style={{
                                padding: '8px 14px',
                                borderRadius: '6px',
                                backgroundColor: 'var(--color-crimson)',
                                color: '#FFFFFF',
                                border: 'none',
                                fontSize: '12px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              {copiedToken === camp.id ? <Check style={{ width: 14, height: 14 }} /> : <Copy style={{ width: 14, height: 14 }} />}
                              {copiedToken === camp.id ? 'Copied' : 'Copy'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* SECTION 3: MOBILE APPS */}
            {promoterSection === 'mobile_apps' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>Registered Mobile Applications</h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      Integrate CrimFig Ads Native SDK into your Android and iOS applications.
                    </p>
                  </div>
                </div>

                {apps.length === 0 ? (
                  <EmptyState
                    icon={Smartphone}
                    title="No Mobile Apps Registered"
                    description="Connect your mobile applications with our React Native or Native SDK to earn revenue from in-app ads."
                    actionLabel="+ Register First Mobile App"
                    onAction={() => alert('Mobile SDK documentation available at docs.crimfig.com/sdk')}
                  />
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                    {apps.map((app) => (
                      <div key={app.id} className="theme-card" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{app.appName}</span>
                          <span style={{ fontSize: '11px', color: 'var(--color-success)', fontWeight: 600 }}>Active</span>
                        </div>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{app.bundleId}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SECTION 4: MARKETPLACE */}
            {promoterSection === 'marketplace' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>Campaign Marketplace</h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      Apply to display active sponsored campaigns on your channels.
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 600,
                          border: 'none',
                          cursor: 'pointer',
                          backgroundColor: selectedCategory === cat ? 'var(--color-crimson)' : 'var(--badge-bg)',
                          color: selectedCategory === cat ? '#FFFFFF' : 'var(--text-secondary)'
                        }}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {isLoadingCampaigns ? (
                  <CardSkeleton count={2} />
                ) : filteredCampaigns.length === 0 ? (
                  <EmptyState
                    icon={Layers}
                    title="No Campaigns in this Category"
                    description="No advertiser campaigns are active in this category right now. Browse All to find opportunities."
                    actionLabel="View All Categories"
                    onAction={() => setSelectedCategory('All')}
                  />
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                    {filteredCampaigns.map((camp) => (
                      <div key={camp.id} className="theme-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-crimson)', textTransform: 'uppercase' }}>{camp.category}</span>
                            <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '9999px', backgroundColor: 'var(--badge-bg)', color: 'var(--text-secondary)' }}>
                              {camp.format.toUpperCase()}
                            </span>
                          </div>
                          <h4 style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text-primary)', marginTop: '8px' }}>{camp.title}</h4>
                          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>{camp.headline}</p>

                          <div style={{ marginTop: '16px', padding: '12px', borderRadius: '8px', backgroundColor: 'var(--bg-page)', border: '1px solid var(--border-subtle)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                            <div>
                              <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Promoter Payout</span>
                              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-success)' }}>${(camp.cpcUsd * 0.7).toFixed(3)} / Click</span>
                            </div>
                            <div>
                              <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Impression Payout</span>
                              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-success)' }}>${(camp.cpmUsd * 0.7).toFixed(4)} / View</span>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setPromoterSection('individuals');
                            alert(`Applied to ${camp.title}! Share link ready in Individual Promoters.`);
                          }}
                          style={{
                            width: '100%',
                            padding: '10px',
                            backgroundColor: 'var(--color-crimson)',
                            color: '#FFFFFF',
                            fontSize: '13px',
                            fontWeight: 600,
                            borderRadius: '8px',
                            border: 'none',
                            cursor: 'pointer',
                            boxShadow: 'var(--shadow-crimson)'
                          }}
                        >
                          Apply to Promote
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* LIVE STREAM OF EVENTS */}
            <div className="theme-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Radio style={{ width: 16, height: 16, color: 'var(--color-success)' }} />
                    Live Interaction Stream
                  </h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    Real-time log of verified impressions and clicks accrued by your channels.
                  </p>
                </div>
              </div>

              {logs.length === 0 ? (
                <EmptyState
                  icon={Inbox}
                  title="No Interactions Recorded Yet"
                  description="When your website or shared links receive visitor views and clicks, verified event logs will stream here."
                />
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', textAlign: 'left', fontSize: '13px', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                        <th style={{ padding: '12px' }}>Event</th>
                        <th style={{ padding: '12px' }}>Channel</th>
                        <th style={{ padding: '12px' }}>Placement / Host</th>
                        <th style={{ padding: '12px' }}>Earning</th>
                        <th style={{ padding: '12px' }}>Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs.map((log) => (
                        <tr key={log.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                          <td style={{ padding: '12px', fontWeight: 600, textTransform: 'capitalize' }}>{log.type}</td>
                          <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{log.source}</td>
                          <td style={{ padding: '12px', fontFamily: 'monospace' }}>{log.identifier}</td>
                          <td style={{ padding: '12px', color: 'var(--color-success)', fontWeight: 700 }}>+${log.earningUsd.toFixed(3)}</td>
                          <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{log.timestamp}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ROLE 2: ADVERTISER STUDIO */}
        {/* ========================================================================= */}
        {role === 'advertiser' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {advertiserTab === 'billing' ? (
              <BillingLedger initialRole="advertiser" onRoleChange={(r) => setRole(r)} />
            ) : advertiserTab === 'dashboard' ? (
              <ConsoleDashboard
                onNavigateToCampaigns={(status) => {
                  setAdvertiserTab('campaigns');
                  if (status) setCampaignStatusFilter(status);
                }}
                onNavigateToPromoterHub={(section) => {
                  setRole('promoter');
                  if (section) setPromoterSection(section as any);
                }}
                onOpenCreateCampaign={() => setIsCreateCampaignOpen(true)}
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Header with Title and Actions */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                      Campaigns &amp; Creative Assets
                    </h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                      Filter by moderation status, customize performance columns, and manage live delivery.
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => setIsTablePrefsOpen(true)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 14px',
                        borderRadius: '8px',
                        backgroundColor: 'var(--bg-surface)',
                        border: '1px solid var(--border-subtle)',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        cursor: 'pointer',
                      }}
                    >
                      <SlidersHorizontal style={{ width: 14, height: 14, color: 'var(--color-crimson)' }} />
                      <span>Customize Columns</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsCreateCampaignOpen(true)}
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
                      <Plus style={{ width: 16, height: 16 }} /> Create Campaign
                    </button>
                  </div>
                </div>

                {/* Status Tabs: All, Active, Paused, Under Review, Draft, Rejected, Suspended, Trash */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
                  {[
                    { id: 'all', label: 'All Campaigns' },
                    { id: 'active', label: 'Active' },
                    { id: 'paused', label: 'Paused' },
                    { id: 'under_review', label: 'Under Review' },
                    { id: 'draft', label: 'Draft' },
                    { id: 'rejected', label: 'Rejected' },
                    { id: 'suspended', label: 'Suspended' },
                    { id: 'trash', label: 'Trash' },
                  ].map((tab) => {
                    const count = tab.id === 'all' ? campaigns.length : campaigns.filter((c) => c.status === tab.id).length;
                    const isSelected = campaignStatusFilter === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setCampaignStatusFilter(tab.id)}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '8px',
                          border: 'none',
                          fontSize: '13px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          backgroundColor: isSelected ? 'var(--color-crimson)' : 'var(--bg-surface)',
                          color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <span>{tab.label}</span>
                        <span
                          style={{
                            fontSize: '11px',
                            padding: '1px 6px',
                            borderRadius: '9999px',
                            backgroundColor: isSelected ? 'rgba(255,255,255,0.25)' : 'var(--badge-bg)',
                            color: isSelected ? '#FFFFFF' : 'var(--text-muted)',
                          }}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Campaigns Table */}
                {isLoadingCampaigns ? (
                  <TableSkeleton rows={3} cols={6} />
                ) : (
                  (() => {
                    const displayList = campaignStatusFilter === 'all'
                      ? campaigns
                      : campaigns.filter((c) => c.status === campaignStatusFilter);

                    if (displayList.length === 0) {
                      return (
                        <EmptyState
                          icon={BarChart3}
                          title={`No ${campaignStatusFilter.replace('_', ' ')} campaigns`}
                          description={`There are currently no campaigns marked as ${campaignStatusFilter.replace('_', ' ')}.`}
                          actionLabel="+ Launch New Campaign"
                          onAction={() => setIsCreateCampaignOpen(true)}
                        />
                      );
                    }

                    const visibleCols = columnsConfig.filter((c) => c.visible);

                    return (
                      <div className="theme-card" style={{ overflow: 'hidden' }}>
                        <div style={{ overflowX: 'auto' }}>
                          <table style={{ width: '100%', textAlign: 'left', fontSize: '13px', borderCollapse: 'collapse' }}>
                            <thead>
                              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', backgroundColor: 'var(--bg-surface)' }}>
                                {visibleCols.map((c) => (
                                  <th key={c.key} style={{ padding: '14px 16px', textAlign: c.key === 'actions' ? 'right' : 'left' }}>
                                    {c.label}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {displayList.map((camp) => (
                                <tr key={camp.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                  {visibleCols.map((col) => {
                                    if (col.key === 'campaign') {
                                      return (
                                        <td key={col.key} style={{ padding: '14px 16px' }}>
                                          <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{camp.title}</div>
                                          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{camp.headline}</div>
                                          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '6px' }}>
                                            {(camp.formats && camp.formats.length > 0 ? camp.formats : [camp.format]).map((fmt) => (
                                              <span
                                                key={fmt}
                                                style={{
                                                  fontSize: '10px',
                                                  fontWeight: 700,
                                                  textTransform: 'uppercase',
                                                  padding: '1px 6px',
                                                  borderRadius: '4px',
                                                  backgroundColor: 'var(--badge-bg)',
                                                  color: 'var(--color-crimson)',
                                                  border: '1px solid var(--border-subtle)',
                                                }}
                                              >
                                                {fmt}
                                              </span>
                                            ))}
                                          </div>
                                          {camp.rejectionReason && (
                                            <div style={{ fontSize: '11px', color: 'var(--color-error)', marginTop: '4px', fontWeight: 600 }}>
                                              Reason: {camp.rejectionReason}
                                            </div>
                                          )}
                                        </td>
                                      );
                                    }
                                    if (col.key === 'status') {
                                      const isRejected = camp.moderationStatus === 'rejected' || camp.status === 'rejected';
                                      const isApproved = camp.moderationStatus === 'approved';
                                      const isPendingTier1 = camp.moderationStatus === 'pending_primary_review' || camp.status === 'under_review';
                                      const isPendingTier2 = camp.moderationStatus === 'pending_manager_approval';
                                      const isActive = camp.status === 'active';
                                      const isPaused = camp.status === 'paused';

                                      return (
                                        <td key={col.key} style={{ padding: '14px 16px' }}>
                                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start' }}>
                                            {/* Operational Status */}
                                            <span
                                              style={{
                                                fontSize: '10px',
                                                fontWeight: 700,
                                                letterSpacing: '0.04em',
                                                padding: '2px 8px',
                                                borderRadius: '9999px',
                                                backgroundColor: isActive ? 'var(--color-success-bg)' : isPaused ? 'var(--color-soft-gray)' : 'rgba(23,27,42,0.06)',
                                                color: isActive ? 'var(--color-success)' : isPaused ? 'var(--color-slate-500)' : 'var(--color-fig-dark)',
                                                border: '1px solid',
                                                borderColor: isActive ? 'rgba(16,185,129,0.3)' : 'rgba(0,0,0,0.08)'
                                              }}
                                            >
                                              ● {camp.status.replace('_', ' ').toUpperCase()}
                                            </span>
                                            {/* Moderation Status */}
                                            <span
                                              style={{
                                                fontSize: '10px',
                                                fontWeight: 600,
                                                padding: '2px 8px',
                                                borderRadius: '9999px',
                                                backgroundColor: isApproved
                                                  ? 'rgba(16, 185, 129, 0.1)'
                                                  : isPendingTier2
                                                  ? 'rgba(99, 102, 241, 0.1)'
                                                  : isPendingTier1
                                                  ? 'var(--color-warning-bg)'
                                                  : isRejected
                                                  ? 'var(--color-error-bg)'
                                                  : 'rgba(0,0,0,0.04)',
                                                color: isApproved
                                                  ? 'var(--color-success)'
                                                  : isPendingTier2
                                                  ? '#4f46e5'
                                                  : isPendingTier1
                                                  ? 'var(--color-warning)'
                                                  : isRejected
                                                  ? 'var(--color-error)'
                                                  : 'var(--color-slate-500)',
                                              }}
                                            >
                                              {isApproved
                                                ? 'COMPLIANT'
                                                : isPendingTier2
                                                ? 'TIER-2 APPROVAL'
                                                : isPendingTier1
                                                ? 'TIER-1 REVIEW'
                                                : isRejected
                                                ? 'REJECTED'
                                                : (camp.moderationStatus || 'DRAFT').toUpperCase()}
                                            </span>
                                          </div>
                                        </td>
                                      );
                                    }
                                    if (col.key === 'budget') {
                                      return (
                                        <td key={col.key} style={{ padding: '14px 16px' }}>
                                          ${camp.budgetUsd.toFixed(2)} USD
                                        </td>
                                      );
                                    }
                                    if (col.key === 'spend') {
                                      return (
                                        <td key={col.key} style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--color-crimson)' }}>
                                          ${camp.spentUsd.toFixed(2)} USD
                                        </td>
                                      );
                                    }
                                    if (col.key === 'views') {
                                      return (
                                        <td key={col.key} style={{ padding: '14px 16px' }}>
                                          {camp.impressions.toLocaleString()}
                                        </td>
                                      );
                                    }
                                    if (col.key === 'clicks') {
                                      return (
                                        <td key={col.key} style={{ padding: '14px 16px', color: 'var(--color-success)', fontWeight: 600 }}>
                                          {camp.clicks.toLocaleString()}
                                        </td>
                                      );
                                    }
                                    if (col.key === 'hovers') {
                                      return (
                                        <td key={col.key} style={{ padding: '14px 16px' }}>
                                          {(camp.hovers || Math.round(camp.impressions * 0.08)).toLocaleString()}
                                        </td>
                                      );
                                    }
                                    if (col.key === 'touches') {
                                      return (
                                        <td key={col.key} style={{ padding: '14px 16px' }}>
                                          {(camp.touches || Math.round(camp.impressions * 0.04)).toLocaleString()}
                                        </td>
                                      );
                                    }
                                    if (col.key === 'ctr') {
                                      const ctr = camp.impressions > 0 ? (camp.clicks / camp.impressions) * 100 : 0;
                                      return (
                                        <td key={col.key} style={{ padding: '14px 16px', fontWeight: 700 }}>
                                          {ctr.toFixed(2)}%
                                        </td>
                                      );
                                    }
                                    if (col.key === 'actions') {
                                      return (
                                        <td key={col.key} style={{ padding: '14px 16px', textAlign: 'right' }}>
                                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                            {camp.status === 'rejected' && (
                                              <button
                                                type="button"
                                                onClick={() => setReplacementCreative(camp)}
                                                style={{
                                                  padding: '6px 12px',
                                                  borderRadius: '6px',
                                                  backgroundColor: 'var(--color-error)',
                                                  color: '#FFFFFF',
                                                  fontSize: '12px',
                                                  fontWeight: 700,
                                                  border: 'none',
                                                  cursor: 'pointer',
                                                }}
                                              >
                                                Replace Creative
                                              </button>
                                            )}
                                            {camp.status !== 'rejected' && camp.status !== 'trash' && (
                                              <button
                                                type="button"
                                                onClick={() => handleToggleStatus(camp.id)}
                                                style={{
                                                  padding: '6px 12px',
                                                  borderRadius: '6px',
                                                  border: '1px solid var(--border-subtle)',
                                                  backgroundColor: 'var(--bg-page)',
                                                  cursor: 'pointer',
                                                }}
                                              >
                                                {camp.status === 'active' ? <Pause style={{ width: 14, height: 14 }} /> : <Play style={{ width: 14, height: 14 }} />}
                                              </button>
                                            )}
                                          </div>
                                        </td>
                                      );
                                    }
                                    return <td key={col.key}>-</td>;
                                  })}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })()
                )}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* ROLE 3: ADMIN CONSOLE */}
        {/* ========================================================================= */}
        {role === 'admin' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <AdminModerationQueue apiBase={API_BASE} />
          </div>
        )}
      </main>

      {/* Footer with Theme Switcher */}
      <footer
        style={{
          borderTop: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-surface)',
          padding: '32px 24px',
          marginTop: 'auto'
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)' }}>
              CrimFig <span style={{ color: 'var(--color-crimson)' }}>Ads</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
              © {new Date().getFullYear()} CrimFig Ecosystem. All rights reserved.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Appearance:</span>
            <ThemeSwitcher />
          </div>
        </div>
      </footer>

      {/* MODAL: CREATE CAMPAIGN */}
      {isCreateCampaignOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)' }}>
          <div className="theme-card" style={{ width: '100%', maxWidth: '520px', padding: '32px', backgroundColor: 'var(--bg-page)', position: 'relative' }}>
            <button
              type="button"
              onClick={() => setIsCreateCampaignOpen(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <X style={{ width: 20, height: 20 }} />
            </button>

            <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>Create Ad Campaign</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Reach verified audiences across the CrimFig Ecosystem.
            </p>

            <form onSubmit={handleCreateCampaign} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>Campaign Title</label>
                <input
                  type="text"
                  required
                  value={newCampTitle}
                  onChange={(e) => setNewCampTitle(e.target.value)}
                  placeholder="e.g. Creator Launch Campaign"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-page)', fontSize: '14px', color: 'var(--text-primary)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>Budget (USD)</label>
                  <input
                    type="number"
                    min="5"
                    required
                    value={newCampBudget}
                    onChange={(e) => setNewCampBudget(Number(e.target.value))}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-page)', fontSize: '14px', color: 'var(--text-primary)' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>Category</label>
                  <select
                    value={newCampCategory}
                    onChange={(e) => setNewCampCategory(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-page)', fontSize: '14px', color: 'var(--text-primary)' }}
                  >
                    <option value="Technology">Technology</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Finance">Finance</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>

              {/* Multi-Ad Creatives Section */}
              <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Ad Creatives ({newCampCreatives.length})
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setNewCampCreatives([
                        ...newCampCreatives,
                        {
                          headline: '',
                          destinationUrl: newCampCreatives[0]?.destinationUrl || '',
                          adFormat: (['banner', 'video', 'interstitial', 'card'] as const)[newCampCreatives.length % 4],
                          mediaFormat: 'image',
                        },
                      ])
                    }
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      backgroundColor: 'var(--badge-bg)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--color-crimson)',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Plus style={{ width: 14, height: 14 }} /> Add Another Ad Format
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '280px', overflowY: 'auto', paddingRight: '4px' }}>
                  {newCampCreatives.map((crt, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-subtle)',
                        backgroundColor: 'var(--bg-surface)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>
                          Ad #{idx + 1}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <select
                            value={crt.adFormat}
                            onChange={(e: any) => {
                              const updated = [...newCampCreatives];
                              updated[idx].adFormat = e.target.value;
                              setNewCampCreatives(updated);
                            }}
                            style={{
                              padding: '4px 8px',
                              borderRadius: '6px',
                              border: '1px solid var(--border-subtle)',
                              backgroundColor: 'var(--bg-page)',
                              fontSize: '12px',
                              fontWeight: 600,
                              color: 'var(--color-crimson)',
                            }}
                          >
                            <option value="card">Card Ad</option>
                            <option value="banner">Banner (728x90)</option>
                            <option value="video">Video Ad (16:9/9:16)</option>
                            <option value="interstitial">Interstitial Fullscreen</option>
                          </select>
                          {newCampCreatives.length > 1 && (
                            <button
                              type="button"
                              onClick={() => setNewCampCreatives(newCampCreatives.filter((_, i) => i !== idx))}
                              style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}
                            >
                              <X style={{ width: 14, height: 14 }} />
                            </button>
                          )}
                        </div>
                      </div>

                      <input
                        type="text"
                        required
                        placeholder={`Headline copy for ${crt.adFormat.toUpperCase()} ad`}
                        value={crt.headline}
                        onChange={(e) => {
                          const updated = [...newCampCreatives];
                          updated[idx].headline = e.target.value;
                          setNewCampCreatives(updated);
                        }}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          border: '1px solid var(--border-subtle)',
                          backgroundColor: 'var(--bg-page)',
                          fontSize: '13px',
                          color: 'var(--text-primary)',
                        }}
                      />

                      <input
                        type="url"
                        required
                        placeholder="Click Destination URL"
                        value={crt.destinationUrl}
                        onChange={(e) => {
                          const updated = [...newCampCreatives];
                          updated[idx].destinationUrl = e.target.value;
                          setNewCampCreatives(updated);
                        }}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          border: '1px solid var(--border-subtle)',
                          backgroundColor: 'var(--bg-page)',
                          fontSize: '13px',
                          color: 'var(--text-primary)',
                        }}
                      />

                      {/* File / Media Asset Upload (Firebase Bucket: 750KB Img, 20MB Vid, No Server Compression) */}
                      <div
                        style={{
                          border: '1px dashed var(--border-subtle)',
                          borderRadius: '6px',
                          padding: '10px',
                          backgroundColor: 'var(--bg-page)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                            {crt.adFormat === 'video' ? 'Video Creative (MP4/WEBM/Animated GIF <= 20MB)' : 'Photo Creative (JPG/PNG/WEBP/AVIF/Static GIF <= 750KB)'}
                          </span>
                          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                            Firebase Storage · No Server Optimization
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input
                            type="file"
                            accept={crt.adFormat === 'video' ? 'video/mp4,video/webm,image/gif' : 'image/jpeg,image/png,image/webp,image/avif,image/gif'}
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;

                              // Browser compatibility hints for advertiser
                              if (file.type === 'video/webm') {
                                alert('Format Note: WebM has partial hardware acceleration on older iOS/Safari browsers. MP4 is recommended for maximum reach.');
                              }

                              // Strict client-side validation
                              const isVideo = file.type.startsWith('video/') || (file.type === 'image/gif' && crt.adFormat === 'video');
                              const maxBytes = isVideo ? 20 * 1024 * 1024 : 750 * 1024;
                              if (file.size > maxBytes) {
                                const limitText = isVideo ? '20MB' : '750KB';
                                const actualText = isVideo
                                  ? `${(file.size / (1024 * 1024)).toFixed(1)}MB`
                                  : `${(file.size / 1024).toFixed(1)}KB`;
                                alert(`Upload rejected: File size is ${actualText}, exceeding the ${limitText} platform restriction. Server optimization is disabled; please resize or encode your file locally.`);
                                e.target.value = '';
                                return;
                              }

                              const formData = new FormData();
                              formData.append('file', file);

                              try {
                                const uploadRes = await fetch(`${API_BASE}/api/v1/uploads/direct`, {
                                  method: 'POST',
                                  body: formData,
                                });
                                if (uploadRes.ok) {
                                  const json = await uploadRes.json();
                                  const updated = [...newCampCreatives];
                                  if (isVideo) {
                                    updated[idx].videoUrl = json.data.cdnUrl;
                                    updated[idx].mediaFormat = 'video';
                                  } else {
                                    updated[idx].imageUrl = json.data.cdnUrl;
                                    updated[idx].mediaFormat = 'image';
                                  }
                                  setNewCampCreatives(updated);
                                } else {
                                  const errJson = await uploadRes.json().catch(() => null);
                                  alert(errJson?.message || 'File upload failed. Ensure file meets restrictions.');
                                }
                              } catch {
                                alert('Network error uploading asset to Firebase bucket.');
                              }
                            }}
                            style={{ fontSize: '11px', color: 'var(--text-secondary)' }}
                          />
                        </div>
                        {(crt.imageUrl || crt.videoUrl) && (
                          <div style={{ fontSize: '11px', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                            <CheckCircle2 style={{ width: 12, height: 12 }} /> Uploaded to Firebase: {(crt.imageUrl || crt.videoUrl)?.substring(0, 48)}...
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  padding: '12px',
                  backgroundColor: 'var(--color-crimson)',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: 600,
                  borderRadius: '8px',
                  border: 'none',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  boxShadow: 'var(--shadow-crimson)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '8px'
                }}
              >
                {isSubmitting && <Loader2 style={{ width: 16, height: 16, animation: 'spin 0.75s linear infinite' }} />}
                {isSubmitting ? 'Launching Campaign...' : `Launch Campaign with ${newCampCreatives.length} Ad Format${newCampCreatives.length > 1 ? 's' : ''}`}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD WEBSITE */}
      {isAddWebsiteOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)' }}>
          <div className="theme-card" style={{ width: '100%', maxWidth: '460px', padding: '32px', backgroundColor: 'var(--bg-page)', position: 'relative' }}>
            <button
              type="button"
              onClick={() => setIsAddWebsiteOpen(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <X style={{ width: 20, height: 20 }} />
            </button>

            <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>Register Website</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Add your website domain to receive embed tags and start earning.
            </p>

            <form onSubmit={handleAddWebsite} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>Domain Name</label>
                <input
                  type="text"
                  required
                  value={newWebDomain}
                  onChange={(e) => setNewWebDomain(e.target.value)}
                  placeholder="e.g. mytechblog.com"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-page)', fontSize: '14px', color: 'var(--text-primary)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>Verification Method</label>
                <select
                  value={newWebMethod}
                  onChange={(e: any) => setNewWebMethod(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-page)', fontSize: '14px', color: 'var(--text-primary)' }}
                >
                  <option value="html_file_and_meta_tag">HTML Meta Tag (&lt;meta name="crimfig-verify"&gt;)</option>
                  <option value="dns_txt">DNS TXT Record</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  padding: '12px',
                  backgroundColor: 'var(--color-crimson)',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: 600,
                  borderRadius: '8px',
                  border: 'none',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  boxShadow: 'var(--shadow-crimson)',
                  marginTop: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {isSubmitting && <Loader2 style={{ width: 16, height: 16, animation: 'spin 0.75s linear infinite' }} />}
                {isSubmitting ? 'Registering...' : 'Register Domain'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EMBED CODE SNIPPET — CrimFig Publisher Placement Picker */}
      {isEmbedCodeModalOpen && (() => {
        const embedCode = generateCrimFigEmbedCode({
          placement: selectedPlacement,
          publisherKey: isEmbedCodeModalOpen.publisherKey,
          domain: isEmbedCodeModalOpen.domain,
        });
        const placementMeta = CRIMFIG_PLACEMENTS[selectedPlacement];
        return (
          <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)' }}>
            <div className="theme-card" style={{ width: '100%', maxWidth: '620px', padding: '32px', backgroundColor: 'var(--bg-page)', position: 'relative', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <button
                type="button"
                onClick={() => setIsEmbedCodeModalOpen(null)}
                style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X style={{ width: 20, height: 20 }} />
              </button>

              {/* Header */}
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>Get Embed Code</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Domain: <span style={{ fontWeight: 600, color: 'var(--color-crimson)' }}>{isEmbedCodeModalOpen.domain}</span>
                  &nbsp;•&nbsp;Publisher Key: <code style={{ fontSize: '11px', backgroundColor: 'var(--badge-bg)', padding: '1px 6px', borderRadius: '4px' }}>{isEmbedCodeModalOpen.publisherKey}</code>
                </p>
              </div>

              {/* Step 1: Placement Picker */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Step 1 — Choose Ad Placement
                </label>
                <select
                  value={selectedPlacement}
                  onChange={(e) => setSelectedPlacement(e.target.value as CrimFigPlacement)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-page)', fontSize: '13px', color: 'var(--text-primary)' }}
                >
                  {Object.entries(CRIMFIG_PLACEMENTS).map(([key, val]) => (
                    <option key={key} value={key}>{val.label}</option>
                  ))}
                </select>
                {placementMeta && (
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
                    💡 {placementMeta.recommended}
                  </p>
                )}
              </div>

              {/* Step 2: Code Block */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Step 2 — Copy &amp; Paste Into Your Page
                </label>
                <div style={{ position: 'relative', borderRadius: '8px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
                  <pre style={{ margin: 0, padding: '16px 56px 16px 16px', overflowX: 'auto', whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '11px', color: 'var(--text-primary)', lineHeight: 1.6 }}>{embedCode}</pre>
                  <button
                    type="button"
                    onClick={() => handleCopy(embedCode, 'embed_code')}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      backgroundColor: copiedToken === 'embed_code' ? 'var(--color-success)' : 'var(--color-crimson)',
                      color: '#FFFFFF',
                      fontSize: '12px',
                      fontWeight: 600,
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'background-color 0.15s ease',
                    }}
                  >
                    {copiedToken === 'embed_code' ? <Check style={{ width: 14, height: 14 }} /> : <Copy style={{ width: 14, height: 14 }} />}
                    {copiedToken === 'embed_code' ? 'Copied!' : 'Copy Code'}
                  </button>
                </div>
              </div>

              {/* Step 3: Instructions */}
              <div style={{ padding: '12px 16px', borderRadius: '8px', backgroundColor: 'var(--color-info-bg)', border: '1px solid var(--color-info)', fontSize: '12px', color: 'var(--color-info)' }}>
                <strong>How it works:</strong> Paste the code once per ad position. For multiple placements on the same page, copy the code again with a different placement selected above — the loader script is only needed once per page.
              </div>
            </div>
          </div>
        );
      })()}

      {/* MODAL: CUSTOMIZE TABLE COLUMNS PREFERENCES */}
      <TablePreferencesModal
        isOpen={isTablePrefsOpen}
        onClose={() => setIsTablePrefsOpen(false)}
        columns={columnsConfig}
        onSave={(updated) => setColumnsConfig(updated)}
      />

      {/* MODAL: INLINE REPLACEMENT FOR REJECTED CREATIVES */}
      {replacementCreative && (
        <ReplaceCreativeModal
          isOpen={!!replacementCreative}
          onClose={() => setReplacementCreative(null)}
          creative={replacementCreative}
          onReplaceSuccess={(updated) => {
            setCampaigns((prev) =>
              prev.map((c) =>
                c.id === replacementCreative.id
                  ? { ...c, headline: updated.headline || c.headline, status: 'under_review', rejectionReason: undefined }
                  : c
              )
            );
            alert(`Creative asset for "${replacementCreative.title}" replaced and re-submitted for review!`);
          }}
        />
      )}

    </div>
  );
}
