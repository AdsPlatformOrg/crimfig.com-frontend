import * as React from 'react';
import { cn } from '../../lib/utils';

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, style, ...props }, ref) => (
  <div
    style={{
      width: '100%',
      overflowX: 'auto',
      borderRadius: '12px',
      border: '1px solid var(--border-subtle, #E2E8F0)',
    }}
  >
    <table
      ref={ref}
      className={cn('w-full caption-bottom text-sm', className)}
      style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '13px',
        textAlign: 'left',
        ...style,
      }}
      {...props}
    />
  </div>
));
Table.displayName = 'Table';

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, style, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn('[&_tr]:border-b', className)}
    style={{
      backgroundColor: 'var(--bg-surface, #F8FAFC)',
      borderBottom: '1px solid var(--border-subtle, #E2E8F0)',
      ...style,
    }}
    {...props}
  />
));
TableHeader.displayName = 'TableHeader';

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn('[&_tr:last-child]:border-0', className)}
    {...props}
  />
));
TableBody.displayName = 'TableBody';

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, style, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn('border-t font-medium [&>tr]:last:border-b-0', className)}
    style={{
      backgroundColor: 'var(--bg-surface, #F8FAFC)',
      borderTop: '1px solid var(--border-subtle, #E2E8F0)',
      ...style,
    }}
    {...props}
  />
));
TableFooter.displayName = 'TableFooter';

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, style, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
      className
    )}
    style={{
      borderBottom: '1px solid var(--border-subtle, #E2E8F0)',
      transition: 'background-color 0.15s ease',
      ...style,
    }}
    {...props}
  />
));
TableRow.displayName = 'TableRow';

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, style, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      'h-10 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
      className
    )}
    style={{
      padding: '12px 16px',
      color: 'var(--text-secondary, #475569)',
      fontWeight: 600,
      fontSize: '12px',
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      ...style,
    }}
    {...props}
  />
));
TableHead.displayName = 'TableHead';

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, style, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      'p-4 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
      className
    )}
    style={{
      padding: '14px 16px',
      color: 'var(--text-primary, #0F172A)',
      verticalAlign: 'middle',
      ...style,
    }}
    {...props}
  />
));
TableCell.displayName = 'TableCell';

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, style, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn('mt-4 text-sm text-muted-foreground', className)}
    style={{
      marginTop: '12px',
      fontSize: '12px',
      color: 'var(--text-muted, #64748B)',
      ...style,
    }}
    {...props}
  />
));
TableCaption.displayName = 'TableCaption';

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
