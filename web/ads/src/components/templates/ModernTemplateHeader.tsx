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
          {appName && <span className="cf-template-app-name">{appName}</span>}
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

          {user && (
            <div className="cf-template-user-menu">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                ref={userMenuButtonRef}
                onClick={() => setUserMenuOpen((open) => !open)}
                aria-expanded={userMenuOpen}
                aria-controls="cf-template-user-menu"
                aria-label={`Profile menu for ${user.name}`}
              >
                {user.avatarUrl ? (
                  <Image
                    src={user.avatarUrl}
                    alt=""
                    width={32}
                    height={32}
                    unoptimized
                    className="cf-template-avatar-image"
                  />
                ) : (
                  <span className="cf-template-avatar-fallback" aria-hidden="true">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                )}
                <span className="cf-template-user-name">{user.name}</span>
                <ChevronDown size={14} aria-hidden="true" />
              </Button>

              <div
                id="cf-template-user-menu"
                className="cf-template-user-menu-popover"
                aria-label="User actions"
                hidden={!userMenuOpen}
              >
                <div className="cf-template-user-summary">
                  <div>{user.name}</div>
                  <div>{user.email}</div>
                </div>
                <Link href="/profile" onClick={() => setUserMenuOpen(false)}>
                  <User size={16} aria-hidden="true" />
                  <span>Profile</span>
                </Link>
                <Link href="/settings" onClick={() => setUserMenuOpen(false)}>
                  <Settings size={16} aria-hidden="true" />
                  <span>Settings</span>
                </Link>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setUserMenuOpen(false);
                    window.location.href = 'https://auth.crimfig.com/logout';
                  }}
                >
                  <LogOut size={16} aria-hidden="true" />
                  <span>Sign out</span>
                </Button>
              </div>
            </div>
          )}

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
