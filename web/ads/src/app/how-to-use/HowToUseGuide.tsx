'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  Expand,
  Layers,
  Pause,
  Play,
  ShieldCheck,
  X,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { ecosystemOrigin } from '../../../../../shared/ui/origins';

export interface GuideStep {
  stepNumber: number;
  title: string;
  summary: string;
  checklist: readonly string[];
  screenshotSrc: string;
  clipSrc: string;
  imageAlt: string;
  caption: string;
  actionLabel: string;
  actionHref: string;
  external?: boolean;
}

export const ADVERTISER_GUIDE_STEPS: readonly GuideStep[] = [
  {
    stepNumber: 1,
    title: 'Fund Your Advertising Wallet',
    summary:
      'Open Billing & Wallet inside Ads, click Fund Wallet, and deposit at least $5.00 USD via Paystack.',
    checklist: [
      'Open Billing & Wallet from the Ads Console sidebar.',
      'Click Fund Wallet and complete Paystack checkout.',
      'Confirm Available Wallet Balance.',
    ],
    screenshotSrc: '/guides/advertiser/01-wallet-funding.png',
    clipSrc: '/guides/advertiser/01-wallet-funding.webp',
    imageAlt:
      'CrimFig Ads Billing & Wallet screen showing Available Wallet Balance, Fund Wallet button, and Billing Transaction History',
    caption: 'Step 1 — Click Fund Wallet in Billing & Wallet.',
    actionLabel: 'Open Billing & Wallet',
    actionHref: '/billing',
  },
  {
    stepNumber: 2,
    title: 'Create Your Ad Campaign & Ad Stacks',
    summary:
      'Use the 5-step wizard (Details, Ad stacks, Targeting, Budget, Review) to set CPM/CPC pricing and budget.',
    checklist: [
      'Fill in Details and build your Ad stacks.',
      'Set Targeting, CPM/CPC model, and Budget ($5.00+ USD).',
      'Save Draft or Submit for review.',
    ],
    screenshotSrc: '/guides/advertiser/02-create-campaign.png',
    clipSrc: '/guides/advertiser/02-create-campaign.webp',
    imageAlt:
      'CrimFig Ads 5-step Create campaign wizard showing Details, Ad stacks, Targeting, Budget, and Review steps with CPM and CPC cards',
    caption: 'Step 2 — Configure campaign Details, Ad stacks, and Budget.',
    actionLabel: 'Create Campaign',
    actionHref: '/campaigns/new',
  },
  {
    stepNumber: 3,
    title: 'Add an Advert & Submit for Review',
    summary:
      'Open Add an Advert, upload your image creative, pick Dynamic Ad sizing, and submit for Review 1 and Review 2.',
    checklist: [
      'Select Image Ads — Available.',
      'Upload creative, choose Dynamic Ad, and set Destination URL.',
      'Click Submit new Advert for review (Review 1 and Review 2).',
    ],
    screenshotSrc: '/guides/advertiser/03-creatives-preview.png',
    clipSrc: '/guides/advertiser/03-creatives-preview.webp',
    imageAlt:
      'CrimFig Ads Add an Advert screen showing Image Ads Available, uploaded creative preview, Ad size policy, and Submit new Advert for review button',
    caption: 'Step 3 — Upload creative and Submit new Advert for review.',
    actionLabel: 'View Campaigns',
    actionHref: '/campaigns',
  },
  {
    stepNumber: 4,
    title: 'Monitor Reports & Audience Ratings',
    summary:
      'Track Event spend, Billable impressions, Billed clicks, and audience ratings (Love, Like, Dislike) in Advertising report.',
    checklist: [
      'Check Event spend, impressions, and clicks.',
      'Review audience ratings (Love, Like, Dislike).',
      'Switch between Overview, Daily Performance, and Breakdown.',
    ],
    screenshotSrc: '/guides/advertiser/04-performance-ratings.png',
    clipSrc: '/guides/advertiser/04-performance-ratings.webp',
    imageAlt:
      'CrimFig Advertising report dashboard displaying Event spend, Billable impressions, Billed clicks, and Audience Feedback Ratings',
    caption: 'Step 4 — Track Advertising report metrics and ratings.',
    actionLabel: 'View Reports',
    actionHref: '/reports',
  },
];

