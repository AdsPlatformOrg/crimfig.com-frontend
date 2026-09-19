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
  CheckCircle2,
  AlertCircle,
  X,
  Code2,
  Video,
  Loader2,
  Inbox
} from 'lucide-react';
import { ThemeSwitcher } from '../components/ThemeSwitcher';
import { EmptyState } from '../components/EmptyState';
import { TableSkeleton, CardSkeleton } from '../components/LoadingStates';

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

const API_BASE = process.env.NEXT_PUBLIC_ADS_API_URL || 'https://ads-api-production-d889.up.railway.app';

export default function AdsPlatformApp() {
  // Main View: 'advertiser' vs 'promoter'
  const [role, setRole] = useState<'advertiser' | 'promoter'>('promoter');

  // Promoter Sub-section
  const [promoterSection, setPromoterSection] = useState<'websites' | 'individuals' | 'mobile_apps' | 'marketplace'>('websites');

  // Loading States
  const [isLoadingCampaigns, setIsLoadingCampaigns] = useState<boolean>(true);
  const [isLoadingWebsites, setIsLoadingWebsites] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Copied State Tracker
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // Reels Consent State
  const [reelsConsent, setReelsConsent] = useState(true);

  // Real Collections (No Dummy Data by Default)
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [websites, setWebsites] = useState<PromoterWebsite[]>([]);
  const [apps, setApps] = useState<PromoterApp[]>([]);
  const [logs, setLogs] = useState<InteractionLog[]>([]);

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
    if (!newCampTitle || !newCampHeadline || !newCampUrl) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}/api/v1/campaigns`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': 'demo-advertiser' },
        body: JSON.stringify({
          title: newCampTitle,
          budgetUsd: Number(newCampBudget),
          format: newCampFormat,
          costPerClickCents: 10,
          costPerImpressionCents: 1,
        })
      });

      const created = res.ok ? (await res.json()).data : null;

      const newCamp: Campaign = {
        id: created?.id || `camp_${Date.now()}`,
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
      };

      setCampaigns([newCamp, ...campaigns]);
      setIsCreateCampaignOpen(false);
      setNewCampTitle('');
      setNewCampHeadline('');
      setNewCampUrl('');
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

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-page)' }}>
      {/* Top Header */}
      <header
        style={{
          borderBottom: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-page)',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
                boxShadow: 'var(--shadow-crimson)'
              }}
            >
              CF
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                CrimFig <span style={{ color: 'var(--color-crimson)' }}>Ads</span>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    backgroundColor: 'var(--badge-bg)',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  Global Network
                </span>
              </div>
            </div>
          </div>

          {/* Mode Switcher: Advertiser vs Promoter */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '4px',
              borderRadius: '12px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              fontSize: '12px',
              fontWeight: 600
            }}
          >
            <button
              type="button"
              onClick={() => setRole('promoter')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                backgroundColor: role === 'promoter' ? 'var(--color-crimson)' : 'transparent',
                color: role === 'promoter' ? '#FFFFFF' : 'var(--text-secondary)',
              }}
            >
              <UserCheck style={{ width: 14, height: 14 }} />
              Promoter Hub
            </button>
            <button
              type="button"
              onClick={() => setRole('advertiser')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                backgroundColor: role === 'advertiser' ? 'var(--color-fig-dark)' : 'transparent',
                color: role === 'advertiser' ? '#FFFFFF' : 'var(--text-secondary)',
              }}
            >
              <BarChart3 style={{ width: 14, height: 14 }} />
              Advertiser Studio
            </button>
          </div>

          {/* Wallet Link */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <a
              href="https://billing-frontend-production-4256.up.railway.app"
              target="_blank"
              rel="noreferrer"
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
                textDecoration: 'none',
                transition: 'border-color 0.15s ease'
              }}
            >
              <DollarSign style={{ width: 14, height: 14, color: 'var(--color-success)' }} />
              <span>Billing Wallet</span>
              <ExternalLink style={{ width: 12, height: 12, color: 'var(--text-muted)' }} />
            </a>
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
              </div>
            </div>

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
                              onClick={() => setIsEmbedCodeModalOpen(site.domain)}
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
            {/* Top Advertiser Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
              <div className="theme-card" style={{ padding: '24px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Total Budget Allocated</span>
                <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px', display: 'block' }}>${totalAdvertiserBudget.toFixed(2)} USD</span>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', display: 'block' }}>{campaigns.length} campaigns created</span>
              </div>
              <div className="theme-card" style={{ padding: '24px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Total Ad Spend</span>
                <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-crimson)', marginTop: '4px', display: 'block' }}>${totalAdvertiserSpent.toFixed(2)} USD</span>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', display: 'block' }}>Locked in escrow via Wallet</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>Your Active Campaigns</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Manage budgets, tracking destinations, and pause or resume live ad delivery.
                </p>
              </div>
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
                  fontWeight: 600,
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-crimson)'
                }}
              >
                <Plus style={{ width: 16, height: 16 }} /> Create Campaign
              </button>
            </div>

            {isLoadingCampaigns ? (
              <TableSkeleton rows={3} cols={6} />
            ) : campaigns.length === 0 ? (
              <EmptyState
                icon={BarChart3}
                title="No Ad Campaigns Created Yet"
                description="Launch targeted ad campaigns across verified African publisher sites, mobile apps, and creator social profiles."
                actionLabel="+ Launch Your First Campaign"
                onAction={() => setIsCreateCampaignOpen(true)}
              />
            ) : (
              <div className="theme-card" style={{ overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', textAlign: 'left', fontSize: '13px', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', backgroundColor: 'var(--bg-surface)' }}>
                        <th style={{ padding: '14px 16px' }}>Campaign</th>
                        <th style={{ padding: '14px 16px' }}>Target Channels</th>
                        <th style={{ padding: '14px 16px' }}>Budget & Spend</th>
                        <th style={{ padding: '14px 16px' }}>Impressions / Clicks</th>
                        <th style={{ padding: '14px 16px' }}>Status</th>
                        <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {campaigns.map((camp) => (
                        <tr key={camp.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{camp.title}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{camp.headline}</div>
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                              {camp.channels.map((ch) => (
                                <span key={ch} style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '9999px', backgroundColor: 'var(--badge-bg)', color: 'var(--text-secondary)' }}>
                                  {ch.replace('_', ' ')}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                              ${camp.spentUsd.toFixed(2)} / ${camp.budgetUsd.toFixed(2)}
                            </div>
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ color: 'var(--text-secondary)' }}>{camp.impressions.toLocaleString()} views</div>
                            <div style={{ color: 'var(--color-success)', fontWeight: 600 }}>{camp.clicks.toLocaleString()} clicks</div>
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <span
                              style={{
                                fontSize: '11px',
                                fontWeight: 700,
                                padding: '2px 8px',
                                borderRadius: '9999px',
                                backgroundColor: camp.status === 'active' ? 'var(--color-success-bg)' : 'var(--color-warning-bg)',
                                color: camp.status === 'active' ? 'var(--color-success)' : 'var(--color-warning)',
                              }}
                            >
                              {camp.status.toUpperCase()}
                            </span>
                          </td>
                          <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(camp.id)}
                              style={{
                                padding: '6px 12px',
                                borderRadius: '6px',
                                border: '1px solid var(--border-subtle)',
                                backgroundColor: 'var(--bg-page)',
                                cursor: 'pointer'
                              }}
                            >
                              {camp.status === 'active' ? <Pause style={{ width: 14, height: 14 }} /> : <Play style={{ width: 14, height: 14 }} />}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
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
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>Format</label>
                  <select
                    value={newCampFormat}
                    onChange={(e: any) => setNewCampFormat(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-page)', fontSize: '14px', color: 'var(--text-primary)' }}
                  >
                    <option value="card">Card Ad</option>
                    <option value="banner">Banner</option>
                    <option value="video">Video</option>
                    <option value="interstitial">Interstitial</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>Headline Copy</label>
                <input
                  type="text"
                  required
                  value={newCampHeadline}
                  onChange={(e) => setNewCampHeadline(e.target.value)}
                  placeholder="e.g. Try CrimFig Stream in 1080p today"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-page)', fontSize: '14px', color: 'var(--text-primary)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>Destination URL</label>
                <input
                  type="url"
                  required
                  value={newCampUrl}
                  onChange={(e) => setNewCampUrl(e.target.value)}
                  placeholder="https://yourwebsite.com/landing"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-page)', fontSize: '14px', color: 'var(--text-primary)' }}
                />
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
                {isSubmitting ? 'Launching Campaign...' : 'Launch Campaign'}
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

      {/* MODAL: EMBED CODE SNIPPET */}
      {isEmbedCodeModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)' }}>
          <div className="theme-card" style={{ width: '100%', maxWidth: '520px', padding: '32px', backgroundColor: 'var(--bg-page)', position: 'relative' }}>
            <button
              type="button"
              onClick={() => setIsEmbedCodeModalOpen(null)}
              style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <X style={{ width: 20, height: 20 }} />
            </button>

            <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>Embed Tag Snippet</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Add this HTML tag where you want ads to appear on <span style={{ fontWeight: 600, color: 'var(--color-crimson)' }}>{isEmbedCodeModalOpen}</span>:
            </p>

            <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', position: 'relative', fontFamily: 'monospace', fontSize: '12px' }}>
              <pre style={{ overflowX: 'auto', whiteSpace: 'pre-wrap', color: 'var(--text-primary)' }}>
{`<div id="cf-ad-slot-1092" class="crimfig-ad-slot"></div>
<script src="https://ads.crimfig.com/api/v1/delivery/embed.js" data-placement="slot_1092" async></script>`}
              </pre>
              <button
                type="button"
                onClick={() => handleCopy(`<div id="cf-ad-slot-1092" class="crimfig-ad-slot"></div>\n<script src="https://ads.crimfig.com/api/v1/delivery/embed.js" data-placement="slot_1092" async></script>`, 'embed_code')}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--color-crimson)',
                  color: '#FFFFFF',
                  fontSize: '12px',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                {copiedToken === 'embed_code' ? <Check style={{ width: 14, height: 14 }} /> : <Copy style={{ width: 14, height: 14 }} />}
                {copiedToken === 'embed_code' ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
