'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { validTheme } from '../lib/theme';
import { Button } from './ui/button';

export interface ThemeSwitcherProps {
  showLabel?: boolean;
  labelPrefix?: string;
}

export function ThemeSwitcher({ showLabel = false, labelPrefix = 'Theme:' }: ThemeSwitcherProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    let saved: 'light' | 'dark' = 'light';
    try { const value = localStorage.getItem('crimfig-theme'); if (validTheme(value)) saved = value; } catch { /* Storage can be unavailable. */ }
    setTheme(saved);
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  const toggleTheme = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    try { localStorage.setItem('crimfig-theme', newTheme); } catch { /* Keep the current page usable. */ }
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
      {showLabel && (
        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
          {labelPrefix}
        </span>
      )}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          padding: '3px',
          borderRadius: '9999px',
          backgroundColor: 'var(--badge-bg)',
          border: '1px solid var(--border-subtle)',
          fontSize: '12px',
          fontWeight: 500,
        }}
      >
        <Button
          type="button"
          onClick={() => toggleTheme('light')}
          variant="ghost"
          size="sm"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: '9999px',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            backgroundColor: theme === 'light' ? 'var(--bg-page)' : 'transparent',
            color: theme === 'light' ? 'var(--text-primary)' : 'var(--text-muted)',
            boxShadow: theme === 'light' ? 'var(--shadow-sm)' : 'none',
          }}
          aria-label="Switch to Light Theme"
          aria-pressed={theme === 'light'}
        >
          <Sun style={{ width: 14, height: 14, color: '#F59E0B' }} />
          <span>Light</span>
        </Button>

        <Button
          type="button"
          onClick={() => toggleTheme('dark')}
          variant="ghost"
          size="sm"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: '9999px',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            backgroundColor: theme === 'dark' ? 'var(--color-fig-dark)' : 'transparent',
            color: theme === 'dark' ? '#FFFFFF' : 'var(--text-muted)',
            boxShadow: theme === 'dark' ? 'var(--shadow-sm)' : 'none',
          }}
          aria-label="Switch to Dark Theme"
          aria-pressed={theme === 'dark'}
        >
          <Moon style={{ width: 14, height: 14, color: '#818CF8' }} />
          <span>Dark</span>
        </Button>
      </div>
    </div>
  );
}
