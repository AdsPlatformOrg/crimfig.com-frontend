'use client';

import { MarketingReveal } from './MarketingReveal';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui/button';
import { LandingNavbar } from './LandingNavbar';
import { LandingFooter } from './LandingFooter';

interface LandingPageProps {
  onLaunchConsole: (role?: 'advertiser' | 'promoter', section?: string) => void;
}

const campaignMetrics = [
  ['Campaign spend', '$840.00'],
  ['Sample viewable impressions', '2,520,000'],
  ['Sample clicks', '12,600'],
];
const promoterMetrics = [
  ['Sample earnings', '$284.50'],
  ['Impressions', '64,200'],
  ['Clicks', '1,926'],
  ['Acquisitions', '84'],
];

function DashboardPreview({ title, metrics, trend }: {
  title: string;
  metrics: string[][];
  trend: string;
}) {
  return (
    <figure className="cf-ads-dashboard">
      <figcaption>
        <strong>{title}</strong>
        <span>Illustrative data</span>
      </figcaption>
      <dl>
        {metrics.map(([label, value]) => (
          <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
        ))}
      </dl>
      <svg viewBox="0 0 600 160" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 40H600 M0 80H600 M0 120H600 M0 159H600" stroke="var(--border-subtle)" fill="none" />
        <path d={trend} stroke="var(--color-crimson)" strokeWidth="3" vectorEffect="non-scaling-stroke" fill="none" />
      </svg>
      <div className="cf-ads-dashboard-dates"><span>Day 1</span><span>Day 7</span></div>
    </figure>
  );
}

export function LandingPage({ onLaunchConsole }: LandingPageProps) {

  return (
    <div className="cf-marketing cf-ads-landing">
      <LandingNavbar onLaunchConsole={() => onLaunchConsole('advertiser')} />
      <MarketingReveal>
        <section className="cf-ads-hero">
          <Image src="/img/marketing/creator-hero.webp" alt="Smiling creator filming with a phone and ring light" fill sizes="100vw" priority />
          <h1>Make your mark.</h1>
        </section>

        <section id="what-we-do" className="cf-marketing-section cf-marketing-section--surface">
          <div className="cf-marketing-frame" data-ads-reveal>
            <div className="cf-marketing-copy">
              <h2>Campaigns in focus.</h2>
              <p>See how your ads perform and where your budget goes.</p>
              <div className="cf-marketing-actions">
                <Button onClick={() => onLaunchConsole('advertiser')}>Start advertising</Button>
              </div>
            </div>
            <DashboardPreview title="Campaign performance" metrics={campaignMetrics} trend="M0 132 L100 104 L200 115 L300 72 L400 82 L500 48 L600 24" />
          </div>
        </section>

        <section id="partners" className="cf-marketing-section">
          <div className="cf-marketing-frame" data-ads-reveal>
            <div className="cf-marketing-copy">
              <h2>Be a Promoter.</h2>
              <p>Place ads on your site or share tracked links with your audience.</p>
              <div className="cf-marketing-actions">
                <Button variant="outline" onClick={() => onLaunchConsole('promoter')}>Open Promoter Hub</Button>
              </div>
            </div>
            <DashboardPreview title="Promoter performance" metrics={promoterMetrics} trend="M0 142 L100 124 L200 92 L300 101 L400 63 L500 71 L600 35" />
          </div>
        </section>

        <section id="learn" className="cf-marketing-section cf-marketing-section--surface cf-ads-learn">
          <div className="cf-marketing-frame" data-ads-reveal>
            <div className="cf-marketing-copy">
              <h2>Learn more.</h2>
              <div className="cf-marketing-actions">
                <Button asChild variant="outline"><Link href="/docs">Read the docs</Link></Button>
              </div>
            </div>
            <div className="cf-marketing-visual">
              <Image src="/img/marketing/learn-ads.webp" alt="Young man smiling while working on a laptop" fill sizes="100vw" />
            </div>
          </div>
        </section>
      </MarketingReveal>
      <LandingFooter onLaunchConsole={onLaunchConsole} />
    </div>
  );
}
