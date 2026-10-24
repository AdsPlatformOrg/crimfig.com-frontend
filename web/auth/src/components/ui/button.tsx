import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline:
          'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, style, ...props }, ref) => {
    // Brand Token Fallback Inline Styles
    const getVariantStyle = () => {
      switch (variant) {
        case 'destructive':
          return {
            backgroundColor: 'var(--color-error, #DC2626)',
            color: '#FFFFFF',
            border: 'none',
          };
        case 'outline':
          return {
            backgroundColor: 'transparent',
            color: 'var(--text-primary, #0F172A)',
            border: '1px solid var(--border-subtle, #E2E8F0)',
          };
        case 'secondary':
          return {
            backgroundColor: 'var(--bg-surface, #F1F5F9)',
            color: 'var(--text-primary, #0F172A)',
            border: '1px solid var(--border-subtle, #E2E8F0)',
          };
        case 'ghost':
          return {
            backgroundColor: 'transparent',
            color: 'var(--text-primary, #0F172A)',
            border: 'none',
          };
        case 'link':
          return {
            backgroundColor: 'transparent',
            color: 'var(--color-crimson, #D4143A)',
            border: 'none',
            textDecoration: 'underline',
          };
        case 'default':
        default:
          return {
            backgroundColor: 'var(--color-crimson, #D4143A)',
            color: '#FFFFFF',
            border: 'none',
          };
      }
    };

    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        style={{
          fontFamily: "'Poppins', Arial, Helvetica, sans-serif",
          cursor: 'pointer',
          borderRadius: '8px',
          fontWeight: 600,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          transition: 'all 0.15s ease',
          ...getVariantStyle(),
          ...style,
        }}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
