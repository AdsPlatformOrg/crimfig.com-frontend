'use client';

import React, { useRef, useState, useId } from 'react';
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
  locked?: boolean;
  reasons?: {code:string;label:string}[];
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
  locked = false,
  reasons = [],
  onSubmit,
}: ModerationReviewDialogProps) {
  const inFlight = useRef(false);
  const id = useId();
  const safeClose = () => { if (!inFlight.current && !locked) onClose(); };
  const [decision, setDecision] = useState<'approved' | 'rejected'>('approved');
  const [advertiserNote, setAdvertiserNote] = useState('');
  const [internalNote, setInternalNote] = useState('');
  const [reasonCode, setReasonCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stageLabel = stage === 'reviewer' ? 'Review 1 (Primary Review)' : 'Review 2 (Manager Approval)';
  const targetLabel = targetType === 'campaign' ? 'Campaign' : targetType === 'stack' ? 'Ad Stack' : 'Creative Asset';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(inFlight.current || locked) return;
    if(advertiserNote.trim().length>2000 || internalNote.trim().length>2000){setError('Notes must be at most 2,000 characters.');return;}
    if(decision==='rejected' && !reasonCode && !advertiserNote.trim()){setError('Choose a rejection reason or provide a custom advertiser explanation.');return;}
    if(reasonCode && !reasons.some(reason=>reason.code===reasonCode)){setError('Rejection options changed. Reload the item details.');return;}
    inFlight.current=true;
    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit({
        decision,
        advertiserNote: advertiserNote.trim() || undefined,
        internalNote: internalNote.trim() || undefined,
        reasonCode: decision === 'rejected' ? reasonCode || undefined : undefined,
      });
      // Reset form
      setAdvertiserNote('');
      setInternalNote('');
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to submit review decision.');
    } finally {
      inFlight.current=false;
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && safeClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="cf-report-overlay" style={{ zIndex: 1200 }} />
        <Dialog.Content
          className="cf-report-dialog cf-mod-review"
          style={{
            zIndex: 1201,
            maxHeight: '90dvh',
            overflowY: 'auto',
            width: 'calc(100vw - 32px)',
            maxWidth: '540px',
            padding: '24px',
            backgroundColor: 'var(--bg-elevated)',
            borderRadius: '16px',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-xl)',
          }}
        >
          <form aria-busy={isSubmitting} onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-crimson)', letterSpacing: '0.05em' }}>
                    {stageLabel}
                  </span>
                  {isPlatformAdmin && (
                    <span style={{ fontSize: '14px', fontWeight: 600, padding: '2px 6px', borderRadius: '9999px', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                      Platform Admin
                    </span>
                  )}
                </div>
                <Dialog.Title style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px', margin: 0 }}>
                  Review {targetLabel}
                </Dialog.Title>
                <Dialog.Description style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '2px', margin: 0 }}>
                  {targetTitle}
                </Dialog.Description>
              </div>

              <Dialog.Close asChild>
                <button
                  type="button"
                  disabled={isSubmitting || locked}
                  onClick={safeClose}
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
              <div style={{ padding: '10px 12px', borderRadius: '8px', backgroundColor: 'rgba(220, 38, 38, 0.1)', border: '1px solid rgba(220, 38, 38, 0.2)', color: 'var(--color-crimson)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle style={{ width: 16, height: 16, flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            {/* Decision selector */}
            <div>
              <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '8px' }}>
                Moderation Decision
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button
                  type="button"
                  disabled={isSubmitting || locked}
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
                    fontSize: '14px',
                    cursor: 'pointer',
                  }}
                >
                  <CheckCircle2 style={{ width: 16, height: 16, color: '#10B981' }} />
                  Approve
                </button>
                <button
                  type="button"
                  disabled={isSubmitting || locked}
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
                    fontSize: '14px',
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
                <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
                  Rejection reason
                </label>
                <select
                  id={`${id}-reason`}
                  aria-label="Rejection reason code"
                  disabled={isSubmitting || locked}
                  value={reasonCode}
                  onChange={(e) => setReasonCode(e.target.value)}
                  style={{
                    width: '100%',
                    fontSize: '14px',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-page)',
                    color: 'var(--text-primary)',
                  }}
                >
                  <option value="">Choose a reason, or write a custom explanation below</option>
                  {reasons.map(reason=><option key={reason.code} value={reason.code}>{reason.label}</option>)}
                </select>
              </div>
            )}

            {/* Reason for Advertiser (Optional) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Reason for Advertiser
                </label>
                <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Optional</span>
              </div>
              <textarea
                id={`${id}-advertiser`}
                aria-label="Reason for Advertiser"
                maxLength={2000}
                disabled={isSubmitting || locked}
                value={advertiserNote}
                onChange={(e) => setAdvertiserNote(e.target.value)}
                placeholder="Message visible to advertiser explaining the decision or feedback..."
                rows={3}
                style={{
                  width: '100%',
                  fontSize: '14px',
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
                <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Reason for Reviewer Only
                </label>
                <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Internal audit only</span>
              </div>
              <textarea
                id={`${id}-internal`}
                aria-label="Internal reviewer note"
                maxLength={2000}
                disabled={isSubmitting || locked}
                value={internalNote}
                onChange={(e) => setInternalNote(e.target.value)}
                placeholder="Internal audit notes visible only to staff reviewers and managers..."
                rows={2}
                style={{
                  width: '100%',
                  fontSize: '14px',
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
                disabled={isSubmitting || locked}
                onClick={safeClose}
                style={{ fontSize: '14px', padding: '8px 16px' }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || locked}
                style={{
                  fontSize: '14px',
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
