import React from 'react';

function Glyph({ children, size = 28 }: { children: React.ReactNode; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: size, height: size, color: size > 18 ? 'var(--color-crimson)' : 'currentColor', flexShrink: 0 }}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const DocIcons = {
  terms: (
    <Glyph>
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10 9H8" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
    </Glyph>
  ),
  privacy: (
    <Glyph>
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    </Glyph>
  ),
  cookies: (
    <Glyph>
      <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
      <path d="M8.5 8.5v.01" />
      <path d="M16 15.5v.01" />
      <path d="M12 12v.01" />
    </Glyph>
  ),
  adPolicy: (
    <Glyph>
      <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="M7 21h10" />
      <path d="M12 3v18" />
      <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
    </Glyph>
  ),
  refund: (
    <Glyph>
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
      <path d="M14 8H8" />
      <path d="M16 12H8" />
      <path d="M13 16H8" />
    </Glyph>
  ),
  deletion: (
    <Glyph>
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </Glyph>
  ),
  arrowLeft: (
    <Glyph size={16}>
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </Glyph>
  ),
  support: (
    <Glyph size={15}>
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </Glyph>
  ),
};

export const CRIMFIG_ENTITY_NAME = 'CRIMFIG';
export const CRIMFIG_LEGAL_EMAIL = 'support@crimfig.com';
export const CRIMFIG_EFFECTIVE_DATE = 'November 23, 2026';

