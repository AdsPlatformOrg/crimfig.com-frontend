'use client';

import * as React from 'react';
import * as RechartsPrimitive from 'recharts';
import { cn } from '@/lib/utils';

const THEMES = { light: '', dark: '[data-theme="dark"]' } as const;

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  );
};

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

export function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) {
    throw new Error('useChart must be used within a <ChartContainer />');
  }
  return context;
}

export const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    config: ChartConfig;
    children: React.ComponentProps<
      typeof RechartsPrimitive.ResponsiveContainer
    >['children'];
  }
>(({ id, className, children, config, style, ...props }, ref) => {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, '')}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        ref={ref}
        className={cn(
          'tw:flex tw:aspect-video tw:justify-center tw:text-xs',
          className,
        )}
        style={{
          fontVariantNumeric: 'tabular-nums',
          ...style,
        }}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
});
ChartContainer.displayName = 'ChartContainer';

export const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([, item]) => item.theme || item.color,
  );

  if (!colorConfig.length) {
    return null;
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
      itemConfig.color;
    return color ? `  --color-${key}: ${color};` : null;
  })
  .filter(Boolean)
  .join('\n')}
}
`,
          )
          .join('\n'),
      }}
    />
  );
};

export const ChartTooltip = RechartsPrimitive.Tooltip;

export const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
    React.ComponentProps<'div'> & {
      hideLabel?: boolean;
      hideIndicator?: boolean;
      indicator?: 'line' | 'dot' | 'dashed';
      nameKey?: string;
      labelKey?: string;
    }
>(
  (
    {
      active,
      payload,
      className,
      indicator = 'dot',
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      labelClassName,
      formatter,
      color,
      nameKey,
      labelKey,
    },
    ref,
  ) => {
    const { config } = useChart();

    if (!active || !payload?.length) {
      return null;
    }

    const first = payload[0];
    const key = `${labelKey || first?.dataKey || first?.name || 'value'}`;
    const itemConfig = getPayloadConfigFromPayload(config, first, key);
    const resolvedLabel =
      !labelKey && typeof label === 'string'
        ? config[label]?.label || label
        : itemConfig?.label;

    const tooltipLabel = hideLabel ? null : (
      <div
        className={cn('tw:font-semibold', labelClassName)}
        style={{ color: 'var(--text-primary)', marginBottom: 4 }}
      >
        {labelFormatter ? labelFormatter(resolvedLabel, payload) : resolvedLabel}
      </div>
    );

    return (
      <div
        ref={ref}
        className={cn('tw:rounded-lg tw:px-3 tw:py-2 tw:text-xs', className)}
        style={{
          backgroundColor: 'var(--bg-elevated)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-md)',
          color: 'var(--text-primary)',
          minWidth: 150,
        }}
      >
        {tooltipLabel}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {payload.map((item, index) => {
            const itemKey = `${nameKey || item.name || item.dataKey || 'value'}`;
            const cfg = getPayloadConfigFromPayload(config, item, itemKey);
            const indicatorColor =
              color || (item.payload as { fill?: string } | undefined)?.fill || item.color;

            return (
              <div
                key={`${item.dataKey ?? index}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {!hideIndicator && (
                    <span
                      aria-hidden="true"
                      style={{
                        display: 'inline-block',
                        width: indicator === 'line' ? 10 : 8,
                        height: indicator === 'line' ? 3 : 8,
                        borderRadius: indicator === 'dot' ? '9999px' : '2px',
                        backgroundColor: indicatorColor || 'var(--color-crimson)',
                        flexShrink: 0,
                      }}
                    />
                  )}
                  <span style={{ color: 'var(--text-secondary)' }}>
                    {cfg?.label || item.name}
                  </span>
                </div>
                {formatter && item.value !== undefined && item.name ? (
                  formatter(item.value, item.name, item, index, item.payload)
                ) : (
                  <span
                    style={{
                      fontWeight: 600,
                      fontVariantNumeric: 'tabular-nums',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {typeof item.value === 'number'
                      ? item.value.toLocaleString()
                      : String(item.value ?? '')}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  },
);
ChartTooltipContent.displayName = 'ChartTooltipContent';

export const ChartLegend = RechartsPrimitive.Legend;

export const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> &
    Pick<RechartsPrimitive.LegendProps, 'payload' | 'verticalAlign'> & {
      hideIcon?: boolean;
      nameKey?: string;
    }
>(({ className, hideIcon = false, payload, verticalAlign = 'bottom', nameKey }, ref) => {
  const { config } = useChart();

  if (!payload?.length) {
    return null;
  }

  return (
    <div
      ref={ref}
      className={cn(
        'tw:flex tw:flex-wrap tw:items-center tw:justify-center tw:gap-4',
        verticalAlign === 'top' ? 'tw:pb-3' : 'tw:pt-3',
        className,
      )}
    >
      {payload.map((item) => {
        const key = `${nameKey || item.dataKey || 'value'}`;
        const itemConfig = getPayloadConfigFromPayload(config, item, key);
        return (
          <div
            key={String(item.value)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: '12px',
              color: 'var(--text-secondary)',
            }}
          >
            {!hideIcon && (
              <span
                aria-hidden="true"
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '9999px',
                  backgroundColor: item.color || 'var(--color-crimson)',
                  display: 'inline-block',
                }}
              />
            )}
            <span>{itemConfig?.label || item.value}</span>
          </div>
        );
      })}
    </div>
  );
});
ChartLegendContent.displayName = 'ChartLegendContent';

function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string,
) {
  if (typeof payload !== 'object' || payload === null) {
    return undefined;
  }

  const record = payload as Record<string, unknown>;
  const nested =
    'payload' in record && typeof record.payload === 'object' && record.payload !== null
      ? (record.payload as Record<string, unknown>)
      : undefined;

  let configLabelKey = key;
  if (key in record && typeof record[key] === 'string') {
    configLabelKey = record[key] as string;
  } else if (nested && key in nested && typeof nested[key] === 'string') {
    configLabelKey = nested[key] as string;
  }

  return configLabelKey in config ? config[configLabelKey] : config[key];
}
