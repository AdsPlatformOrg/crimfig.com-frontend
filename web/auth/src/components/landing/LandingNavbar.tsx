'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Menu, X } from 'lucide-react';
import { CrimFigLogo } from '../CrimFigLogo';
import { Button } from '../ui/button';
import { useSessionSnapshot } from '../SessionGate';
import { publicHeaderActions } from '../../lib/public-header';

const links = [
  { href: '#features', label: 'Capabilities' },
  { href: '#security', label: 'Security & 2FA' },
  { href: '#security', label: 'Team Workspaces' },
  { href: '#faq', label: 'FAQ' },
];

export function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const actions = publicHeaderActions(useSessionSnapshot());

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
          variant="brand"
          size={42}
          app="Auth"
          appBadge="SSO"
          subtext="Central Identity, Business Accounts & Security"
          href="/"
        />

        <nav className="cf-site-nav" aria-label="Main navigation">
          {links.map((link) => (
            <a key={`${link.href}-${link.label}`} href={link.href} className="cf-site-nav-link">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="cf-site-actions">
          {actions.map(action => <Button key={action.href} asChild variant={action.primary ? 'default' : 'outline'} size="sm">
            <Link href={action.href}>{action.label}{action.primary && <ArrowRight size={16} aria-hidden="true" />}</Link>
          </Button>)}
          <Button
            ref={menuButtonRef}
            className="cf-mobile-menu-toggle"
            variant="outline"
            size="icon"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="auth-mobile-navigation"
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </div>

      <nav
        id="auth-mobile-navigation"
        className="cf-mobile-nav-panel"
        aria-label="Mobile navigation"
        hidden={!mobileMenuOpen}
      >
          {links.map((link) => (
            <a
              key={`${link.href}-${link.label}`}
              href={link.href}
              className="cf-site-nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          {actions.map(action => <Button key={action.href} asChild variant={action.primary ? 'default' : 'outline'} className="cf-mobile-nav-cta">
            <Link href={action.href} onClick={() => setMobileMenuOpen(false)}>{action.label}{action.primary && <ArrowRight size={16} aria-hidden="true" />}</Link>
          </Button>)}
      </nav>
    </header>
  );
}
