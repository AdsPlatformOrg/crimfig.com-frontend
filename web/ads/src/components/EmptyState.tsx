'use client';

import React from 'react';

interface EmptyStateProps {
  icon: React.ComponentType<{ style?: React.CSSProperties; className?: string }>;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        textAlign: 'center',
        borderRadius: '16px',
        border: '1px dashed var(--border-subtle)',
        backgroundColor: 'var(--bg-surface)',
        width: '100%',
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'var(--badge-bg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-muted)',
          marginBottom: '16px',
        }}
      >
        <Icon style={{ width: '28px', height: '28px' }} />
      </div>
      <h3
        style={{
          fontWeight: 600,
          color: 'var(--text-primary)',
          fontSize: '16px',
          marginBottom: '6px',
        }}
      >
        {title}
      </h3>
      <p
        style={{
          color: 'var(--text-secondary)',
          fontSize: '14px',
          maxWidth: '380px',
          lineHeight: '1.5',
          marginBottom: actionLabel ? '20px' : '0px',
        }}
      >
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            backgroundColor: 'var(--color-crimson)',
            color: '#FFFFFF',
            fontSize: '13px',
            fontWeight: 600,
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-crimson)',
            transition: 'opacity 0.15s ease',
          }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
