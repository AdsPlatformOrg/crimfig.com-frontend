import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva('cf-button', {
  variants: {
    variant: {
      default: 'cf-button--primary',
      destructive: 'cf-button--destructive',
      outline: 'cf-button--outline',
      secondary: 'cf-button--secondary',
      ghost: 'cf-button--ghost',
      link: 'cf-button--link',
    },
    size: {
      default: 'cf-button--default',
      sm: 'cf-button--sm',
      lg: 'cf-button--lg',
      icon: 'cf-button--icon',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, disabled, ...props }, ref) => {
    const Component = asChild ? Slot : 'button';

    return (
      <Component
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        aria-busy={loading || undefined}
        disabled={disabled || loading}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
