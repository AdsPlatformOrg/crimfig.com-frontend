'use client';

import React, { useState, useEffect } from 'react';
import {
  AdsConversionItem,
  AdvertiserApiKeyItem,
} from '../../../types/conversions';
import {
  fetchConversions,
  fetchApiKeys,
  createApiKey,
  revokeApiKey,
  reverseConversion,
} from '../../../lib/conversions-api';

interface ConversionsTabProps {
  advertiserId?: string;
}

export function ConversionsTab({ advertiserId = 'adv_demo_9841' }: ConversionsTabProps) {
  const [subTab, setSubTab] = useState<'events' | 'pixel' | 'postback' | 'apikeys'>('events');
  const [conversions, setConversions] = useState<AdsConversionItem[]>([]);
  const [apiKeys, setApiKeys] = useState<AdvertiserApiKeyItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // New API Key Modal State
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyScopes, setNewKeyScopes] = useState('conversions:write');
  const [generatedKeyResult, setGeneratedKeyResult] = useState<AdvertiserApiKeyItem | null>(null);
  const [isGeneratingKey, setIsGeneratingKey] = useState(false);

  // Reverse Modal State
  const [reverseTarget, setReverseTarget] = useState<AdsConversionItem | null>(null);
  const [reverseReason, setReverseReason] = useState('Customer refunded order within 72h window');
  const [isReversing, setIsReversing] = useState(false);

  // Copied feedback tracker
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      const [convData, keysData] = await Promise.all([
        fetchConversions(),
        fetchApiKeys(),
      ]);
      setConversions(convData);
      setApiKeys(keysData);
      setIsLoading(false);
    }
    load();
  }, []);

  // Summary Metrics
  const attributedCount = conversions.filter(c => c.status === 'attributed').length;
  const totalRevenue = conversions
    .filter(c => c.status === 'attributed')
    .reduce((sum, c) => sum + (c.valueUsd || 0), 0);
  const totalCharged = conversions
    .filter(c => c.status === 'attributed')
    .reduce((sum, c) => sum + (c.chargedUsd || 0), 0);
  const avgCpa = attributedCount > 0 ? (totalCharged / attributedCount).toFixed(2) : '0.00';

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleCreateApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    setIsGeneratingKey(true);
    try {
      const created = await createApiKey(newKeyName.trim(), newKeyScopes);
      setGeneratedKeyResult(created);
      setApiKeys(prev => [created, ...prev]);
    } catch (err) {
      // Demo fallback if backend offline
      const mockKey: AdvertiserApiKeyItem = {
        id: `key_${Date.now()}`,
        advertiserId,
        name: newKeyName.trim(),
        prefix: `cf_adv_live_${Math.random().toString(36).substring(2, 6)}`,
        scopes: newKeyScopes,
        rawSecretKey: `cf_sec_${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`,
        createdAt: new Date().toISOString(),
      };
      setGeneratedKeyResult(mockKey);
      setApiKeys(prev => [mockKey, ...prev]);
    } finally {
      setIsGeneratingKey(false);
    }
  };

  const handleRevokeKey = async (id: string) => {
    if (!confirm('Are you sure you want to revoke this API key? Any automated S2S postback scripts using it will fail immediately.')) {
      return;
    }
    await revokeApiKey(id);
    setApiKeys(prev => prev.map(k => k.id === id ? { ...k, revokedAt: new Date().toISOString() } : k));
  };

  const handleReverseConversion = async () => {
    if (!reverseTarget) return;
    setIsReversing(true);
    await reverseConversion(reverseTarget.id, reverseReason);
    setConversions(prev => prev.map(c => c.id === reverseTarget.id ? { ...c, status: 'reversed' } : c));
    setIsReversing(false);
    setReverseTarget(null);
  };

  const pixelSnippet = `<!-- CrimFig Universal Conversion Pixel -->
<script
  src="https://ads.crimfig.com/api/v1/px.js"
  data-cf-adv="${advertiserId}"
  async
></script>`;

  const trackEventSnippet = `// Trigger purchase conversion on checkout success
window.cfq = window.cfq || [];
window.cfq.push(['track', 'purchase', {
  orderId: 'ORD-98421',
  value: 85.00,
  currency: 'USD',
  itemsCount: 3
}]);`;

  const curlSnippet = `curl -X POST https://ads.crimfig.com/api/v1/conversions \\
  -H "Authorization: Bearer YOUR_SECRET_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "clickId": "clk_20261017_9a8b7c6d5e4f3a2b",
    "event": "purchase",
    "orderId": "ORD-98421",
    "value": 85.00,
    "currency": "USD"
  }'`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header & Subtitle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Conversion Tracking & CPA Attribution
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 0' }}>
            Measure real-world sales, leads, and signups. Unlock outcome-based CPA bidding and 72-hour fraud protection.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => {
              setGeneratedKeyResult(null);
              setNewKeyName('');
              setIsKeyModalOpen(true);
            }}
            style={{
              padding: '9px 16px',
              backgroundColor: 'var(--color-crimson)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: 'var(--shadow-crimson)',
            }}
          >
            <span>+</span> Generate S2S API Key
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div style={{ padding: '20px', borderRadius: '12px', background: 'var(--card-bg, #FFFFFF)', border: '1px solid var(--border-color)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Attributed Conversions
          </span>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '6px' }}>
            {attributedCount.toLocaleString()}
          </div>
          <span style={{ fontSize: '12px', color: '#10B981', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
            ✓ Verified with signed click IDs
          </span>
        </div>

        <div style={{ padding: '20px', borderRadius: '12px', background: 'var(--card-bg, #FFFFFF)', border: '1px solid var(--border-color)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Attributed Revenue
          </span>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-crimson)', marginTop: '6px' }}>
            ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
            Gross merchandise value (GMV)
          </span>
        </div>

        <div style={{ padding: '20px', borderRadius: '12px', background: 'var(--card-bg, #FFFFFF)', border: '1px solid var(--border-color)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Average CPA Cost
          </span>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '6px' }}>
            ${avgCpa}
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
            Cost per verified acquisition
          </span>
        </div>

        <div style={{ padding: '20px', borderRadius: '12px', background: 'var(--card-bg, #FFFFFF)', border: '1px solid var(--border-color)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Fraud Protection Hold
          </span>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#3B82F6', marginTop: '6px' }}>
            72 Hours
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
            Reversible refund clearance window
          </span>
        </div>
      </div>

      {/* Sub-Tabs Selector */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '2px' }}>
        {[
          { key: 'events', label: 'Conversions Ledger' },
          { key: 'pixel', label: 'Web Pixel' },
          { key: 'postback', label: 'Server-to-Server (S2S)' },
          { key: 'apikeys', label: 'Advertiser API Keys' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setSubTab(t.key as any)}
            style={{
              padding: '10px 18px',
              fontSize: '13px',
              fontWeight: subTab === t.key ? 700 : 500,
              color: subTab === t.key ? 'var(--color-crimson)' : 'var(--text-muted)',
              background: 'none',
              border: 'none',
              borderBottom: subTab === t.key ? '2px solid var(--color-crimson)' : '2px solid transparent',
              cursor: 'pointer',
              marginBottom: '-2px',
              transition: 'all 0.15s ease',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1: Conversions Ledger */}
      {subTab === 'events' && (
        <div style={{ background: 'var(--card-bg, #FFFFFF)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
              Recent Conversion Events ({conversions.length})
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Deduplicated by (order_id + event)
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: 'var(--bg-secondary, #F8FAFC)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '12px 18px', fontWeight: 600 }}>Order ID / Event</th>
                  <th style={{ padding: '12px 18px', fontWeight: 600 }}>Campaign</th>
                  <th style={{ padding: '12px 18px', fontWeight: 600 }}>Value</th>
                  <th style={{ padding: '12px 18px', fontWeight: 600 }}>Source</th>
                  <th style={{ padding: '12px 18px', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '12px 18px', fontWeight: 600 }}>72h Holdback</th>
                  <th style={{ padding: '12px 18px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {conversions.map((conv) => {
                  const isHoldbackActive = conv.holdbackReleaseAt && new Date(conv.holdbackReleaseAt) > new Date();
                  return (
                    <tr key={conv.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{conv.orderId || 'N/A'}</div>
                        <div style={{ fontSize: '11px', color: 'var(--color-crimson)', textTransform: 'uppercase', fontWeight: 600, marginTop: '2px' }}>
                          {conv.event}
                        </div>
                      </td>
                      <td style={{ padding: '14px 18px', color: 'var(--text-secondary)' }}>
                        <div>{conv.campaignTitle}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                          {conv.clickId?.substring(0, 18)}...
                        </div>
                      </td>
                      <td style={{ padding: '14px 18px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {conv.valueUsd && conv.valueUsd > 0 ? `$${conv.valueUsd.toFixed(2)}` : '—'}
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 600,
                          backgroundColor: conv.source === 's2s' ? '#EEF2FF' : '#F0FDF4',
                          color: conv.source === 's2s' ? '#4F46E5' : '#166534',
                        }}>
                          {conv.source.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '9999px',
                          fontSize: '11px',
                          fontWeight: 600,
                          backgroundColor:
                            conv.status === 'attributed' ? 'rgba(16, 185, 129, 0.1)' :
                            conv.status === 'duplicate' ? 'rgba(234, 179, 8, 0.1)' :
                            conv.status === 'reversed' ? 'rgba(239, 68, 68, 0.1)' : '#F1F5F9',
                          color:
                            conv.status === 'attributed' ? '#10B981' :
                            conv.status === 'duplicate' ? '#CA8A04' :
                            conv.status === 'reversed' ? '#EF4444' : '#64748B',
                        }}>
                          {conv.status.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        {conv.status === 'attributed' ? (
                          isHoldbackActive ? (
                            <span style={{ fontSize: '11px', color: '#3B82F6', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}>
                              ⏱ Pending Clearance
                            </span>
                          ) : (
                            <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 500 }}>
                              ✓ Settled & Released
                            </span>
                          )
                        ) : (
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>—</span>
                        )}
                      </td>
                      <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                        {conv.status === 'attributed' && isHoldbackActive && (
                          <button
                            onClick={() => setReverseTarget(conv)}
                            style={{
                              padding: '5px 10px',
                              fontSize: '11px',
                              fontWeight: 600,
                              color: '#EF4444',
                              background: 'rgba(239, 68, 68, 0.08)',
                              border: '1px solid rgba(239, 68, 68, 0.2)',
                              borderRadius: '6px',
                              cursor: 'pointer',
                            }}
                          >
                            Reverse Refund
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Web Pixel */}
      {subTab === 'pixel' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'var(--card-bg, #FFFFFF)', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 8px', color: 'var(--text-primary)' }}>
              1. Add CrimFig Pixel to your Website
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 16px' }}>
              Paste this lightweight snippet into the <code style={{ color: 'var(--color-crimson)' }}>&lt;head&gt;</code> of all your web pages. It automatically preserves the signed <code style={{ color: 'var(--color-crimson)' }}>cf_click</code> identifier in a first-party cookie for 30 days.
            </p>

            <div style={{ position: 'relative', background: '#171B2A', borderRadius: '8px', padding: '16px', overflowX: 'auto' }}>
              <pre style={{ margin: 0, color: '#E2E8F0', fontSize: '12px', fontFamily: 'monospace' }}>
                {pixelSnippet}
              </pre>
              <button
                onClick={() => handleCopy(pixelSnippet, 'pixel_snippet')}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  padding: '5px 10px',
                  backgroundColor: copiedKey === 'pixel_snippet' ? '#10B981' : 'var(--color-crimson)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {copiedKey === 'pixel_snippet' ? '✓ Copied' : 'Copy Snippet'}
              </button>
            </div>
          </div>

          <div style={{ background: 'var(--card-bg, #FFFFFF)', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 8px', color: 'var(--text-primary)' }}>
              2. Track Standard & Custom Conversion Events
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 16px' }}>
              Trigger standard events like <code style={{ color: 'var(--color-crimson)' }}>purchase</code>, <code style={{ color: 'var(--color-crimson)' }}>lead</code>, <code style={{ color: 'var(--color-crimson)' }}>sign_up</code>, or <code style={{ color: 'var(--color-crimson)' }}>add_to_cart</code>:
            </p>

            <div style={{ position: 'relative', background: '#171B2A', borderRadius: '8px', padding: '16px', overflowX: 'auto' }}>
              <pre style={{ margin: 0, color: '#E2E8F0', fontSize: '12px', fontFamily: 'monospace' }}>
                {trackEventSnippet}
              </pre>
              <button
                onClick={() => handleCopy(trackEventSnippet, 'track_snippet')}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  padding: '5px 10px',
                  backgroundColor: copiedKey === 'track_snippet' ? '#10B981' : 'var(--color-crimson)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {copiedKey === 'track_snippet' ? '✓ Copied' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Server-to-Server (S2S) */}
      {subTab === 'postback' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'var(--card-bg, #FFFFFF)', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 8px', color: 'var(--text-primary)' }}>
              Server-to-Server (S2S) Postback API
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 16px', lineHeight: 1.6 }}>
              Recommended for e-commerce, banking, and subscription platforms. S2S postbacks are 100% resilient to ad blockers, private browsing modes, and iOS Safari ITP cookie restrictions.
            </p>

            <div style={{ position: 'relative', background: '#171B2A', borderRadius: '8px', padding: '16px', overflowX: 'auto' }}>
              <pre style={{ margin: 0, color: '#E2E8F0', fontSize: '12px', fontFamily: 'monospace' }}>
                {curlSnippet}
              </pre>
              <button
                onClick={() => handleCopy(curlSnippet, 'curl_snippet')}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  padding: '5px 10px',
                  backgroundColor: copiedKey === 'curl_snippet' ? '#10B981' : 'var(--color-crimson)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {copiedKey === 'curl_snippet' ? '✓ Copied' : 'Copy cURL'}
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            <div style={{ background: 'var(--card-bg, #FFFFFF)', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '20px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 700, margin: '0 0 8px', color: 'var(--text-primary)' }}>
                Deduplication Guarantee
              </h4>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                Every event is uniquely keyed by <code style={{ color: 'var(--color-crimson)' }}>(advertiser_id, order_id, event)</code>. If both your browser pixel and backend postback fire for the same purchase, it counts strictly once.
              </p>
            </div>

            <div style={{ background: 'var(--card-bg, #FFFFFF)', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '20px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 700, margin: '0 0 8px', color: 'var(--text-primary)' }}>
                72-Hour Fraud Clearance
              </h4>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                CPA promoter earnings remain in a mandatory 72-hour holdback. If an order is fraudulent or refunded, call <code style={{ color: 'var(--color-crimson)' }}>POST /conversions/:id/reverse</code> to claw back the charge.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: API Keys Manager */}
      {subTab === 'apikeys' && (
        <div style={{ background: 'var(--card-bg, #FFFFFF)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
              Advertiser API Keys ({apiKeys.length})
            </span>
            <button
              onClick={() => {
                setGeneratedKeyResult(null);
                setNewKeyName('');
                setIsKeyModalOpen(true);
              }}
              style={{
                padding: '6px 12px',
                backgroundColor: 'var(--color-crimson)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              + Create Key
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: 'var(--bg-secondary, #F8FAFC)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '12px 18px', fontWeight: 600 }}>Key Name</th>
                  <th style={{ padding: '12px 18px', fontWeight: 600 }}>Prefix</th>
                  <th style={{ padding: '12px 18px', fontWeight: 600 }}>Scopes</th>
                  <th style={{ padding: '12px 18px', fontWeight: 600 }}>Last Used</th>
                  <th style={{ padding: '12px 18px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {apiKeys.map((key) => {
                  const isRevoked = !!key.revokedAt;
                  return (
                    <tr key={key.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '14px 18px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {key.name}
                        {isRevoked && <span style={{ marginLeft: '8px', fontSize: '11px', color: '#EF4444' }}>(Revoked)</span>}
                      </td>
                      <td style={{ padding: '14px 18px', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                        {key.prefix}...
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '11px', backgroundColor: '#F1F5F9', color: '#475569' }}>
                          {key.scopes}
                        </span>
                      </td>
                      <td style={{ padding: '14px 18px', color: 'var(--text-muted)', fontSize: '12px' }}>
                        {key.lastUsedAt ? new Date(key.lastUsedAt).toLocaleString() : 'Never'}
                      </td>
                      <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                        {!isRevoked && (
                          <button
                            onClick={() => handleRevokeKey(key.id)}
                            style={{
                              padding: '5px 10px',
                              fontSize: '11px',
                              color: '#EF4444',
                              background: 'rgba(239, 68, 68, 0.08)',
                              border: '1px solid rgba(239, 68, 68, 0.2)',
                              borderRadius: '6px',
                              cursor: 'pointer',
                            }}
                          >
                            Revoke
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: Generate API Key */}
      {isKeyModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(3px)',
        }}>
          <div style={{
            background: 'var(--card-bg, #FFFFFF)',
            borderRadius: '16px',
            padding: '28px',
            maxWidth: '480px',
            width: '90%',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          }}>
            {!generatedKeyResult ? (
              <form onSubmit={handleCreateApiKey}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 8px', color: 'var(--text-primary)' }}>
                  Create Advertiser API Key
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 20px', lineHeight: 1.5 }}>
                  This key allows your backend to send S2S conversion postbacks to the CrimFig Ads Engine.
                </p>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Key Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Shopify Production Store"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      fontSize: '13px',
                      color: 'var(--text-primary)',
                      background: 'var(--input-bg, #FFFFFF)',
                      outline: 'none',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Scope
                  </label>
                  <select
                    value={newKeyScopes}
                    onChange={(e) => setNewKeyScopes(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      fontSize: '13px',
                      color: 'var(--text-primary)',
                      background: 'var(--input-bg, #FFFFFF)',
                    }}
                  >
                    <option value="conversions:write">conversions:write (Report S2S Conversions)</option>
                    <option value="conversions:write,reports:read">conversions:write + reports:read (Full API Access)</option>
                  </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setIsKeyModalOpen(false)}
                    style={{
                      padding: '9px 16px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      background: 'transparent',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isGeneratingKey}
                    style={{
                      padding: '9px 18px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: 'var(--color-crimson)',
                      color: '#FFFFFF',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: isGeneratingKey ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {isGeneratingKey ? 'Generating...' : 'Generate Key'}
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 8px', color: '#10B981' }}>
                  API Key Created Successfully
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 16px', lineHeight: 1.5 }}>
                  Please copy your secret key now. <strong style={{ color: '#EF4444' }}>It will never be shown again!</strong>
                </p>

                <div style={{ background: '#171B2A', padding: '14px', borderRadius: '8px', marginBottom: '20px', position: 'relative' }}>
                  <code style={{ color: '#E2E8F0', fontSize: '13px', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                    {generatedKeyResult.rawSecretKey || `cf_sec_${generatedKeyResult.prefix}_mock998811`}
                  </code>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button
                    onClick={() => handleCopy(generatedKeyResult.rawSecretKey || `cf_sec_${generatedKeyResult.prefix}_mock998811`, 'created_key')}
                    style={{
                      padding: '9px 18px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: copiedKey === 'created_key' ? '#10B981' : 'var(--color-crimson)',
                      color: '#FFFFFF',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {copiedKey === 'created_key' ? '✓ Copied to Clipboard' : 'Copy Key'}
                  </button>
                  <button
                    onClick={() => {
                      setIsKeyModalOpen(false);
                      setGeneratedKeyResult(null);
                    }}
                    style={{
                      padding: '9px 16px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      background: 'transparent',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      cursor: 'pointer',
                    }}
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: Reverse Conversion */}
      {reverseTarget && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(3px)',
        }}>
          <div style={{
            background: 'var(--card-bg, #FFFFFF)',
            borderRadius: '16px',
            padding: '28px',
            maxWidth: '460px',
            width: '90%',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 8px', color: '#EF4444' }}>
              Reverse Conversion Refund
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 16px', lineHeight: 1.5 }}>
              Reversing order <strong style={{ color: 'var(--text-primary)' }}>{reverseTarget.orderId}</strong> (${reverseTarget.valueUsd?.toFixed(2)}) will cancel promoter payout for this acquisition during the 72h holdback window.
            </p>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Reason for Reversal
              </label>
              <textarea
                rows={3}
                value={reverseReason}
                onChange={(e) => setReverseReason(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  fontSize: '13px',
                  color: 'var(--text-primary)',
                  background: 'var(--input-bg, #FFFFFF)',
                  outline: 'none',
                  resize: 'none',
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setReverseTarget(null)}
                style={{
                  padding: '9px 16px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  background: 'transparent',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isReversing}
                onClick={handleReverseConversion}
                style={{
                  padding: '9px 18px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#EF4444',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: isReversing ? 'not-allowed' : 'pointer',
                }}
              >
                {isReversing ? 'Processing...' : 'Confirm Reversal'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
