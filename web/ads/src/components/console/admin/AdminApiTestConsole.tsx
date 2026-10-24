'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  Lock,
  Unlock,
  SlidersHorizontal,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Layers,
  Activity,
  AlertTriangle,
} from 'lucide-react';
import { apiData } from '../../../lib/api-data';

interface ApiEndpointTest {
  id: string;
  name: string;
  category: 'ads' | 'adstation' | 'billing' | 'auth';
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  route: string;
  authGuard: string;
  isSensitiveSession: boolean; // Mutates cookies, terminates sessions, or clears tokens
  status: 'idle' | 'running' | 'passed' | 'failed' | 'locked';
  lastRunTimeMs?: number;
  responsePreview?: string;
  errorMessage?: string;
}

export function AdminApiTestConsole() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'ads' | 'adstation' | 'billing' | 'auth'>('all');
  const [allowSensitiveSessionTests, setAllowSensitiveSessionTests] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [expandedResponseId, setExpandedResponseId] = useState<string | null>(null);

  const initialTests: ApiEndpointTest[] = [
    // Ads Platform Endpoints
    {
      id: 'ads-summary',
      name: 'Dashboard Summary Analytics',
      category: 'ads',
      method: 'GET',
      route: '/api/v1/analytics/dashboard/summary',
      authGuard: 'CrimfigAuthGuard',
      isSensitiveSession: false,
      status: 'idle',
    },
    {
      id: 'ads-alerts',
      name: 'Account Budget & Moderation Alerts',
      category: 'ads',
      method: 'GET',
      route: '/api/v1/analytics/dashboard/alerts',
      authGuard: 'CrimfigAuthGuard',
      isSensitiveSession: false,
      status: 'idle',
    },
    {
      id: 'ads-campaigns',
      name: 'List Active Campaigns',
      category: 'ads',
      method: 'GET',
      route: '/api/v1/campaigns',
      authGuard: 'CrimfigAuthGuard',
      isSensitiveSession: false,
      status: 'idle',
    },
    {
      id: 'ads-catalog',
      name: 'Marketplace Campaign Catalog',
      category: 'ads',
      method: 'GET',
      route: '/api/v1/campaigns/catalog',
      authGuard: 'Public / CrimsonBearer',
      isSensitiveSession: false,
      status: 'idle',
    },
    {
      id: 'ads-promoters-me',
      name: 'Promoter Profile & Website Status',
      category: 'ads',
      method: 'GET',
      route: '/api/v1/promoters/me',
      authGuard: 'CrimfigAuthGuard',
      isSensitiveSession: false,
      status: 'idle',
    },
    {
      id: 'ads-upload-settings',
      name: 'Creative Asset Storage Quotas',
      category: 'ads',
      method: 'GET',
      route: '/api/v1/uploads/settings',
      authGuard: 'CrimfigAuthGuard',
      isSensitiveSession: false,
      status: 'idle',
    },

    // AdStation & Delivery Endpoints
    {
      id: 'adstation-websites',
      name: 'AdStation Verified Domain Inventory',
      category: 'adstation',
      method: 'GET',
      route: '/api/v1/adstation/websites',
      authGuard: 'CrimfigAuthGuard',
      isSensitiveSession: false,
      status: 'idle',
    },
    {
      id: 'adstation-direct-deals',
      name: 'Direct Deals Invariant Check',
      category: 'adstation',
      method: 'GET',
      route: '/api/v1/adstation/direct-campaigns',
      authGuard: 'CrimfigAuthGuard',
      isSensitiveSession: false,
      status: 'idle',
    },
    {
      id: 'adstation-public-serve',
      name: 'Public Delivery CORS Creative Route',
      category: 'adstation',
      method: 'GET',
      route: '/api/v1/delivery/adstation/health',
      authGuard: 'Public Wildcard (No Cookies)',
      isSensitiveSession: false,
      status: 'idle',
    },

    // Billing & Escrow Endpoints
    {
      id: 'billing-overview',
      name: 'Advertiser Balance & Escrow Overview',
      category: 'billing',
      method: 'GET',
      route: '/api/v1/ads/billing/overview',
      authGuard: 'CrimfigAuthGuard',
      isSensitiveSession: false,
      status: 'idle',
    },
    {
      id: 'billing-settlements',
      name: 'Historical Settlement Batches Log',
      category: 'billing',
      method: 'GET',
      route: '/api/v1/ads/billing/settlements',
      authGuard: 'CrimfigAuthGuard',
      isSensitiveSession: false,
      status: 'idle',
    },

    // Auth & Identity Endpoints (Safe vs Sensitive)
    {
      id: 'auth-me',
      name: 'Authenticated Profile Identity Read',
      category: 'auth',
      method: 'GET',
      route: '/api/v1/auth/me',
      authGuard: 'CrimfigAuthGuard',
      isSensitiveSession: false,
      status: 'idle',
    },
    {
      id: 'auth-csrf-token',
      name: 'CSRF Token & Origin Verification',
      category: 'auth',
      method: 'GET',
      route: '/api/v1/auth/csrf',
      authGuard: 'Public Verified Origin',
      isSensitiveSession: false,
      status: 'idle',
    },
    {
      id: 'auth-logout-sensitive',
      name: 'Session Revocation & Cookie Eviction (SENSITIVE)',
      category: 'auth',
      method: 'POST',
      route: '/api/v1/auth/logout',
      authGuard: 'CrimfigAuthGuard',
      isSensitiveSession: true, // DESTROYS ACTIVE SESSION
      status: 'locked',
    },
    {
      id: 'auth-rotate-family-sensitive',
      name: 'Multi-Device Family Token Revocation (SENSITIVE)',
      category: 'auth',
      method: 'POST',
      route: '/api/v1/auth/session/terminate-all',
      authGuard: 'CrimfigAuthGuard',
      isSensitiveSession: true, // DESTROYS ACTIVE SESSIONS
      status: 'locked',
    },
  ];

  const [tests, setTests] = useState<ApiEndpointTest[]>(initialTests);

  const filteredTests = tests.filter((t) => {
    if (selectedCategory === 'all') return true;
    return t.category === selectedCategory;
  });

  const passedCount = tests.filter((t) => t.status === 'passed').length;
  const failedCount = tests.filter((t) => t.status === 'failed').length;
  const lockedCount = tests.filter((t) => t.isSensitiveSession && !allowSensitiveSessionTests).length;

  const runTest = async (testId: string) => {
    const target = tests.find((t) => t.id === testId);
    if (!target) return;

    if (target.isSensitiveSession && !allowSensitiveSessionTests) {
      return; // Locked: do not harm cookies or tokens
    }

    setTests((prev) =>
      prev.map((t) => (t.id === testId ? { ...t, status: 'running', errorMessage: undefined } : t))
    );

    const startTime = performance.now();

    try {
      // Execute non-destructive probe with isolated headers
      const res = await apiData(target.route, {
        method: target.method,
        headers: {
          'X-Crimfig-Diagnostic-Test': 'true',
          ...(allowSensitiveSessionTests ? { 'X-Allow-Sensitive-Session-Tests': 'true' } : {}),
        },
      });

      const elapsed = Math.round(performance.now() - startTime);

      setTests((prev) =>
        prev.map((t) =>
          t.id === testId
            ? {
                ...t,
                status: 'passed',
                lastRunTimeMs: elapsed,
                responsePreview: JSON.stringify(res, null, 2),
              }
            : t
        )
      );
    } catch (err: any) {
      const elapsed = Math.round(performance.now() - startTime);

      setTests((prev) =>
        prev.map((t) =>
          t.id === testId
            ? {
                ...t,
                status: 'failed',
                lastRunTimeMs: elapsed,
                errorMessage: err?.message || 'Request failed',
                responsePreview: JSON.stringify(
                  {
                    error: err?.name || 'Error',
                    message: err?.message || 'Request returned an error or non-2xx status code',
                    status: 'failed',
                  },
                  null,
                  2
                ),
              }
            : t
        )
      );
    }
  };

  const runAllSafeTests = async () => {
    for (const test of tests) {
      if (!test.isSensitiveSession || allowSensitiveSessionTests) {
        await runTest(test.id);
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Header & Settings Trigger */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              API Unit & Integration Test Suite
            </h1>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: '9999px',
                backgroundColor: 'var(--badge-bg)',
                color: 'var(--color-crimson)',
              }}
            >
              ADMIN CONSOLE
            </span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '6px 0 0' }}>
            Comprehensive endpoint test harness. Cookie and session-destructive tests are strictly guarded.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={() => setShowSettingsModal(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <SlidersHorizontal size={15} />
            <span>Unit Test Settings</span>
          </button>

          <button
            type="button"
            onClick={runAllSafeTests}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              backgroundColor: 'var(--color-crimson)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: 'var(--shadow-crimson)',
            }}
          >
            <Play size={15} />
            <span>Run All Safe Tests</span>
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div style={{ padding: '16px 20px', borderRadius: '12px', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>TOTAL ENDPOINTS</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>{tests.length}</div>
        </div>

        <div style={{ padding: '16px 20px', borderRadius: '12px', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-success)' }}>PASSED</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-success)', marginTop: '4px' }}>{passedCount}</div>
        </div>

        <div style={{ padding: '16px 20px', borderRadius: '12px', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-error)' }}>FAILED</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-error)', marginTop: '4px' }}>{failedCount}</div>
        </div>

        <div style={{ padding: '16px 20px', borderRadius: '12px', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>SESSION PROTECTED</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-secondary)', marginTop: '4px' }}>{lockedCount}</div>
        </div>
      </div>

      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px', flexWrap: 'wrap' }}>
        {(['all', 'ads', 'adstation', 'billing', 'auth'] as const).map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: selectedCategory === cat ? 'var(--color-crimson)' : 'transparent',
              color: selectedCategory === cat ? '#FFFFFF' : 'var(--text-secondary)',
              transition: 'all 0.15s ease',
            }}
          >
            {cat === 'all' ? 'All Endpoints' : cat === 'ads' ? 'Ads Platform' : cat === 'adstation' ? 'AdStation & Delivery' : cat === 'billing' ? 'Billing & Escrow' : 'Auth & Security'}
          </button>
        ))}
      </div>

      {/* Endpoints Table */}
      <div style={{ backgroundColor: 'var(--bg-elevated)', borderRadius: '12px', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase' }}>
              <th style={{ padding: '12px 16px' }}>Endpoint</th>
              <th style={{ padding: '12px 16px' }}>Method</th>
              <th style={{ padding: '12px 16px' }}>Auth Guard</th>
              <th style={{ padding: '12px 16px' }}>Safety Invariant</th>
              <th style={{ padding: '12px 16px' }}>Status</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredTests.map((test) => {
              const isLocked = test.isSensitiveSession && !allowSensitiveSessionTests;
              const isExpanded = expandedResponseId === test.id;

              return (
                <React.Fragment key={test.id}>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{test.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'monospace', marginTop: '2px' }}>
                        {test.route}
                      </div>
                      {test.status === 'failed' && test.errorMessage && (
                        <div style={{ fontSize: '11px', color: 'var(--color-crimson)', marginTop: '4px', fontWeight: 500 }}>
                          Error: {test.errorMessage}
                        </div>
                      )}
                    </td>

                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          backgroundColor: test.method === 'GET' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(212, 20, 58, 0.15)',
                          color: test.method === 'GET' ? '#3B82F6' : 'var(--color-crimson)',
                        }}
                      >
                        {test.method}
                      </span>
                    </td>

                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>
                      {test.authGuard}
                    </td>

                    <td style={{ padding: '14px 16px' }}>
                      {test.isSensitiveSession ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--color-warning)', fontWeight: 600, fontSize: '11px' }}>
                          <AlertTriangle size={13} />
                          <span>Mutates Cookies/Session</span>
                        </span>
                      ) : (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--color-success)', fontWeight: 600, fontSize: '11px' }}>
                          <ShieldCheck size={13} />
                          <span>Non-Destructive</span>
                        </span>
                      )}
                    </td>

                    <td style={{ padding: '14px 16px' }}>
                      {isLocked ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>
                          <Lock size={12} />
                          <span>Protected</span>
                        </span>
                      ) : test.status === 'passed' ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 700, color: 'var(--color-success)' }}>
                          <CheckCircle2 size={13} />
                          <span>Passed ({test.lastRunTimeMs}ms)</span>
                        </span>
                      ) : test.status === 'failed' ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 700, color: 'var(--color-crimson)' }}>
                          <XCircle size={13} />
                          <span>Failed ({test.lastRunTimeMs}ms)</span>
                        </span>
                      ) : test.status === 'running' ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 600, color: 'var(--color-crimson)' }}>
                          <Activity size={13} className="spin" />
                          <span>Testing...</span>
                        </span>
                      ) : (
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Ready</span>
                      )}
                    </td>

                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        {test.responsePreview && (
                          <button
                            type="button"
                            onClick={() => setExpandedResponseId(isExpanded ? null : test.id)}
                            style={{
                              padding: '4px 8px',
                              borderRadius: '6px',
                              backgroundColor: 'transparent',
                              border: '1px solid var(--border-subtle)',
                              color: 'var(--text-secondary)',
                              fontSize: '11px',
                              cursor: 'pointer',
                            }}
                          >
                            {isExpanded ? 'Hide Payload' : 'View Payload'}
                          </button>
                        )}

                        <button
                          type="button"
                          disabled={isLocked || test.status === 'running'}
                          onClick={() => runTest(test.id)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            backgroundColor: isLocked ? 'var(--bg-surface)' : 'var(--color-crimson)',
                            color: isLocked ? 'var(--text-muted)' : '#FFFFFF',
                            border: 'none',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: isLocked ? 'not-allowed' : 'pointer',
                          }}
                        >
                          Run
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Response Payload Inspector Drawer */}
                  {isExpanded && test.responsePreview && (
                    <tr style={{ backgroundColor: 'var(--bg-surface)' }}>
                      <td colSpan={6} style={{ padding: '12px 16px' }}>
                        <pre style={{ margin: 0, padding: '12px', backgroundColor: 'var(--bg-elevated)', borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-primary)', overflowX: 'auto', maxHeight: '180px' }}>
                          {test.responsePreview}
                        </pre>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Admin Unit Test Settings Modal with Session Protection Override */}
      {showSettingsModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px',
          }}
        >
          <div
            style={{
              maxWidth: '520px',
              width: '100%',
              backgroundColor: 'var(--bg-elevated)',
              borderRadius: '16px',
              border: '1px solid var(--border-subtle)',
              padding: '24px',
              boxShadow: 'var(--shadow-lg)',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Admin Unit Test Settings
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                Configure endpoint test safety levels and session protection invariants.
              </p>
            </div>

            <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Enable Sensitive Session Tests
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Permits tests on `/api/v1/auth/logout` and session termination endpoints.
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={allowSensitiveSessionTests}
                  onChange={(e) => setAllowSensitiveSessionTests(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--color-crimson)', cursor: 'pointer' }}
                />
              </div>

              {allowSensitiveSessionTests && (
                <div style={{ padding: '10px 12px', borderRadius: '8px', backgroundColor: 'rgba(212, 20, 58, 0.1)', color: 'var(--color-crimson)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertTriangle size={16} />
                  <span>WARNING: Running sensitive tests will revoke active session cookies!</span>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setShowSettingsModal(false)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--color-crimson)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
