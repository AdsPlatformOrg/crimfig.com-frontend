import * as React from 'react';
import { cn } from '@/lib/utils';

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, style, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-xl border border-border bg-card text-card-foreground shadow-sm transition-shadow duration-200 hover:shadow-md',
      className
    )}
    style={{
      backgroundColor: 'var(--bg-elevated, #FFFFFF)',
      borderColor: 'var(--border-subtle, #E2E8F0)',
      color: 'var(--text-primary, #0F172A)',
      borderRadius: '16px',
      borderWidth: '1px',
      borderStyle: 'solid',
      boxShadow: 'var(--shadow-sm, 0 1px 3px rgba(15, 23, 42, 0.05))',
      ...style,
    }}
    {...props}
  />
));
Card.displayName = 'Card';

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, style, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    style={{
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      ...style,
    }}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, style, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-lg font-semibold leading-none tracking-tight text-foreground',
      className
    )}
    style={{
      fontSize: '18px',
      fontWeight: 700,
      color: 'var(--text-primary, #0F172A)',
      margin: 0,
      ...style,
    }}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, style, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    style={{
      fontSize: '13px',
      color: 'var(--text-secondary, #475569)',
      margin: 0,
      lineHeight: 1.5,
      ...style,
    }}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, style, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('p-6 pt-0', className)}
    style={{
      padding: '0 24px 24px 24px',
      ...style,
    }}
    {...props}
  />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, style, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    style={{
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px 24px 24px',
      marginTop: 'auto',
      ...style,
    }}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
