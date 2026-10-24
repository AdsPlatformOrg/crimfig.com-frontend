'use client';

import { useDialog } from '../../lib/use-dialog';
import { SessionGate, SignOutButton, useSessionStatus } from '../SessionGate';
import { apiData, arrayData } from '../../lib/api-data';
import { loadCampaigns, loadWebsites, createCampaignWorkflow, CampaignWorkflowError, setCampaignStatus, registerWebsite, verifyWebsite } from '../../lib/campaigns-api';
import { sessionFetch } from '../../lib/session';

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
  Target,
  ShieldAlert,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ThemeSwitcher } from '../ThemeSwitcher';
import { EmptyState } from '../EmptyState';
import { TableSkeleton, CardSkeleton } from '../LoadingStates';
import {
  CRIMFIG_PLACEMENTS,
  type CrimFigPlacement,
  generateCrimFigEmbedCode,
  generateCrimFigVerifyMetaTag,
} from '../CrimFigAdSlot';
import { ConsoleDashboard } from './ConsoleDashboard';
import { TablePreferencesModal, type ColumnConfig } from './TablePreferencesModal';
import { ReplaceCreativeModal } from './ReplaceCreativeModal';
import { BillingLedger } from './billing/BillingLedger';
import { PromoterQualityCard } from './PromoterQualityCard';
import { AdminModerationQueue } from './AdminModerationQueue';
import { ConversionsTab } from './conversions/ConversionsTab';
import { DisputesTab } from './disputes/DisputesTab';
import { HelpSupportHub } from './HelpSupportHub';
import { NotificationCenter } from './NotificationCenter';
import { CampaignCreationWizard } from './CampaignCreationWizard';
import { DashboardSidebar, type NavGroup } from '../DashboardSidebar';
import { Menu, HelpCircle, Bell } from 'lucide-react';


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
  metricsLoaded?: boolean;
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

const API_BASE = typeof window !== 'undefined' ? '' : (process.env.NEXT_PUBLIC_ADS_API_URL || 'https://ads-api-production-d889.up.railway.app');

export interface AdsConsoleProps {
  initialRole?: 'advertiser' | 'promoter' | 'admin';
  initialAdvertiserTab?: 'dashboard' | 'campaigns' | 'new_campaign' | 'conversions' | 'disputes' | 'billing' | 'notifications' | 'support';
  initialPromoterSection?: 'websites' | 'individuals' | 'mobile_apps' | 'marketplace' | 'billing' | 'quality' | 'disputes';
  initialAdminTab?: 'moderation' | 'disputes';
}