export const LEGAL_FOOTER_LINKS = [
  { href: '/terms', label: 'Terms of Use' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/cookies', label: 'Cookie Policy' },
  { href: '/ad-policy', label: 'Ad & Traffic Policy' },
  { href: '/refund-policy', label: 'Refund & Payout Policy' },
  { href: '/data-deletion', label: 'Data Deletion' },
] as const;

export type LegalDocKind =
  | 'terms'
  | 'privacy'
  | 'cookies'
  | 'ad-policy'
  | 'refund-policy'
  | 'data-deletion';

interface LegalDocSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

interface LegalDocMeta {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  sections: LegalDocSection[];
}

function getDocMeta(kind: LegalDocKind, appName: string): LegalDocMeta {
  switch (kind) {
    case 'terms':
      return {
        title: 'Terms of Use',
        subtitle: `Effective Date: ${CRIMFIG_EFFECTIVE_DATE} • Last Updated: ${CRIMFIG_EFFECTIVE_DATE} • Applies across ${appName} & CRIMFIG Ecosystem`,
        icon: DocIcons.terms,
        sections: [
          {
            heading: '1. Acceptance of Terms',
            paragraphs: [
              `By accessing or using ${CRIMFIG_ENTITY_NAME} (including CrimFig Auth, CrimFig Ads, CrimFig Billing & Rewards, and related websites, SDKs, or APIs), you agree to be bound by these Terms of Use.`,
            ],
          },
          {
            heading: '2. Eligibility & Age Requirements',
            paragraphs: [
              `You must be at least 18 years old to create an account or use paid advertising, promoter monetization, and Billing features on ${CRIMFIG_ENTITY_NAME}. Individuals under 18 may only access or use services with explicit parental or legal guardian permission and active supervision.`,
            ],
          },
          {
            heading: '3. Accounts & Security',
            paragraphs: [
              'You are responsible for keeping your credentials accurate and secure. Verified email checks, rotating session controls, and account activity attributed to your authenticated session remain your responsibility.',
            ],
          },
          {
            heading: '4. Advertiser Campaigns, Escrow & Budgets',
            paragraphs: [
              'Advertisers fund wallets via authorized payment channels (such as Paystack). Campaign budgets are reserved inside atomic USD escrow and consumed only against verified, non-fraudulent serves or clicks.',
              'Campaign creatives, landing pages, and promotions must comply with our Ad Content & Traffic Policy. Any unused escrow released back to your CrimFig wallet is subject to our Refund & Payout Policy.',
            ],
          },
          {
            heading: '5. Promoters, Ad Embeds & Invalid Traffic',
            paragraphs: [
              'Promoters integrating CrimFig slots on verified websites must maintain legitimate human audiences. Automated bots, self-clicking, coordinated click groups, and traffic manipulation are strictly prohibited and subject to 72-hour GIVT/SIVT clearance checks, earnings forfeiture, or suspension.',
            ],
          },
          {
            heading: '6. Rewards, Points & Virtual $cfig',
            paragraphs: [
              'Promoter Points, milestones, and virtual $cfig accruals operate strictly under published program controls. Virtual balances have no guaranteed cash or redeemable value unless explicitly funded, eligible, and converted under active authorized terms.',
            ],
          },
          {
            heading: '7. Informal Dispute Resolution & Contact',
            paragraphs: [
              `Before initiating any formal claim against ${CRIMFIG_ENTITY_NAME}, you agree to submit a written notice to ${CRIMFIG_LEGAL_EMAIL} (or via Help & Support) and allow 30 days to work toward an informal resolution. For any legal inquiries or formal notices (pending company registration address updates), contact ${CRIMFIG_LEGAL_EMAIL}.`,
            ],
          },
        ],
      };

    case 'privacy':
      return {
        title: 'Privacy Policy',
        subtitle: `Last Updated: ${CRIMFIG_EFFECTIVE_DATE} • Alignment: UK GDPR & Global Privacy Standards`,
        icon: DocIcons.privacy,
        sections: [
          {
            heading: '1. Who We Are & Contact',
            paragraphs: [
              `${CRIMFIG_ENTITY_NAME} operates single sign-on identity, performance advertising, and wallet billing services. For all privacy, data access, or deletion requests, contact ${CRIMFIG_LEGAL_EMAIL}.`,
            ],
          },
          {
            heading: '2. Information We Collect',
            paragraphs: [
              'We collect only data strictly needed to run authentication, prevent ad fraud, and process billing or payouts:',
            ],
            bullets: [
              'Account & Identity Data: Email address, optional phone number, salted/hashed password credentials, and staff role assignments.',
              'Financial & Payout Data: Wallet ledger records, transaction references, and verified payout destination details. Card credentials are processed by PCI-DSS compliant processors (Paystack) and are never stored by CRIMFIG.',
              'Ad Delivery & Traffic Quality Telemetry: Hashed/minimized network signals, user-agent headers, viewability timings, and interaction checks used solely for GIVT/SIVT fraud filtering—never sold to third-party data brokers.',
            ],
          },
          {
            heading: '3. Data Protection & Zero Ad-Broker Tracking',
            paragraphs: [
              `${CRIMFIG_ENTITY_NAME} uses TLS encryption in transit, hashed credentials, role-scoped access controls, and strictly essential session cookies. We do not sell your personal information or plant third-party behavioral ad-retargeting trackers across CrimFig websites or publisher slots.`,
            ],
          },
          {
            heading: '4. Data Retention Periods',
            paragraphs: [
              'Verified account deletion requests remove personal profile and contact data within 30 days.',
              'Immutable financial, wallet, settlement, tax, and fraud-audit ledgers are retained for up to 6 years after account closure or transaction settlement in accordance with UK statutory recordkeeping and UK GDPR exemptions (Article 17(3)(b) and (e)).',
            ],
          },
          {
            heading: '5. Your Rights & Account Deletion',
            paragraphs: [
              `You may request access, correction, export, or deletion of your personal data at any time through Help & Support (/support) or by emailing ${CRIMFIG_LEGAL_EMAIL}. See our Data Deletion page for exact step-by-step instructions.`,
            ],
          },
        ],
      };

    case 'cookies':
      return {
        title: 'Cookie & Session Policy',
        subtitle: `Effective Date: ${CRIMFIG_EFFECTIVE_DATE} • Strictly Essential Storage Only`,
        icon: DocIcons.cookies,
        sections: [
          {
            heading: '1. Strictly Essential Cookies & Storage Only',
            paragraphs: [
              `${CRIMFIG_ENTITY_NAME} relies solely on strictly essential cookies and browser storage required to keep your signed-in workspace secure and remember basic display preferences. Because we do not load non-essential advertising, behavioral profiling, or third-party tracking cookies, no intrusive consent pop-up banner is needed.`,
            ],
          },
          {
            heading: '2. Authentication & Security Cookies',
            paragraphs: [
              'HttpOnly, secure session and refresh cookies keep single sign-on sessions authenticated cleanly across *.crimfig.com portals, coordinate multi-tab token renewal, and protect against cross-site request forgery.',
            ],
          },
          {
            heading: '3. Functional Local Storage Preferences',
            paragraphs: [
              'CrimFig apps store your chosen color theme (light or dark) and interface language preference locally in your browser so pages load consistently.',
            ],
          },
          {
            heading: '4. Publisher Ad Embed Privacy',
            paragraphs: [
              'The CrimFig website embed loader operates without planting cross-site third-party ad-targeting cookies on visitors.',
            ],
          },
        ],
      };

    case 'ad-policy':
      return {
        title: 'Ad Content & Traffic Policy',
        subtitle: `Effective Date: ${CRIMFIG_EFFECTIVE_DATE} • Rules for Advertisers & Promoters`,
        icon: DocIcons.adPolicy,
        sections: [
          {
            heading: '1. Prohibited Ad Content & Safety Rules',
            paragraphs: [
              'All campaigns, creatives, and promoted destinations submitted to CrimFig Ads must remain safe for general audiences:',
            ],
            bullets: [
              'Prohibited Category: Adult or X-Rated content is strictly prohibited across all ad creatives, House/Network slots, and destination websites.',
              'Platform Safety Baseline: Unlawful goods or services, malware, phishing pages, and deceptive or cloaked redirects are strictly prohibited.',
              'HTTPS Requirement: Every advertiser destination URL and verified publisher property must load over valid HTTPS.',
            ],
          },
          {
            heading: '2. Website Ownership & Placement Quality',
            paragraphs: [
              'Promoters must verify domain ownership (via DNS TXT, HTML file, or meta tag) and pass content review before paid delivery.',
            ],
          },
          {
            heading: '3. Permitted Sharing vs. Prohibited Click Fraud',
            paragraphs: [
              'Sharing legitimate articles or links across social channels and search engines is permitted. Coordinated invalid traffic is prohibited:',
            ],
            bullets: [
              'Never ask friends, staff, or followers to click ads to inflate payouts.',
              'Never pay or incentivize visitors to generate clicks outside an authorized program.',
              'Never use click-exchange groups, bots, automated refreshes, or hidden ad overlays.',
            ],
          },
          {
            heading: '4. Moderation Appeals',
            paragraphs: [
              `If a campaign, creative, or website is rejected or paused during moderation review, you can appeal cleanly at any time using Help & Support (/support) or by contacting ${CRIMFIG_LEGAL_EMAIL}.`,
            ],
          },
        ],
      };

    case 'refund-policy':
      return {
        title: 'Refund, Escrow & Payout Policy',
        subtitle: `Effective Date: ${CRIMFIG_EFFECTIVE_DATE} • Wallets, Withdrawals & Chargebacks`,
        icon: DocIcons.refund,
        sections: [
          {
            heading: '1. Refund Requests & 30-Day Processing Window',
            paragraphs: [
              `Users may request refunds for eligible unspent campaign escrow or unused wallet funds through Help & Support (/support). ${CRIMFIG_ENTITY_NAME} reviews every request against campaign settlement ledgers and may take up to 30 days to process a refund request.`,
            ],
          },
          {
            heading: '2. Refunds Credit Your CrimFig Wallet (Immediate Withdrawal)',
            paragraphs: [
              'Approved refunds are credited directly into your CrimFig Billing wallet balance. Once refunded to your wallet, eligible funds can be withdrawn immediately through standard CrimFig payout withdrawals (subject to existing withdrawal rules and minimums).',
            ],
          },
          {
            heading: '3. Applicable Fees & Charges',
            paragraphs: [
              'Additional payment-processor, currency conversion, or administrative fees and charges may apply and may be deducted from gross refund or withdrawal amounts as confirmed prior to completion.',
            ],
          },
          {
            heading: '4. Chargebacks & Payment Reversals',
            paragraphs: [
              'If a funding payment or deposit is reversed or charged back after advertisements have already been delivered, the exact amount already spent on served ads will be recovered from the account, resulting in a negative account balance charge or deduction. Future deposits or promoter earnings automatically offset any negative deficit before funds become usable.',
            ],
          },
        ],
      };

    case 'data-deletion':
      return {
        title: 'Data Deletion & Account Closure',
        subtitle: `Last Updated: ${CRIMFIG_EFFECTIVE_DATE} • Fulfilled within 30 Days`,
        icon: DocIcons.deletion,
        sections: [
          {
            heading: '1. How to Request Deletion',
            paragraphs: [
              `You can request account closure or deletion of your personal data at any time by submitting a ticket through Help & Support (/support) while signed in, or by emailing ${CRIMFIG_LEGAL_EMAIL} from your registered account email address.`,
            ],
          },
          {
            heading: '2. 30-Day Deletion Fulfillment',
            paragraphs: [
              `Upon verifying account ownership, ${CRIMFIG_ENTITY_NAME} deletes or anonymizes personal profile, credential, and contact records within 30 days and revokes active SSO tokens across all CrimFig apps.`,
            ],
          },
          {
            heading: '3. Statutory Retention Exception (Up to 6 Years)',
            paragraphs: [
              'Where required under UK statutory financial/tax rules and UK GDPR exemptions (Article 17(3)(b) and (e)), immutable transaction ledgers, settlement audit receipts, and chargeback/fraud defense records are retained securely in locked audit storage for up to 6 years.',
            ],
          },
        ],
      };
  }
}

export function LegalDocumentPage({
  kind,
  appName,
  homeHref = '/',
}: {
  kind: LegalDocKind;
  appName: string;
  homeHref?: string;
}) {
  const doc = getDocMeta(kind, appName);

  return (
    <div
      style={{
        minHeight: '100dvh',
        backgroundColor: 'var(--bg-page)',
        color: 'var(--text-primary)',
        padding: '48px 16px 64px',
        boxSizing: 'border-box',
      }}
    >
      <main
        style={{
          maxWidth: '840px',
          width: '100%',
          margin: '0 auto',
          backgroundColor: 'var(--bg-surface)',
          padding: 'clamp(24px, 4vw, 48px)',
          borderRadius: '16px',
          border: '1px solid var(--border-subtle)',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '28px',
          }}
        >
          <a
            href={homeHref}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--color-crimson)',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 600,
              minHeight: '44px',
            }}
          >
            {DocIcons.arrowLeft}
            <span>Back to {appName}</span>
          </a>

          <a
            href="/support"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: 600,
              minHeight: '44px',
            }}
          >
            {DocIcons.support}
            <span>Help &amp; Support</span>
          </a>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
          {doc.icon}
          <h1 style={{ fontSize: 'clamp(1.65rem, 3vw, 2rem)', fontWeight: 800, margin: 0, letterSpacing: '-0.4px' }}>
            {doc.title}
          </h1>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '0 0 32px', lineHeight: 1.5 }}>
          {doc.subtitle} · Published by {CRIMFIG_ENTITY_NAME} ({CRIMFIG_LEGAL_EMAIL})
        </p>

        {doc.sections.map((section) => (
          <section
            key={section.heading}
            style={{ marginBottom: '28px', lineHeight: 1.7, fontSize: '15px', color: 'var(--text-secondary)' }}
          >
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 10px' }}>
              {section.heading}
            </h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} style={{ margin: '0 0 10px' }}>
                {paragraph}
              </p>
            ))}
            {section.bullets && section.bullets.length > 0 && (
              <ul style={{ paddingLeft: '20px', margin: '8px 0 0', display: 'grid', gap: '6px' }}>
                {section.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            )}
          </section>
        ))}

        <nav
          aria-label="Legal and trust documents"
          style={{
            marginTop: '36px',
            paddingTop: '20px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px 18px',
            fontSize: '13px',
          }}
        >
          {LEGAL_FOOTER_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              style={{
                color: item.href === `/${kind}` || (kind === 'terms' && item.href === '/terms')
                  ? 'var(--color-crimson)'
                  : 'var(--text-secondary)',
                textDecoration: 'none',
                fontWeight: item.href === `/${kind}` || (kind === 'terms' && item.href === '/terms') ? 700 : 500,
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </main>
    </div>
  );
}

export function LegalFooterLinks() {
  return (
    <nav
      aria-label="Legal policies"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '8px 16px',
      }}
    >
      {LEGAL_FOOTER_LINKS.map((item) => (
        <a
          key={item.href}
          href={item.href}
          style={{ color: 'inherit', textDecoration: 'none', whiteSpace: 'nowrap' }}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}
