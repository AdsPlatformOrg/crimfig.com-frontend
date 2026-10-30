'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  ExternalLink,
  Filter,
  Mail,
  RefreshCw,
  RotateCcw,
  Server,
} from 'lucide-react';
import { AuthAdminGuard } from './AuthAdminGuard';
import { consentSession } from '../lib/consent';
import { Badge, Button, Card, Input } from './ui';

export interface ErrorMonitorSummary {
  totalGroups: number;
  totalOccurrences: number;
  server5xxGroups: number;
  financialAlertGroups: number;
  monitorOnlyGroups: number;
  providerAcceptedGroups: number;
  suppressedDuplicateCount: number;
  failedEmailGroups: number;
  runtimePolicy: {
    environment: string;
    captureEnabled: boolean;
    emailEnabled: boolean;
    recipientsCount: number;
    suppressionWindowMinutes: number;
    excludedStatuses: number[];
  };
}

export interface ErrorMonitorGroupItem {
  id: string;
  fingerprint: string;
  environment: string;
  service: string;
  source: string;
  httpMethod: string;
  normalizedRoute: string;
  statusCode: number;
  severity: string;
  errorCategory: string;
  safeSummary: string;
  isFinancialRoute: boolean;
  financialCategory: string | null;
  emailEligibility: 'eligible' | 'excluded_by_policy';
  exclusionReason: string | null;
  notificationState: string;
  emailStatusLabel: string;
  occurrenceCount: number;
  sampledOccurrenceCount: number;
  windowSuppressedCount: number;
  firstSeenAt: string;
  lastSeenAt: string;
  lastRequestId: string | null;
  railwayLogUrl: string | null;
}

export interface ErrorMonitorOccurrenceItem {
  id: string;
  groupId: string;
  requestId: string;
  correlationId: string | null;
  environment: string;
  service: string;
  deploymentId: string | null;
  source: string;
  httpMethod: string;
  normalizedRoute: string;
  statusCode: number;
  errorCategory: string;
  safeSummary: string;
  upstreamService: string | null;
  upstreamStatusCode: number | null;
  actorUserId: string | null;
  railwayLogUrl: string | null;
  occurredAt: string;
}

export interface ErrorMonitorSourceItem {
  service: string;
  displayName: string;
  sourceType: 'server' | 'browser';
  status: 'active' | 'not_reporting' | 'paused' | 'uninstrumented';
  captureEnabled: boolean;
  statusNote: string;
  lastHeartbeatAt: string | null;
  lastEventAt: string | null;
}

export interface FilterState {
  environment: string;
  service: string;
  timeRange: '1h' | '24h' | '7d' | '30d' | 'all';
  statusClass: string;
  source: string;
  emailState: string;
  route: string;
  errorCategory: string;
  requestId: string;
}

const DEFAULT_FILTERS: FilterState = {
  environment: 'all',
  service: 'all',
  timeRange: '24h',
  statusClass: 'all',
  source: 'all',
  emailState: 'all',
  route: '',
  errorCategory: '',
  requestId: '',
};

function readInitialFiltersFromUrl(): FilterState {
  if (typeof window === 'undefined' || !window.location?.search) {
    return { ...DEFAULT_FILTERS };
  }
  const params = new URLSearchParams(window.location.search);
  return {
    environment: params.get('environment') || 'all',
    service: params.get('service') || 'all',
    timeRange: (params.get('timeRange') as FilterState['timeRange']) || '24h',
    statusClass: params.get('statusClass') || 'all',
    source: params.get('source') || 'all',
    emailState: params.get('emailState') || 'all',
    route: params.get('route') || '',
    errorCategory: params.get('errorCategory') || '',
    requestId: params.get('requestId') || '',
  };
}

