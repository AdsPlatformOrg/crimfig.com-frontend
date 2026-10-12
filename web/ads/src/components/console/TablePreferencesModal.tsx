'use client';

import React, { useState } from 'react';
import { X, Check, SlidersHorizontal } from 'lucide-react';

export interface ColumnConfig {
  key: string;
  label: string;
  visible: boolean;
  order: number;
}

interface TablePreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  columns: ColumnConfig[];
  onSave: (updated: ColumnConfig[]) => void;
}

export function TablePreferencesModal({ isOpen, onClose, columns, onSave }: TablePreferencesModalProps) {
  const [localColumns, setLocalColumns] = useState<ColumnConfig[]>(columns);

  if (!isOpen) return null;

  const toggleVisibility = (key: string) => {
    setLocalColumns((prev) =>
      prev.map((col) => (col.key === key ? { ...col, visible: !col.visible } : col)),
    );
  };

  const handleSave = () => {
    onSave(localColumns);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(4px)',
        zIndex: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          borderRadius: '16px',
          backgroundColor: 'var(--bg-elevated)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-xl)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <SlidersHorizontal style={{ width: 18, height: 18, color: 'var(--color-crimson)' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Customize Table Columns
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              display: 'flex',
              padding: '4px',
            }}
          >
            <X style={{ width: 18, height: 18 }} />
          </button>
        </div>

        {/* Column Checkboxes */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 8px' }}>
            Choose which performance metrics are displayed in your campaign management table:
          </p>

          {localColumns.map((col) => (
            <label
              key={col.key}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: '8px',
                backgroundColor: col.visible ? 'var(--badge-bg)' : 'transparent',
                border: '1px solid var(--border-subtle)',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease',
              }}
            >
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                {col.label}
              </span>
              <input
                type="checkbox"
                checked={col.visible}
                onChange={() => toggleVisibility(col.key)}
                style={{ accentColor: 'var(--color-crimson)', width: '16px', height: '16px', cursor: 'pointer' }}
              />
            </label>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-surface)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-page)',
              color: 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: 'var(--color-crimson)',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: 'var(--shadow-crimson)',
            }}
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
