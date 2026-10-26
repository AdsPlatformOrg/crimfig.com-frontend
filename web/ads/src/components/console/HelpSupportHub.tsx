'use client';

import React, { useState } from 'react';
import {
  HelpCircle,
  MessageSquare,
  Plus,
  Send,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  ChevronRight,
  User,
  Shield,
  LifeBuoy,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

interface Ticket {
  id: string;
  ticketNumber: string;
  subject: string;
  category: string;
  status: 'open' | 'in_progress' | 'waiting_on_user' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  lastReply: string;
}

export function HelpSupportHub() {
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: '1',
      ticketNumber: 'TCK-202610-001',
      subject: 'Inquiry regarding video creative transcoding status',
      category: 'campaign_moderation',
      status: 'in_progress',
      priority: 'medium',
      createdAt: '2026-10-24 10:15 UTC',
      lastReply: 'Our moderation team is reviewing the aspect ratio for placement compliance.',
    },
  ]);

  const [activeTab, setActiveTab] = useState<'tickets' | 'faq' | 'new_ticket'>('tickets');
  const [newSubject, setNewSubject] = useState('');
  const [newCategory, setNewCategory] = useState('campaign_moderation');
  const [newMessage, setNewMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newMessage.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const createdTicket: Ticket = {
        id: String(Date.now()),
        ticketNumber: `TCK-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(tickets.length + 1).padStart(3, '0')}`,
        subject: newSubject,
        category: newCategory,
        status: 'open',
        priority: 'medium',
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
      q: 'How long does campaign creative moderation take?',
      a: 'All ad creatives undergo automated policy inspection and manual dual-reviewer inspection within 2 to 6 hours during operating windows.',
    },
    {
      q: 'When do promoter revenue settlements process?',
      a: 'Performance earnings from verified viewable impressions and clicks settle every 30 minutes into pending balances, clearing to available cash wallets post the 72-hour fraud hold.',
    },
    {
      q: 'How do I install the Website Ad Space SDK?',
      a: 'Navigate to Website Inventory -> Websites & Verification, copy your site meta tag to verify domain ownership, then generate placement script tags.',
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
              Asynchronous Helpdesk
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Ticketed Support &amp; Knowledge Base</span>
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Help &amp; Support Center
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Direct asynchronous ticket communication with CrimFig technical staff, billing support, and ad policy specialists.
          </p>
        </div>

        {/* Tab switch buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            type="button"
            onClick={() => setActiveTab('tickets')}
            aria-pressed={activeTab === 'tickets'}
            variant={activeTab === 'tickets' ? 'default' : 'outline'}
            size="sm"
          >
            My Tickets ({tickets.length})
          </Button>
          <Button
            type="button"
            onClick={() => setActiveTab('new_ticket')}
            aria-pressed={activeTab === 'new_ticket'}
            variant={activeTab === 'new_ticket' ? 'default' : 'outline'}
            size="sm"
          >
            <Plus style={{ width: 14, height: 14 }} />
            <span>New Ticket</span>
          </Button>
          <Button
            type="button"
            onClick={() => setActiveTab('faq')}
            aria-pressed={activeTab === 'faq'}
            variant={activeTab === 'faq' ? 'default' : 'outline'}
            size="sm"
          >
            Knowledge Base
          </Button>
        </div>
      </div>

      {submitSuccess && (
        <div style={{ padding: '12px 16px', borderRadius: '8px', backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 style={{ width: 16, height: 16 }} />
          <span>Support ticket submitted successfully. A specialist will review and reply directly in this thread.</span>
        </div>
      )}

      {/* TAB 1: TICKETS LIST */}
      {activeTab === 'tickets' && (
        <div className="theme-card" style={{ padding: '24px', borderRadius: '16px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>
            Active Ticket Inquiries
          </h3>

          {tickets.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
              No open support tickets. Everything is running smoothly!
            </div>
          ) : (
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
                    <div style={{ marginTop: '2px' }}>Priority: {t.priority.toUpperCase()}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CREATE TICKET FORM */}
      {activeTab === 'new_ticket' && (
        <form onSubmit={handleCreateTicket} className="theme-card" style={{ padding: '28px', borderRadius: '16px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Submit an Asynchronous Inquiry
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
            Provide thorough details so our staff can review your account logs and respond accurately without back-and-forth delays.
          </p>

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
              <option value="campaign_moderation">Campaign Review &amp; Creative Moderation</option>
              <option value="billing">Billing, Escrow &amp; Payouts</option>
              <option value="technical">Website Space SDK &amp; Integration</option>
              <option value="fraud_dispute">Traffic Quality &amp; Fraud Audit</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label htmlFor="support-ticket-subject" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>Subject</label>
            <Input
              id="support-ticket-subject"
              type="text"
              placeholder="Brief summary of inquiry..."
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label htmlFor="support-ticket-message" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>Detailed Description</label>
            <Textarea
              id="support-ticket-message"
              rows={5}
              placeholder="Include relevant Campaign IDs, Domain Names, or Transaction references..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            style={{ marginTop: '8px' }}
            size="lg"
          >
            <Send style={{ width: 14, height: 14 }} />
            <span>{isSubmitting ? 'Submitting...' : 'Submit Ticket'}</span>
          </Button>
        </form>
      )}

      {/* TAB 3: KNOWLEDGE BASE */}
      {activeTab === 'faq' && (
        <div className="theme-card" style={{ padding: '24px', borderRadius: '16px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>
            Frequently Asked Questions
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
