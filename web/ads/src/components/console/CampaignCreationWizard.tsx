'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Layers,
  Target,
  DollarSign,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  UploadCloud,
  Check,
  AlertCircle,
  HelpCircle,
  Eye,
  Info,
  Globe,
  Sliders,
  ShieldCheck,
  ChevronRight,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { createCampaignWorkflow, CampaignWorkflowError } from '../../lib/campaigns-api';
import { sessionFetch } from '../../lib/session';

interface CreativeDraft {
  headline: string;
  bodyText?: string;
  ctaText: string;
  destinationUrl: string;
  imageUrl?: string;
  videoUrl?: string;
  adFormat: 'banner' | 'card' | 'video' | 'interstitial';
  mediaFormat: 'image' | 'video' | 'gif';
}

interface CampaignWizardProps {
  onCancel: () => void;
  onSuccess: (campaignId: string) => void;
}

export function CampaignCreationWizard({ onCancel, onSuccess }: CampaignWizardProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Campaign Details
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Technology');
  const [channels, setChannels] = useState<string[]>(['websites', 'individuals']);

  // Step 2: Ad Creatives
  const [creatives, setCreatives] = useState<CreativeDraft[]>([
    {
      headline: '',
      bodyText: '',
      ctaText: 'Learn More',
      destinationUrl: '',
      adFormat: 'card',
      mediaFormat: 'image',
    },
  ]);
  const [activeCreativeIdx, setActiveCreativeIdx] = useState(0);
  const [uploadingMedia, setUploadingMedia] = useState(false);

  // Step 3: Audience & Placement Targeting
  const [targetCountries, setTargetCountries] = useState<string[]>(['NG', 'GH', 'KE', 'ZA', 'US', 'GB']);
  const [targetDevices, setTargetDevices] = useState<string[]>(['mobile', 'desktop']);
  const [frequencyCap, setFrequencyCap] = useState<number>(5);

  // Step 4: Budget & Pricing Model
  const [pricingModel, setPricingModel] = useState<'cpm' | 'cpc'>('cpm');
  const [budgetUsd, setBudgetUsd] = useState<number>(25);
  const [dailyBudgetUsd, setDailyBudgetUsd] = useState<number>(5);
  const [cpmBidCents, setCpmBidCents] = useState<number>(50); // $0.50 floor
  const [cpcBidCents, setCpcBidCents] = useState<number>(10); // $0.10 floor

  const activeCreative = creatives[activeCreativeIdx] || creatives[0];

  const validateStep = (step: number): boolean => {
    setError(null);
    if (step === 1) {
      if (!title.trim()) {
        setError('Please enter a descriptive campaign title to help you identify your ad.');
        return false;
      }
      return true;
    }
    if (step === 2) {
      const valid = creatives.every((c) => c.headline.trim() && c.destinationUrl.trim());
      if (!valid) {
        setError('Each ad creative requires a headline and a valid click destination URL.');
        return false;
      }
      return true;
    }
    if (step === 3) {
      if (targetDevices.length === 0) {
        setError('Please select at least one device category.');
        return false;
      }
      return true;
    }
    if (step === 4) {
      if (budgetUsd < 5) {
        setError('Minimum campaign budget is $5.00 USD to ensure fair reach.');
        return false;
      }
      if (pricingModel === 'cpm' && cpmBidCents < 50) {
        setError('Minimum CPM bid is $0.50 (50¢) per 1,000 viewable impressions.');
        return false;
      }
      if (pricingModel === 'cpc' && cpcBidCents < 10) {
        setError('Minimum CPC bid is $0.10 (10¢) per click.');
        return false;
      }
      return true;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const handleBack = () => {
    setError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleLaunchCampaign = async () => {
    if (!validateStep(4)) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const campaignId = await createCampaignWorkflow(
        {
          title: title.trim(),
          budgetUsd,
          format: creatives[0].adFormat,
          pricingModel,
        },
        creatives.map((c) => ({
          headline: c.headline.trim(),
          bodyText: c.bodyText?.trim() || undefined,
          ctaText: c.ctaText.trim() || 'Learn More',
          destinationUrl: c.destinationUrl.trim(),
          imageUrl: c.imageUrl,
          videoUrl: c.videoUrl,
          adFormat: c.adFormat,
          mediaFormat: c.mediaFormat,
        }))
      );

      onSuccess(campaignId);
    } catch (err: any) {
      if (err instanceof CampaignWorkflowError) {
        setError(`We saved your campaign details, but review submission needs to be refreshed. Campaign ID: ${err.campaignId}`);
      } else {
        setError(err.message || 'Campaign creation could not be confirmed. Your funds were not deducted. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>, isVideo: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxBytes = isVideo ? 20 * 1024 * 1024 : 750 * 1024;
    if (file.size > maxBytes) {
      setError(`Media size exceeds limits: ${isVideo ? '20MB for video' : '750KB for images'}. Please optimize locally.`);
      return;
    }

    setUploadingMedia(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await sessionFetch('/api/v1/uploads/direct', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const json = await res.json();
        const updated = [...creatives];
        if (isVideo) {
          updated[activeCreativeIdx].videoUrl = json.data.cdnUrl;
          updated[activeCreativeIdx].mediaFormat = 'video';
        } else {
          updated[activeCreativeIdx].imageUrl = json.data.cdnUrl;
          updated[activeCreativeIdx].mediaFormat = 'image';
        }
        setCreatives(updated);
      } else {
        setError('Media upload encountered an obstacle. Please try again.');
      }
    } catch {
      setError('Connection dropped during file upload. Please check your network.');
    } finally {
      setUploadingMedia(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1080px', margin: '0 auto', width: '100%' }}>
      {/* Top Banner & Empathetic Guidance */}
      <div
        style={{
          padding: '24px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, rgba(212,20,58,0.06) 0%, rgba(23,27,42,0.04) 100%)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--color-crimson)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                backgroundColor: 'var(--badge-bg)',
                padding: '2px 8px',
                borderRadius: '6px',
              }}
            >
              PLAN-0013 · Guided Creation
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Empathetic Advertiser Studio</span>
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Create Your Campaign
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0', maxWidth: '640px' }}>
            Reach authentic, verified audiences across ethical publishers and creators. Zero hidden fees, zero bot impressions, and full creative control.
          </p>
        </div>

        <button
          type="button"
          onClick={onCancel}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-surface)',
            color: 'var(--text-secondary)',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Cancel &amp; Return
        </button>
      </div>

      {/* Stepper Progress Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px', position: 'relative' }}>
        {[
          { num: 1, label: 'Campaign Details', icon: Layers },
          { num: 2, label: 'Ad Creatives', icon: Eye },
          { num: 3, label: 'Targeting & Audience', icon: Target },
          { num: 4, label: 'Budget & Pricing', icon: DollarSign },
          { num: 5, label: 'Review & Submit', icon: CheckCircle2 },
        ].map((s) => {
          const Icon = s.icon;
          const isDone = currentStep > s.num;
          const isActive = currentStep === s.num;

          return (
            <div
              key={s.num}
              onClick={() => {
                if (s.num < currentStep) setCurrentStep(s.num);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: s.num < currentStep ? 'pointer' : 'default',
                opacity: s.num > currentStep ? 0.5 : 1,
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isDone ? 'var(--color-success)' : isActive ? 'var(--color-crimson)' : 'var(--bg-elevated)',
                  color: isDone || isActive ? '#FFFFFF' : 'var(--text-muted)',
                  fontWeight: 700,
                  fontSize: '13px',
                  boxShadow: isActive ? 'var(--shadow-crimson)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                {isDone ? <Check style={{ width: 16, height: 16 }} /> : s.num}
              </div>
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  display: 'none',
                }}
                className="step-label"
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Error Alert with Reassuring Guidance */}
      {error && (
        <div
          role="alert"
          style={{
            padding: '14px 18px',
            borderRadius: '10px',
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            color: 'var(--color-error)',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <AlertCircle style={{ width: 18, height: 18, flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      {/* Step Content Card */}
      <div
        className="theme-card"
        style={{
          padding: '32px',
          borderRadius: '16px',
          backgroundColor: 'var(--bg-page)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        {/* STEP 1: CAMPAIGN DETAILS */}
        {currentStep === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px' }}>
                Step 1: Campaign Details
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                Give your campaign a memorable name and choose the topic or industry that best aligns with your message.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Campaign Title <span style={{ color: 'var(--color-crimson)' }}>*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Summer Product Launch 2026"
                style={{
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-surface)',
                  fontSize: '14px',
                  color: 'var(--text-primary)',
                  outline: 'none',
                }}
              />
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                This is for your internal identification in reporting and analytics.
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Description (Optional)
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Notes or campaign objectives for your records..."
                style={{
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-surface)',
                  fontSize: '14px',
                  color: 'var(--text-primary)',
                  outline: 'none',
                  resize: 'vertical',
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Industry Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-surface)',
                    fontSize: '14px',
                    color: 'var(--text-primary)',
                    outline: 'none',
                  }}
                >
                  <option value="Technology">Technology &amp; Software</option>
                  <option value="Finance">Finance &amp; Fintech</option>
                  <option value="Ecommerce">E-Commerce &amp; Retail</option>
                  <option value="Education">Education &amp; Learning</option>
                  <option value="Entertainment">Entertainment &amp; Media</option>
                  <option value="Health">Health &amp; Wellness</option>
                  <option value="General">General Interest</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Distribution Channels
                </label>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', height: '48px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={channels.includes('websites')}
                      onChange={(e) => {
                        if (e.target.checked) setChannels([...channels, 'websites']);
                        else setChannels(channels.filter((c) => c !== 'websites'));
                      }}
                    />
                    Websites &amp; Blogs
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={channels.includes('individuals')}
                      onChange={(e) => {
                        if (e.target.checked) setChannels([...channels, 'individuals']);
                        else setChannels(channels.filter((c) => c !== 'individuals'));
                      }}
                    />
                    Verified Promoters
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: AD CREATIVES & LIVE PREVIEWS */}
        {currentStep === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px' }}>
                  Step 2: Ad Creatives &amp; Previews
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                  Craft the message and visual presentation viewers will experience. You can configure multiple ad sizes.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setCreatives([
                    ...creatives,
                    {
                      headline: '',
                      bodyText: '',
                      ctaText: 'Learn More',
                      destinationUrl: creatives[0]?.destinationUrl || '',
                      adFormat: (['banner', 'card', 'interstitial', 'video'] as const)[creatives.length % 4],
                      mediaFormat: 'image',
                    },
                  ]);
                  setActiveCreativeIdx(creatives.length);
                }}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--badge-bg)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--color-crimson)',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                + Add Another Creative Format
              </button>
            </div>

            {/* Creative Tabs */}
            {creatives.length > 1 && (
              <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
                {creatives.map((c, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveCreativeIdx(idx)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: activeCreativeIdx === idx ? 'var(--color-crimson)' : 'var(--bg-surface)',
                      color: activeCreativeIdx === idx ? '#FFFFFF' : 'var(--text-secondary)',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Ad #{idx + 1} ({c.adFormat.toUpperCase()})
                  </button>
                ))}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
              {/* Form Controls */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Display Format
                  </label>
                  <select
                    value={activeCreative.adFormat}
                    onChange={(e: any) => {
                      const updated = [...creatives];
                      updated[activeCreativeIdx].adFormat = e.target.value;
                      setCreatives(updated);
                    }}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-surface)',
                      fontSize: '13px',
                      color: 'var(--text-primary)',
                    }}
                  >
                    <option value="card">Card / Feed Unit (300x250 standard)</option>
                    <option value="banner">Leaderboard Banner (728x90)</option>
                    <option value="video">In-Feed Video Unit</option>
                    <option value="interstitial">Full Screen / Interstitial</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Headline <span style={{ color: 'var(--color-crimson)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={activeCreative.headline}
                    onChange={(e) => {
                      const updated = [...creatives];
                      updated[activeCreativeIdx].headline = e.target.value;
                      setCreatives(updated);
                    }}
                    placeholder="e.g. Build Fast with Modern Tools"
                    style={{
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-surface)',
                      fontSize: '13px',
                      color: 'var(--text-primary)',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Body / Sub-headline
                  </label>
                  <textarea
                    rows={2}
                    value={activeCreative.bodyText || ''}
                    onChange={(e) => {
                      const updated = [...creatives];
                      updated[activeCreativeIdx].bodyText = e.target.value;
                      setCreatives(updated);
                    }}
                    placeholder="Describe your value proposition clearly and respectfully..."
                    style={{
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-surface)',
                      fontSize: '13px',
                      color: 'var(--text-primary)',
                      resize: 'none',
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      Call to Action (CTA)
                    </label>
                    <input
                      type="text"
                      value={activeCreative.ctaText}
                      onChange={(e) => {
                        const updated = [...creatives];
                        updated[activeCreativeIdx].ctaText = e.target.value;
                        setCreatives(updated);
                      }}
                      placeholder="e.g. Learn More"
                      style={{
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-subtle)',
                        backgroundColor: 'var(--bg-surface)',
                        fontSize: '13px',
                        color: 'var(--text-primary)',
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      Destination URL <span style={{ color: 'var(--color-crimson)' }}>*</span>
                    </label>
                    <input
                      type="url"
                      required
                      value={activeCreative.destinationUrl}
                      onChange={(e) => {
                        const updated = [...creatives];
                        updated[activeCreativeIdx].destinationUrl = e.target.value;
                        setCreatives(updated);
                      }}
                      placeholder="https://yoursite.com/landing"
                      style={{
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-subtle)',
                        backgroundColor: 'var(--bg-surface)',
                        fontSize: '13px',
                        color: 'var(--text-primary)',
                      }}
                    />
                  </div>
                </div>

                {/* Media Upload Area */}
                <div
                  style={{
                    padding: '16px',
                    borderRadius: '10px',
                    border: '1px dashed var(--border-subtle)',
                    backgroundColor: 'var(--bg-surface)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {activeCreative.adFormat === 'video' ? 'Video Asset (MP4/WebM ≤ 20MB)' : 'Image Asset (JPG/PNG/WebP ≤ 750KB)'}
                    </span>
                    {uploadingMedia && <Loader2 style={{ width: 14, height: 14, animation: 'spin 1s linear infinite', color: 'var(--color-crimson)' }} />}
                  </div>
                  <input
                    type="file"
                    accept={activeCreative.adFormat === 'video' ? 'video/mp4,video/webm' : 'image/jpeg,image/png,image/webp,image/avif'}
                    onChange={(e) => handleMediaUpload(e, activeCreative.adFormat === 'video')}
                    style={{ fontSize: '12px', color: 'var(--text-secondary)' }}
                  />
                  {(activeCreative.imageUrl || activeCreative.videoUrl) && (
                    <div style={{ fontSize: '11px', color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 style={{ width: 12, height: 12 }} /> Media asset ready: {(activeCreative.imageUrl || activeCreative.videoUrl)?.substring(0, 45)}...
                    </div>
                  )}
                </div>
              </div>

              {/* Live Preview Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
                  Interactive Viewer Preview ({activeCreative.adFormat.toUpperCase()})
                </span>

                <div
                  style={{
                    padding: '20px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--bg-elevated)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    minHeight: '260px',
                    justifyContent: 'center',
                  }}
                >
                  {/* Card Simulation */}
                  <div
                    style={{
                      borderRadius: '10px',
                      overflow: 'hidden',
                      backgroundColor: 'var(--bg-page)',
                      border: '1px solid var(--border-subtle)',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    {activeCreative.imageUrl ? (
                      <img
                        src={activeCreative.imageUrl}
                        alt="Ad preview"
                        style={{ width: '100%', height: '140px', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '120px', backgroundColor: 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
                        Visual Asset Placeholder
                      </div>
                    )}
                    <div style={{ padding: '14px' }}>
                      <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-crimson)', textTransform: 'uppercase', marginBottom: '4px' }}>
                        Promoted
                      </div>
                      <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px' }}>
                        {activeCreative.headline || 'Your compelling headline appears here'}
                      </h4>
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '0 0 12px', lineHeight: 1.4 }}>
                        {activeCreative.bodyText || 'Clear, honest description of the product or service you are sharing with viewers.'}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          {activeCreative.destinationUrl ? new URL(activeCreative.destinationUrl.startsWith('http') ? activeCreative.destinationUrl : `https://${activeCreative.destinationUrl}`).hostname : 'yoursite.com'}
                        </span>
                        <span
                          style={{
                            padding: '4px 10px',
                            borderRadius: '6px',
                            backgroundColor: 'var(--color-crimson)',
                            color: '#FFFFFF',
                            fontSize: '11px',
                            fontWeight: 700,
                          }}
                        >
                          {activeCreative.ctaText || 'Learn More'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: TARGETING & AUDIENCE */}
        {currentStep === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px' }}>
                Step 3: Audience &amp; Placement Guardrails
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                Define where your ad can appear. Zero surveillance cookies; we match strictly on publisher contextual signals and geography.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Target Geographies
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {[
                    { code: 'NG', name: 'Nigeria' },
                    { code: 'GH', name: 'Ghana' },
                    { code: 'KE', name: 'Kenya' },
                    { code: 'ZA', name: 'South Africa' },
                    { code: 'US', name: 'United States' },
                    { code: 'GB', name: 'United Kingdom' },
                  ].map((geo) => {
                    const isSelected = targetCountries.includes(geo.code);
                    return (
                      <button
                        key={geo.code}
                        type="button"
                        onClick={() => {
                          if (isSelected) setTargetCountries(targetCountries.filter((c) => c !== geo.code));
                          else setTargetCountries([...targetCountries, geo.code]);
                        }}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          border: '1px solid',
                          borderColor: isSelected ? 'var(--color-crimson)' : 'var(--border-subtle)',
                          backgroundColor: isSelected ? 'var(--badge-bg)' : 'var(--bg-surface)',
                          color: isSelected ? 'var(--color-crimson)' : 'var(--text-secondary)',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        {isSelected && '✓ '} {geo.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Device Categories
                </label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {[
                    { id: 'mobile', label: 'Mobile Viewports' },
                    { id: 'desktop', label: 'Desktop & Laptops' },
                  ].map((dev) => {
                    const isSelected = targetDevices.includes(dev.id);
                    return (
                      <button
                        key={dev.id}
                        type="button"
                        onClick={() => {
                          if (isSelected) setTargetDevices(targetDevices.filter((d) => d !== dev.id));
                          else setTargetDevices([...targetDevices, dev.id]);
                        }}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '8px',
                          border: '1px solid',
                          borderColor: isSelected ? 'var(--color-crimson)' : 'var(--border-subtle)',
                          backgroundColor: isSelected ? 'var(--badge-bg)' : 'var(--bg-surface)',
                          color: isSelected ? 'var(--color-crimson)' : 'var(--text-secondary)',
                          fontSize: '13px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        {isSelected && '✓ '} {dev.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Daily Human Frequency Cap
                </label>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-crimson)' }}>
                  {frequencyCap} impressions per person / day
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={20}
                value={frequencyCap}
                onChange={(e) => setFrequencyCap(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--color-crimson)' }}
              />
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '6px 0 0' }}>
                Prevents ad fatigue and respects viewer attention by ensuring no individual sees your ad more than {frequencyCap} times in a 24-hour cycle.
              </p>
            </div>
          </div>
        )}

        {/* STEP 4: BUDGET & PRICING */}
        {currentStep === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px' }}>
                Step 4: Transparent Budget &amp; Economics
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                Every dollar is accounted for. Funds are placed into escrow and billed only upon verified MRC viewable impressions or genuine clicks.
              </p>
            </div>

            {/* Pricing Model Selector */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div
                onClick={() => setPricingModel('cpm')}
                style={{
                  padding: '18px',
                  borderRadius: '12px',
                  border: '2px solid',
                  borderColor: pricingModel === 'cpm' ? 'var(--color-crimson)' : 'var(--border-subtle)',
                  backgroundColor: pricingModel === 'cpm' ? 'var(--badge-bg)' : 'var(--bg-surface)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>CPM (Per 1,000 Views)</span>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-crimson)' }}>Floor: $0.50</span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
                  Billed only when at least 50% of your ad is in the active viewport for $\ge$ 1 continuous second.
                </p>
              </div>

              <div
                onClick={() => setPricingModel('cpc')}
                style={{
                  padding: '18px',
                  borderRadius: '12px',
                  border: '2px solid',
                  borderColor: pricingModel === 'cpc' ? 'var(--color-crimson)' : 'var(--border-subtle)',
                  backgroundColor: pricingModel === 'cpc' ? 'var(--badge-bg)' : 'var(--bg-surface)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>CPC (Per Click)</span>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-crimson)' }}>Floor: $0.10</span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
                  Billed strictly when an interested human visitor clicks through to your landing page.
                </p>
              </div>
            </div>

            {/* Budget & Bid Inputs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Total Campaign Budget ($ USD)
                </label>
                <input
                  type="number"
                  min={5}
                  step={1}
                  value={budgetUsd}
                  onChange={(e) => setBudgetUsd(Number(e.target.value))}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-surface)',
                    fontSize: '15px',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                  }}
                />
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Minimum $5.00 USD</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Daily Spending Target ($ USD)
                </label>
                <input
                  type="number"
                  min={1}
                  step={1}
                  value={dailyBudgetUsd}
                  onChange={(e) => setDailyBudgetUsd(Number(e.target.value))}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-surface)',
                    fontSize: '15px',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                  }}
                />
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Paces delivery across hours</span>
              </div>

              {pricingModel === 'cpm' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    CPM Bid (Cents per 1,000 views)
                  </label>
                  <input
                    type="number"
                    min={50}
                    step={5}
                    value={cpmBidCents}
                    onChange={(e) => setCpmBidCents(Number(e.target.value))}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-surface)',
                      fontSize: '15px',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                    }}
                  />
                  <span style={{ fontSize: '11px', color: 'var(--color-crimson)', fontWeight: 600 }}>
                    Equals ${(cpmBidCents / 100).toFixed(2)} USD per 1,000 views
                  </span>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    CPC Bid (Cents per click)
                  </label>
                  <input
                    type="number"
                    min={10}
                    step={1}
                    value={cpcBidCents}
                    onChange={(e) => setCpcBidCents(Number(e.target.value))}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-surface)',
                      fontSize: '15px',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                    }}
                  />
                  <span style={{ fontSize: '11px', color: 'var(--color-crimson)', fontWeight: 600 }}>
                    Equals ${(cpcBidCents / 100).toFixed(2)} USD per verified click
                  </span>
                </div>
              )}
            </div>

            {/* Projected Reach Card */}
            <div
              style={{
                padding: '16px 20px',
                borderRadius: '12px',
                backgroundColor: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-success)', textTransform: 'uppercase' }}>
                  Conservative Estimated Delivery
                </span>
                <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                  {pricingModel === 'cpm'
                    ? `~${Math.floor((budgetUsd / (cpmBidCents / 100)) * 1000).toLocaleString()} Verified Viewable Impressions`
                    : `~${Math.floor(budgetUsd / (cpcBidCents / 100)).toLocaleString()} Direct Click Visits`}
                </div>
              </div>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Protected by 72-Hour Anti-Fraud Hold
              </span>
            </div>
          </div>
        )}

        {/* STEP 5: REVIEW & SUBMIT */}
        {currentStep === 5 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px' }}>
                Step 5: Review &amp; Submit for Moderation
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                Please review your campaign details. Once submitted, our dual-reviewer team audits your creative within 2-4 business hours.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              <div style={{ padding: '18px', borderRadius: '12px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Campaign</span>
                <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>{title}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Category: {category}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Channels: {channels.join(', ')}</div>
              </div>

              <div style={{ padding: '18px', borderRadius: '12px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Financial Terms</span>
                <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>${budgetUsd.toFixed(2)} USD Escrow</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Model: {pricingModel.toUpperCase()}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Rate: {pricingModel === 'cpm' ? `$${(cpmBidCents / 100).toFixed(2)} / 1,000 views` : `$${(cpcBidCents / 100).toFixed(2)} / click`}
                </div>
              </div>

              <div style={{ padding: '18px', borderRadius: '12px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Creatives</span>
                <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>{creatives.length} Format(s)</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Primary: {creatives[0]?.headline}</div>
                <div style={{ fontSize: '12px', color: 'var(--color-crimson)', wordBreak: 'break-all' }}>
                  {creatives[0]?.destinationUrl}
                </div>
              </div>
            </div>

            <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'rgba(212,20,58,0.06)', border: '1px solid rgba(212,20,58,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <ShieldCheck style={{ width: 16, height: 16, color: 'var(--color-crimson)' }} />
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>Our Ethical Commitment to You</span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                Your budget remains in secure escrow and is deducted only upon verified human delivery. If you ever choose to cancel, all remaining unconsumed funds return to your wallet immediately without penalty.
              </p>
            </div>
          </div>
        )}

        {/* Wizard Footer Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '32px', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)' }}>
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              disabled={isSubmitting}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '10px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <ArrowLeft style={{ width: 16, height: 16 }} /> Back
            </button>
          ) : (
            <div />
          )}

          {currentStep < 5 ? (
            <button
              type="button"
              onClick={handleNext}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 24px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: 'var(--color-crimson)',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: 'var(--shadow-crimson)',
              }}
            >
              Continue <ArrowRight style={{ width: 16, height: 16 }} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleLaunchCampaign}
              disabled={isSubmitting}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 28px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: 'var(--color-crimson)',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: 700,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                boxShadow: 'var(--shadow-crimson)',
              }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} /> Submitting for Review...
                </>
              ) : (
                <>
                  <Sparkles style={{ width: 16, height: 16 }} /> Submit Campaign for Review
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
