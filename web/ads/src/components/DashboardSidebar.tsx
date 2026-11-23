'use client';

import { useId, useState, type ComponentType, type CSSProperties } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from './ui/button';
import { DialogClose } from './ui/dialog';
import styles from './DashboardSidebar.module.css';

export interface NavItem {
  id: string;
  label: string;
  icon: ComponentType<{ style?: CSSProperties; className?: string }>;
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

interface DashboardSidebarProps {
  groups: NavGroup[];
  activeId: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onNavigate?: () => void;
  mobile?: boolean;
}

export function DashboardSidebar({
  groups, activeId, isCollapsed = false, onToggleCollapse, onNavigate, mobile = false,
}: DashboardSidebarProps) {
  const id = useId();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  function renderItem(item: NavItem) {
    const active = activeId === item.id;
    const content = (
      <>
        <item.icon className={styles.icon} aria-hidden="true" />
        {!isCollapsed && <span>{item.label}</span>}
        {!isCollapsed && item.badge !== undefined && <span className={styles.badge}>{item.badge}</span>}
      </>
    );
    const props = {
      className: styles.item,
      'aria-current': active ? 'page' as const : undefined,
      'aria-label': isCollapsed ? item.label : undefined,
      title: isCollapsed ? item.label : undefined,
      onClick: () => { item.action?.(); onNavigate?.(); },
    };
    if (item.href) {
      if (/^https?:\/\//.test(item.href)) {
        return <Button key={item.id} asChild variant="ghost" {...props}><a href={item.href}>{content}</a></Button>;
      }
      return <Button key={item.id} asChild variant="ghost" {...props}><Link href={item.href}>{content}</Link></Button>;
    }
    return <Button key={item.id} type="button" variant="ghost" {...props}>{content}</Button>;
  }

  return (
    <aside className={styles.sidebar} data-collapsed={isCollapsed}>
      {mobile && (
        <DialogClose asChild>
          <Button type="button" size="icon" variant="ghost" className={styles.close} aria-label="Close navigation menu">
            <X size={20} aria-hidden="true" />
          </Button>
        </DialogClose>
      )}
      <nav id={id} aria-label="Ads workspace navigation" className={styles.navigation}>
        {groups.map((group) => (
          <div key={group.items[0]?.id ?? group.title} className={styles.group}>
            {!isCollapsed && group.title && <span className={styles.heading}>{group.title}</span>}
            {group.items.map((item) => {
              if (!item.children) return renderItem(item);
              const childrenId = `${id}-${item.id}`;
              const containsActive = item.children.some((child) => child.id === activeId);
              const open = !isCollapsed && (expanded[item.id] ?? containsActive);
              return (
                <div key={item.id} className={styles.group}>
                  <Button
                    type="button" variant="ghost" className={styles.item}
                    aria-expanded={open} aria-controls={childrenId}
                    aria-label={isCollapsed ? item.label : undefined}
                    title={isCollapsed ? item.label : undefined}
                    onClick={() => {
                      if (isCollapsed) onToggleCollapse?.();
                      setExpanded((previous) => ({ ...previous, [item.id]: !open }));
                    }}
                  >
                    <item.icon className={styles.icon} aria-hidden="true" />
                    {!isCollapsed && <span>{item.label}</span>}
                  </Button>
                  <div id={childrenId} hidden={!open} className={styles.children}>
                    {open && item.children.map(renderItem)}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </nav>
      {onToggleCollapse && (
        <div className={styles.footer}>
          <Button
            type="button" size="icon" variant="ghost" onClick={onToggleCollapse}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!isCollapsed} aria-controls={id}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight size={16} aria-hidden="true" /> : <ChevronLeft size={16} aria-hidden="true" />}
          </Button>
        </div>
      )}
    </aside>
  );
}
