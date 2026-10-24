import * as React from 'react';
import { cn } from '@/lib/utils';

function Skeleton({
  className,
  style,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted', className)}
      style={{
        backgroundColor: 'var(--bg-surface, #F1F5F9)',
        borderRadius: '8px',
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        ...style,
      }}
      {...props}
    />
  );
}

export { Skeleton };
