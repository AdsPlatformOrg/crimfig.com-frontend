'use client';

import React from 'react';
import Link from 'next/link';
import { 
  BarChart3, 
  Layers, 
  ShieldAlert, 
  CreditCard, 
  Users, 
  HelpCircle, 
  Filter, 
  Download, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { ModernTemplateHeader, HeaderProps } from './ModernTemplateHeader';
import './template-layout.css';

export interface AdminConsoleTemplateProps {
  headerProps?: HeaderProps;
  title: string;
  subtitle?: string;
  badge?: {
    label: string;
    type?: 'success' | 'warning' | 'info';
  };
  actions?: React.ReactNode;
  kpis?: {
    label: string;
    value: string | number;
    change?: string;
    positive?: boolean;
  }[];
  children: React.ReactNode;
  inspectorRail?: React.ReactNode;
}

export const AdminConsoleTemplate: React.FC<AdminConsoleTemplateProps> = ({
  headerProps,
  title,
  subtitle,
  badge,
  actions,
  kpis = [],
  children,
  inspectorRail,
}) => {
  return (
    <div className="cf-template-root">
      <ModernTemplateHeader {...headerProps} appName="Admin Console" />

      <div className="cf-template-body">
        {/* Console Breadcrumb / Title Bar */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '24px',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {title}
              </h1>
              {badge && (
                <span style={{
                  fontSize: '0.75rem',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  fontWeight: 600,
                  backgroundColor: badge.type === 'warning' ? 'var(--color-warning-bg)' : 'var(--badge-bg)',
                  color: badge.type === 'warning' ? 'var(--color-warning)' : 'var(--color-crimson)',
                }}>
                  {badge.label}
                </span>
              )}
            </div>
            {subtitle && (
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                {subtitle}
              </p>
            )}
          </div>

          {actions && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {actions}
            </div>
          )}
        </div>

        {/* KPI Strip */}
        {kpis.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '24px',
          }}>
            {kpis.map((kpi, idx) => (
              <div
                key={idx}
                style={{
                  padding: '16px 20px',
                  backgroundColor: 'var(--bg-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  {kpi.label}
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
                  {kpi.value}
                </div>
                {kpi.change && (
                  <div style={{
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    color: kpi.positive ? 'var(--color-success)' : 'var(--color-error)',
                    marginTop: '4px',
                  }}>
                    {kpi.change}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Main Grid with Optional Side Inspector Rail */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: inspectorRail ? '1fr 340px' : '1fr',
          gap: '24px',
          alignItems: 'start',
        }}>
          <main style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {children}
          </main>

          {inspectorRail && (
            <aside style={{
              backgroundColor: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px',
              boxShadow: 'var(--shadow-sm)',
              position: 'sticky',
              top: '88px',
            }}>
              {inspectorRail}
            </aside>
          )}
        </div>
      </div>
    </div>
  );
};
