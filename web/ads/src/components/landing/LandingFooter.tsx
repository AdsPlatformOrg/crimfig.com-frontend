'use client';

import { LanguagePicker } from '../../../../../shared/ui/localization/LanguagePicker';
import { LegalFooterLinks } from '../../../../../shared/ui/legal/LegalPages';

import { ecosystemOrigin } from '../../../../../shared/ui/origins';
import React from 'react';
import Link from 'next/link';
import { ThemeSwitcher } from '../ThemeSwitcher';
import { ExternalLink, Heart } from 'lucide-react';
import { CrimFigLogo } from '../CrimFigLogo';
import { Button } from '../ui/button';
import { useLanguage } from '../../../../../shared/ui/localization/LocalizationProvider';
import { adsPreviewHref, usePreviewCopy } from './usePreviewCopy';

interface LandingFooterProps {
  onLaunchConsole: (defaultRole?: 'advertiser' | 'promoter') => void;
}

export function LandingFooter({ onLaunchConsole }: LandingFooterProps) {
  const copy = usePreviewCopy();
  const { locale } = useLanguage();
  return (
    <footer
      style={{
        backgroundColor: 'var(--bg-page)',
        borderTop: '1px solid var(--border-subtle)',
        padding: '64px 24px 32px',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '40px',
            marginBottom: '48px',
          }}
        >
          {/* Brand Col */}
          <div>
            <CrimFigLogo
              variant="brand"
              size={32}
              app="Ads"
              style={{ marginBottom: '14px' }}
            />
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 16px' }}>
              {copy("Campaign tools for advertisers, publishers and creators.")}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <LanguagePicker />
              <ThemeSwitcher showLabel labelPrefix={copy("Theme:")} />
            </div>
          </div>

          {/* Advertisers Col */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.6px', margin: '0 0 16px' }}>
              {copy("For Advertisers")}
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <li>
                <Button
                  type="button"
                  onClick={() => onLaunchConsole('advertiser')}
                  variant="link"
                  size="sm"
                  style={{ padding: 0, color: 'var(--text-secondary)', font: 'inherit', justifyContent: 'flex-start' }}
                >
                  {copy("Campaign Studio")}
                </Button>
              </li>
              <li>
                <Button
                  type="button"
                  onClick={() => onLaunchConsole('advertiser')}
                  variant="link"
                  size="sm"
                  style={{ padding: 0, color: 'var(--text-secondary)', font: 'inherit', justifyContent: 'flex-start' }}
                >
                  {copy("Performance Dashboard")}
                </Button>
              </li>
              <li>
                <Link href={adsPreviewHref('/#what-we-do', locale)} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                  {copy("Asset Formats & Specs")}
                </Link>
              </li>
              <li>
                <a href={ecosystemOrigin('billing', process.env.NEXT_PUBLIC_BILLING_WEB_URL, process.env.NEXT_PUBLIC_AUTH_WEB_URL)} target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {copy("Billing & Escrow")} <ExternalLink style={{ width: 12, height: 12 }} />
                </a>
              </li>
            </ul>
          </div>

          {/* Promoters Col */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.6px', margin: '0 0 16px' }}>
              {copy("For Promoters")}
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <li>
                <Button
                  type="button"
                  onClick={() => onLaunchConsole('promoter')}
                  variant="link"
                  size="sm"
                  style={{ padding: 0, color: 'var(--text-secondary)', font: 'inherit', justifyContent: 'flex-start' }}
                >
                  {copy("Website Embed Codes")}
                </Button>
              </li>
              <li>
                <Button
                  type="button"
                  onClick={() => onLaunchConsole('promoter')}
                  variant="link"
                  size="sm"
                  style={{ padding: 0, color: 'var(--text-secondary)', font: 'inherit', justifyContent: 'flex-start' }}
                >
                  {copy("Mobile App SDK Setup")}
                </Button>
              </li>
              <li>
                <Button
                  type="button"
                  onClick={() => onLaunchConsole('promoter')}
                  variant="link"
                  size="sm"
                  style={{ padding: 0, color: 'var(--text-secondary)', font: 'inherit', justifyContent: 'flex-start' }}
                >
                  {copy("Creator Share Links")}
                </Button>
              </li>
              <li>
                <Link href={adsPreviewHref('/#partners', locale)} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                  {copy("Publishing Options")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Ecosystem Col */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.6px', margin: '0 0 16px' }}>
              {copy("CrimFig Ecosystem")}
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <li><Link href={adsPreviewHref('/about', locale)} style={{ color: 'var(--text-secondary)' }}>{copy("About CrimFig")}</Link></li>
              <li><Link href={adsPreviewHref('/how-to-use', locale)} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>How to Use</Link></li>
              <li><Link href="/support" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Help &amp; Support</Link></li>
              <li><a href="mailto:support@crimfig.com" style={{ color: 'var(--color-crimson)', textDecoration: 'none', fontWeight: 600 }}>support@crimfig.com</a></li>
              <li>
                <a href="https://crimfig.com" target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  CrimFig Hub <ExternalLink style={{ width: 12, height: 12 }} />
                </a>
              </li>
              <li>
                <a href="https://shop.crimfig.com" target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  CrimFig Store <ExternalLink style={{ width: 12, height: 12 }} />
                </a>
              </li>
              <li>
                <a href="https://reels.crimfig.com" target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  CrimFig Reels <ExternalLink style={{ width: 12, height: 12 }} />
                </a>
              </li>
              <li>
                <a href={ecosystemOrigin('auth', process.env.NEXT_PUBLIC_AUTH_WEB_URL, process.env.NEXT_PUBLIC_AUTH_WEB_URL)} target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {copy("CrimFig Single Sign-On")} <ExternalLink style={{ width: 12, height: 12 }} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            fontSize: '12px',
            color: 'var(--text-muted)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span>© 2026 CRIMFIG. All rights reserved.</span>
            <span>•</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--color-crimson)', fontWeight: 600 }}>
              <Heart style={{ width: 12, height: 12, fill: 'var(--color-crimson)' }} /> {copy("Built on a Foundation of Love")}
            </span>
          </div>

          <LegalFooterLinks />

        </div>
      </div>
    </footer>
  );
}
