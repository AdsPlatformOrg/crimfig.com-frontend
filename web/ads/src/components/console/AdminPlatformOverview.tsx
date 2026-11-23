'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Activity,
  CheckCircle2,
  Globe,
  Layers,
  Megaphone,
  RefreshCw,
  ShieldCheck,
  Users,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  XAxis,
  YAxis,
} from 'recharts';
import { sessionFetch } from '@/lib/session';
import {
  Alert,
  AlertDescription,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  type ChartConfig,
} from '../ui';

export interface PlatformMetricsOverview {
  windowDays: number;
  generatedAt: string;
  users: {
    totalSignedUp: number;
    emailVerified: number;
    activeAccounts: number;
    pendingVerification: number;
    suspended: number;
    newInWindow: number;
  };
  websites: {
    totalPromoters: number;
    setup: number;
    verified: number;
    pendingVerification: number;
    failedVerification: number;
    policyApproved: number;
    withSlotsCreated: number;
    withSlotsAdded: number;
    pinging7d: number;
    newInWindow: number;
  };
  adSlots: {
    created: number;
    addedVerified: number;
    liveActive: number;
    pendingInstall: number;
    retired: number;
    newInWindow: number;
    byType: {
      consideration: number;
      network: number;
      direct: number;
      hybrid: number;
    };
  };
  campaigns: {
    advertisersWithCampaigns: number;
    total: number;
    active: number;
    underReview: number;
    draft: number;
    paused: number;
    paidServesInWindow: number;
    houseServesInWindow: number;
  };
  rates: {
    userVerificationPct: number;
    websiteVerificationPct: number;
    websiteSlotCoveragePct: number;
    websiteEmbedInstallPct: number;
    slotInstallPct: number;
  };
  dailySeries: {
    date: string;
    usersSignedUp: number;
    websitesSetup: number;
    websitesVerified: number;
    slotsCreated: number;
    slotsAdded: number;
  }[];
}

const WINDOW_OPTIONS = [7, 14, 30, 90] as const;

const growthChartConfig = {
  usersSignedUp: {
    label: 'Users Signed Up',
    color: '#D4143A',
  },
  websitesSetup: {
    label: 'Websites Setup',
    color: '#2563EB',
  },
  websitesVerified: {
    label: 'Websites Verified',
    color: '#16A34A',
  },
  slotsCreated: {
    label: 'Ad Slots Created',
    color: '#D97706',
  },
  slotsAdded: {
    label: 'Ad Slots Added',
    color: '#7C3AED',
  },
} satisfies ChartConfig;

const funnelChartConfig = {
  count: {
    label: 'Accounts / Properties',
    color: '#D4143A',
  },
} satisfies ChartConfig;

const dialChartConfig = {
  pct: {
    label: 'Completion',
    color: '#D4143A',
  },
} satisfies ChartConfig;

