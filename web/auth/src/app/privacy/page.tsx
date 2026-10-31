import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Lock } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy — CrimFig',
  description: 'Privacy Policy and data protection compliance for CrimFig digital ecosystem',
};

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-canvas)', color: 'var(--text-primary)', padding: '60px 24px' }}>
      <div style={{ maxWidth: '840px', margin: '0 auto', backgroundColor: 'var(--bg-surface)', padding: '48px', borderRadius: '16px', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--color-crimson)', textDecoration: 'none', fontSize: '14px', fontWeight: 600, marginBottom: '32px' }}>
          <ArrowLeft style={{ width: 16, height: 16 }} /> Back to Home
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <Shield style={{ width: 32, height: 32, color: 'var(--color-crimson)' }} />
          <h1 style={{ fontSize: '32px', fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>Privacy Policy</h1>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '36px' }}>
          Last Updated: October 31, 2026 • Compliance: NDPA 2023 & Global Privacy Standards
        </p>

        <section style={{ marginBottom: '32px', lineHeight: 1.7, fontSize: '15px', color: 'var(--text-secondary)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>1. Information We Collect</h2>
          <p>
            We collect personal information necessary to deliver authenticated services, process payments, and ensure ad delivery security:
          </p>
          <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
            <li><strong>Account Data:</strong> Name, email address, password hashes (Argon2/bcrypt), and enrolled MFA keys.</li>
            <li><strong>Financial Data:</strong> Bank account details and payout recipient references necessary to process payouts. Payment card numbers are processed directly by our PCI-DSS compliant payment processor (Paystack) and are never stored on CrimFig servers.</li>
            <li><strong>Analytics & Traffic Data:</strong> Anonymized/hashed IP addresses, user agents, interaction timestamps, and device viewability metrics used strictly for fraud prevention and GIVT/SIVT traffic assessment.</li>
          </ul>
        </section>

        <section style={{ marginBottom: '32px', lineHeight: 1.7, fontSize: '15px', color: 'var(--text-secondary)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>2. How We Use Information</h2>
          <p>
            Your information is used strictly to authenticate your sessions, maintain ledger balances, process wallet funding and withdrawals, deliver and attribute advertising campaigns, prevent fraudulent activities, and notify you regarding critical security events.
          </p>
        </section>

        <section style={{ marginBottom: '32px', lineHeight: 1.7, fontSize: '15px', color: 'var(--text-secondary)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>3. Data Protection & Security</h2>
          <p>
            CrimFig employs defense-in-depth architectural safeguards: AES-256 encryption at rest, TLS 1.3 encryption in transit, strict role-based access control, immutable transaction ledgers, and zero third-party tracking scripts.
          </p>
        </section>

        <section style={{ marginBottom: '32px', lineHeight: 1.7, fontSize: '15px', color: 'var(--text-secondary)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>4. Your Privacy Rights</h2>
          <p>
            In accordance with data protection regulations, you have the right to access, rectify, or request deletion of your personal data, and to withdraw consent at any time. For privacy inquiries or data rights requests, contact <strong>privacy@crimfig.com</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}
