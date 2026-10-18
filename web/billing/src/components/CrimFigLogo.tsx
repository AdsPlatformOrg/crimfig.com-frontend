'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export interface CrimFigLogoProps {
  variant?: 'icon' | 'brand' | 'full' | 'red-badge';
  size?: number; // dimension in pixels for icon (default: 40)
  app?: string; // e.g. "Billing", "Ads", "Auth"
  appBadge?: string; // e.g. "Universal Escrow", "Fintech Engine", "Network"
  subtext?: string; // sub-label under brand name
  centered?: boolean; // centers the logo with auto margins
  href?: string; // if provided, wraps the logo in a Next.js Link
  priority?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function CrimFigLogo({
  variant = 'icon',
  size = 40,
  app,
  appBadge,
  subtext,
  centered = false,
  href,
  priority = true,
  className,
  style,
}: CrimFigLogoProps) {
  // 1. Full horizontal logo image
  if (variant === 'full') {
    const fullWidth = Math.round(size * 2.91);
    const fullContent = (
      <Image
        src="/img/logo.png"
        alt="CrimFig"
        width={fullWidth}
        height={size}
        priority={priority}
        className={className}
        style={{
          height: `${size}px`,
          width: 'auto',
          objectFit: 'contain',
          display: centered ? 'block' : 'inline-block',
          margin: centered ? '0 auto' : undefined,
          ...style,
        }}
      />
    );
    return href ? <Link href={href}>{fullContent}</Link> : fullContent;
  }

  // 2. Red-badge horizontal logo image
  if (variant === 'red-badge') {
    const badgeWidth = Math.round(size * 2.55);
    const redContent = (
      <Image
        src="/img/logo-red.png"
        alt="CrimFig"
        width={badgeWidth}
        height={size}
        priority={priority}
        className={className}
        style={{
          height: `${size}px`,
          width: 'auto',
          objectFit: 'contain',
          display: centered ? 'block' : 'inline-block',
          margin: centered ? '0 auto' : undefined,
          ...style,
        }}
      />
    );
    return href ? <Link href={href}>{redContent}</Link> : redContent;
  }

  // 3. Standalone Icon
  const iconImg = (
    <Image
      src="/img/logo-icon.png"
      alt="CrimFig"
      width={size}
      height={size}
      priority={priority}
      className={className}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        objectFit: 'contain',
        display: centered ? 'block' : 'inline-block',
        margin: centered ? '0 auto' : undefined,
        ...style,
      }}
    />
  );

  if (variant === 'icon') {
    return href ? (
      <Link href={href} style={{ display: centered ? 'block' : 'inline-block' }}>
        {iconImg}
      </Link>
    ) : (
      iconImg
    );
  }

  // 4. Combined Brand Header (Icon + Text + Badge + Subtext)
  const brandContent = (
    <div
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        textDecoration: 'none',
        ...style,
      }}
    >
      {iconImg}
      <div>
        <div
          style={{
            fontWeight: 800,
            fontSize: `${Math.max(16, Math.round(size * 0.45))}px`,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--text-primary)',
            letterSpacing: '-0.3px',
            lineHeight: 1.2,
          }}
        >
          <span>CrimFig</span>
          {app && <span style={{ color: 'var(--color-crimson)' }}>{app}</span>}
          {appBadge && (
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '9999px',
                backgroundColor: 'var(--color-crimson)',
                color: '#FFFFFF',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              {appBadge}
            </span>
          )}
        </div>
        {subtext && (
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '2px 0 0', lineHeight: 1.3 }}>
            {subtext}
          </p>
        )}
      </div>
    </div>
  );

  return href ? (
    <Link href={href} style={{ textDecoration: 'none' }}>
      {brandContent}
    </Link>
  ) : (
    brandContent
  );
}
