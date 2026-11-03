'use client';

import React from 'react';
import { CrimFigLogo } from './CrimFigLogo';

interface AuthBrandHeaderProps {
  title: string;
  appearance?: 'light';
  subtitle?: string;
  logoSize?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function AuthBrandHeader({
  title,
  appearance,
  subtitle,
  logoSize = 56,
  className,
  style,
}: AuthBrandHeaderProps) {
  return (
    <div
      className={className}
      style={{
        textAlign: 'center',
        marginBottom: '28px',
        ...style,
      }}
    >
      <CrimFigLogo
        variant={appearance ? "full" : "icon"}
        appearance={appearance ? "light" : "auto"}
        size={appearance ? 36 : logoSize}
        centered
        href="/"
        style={{ marginBottom: '16px' }}
      />
      <h1
        style={{
          fontSize: appearance ? '22px' : '24px',
          fontWeight: 700,
          color: 'var(--text-primary, #FFFFFF)',
          marginBottom: '6px',
          letterSpacing: '-0.02em',
        }}
      >
        {title}
      </h1>
      {subtitle && (
        <p
          style={{
            color: 'var(--text-muted, #94A3B8)',
            fontSize: '13px',
            lineHeight: 1.5,
            margin: 0,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