export function AdsConsole({
  initialRole = 'advertiser',
  initialAdvertiserTab = 'dashboard',
  initialPromoterSection = 'websites',
  initialAdminTab = 'moderation',
}: AdsConsoleProps) {
  const router = useRouter();
  const sessionStatus = useSessionStatus();

  // Main Console Role: 'advertiser' vs 'promoter' vs 'admin'
  const [role, setRole] = useState<'advertiser' | 'promoter' | 'admin'>(initialRole);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Advertiser Sub-Tab: Dashboard (Primary) vs Campaigns vs Conversions vs Disputes vs Billing & Escrow vs Notifications vs Support vs New Campaign Wizard
  const [advertiserTab, setAdvertiserTab] = useState<'dashboard' | 'campaigns' | 'new_campaign' | 'conversions' | 'disputes' | 'billing' | 'notifications' | 'support'>(initialAdvertiserTab);

  // Admin Sub-Tab: Moderation vs Disputes
  const [adminTab, setAdminTab] = useState<'moderation' | 'disputes'>(initialAdminTab);

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

  // Promoter Sub-section: websites, individuals, mobile_apps, marketplace, billing, quality, disputes
  const [promoterSection, setPromoterSection] = useState<'websites' | 'individuals' | 'mobile_apps' | 'marketplace' | 'billing' | 'quality' | 'disputes'>(initialPromoterSection);


  // Loading States
  const [isLoadingCampaigns, setIsLoadingCampaigns] = useState<boolean>(true);
  const [isLoadingWebsites, setIsLoadingWebsites] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Copied State Tracker
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // Reels Consent State
  const [reelsConsent, setReelsConsent] = useState(false);

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [catalog, setCatalog] = useState<Campaign[]>([]);
  const [placements, setPlacements] = useState<any[]>([]);
  const [failedLoads, setFailedLoads] = useState<number[]>([]);
  const [actionError, setActionError] = useState<string | null>(null);
  const [dataAttempt, setDataAttempt] = useState(0);
  const [creationUncertain, setCreationUncertain] = useState(false);
  const [pendingWrites, setPendingWrites] = useState<Set<string>>(new Set());
  const [websites, setWebsites] = useState<PromoterWebsite[]>([]);
  const [apps, setApps] = useState<PromoterApp[]>([]);
  const [logs, setLogs] = useState<InteractionLog[]>([]);
  const [promoterEarnings, setPromoterEarnings] = useState<number | null>(null);

  // Modals
  const [isCreateCampaignOpen, setIsCreateCampaignOpen] = useState(false);
  const [isAddWebsiteOpen, setIsAddWebsiteOpen] = useState(false);
  const [isEmbedCodeModalOpen, setIsEmbedCodeModalOpen] = useState<{ domain: string; publisherKey: string } | null>(null);
  const [isAdSpacesModalOpen, setIsAdSpacesModalOpen] = useState(false);
  const [selectedPlacementSite, setSelectedPlacementSite] = useState<PromoterWebsite | null>(null);
  const [adSpaceMode, setAdSpaceMode] = useState<'publisher_network' | 'owned_site_direct'>('publisher_network');
  const [allowHomeNetworkFill, setAllowHomeNetworkFill] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPlacement, setSelectedPlacement] = useState<CrimFigPlacement>('banner_top');


  // Form: Create Campaign
  const [newCampTitle, setNewCampTitle] = useState('');
  const [newCampBudget, setNewCampBudget] = useState(100);
  const [newCampCategory, setNewCampCategory] = useState('Technology');
  const [newCampPricingModel, setNewCampPricingModel] = useState<'cpc' | 'cpm' | 'cpa' | 'cpcv'>('cpc');
  const [newCampTargetCpa, setNewCampTargetCpa] = useState<number>(5.0);
  const [newCampTargetCpcv, setNewCampTargetCpcv] = useState<number>(0.05);
  const [newCampAttributionDays, setNewCampAttributionDays] = useState<number>(7);
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

  useEffect(() => {
    if (sessionStatus !== 'authenticated') return;
    let active = true;
    setIsLoadingCampaigns(true); setIsLoadingWebsites(true); setFailedLoads([]);
    void (async () => {
      const results = await Promise.allSettled([loadCampaigns(true), loadCampaigns(false), loadWebsites(), apiData<any>('/api/v1/promoters/reels-consent'), apiData<any[]>('/api/v1/placements').then(value => arrayData<any>(value)), apiData<any[]>('/api/v1/promoters/apps').then(value => arrayData<any>(value)), apiData<any>('/api/v1/analytics/promoter')]);
      if (!active) return;
      const [own, publicCatalog, sites, consent, ownedPlacements, ownedApps, promoterAnalytics] = results;
      if (own.status === 'fulfilled') setCampaigns(own.value);
      if (publicCatalog.status === 'fulfilled') setCatalog(publicCatalog.value);
      if (ownedPlacements.status === 'fulfilled') setPlacements(ownedPlacements.value);
      if (ownedApps.status === 'fulfilled') setApps(ownedApps.value.map(app => ({ ...app, isVerified: app.verificationStatus === 'verified' })));
      if (promoterAnalytics.status === 'fulfilled' && Number.isFinite(promoterAnalytics.value?.earningsUsd)) setPromoterEarnings(promoterAnalytics.value.earningsUsd);
      if (sites.status === 'fulfilled') setWebsites(sites.value);
      if (consent.status === 'fulfilled') setReelsConsent(consent.value?.consentGiven === 1);
      setFailedLoads(results.flatMap((result, index) => result.status === 'rejected' ? [index] : []));
      setIsLoadingCampaigns(false); setIsLoadingWebsites(false);
    })();
    return () => { active = false; };
  }, [sessionStatus, dataAttempt]);

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
      setActionError('Please provide at least one complete ad creative with headline and destination URL.');
      return;
    }
    setIsSubmitting(true);

    setActionError(null);
    if (creationUncertain) { setIsSubmitting(false); return; }
    setCreationUncertain(true);
    try {
      await createCampaignWorkflow({ title: newCampTitle, budgetUsd: Number(newCampBudget), format: validCreatives[0].adFormat, pricingModel: newCampPricingModel }, validCreatives);
      setIsCreateCampaignOpen(false); setNewCampTitle('');
      setNewCampCreatives([{ headline: '', destinationUrl: '', adFormat: 'card', mediaFormat: 'image' }]);
      setCreationUncertain(false);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Campaign creation could not be confirmed. Refresh before retrying.');
      if (err instanceof CampaignWorkflowError) setIsCreateCampaignOpen(false);
    } finally { setIsSubmitting(false); setDataAttempt(value => value + 1); }
  };

  const handleAddWebsite = async (e: React.FormEvent) => {
    e.preventDefault(); if (!newWebDomain || isSubmitting) return;
    setIsSubmitting(true); setActionError(null);
    try {
      const site = await registerWebsite(newWebDomain.trim(), newWebMethod);
      setWebsites(items => [site, ...items]); setIsAddWebsiteOpen(false); setNewWebDomain('');
    } catch (err) { setActionError(err instanceof Error ? err.message : 'Website registration could not be confirmed.'); }
    finally { setIsSubmitting(false); }
  };

  const handleVerifyWebsite = async (siteId: string) => {
    if (pendingWrites.has(siteId)) return;
    setPendingWrites(items => new Set(items).add(siteId)); setActionError(null);
    try {
      const result = await verifyWebsite(siteId);
      setWebsites(items => items.map(site => site.id === siteId ? result.site : site));
      if (!result.site.isVerified) setActionError(result.error || 'Domain verification did not succeed. Check your verification records.');
    } catch (err) { setActionError(err instanceof Error ? err.message : 'Verification could not be confirmed.'); }
    finally { setPendingWrites(items => { const next = new Set(items); next.delete(siteId); return next; }); }
  };

  const handleToggleStatus = async (campId: string) => {
    const campaign = campaigns.find(item => item.id === campId);
    if (!campaign || pendingWrites.has(campId)) return;
    setPendingWrites(items => new Set(items).add(campId)); setActionError(null);
    try {
      const updated = await setCampaignStatus(campId, campaign.status === 'active' ? 'paused' : 'active');
      if (updated?.id !== campId) throw new Error('Campaign update could not be confirmed.');
      setCampaigns(items => items.map(item => item.id === campId ? { ...item, status: updated.status, moderationStatus: updated.moderationStatus } : item));
    } catch (err) { setActionError(err instanceof Error ? err.message : 'Campaign update could not be confirmed.'); }
    finally { setPendingWrites(items => { const next = new Set(items); next.delete(campId); return next; }); }
  };

  const toggleReelsConsent = async () => {
    if (pendingWrites.has('consent')) return;
    setPendingWrites(items => new Set(items).add('consent')); setActionError(null);
    try {
      const result = await apiData<any>('/api/v1/promoters/reels-consent', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ consent: !reelsConsent }) });
      if (![0, 1].includes(result?.consentGiven)) throw new Error('Consent update could not be confirmed.');
      setReelsConsent(result.consentGiven === 1);
    } catch (err) { setActionError(err instanceof Error ? err.message : 'Consent update could not be confirmed.'); }
    finally { setPendingWrites(items => { const next = new Set(items); next.delete('consent'); return next; }); }
  };

  // Compute stats
  const totalAdvertiserBudget = campaigns.reduce((a, b) => a + b.budgetUsd, 0);
  const totalAdvertiserSpent = campaigns.reduce((a, b) => a + b.spentUsd, 0);
  const totalPromoterEarned = promoterEarnings;

  const categories = ['All', 'Technology', 'Entertainment', 'Finance', 'Lifestyle', 'Gaming'];

  const filteredCampaigns = selectedCategory === 'All'
    ? catalog
    : catalog.filter(c => c.category.toLowerCase() === selectedCategory.toLowerCase());

  const createDialog = useDialog(sessionStatus === 'authenticated' && isCreateCampaignOpen, () => setIsCreateCampaignOpen(false));
  const websiteDialog = useDialog(sessionStatus === 'authenticated' && isAddWebsiteOpen, () => setIsAddWebsiteOpen(false));
  const embedDialog = useDialog(sessionStatus === 'authenticated' && Boolean(isEmbedCodeModalOpen), () => setIsEmbedCodeModalOpen(null));

  if (sessionStatus !== 'authenticated') return <SessionGate><></></SessionGate>;

  const promoterDependencies: Record<string, number[]> = {
    websites: [2], individuals: [1, 3, 4], mobile_apps: [5], marketplace: [1], disputes: [2],
  };
  const promoterSectionUnavailable = (promoterDependencies[promoterSection] || [])
    .some(index => failedLoads.includes(index));
  const unavailableSection = (
    <div className="theme-card" role="status" style={{ padding: 24, color: 'var(--text-secondary)' }}>
      <p>This section is temporarily unavailable. Please try again shortly.</p>
      <button type="button" onClick={() => setDataAttempt(value => value + 1)}
        style={{ marginTop: 12, padding: '8px 16px', borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-primary)', cursor: 'pointer' }}>
        Try again
      </button>
    </div>
  );

  const advertiserNavGroups: NavGroup[] = [
    {
      title: 'Studio',
      items: [
        { id: 'overview_dash', label: 'Advertiser Dashboard', icon: TrendingUp },
      ],
    },
    {
      title: 'Campaign Management',
      items: [
        { id: 'campaigns', label: 'All Campaigns', icon: Layers, badge: campaigns.length },
        { id: 'new_campaign', label: 'Create Campaign', icon: Plus },
      ],
    },
    {
      title: 'Performance & Protection',
      items: [
        { id: 'conversions', label: 'Conversions & CPA', icon: Target },
        { id: 'disputes', label: 'Disputes & Rebates', icon: ShieldAlert },
      ],
    },
    {
      title: 'Finance & Account',
      items: [
        { id: 'billing_escrow', label: 'Billing & Escrow', icon: CreditCard },
        { id: 'notifications', label: 'Notifications', icon: Bell, badge: '2' },
        { id: 'support', label: 'Help & Support', icon: HelpCircle },
      ],
    },
  ];

  const promoterNavGroups: NavGroup[] = [
    {
      title: 'Monetization',
      items: [
        { id: 'websites', label: 'Websites & Ad Slots', icon: Globe, badge: websites.length },
        { id: 'individuals', label: 'Links & Reels Social', icon: Share2 },
        { id: 'mobile_apps', label: 'Mobile Apps SDK', icon: Smartphone, badge: apps.length },
      ],
    },
    {
      title: 'Deals & Discovery',
      items: [
        { id: 'marketplace', label: 'Ad Marketplace', icon: Share2 },
        { id: 'quality', label: 'Quality & Trust Score', icon: ShieldCheck },
      ],
    },
    {
      title: 'Earnings & Account',
      items: [
        { id: 'billing_escrow', label: 'Earnings & Payouts', icon: CreditCard },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'support', label: 'Support & Knowledge', icon: HelpCircle },
      ],
    },
  ];

  const adminNavGroups: NavGroup[] = [
    {
      title: 'Governance & Audits',
      items: [
        { id: 'moderation', label: 'Creative Review Queue', icon: ShieldCheck },
        { id: 'admin_disputes', label: 'Traffic Adjustments', icon: ShieldAlert },
      ],
    },
    {
      title: 'System & Health',
      items: [
        { id: 'quality', label: 'Traffic Integrity Engine', icon: ShieldCheck },
        { id: 'notifications', label: 'Admin Alerts', icon: Bell },
        { id: 'support', label: 'Support Queue', icon: HelpCircle },
      ],
    },
  ];

  const currentNavGroups: NavGroup[] =
    role === 'admin'
      ? adminNavGroups
      : role === 'promoter'
        ? promoterNavGroups
        : advertiserNavGroups;

  const activeNavId =
    role === 'admin'
      ? (adminTab === 'moderation' ? 'moderation' : 'admin_disputes')
      : role === 'promoter'
        ? (promoterSection === 'billing' ? 'billing_escrow' : promoterSection)
        : (advertiserTab === 'dashboard' ? 'overview_dash' : advertiserTab === 'billing' ? 'billing_escrow' : advertiserTab);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-page)' }}>
      {actionError && <div role="alert" style={{ position: 'sticky', top: 0, zIndex: 1200, padding: '12px 24px', background: 'var(--bg-elevated)', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-subtle)' }}>
        {actionError} <button style={{ marginLeft: 12, padding: '6px 12px', borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-primary)', cursor: 'pointer' }} onClick={() => setDataAttempt(value => value + 1)}>Refresh account data</button>
      </div>}
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
            maxWidth: '1440px',
            margin: '0 auto',
            padding: '12px 24px',
            minHeight: '70px',
            width: '100%',
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          {/* Brand Identity & Back to Landing */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', maxWidth: '100%' }}>
            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '6px',
                borderRadius: '8px',
                backgroundColor: 'var(--badge-bg)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                cursor: 'pointer',
              }}
              title="Open Navigation Menu"
            >
              <Menu style={{ width: 18, height: 18 }} />
            </button>

            <Link
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                textDecoration: 'none',
                cursor: 'pointer',
              }}
              title="Return to CrimFig Ads Home"
            >
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
            </Link>
          </div>

          {/* Mode Switcher: Advertiser Studio vs Promoter Hub */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', maxWidth: '100%', minWidth: 0 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '4px',
                flexWrap: 'wrap',
                maxWidth: '100%',
                boxSizing: 'border-box',
                borderRadius: '12px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
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
                onClick={() => router.push('/websites')}
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
                onClick={() => router.push('/admin/moderation')}
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
          </div>

          {/* Right Controls: Sign Out & Wallet Trigger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', maxWidth: '100%' }}>
            <SignOutButton />

            <button
              type="button"
              onClick={() => {
                router.push('/billing');
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

      {/* Main Workspace Layout with Unified DashboardSidebar Standard */}
      <div style={{ display: 'flex', flex: 1, minHeight: 'calc(100vh - 71px)', position: 'relative' }}>
        <DashboardSidebar
          app="ads"
          groups={currentNavGroups}
          activeId={activeNavId}
          onSelect={(id) => {
            if (id === 'overview_dash') {
              router.push('/dashboard');
            } else if (id === 'new_campaign') {
              router.push('/campaigns/new');
            } else if (['campaigns', 'conversions', 'disputes', 'notifications', 'support'].includes(id)) {
              router.push(`/${id}`);
            } else if (id === 'billing_escrow') {
              router.push('/billing');
            } else if (['websites', 'individuals', 'mobile_apps', 'marketplace', 'quality'].includes(id)) {
              router.push(`/${id}`);
            } else if (id === 'moderation') {
              router.push('/admin/moderation');
            } else if (id === 'admin_disputes') {
              router.push('/admin/disputes');
            }
          }}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
          isMobileOpen={isMobileNavOpen}
          onCloseMobile={() => setIsMobileNavOpen(false)}
          switchAppLink={{
            label: 'Billing & Wallet',
            href: 'https://billing.crimfig.com',
            icon: CreditCard,
          }}
        />

        {/* Main Content Area */}
        <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px', flex: 1, width: '100%', display: 'flex', flexDirection: 'column', gap: '32px', minWidth: 0 }}>

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
                      Register properties and manage owned links. Publisher ad delivery and funded settlement remain in development.
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
                      <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)' }}>{totalPromoterEarned === null ? '—' : `$${totalPromoterEarned.toFixed(2)} USD`}</div>
                      <span style={{ fontSize: '11px', color: 'var(--color-success)', fontWeight: 600 }}>Check available and held funds in Billing</span>
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
                    onClick={() => router.push('/websites')}
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
                    Websites & Embeds {!isLoadingWebsites && !failedLoads.includes(2) && `(${websites.length})`}
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push('/individuals')}
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
                    onClick={() => router.push('/mobile_apps')}
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
                    Mobile Apps {!isLoadingCampaigns && !failedLoads.includes(5) && `(${apps.length})`}
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push('/marketplace')}
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
                    Browse Ad Campaigns {!isLoadingCampaigns && !failedLoads.includes(1) && `(${catalog.length})`}
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push('/billing')}
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
                    onClick={() => router.push('/quality')}
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
                  <button
                    type="button"
                    onClick={() => setPromoterSection('disputes')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      backgroundColor: promoterSection === 'disputes' ? 'var(--color-crimson)' : 'transparent',
                      color: promoterSection === 'disputes' ? '#FFFFFF' : 'var(--text-secondary)',
                    }}
                  >
                    <ShieldAlert style={{ width: 16, height: 16 }} />
                    Traffic Appeals &amp; Disputes
                  </button>
                </div>
              </div>

              {promoterSectionUnavailable && unavailableSection}
              {/* SECTION: QUALITY & TRUST */}
              {promoterSection === 'quality' && (
                <PromoterQualityCard apiBase={API_BASE} />
              )}

              {/* SECTION: DISPUTES & APPEALS */}
              {promoterSection === 'disputes' && !promoterSectionUnavailable && (
                <DisputesTab role="promoter" websites={websites} />
              )}

              {/* SECTION 0: BILLING & LEDGER (PROMOTER VIEW) */}
              {promoterSection === 'billing' && (
                <BillingLedger initialRole="promoter" onRoleChange={(r) => setRole(r)} />
              )}

              {/* SECTION 1: WEBSITES */}
              {promoterSection === 'websites' && !promoterSectionUnavailable && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>Registered Websites</h3>
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                        Verify website ownership. Publisher installation codes are not available yet.
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
                      description="Register your domain and complete ownership checks. Publisher installation codes remain unavailable."
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
                            {!site.isVerified && (
                              <div style={{ marginTop: '12px', padding: '12px', borderRadius: '8px', backgroundColor: 'var(--badge-bg)', border: '1px solid var(--border-subtle)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                                  <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-crimson)', letterSpacing: '0.05em' }}>
                                    DNS TXT Verification Record
                                  </span>
                                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Type: TXT</span>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr auto', gap: '8px', alignItems: 'center', fontSize: '12px', backgroundColor: 'var(--bg-page)', padding: '8px', borderRadius: '6px' }}>
                                  <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Host:</span>
                                  <code style={{ fontFamily: 'monospace', color: 'var(--text-primary)' }}>@ (or {site.domain})</code>
                                  <button
                                    type="button"
                                    onClick={() => navigator.clipboard.writeText('@')}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '2px' }}
                                    title="Copy Host"
                                  >
                                    <Copy style={{ width: 12, height: 12 }} />
                                  </button>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr auto', gap: '8px', alignItems: 'center', fontSize: '12px', backgroundColor: 'var(--bg-page)', padding: '8px', borderRadius: '6px', marginTop: '6px' }}>
                                  <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Value:</span>
                                  <code style={{ fontFamily: 'monospace', color: 'var(--color-crimson)', wordBreak: 'break-all' }}>crimfig-site-verification={site.verificationToken}</code>
                                  <button
                                    type="button"
                                    onClick={() => navigator.clipboard.writeText(`crimfig-site-verification=${site.verificationToken}`)}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '2px' }}
                                    title="Copy TXT Value"
                                  >
                                    <Copy style={{ width: 12, height: 12 }} />
                                  </button>
                                </div>
                                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>
                                  Add this TXT record at your DNS provider (Cloudflare, Namecheap, GoDaddy). Verification checks the root domain in real time.
                                </p>
                              </div>
                            )}
                          </div>

                          <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                            {!site.isVerified ? (
                              <button
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
                                  boxShadow: 'var(--shadow-crimson)'
                                }}
                              >
                                <ShieldCheck style={{ width: 14, height: 14 }} /> {pendingWrites.has(site.id) ? 'Checking DNS...' : 'Verify DNS Record Now'}
                              </button>
                            ) : (
                              <button
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
                                  cursor: 'pointer'
                                }}
                              >
                                <Code2 style={{ width: 14, height: 14 }} /> Manage Ad Spaces &amp; Get Code
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
              {promoterSection === 'individuals' && !promoterSectionUnavailable && (
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
                        onClick={toggleReelsConsent}
                        disabled={pendingWrites.has('consent')}
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
                  ) : placements.length === 0 ? (
                    <EmptyState
                      icon={Share2}
                      title="No Active Share Campaigns"
                      description="There are currently no active ad campaigns accepting individual promoters. Check back soon or launch a campaign in Advertiser Studio."
                    />
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                      {placements.map((placement) => {
                        const camp = { ...placement.campaign, headline: placement.creative?.headline, cpcUsd: 0 };
                        const shareLink = placement.shareLink;
                        return (
                          <div key={placement.id} className="theme-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-crimson)' }}>{camp.category}</span>
                              <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '9999px', backgroundColor: 'var(--badge-bg)', color: 'var(--text-secondary)' }}>
                                Verified settlement determines earnings
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
                                onClick={() => handleCopy(shareLink, placement.id)}
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
              {promoterSection === 'mobile_apps' && !promoterSectionUnavailable && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>Registered Mobile Applications</h3>
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                        Integrate CrimFig Ads Native SDK into your Android and iOS applications.
                      </p>
                    </div>
                  </div>

                  {isLoadingCampaigns ? <CardSkeleton count={2} /> : apps.length === 0 ? (
                    <EmptyState
                      icon={Smartphone}
                      title="No Mobile Apps Registered"
                      description="Connect your mobile applications with our React Native or Native SDK to earn revenue from in-app ads."
                      actionLabel="+ Register First Mobile App"
                      onAction={() => setActionError('Mobile SDK installation is not available yet.')}
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
              {promoterSection === 'marketplace' && !promoterSectionUnavailable && (
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
                                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-success)' }}>Verified settlement only</span>
                              </div>
                              <div>
                                <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Impression Payout</span>
                                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-success)' }}>No guaranteed payout</span>
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            disabled={pendingWrites.has(camp.id)}
                            onClick={async () => {
                              if (pendingWrites.has(camp.id)) return;
                              setPendingWrites(items => new Set(items).add(camp.id)); setActionError(null);
                              try {
                                const placement = await apiData<any>('/api/v1/placements', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ campaignId: camp.id }) });
                                if (!placement?.id || typeof placement.shareLink !== 'string') throw new Error('Placement creation could not be confirmed. Refresh before retrying.');
                                setDataAttempt(value => value + 1); setPromoterSection('individuals');
                              } catch (err) { setActionError(err instanceof Error ? err.message : 'Placement creation could not be confirmed.'); }
                              finally { setPendingWrites(items => { const next = new Set(items); next.delete(camp.id); return next; }); }
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
                      Activity Details
                    </h4>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      Recorded totals are available in analytics; per-event detail is not loaded here.
                    </p>
                  </div>
                </div>

                {logs.length === 0 ? (
                  <EmptyState
                    icon={Inbox}
                    title="Event Details Unavailable"
                    description="Per-event activity is not loaded here. View recorded totals in analytics and settled earnings in Billing."
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
              {failedLoads.includes(0) && ['campaigns', 'disputes'].includes(advertiserTab) ? unavailableSection : advertiserTab === 'billing' ? (
                <BillingLedger initialRole="advertiser" onRoleChange={(r) => setRole(r)} />
              ) : advertiserTab === 'new_campaign' ? (
                <CampaignCreationWizard
                  onCancel={() => router.push('/campaigns')}
                  onSuccess={(newId) => {
                    router.push('/campaigns');
                    setDataAttempt((v) => v + 1);
                  }}
                />
              ) : advertiserTab === 'conversions' ? (
                <ConversionsTab />
              ) : advertiserTab === 'disputes' ? (
                <DisputesTab role="advertiser" campaigns={campaigns} />
              ) : advertiserTab === 'notifications' ? (
                <NotificationCenter />
              ) : advertiserTab === 'support' ? (
                <HelpSupportHub />
              ) : advertiserTab === 'dashboard' ? (
                <ConsoleDashboard
                  onNavigateToCampaigns={(status) => {
                    router.push('/campaigns');
                    if (status) setCampaignStatusFilter(status);
                  }}
                  onNavigateToPromoterHub={(section) => {
                    if (section) router.push(`/${section}`);
                    else router.push('/websites');
                  }}
                  onOpenCreateCampaign={() => router.push('/campaigns/new')}
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
                        onClick={() => { setCreationUncertain(false); router.push('/campaigns/new'); }}
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
                                            {camp.metricsLoaded ? camp.impressions.toLocaleString() : '—'}
                                          </td>
                                        );
                                      }
                                      if (col.key === 'clicks') {
                                        return (
                                          <td key={col.key} style={{ padding: '14px 16px', color: 'var(--color-success)', fontWeight: 600 }}>
                                            {camp.metricsLoaded ? camp.clicks.toLocaleString() : '—'}
                                          </td>
                                        );
                                      }
                                      if (col.key === 'hovers') {
                                        return (
                                          <td key={col.key} style={{ padding: '14px 16px' }}>
                                            {camp.metricsLoaded ? (camp.hovers ?? 0).toLocaleString() : '—'}
                                          </td>
                                        );
                                      }
                                      if (col.key === 'touches') {
                                        return (
                                          <td key={col.key} style={{ padding: '14px 16px' }}>
                                            {camp.metricsLoaded ? (camp.touches ?? 0).toLocaleString() : '—'}
                                          </td>
                                        );
                                      }
                                      if (col.key === 'ctr') {
                                        const ctr = camp.impressions > 0 ? (camp.clicks / camp.impressions) * 100 : 0;
                                        return (
                                          <td key={col.key} style={{ padding: '14px 16px', fontWeight: 700 }}>
                                            {camp.metricsLoaded ? `${ctr.toFixed(2)}%` : '—'}
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
                                                  onClick={async () => {
                                                    try {
                                                      const details = await apiData<any>(`/api/v1/campaigns/${encodeURIComponent(camp.id)}`);
                                                      const creative = arrayData<any>(details.creatives).find(item => item.reviewStatus === 'rejected');
                                                      if (!creative) throw new Error('No rejected creative is available for replacement.');
                                                      setReplacementCreative({ ...creative, title: camp.title });
                                                    } catch (err) { setActionError(err instanceof Error ? err.message : 'Creative details unavailable.'); }
                                                  }}
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
                                                  disabled={pendingWrites.has(camp.id)}
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Admin Sub-Tabs */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
                <button
                  type="button"
                  onClick={() => router.push('/admin/moderation')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 600,
                    transition: 'all 0.15s ease',
                    backgroundColor: adminTab === 'moderation' ? 'var(--color-crimson)' : 'transparent',
                    color: adminTab === 'moderation' ? '#FFFFFF' : 'var(--text-secondary)',
                  }}
                >
                  <ShieldCheck style={{ width: 14, height: 14 }} />
                  <span>Ad Moderation Queue</span>
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/admin/disputes')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 600,
                    transition: 'all 0.15s ease',
                    backgroundColor: adminTab === 'disputes' ? 'var(--color-crimson)' : 'transparent',
                    color: adminTab === 'disputes' ? '#FFFFFF' : 'var(--text-secondary)',
                  }}
                >
                  <ShieldAlert style={{ width: 14, height: 14 }} />
                  <span>Traffic Disputes &amp; Adjustments</span>
                </button>
              </div>

              {adminTab === 'moderation' ? (
                <AdminModerationQueue apiBase={API_BASE} />
              ) : (
                <DisputesTab role="advertiser" campaigns={campaigns} />
              )}
            </div>
          )}
        </main>
      </div>

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
            <ThemeSwitcher showLabel labelPrefix="Theme:" />
          </div>
        </div>
      </footer>

      {/* MODAL: CREATE CAMPAIGN */}
      {isCreateCampaignOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)' }}>
          <div ref={createDialog} role="dialog" aria-modal="true" aria-label="Create Ad Campaign" tabIndex={-1} className="theme-card" style={{ width: '100%', maxWidth: '520px', padding: '32px', backgroundColor: 'var(--bg-page)', position: 'relative', boxSizing: 'border-box', maxHeight: 'calc(100dvh - 32px)', overflowY: 'auto' }}>
            <button
              type="button"
              aria-label="Close Create Ad Campaign"
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
                <label htmlFor="ads-campaign-title" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>Campaign Title</label>
                <input id="ads-campaign-title"
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
                  <label htmlFor="ads-campaign-budget" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>Budget (USD)</label>
                  <input id="ads-campaign-budget"
                    type="number"
                    min="5"
                    required
                    value={newCampBudget}
                    onChange={(e) => setNewCampBudget(Number(e.target.value))}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-page)', fontSize: '14px', color: 'var(--text-primary)' }}
                  />
                </div>
                <div>
                  <label htmlFor="ads-campaign-category" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>Category</label>
                  <select id="ads-campaign-category"
                    disabled
                    title="Category targeting is not available yet"
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

              {/* Pricing Model & CPA / CPCV Settings (PLAN-0004) */}
              <div style={{ display: 'grid', gridTemplateColumns: newCampPricingModel === 'cpa' || newCampPricingModel === 'cpcv' ? '1fr 1fr' : '1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
                    Pricing &amp; Bidding Model
                  </label>
                  <select
                    aria-label="Pricing and bidding model"
                    value={newCampPricingModel}
                    onChange={(e) => setNewCampPricingModel(e.target.value as any)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-page)', fontSize: '13px', color: 'var(--text-primary)' }}
                  >
                    <option value="cpc">CPC — Pay per Click ($0.10+)</option>
                    <option value="cpm">CPM — Pay per 1,000 Views ($1.00+)</option>
                    <option value="cpa" disabled>CPA — Pay per Acquisition / Sale ($2.00+)</option>
                    <option value="cpcv" disabled>CPCV — Cost per Completed Video ($0.05+)</option>
                  </select>
                </div>

                {newCampPricingModel === 'cpa' && (
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
                      Target CPA (USD)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="1"
                      required
                      aria-label="Target CPA (USD)"
                      value={newCampTargetCpa}
                      onChange={(e) => setNewCampTargetCpa(Number(e.target.value))}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-page)', fontSize: '13px', color: 'var(--text-primary)' }}
                    />
                  </div>
                )}

                {newCampPricingModel === 'cpcv' && (
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
                      Target CPCV (USD)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      required
                      aria-label="Target CPCV (USD)"
                      value={newCampTargetCpcv}
                      onChange={(e) => setNewCampTargetCpcv(Number(e.target.value))}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-page)', fontSize: '13px', color: 'var(--text-primary)' }}
                    />
                  </div>
                )}
              </div>

              {newCampPricingModel === 'cpa' && (
                <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.2)', fontSize: '11px', color: '#1E40AF', lineHeight: 1.5 }}>
                  <strong>CPA Guardrail:</strong> Billed strictly on verified conversions reported via your pixel or S2S postback. Promoter payouts undergo a 72-hour clearance hold to allow refund reversals.
                </div>
              )}

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
                            aria-label={`Ad ${idx + 1} format`}
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
                              aria-label={`Remove ad ${idx + 1}`}
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
                        aria-label={`Ad ${idx + 1} headline`}
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
                        aria-label={`Ad ${idx + 1} destination URL`}
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
                            aria-label={`Ad ${idx + 1} media file`}
                            accept={crt.adFormat === 'video' ? 'video/mp4,video/webm,image/gif' : 'image/jpeg,image/png,image/webp,image/avif,image/gif'}
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;

                              // Browser compatibility hints for advertiser
                              if (file.type === 'video/webm') {
                                setActionError('Format Note: WebM has partial hardware acceleration on older iOS/Safari browsers. MP4 is recommended for maximum reach.');
                              }

                              // Strict client-side validation
                              const isVideo = file.type.startsWith('video/') || (file.type === 'image/gif' && crt.adFormat === 'video');
                              const maxBytes = isVideo ? 20 * 1024 * 1024 : 750 * 1024;
                              if (file.size > maxBytes) {
                                const limitText = isVideo ? '20MB' : '750KB';
                                const actualText = isVideo
                                  ? `${(file.size / (1024 * 1024)).toFixed(1)}MB`
                                  : `${(file.size / 1024).toFixed(1)}KB`;
                                setActionError(`Upload rejected: File size is ${actualText}, exceeding the ${limitText} platform restriction. Server optimization is disabled; please resize or encode your file locally.`);
                                e.target.value = '';
                                return;
                              }

                              const formData = new FormData();
                              formData.append('file', file);

                              try {
                                const uploadRes = await sessionFetch(`${API_BASE}/api/v1/uploads/direct`, {
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
                                  setActionError(errJson?.message || 'File upload failed. Ensure file meets restrictions.');
                                }
                              } catch {
                                setActionError('The media upload could not be confirmed.');
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
                disabled={isSubmitting || creationUncertain}
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
        <div style={{ position: 'fixed', inset: 0, zIndex: 1300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)' }}>
          <div ref={websiteDialog} role="dialog" aria-modal="true" aria-label="Register Website" tabIndex={-1} className="theme-card" style={{ width: '100%', maxWidth: '460px', padding: '32px', backgroundColor: 'var(--bg-page)', position: 'relative', boxSizing: 'border-box', maxHeight: 'calc(100dvh - 32px)', overflowY: 'auto' }}>
            <button
              type="button"
              aria-label="Close Register Website"
              onClick={() => setIsAddWebsiteOpen(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <X style={{ width: 20, height: 20 }} />
            </button>

            <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>Register Website</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Register your website and verify ownership. Publisher installation codes remain unavailable.
            </p>

            <form onSubmit={handleAddWebsite} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label htmlFor="ads-website-domain" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>Domain Name</label>
                <input id="ads-website-domain"
                  type="text"
                  required
                  value={newWebDomain}
                  onChange={(e) => setNewWebDomain(e.target.value)}
                  placeholder="e.g. mytechblog.com"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-page)', fontSize: '14px', color: 'var(--text-primary)' }}
                />
              </div>

              <div>
                <label htmlFor="ads-website-method" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>Verification Method</label>
                <select id="ads-website-method"
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
          <div style={{ position: 'fixed', inset: 0, zIndex: 1300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)' }}>
            <div ref={embedDialog} role="dialog" aria-modal="true" aria-label="Publisher Installation Code" tabIndex={-1} className="theme-card" style={{ width: '100%', maxWidth: '620px', padding: '32px', backgroundColor: 'var(--bg-page)', position: 'relative', display: 'flex', flexDirection: 'column', gap: '20px', boxSizing: 'border-box', maxHeight: 'calc(100dvh - 32px)', overflowY: 'auto' }}>
              <button
                type="button"
                aria-label="Close Publisher Installation Code"
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
          onReplaceSuccess={() => {
            setDataAttempt(value => value + 1);
          }}
        />
      )}

      {/* MODAL: WEBSITE AD SPACES & DEVELOPER CODE GENERATOR (PLAN-0010) */}
      {isAdSpacesModalOpen && selectedPlacementSite && (() => {
        const placementMeta = CRIMFIG_PLACEMENTS[selectedPlacement];
        const generatedCode = generateCrimFigEmbedCode({
          placement: selectedPlacement,
          publisherKey: `pk_${selectedPlacementSite.verificationToken.slice(0, 16)}`,
          domain: selectedPlacementSite.domain,
          mode: adSpaceMode,
          allowHomeNetworkFill,
        });

        return (
          <div style={{ position: 'fixed', inset: 0, zIndex: 100, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
            <div className="glass-card" style={{ width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto', padding: '28px', borderRadius: '16px', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>Manage Ad Spaces &amp; Code</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Domain: <code style={{ color: 'var(--color-crimson)', fontFamily: 'monospace' }}>{selectedPlacementSite.domain}</code>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAdSpacesModalOpen(false)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                >
                  <X style={{ width: 20, height: 20 }} />
                </button>
              </div>

              {/* Mode Selection Segmented Control */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Ad Space Inventory Mode
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setAdSpaceMode('publisher_network')}
                    style={{
                      padding: '12px',
                      borderRadius: '10px',
                      border: adSpaceMode === 'publisher_network' ? '2px solid var(--color-crimson)' : '1px solid var(--border-subtle)',
                      backgroundColor: adSpaceMode === 'publisher_network' ? 'var(--badge-bg)' : 'transparent',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)' }}>Monetized Network</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Earn 55% revenue split showing CrimFig ecosystem ads.
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAdSpaceMode('owned_site_direct')}
                    style={{
                      padding: '12px',
                      borderRadius: '10px',
                      border: adSpaceMode === 'owned_site_direct' ? '2px solid var(--color-crimson)' : '1px solid var(--border-subtle)',
                      backgroundColor: adSpaceMode === 'owned_site_direct' ? 'var(--badge-bg)' : 'transparent',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)' }}>Direct Deal (Free Barter)</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Traffic outside deals 100% free; host 1 CrimFig barter slot.
                    </div>
                  </button>
                </div>
              </div>

              {/* Barter Conditions notice when in Owned-Site Direct mode */}
              {adSpaceMode === 'owned_site_direct' && (
                <div style={{ padding: '12px 14px', borderRadius: '8px', backgroundColor: 'var(--badge-bg)', border: '1px solid var(--border-subtle)', fontSize: '12px' }}>
                  <div style={{ fontWeight: 600, color: 'var(--color-crimson)', marginBottom: '4px' }}>
                    CrimFig Barter Agreement &amp; Compliance Policy
                  </div>
                  <p style={{ color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                    Free ad serving is granted on the condition that at least one other active ad slot on your site displays occasional CrimFig platform ads. Our team reviews barter sites for fair play.
                  </p>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={allowHomeNetworkFill}
                      onChange={(e) => setAllowHomeNetworkFill(e.target.checked)}
                      style={{ accentColor: 'var(--color-crimson)' }}
                    />
                    <span style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: 500 }}>
                      Occasionally display CrimFig network ads on Home slots (simplifies team review)
                    </span>
                  </label>
                </div>
              )}

              {/* Step 1: Placement Dimensions */}
              <div>
                <label htmlFor="adspace-select-placement" style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Placement Position &amp; Dimensions
                </label>
                <select
                  id="adspace-select-placement"
                  value={selectedPlacement}
                  onChange={(e) => setSelectedPlacement(e.target.value as CrimFigPlacement)}
                  className="input-field"
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

              {/* Step 2: Generated Code Block */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    HTML Installation Snippet
                  </label>
                  <button
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
                      cursor: 'pointer'
                    }}
                  >
                    {copiedToken === 'ad_space_code' ? <Check style={{ width: 12, height: 12 }} /> : <Copy style={{ width: 12, height: 12 }} />}
                    {copiedToken === 'ad_space_code' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <div style={{ borderRadius: '8px', backgroundColor: 'var(--bg-page)', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
                  <pre style={{ margin: 0, padding: '12px', overflowX: 'auto', whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '11px', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                    {generatedCode}
                  </pre>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
                <button
                  type="button"
                  onClick={() => setIsAdSpacesModalOpen(false)}
                  style={{ padding: '8px 18px', borderRadius: '8px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-page)', color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}


