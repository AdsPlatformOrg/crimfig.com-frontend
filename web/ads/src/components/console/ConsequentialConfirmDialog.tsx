'use client';

import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from '../ui/button';
import { X, AlertTriangle } from 'lucide-react';

export interface ConsequentialConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: React.ReactNode;
  consequenceSummary?: React.ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  confirmVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  isPending?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
}

export function ConsequentialConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  consequenceSummary,
  confirmLabel,
  cancelLabel = 'Cancel',
  confirmVariant = 'default',
  isPending = false,
  onConfirm,
  onCancel,
}: ConsequentialConfirmDialogProps) {
  const handleCancel = () => {
    if (isPending) return;
    if (onCancel) onCancel();
    onOpenChange(false);
  };

  const handleConfirm = async () => {
    if (isPending) return;
    await onConfirm();
  };

  return (
    <Dialog.Root open={open} onOpenChange={(val) => { if (!val && !isPending) handleCancel(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="cf-report-overlay" style={{ zIndex: 1200 }} />
        <Dialog.Content
          className="cf-report-dialog"
          style={{
            zIndex: 1201,
            maxWidth: '480px',
            width: 'calc(100% - 32px)',
            borderRadius: '12px',
          }}
          onEscapeKeyDown={(e) => { if (isPending) e.preventDefault(); }}
          onPointerDownOutside={(e) => { if (isPending) e.preventDefault(); }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: confirmVariant === 'destructive' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                  color: confirmVariant === 'destructive' ? 'var(--color-crimson, #DC2626)' : '#D97706',
                  flexShrink: 0,
                }}
              >
                <AlertTriangle size={18} />
              </div>
              <Dialog.Title style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {title}
              </Dialog.Title>
            </div>
            <Dialog.Close asChild>
              <Button
                variant="ghost"
                size="icon"
                disabled={isPending}
                onClick={handleCancel}
                aria-label="Close"
                style={{ width: '32px', height: '32px' }}
              >
                <X size={16} />
              </Button>
            </Dialog.Close>
          </div>

          <Dialog.Description asChild>
            <div style={{ marginTop: '14px', fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {description}
            </div>
          </Dialog.Description>

          {consequenceSummary && (
            <div
              style={{
                marginTop: '16px',
                padding: '12px 14px',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-surface, rgba(0, 0, 0, 0.03))',
                border: '1px solid var(--border-subtle, rgba(0, 0, 0, 0.08))',
                fontSize: '0.8125rem',
                color: 'var(--text-primary)',
              }}
            >
              {consequenceSummary}
            </div>
          )}

          <div
            style={{
              marginTop: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '10px',
              flexWrap: 'wrap',
            }}
          >
            <Button
              variant="outline"
              disabled={isPending}
              onClick={handleCancel}
              style={{ minWidth: '80px' }}
            >
              {cancelLabel}
            </Button>
            <Button
              variant={confirmVariant}
              disabled={isPending}
              onClick={handleConfirm}
              style={{ minWidth: '100px' }}
            >
              {isPending ? 'Processing…' : confirmLabel}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

