'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Home, 
  Flame, 
  Users, 
  TrendingUp, 
  Globe, 
  Tag, 
  Settings, 
  BarChart3, 
  CreditCard 
} from 'lucide-react';
import { ModernTemplateHeader, HeaderProps } from './ModernTemplateHeader';
import { WhoToFollowWidget, TrendingWidget, QuickHelpWidget } from './SidebarWidgets';
import { ThemeSwitcher } from '../ThemeSwitcher';
import './template-layout.css';

export interface NavLinkItem {
  id: string;
  label: string;
  href: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

export interface TabOption {
  id: string;
  label: string;
  count?: number;
}

export interface ThreeColumnSocialDashboardTemplateProps {
  headerProps?: HeaderProps;
  primaryNav?: NavLinkItem[];
  secondaryCategories?: {
    heading: string;
    items: { label: string; href: string }[];
  };
  tabs?: TabOption[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  children: React.ReactNode;
  rightRail?: React.ReactNode;
  activeNavId?: string;
}

export const defaultPrimaryNav: NavLinkItem[] = [
  { id: 'home', label: 'Home Feed', href: '/dashboard', icon: <Home size={18} /> },
  { id: 'popular', label: 'Top Campaigns', href: '/marketplace', icon: <Flame size={18} /> },
  { id: 'publishers', label: 'Publishers Hub', href: '/websites', icon: <Users size={18} /> },
  { id: 'performance', label: 'Trending Metrics', href: '/reports', icon: <TrendingUp size={18} /> },
];

export const ThreeColumnSocialDashboardTemplate: React.FC<ThreeColumnSocialDashboardTemplateProps> = ({
  headerProps,
  primaryNav = defaultPrimaryNav,
  secondaryCategories = {
    heading: 'Channels & Verticals',
    items: [
      { label: 'Technology & SaaS', href: '/marketplace?category=tech' },
      { label: 'Finance & Crypto', href: '/marketplace?category=finance' },
      { label: 'Entertainment & Gaming', href: '/marketplace?category=gaming' },
      { label: 'Lifestyle & Wellness', href: '/marketplace?category=lifestyle' },
      { label: 'Business & Careers', href: '/marketplace?category=business' },
    ],
  },
  tabs = [
    { id: 'recent', label: 'Recent Deals' },
    { id: 'top-performing', label: 'Top Performing' },
    { id: 'highest-yield', label: 'Highest Yield' },
  ],
  activeTab: controlledActiveTab,
  onTabChange,
  children,
  rightRail,
  activeNavId = 'home',
}) => {
  const [internalTab, setInternalTab] = useState(tabs[0]?.id || 'recent');
  const activeTab = controlledActiveTab !== undefined ? controlledActiveTab : internalTab;

  const handleTabClick = (id: string) => {
    setInternalTab(id);
    onTabChange?.(id);
  };

  return (
    <div className="cf-template-root">
      {/* Top Persistent Search + Utility Header */}
      <ModernTemplateHeader {...headerProps} />

      {/* 3-Column Body Layout Container */}
      <div className="cf-template-body">
        <div className="cf-template-grid">
          
          {/* Left Column: Sticky Contextual Navigation & Categories */}
          <aside className="cf-template-sidebar-left">
            <nav aria-label="Sidebar Navigation">
              {/* Primary Group */}
              <div className="cf-template-nav-group">
                {primaryNav.map((item) => {
                  const isActive = item.id === activeNavId;
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={`cf-template-nav-item ${isActive ? 'active' : ''}`}
                    >
                      {item.icon && (
                        <span style={{ color: isActive ? 'var(--color-crimson)' : 'var(--text-muted)' }}>
                          {item.icon}
                        </span>
                      )}
                      <span style={{ flex: 1 }}>{item.label}</span>
                      {item.badge !== undefined && (
                        <span style={{
                          fontSize: '0.6875rem',
                          padding: '2px 6px',
                          borderRadius: '9999px',
                          backgroundColor: isActive ? 'var(--color-crimson)' : 'var(--bg-surface)',
                          color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                          fontWeight: 600,
                        }}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Secondary Category / Communities Group */}
              {secondaryCategories && (
                <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
                  <div className="cf-template-nav-heading">
                    {secondaryCategories.heading}
                  </div>
                  <div className="cf-template-nav-group" style={{ marginTop: '8px' }}>
                    {secondaryCategories.items.map((cat, idx) => (
                      <Link
                        key={idx}
                        href={cat.href}
                        className="cf-template-nav-item"
                        style={{ fontSize: '0.8125rem' }}
                      >
                        <Tag size={14} style={{ color: 'var(--text-muted)' }} />
                        <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                          {cat.label}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </nav>
          </aside>

          {/* Center Column: Filter Tabs + Main Feed / Console Content */}
          <main className="cf-template-main-content">
            {/* Filter Tabs Controller */}
            {tabs.length > 0 && (
              <div className="cf-template-tabs-nav" role="tablist">
                {tabs.map((tab) => {
                  const isActive = tab.id === activeTab;
                  return (
                    <button
                      key={tab.id}
                      role="tab"
                      aria-selected={isActive}
                      className={`cf-template-tab-btn ${isActive ? 'active' : ''}`}
                      onClick={() => handleTabClick(tab.id)}
                    >
                      <span>{tab.label}</span>
                      {tab.count !== undefined && (
                        <span style={{
                          marginLeft: '6px',
                          fontSize: '0.75rem',
                          opacity: 0.8,
                        }}>
                          ({tab.count})
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Dynamic Center Page Content (Cards, Tables, Forms, or Views) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {children}
            </div>
          </main>

          {/* Right Column: Sticky Widgets Rail */}
          <aside className="cf-template-sidebar-right">
            {rightRail || (
              <>
                <WhoToFollowWidget
                  items={[
                    { id: '1', name: 'DevWeekly Magazine', handle: '@devweekly', badge: 'Tier 1' },
                    { id: '2', name: 'Cryptonews Portal', handle: '@cryptonews', badge: 'Verified' },
                    { id: '3', name: 'IndieFounders Network', handle: '@indiefounders', badge: 'High Yield' },
                  ]}
                />
                <TrendingWidget
                  items={[
                    { id: 't1', title: 'Top Banner slots open for Q4 developer summits', metricLabel: '42 slots remaining' },
                    { id: 't2', title: 'Finance newsletters accepting direct CPM sponsorship', metricLabel: '98.4% fill rate' },
                  ]}
                />
                <QuickHelpWidget />
              </>
            )}
          </aside>

        </div>
      </div>

      {/* Standardized Console Footer with Theme: Light Dark */}
      <footer
        style={{
          borderTop: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-elevated)',
          padding: '18px 24px',
          marginTop: 'auto',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            fontSize: '12px',
            color: 'var(--text-muted)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>CrimFig Platform</span>
            <span>•</span>
            <span>© {new Date().getFullYear()} CrimFig Ecosystem</span>
          </div>

          <ThemeSwitcher showLabel labelPrefix="Theme:" />
        </div>
      </footer>
    </div>
  );
};

