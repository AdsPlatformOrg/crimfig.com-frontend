'use client';

import React, { useState } from 'react';
import {
  HelpCircle,
  MessageSquare,
  Plus,
  Send,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  CreditCard,
  Wallet,
  Clock,
} from 'lucide-react';

interface BillingTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  category: string;
  status: 'open' | 'in_progress' | 'waiting_on_user' | 'resolved';
  createdAt: string;
  lastReply: string;
}

export function BillingSupportHub() {
  const [tickets, setTickets] = useState<BillingTicket[]>([
    {
      id: '1',
      ticketNumber: 'BIL-202610-001',
      subject: 'Inquiry regarding NGN currency conversion settlement',
      category: 'payouts',
      status: 'resolved',
      createdAt: '2026-10-23 14:20 UTC',
      lastReply: 'The CBN bank stamp fee and Paystack transfer fee were automatically netted from the Dynamic Ecosystem Pool.',
    },
  ]);

  const [activeTab, setActiveTab] = useState<'tickets' | 'faq' | 'new_ticket'>('tickets');
  const [newSubject, setNewSubject] = useState('');
  const [newCategory, setNewCategory] = useState('payouts');
  const [newMessage, setNewMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newMessage.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const createdTicket: BillingTicket = {
        id: String(Date.now()),
        ticketNumber: `BIL-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(tickets.length + 1).padStart(3, '0')}`,
        subject: newSubject,
        category: newCategory,
        status: 'open',
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
        lastReply: newMessage,
      };

      setTickets([createdTicket, ...tickets]);
      setNewSubject('');
      setNewMessage('');
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setActiveTab('tickets');
      setTimeout(() => setSubmitSuccess(false), 3000);
    }, 600);
  };

  const faqs = [
    {
      q: 'How does wallet funding work?',
      a: 'Funding requests are created in USD and converted to NGN via the live CBN-pegged exchange rate for seamless checkout with saved cards or bank transfers.',
    },
    {
      q: 'What is the minimum withdrawal threshold?',
      a: 'Bank withdrawals require a minimum available balance of $10.00 USD and verified account holder identification.',
    },
    {
      q: 'How are rewards points redeemed?',
      a: 'Points in the Rewards Hub convert 100 points = $1.00 USD directly into your spendable and withdrawable cash wallet balance.',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span
              style={{
                fontSize: '10px',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '9999px',
                backgroundColor: 'var(--color-crimson)',
                color: '#FFFFFF',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Billing Helpdesk
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Financial &amp; Escrow Support</span>
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Billing Help &amp; Inquiries
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Direct asynchronous tickets for payment confirmations, escrow holds, payout exceptions, and exchange rate inquiries.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setActiveTab('tickets')}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              backgroundColor: activeTab === 'tickets' ? 'var(--color-crimson)' : 'var(--badge-bg)',
              color: activeTab === 'tickets' ? '#FFFFFF' : 'var(--text-primary)',
              border: '1px solid var(--border-subtle)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            My Inquiries ({tickets.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('new_ticket')}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              backgroundColor: activeTab === 'new_ticket' ? 'var(--color-crimson)' : 'var(--badge-bg)',
              color: activeTab === 'new_ticket' ? '#FFFFFF' : 'var(--text-primary)',
              border: '1px solid var(--border-subtle)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Plus style={{ width: 14, height: 14 }} />
            <span>New Inquiry</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('faq')}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              backgroundColor: activeTab === 'faq' ? 'var(--color-crimson)' : 'var(--badge-bg)',
              color: activeTab === 'faq' ? '#FFFFFF' : 'var(--text-primary)',
              border: '1px solid var(--border-subtle)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Billing FAQ
          </button>
        </div>
      </div>

      {submitSuccess && (
        <div style={{ padding: '12px 16px', borderRadius: '8px', backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 style={{ width: 16, height: 16 }} />
          <span>Billing inquiry submitted. A finance specialist will investigate and respond directly in this ticket thread.</span>
        </div>
      )}

      {/* TICKETS LIST */}
      {activeTab === 'tickets' && (
        <div className="theme-card" style={{ padding: '24px', borderRadius: '16px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>
            Submitted Financial Inquiries
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {tickets.map((t) => (
              <div
                key={t.id}
                style={{
                  padding: '16px 20px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--bg-page)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      backgroundColor: t.status === 'resolved' ? 'var(--color-success-bg)' : 'rgba(212,20,58,0.08)',
                      color: t.status === 'resolved' ? 'var(--color-success)' : 'var(--color-crimson)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <MessageSquare style={{ width: 18, height: 18 }} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '11px', fontFamily: 'monospace', fontWeight: 700, color: 'var(--text-muted)' }}>
                        {t.ticketNumber}
                      </span>
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          backgroundColor: t.status === 'resolved' ? 'var(--color-success-bg)' : 'var(--badge-bg)',
                          color: t.status === 'resolved' ? 'var(--color-success)' : 'var(--text-secondary)',
                          textTransform: 'uppercase',
                        }}
                      >
                        {t.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
                      {t.subject}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      {t.lastReply}
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'right' }}>
                  <div>Created {t.createdAt}</div>
                  <div style={{ marginTop: '2px' }}>Category: {t.category.toUpperCase()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CREATE TICKET */}
      {activeTab === 'new_ticket' && (
        <form onSubmit={handleCreateTicket} className="theme-card" style={{ padding: '28px', borderRadius: '16px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Open a Financial or Escrow Inquiry
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>Category</label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-page)',
                color: 'var(--text-primary)',
                fontSize: '13px',
              }}
            >
              <option value="payouts">Bank Account Withdrawal &amp; Payout Exception</option>
              <option value="funding">Card Funding &amp; Paystack Reconciliation</option>
              <option value="escrow">Advertiser Campaign Escrow Debit</option>
              <option value="subscription">Subscription Invoice &amp; Billing Cycle</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>Subject</label>
            <input
              type="text"
              placeholder="e.g. Withdrawal transfer reference confirmation..."
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              required
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-page)',
                color: 'var(--text-primary)',
                fontSize: '13px',
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>Details</label>
            <textarea
              rows={5}
              placeholder="Include transaction references, withdrawal request IDs, or bank verification details..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              required
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-page)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                fontFamily: 'inherit',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              padding: '12px 20px',
              borderRadius: '8px',
              backgroundColor: 'var(--color-crimson)',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: 600,
              border: 'none',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '8px',
            }}
          >
            <Send style={{ width: 14, height: 14 }} />
            <span>{isSubmitting ? 'Submitting...' : 'Send Inquiry'}</span>
          </button>
        </form>
      )}

      {/* FAQ */}
      {activeTab === 'faq' && (
        <div className="theme-card" style={{ padding: '24px', borderRadius: '16px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>
            Financial &amp; Escrow Knowledge Base
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {faqs.map((f, i) => (
              <div
                key={i}
                style={{
                  padding: '16px 20px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--bg-page)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  {f.q}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {f.a}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
