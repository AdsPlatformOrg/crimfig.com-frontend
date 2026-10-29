'use client';

import React, { useRef, useState } from 'react';
import { ArrowRight, Gift, Menu, Wallet, X } from 'lucide-react';
import { CrimFigLogo } from '../CrimFigLogo';
import { Button } from '../ui/button';

interface LandingNavbarProps {
  onLaunchConsole: (tab?: 'overview' | 'rewards') => void;
}

const links = [
  { href: '#features', label: 'Features' },
  { href: '#rewards', label: 'Rewards & Cashback', icon: Gift },
  { href: '#calculator', label: 'FX Calculator' },
  { href: '#security', label: 'Security & Rails' },
];

export function LandingNavbar({ onLaunchConsole }: LandingNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const launchConsole = () => {
    setMobileMenuOpen(false);
    onLaunchConsole('overview');
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
          app="Billing"
          appBadge="Fintech Engine"
          subtext="Wallet Funding, Campaign Escrow & History"
        />

        <nav className="cf-site-nav" aria-label="Main navigation">
          {links.map(({ href, label, icon: Icon }) => (
            <a key={href} href={href} className="cf-site-nav-link">
              {Icon && <Icon size={15} aria-hidden="true" />}
              {label}
            </a>
          ))}
        </nav>

        <div className="cf-site-actions">
          <Button onClick={launchConsole} size="sm">
            <Wallet size={16} aria-hidden="true" />
            <span>Launch Console</span>
            <ArrowRight size={16} aria-hidden="true" />
          </Button>
          <Button
            ref={menuButtonRef}
            className="cf-mobile-menu-toggle"
            variant="outline"
            size="icon"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="billing-mobile-navigation"
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </div>

      <nav
        id="billing-mobile-navigation"
        className="cf-mobile-nav-panel"
        aria-label="Mobile navigation"
        hidden={!mobileMenuOpen}
      >
          {links.map(({ href, label, icon: Icon }) => (
            <a
              key={href}
              href={href}
              className="cf-site-nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              {Icon && <Icon size={16} aria-hidden="true" />}
              {label}
            </a>
          ))}
          <Button onClick={launchConsole} className="cf-mobile-nav-cta">
            Launch Console <ArrowRight size={16} aria-hidden="true" />
          </Button>
      </nav>
    </header>
  );
}
