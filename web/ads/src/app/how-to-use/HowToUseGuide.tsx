'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  Expand,
  Film,
  Image as ImageIcon,
  Layers,
  ShieldCheck,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
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
      'Sign in with CrimFig Single Sign-On, open Billing & Wallet, and fund your USD balance via Paystack. Every campaign requires at least $5 USD available in wallet balance before launch.',
    checklist: [
      'Open Billing & Wallet from the Ads sidebar or top navigation.',
      'Choose a funding amount ($5 USD minimum campaign budget) and complete checkout.',
      'Confirm your updated Available Wallet Balance before creating your campaign.',
    ],
    screenshotSrc: '/guides/advertiser/01-wallet-funding.png',
    clipSrc: '/guides/advertiser/01-wallet-funding.webp',
    imageAlt:
      'CrimFig Billing and Wallet funding screen showing available USD balance, Add Funds button, and recent Paystack deposit',
    caption: 'Step 1 — Fund your USD wallet and verify available balance.',
    actionLabel: 'Open Billing & Wallet',
    actionHref: '/billing',
  },
  {
    stepNumber: 2,
    title: 'Create Your Ad Campaign',
    summary:
      'Set up a campaign inside Campaign Studio by choosing your pricing model (CPM for viewable impressions or CPC for qualified clicks), setting your target destination URL, and assigning your budget.',
    checklist: [
      'Pick CPM (per 1,000 viewable impressions) or CPC (per valid click).',
      'Enter your campaign title, destination website link, and daily/total budget.',
      'Save and continue to creative setup.',
    ],
    screenshotSrc: '/guides/advertiser/02-create-campaign.png',
    clipSrc: '/guides/advertiser/02-create-campaign.webp',
    imageAlt:
      'CrimFig Ads Campaign Studio form with CPM and CPC pricing options, budget fields, and destination URL',
    caption: 'Step 2 — Configure pricing model, destination URL, and campaign budget.',
    actionLabel: 'Create Campaign',
    actionHref: '/campaigns/new',
  },
  {
    stepNumber: 3,
    title: 'Upload Creatives & Preview Slots',
    summary:
      'Upload clean banner or card creatives with clear call-to-action copy, inspect how the advert appears inside real slot layouts, and submit it for policy review.',
    checklist: [
      'Upload high-clarity images and keep copy accurate and compliant with Ad Policy.',
      'Check desktop and mobile placement previews before clicking Submit.',
      'Track review approval status right inside your Campaigns list.',
    ],
    screenshotSrc: '/guides/advertiser/03-creatives-preview.png',
    clipSrc: '/guides/advertiser/03-creatives-preview.webp',
    imageAlt:
      'CrimFig Ads Creative Upload and Preview showing ad artwork, destination preview, and placement check',
    caption: 'Step 3 — Upload creatives and preview how placements render for visitors.',
    actionLabel: 'View Campaigns',
    actionHref: '/campaigns',
  },
  {
    stepNumber: 4,
    title: 'Monitor Delivery & Audience Ratings',
    summary:
      'Once live, watch verified impressions, valid clicks, remaining escrow spend, and transparent visitor ratings (Love, Like, Dislike) collected from the light corner feedback control.',
    checklist: [
      'Track verified impressions and click-through performance in real time.',
      'Review visitor sentiment badges (Love, Like, Dislike) on each advert.',
      'Pause, adjust budgets, or refresh creatives anytime from Reports.',
    ],
    screenshotSrc: '/guides/advertiser/04-performance-ratings.png',
    clipSrc: '/guides/advertiser/04-performance-ratings.webp',
    imageAlt:
      'CrimFig Advertiser Performance and Ratings dashboard displaying verified impressions, clicks, and visitor feedback breakdown',
    caption: 'Step 4 — Monitor verified delivery, spend, and live audience feedback.',
    actionLabel: 'View Reports',
    actionHref: '/reports',
  },
];

