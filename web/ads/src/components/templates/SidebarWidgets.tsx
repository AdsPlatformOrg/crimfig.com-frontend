'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Plus, 
  TrendingUp, 
  Users, 
  ExternalLink, 
  Sparkles, 
  HelpCircle 
} from 'lucide-react';
import './template-layout.css';

export interface FollowItem {
  id: string;
  name: string;
  handle: string;
  avatarUrl?: string;
  badge?: string;
  onFollow?: (id: string) => void;
}

export interface TrendingItem {
  id: string;
  title: string;
  metricLabel: string;
  href?: string;
}

export const WhoToFollowWidget: React.FC<{
  title?: string;
  items: FollowItem[];
  viewAllHref?: string;
}> = ({
  title = 'Promoters & Publishers',
  items,
  viewAllHref = '/marketplace',
}) => {
  return (
    <section className="cf-template-widget" aria-labelledby="who-to-follow-heading">
      <h2 id="who-to-follow-heading" className="cf-template-widget-title">
        <span>{title}</span>
        <Users size={16} style={{ color: 'var(--text-muted)' }} />
      </h2>

      <div className="cf-template-widget-list">
        {items.map((item) => (
          <div key={item.id} className="cf-template-widget-item">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
              {item.avatarUrl ? (
                <img
                  src={item.avatarUrl}
                  alt={item.name}
                  style={{ width: '32px', height: '32px', borderRadius: '9999px', objectFit: 'cover', flexShrink: 0 }}
                />
              ) : (
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '9999px',
                  backgroundColor: 'var(--badge-bg)',
                  color: 'var(--color-crimson)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                  fontSize: '0.8125rem',
                  flexShrink: 0,
                }}>
                  {item.name.charAt(0)}
                </div>
              )}
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.handle}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => item.onFollow?.(item.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 10px',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--color-crimson)',
                backgroundColor: 'rgba(212, 20, 58, 0.08)',
                border: 'none',
                borderRadius: '9999px',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              <Plus size={12} />
              <span>Connect</span>
            </button>
          </div>
        ))}
      </div>

      {viewAllHref && (
        <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
          <Link
            href={viewAllHref}
            style={{
              display: 'block',
              textAlign: 'center',
              fontSize: '0.8125rem',
              fontWeight: 500,
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              padding: '6px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-surface)',
            }}
          >
            Explore Directory
          </Link>
        </div>
      )}
    </section>
  );
};

export const TrendingWidget: React.FC<{
  title?: string;
  items: TrendingItem[];
}> = ({
  title = 'Trending Placement Opportunities',
  items,
}) => {
  return (
    <section className="cf-template-widget" aria-labelledby="trending-heading">
      <h2 id="trending-heading" className="cf-template-widget-title">
        <span>{title}</span>
        <TrendingUp size={16} style={{ color: 'var(--color-crimson)' }} />
      </h2>

      <div className="cf-template-widget-list">
        {items.map((item) => (
          <div key={item.id} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <Link
              href={item.href || '#'}
              style={{
                fontSize: '0.875rem',
                fontWeight: 500,
                color: 'var(--text-primary)',
                textDecoration: 'none',
                lineHeight: 1.4,
              }}
            >
              {item.title}
            </Link>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {item.metricLabel}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export const QuickHelpWidget: React.FC<{
  onContactSupport?: () => void;
}> = ({ onContactSupport }) => {
  return (
    <div style={{
      padding: '16px',
      borderRadius: 'var(--radius-lg)',
      background: 'linear-gradient(135deg, rgba(212, 20, 58, 0.05) 0%, rgba(23, 27, 42, 0.05) 100%)',
      border: '1px dashed var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-crimson)', fontWeight: 600, fontSize: '0.875rem' }}>
        <Sparkles size={16} />
        <span>Need Placement Guidance?</span>
      </div>
      <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
        Connect with our publisher success desk to optimize ad yield or calibrate campaign bids.
      </p>
      <button
        type="button"
        onClick={onContactSupport}
        style={{
          marginTop: '6px',
          alignSelf: 'flex-start',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          fontSize: '0.75rem',
          fontWeight: 600,
          color: '#FFFFFF',
          backgroundColor: 'var(--color-crimson)',
          border: 'none',
          borderRadius: 'var(--radius-md)',
          cursor: 'pointer',
        }}
      >
        <HelpCircle size={14} />
        <span>Open Support Desk</span>
      </button>
    </div>
  );
};
