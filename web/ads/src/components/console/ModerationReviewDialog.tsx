'use client';

import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, AlertCircle, X } from 'lucide-react';

export interface ModerationReviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: 'campaign' | 'stack' | 'creative';
  targetTitle: string;
  stage: 'reviewer' | 'manager';
  isPlatformAdmin?: boolean;
  onSubmit: (data: {
    decision: 'approved' | 'rejected';
    advertiserNote?: string;
    internalNote?: string;
    reasonCode?: string;
  }) => Promise<void>;
}

export function ModerationReviewDialog({
  isOpen,
  onClose,
  targetType,
  targetTitle,
  stage,
  isPlatformAdmin = false,
  onSubmit,
}: ModerationReviewDialogProps) {
  const [decision, setDecision] = useState<'approved' | 'rejected'>('approved');
  const [advertiserNote, setAdvertiserNote] = useState('');
  const [internalNote, setInternalNote] = useState('');
  const [reasonCode, setReasonCode] = useState('POLICY_VIOLATION');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stageLabel = stage === 'reviewer' ? 'Review 1 (Primary Review)' : 'Review 2 (Manager Approval)';
  const targetLabel = targetType === 'campaign' ? 'Campaign' : targetType === 'stack' ? 'Ad Stack' : 'Creative Asset';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit({
        decision,
        advertiserNote: advertiserNote.trim() || undefined,
        internalNote: internalNote.trim() || undefined,
        reasonCode: decision === 'rejected' ? reasonCode : undefined,
      });
      // Reset form
      setAdvertiserNote('');
      setInternalNote('');
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to submit review decision.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && !isSubmitting && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="cf-report-overlay" style={{ zIndex: 1200 }} />
        <Dialog.Content
          className="cf-report-dialog"
          style={{
            zIndex: 1201,
            maxWidth: '540px',
            padding: '24px',
            backgroundColor: 'var(--bg-elevated)',
            borderRadius: '16px',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-xl)',
          }}
        >
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-crimson)', letterSpacing: '0.05em' }}>
                    {stageLabel}
                  </span>
                  {isPlatformAdmin && (
                    <span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 6px', borderRadius: '9999px', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                      Platform Admin
                    </span>
                  )}
                </div>
                <Dialog.Title style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px', margin: 0 }}>
                  Review {targetLabel}
                </Dialog.Title>
                <Dialog.Description style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px', margin: 0 }}>
                  {targetTitle}
                </Dialog.Description>
              </div>

              <Dialog.Close asChild>
                <button
                  type="button"
                  aria-label="Close dialog"
                  style={{
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                    padding: '4px',
                  }}
                >
                  <X style={{ width: 18, height: 18 }} />
                </button>
              </Dialog.Close>
            </div>

            {error && (
              <div style={{ padding: '10px 12px', borderRadius: '8px', backgroundColor: 'rgba(220, 38, 38, 0.1)', border: '1px solid rgba(220, 38, 38, 0.2)', color: 'var(--color-crimson)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle style={{ width: 16, height: 16, flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            {/* Decision selector */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '8px' }}>
                Moderation Decision
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setDecision('approved')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    border: decision === 'approved' ? '2px solid #10B981' : '1px solid var(--border-subtle)',
                    backgroundColor: decision === 'approved' ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-surface)',
                    color: decision === 'approved' ? '#059669' : 'var(--text-secondary)',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  <CheckCircle2 style={{ width: 16, height: 16, color: '#10B981' }} />
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => setDecision('rejected')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    border: decision === 'rejected' ? '2px solid var(--color-crimson)' : '1px solid var(--border-subtle)',
                    backgroundColor: decision === 'rejected' ? 'rgba(212, 20, 58, 0.1)' : 'var(--bg-surface)',
                    color: decision === 'rejected' ? 'var(--color-crimson)' : 'var(--text-secondary)',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  <XCircle style={{ width: 16, height: 16, color: 'var(--color-crimson)' }} />
                  Reject
                </button>
              </div>
            </div>

            {/* Rejection reason dropdown */}
            {decision === 'rejected' && (
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
                  Rejection Reason Code
                </label>
                <select
                  value={reasonCode}
                  onChange={(e) => setReasonCode(e.target.value)}
                  style={{
                    width: '100%',
                    fontSize: '12px',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-page)',
                    color: 'var(--text-primary)',
                  }}
                >
                  <option value="POLICY_VIOLATION">General Policy Violation</option>
                  <option value="MISLEADING">Misleading / Clickbait Claims</option>
                  <option value="PROHIBITED">Prohibited Financial / Gambling Products</option>
                  <option value="BROKEN_URL">Destination URL Unreachable (404/500)</option>
                  <option value="LOW_QUALITY">Low Resolution / Distorted Media</option>
                  <option value="TRADEMARK">Unverified Trademark / Impersonation</option>
                  <option value="BUDGET_OR_TARGETING_ISSUE">Budget or Targeting Parameter Inconsistency</option>
                </select>
              </div>
            )}

            {/* Reason for Advertiser (Optional) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Reason for Advertiser
                </label>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Optional</span>
              </div>
              <textarea
                value={advertiserNote}
                onChange={(e) => setAdvertiserNote(e.target.value)}
                placeholder="Message visible to advertiser explaining the decision or feedback..."
                rows={3}
                style={{
                  width: '100%',
                  fontSize: '12px',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-page)',
                  color: 'var(--text-primary)',
                  resize: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Reason for Reviewer Only (Internal Note) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Reason for Reviewer Only
                </label>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Internal audit only</span>
              </div>
              <textarea
                value={internalNote}
                onChange={(e) => setInternalNote(e.target.value)}
                placeholder="Internal audit notes visible only to staff reviewers and managers..."
                rows={2}
                style={{
                  width: '100%',
                  fontSize: '12px',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-page)',
                  color: 'var(--text-primary)',
                  resize: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={onClose}
                style={{ fontSize: '12px', padding: '8px 16px' }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                style={{
                  fontSize: '12px',
                  padding: '8px 16px',
                  backgroundColor: decision === 'approved' ? '#059669' : 'var(--color-crimson)',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {isSubmitting ? 'Submitting...' : `Confirm ${decision === 'approved' ? 'Approval' : 'Rejection'}`}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
