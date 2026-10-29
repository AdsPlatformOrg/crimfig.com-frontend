'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Search,
  Bell,
  Menu,
  X,
  User,
  Settings,
  LogOut,
  Plus,
  ChevronDown,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { AccountMenu } from '../../../../../shared/ui/account-menu';
import { dashboardSession } from '../../lib/session';
import { ecosystemOrigin } from '../../../../../shared/ui/origins';
import { CrimFigLogo } from '../CrimFigLogo';
import './template-layout.css';

export interface HeaderNavItem {
  label: string;
  href: string;
  active?: boolean;
}

export interface HeaderProps {
  appName?: string;
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
  onNotificationsClick?: () => void;
  primaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  user?: {
    name: string;
    email: string;
    avatarUrl?: string;
  };
  navigationItems?: HeaderNavItem[];
}

export const ModernTemplateHeader: React.FC<HeaderProps> = ({
  appName = 'Studio',
  onSearch,
  searchPlaceholder = 'Search campaigns, creatives, or metrics...',
  onNotificationsClick,
  primaryAction,
  user,
  navigationItems = [],
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const userMenuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!mobileMenuOpen && !userMenuOpen) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (mobileMenuOpen) {
        setMobileMenuOpen(false);
        mobileMenuButtonRef.current?.focus();
      }
      if (userMenuOpen) userMenuButtonRef.current?.focus();
      setUserMenuOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [mobileMenuOpen, userMenuOpen]);

  const renderPrimaryAction = (mobile = false) => {
    if (!primaryAction) return null;
    const className = mobile
      ? 'cf-template-primary-action cf-template-mobile-action'
      : 'cf-template-primary-action';
    const content = (
      <>
        <Plus size={16} aria-hidden="true" />
        <span>{primaryAction.label}</span>
      </>
    );

    if (primaryAction.href) {
      return (
        <Button asChild size="sm" className={className}>
          <Link href={primaryAction.href} onClick={() => setMobileMenuOpen(false)}>
            {content}
          </Link>
        </Button>
      );
    }
    if (primaryAction.onClick) {
      return (
        <Button
          size="sm"
          className={className}
          onClick={() => {
            setMobileMenuOpen(false);
            primaryAction.onClick?.();
          }}
        >
          {content}
        </Button>
      );
    }
    return null;
  };

  const renderNavigationLinks = () =>
    navigationItems.map((item) => (
      <Link
        key={`${item.href}-${item.label}`}
        href={item.href}
        className={`cf-template-mobile-nav-link${item.active ? ' active' : ''}`}
        aria-current={item.active ? 'page' : undefined}
        onClick={() => setMobileMenuOpen(false)}
      >
        {item.label}
      </Link>
    ));
  const hasPrimaryAction = Boolean(primaryAction?.href || primaryAction?.onClick);
  const hasNavigation = navigationItems.length > 0;

  return (
    <header className="cf-template-header">
      <div className="cf-template-header-container">
        <div className="cf-template-logo-area">
          <Link href="/" aria-label="CrimFig Home" className="cf-template-brand-link">
            <CrimFigLogo size={36} variant="brand" />
          </Link>

        </div>

        {hasNavigation && (
          <nav className="cf-template-desktop-nav" aria-label="Primary navigation">
            {renderNavigationLinks()}
          </nav>
        )}

        {onSearch && (
          <div className="cf-template-search-wrapper">
            <div className="cf-template-search-icon" aria-hidden="true">
              <Search size={18} />
            </div>
            <Input
              type="search"
              className="cf-template-search-input"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                onSearch(event.target.value);
              }}
              aria-label="Search"
            />
          </div>
        )}

        <div className="cf-template-header-actions">
          {renderPrimaryAction()}
          {onNotificationsClick && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="cf-template-notifications-button"
              aria-label="View notifications"
              onClick={onNotificationsClick}
            >
              <Bell size={18} aria-hidden="true" />
            </Button>
          )}

          {user && <AccountMenu session={dashboardSession()} links={[{label:'Profile & Avatar',href:`${ecosystemOrigin('auth',process.env.NEXT_PUBLIC_AUTH_WEB_URL)}/profile`},{label:'Ads Settings',href:'/settings'}]} />}

          {(hasNavigation || hasPrimaryAction) && (
            <Button
              ref={mobileMenuButtonRef}
              type="button"
              variant="outline"
              size="icon"
              className="cf-template-mobile-menu"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="cf-template-mobile-navigation"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          )}
        </div>
      </div>

      {(hasNavigation || hasPrimaryAction) && (
        <nav
          id="cf-template-mobile-navigation"
          className="cf-template-mobile-nav"
          aria-label="Mobile navigation"
          hidden={!mobileMenuOpen}
        >
          {renderNavigationLinks()}
          {renderPrimaryAction(true)}
        </nav>
      )}
    </header>
  );
};
