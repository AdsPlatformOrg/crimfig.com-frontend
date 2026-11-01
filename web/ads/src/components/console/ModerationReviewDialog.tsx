'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

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
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isSubmitting && onClose()}>
      <DialogContent className="sm:max-w-[540px] bg-background border border-border shadow-xl rounded-xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="space-y-1 pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-crimson)]">
                {stageLabel}
              </span>
              {isPlatformAdmin && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  Platform Admin
                </span>
              )}
            </div>
            <DialogTitle className="text-lg font-bold text-foreground">
              Review {targetLabel}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground truncate">
              {targetTitle}
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="py-4 space-y-4">
            {/* Decision selector */}
            <div>
              <label className="text-xs font-semibold text-foreground block mb-2">
                Moderation Decision
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDecision('approved')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border text-xs font-semibold transition-all ${
                    decision === 'approved'
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold shadow-sm'
                      : 'border-border bg-card text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => setDecision('rejected')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border text-xs font-semibold transition-all ${
                    decision === 'rejected'
                      ? 'bg-[var(--color-crimson)]/10 border-[var(--color-crimson)] text-[var(--color-crimson)] font-bold shadow-sm'
                      : 'border-border bg-card text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <XCircle className="w-4 h-4 text-[var(--color-crimson)]" />
                  Reject
                </button>
              </div>
            </div>

            {/* Rejection reason dropdown */}
            {decision === 'rejected' && (
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Rejection Reason Code
                </label>
                <select
                  value={reasonCode}
                  onChange={(e) => setReasonCode(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-[var(--color-crimson)]"
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
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-foreground">
                  Reason for Advertiser
                </label>
                <span className="text-[10px] text-muted-foreground">Optional</span>
              </div>
              <textarea
                value={advertiserNote}
                onChange={(e) => setAdvertiserNote(e.target.value)}
                placeholder="Message visible to advertiser explaining the decision or feedback..."
                rows={3}
                className="w-full text-xs p-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[var(--color-crimson)] resize-none"
              />
            </div>

            {/* Reason for Reviewer Only (Internal Note) */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-foreground">
                  Reason for Reviewer Only
                </label>
                <span className="text-[10px] text-muted-foreground">Internal audit only</span>
              </div>
              <textarea
                value={internalNote}
                onChange={(e) => setInternalNote(e.target.value)}
                placeholder="Internal audit notes visible only to staff reviewers and managers..."
                rows={2}
                className="w-full text-xs p-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[var(--color-crimson)] resize-none"
              />
            </div>
          </div>

          <DialogFooter className="pt-3 border-t border-border flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={onClose}
              className="text-xs h-9"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className={`text-xs h-9 font-semibold text-white ${
                decision === 'approved' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-[var(--color-crimson)] hover:bg-[var(--color-crimson-dark)]'
              }`}
            >
              {isSubmitting ? 'Submitting...' : `Confirm ${decision === 'approved' ? 'Approval' : 'Rejection'}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

