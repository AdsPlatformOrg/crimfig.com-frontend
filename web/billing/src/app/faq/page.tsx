import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Billing FAQ — CrimFig Billing',
  description: 'Frequently asked questions about wallet funding, campaign budgets, promoter earnings, and withdrawals on CrimFig Billing.',
};

const BILLING_FAQ_ITEMS = [
  {
    q: 'How do I add funds to my CrimFig wallet?',
    a: 'Open your Billing dashboard and click Add Funds. Payments are entered in USD and converted for checkout using Paystack.',
  },
  {
    q: 'What is the minimum amount needed to launch an ad campaign or withdraw earnings?',
    a: 'Campaign budgets start at $5 USD. Promoters can request bank withdrawals once cleared earnings reach $10 USD.',
  },
  {
    q: 'How long does promoter revenue clearance take?',
    a: 'Qualified ad earnings clear after a 72-hour review period before moving into your withdrawable balance.',
  },
  {
    q: 'How do refunds or payment questions work?',
    a: 'Approved refunds are credited back to your CrimFig wallet and can be requested or tracked via Help & Support or support@crimfig.com.',
  },
] as const;

export default function BillingFaqPage() {
  return (
    <main
      style={{
        minHeight: '100dvh',
        backgroundColor: 'var(--bg-page)',
        color: 'var(--text-primary)',
        padding: '48px 20px 64px',
      }}
    >
      <div style={{ maxWidth: '820px', margin: '0 auto', display: 'grid', gap: '24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
          <Link href="/" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-crimson)', textDecoration: 'none' }}>
            &larr; Back to CrimFig Billing
          </Link>
          <Link href="/support" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)', textDecoration: 'none' }}>
            Help &amp; Support
          </Link>
        </div>

        <header>
          <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.35rem)', margin: '0 0 8px', lineHeight: 1.2 }}>
            CrimFig Billing FAQ
          </h1>
          <p style={{ margin: 0, fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Clear answers on wallet deposits, promoter payouts, clearance times, and support.
          </p>
        </header>

        <div style={{ display: 'grid', gap: '14px' }}>
          {BILLING_FAQ_ITEMS.map((item) => (
            <article
              key={item.q}
              style={{
                padding: '20px',
                borderRadius: '12px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <h2 style={{ margin: '0 0 8px', fontSize: '17px', fontWeight: 600, color: 'var(--text-primary)' }}>
                {item.q}
              </h2>
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                {item.a}
              </p>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
