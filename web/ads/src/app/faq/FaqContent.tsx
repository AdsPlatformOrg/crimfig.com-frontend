import React from 'react';
import Link from 'next/link';

export interface AdsFaqItem {
  question: string;
  answer: string;
}

export const ADS_FAQ_ITEMS: readonly AdsFaqItem[] = [
  {
    question: '1. What is CrimFig Ads?',
    answer:
      'CrimFig Ads is an advertising platform that helps businesses promote their products and services while allowing website owners and promoters to earn from eligible advertising activity.',
  },
  {
    question: '2. How can I advertise on CrimFig?',
    answer:
      'Create an account at crimfig.com, access the Ads Console, create your advertising campaign, upload your advert, set your budget and submit it for review.',
  },
  {
    question: '3. What is the minimum advertising budget?',
    answer: 'The minimum campaign budget is $5 USD or its supported currency equivalent.',
  },
  {
    question: '4. How does CrimFig charge advertisers?',
    answer:
      'CrimFig supports Cost Per Mille (CPM), based on valid viewable impressions, and Cost Per Click (CPC), based on eligible clicks. Advertisers pay according to their selected pricing model and campaign budget.',
  },
  {
    question: '5. How can website owners earn money with CrimFig Ads?',
    answer:
      "Website owners can register their websites, complete verification, create ad slots and integrate CrimFig's advertising code. They earn when qualifying paid advertisements generate valid billable activity.",
  },
  {
    question: '6. How much do promoters and website owners earn?',
    answer:
      'Promoters receive 55% of eligible paid advertising revenue attributed to their placements, subject to applicable policies and adjustments.',
  },
  {
    question: '7. When can promoters withdraw their earnings?',
    answer:
      'Eligible earnings generally become available after a 72-hour clearance period, subject to traffic-quality checks and withdrawal requirements.',
  },
  {
    question: '8. What is CrimFig AdStation?',
    answer:
      "AdStation allows eligible website owners to manage direct advertising opportunities and sponsorship placements on their websites, separately from CrimFig's automated Ad Network.",
  },
  {
    question: '9. How does CrimFig prevent invalid clicks and impressions?',
    answer:
      'CrimFig uses advertising-event validation, duplicate detection, traffic-quality monitoring and ongoing reviews to identify invalid activity and protect advertisers and promoters.',
  },
];

export function FaqContent() {
  return (
    <main className="cf-marketing-section">
      <div className="cf-marketing-frame" style={{ maxWidth: '52rem' }}>
        <div className="cf-marketing-copy" style={{ textAlign: 'left', maxWidth: 'none' }}>
          <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', lineHeight: 1.2 }}>
            CrimFig Ads — Frequently Asked Questions (FAQ)
          </h1>
          <p style={{ marginInline: 0, maxWidth: '42rem' }}>
            Answers about running ad campaigns, pricing, promoter earnings, AdStation, and traffic quality on CrimFig Ads.
          </p>
        </div>

        <div
          style={{
            marginTop: '2.5rem',
            display: 'grid',
            gap: '1rem',
          }}
        >
          {ADS_FAQ_ITEMS.map((item) => (
            <article
              key={item.question}
              style={{
                padding: '1.25rem 1.5rem',
                borderRadius: '0.875rem',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-surface)',
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: '1.0625rem',
                  fontWeight: 600,
                  lineHeight: 1.4,
                  color: 'var(--text-primary)',
                }}
              >
                {item.question}
              </h2>
              <p
                style={{
                  margin: '0.625rem 0 0',
                  fontSize: '0.9375rem',
                  lineHeight: 1.65,
                  color: 'var(--text-secondary)',
                }}
              >
                {item.answer}
              </p>
            </article>
          ))}
        </div>

        <div
          style={{
            marginTop: '2.5rem',
            padding: '1.25rem 1.5rem',
            borderRadius: '0.875rem',
            border: '1px solid var(--border-subtle)',
            background: 'var(--bg-elevated)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <p style={{ margin: 0, fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Need help with a campaign or placement? Visit Help &amp; Support or email{' '}
            <a
              href="mailto:support@crimfig.com"
              style={{ color: 'var(--color-crimson)', fontWeight: 600, textDecoration: 'none' }}
            >
              support@crimfig.com
            </a>
            .
          </p>
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
      </div>
    </main>
  );
}
