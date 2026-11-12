'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function CampaignBreadcrumbs({ items, campaignsHref = '/campaigns' }: { items: BreadcrumbItem[]; campaignsHref?: string }) {
  return (
    <nav
      aria-label="Breadcrumb"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: 'var(--cf-campaign-breadcrumb-size, 13px)',
        color: 'var(--text-muted, #64748B)',
        marginBottom: '16px',
        flexWrap: 'wrap',
      }}
    >
      <Link
        href={campaignsHref}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          color: 'var(--text-muted, #64748B)',
          textDecoration: 'none',
          fontWeight: 500,
        }}
      >
        <Home style={{ width: 14, height: 14 }} />
        <span>My Ad Campaigns</span>
      </Link>

      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={idx}>
            <ChevronRight style={{ width: 14, height: 14, color: 'var(--border-subtle, #CBD5E1)', flexShrink: 0 }} />
            {isLast || !item.href ? (
              <span
                style={{
                  fontWeight: 600,
                  color: isLast ? 'var(--text-primary, #1E293B)' : 'var(--text-muted, #64748B)',
                  maxWidth: '220px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
                aria-current={isLast ? 'page' : undefined}
              >
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                style={{
                  color: 'var(--text-muted, #64748B)',
                  textDecoration: 'none',
                  fontWeight: 500,
                  maxWidth: '200px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
