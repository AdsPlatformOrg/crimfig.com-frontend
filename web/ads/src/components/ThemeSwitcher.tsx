'use client';

import { useEffect, useState } from 'react';
import { validTheme, type Theme } from '../lib/theme';
import { Sun, Moon } from 'lucide-react';

export interface ThemeSwitcherProps {
  showLabel?: boolean;
  labelPrefix?: string;
}

export function ThemeSwitcher({ showLabel = false, labelPrefix = 'Theme:' }: ThemeSwitcherProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const sync = () => { const value = document.documentElement.getAttribute('data-theme'); setTheme(validTheme(value) ? value : 'light'); };
    const stored = (event: StorageEvent) => {
      if (event.key !== 'crimfig-theme' && event.key !== null) return;
      document.documentElement.setAttribute('data-theme', validTheme(event.newValue) ? event.newValue : 'light'); sync();
    };
    sync();
    window.addEventListener('crimfig-theme-change', sync);
    window.addEventListener('storage', stored);
    return () => { window.removeEventListener('crimfig-theme-change', sync); window.removeEventListener('storage', stored); };
  }, []);

  const toggleTheme = (newTheme: Theme) => {
    try { localStorage.setItem('crimfig-theme', newTheme); } catch { /* In-document preference still works. */ }
    document.documentElement.setAttribute('data-theme', newTheme);
    setTheme(newTheme);
    window.dispatchEvent(new Event('crimfig-theme-change'));
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
      <button
        type="button"
        onClick={() => toggleTheme('light')}
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
      </button>

      <button
        type="button"
        onClick={() => toggleTheme('dark')}
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
      </button>
      </div>
    </div>
  );
}