export const PROMOTER_GUIDE_STEPS: readonly GuideStep[] = [
  {
    stepNumber: 1,
    title: 'Register & Verify Your Website',
    summary:
      'Open Websites & Ad Slots in Promoter Hub, click + Add Website, and verify via HTML Meta Tag or DNS TXT.',
    checklist: [
      'Open Websites & Ad Slots in Promoter Hub.',
      'Click + Add Website and enter your domain.',
      'Verify ownership with HTML Meta Tag or DNS TXT.',
    ],
    screenshotSrc: '/guides/promoter/01-add-verify-site.png',
    clipSrc: '/guides/promoter/01-add-verify-site.webp',
    imageAlt:
      'CrimFig Promoter Hub Registered Websites & Ad Slots table showing + Add Website button, Verified Domain, APPROVED policy, and HTML/DNS TXT checks',
    caption: 'Step 1 — + Add Website and verify ownership.',
    actionLabel: 'Open Websites',
    actionHref: '/promoter/websites',
  },
  {
    stepNumber: 2,
    title: 'Create Responsive Ad Slots',
    summary:
      'Open your verified website, name your placement, choose Dynamic Ad Slot, and click Create ad slot.',
    checklist: [
      'Enter a Slot name and choose Inventory mode.',
      'Keep Dynamic Ad Slot so ads fit your container.',
      'Click Create ad slot.',
    ],
    screenshotSrc: '/guides/promoter/02-create-ad-slot.png',
    clipSrc: '/guides/promoter/02-create-ad-slot.webp',
    imageAlt:
      'CrimFig Promoter Create ad slot form displaying Slot name, Inventory mode, Dynamic Ad Slot option, and Create ad slot button',
    caption: 'Step 2 — Choose Dynamic Ad Slot and Create ad slot.',
    actionLabel: 'Manage Ad Slots',
    actionHref: '/promoter/websites',
  },
  {
    stepNumber: 3,
    title: 'Copy Installation Snippet & Verify',
    summary:
      'Open Installation instructions, copy the HTML or React / Next.js snippet, and confirm Installation: verified.',
    checklist: [
      'Pick HTML or React / Next.js tab.',
      'Copy Page SDK and Slot markup into your site.',
      'Confirm Installation: verified.',
    ],
    screenshotSrc: '/guides/promoter/03-install-embed.png',
    clipSrc: '/guides/promoter/03-install-embed.webp',
    imageAlt:
      'CrimFig Promoter Installation instructions showing HTML and React / Next.js tabs, Page SDK and Slot markup Copy buttons, and Installation verified badge',
    caption: 'Step 3 — Copy snippet and verify installation.',
    actionLabel: 'Open Setup Guide',
    actionHref: '/promoter/ad-network/get-started',
  },
  {
    stepNumber: 4,
    title: 'Track 55% Share Earnings & Withdraw',
    summary:
      'Earn 55% of eligible paid ad revenue. Track 72-hour traffic-quality clearance in Earnings report, then withdraw in Billing.',
    checklist: [
      'Check Confirmed and Pending (72-hour traffic-quality review window) earnings.',
      'Open Withdraw to Bank Account in Billing.',
      'Click Review fees and net payout.',
    ],
    screenshotSrc: '/guides/promoter/04-earnings-payouts.png',
    clipSrc: '/guides/promoter/04-earnings-payouts.webp',
    imageAlt:
      'CrimFig Promoter Earnings report and Withdraw to Bank Account form showing Confirmed earnings, Payout quote breakdown, and Review fees and net payout button',
    caption: 'Step 4 — Review Earnings report and withdraw.',
    actionLabel: 'View Earnings',
    actionHref: '/reports?workspace=promoter',
  },
];

interface GuideMediaFrameProps {
  step: GuideStep;
  reducedMotion: boolean;
  onExpand: (step: GuideStep) => void;
}

function GuideMediaFrame({ step, reducedMotion, onExpand }: GuideMediaFrameProps) {
  const [mode, setMode] = useState<'clip' | 'still'>(reducedMotion ? 'still' : 'clip');

  useEffect(() => {
    setMode(reducedMotion ? 'still' : 'clip');
  }, [reducedMotion]);

  const activeSrc = mode === 'clip' ? step.clipSrc : step.screenshotSrc;

  return (
    <figure
      style={{
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        minWidth: 0,
      }}
    >
      <div
        style={{
          position: 'relative',
          borderRadius: '0.875rem',
          border: '1px solid var(--border-subtle)',
          background: 'var(--bg-page)',
          overflow: 'hidden',
        }}
      >
        <img
          src={activeSrc}
          alt={step.imageAlt}
          loading="lazy"
          style={{
            display: 'block',
            width: '100%',
            height: 'auto',
            aspectRatio: '16 / 10',
            objectFit: 'cover',
          }}
        />
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem',
        }}
      >
        <figcaption
          style={{
            fontSize: '0.8125rem',
            color: 'var(--text-muted)',
            lineHeight: 1.4,
            flex: '1 1 12rem',
          }}
        >
          {step.caption}
        </figcaption>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', flexShrink: 0 }}>
          <Button
            type="button"
            variant={mode === 'clip' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setMode(mode === 'clip' ? 'still' : 'clip')}
            aria-label={mode === 'clip' ? `Pause clip for step ${step.stepNumber}` : `Play clip for step ${step.stepNumber}`}
            title={mode === 'clip' ? 'Pause clip' : 'Play clip'}
          >
            {mode === 'clip' ? (
              <Pause size={15} aria-hidden="true" />
            ) : (
              <Play size={15} aria-hidden="true" />
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => onExpand(step)}
            aria-label={`Zoom media for ${step.title}`}
            title="Zoom"
          >
            <Expand size={15} aria-hidden="true" />
          </Button>
        </div>
      </div>
    </figure>
  );
}

