import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Account FAQ — CrimFig Auth',
  description: 'Frequently asked questions about signing in, password recovery, and account security on CrimFig.',
};

const AUTH_FAQ_ITEMS = [
  {
    q: 'Do I need separate logins for Ads and Billing?',
    a: 'No. Your CrimFig account gives you one sign-in across CrimFig Ads, CrimFig Billing, and upcoming CrimFig services.',
  },
  {
    q: 'Does CrimFig sell my personal details?',
    a: 'No. We never sell your personal account information or share your profile details with third-party data brokers.',
  },
  {
    q: 'How can I reset a forgotten password or recover access?',
    a: 'Select Forgot Password on the sign-in screen to receive a recovery email, or reach out via Help & Support or support@crimfig.com.',
  },
  {
    q: 'When will two-step verification and team access launch?',
    a: 'Optional two-step sign-in protection and team member invitations are planned upcoming updates and will appear inside your account security settings when ready.',
  },
] as const;

export default function AuthFaqPage() {
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
            &larr; Back to CrimFig Auth
          </Link>
          <Link href="/support" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)', textDecoration: 'none' }}>
            Help &amp; Support
          </Link>
        </div>

        <header>
          <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.35rem)', margin: '0 0 8px', lineHeight: 1.2 }}>
            CrimFig Account FAQ
          </h1>
          <p style={{ margin: 0, fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Simple answers about your CrimFig sign-in, privacy, and account recovery.
          </p>
        </header>

        <div style={{ display: 'grid', gap: '14px' }}>
          {AUTH_FAQ_ITEMS.map((item) => (
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