export const PROMOTER_GUIDE_STEPS: readonly GuideStep[] = [
  {
    stepNumber: 1,
    title: 'Register & Verify Your Website',
    summary:
      'Switch to Promoter Mode inside the Ads workspace, register your website domain, and prove ownership using a DNS TXT record, HTML meta tag, or hosted verification file.',
    checklist: [
      'Switch workspaces cleanly to Promoter Mode from the sidebar switcher.',
      'Enter your domain (for example, yoursite.com) without invalid protocols.',
      'Complete DNS TXT, HTML meta tag, or file verification so slots can go live.',
    ],
    screenshotSrc: '/guides/promoter/01-add-verify-site.png',
    clipSrc: '/guides/promoter/01-add-verify-site.webp',
    imageAlt:
      'CrimFig Promoter Websites screen showing registered domain and verified ownership badge',
    caption: 'Step 1 — Register your website and pass domain verification.',
    actionLabel: 'Open Websites',
    actionHref: '/promoter/websites',
  },
  {
    stepNumber: 2,
    title: 'Create Responsive Ad Slots',
    summary:
      'Create named ad slots tailored to your website layout (such as top leaderboard, article rectangle, or mobile sticky banner) and configure placement status.',
    checklist: [
      'Choose placement dimensions that fit cleanly into your article or header layout.',
      'Avoid placing slots in deceptive positions or crowded popups.',
      'Activate your slot to generate its unique placement key.',
    ],
    screenshotSrc: '/guides/promoter/02-create-ad-slot.png',
    clipSrc: '/guides/promoter/02-create-ad-slot.webp',
    imageAlt:
      'CrimFig Promoter Ad Slots builder displaying slot presets, sizes, and active status toggles',
    caption: 'Step 2 — Configure ad slot sizes and placement locations.',
    actionLabel: 'Manage Ad Slots',
    actionHref: '/promoter/websites',
  },
  {
    stepNumber: 3,
    title: 'Install Embed Code & Run Live Check',
    summary:
      'Copy your ready-to-paste HTML snippet into your website template, then click Verify Installation so CrimFig confirms the lightweight loader and ad slot are reachable.',
    checklist: [
      'Paste the generated <script> and container tag into your page template.',
      'Click Verify Installation to check live HTTP reachability and slot binding.',
      'Visit AdStation setup anytime for direct sponsorship opportunities.',
    ],
    screenshotSrc: '/guides/promoter/03-install-embed.png',
    clipSrc: '/guides/promoter/03-install-embed.webp',
    imageAlt:
      'CrimFig Promoter Embed Code snippet dialog and live installation verification status check',
    caption: 'Step 3 — Paste your embed snippet and run the instant verification check.',
    actionLabel: 'Open Setup Guide',
    actionHref: '/promoter/ad-network/get-started',
  },
  {
    stepNumber: 4,
    title: 'Track 55% Share Earnings & Withdraw',
    summary:
      'Promoters earn 55% of eligible paid ad revenue generated on verified placements. Earnings clear after a 72-hour traffic-quality review window and can be withdrawn via CrimFig Billing.',
    checklist: [
      'Monitor pending (72-hour clearance) and cleared balances in real time.',
      'Keep traffic authentic — invalid or automated clicks are filtered out.',
      'Request eligible bank payouts from Billing once your balance clears.',
    ],
    screenshotSrc: '/guides/promoter/04-earnings-payouts.png',
    clipSrc: '/guides/promoter/04-earnings-payouts.webp',
    imageAlt:
      'CrimFig Promoter Earnings and Payouts screen showing 55% share revenue, 72-hour clearance status, and Request Payout button',
    caption: 'Step 4 — Review cleared earnings and request verified payouts.',
    actionLabel: 'View Earnings',
    actionHref: '/promoter/reports',
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
            size="sm"
            onClick={() => setMode(mode === 'clip' ? 'still' : 'clip')}
            aria-label={mode === 'clip' ? `Show static screenshot for step ${step.stepNumber}` : `Play screen clip for step ${step.stepNumber}`}
          >
            {mode === 'clip' ? (
              <>
                <ImageIcon size={14} aria-hidden="true" />
                <span>Screenshot</span>
              </>
            ) : (
              <>
                <Film size={14} aria-hidden="true" />
                <span>Play Clip</span>
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onExpand(step)}
            aria-label={`Expand media for ${step.title}`}
          >
            <Expand size={14} aria-hidden="true" />
            <span>Zoom</span>
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

      <Dialog open={expandedStep !== null} onOpenChange={(open) => !open && setExpandedStep(null)}>
        <DialogContent style={{ maxWidth: 'min(92vw, 56rem)' }}>
          {expandedStep && (
            <>
              <DialogHeader>
                <DialogTitle>{expandedStep.title}</DialogTitle>
                <DialogDescription>{expandedStep.caption}</DialogDescription>
              </DialogHeader>
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
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
