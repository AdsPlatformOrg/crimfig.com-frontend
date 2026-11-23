'use client';

import React from 'react';
import { SupportCenter, SUPPORT_EMAIL } from '../../../../../shared/ui/support/SupportCenter';
import { sessionFetch } from '../../lib/session';
import { Card } from '../ui/card';

export function BillingSupportHub() {
  const faqs = [
    {
      q: 'How does wallet funding work?',
      a: 'Funding requests are created in USD and converted to NGN at the live exchange rate for checkout via Paystack.',
    },
    {
      q: 'What is the minimum withdrawal threshold?',
      a: 'Bank withdrawals require a minimum available balance of $10.00 USD and verified account holder identification.',
    },
    {
      q: 'How can I reach Billing & Finance support directly?',
      a: `Submit a ticket above with your transaction or withdrawal reference, or email ${SUPPORT_EMAIL} from your registered account email.`,
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
      <SupportCenter request={sessionFetch} defaultCategory="billing" />

      <div style={{ maxWidth: '1200px', width: '100%', marginInline: 'auto', paddingInline: '16px', boxSizing: 'border-box' }}>
        <Card className="theme-card" style={{ padding: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 14px' }}>
            Billing FAQ
          </h2>
          <div style={{ display: 'grid', gap: '12px' }}>
            {faqs.map((faq) => (
              <div
                key={faq.q}
                style={{
                  padding: '14px 16px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--bg-page)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {faq.q}
                </div>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {faq.a}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
