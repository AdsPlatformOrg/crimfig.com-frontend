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
      'Sign in with CrimFig Single Sign-On, open Billing & Wallet, and click Fund Wallet inside Wallet Overview to open Deposit to CrimFig Wallet via Paystack. Every campaign requires at least $5.00 USD available in wallet balance before launch.',
    checklist: [
      'Open Billing & Wallet from the Ads Console sidebar.',
      'Click Fund Wallet, enter your USD amount ($5.00 USD minimum), and pay via Paystack.',
      'Confirm Available Funds in Wallet Overview before creating your campaign.',
    ],
    screenshotSrc: '/guides/advertiser/01-wallet-funding.png',
    clipSrc: '/guides/advertiser/01-wallet-funding.webp',
    imageAlt:
      'CrimFig Billing Wallet Overview showing Available Funds, Fund Wallet button, USD/NGN quote rate, and Recent Activity',
    caption: 'Step 1 — Click Fund Wallet in Billing and verify Available Funds.',
    actionLabel: 'Open Billing & Wallet',
    actionHref: '/billing',
  },
  {
    stepNumber: 2,
    title: 'Create Your Ad Campaign & Ad Stacks',
    summary:
      'Walk through the 5-step campaign wizard (1 Details → 2 Ad stacks → 3 Targeting → 4 Budget → 5 Review) to set your category, build Ad stacks, and choose CPM or CPC pricing with Total budget (USD).',
    checklist: [
      'Complete 1 Details (Campaign title, Description, Category) and 2 Ad stacks.',
      'Pick 3 Targeting devices/schedules and 4 Budget (CPM or CPC, minimum $5.00).',
      'Use 5 Review to Save Draft or Submit for review.',
    ],
    screenshotSrc: '/guides/advertiser/02-create-campaign.png',
    clipSrc: '/guides/advertiser/02-create-campaign.webp',
    imageAlt:
      'CrimFig Ads 5-step Create campaign wizard showing Details, Ad stacks, Targeting, Budget, and Review steps with CPM and CPC cards',
    caption: 'Step 2 — Complete Details, Ad stacks, Targeting, Budget, and Review.',
    actionLabel: 'Create Campaign',
    actionHref: '/campaigns/new',
  },
  {
    stepNumber: 3,
    title: 'Add an Advert & Submit for Review',
    summary:
      'Open Add an Advert inside your Ad Stack, select Image Ads — Available, prepare your creative, choose Dynamic Ad or Selected Sizes, enter your Destination URL, and submit for Review 1 and Review 2.',
    checklist: [
      'Select Image Ads — Available (Text Ads and Video Ads are marked Coming Soon).',
      'Upload and prepare your creative, pick Dynamic Ad or Selected Sizes, and set Destination URL.',
      'Click Submit new Advert for review — new adverts need Review 1 and Review 2 before serving.',
    ],
    screenshotSrc: '/guides/advertiser/03-creatives-preview.png',
    clipSrc: '/guides/advertiser/03-creatives-preview.webp',
    imageAlt:
      'CrimFig Ads Add an Advert screen showing Image Ads Available, uploaded creative preview, Ad size policy, and Submit new Advert for review button',
    caption: 'Step 3 — Prepare your image creative and Submit new Advert for review.',
    actionLabel: 'View Campaigns',
    actionHref: '/campaigns',
  },
  {
    stepNumber: 4,
    title: 'Monitor Reports & Audience Ratings',
    summary:
      'Once live, check your Advertising report for Event spend (cash), Bonus credit spend, Billable impressions, Billed clicks, Observed CTR, and transparent visitor ratings (Love, Like, Dislike).',
    checklist: [
      'Track Event spend (cash), Billable impressions, and Billed clicks in Advertising report.',
      'Review visitor sentiment badges (Love, Like, Dislike) collected on your adverts.',
      'Switch between Overview, Daily Performance, and Campaign & Ad Breakdown views.',
    ],
    screenshotSrc: '/guides/advertiser/04-performance-ratings.png',
    clipSrc: '/guides/advertiser/04-performance-ratings.webp',
    imageAlt:
      'CrimFig Advertising report dashboard displaying Event spend, Billable impressions, Billed clicks, and Audience Feedback Ratings',
    caption: 'Step 4 — Track Advertising report metrics and live audience ratings.',
    actionLabel: 'View Reports',
    actionHref: '/reports',
  },
];