function syncFiltersToUrl(filters: FilterState) {
  if (typeof window === 'undefined' || !window.history?.replaceState) return;
  const params = new URLSearchParams();
  if (filters.environment !== 'all') params.set('environment', filters.environment);
  if (filters.service !== 'all') params.set('service', filters.service);
  if (filters.timeRange !== '24h') params.set('timeRange', filters.timeRange);
  if (filters.statusClass !== 'all') params.set('statusClass', filters.statusClass);
  if (filters.source !== 'all') params.set('source', filters.source);
  if (filters.emailState !== 'all') params.set('emailState', filters.emailState);
  if (filters.route.trim()) params.set('route', filters.route.trim());
  if (filters.errorCategory.trim()) params.set('errorCategory', filters.errorCategory.trim());
  if (filters.requestId.trim()) params.set('requestId', filters.requestId.trim());

  const query = params.toString();
  const nextUrl = query ? `${window.location.pathname}?${query}` : window.location.pathname;
  window.history.replaceState(null, '', nextUrl);
}

export function ErrorMonitorView() {
  return (
    <AuthAdminGuard requiredRole="super_admin">
      <ErrorMonitorAuthedConsole />
    </AuthAdminGuard>
  );
}

function ErrorMonitorAuthedConsole() {
  const [draftFilters, setDraftFilters] = useState<FilterState>(() => readInitialFiltersFromUrl());
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(() => readInitialFiltersFromUrl());
  const [summary, setSummary] = useState<ErrorMonitorSummary | null>(null);
  const [groups, setGroups] = useState<ErrorMonitorGroupItem[]>([]);
  const [correlatedChain, setCorrelatedChain] = useState<ErrorMonitorOccurrenceItem[]>([]);
  const [sources, setSources] = useState<ErrorMonitorSourceItem[]>([]);
  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(null);
  const [groupDetails, setGroupDetails] = useState<
    Record<
      string,
      {
        occurrences: ErrorMonitorOccurrenceItem[];
        correlatedOccurrences: ErrorMonitorOccurrenceItem[];
      }
    >
  >({});
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadMonitorData = useCallback(async (activeFilters: FilterState) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : 'https://auth.crimfig.com';
      const summaryUrl = new URL('/api/v1/admin/error-monitor/summary', origin);
      const errorsUrl = new URL('/api/v1/admin/error-monitor/errors', origin);
      const sourcesUrl = new URL('/api/v1/admin/error-monitor/sources', origin);

      if (activeFilters.environment !== 'all') {
        summaryUrl.searchParams.set('environment', activeFilters.environment);
        errorsUrl.searchParams.set('environment', activeFilters.environment);
        sourcesUrl.searchParams.set('environment', activeFilters.environment);
      }
      if (activeFilters.service !== 'all') {
        summaryUrl.searchParams.set('service', activeFilters.service);
        errorsUrl.searchParams.set('service', activeFilters.service);
      }
      summaryUrl.searchParams.set('timeRange', activeFilters.timeRange);
      errorsUrl.searchParams.set('timeRange', activeFilters.timeRange);

      if (activeFilters.statusClass === '4xx' || activeFilters.statusClass === '5xx') {
        errorsUrl.searchParams.set('statusClass', activeFilters.statusClass);
      } else if (/^\d{3}$/.test(activeFilters.statusClass)) {
        errorsUrl.searchParams.set('statusCode', activeFilters.statusClass);
      }
      if (activeFilters.source !== 'all') {
        errorsUrl.searchParams.set('source', activeFilters.source);
      }
      if (activeFilters.emailState !== 'all') {
        errorsUrl.searchParams.set('emailState', activeFilters.emailState);
      }
      if (activeFilters.route.trim()) {
        errorsUrl.searchParams.set('route', activeFilters.route.trim());
      }
      if (activeFilters.errorCategory.trim()) {
        errorsUrl.searchParams.set('errorCategory', activeFilters.errorCategory.trim());
      }
      if (activeFilters.requestId.trim()) {
        errorsUrl.searchParams.set('requestId', activeFilters.requestId.trim());
      }

      const [summaryRes, errorsRes, sourcesRes] = await Promise.all([
        consentSession().request(summaryUrl, { headers: { Accept: 'application/json' } }),
        consentSession().request(errorsUrl, { headers: { Accept: 'application/json' } }),
        consentSession().request(sourcesUrl, { headers: { Accept: 'application/json' } }),
      ]);

      if (!summaryRes.ok || !errorsRes.ok || !sourcesRes.ok) {
        throw new Error('Could not load Platform Error Monitor telemetry.');
      }

      const [summaryJson, errorsJson, sourcesJson] = await Promise.all([
        summaryRes.json(),
        errorsRes.json(),
        sourcesRes.json(),
      ]);

      setSummary(summaryJson?.data ?? null);
      setGroups(Array.isArray(errorsJson?.data?.items) ? errorsJson.data.items : []);
      setCorrelatedChain(
        Array.isArray(errorsJson?.data?.correlatedOccurrences)
          ? errorsJson.data.correlatedOccurrences
          : [],
      );
      setSources(Array.isArray(sourcesJson?.data) ? sourcesJson.data : []);
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Failed to load platform error monitor data.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadMonitorData(appliedFilters);
  }, [appliedFilters, loadMonitorData]);

  const handleApplyFilters = () => {
    const next = { ...draftFilters };
    syncFiltersToUrl(next);
    setAppliedFilters(next);
  };

  const handleResetFilters = () => {
    const reset = { ...DEFAULT_FILTERS };
    setDraftFilters(reset);
    syncFiltersToUrl(reset);
    setAppliedFilters(reset);
  };

  const handleToggleExpand = async (groupId: string) => {
    if (expandedGroupId === groupId) {
      setExpandedGroupId(null);
      return;
    }
    setExpandedGroupId(groupId);
    if (groupDetails[groupId]) return;

    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : 'https://auth.crimfig.com';
      const detailUrl = new URL(`/api/v1/admin/error-monitor/errors/${groupId}`, origin);
      const res = await consentSession().request(detailUrl, {
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        const json = await res.json();
        setGroupDetails((prev) => ({
          ...prev,
          [groupId]: {
            occurrences: Array.isArray(json?.data?.occurrences) ? json.data.occurrences : [],
            correlatedOccurrences: Array.isArray(json?.data?.correlatedOccurrences)
              ? json.data.correlatedOccurrences
              : [],
          },
        }));
      }
    } catch {
      // Non-fatal detail expansion error
    }
  };

  return (
    <div
      style={{
        maxWidth: '1240px',
        width: '100%',
        boxSizing: 'border-box',
        margin: '0 auto',
        padding: '28px 16px 48px',
        fontFamily: "'Poppins', Arial, Helvetica, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '18px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1 1 260px', minWidth: 0 }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              flexShrink: 0,
              borderRadius: '12px',
              backgroundColor: 'rgba(212, 20, 58, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-crimson)',
            }}
          >
            <Activity size={24} />
          </div>
          <div style={{ minWidth: 0, overflowWrap: 'anywhere' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Platform Error Monitor
              </h1>
              <Badge variant="secondary" style={{ color: 'var(--color-crimson)', fontWeight: 700 }}>
                super_admin
              </Badge>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
              Sanitized HTTP 4xx/5xx telemetry, cross-service request correlation, and Brevo email suppression windows.
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          <Button
            type="button"
            variant="outline"
            onClick={() => void loadMonitorData(appliedFilters)}
          >
            <RefreshCw size={14} />
            <span>Refresh</span>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin">
              <ArrowLeft size={14} />
              <span>Admin Overview</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      {summary && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 210px), 1fr))',
            gap: '14px',
            marginBottom: '24px',
          }}
        >
          <Card style={{ padding: '16px', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Captured Error Groups
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
              {summary.totalGroups}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {summary.totalOccurrences} total occurrences
            </div>
          </Card>

          <Card style={{ padding: '16px', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Email-Eligible (5xx &amp; Financial)
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-crimson)', marginTop: '4px' }}>
              {summary.server5xxGroups + summary.financialAlertGroups}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {summary.server5xxGroups} server 5xx • {summary.financialAlertGroups} financial
            </div>
          </Card>

          <Card style={{ padding: '16px', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Monitor Only (Policy Excluded)
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
              {summary.monitorOnlyGroups}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              403 / 404 / 429 &amp; non-financial 4xx
            </div>
          </Card>

          <Card style={{ padding: '16px', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Email Outbox &amp; Suppression
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
              {summary.providerAcceptedGroups} accepted
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {summary.suppressedDuplicateCount} duplicates suppressed ({summary.runtimePolicy.suppressionWindowMinutes}m window)
            </div>
          </Card>
        </div>
      )}

      {/* Filter Bar */}
      <Card
        style={{
          padding: '20px',
          backgroundColor: 'var(--bg-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '14px',
          marginBottom: '24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <Filter size={16} color="var(--color-crimson)" />
          <h2 style={{ fontSize: '14px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
            Filter Telemetry &amp; Trace Request ID
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 190px), 1fr))',
            gap: '12px',
          }}
        >
          <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', fontWeight: 600 }}>
            <span>App / Service</span>
            <select
              aria-label="Filter by service"
              value={draftFilters.service}
              onChange={(e) => setDraftFilters((prev) => ({ ...prev, service: e.target.value }))}
              style={{
                height: '38px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-page)',
                color: 'var(--text-primary)',
                padding: '0 10px',
                fontSize: '13px',
              }}
            >
              <option value="all">All Services</option>
              <option value="auth-api">auth-api</option>
              <option value="ads-api">ads-api</option>
              <option value="billing-api">billing-api</option>
              <option value="auth-web">auth-web</option>
              <option value="ads-web">ads-web</option>
              <option value="billing-web">billing-web</option>
              <option value="shop-web">shop-web</option>
            </select>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', fontWeight: 600 }}>
            <span>Environment</span>
            <select
              aria-label="Filter by environment"
              value={draftFilters.environment}
              onChange={(e) => setDraftFilters((prev) => ({ ...prev, environment: e.target.value }))}
              style={{
                height: '38px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-page)',
                color: 'var(--text-primary)',
                padding: '0 10px',
                fontSize: '13px',
              }}
            >
              <option value="all">All Environments</option>
              <option value="production">production</option>
              <option value="staging">staging</option>
              <option value="development">development</option>
            </select>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', fontWeight: 600 }}>
            <span>Time Range</span>
            <select
              aria-label="Filter by time range"
              value={draftFilters.timeRange}
              onChange={(e) =>
                setDraftFilters((prev) => ({
                  ...prev,
                  timeRange: e.target.value as FilterState['timeRange'],
                }))
              }
              style={{
                height: '38px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-page)',
                color: 'var(--text-primary)',
                padding: '0 10px',
                fontSize: '13px',
              }}
            >
              <option value="1h">Last 1 hour</option>
              <option value="24h">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="all">All time</option>
            </select>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', fontWeight: 600 }}>
            <span>HTTP Status</span>
            <select
              aria-label="Filter by HTTP status"
              value={draftFilters.statusClass}
              onChange={(e) => setDraftFilters((prev) => ({ ...prev, statusClass: e.target.value }))}
              style={{
                height: '38px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-page)',
                color: 'var(--text-primary)',
                padding: '0 10px',
                fontSize: '13px',
              }}
            >
              <option value="all">All 4xx &amp; 5xx</option>
              <option value="5xx">5xx Server Errors</option>
              <option value="4xx">4xx Client Errors</option>
              <option value="400">400 Bad Request</option>
              <option value="401">401 Unauthorized</option>
              <option value="403">403 Forbidden (Monitor only)</option>
              <option value="404">404 Not Found (Monitor only)</option>
              <option value="409">409 Conflict</option>
              <option value="429">429 Too Many Requests (Monitor only)</option>
              <option value="500">500 Internal Error</option>
              <option value="503">503 Service Unavailable</option>
            </select>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', fontWeight: 600 }}>
            <span>Email Notification State</span>
            <select
              aria-label="Filter by email state"
              value={draftFilters.emailState}
              onChange={(e) => setDraftFilters((prev) => ({ ...prev, emailState: e.target.value }))}
              style={{
                height: '38px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-page)',
                color: 'var(--text-primary)',
                padding: '0 10px',
                fontSize: '13px',
              }}
            >
              <option value="all">All Notification States</option>
              <option value="excluded_by_policy">Monitor only — email excluded by policy</option>
              <option value="provider_accepted">Provider accepted</option>
              <option value="suppressed_duplicate">Suppressed duplicate</option>
              <option value="pending">Pending outbox</option>
              <option value="failed">Failed delivery</option>
              <option value="disabled">Disabled in environment</option>
            </select>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', fontWeight: 600 }}>
            <span>Request / Correlation ID</span>
            <Input
              aria-label="Filter by request ID"
              placeholder="UUID e.g. 11111111-..."
              value={draftFilters.requestId}
              onChange={(e) => setDraftFilters((prev) => ({ ...prev, requestId: e.target.value }))}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', fontWeight: 600 }}>
            <span>Normalized Route</span>
            <Input
              aria-label="Filter by route"
              placeholder="/api/v1/wallet/fund"
              value={draftFilters.route}
              onChange={(e) => setDraftFilters((prev) => ({ ...prev, route: e.target.value }))}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', fontWeight: 600 }}>
            <span>Error Category</span>
            <Input
              aria-label="Filter by error category"
              placeholder="STATE_CONFLICT"
              value={draftFilters.errorCategory}
              onChange={(e) => setDraftFilters((prev) => ({ ...prev, errorCategory: e.target.value }))}
            />
          </label>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '16px', justifyContent: 'flex-end' }}>
          <Button type="button" variant="outline" onClick={handleResetFilters}>
            <RotateCcw size={14} />
            <span>Reset</span>
          </Button>
          <Button type="button" onClick={handleApplyFilters}>
            <Filter size={14} />
            <span>Apply Filters</span>
          </Button>
        </div>
      </Card>

      {/* Cross-Service Request Correlation Banner */}
      {appliedFilters.requestId.trim() && correlatedChain.length > 0 && (
        <Card
          style={{
            padding: '18px 20px',
            backgroundColor: 'var(--bg-elevated)',
            border: '1px solid var(--color-crimson)',
            borderRadius: '14px',
            marginBottom: '24px',
          }}
        >
          <h3 style={{ fontSize: '14px', fontWeight: 700, margin: '0 0 10px 0', color: 'var(--text-primary)' }}>
            Cross-Service Correlation Chain for Request <code>{appliedFilters.requestId.trim()}</code> ({correlatedChain.length} hops)
          </h3>
          <div style={{ display: 'grid', gap: '8px' }}>
            {correlatedChain.map((hop, idx) => (
              <div
                key={hop.id}
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--bg-page)',
                  fontSize: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <Badge variant="secondary">#{idx + 1}</Badge>
                  <strong>{hop.service}</strong>
                  <code>{hop.httpMethod} {hop.normalizedRoute}</code>
                  <span style={{ color: 'var(--color-crimson)', fontWeight: 700 }}>
                    HTTP {hop.statusCode} ({hop.errorCategory})
                  </span>
                </div>
                <span style={{ color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                  {new Date(hop.occurredAt).toISOString()}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Error Groups List */}
      <div style={{ display: 'grid', gap: '14px', marginBottom: '28px' }}>
        {loading && (
          <Card style={{ padding: '28px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            Loading sanitized error groups...
          </Card>
        )}

        {!loading && errorMessage && (
          <Card style={{ padding: '24px', border: '1px solid var(--color-crimson)', color: 'var(--color-crimson)' }}>
            {errorMessage}
          </Card>
        )}

        {!loading && !errorMessage && groups.length === 0 && (
          <Card style={{ padding: '32px 24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <CheckCircle2 size={28} color="var(--color-crimson)" style={{ margin: '0 auto 8px' }} />
            <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
              No matching error groups found
            </div>
            <div style={{ fontSize: '13px', marginTop: '4px' }}>
              No HTTP 4xx or 5xx responses matched the active filters in this window.
            </div>
          </Card>
        )}

        {!loading &&
          groups.map((group) => {
            const isExpanded = expandedGroupId === group.id;
            const detail = groupDetails[group.id];
            const isMonitorOnly = group.emailEligibility === 'excluded_by_policy';

            return (
              <Card
                key={group.id}
                style={{
                  padding: '18px 20px',
                  backgroundColor: 'var(--bg-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '12px',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ minWidth: 0, flex: '1 1 260px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                      <Badge
                        variant="secondary"
                        style={{
                          backgroundColor: group.statusCode >= 500 ? 'rgba(212, 20, 58, 0.14)' : 'rgba(15, 23, 42, 0.08)',
                          color: group.statusCode >= 500 ? 'var(--color-crimson)' : 'var(--text-primary)',
                          fontWeight: 700,
                        }}
                      >
                        HTTP {group.statusCode}
                      </Badge>
                      <Badge variant="secondary">{group.service}</Badge>
                      <Badge variant="secondary">{group.environment}</Badge>
                      {group.isFinancialRoute && (
                        <Badge variant="secondary" style={{ color: 'var(--color-crimson)', fontWeight: 700 }}>
                          Financial ({group.financialCategory || 'payment'})
                        </Badge>
                      )}
                      <code style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', overflowWrap: 'anywhere' }}>
                        {group.httpMethod} {group.normalizedRoute}
                      </code>
                    </div>

                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {group.errorCategory} — {group.safeSummary}
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '14px',
                        fontSize: '12px',
                        color: 'var(--text-secondary)',
                        marginTop: '8px',
                      }}
                    >
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <AlertTriangle size={13} />
                        <strong>{group.occurrenceCount}</strong> occurrence{group.occurrenceCount === 1 ? '' : 's'}
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Mail size={13} />
                        <span>{group.emailStatusLabel}</span>
                      </span>
                      {group.windowSuppressedCount > 0 && !isMonitorOnly && (
                        <span>
                          ({group.windowSuppressedCount} duplicate{group.windowSuppressedCount === 1 ? '' : 's'} suppressed in window)
                        </span>
                      )}
                      {group.lastRequestId && (
                        <span style={{ fontFamily: 'monospace' }}>
                          Last Request ID: {group.lastRequestId}
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                    {group.railwayLogUrl && (
                      <Button asChild size="sm" variant="outline">
                        <a href={group.railwayLogUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink size={13} />
                          <span>Railway Logs</span>
                        </a>
                      </Button>
                    )}
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => void handleToggleExpand(group.id)}
                    >
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      <span>{isExpanded ? 'Hide Samples' : 'Inspect Samples'}</span>
                    </Button>
                  </div>
                </div>

                {isExpanded && (
                  <div
                    style={{
                      borderTop: '1px solid var(--border-subtle)',
                      paddingTop: '12px',
                      display: 'grid',
                      gap: '10px',
                    }}
                  >
                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      Recent Sanitized Occurrence Samples ({detail?.occurrences?.length ?? group.sampledOccurrenceCount})
                    </div>
                    {detail?.occurrences?.map((occ) => (
                      <div
                        key={occ.id}
                        style={{
                          padding: '10px 12px',
                          borderRadius: '8px',
                          backgroundColor: 'var(--bg-page)',
                          fontSize: '12px',
                          display: 'flex',
                          flexWrap: 'wrap',
                          justifyContent: 'space-between',
                          gap: '8px',
                        }}
                      >
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
                          <code>req: {occ.requestId}</code>
                          {occ.correlationId && occ.correlationId !== occ.requestId && (
                            <code>corr: {occ.correlationId}</code>
                          )}
                          <span>{occ.service}</span>
                          {occ.upstreamService && (
                            <span>
                              upstream: {occ.upstreamService} ({occ.upstreamStatusCode ?? 'err'})
                            </span>
                          )}
                        </div>
                        <span style={{ color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                          {new Date(occ.occurredAt).toISOString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            );
          })}
      </div>

      {/* Registered Sources & Coverage Matrix */}
      <Card
        style={{
          padding: '20px',
          backgroundColor: 'var(--bg-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '14px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Server size={16} color="var(--color-crimson)" />
          <h2 style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
            Platform Coverage &amp; Source Status
          </h2>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
            gap: '12px',
          }}
        >
          {sources.map((src) => (
            <div
              key={src.service}
              style={{
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-page)',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                <strong style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{src.displayName}</strong>
                <Badge
                  variant="secondary"
                  style={{
                    fontSize: '10px',
                    textTransform: 'uppercase',
                    color: src.status === 'active' ? 'var(--color-crimson)' : 'var(--text-secondary)',
                  }}
                >
                  {src.status === 'paused' ? 'Paused' : src.status}
                </Badge>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{src.statusNote}</div>
              {src.lastEventAt && (
                <div style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={11} />
                  <span>Last event: {new Date(src.lastEventAt).toISOString()}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

