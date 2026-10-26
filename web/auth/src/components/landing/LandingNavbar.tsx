'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Menu, X } from 'lucide-react';
import { CrimFigLogo } from '../CrimFigLogo';
import { Button } from '../ui/button';

const links = [
  { href: '#features', label: 'Capabilities' },
  { href: '#security', label: 'Security & 2FA' },
  { href: '#security', label: 'Team Workspaces' },
  { href: '#faq', label: 'FAQ' },
];

export function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

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
          <Button asChild variant="outline" size="sm">
            <Link href="/login">Sign In</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/signup">
              Create Account <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </Button>
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
          <Button asChild variant="outline" className="cf-mobile-nav-cta">
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
          </Button>
          <Button asChild className="cf-mobile-nav-cta">
            <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
              Create Account <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </Button>
      </nav>
    </header>
  );
}