function formatShortDate(isoDay: string): string {
  const parsed = new Date(`${isoDay}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return isoDay;
  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

function DialGaugeCard({
  title,
  valuePct,
  color,
  headline,
  subBadge,
  secondaryBadge,
}: {
  title: string;
  valuePct: number;
  color: string;
  headline: string;
  subBadge: string;
  secondaryBadge: string;
}) {
  const safePct = Math.max(0, Math.min(100, Number.isFinite(valuePct) ? valuePct : 0));
  const chartData = [{ name: title, pct: safePct, fill: color }];

  return (
    <Card>
      <CardHeader style={{ paddingBottom: 8 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
            flexWrap: 'wrap',
          }}
        >
          <CardTitle style={{ fontSize: '15px', fontWeight: 600 }}>{title}</CardTitle>
          <Badge variant="outline" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {safePct.toFixed(safePct % 1 === 0 ? 0 : 1)}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ position: 'relative', height: 152, width: '100%' }}>
          <ChartContainer
            config={dialChartConfig}
            style={{ width: '100%', height: 152, aspectRatio: 'auto' }}
          >
            <RadialBarChart
              data={chartData}
              startAngle={90}
              endAngle={-270}
              innerRadius={52}
              outerRadius={70}
              barSize={12}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
              <RadialBar
                background={{ fill: 'var(--badge-bg)' }}
                dataKey="pct"
                cornerRadius={8}
              />
            </RadialBarChart>
          </ChartContainer>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            <span
              style={{
                fontSize: '22px',
                fontWeight: 600,
                fontVariantNumeric: 'tabular-nums',
                color: 'var(--text-primary)',
                lineHeight: 1.1,
              }}
            >
              {safePct.toFixed(safePct % 1 === 0 ? 0 : 1)}%
            </span>
            <span
              style={{
                fontSize: '12px',
                fontVariantNumeric: 'tabular-nums',
                color: 'var(--text-muted)',
                marginTop: 2,
              }}
            >
              {headline}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
          <Badge variant="secondary">{subBadge}</Badge>
          <Badge variant="outline">{secondaryBadge}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}

export function AdminPlatformOverview() {
  const [windowDays, setWindowDays] = useState<number>(30);
  const [data, setData] = useState<PlatformMetricsOverview | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const load = useCallback(async (days: number) => {
    setLoading(true);
    setError('');
    try {
      const response = await sessionFetch(`/api/v1/admin/platform-metrics?days=${days}`, {
        cache: 'no-store',
      });
      const body = await response.json().catch(() => null);
      if (!response.ok || body?.status !== 'success' || !body?.data) {
        throw new Error(
          response.status === 403
            ? 'Your account does not have permission to view platform overview metrics.'
            : body?.message || 'Unable to load platform overview metrics right now.',
        );
      }
      setData(body.data as PlatformMetricsOverview);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load platform overview metrics.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load(windowDays);
  }, [load, windowDays]);

  const funnelData = data
    ? [
        { stage: 'Users Signed Up', count: data.users.totalSignedUp, fill: '#D4143A' },
        { stage: 'Email Verified', count: data.users.emailVerified, fill: '#E31B45' },
        { stage: 'Websites Setup', count: data.websites.setup, fill: '#2563EB' },
        { stage: 'Websites Verified', count: data.websites.verified, fill: '#16A34A' },
        { stage: 'Sites w/ Slots', count: data.websites.withSlotsCreated, fill: '#D97706' },
        { stage: 'Sites w/ Embed', count: data.websites.withSlotsAdded, fill: '#7C3AED' },
      ]
    : [];

  return (
    <section
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        width: '100%',
      }}
    >
      {/* Header & Time Window Switcher */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <h1
              className="cf-page-title"
              style={{ margin: 0, fontSize: '24px', fontWeight: 600 }}
            >
              Platform Overview
            </h1>
            {data && (
              <Badge variant="secondary">
                Last {data.windowDays} days · Updated{' '}
                {new Date(data.generatedAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Badge>
            )}
          </div>
          <p
            style={{
              margin: '6px 0 0',
              fontSize: '14px',
              color: 'var(--text-secondary)',
            }}
          >
            Live ecosystem telemetry for user signups, promoter websites, ad slot installation, and active campaigns.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <div
            role="group"
            aria-label="Metrics window"
            style={{ display: 'inline-flex', gap: 6, flexWrap: 'wrap' }}
          >
            {WINDOW_OPTIONS.map((days) => (
              <Button
                key={days}
                type="button"
                size="sm"
                variant={windowDays === days ? 'default' : 'outline'}
                aria-pressed={windowDays === days}
                onClick={() => setWindowDays(days)}
              >
                {days}D
              </Button>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void load(windowDays)}
            disabled={loading}
          >
            <RefreshCw size={14} aria-hidden="true" />
            <span>{loading ? 'Refreshing…' : 'Refresh'}</span>
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              flexWrap: 'wrap',
            }}
          >
            <span>{error}</span>
            <Button type="button" variant="outline" size="sm" onClick={() => void load(windowDays)}>
              Try again
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {loading && !data ? (
        <div
          className="tw:grid tw:grid-cols-1 tw:gap-4 tw:sm:grid-cols-2 tw:xl:grid-cols-4"
        >
          {Array.from({ length: 4 }).map((_, idx) => (
            <Card key={idx} style={{ padding: 20 }}>
              <Skeleton style={{ height: 20, width: '60%', marginBottom: 14 }} />
              <Skeleton style={{ height: 140, width: '100%', borderRadius: 12 }} />
            </Card>
          ))}
        </div>
      ) : null}

      {data && (
        <>
          {/* Row 1: Radial Dial Gauges */}
          <div className="tw:grid tw:grid-cols-1 tw:gap-4 tw:sm:grid-cols-2 tw:xl:grid-cols-4">
            <DialGaugeCard
              title="User Verification Dial"
              valuePct={data.rates.userVerificationPct}
              color="#D4143A"
              headline={`${data.users.emailVerified.toLocaleString()} / ${data.users.totalSignedUp.toLocaleString()}`}
              subBadge={`${data.users.activeAccounts.toLocaleString()} active`}
              secondaryBadge={`+${data.users.newInWindow.toLocaleString()} / ${data.windowDays}d`}
            />
            <DialGaugeCard
              title="Websites Verified Dial"
              valuePct={data.rates.websiteVerificationPct}
              color="#16A34A"
              headline={`${data.websites.verified.toLocaleString()} / ${data.websites.setup.toLocaleString()}`}
              subBadge={`${data.websites.policyApproved.toLocaleString()} approved`}
              secondaryBadge={`${data.websites.pendingVerification.toLocaleString()} pending`}
            />
            <DialGaugeCard
              title="Sites w/ Slots Dial"
              valuePct={data.rates.websiteSlotCoveragePct}
              color="#2563EB"
              headline={`${data.websites.withSlotsCreated.toLocaleString()} / ${data.websites.setup.toLocaleString()}`}
              subBadge={`${data.websites.withSlotsAdded.toLocaleString()} embed added`}
              secondaryBadge={`${data.websites.pinging7d.toLocaleString()} pinging 7d`}
            />
            <DialGaugeCard
              title="Ad Slots Added Dial"
              valuePct={data.rates.slotInstallPct}
              color="#D97706"
              headline={`${data.adSlots.addedVerified.toLocaleString()} / ${data.adSlots.created.toLocaleString()}`}
              subBadge={`${data.adSlots.liveActive.toLocaleString()} live`}
              secondaryBadge={`${data.adSlots.pendingInstall.toLocaleString()} awaiting tag`}
            />
          </div>

          {/* Row 2: KPI Cards with Semantic Badges */}
          <div className="tw:grid tw:grid-cols-1 tw:gap-4 tw:sm:grid-cols-2 tw:lg:grid-cols-3">
            <Card>
              <CardHeader style={{ paddingBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <CardDescription style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                    <Users size={15} aria-hidden="true" style={{ color: 'var(--color-crimson)' }} />
                    <span>Users Signed Up</span>
                  </CardDescription>
                  <Badge variant="secondary">+{data.users.newInWindow.toLocaleString()} ({data.windowDays}d)</Badge>
                </div>
                <CardTitle style={{ fontSize: 28, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                  {data.users.totalSignedUp.toLocaleString()}
                </CardTitle>
              </CardHeader>
              <CardContent style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                <Badge variant="default">{data.users.emailVerified.toLocaleString()} Email Verified</Badge>
                <Badge variant="outline">{data.users.pendingVerification.toLocaleString()} Pending</Badge>
                <Badge variant="outline">{data.users.suspended.toLocaleString()} Suspended</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader style={{ paddingBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <CardDescription style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                    <Globe size={15} aria-hidden="true" style={{ color: 'var(--color-info)' }} />
                    <span>Websites Setup &amp; Verified</span>
                  </CardDescription>
                  <Badge variant="secondary">+{data.websites.newInWindow.toLocaleString()} ({data.windowDays}d)</Badge>
                </div>
                <CardTitle style={{ fontSize: 28, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                  {data.websites.setup.toLocaleString()}
                </CardTitle>
              </CardHeader>
              <CardContent style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                <Badge variant="default">{data.websites.verified.toLocaleString()} Verified</Badge>
                <Badge variant="secondary">{data.websites.policyApproved.toLocaleString()} Policy Approved</Badge>
                <Badge variant="outline">{data.websites.failedVerification.toLocaleString()} Failed Check</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader style={{ paddingBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <CardDescription style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                    <CheckCircle2 size={15} aria-hidden="true" style={{ color: 'var(--color-success)' }} />
                    <span>Websites w/ Ad Slots</span>
                  </CardDescription>
                  <Badge variant="secondary">{data.websites.totalPromoters.toLocaleString()} Promoters</Badge>
                </div>
                <CardTitle style={{ fontSize: 28, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                  {data.websites.withSlotsCreated.toLocaleString()}
                </CardTitle>
              </CardHeader>
              <CardContent style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                <Badge variant="default">{data.websites.withSlotsAdded.toLocaleString()} Script Added</Badge>
                <Badge variant="secondary">{data.websites.pinging7d.toLocaleString()} Pinging 7d</Badge>
                <Badge variant="outline">{data.rates.websiteEmbedInstallPct}% Coverage</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader style={{ paddingBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <CardDescription style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                    <Layers size={15} aria-hidden="true" style={{ color: 'var(--color-warning)' }} />
                    <span>Ad Slots Created</span>
                  </CardDescription>
                  <Badge variant="secondary">+{data.adSlots.newInWindow.toLocaleString()} ({data.windowDays}d)</Badge>
                </div>
                <CardTitle style={{ fontSize: 28, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                  {data.adSlots.created.toLocaleString()}
                </CardTitle>
              </CardHeader>
              <CardContent style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                <Badge variant="secondary">Consideration: {data.adSlots.byType.consideration.toLocaleString()}</Badge>
                <Badge variant="outline">Network: {data.adSlots.byType.network.toLocaleString()}</Badge>
                <Badge variant="outline">Direct: {data.adSlots.byType.direct.toLocaleString()}</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader style={{ paddingBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <CardDescription style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                    <ShieldCheck size={15} aria-hidden="true" style={{ color: '#7C3AED' }} />
                    <span>Ad Slots Added &amp; Live</span>
                  </CardDescription>
                  <Badge variant="secondary">{data.rates.slotInstallPct}% Installed</Badge>
                </div>
                <CardTitle style={{ fontSize: 28, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                  {data.adSlots.addedVerified.toLocaleString()}
                </CardTitle>
              </CardHeader>
              <CardContent style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                <Badge variant="default">{data.adSlots.liveActive.toLocaleString()} Live Active</Badge>
                <Badge variant="outline">{data.adSlots.pendingInstall.toLocaleString()} Awaiting Embed</Badge>
                <Badge variant="outline">{data.adSlots.retired.toLocaleString()} Retired</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader style={{ paddingBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <CardDescription style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                    <Megaphone size={15} aria-hidden="true" style={{ color: 'var(--color-crimson)' }} />
                    <span>Campaigns &amp; Serves ({data.windowDays}d)</span>
                  </CardDescription>
                  <Badge variant="secondary">{data.campaigns.advertisersWithCampaigns.toLocaleString()} Advertisers</Badge>
                </div>
                <CardTitle style={{ fontSize: 28, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                  {data.campaigns.total.toLocaleString()}
                </CardTitle>
              </CardHeader>
              <CardContent style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                <Badge variant="default">{data.campaigns.active.toLocaleString()} Active</Badge>
                <Badge variant="outline">{data.campaigns.underReview.toLocaleString()} In Review</Badge>
                <Badge variant="outline">
                  {(data.campaigns.paidServesInWindow + data.campaigns.houseServesInWindow).toLocaleString()} Serves
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Row 3: Interactive Recharts Area & Bar Charts */}
          <div className="tw:grid tw:grid-cols-1 tw:gap-4 tw:lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle style={{ fontSize: '16px', fontWeight: 600 }}>
                  Daily Ecosystem Growth ({data.windowDays} Days)
                </CardTitle>
                <CardDescription>
                  New users signed up, websites registered/verified, and ad slots created &amp; added per UTC day.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={growthChartConfig}
                  style={{ width: '100%', height: 290, aspectRatio: 'auto' }}
                >
                  <AreaChart data={data.dailySeries} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                    <XAxis
                      dataKey="date"
                      tickFormatter={formatShortDate}
                      tickLine={false}
                      axisLine={false}
                      minTickGap={24}
                      tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                    />
                    <YAxis
                      allowDecimals={false}
                      tickLine={false}
                      axisLine={false}
                      width={34}
                      tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                    />
                    <ChartTooltip content={<ChartTooltipContent labelFormatter={(v) => formatShortDate(String(v))} />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Area
                      type="monotone"
                      dataKey="usersSignedUp"
                      stroke="#D4143A"
                      fill="#D4143A"
                      fillOpacity={0.14}
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="websitesSetup"
                      stroke="#2563EB"
                      fill="#2563EB"
                      fillOpacity={0.12}
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="websitesVerified"
                      stroke="#16A34A"
                      fill="#16A34A"
                      fillOpacity={0.1}
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="slotsCreated"
                      stroke="#D97706"
                      fill="#D97706"
                      fillOpacity={0.1}
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="slotsAdded"
                      stroke="#7C3AED"
                      fill="#7C3AED"
                      fillOpacity={0.1}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle style={{ fontSize: '16px', fontWeight: 600 }}>
                  Ecosystem Onboarding Funnel
                </CardTitle>
                <CardDescription>
                  Progression from user signup through website verification, ad slot creation, and live embed detection.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={funnelChartConfig}
                  style={{ width: '100%', height: 290, aspectRatio: 'auto' }}
                >
                  <BarChart
                    data={funnelData}
                    layout="vertical"
                    margin={{ left: 10, right: 20, top: 8, bottom: 4 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" horizontal={false} />
                    <XAxis
                      type="number"
                      allowDecimals={false}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                    />
                    <YAxis
                      type="category"
                      dataKey="stage"
                      width={126}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                    />
                    <ChartTooltip content={<ChartTooltipContent hideIndicator />} />
                    <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={22}>
                      {funnelData.map((entry) => (
                        <Cell key={entry.stage} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Row 4: Accessible Summary Table & Console Shortcuts */}
          <Card>
            <CardHeader>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  flexWrap: 'wrap',
                }}
              >
                <div>
                  <CardTitle style={{ fontSize: '16px', fontWeight: 600 }}>
                    Platform Funnel Breakdown
                  </CardTitle>
                  <CardDescription>
                    Exact tabular totals matching the gauges and charts above, with quick links to manage each queue.
                  </CardDescription>
                </div>
                <Badge variant="outline" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <Activity size={13} aria-hidden="true" />
                  Paid: {data.campaigns.paidServesInWindow.toLocaleString()} · House:{' '}
                  {data.campaigns.houseServesInWindow.toLocaleString()} ({data.windowDays}d)
                </Badge>
              </div>
            </CardHeader>
            <CardContent style={{ overflowX: 'auto' }}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lifecycle Metric</TableHead>
                    <TableHead style={{ textAlign: 'right' }}>Total Count</TableHead>
                    <TableHead>Status / Rate</TableHead>
                    <TableHead style={{ textAlign: 'right' }}>Window ({data.windowDays}d)</TableHead>
                    <TableHead style={{ textAlign: 'right' }}>Admin Surface</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell style={{ fontWeight: 600 }}>Users Signed Up</TableCell>
                    <TableCell style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                      {data.users.totalSignedUp.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{data.rates.userVerificationPct}% email verified</Badge>
                    </TableCell>
                    <TableCell style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                      +{data.users.newInWindow.toLocaleString()}
                    </TableCell>
                    <TableCell style={{ textAlign: 'right' }}>
                      <Link href="/admin/reports?view=contacts" style={{ color: 'var(--color-crimson)', fontWeight: 600 }}>
                        Account Contacts
                      </Link>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell style={{ fontWeight: 600 }}>Websites Setup</TableCell>
                    <TableCell style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                      {data.websites.setup.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{data.rates.websiteVerificationPct}% verified</Badge>
                    </TableCell>
                    <TableCell style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                      +{data.websites.newInWindow.toLocaleString()}
                    </TableCell>
                    <TableCell style={{ textAlign: 'right' }}>
                      <Link href="/admin/websites" style={{ color: 'var(--color-crimson)', fontWeight: 600 }}>
                        Websites &amp; Promoters
                      </Link>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell style={{ fontWeight: 600 }}>Websites Verified</TableCell>
                    <TableCell style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                      {data.websites.verified.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="default">{data.websites.policyApproved.toLocaleString()} policy approved</Badge>
                    </TableCell>
                    <TableCell style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                      {data.websites.pendingVerification.toLocaleString()} pending
                    </TableCell>
                    <TableCell style={{ textAlign: 'right' }}>
                      <Link href="/admin/websites/review" style={{ color: 'var(--color-crimson)', fontWeight: 600 }}>
                        Website Approvals
                      </Link>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell style={{ fontWeight: 600 }}>Websites w/ Ad Slots Created</TableCell>
                    <TableCell style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                      {data.websites.withSlotsCreated.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{data.rates.websiteSlotCoveragePct}% of setup sites</Badge>
                    </TableCell>
                    <TableCell style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                      {data.websites.pinging7d.toLocaleString()} pinging (7d)
                    </TableCell>
                    <TableCell style={{ textAlign: 'right' }}>
                      <Link href="/admin/ad-slots" style={{ color: 'var(--color-crimson)', fontWeight: 600 }}>
                        Ad Slots
                      </Link>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell style={{ fontWeight: 600 }}>Ad Slots Created</TableCell>
                    <TableCell style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                      {data.adSlots.created.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        C:{data.adSlots.byType.consideration} · N:{data.adSlots.byType.network} · D:{data.adSlots.byType.direct} · H:{data.adSlots.byType.hybrid}
                      </Badge>
                    </TableCell>
                    <TableCell style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                      +{data.adSlots.newInWindow.toLocaleString()}
                    </TableCell>
                    <TableCell style={{ textAlign: 'right' }}>
                      <Link href="/admin/ad-slots" style={{ color: 'var(--color-crimson)', fontWeight: 600 }}>
                        Inspect Slots
                      </Link>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell style={{ fontWeight: 600 }}>Ad Slots Added (Verified Embed)</TableCell>
                    <TableCell style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                      {data.adSlots.addedVerified.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="default">
                        {data.rates.slotInstallPct}% installed · {data.adSlots.liveActive.toLocaleString()} live
                      </Badge>
                    </TableCell>
                    <TableCell style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                      {data.adSlots.pendingInstall.toLocaleString()} pending
                    </TableCell>
                    <TableCell style={{ textAlign: 'right' }}>
                      <Link href="/admin/campaigns/readiness" style={{ color: 'var(--color-crimson)', fontWeight: 600 }}>
                        Campaign Readiness
                      </Link>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </section>
  );
}
