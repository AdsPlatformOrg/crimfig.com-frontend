'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const saved = (localStorage.getItem('crimfig-theme') as 'light' | 'dark') || 'light';
    setTheme(saved);
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  const toggleTheme = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    localStorage.setItem('crimfig-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
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
      >
        <Moon style={{ width: 14, height: 14, color: '#818CF8' }} />
        <span>Dark</span>
      </button>
    </div>
  );
}
