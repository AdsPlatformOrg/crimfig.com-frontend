'use client';

import React, { useState } from 'react';
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
  ChevronDown 
} from 'lucide-react';
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
  primaryAction = { label: 'New Campaign', href: '/campaigns/new' },
  user = {
    name: 'CrimFig Creator',
    email: 'creator@crimfig.com',
  },
  navigationItems = [
    { label: 'Home', href: '/dashboard', active: true },
    { label: 'Marketplace', href: '/promoter/marketplace' },
    { label: 'Sites & Placements', href: '/promoter/websites' },
    { label: 'Performance', href: '/reports' },
  ],
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch?.(e.target.value);
  };

  return (
    <header className="cf-template-header">
      <div className="cf-template-header-container">
        {/* Brand Area */}
        <div className="cf-template-logo-area">
          <Link href="/" aria-label="CrimFig Home" style={{ display: 'flex', alignItems: 'center' }}>
            <CrimFigLogo size={36} variant="brand" />
          </Link>
          {appName && (
            <span style={{ 
              fontSize: '0.8125rem', 
              fontWeight: 600, 
              color: 'var(--text-muted)', 
              borderLeft: '1px solid var(--border-subtle)', 
              paddingLeft: '10px' 
            }}>
              {appName}
            </span>
          )}
        </div>

        {/* Search Bar */}
        <div className="cf-template-search-wrapper">
          <div className="cf-template-search-icon">
            <Search size={18} />
          </div>
          <input
            type="search"
            className="cf-template-search-input"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={handleSearchChange}
            aria-label="Search"
          />
        </div>

        {/* Desktop Header Actions */}
        <div className="cf-template-header-actions" style={{ display: 'flex' }}>
          {primaryAction && (
            primaryAction.href ? (
              <Link href={primaryAction.href} className="cf-template-action-btn-primary">
                <Plus size={16} />
                <span>{primaryAction.label}</span>
              </Link>
            ) : (
              <button onClick={primaryAction.onClick} className="cf-template-action-btn-primary">
                <Plus size={16} />
                <span>{primaryAction.label}</span>
              </button>
            )
          )}

          {/* Notifications */}
          <button 
            type="button" 
            className="cf-template-icon-btn" 
            aria-label="View notifications"
            onClick={() => {}}
          >
            <Bell size={18} />
          </button>

          {/* Profile Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
              }}
              aria-expanded={userMenuOpen}
              aria-label="User profile menu"
            >
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  style={{ width: '32px', height: '32px', borderRadius: '9999px', objectFit: 'cover' }}
                />
              ) : (
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '9999px',
                  backgroundColor: 'var(--color-crimson)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                }}>
                  {user.name.charAt(0)}
                </div>
              )}
              <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
            </button>

            {userMenuOpen && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  marginTop: '8px',
                  width: '200px',
                  backgroundColor: 'var(--bg-elevated)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)',
                  border: '1px solid var(--border-subtle)',
                  padding: '6px 0',
                  zIndex: 50,
                }}
              >
                <div style={{ padding: '8px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{user.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
                </div>
                <Link
                  href="/profile"
                  onClick={() => setUserMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    fontSize: '0.875rem',
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                  }}
                >
                  <User size={16} />
                  <span>Profile</span>
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setUserMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    fontSize: '0.875rem',
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                  }}
                >
                  <Settings size={16} />
                  <span>Settings</span>
                </Link>
                <div style={{ borderTop: '1px solid var(--border-subtle)', margin: '4px 0' }} />
                <button
                  type="button"
                  onClick={() => {
                    setUserMenuOpen(false);
                    window.location.href = 'https://auth.crimfig.com/logout';
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    fontSize: '0.875rem',
                    color: 'var(--color-error)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <LogOut size={16} />
                  <span>Sign out</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="cf-template-icon-btn"
            style={{ display: 'none' }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <nav style={{
          backgroundColor: 'var(--bg-elevated)',
          borderTop: '1px solid var(--border-subtle)',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}>
          {navigationItems.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: item.active ? 'var(--bg-surface)' : 'transparent',
                color: item.active ? 'var(--color-crimson)' : 'var(--text-secondary)',
                fontWeight: item.active ? 600 : 400,
                textDecoration: 'none',
                fontSize: '0.9375rem',
              }}
            >
              {item.label}
            </Link>
          ))}
          <div style={{ borderTop: '1px solid var(--border-subtle)', margin: '8px 0' }} />
          {primaryAction && (
            <Link
              href={primaryAction.href || '#'}
              className="cf-template-action-btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Plus size={16} />
              <span>{primaryAction.label}</span>
            </Link>
          )}
        </nav>
      )}
    </header>
  );
};
