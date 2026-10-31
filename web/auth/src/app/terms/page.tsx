import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, FileText } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service — CrimFig',
  description: 'Terms of Service and legal agreements for CrimFig Ads, Billing and Identity Platform',
};

export default function TermsPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-canvas)', color: 'var(--text-primary)', padding: '60px 24px' }}>
      <div style={{ maxWidth: '840px', margin: '0 auto', backgroundColor: 'var(--bg-surface)', padding: '48px', borderRadius: '16px', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--color-crimson)', textDecoration: 'none', fontSize: '14px', fontWeight: 600, marginBottom: '32px' }}>
          <ArrowLeft style={{ width: 16, height: 16 }} /> Back to Home
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <FileText style={{ width: 32, height: 32, color: 'var(--color-crimson)' }} />
          <h1 style={{ fontSize: '32px', fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>Terms of Service</h1>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '36px' }}>
          Last Updated: October 31, 2026 • Effective Date: October 31, 2026
        </p>

        <section style={{ marginBottom: '32px', lineHeight: 1.7, fontSize: '15px', color: 'var(--text-secondary)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>1. Acceptance of Terms</h2>
          <p>
            By accessing or using CrimFig (including CrimFig Auth, CrimFig Ads, CrimFig Billing, and related API services), you agree to be bound by these Terms of Service. If you do not agree, do not access or use our platform.
          </p>
        </section>

        <section style={{ marginBottom: '32px', lineHeight: 1.7, fontSize: '15px', color: 'var(--text-secondary)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>2. Account Registration & Security</h2>
          <p>
            You must provide accurate, current, and complete information during registration. You are solely responsible for maintaining the confidentiality of your account credentials and multi-factor authentication (MFA) devices. Any transaction or campaign authorized with your authenticated session or step-up TOTP verification is deemed initiated by you.
          </p>
        </section>

        <section style={{ marginBottom: '32px', lineHeight: 1.7, fontSize: '15px', color: 'var(--text-secondary)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>3. Advertiser Services, Wallets & Budgets</h2>
          <p>
            Advertisers may fund campaign budgets through verified payment methods (including Paystack). Payments are converted and maintained on a 1:1 USD ledger standard. When an ad campaign is submitted, approved, and activated, the designated budget is placed into an atomic escrow reserve. Funds are disbursed strictly upon verified, non-fraudulent ad impressions and clicks.
          </p>
        </section>

        <section style={{ marginBottom: '32px', lineHeight: 1.7, fontSize: '15px', color: 'var(--text-secondary)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>4. Publisher & Promoter Network Rules</h2>
          <p>
            Publishers embedding CrimFig ad slots (via AdStation or pub-loader embed tags) agree not to engage in artificial impression generation, bot traffic, automated clicking, or invalid traffic (IVT). All impressions and clicks undergo automated GIVT/SIVT scrutiny and 72-hour clearance holds. Suspected or verified invalid traffic will result in immediate forfeiture of earnings and account suspension.
          </p>
        </section>

        <section style={{ marginBottom: '32px', lineHeight: 1.7, fontSize: '15px', color: 'var(--text-secondary)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>5. Payouts, Withdrawals & Fraud Prevention</h2>
          <p>
            Promoter withdrawal requests are subject to strict financial policy review, verification cooldowns, daily limits, and step-up two-factor authentication. Transfer processing charges are deducted from gross payouts as disclosed prior to confirmation.
          </p>
        </section>

        <section style={{ marginBottom: '32px', lineHeight: 1.7, fontSize: '15px', color: 'var(--text-secondary)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>6. Termination & Contact</h2>
          <p>
            CrimFig reserves the right to suspend or terminate accounts that violate these terms or engage in fraudulent activities. For questions regarding these terms, contact us at <strong>legal@crimfig.com</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}
