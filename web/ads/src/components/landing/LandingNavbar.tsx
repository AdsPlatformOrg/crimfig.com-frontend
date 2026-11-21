'use client';

import React, { useRef, useState } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { CrimFigLogo } from '../CrimFigLogo';
import { Button } from '../ui/button';
import { LanguagePicker } from '../../../../../shared/ui/localization/LanguagePicker';
import { useLanguage } from '../../../../../shared/ui/localization/LocalizationProvider';

interface LandingNavbarProps {
  onLaunchConsole: (defaultRole?: 'advertiser' | 'promoter') => void;
}

const links = [
  { href: '/', label: 'home' },
  { href: '/about', label: 'about' },
] as const;

export function LandingNavbar({ onLaunchConsole }: LandingNavbarProps) {
  const t = useTranslations('common');
  const { locale } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const launchConsole = () => {
    setMobileMenuOpen(false);
    onLaunchConsole('advertiser');
  };

  return (
    <header
      className="cf-site-header"
      onKeyDown={(event) => {
        if (event.key === 'Escape' && mobileMenuOpen) {
          setMobileMenuOpen(false);
          menuButtonRef.current?.focus();
        }
      }}
    >
      <div className="cf-site-header-inner">
        <CrimFigLogo
          href="/" variant="brand"
          size={42}
          app="Ads"
          appBadge="Network"
          subtext="Performance Advertising & 3-Tier Publishing"
        />

        <nav className="cf-site-nav" aria-label="Main navigation">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="cf-site-nav-link">
              {t(link.label)}
            </Link>
          ))}
        </nav>

        <div className="cf-site-actions">
          <LanguagePicker />
          <Button onClick={launchConsole} size="sm">
            <span>{t('launch')}</span>
            <ArrowRight size={16} aria-hidden="true" />
          </Button>
          <Button
            ref={menuButtonRef}
            className="cf-mobile-menu-toggle"
            variant="outline"
            size="icon"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="ads-mobile-navigation"
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </div>

      {locale === 'fr' && <p className="cf-site-header-inner">Aperçu en français. Certaines pages sont encore en anglais.</p>}
      {locale === 'es' && <p className="cf-site-header-inner">Vista previa en español. Algunas páginas siguen en inglés.</p>}

      <nav
        id="ads-mobile-navigation"
        className="cf-mobile-nav-panel"
        aria-label="Mobile navigation"
        hidden={!mobileMenuOpen}
      >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="cf-site-nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t(link.label)}
            </Link>
          ))}
          <Button onClick={launchConsole} className="cf-mobile-nav-cta">
            {t('launch')} <ArrowRight size={16} aria-hidden="true" />
          </Button>
      </nav>
    </header>
  );
}
