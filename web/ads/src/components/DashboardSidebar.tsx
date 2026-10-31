'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Button } from './ui/button';
import {
  BarChart3,
  Layers,
  Globe,
  Code2,
  Share2,
  DollarSign,
  ShieldCheck,
  ShieldAlert,
  CreditCard,
  Target,
  Sparkles,
  HelpCircle,
  Bell,
  Settings,
  Wallet,
  Building2,
  Clock,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  UserCheck,
} from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ style?: React.CSSProperties; className?: string }>;
  badge?: string | number;
  countKey?: string;
  action?: () => void;
  href?: string;
  active?: boolean;
  children?: NavItem[];
  roles?: string[];
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export interface DashboardSidebarProps {
  app: 'ads' | 'billing' | 'auth';
  groups: NavGroup[];
  activeId: string;
  onSelect: (id: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  switchAppLink?: {
    label: string;
    href: string;
    icon: React.ComponentType<{ style?: React.CSSProperties }>;
  };
}

export function DashboardSidebar({
  app,
  groups,
  activeId,
  onSelect,
  isCollapsed = false,
  onToggleCollapse,
  isMobileOpen = false,
  onCloseMobile,
  switchAppLink,
}: DashboardSidebarProps) {
  const sidebarRef=useRef<HTMLElement>(null);
  useEffect(()=>{if(!isMobileOpen)return;const old=document.body.style.overflow;const previous=document.activeElement as HTMLElement;document.body.style.overflow='hidden';const root=sidebarRef.current;const focusable=()=>Array.from(root?.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),[tabindex="0"]')||[]);focusable()[0]?.focus();const key=(e:KeyboardEvent)=>{if(e.key==='Escape'){onCloseMobile?.();return;}if(e.key==='Tab'){const nodes=focusable();const first=nodes[0],last=nodes[nodes.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}}};root?.addEventListener('keydown',key);return()=>{document.body.style.overflow=old;root?.removeEventListener('keydown',key);previous?.focus();};},[isMobileOpen,onCloseMobile]);
  const [expanded,setExpanded]=useState<Record<string,boolean>>({});
  useEffect(()=>{for(const group of groups)for(const item of group.items)if(item.children?.some(child=>child.id===activeId))setExpanded(old=>({...old,[item.id]:true}));},[activeId,groups]);
  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          aria-hidden="true"
          onClick={onCloseMobile}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 1000,
          }}
        />
      )}

      {/* Sidebar Container */}
      <aside
        ref={sidebarRef}
        role={isMobileOpen?"dialog":undefined}
        aria-modal={isMobileOpen||undefined}
        id={`${app}-dashboard-sidebar`}
        className="cf-dashboard-sidebar"
        data-mobile-open={isMobileOpen}
        aria-label={`${app} navigation`}
        style={{
          width: isCollapsed ? '72px' : '260px',
          minWidth: isCollapsed ? '72px' : '260px',
          backgroundColor: 'var(--bg-elevated)',
          borderRight: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transition: 'width 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          boxSizing: 'border-box',
          height: '100%',
          overflowX: 'hidden',
          zIndex: isMobileOpen ? 1001 : 20,
          position: isMobileOpen ? 'fixed' : 'relative',
          top: 0,
          bottom: 0,
          left: 0,
        }}
      >
        {/* Top Section */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto', padding: '16px 12px' }}>
          {/* Mobile Close Button */}
          {isMobileOpen && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
              <Button
                type="button"
                onClick={onCloseMobile}
                aria-label="Close navigation menu"
                variant="ghost"
                size="icon"
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '4px',
                  width: '44px',
                  height: '44px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X style={{ width: 20, height: 20 }} />
              </Button>
            </div>
          )}

          {/* Nav Groups */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {groups.map((group, groupIdx) => (
              <div key={groupIdx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {!isCollapsed && group.title && (
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      color: 'var(--text-muted)',
                      padding: '4px 10px',
                    }}
                  >
                    {group.title}
                  </span>
                )}

                {group.items.map((item) => {
                  if(item.children){const containsActive=item.children.some(child=>child.id===activeId);const open=expanded[item.id]??containsActive;return <div key={item.id}><Button variant="ghost" aria-expanded={open} aria-controls={`nav-${item.id}`} onClick={()=>{if(isCollapsed)onToggleCollapse?.();setExpanded(old=>({...old,[item.id]:!open}));}} style={{width:'100%',minHeight:44,justifyContent:'flex-start',gap:8,color:'var(--text-primary)'}} title={isCollapsed?item.label:undefined}><item.icon style={{width:18,height:18}}/><span style={{fontSize:isCollapsed?10:13}}>{item.label}</span></Button>{open&&<ul id={`nav-${item.id}`} style={{listStyle:'none',padding:isCollapsed?0:'0 0 0 16px',margin:0}}>{item.children.map(child=><li key={child.id}><Link href={child.href||'#'} aria-current={child.id===activeId?'page':undefined} onClick={onCloseMobile} style={{display:'block',padding:'12px 8px',minHeight:44,fontSize:13,overflowWrap:'anywhere',background:child.id===activeId?'var(--badge-bg)':'transparent',color:child.id===activeId?'var(--color-crimson)':'var(--text-secondary)',borderRadius:8}}>{child.label}</Link></li>)}</ul>}</div>;}
                  const Icon = item.icon;
                  const isActive = activeId === item.id;

                  return (
                    <Button
                      key={item.id}
                      asChild={!!item.href}
                      type={item.href ? undefined : "button"}
                      variant="ghost"
                      aria-current={isActive ? 'page' : undefined}
                      onClick={() => {
                        if (!item.href) onSelect(item.id);
                        if (item.action) item.action();
                        if (onCloseMobile) onCloseMobile();
                      }}
                      title={isCollapsed ? item.label : undefined}
                      style={{
                        display: 'flex',
                        minHeight: '44px',
                        alignItems: 'center',
                        justifyContent: isCollapsed ? 'center' : 'space-between',
                        padding: isCollapsed ? '10px 0' : '9px 12px',
                        borderRadius: '10px',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontFamily: "'Poppins', Arial, Helvetica, sans-serif",
                        fontSize: '13px',
                        fontWeight: isActive ? 600 : 500,
                        backgroundColor: isActive ? 'var(--color-crimson)' : 'transparent',
                        color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = 'var(--badge-bg)';
                          e.currentTarget.style.color = 'var(--text-primary)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = 'var(--text-secondary)';
                        }
                      }}
                    >
                      {item.href ? <Link href={item.href}>                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                        <Icon style={{ width: 18, height: 18, flexShrink: 0 }} />
                        {!isCollapsed && (
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {item.label}
                          </span>
                        )}
                      </div>

                      {!isCollapsed && item.badge !== undefined && (
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '2px 7px',
                            borderRadius: '999px',
                            backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : 'var(--badge-bg)',
                            color: isActive ? '#FFFFFF' : 'var(--color-crimson)',
                            border: isActive ? 'none' : '1px solid var(--border-subtle)',
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
</Link> : <>                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                        <Icon style={{ width: 18, height: 18, flexShrink: 0 }} />
                        {!isCollapsed && (
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {item.label}
                          </span>
                        )}
                      </div>

                      {!isCollapsed && item.badge !== undefined && (
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '2px 7px',
                            borderRadius: '999px',
                            backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : 'var(--badge-bg)',
                            color: isActive ? '#FFFFFF' : 'var(--color-crimson)',
                            border: isActive ? 'none' : '1px solid var(--border-subtle)',
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
</>}
                    </Button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Footer: Switch App Link & Collapse Trigger */}
        <div
          style={{
            padding: '12px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          {switchAppLink && (
            <a
              href={switchAppLink.href}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: isCollapsed ? 'center' : 'space-between',
                padding: isCollapsed ? '10px 0' : '8px 12px',
                borderRadius: '8px',
                backgroundColor: 'var(--badge-bg)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                textDecoration: 'none',
                fontSize: '12px',
                fontWeight: 600,
              }}
              title={isCollapsed ? switchAppLink.label : undefined}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <switchAppLink.icon style={{ width: 16, height: 16, color: 'var(--color-crimson)' }} />
                {!isCollapsed && <span>{switchAppLink.label}</span>}
              </div>
              {!isCollapsed && <ExternalLink style={{ width: 12, height: 12, color: 'var(--text-muted)' }} />}
            </a>
          )}

          {onToggleCollapse && (
            <Button
              type="button"
              onClick={onToggleCollapse}
              variant="ghost"
              size="sm"
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-expanded={!isCollapsed}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                gap: '8px',
                padding: '8px 12px',
                borderRadius: '8px',
                border: 'none',
                background: 'transparent',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 500,
              }}
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isCollapsed ? <ChevronRight style={{ width: 16, height: 16 }} /> : <ChevronLeft style={{ width: 16, height: 16 }} />}
              {!isCollapsed && <span>Collapse Sidebar</span>}
            </Button>
          )}
        </div>
      </aside>
    </>
  );
}