export function HowToUseGuide() {
  const [roleTab, setRoleTab] = useState<'advertiser' | 'promoter'>('advertiser');
  const [reducedMotion, setReducedMotion] = useState(false);
  const [expandedStep, setExpandedStep] = useState<GuideStep | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(media.matches);
    const onChange = (event: MediaQueryListEvent) => setReducedMotion(event.matches);
    media.addEventListener?.('change', onChange);
    return () => media.removeEventListener?.('change', onChange);
  }, []);

  const billingHref = ecosystemOrigin(
    'billing',
    process.env.NEXT_PUBLIC_BILLING_WEB_URL,
    process.env.NEXT_PUBLIC_AUTH_WEB_URL,
  );

  const renderSteps = (steps: readonly GuideStep[], trackName: 'Advertiser' | 'Promoter') => (
    <div style={{ display: 'grid', gap: '1.5rem', marginTop: '1.5rem' }}>
      {steps.map((step) => (
        <article
          key={`${trackName}-${step.stepNumber}`}
          style={{
            padding: 'clamp(1.25rem, 2.5vw, 1.75rem)',
            borderRadius: '1rem',
            border: '1px solid var(--border-subtle)',
            background: 'var(--bg-surface)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 19rem), 1fr))',
            gap: '1.5rem',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <Badge variant="default">
                {trackName} Step {step.stepNumber}
              </Badge>
            </div>
            <h2
              style={{
                margin: 0,
                fontSize: 'clamp(1.125rem, 2vw, 1.375rem)',
                fontWeight: 700,
                lineHeight: 1.3,
                color: 'var(--text-primary)',
              }}
            >
              {step.title}
            </h2>
            <p
              style={{
                margin: 0,
                fontSize: '0.9375rem',
                lineHeight: 1.65,
                color: 'var(--text-secondary)',
              }}
            >
              {step.summary}
            </p>
            <ul
              style={{
                margin: 0,
                padding: 0,
                listStyle: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              {step.checklist.map((item) => (
                <li
                  key={item}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.5rem',
                    fontSize: '0.875rem',
                    lineHeight: 1.5,
                    color: 'var(--text-primary)',
                  }}
                >
                  <CheckCircle2
                    size={16}
                    aria-hidden="true"
                    style={{ color: 'var(--color-crimson)', flexShrink: 0, marginTop: '0.1875rem' }}
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div style={{ paddingTop: '0.25rem' }}>
              <Link
                href={step.actionHref === '/billing' ? billingHref : step.actionHref}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  minHeight: '44px',
                  padding: '0 1rem',
                  borderRadius: '0.5rem',
                  background: 'var(--color-crimson)',
                  color: '#FFFFFF',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                <span>{step.actionLabel}</span>
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </div>

          <GuideMediaFrame
            step={step}
            reducedMotion={reducedMotion}
            onExpand={(selected) => setExpandedStep(selected)}
          />
        </article>
      ))}
    </div>
  );

  return (
    <main className="cf-marketing-section">
      <div className="cf-marketing-frame" style={{ maxWidth: '68rem' }}>
        <div className="cf-marketing-copy" style={{ textAlign: 'left', maxWidth: 'none' }}>
          <Badge variant="default">Visual Walkthrough</Badge>
          <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', lineHeight: 1.2, marginTop: '0.75rem' }}>
            How to Use CrimFig Ads
          </h1>
          <p style={{ marginInline: 0, maxWidth: '48rem' }}>
            Use CrimFig Ads as an <strong>Advertiser</strong> to upload and run paid adverts, or as a{' '}
            <strong>Promoter</strong> to place ad slots on your website or app so approved adverts can appear there.{' '}
            <strong>Advertisers pay; Promoters earn.</strong>
          </p>
        </div>

        <section
          aria-label="How CrimFig Ads works for Advertisers and Promoters"
          style={{
            marginTop: '1.25rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 17rem), 1fr))',
            gap: '0.875rem',
          }}
        >
          <div
            style={{
              padding: '1rem 1.125rem',
              borderRadius: '0.875rem',
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-surface)',
            }}
          >
            <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
              Advertisers pay
            </div>
            <p style={{ margin: 0, fontSize: '0.875rem', lineHeight: 1.55, color: 'var(--text-secondary)' }}>
              Fund your wallet and upload paid adverts to promote your business across verified CrimFig spaces.
            </p>
          </div>
          <div
            style={{
              padding: '1rem 1.125rem',
              borderRadius: '0.875rem',
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-surface)',
            }}
          >
            <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
              Promoters earn
            </div>
            <p style={{ margin: 0, fontSize: '0.875rem', lineHeight: 1.55, color: 'var(--text-secondary)' }}>
              Place ad slots on your website or app so adverts can be displayed on those spaces and earn 55% of eligible revenue.
            </p>
          </div>
        </section>

        <div style={{ marginTop: '1.75rem' }}>
          <Tabs
            value={roleTab}
            onValueChange={(value) => setRoleTab(value === 'promoter' ? 'promoter' : 'advertiser')}
          >
            <TabsList aria-label="Choose guide track">
              <TabsTrigger value="advertiser">
                <Layers size={15} aria-hidden="true" style={{ marginRight: '0.375rem' }} />
                For Advertisers
              </TabsTrigger>
              <TabsTrigger value="promoter">
                <ShieldCheck size={15} aria-hidden="true" style={{ marginRight: '0.375rem' }} />
                For Promoters
              </TabsTrigger>
            </TabsList>

            <TabsContent value="advertiser">
              {renderSteps(ADVERTISER_GUIDE_STEPS, 'Advertiser')}
            </TabsContent>

            <TabsContent value="promoter">
              {renderSteps(PROMOTER_GUIDE_STEPS, 'Promoter')}
            </TabsContent>
          </Tabs>
        </div>

        <section
          aria-label="Additional resources"
          style={{
            marginTop: '2.5rem',
            padding: '1.25rem 1.5rem',
            borderRadius: '0.875rem',
            border: '1px solid var(--border-subtle)',
            background: 'var(--bg-surface)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <p style={{ margin: 0, fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Have questions about pricing, the 55% promoter share, or verification? Check our{' '}
            <Link href="/faq" style={{ color: 'var(--color-crimson)', fontWeight: 600, textDecoration: 'none' }}>
              FAQs
            </Link>{' '}
            or open{' '}
            <Link href="/support" style={{ color: 'var(--color-crimson)', fontWeight: 600, textDecoration: 'none' }}>
              Help &amp; Support
            </Link>
            .
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            <Link
              href="/faq"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                minHeight: '44px',
                padding: '0 1rem',
                borderRadius: '0.5rem',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                fontWeight: 600,
                fontSize: '0.875rem',
                textDecoration: 'none',
              }}
            >
              Read FAQs
            </Link>
            <Link
              href="/support"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                minHeight: '44px',
                padding: '0 1rem',
                borderRadius: '0.5rem',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                fontWeight: 600,
                fontSize: '0.875rem',
                textDecoration: 'none',
              }}
            >
              Open Help &amp; Support
            </Link>
          </div>
        </section>
      </div>

      {expandedStep && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={expandedStep.title}
          onClick={() => setExpandedStep(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1400,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            backgroundColor: 'rgba(15, 23, 42, 0.72)',
            backdropFilter: 'blur(4px)',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 'min(94vw, 64rem)',
              maxHeight: '92vh',
              overflowY: 'auto',
              backgroundColor: 'var(--bg-page)',
              borderRadius: '1rem',
              border: '1px solid var(--border-subtle)',
              padding: '1.25rem',
              boxShadow: '0 24px 48px rgba(15, 23, 42, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.875rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {expandedStep.title}
                </h3>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  {expandedStep.caption}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setExpandedStep(null)}
                aria-label="Close zoomed preview"
              >
                <X size={16} aria-hidden="true" />
              </Button>
            </div>
            <img
              src={reducedMotion ? expandedStep.screenshotSrc : expandedStep.clipSrc}
              alt={expandedStep.imageAlt}
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: '0.75rem',
                border: '1px solid var(--border-subtle)',
              }}
            />
          </div>
        </div>
      )}
    </main>
  );
}