export const PROMOTER_GUIDE_STEPS: readonly GuideStep[] = [
  {
    stepNumber: 1,
    title: 'Register & Verify Your Website',
    summary:
      'Switch to Promoter Hub inside the Ads workspace, open Websites & Ad Slots, click + Add Website, and prove ownership using HTML Meta Tag or DNS TXT Record verification.',
    checklist: [
      'Switch to Promoter Hub and open Websites & Ad Slots.',
      'Click + Add Website to open Register Website Property and enter your domain.',
      'Complete HTML Meta Tag or DNS TXT verification so your site reaches Verified Domain.',
    ],
    screenshotSrc: '/guides/promoter/01-add-verify-site.png',
    clipSrc: '/guides/promoter/01-add-verify-site.webp',
    imageAlt:
      'CrimFig Promoter Hub Registered Websites & Ad Slots table showing + Add Website button, Verified Domain, APPROVED policy, and HTML/DNS TXT checks',
    caption: 'Step 1 — Click + Add Website and complete HTML or DNS TXT verification.',
    actionLabel: 'Open Websites',
    actionHref: '/promoter/websites',
  },
  {
    stepNumber: 2,
    title: 'Create Responsive Ad Slots',
    summary:
      'Open your verified website and click Add ad slot. Enter a Slot name, pick CrimFig Ad Network or AdStation Direct, choose Dynamic Ad Slot or Selected Sizes, and click Create ad slot.',
    checklist: [
      'Enter a descriptive Slot name (such as Article Top Banner) and choose Inventory mode.',
      'Choose Dynamic Ad Slot so approved sizes adapt to available container space.',
      'Click Create ad slot to generate your reusable placement tag.',
    ],
    screenshotSrc: '/guides/promoter/02-create-ad-slot.png',
    clipSrc: '/guides/promoter/02-create-ad-slot.webp',
    imageAlt:
      'CrimFig Promoter Create ad slot form displaying Slot name, Inventory mode, Dynamic Ad Slot option, and Create ad slot button',
    caption: 'Step 2 — Configure Dynamic Ad Slot sizing and click Create ad slot.',
    actionLabel: 'Manage Ad Slots',
    actionHref: '/promoter/websites',
  },
  {
    stepNumber: 3,
    title: 'Copy Installation Snippet & Verify',
    summary:
      'Open Installation instructions on your slot, switch between the HTML and React / Next.js tabs, click Copy for Page SDK and Slot markup, and confirm Installation: verified.',
    checklist: [
      'Choose HTML or React / Next.js tabs (WordPress is marked Coming soon).',
      'Click Copy on Page SDK and Slot markup and paste them into your site template.',
      'Confirm Installation: verified so paid CrimFig adverts can begin serving.',
    ],
    screenshotSrc: '/guides/promoter/03-install-embed.png',
    clipSrc: '/guides/promoter/03-install-embed.webp',
    imageAlt:
      'CrimFig Promoter Installation instructions showing HTML and React / Next.js tabs, Page SDK and Slot markup Copy buttons, and Installation verified badge',
    caption: 'Step 3 — Copy Page SDK & Slot markup and verify installation.',
    actionLabel: 'Open Setup Guide',
    actionHref: '/promoter/ad-network/get-started',
  },
  {
    stepNumber: 4,
    title: 'Track 55% Share Earnings & Withdraw',
    summary:
      'Promoters earn 55% of eligible paid ad revenue generated on verified placements. Track Confirmed vs. Pending earnings across the 72-hour traffic-quality review window in Earnings report, then click Review fees and net payout in Billing.',
    checklist: [
      'Monitor Confirmed earnings (cash) and Pending earnings (72-hour clearance) in Earnings report.',
      'Keep traffic authentic — invalid or automated clicks are filtered out.',
      'Open Withdraw to Bank Account in Billing and click Review fees and net payout.',
    ],
    screenshotSrc: '/guides/promoter/04-earnings-payouts.png',
    clipSrc: '/guides/promoter/04-earnings-payouts.webp',
    imageAlt:
      'CrimFig Promoter Earnings report and Withdraw to Bank Account form showing Confirmed earnings, Payout quote breakdown, and Review fees and net payout button',
    caption: 'Step 4 — Review Earnings report and confirm bank withdrawals in Billing.',
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
