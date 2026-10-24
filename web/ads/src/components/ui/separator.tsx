import * as React from 'react';
import { cn } from '@/lib/utils';

const Separator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    orientation?: 'horizontal' | 'vertical';
    decorative?: boolean;
  }
>(
  (
    { className, orientation = 'horizontal', decorative = true, style, ...props },
    ref
  ) => (
    <div
      ref={ref}
      role={decorative ? 'none' : 'separator'}
      aria-orientation={orientation}
      className={cn(
        'shrink-0 bg-border',
        orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
        className
      )}
      style={{
        backgroundColor: 'var(--border-subtle, #E2E8F0)',
        width: orientation === 'horizontal' ? '100%' : '1px',
        height: orientation === 'horizontal' ? '1px' : '100%',
        margin: orientation === 'horizontal' ? '12px 0' : '0 12px',
        ...style,
      }}
      {...props}
    />
  )
);
Separator.displayName = 'Separator';

export { Separator };
