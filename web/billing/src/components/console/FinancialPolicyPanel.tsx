'use client';

import React, { useEffect, useState } from 'react';
import { billingData } from '../../lib/billing-api';
import {
  beginWithdrawalChallenge,
  confirmWithdrawalChallenge,
  submitReviewAuthorization,
} from '../../lib/withdrawal-api';
import { useDialog } from '../../lib/use-dialog';
import { Card, CardContent, CardHeader, CardTitle, Button } from '../ui';
import { Input } from '../ui/input';
import { Alert, AlertDescription } from '../ui/alert';
import { ShieldCheck, UserCheck, X } from 'lucide-react';

import { PolicyView, financialPolicyFigures as figures, validateFinancialPolicy } from '../../lib/financial-policy';

export function FinancialPolicyPanel() {
  const [policy, setPolicy] = useState<PolicyView | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'unavailable' | 'hidden'>('loading');
  const [attempt, setAttempt] = useState(0);

  // Independent Reviewer State
  const [reviewRef, setReviewRef] = useState('');
  const [reviewChallengeId, setReviewChallengeId] = useState<string | null>(null);
  const [reviewTotpCode, setReviewTotpCode] = useState('');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewBusy, setReviewBusy] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [reviewSuccess, setReviewSuccess] = useState<string | null>(null);

  const reviewDialog = useDialog(isReviewModalOpen, () => {
    if (!reviewBusy) {
      setIsReviewModalOpen(false);
      setReviewTotpCode('');
      setReviewError(null);
    }
  });

  useEffect(() => {
    let active = true;
    setState('loading'); setPolicy(null);
    void (async () => {
      try {
        const staff = await billingData<{ roles: string[] }>('/api/v1/ecosystem/staff-status');
        if (!active) return;
        if (!staff.roles?.includes('super_admin')) { setState('hidden'); return; }
        const data = await billingData<PolicyView>('/api/v1/admin/security/policy');
        validateFinancialPolicy(data);
        if (active) { setPolicy(data); setState('ready'); }
      } catch { if (active) setState('unavailable'); }
    })();
    return () => { active = false; };
  }, [attempt]);

  const handleStartReview = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = reviewRef.trim();
    if (!/^wd_[a-f0-9]{40}$/.test(trimmed)) {
      setReviewError('Enter a valid 43-character withdrawal reference (starting with wd_).');
      return;
    }
    setReviewBusy(true);
    setReviewError(null);
    setReviewSuccess(null);
    try {
      const challenge = await beginWithdrawalChallenge(trimmed);
      setReviewChallengeId(challenge.challengeId);
      setReviewTotpCode('');
      setIsReviewModalOpen(true);
    } catch (err) {
      setReviewError(err instanceof Error ? err.message : 'Failed to initiate review challenge. Check withdrawal reference and staff status.');
    } finally {
      setReviewBusy(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewChallengeId || reviewBusy) return;
    if (!/^\d{6}$/.test(reviewTotpCode)) {
      setReviewError('Enter the 6-digit code from your authenticator app.');
      return;
    }
    setReviewBusy(true);
    setReviewError(null);
    try {
      const confirmed = await confirmWithdrawalChallenge(reviewChallengeId, reviewTotpCode);
      const res = await submitReviewAuthorization(reviewRef.trim(), confirmed.proof);
      setIsReviewModalOpen(false);
      setReviewSuccess(`Independent review confirmed and recorded for ${res.reference}. State: ${res.state}.`);
      setReviewRef('');
      setReviewTotpCode('');
    } catch (err) {
      setReviewError(err instanceof Error ? err.message : 'Review authorization rejected. Verify your step-up code.');
    } finally {
      setReviewBusy(false);
    }
  };

  if (state === 'hidden') return null;

  return (
    <Card style={{ marginBottom: 24 }}>
      <CardHeader>
        <CardTitle>Withdrawal security policy & independent reviewer authority</CardTitle>
      </CardHeader>
      <CardContent>
        {state === 'loading' && <p role="status">Loading your configured withdrawal policy…</p>}
        {state === 'unavailable' && (
          <div role="alert">
            <p>The policy could not be loaded. No figures are being assumed.</p>
            <Button variant="outline" onClick={() => setAttempt(a => a + 1)}>Try again</Button>
          </div>
        )}
        {state === 'ready' && policy && (
          <>
            <p>Independent withdrawal execution is not activated. These are the configured pilot limits, shown in US dollars.</p>
            <dl style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: 16 }}>
              {figures.map(([key, label]) => (
                <div key={key}>
                  <dt style={{ color: 'var(--text-secondary)' }}>{label}</dt>
                  <dd style={{ margin: '4px 0', fontWeight: 600 }}>
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(policy[key] / 100)}
                  </dd>
                </div>
              ))}
            </dl>
            <p>
              Urgent alerts: {policy.recipients.join(' and ')}. Submission target: {policy.alertSubmissionTargetMs / 1000} seconds. Acknowledgement target: {policy.acknowledgementTargetMs / 60000} minutes.
            </p>
            <p style={{ overflowWrap: 'anywhere' }}>Policy version: {policy.version}</p>
            <Button disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>Change limits</Button>
            <details style={{ marginTop: 12 }}>
              <summary style={{ cursor: 'pointer', minHeight: 44 }} aria-label="Why policy changes are unavailable">
                ? Why can’t I change these figures here?
              </summary>
              <p>Limits are reviewed in the versioned configuration file. Changes that loosen protections require independent approval. This page only displays the configuration; it cannot enable payouts.</p>
            </details>

            {/* Independent Reviewer Section */}
            <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <UserCheck size={20} color="var(--color-crimson)" />
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                  Independent Reviewer Action
                </h3>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '0 0 16px 0' }}>
                Eligible platform administrators can independently review held withdrawals. Self-approval of your own withdrawal is strictly prohibited by cryptographic policy.
              </p>

              {reviewError && !isReviewModalOpen && (
                <Alert variant="destructive" style={{ marginBottom: 16 }}>
                  <AlertDescription>{reviewError}</AlertDescription>
                </Alert>
              )}
              {reviewSuccess && (
                <Alert variant="default" style={{ marginBottom: 16, borderColor: 'var(--color-crimson)' }}>
                  <AlertDescription>{reviewSuccess}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleStartReview} style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                <div style={{ flex: '1 1 320px' }}>
                  <Input
                    placeholder="Withdrawal reference (wd_...)"
                    value={reviewRef}
                    disabled={reviewBusy}
                    onChange={e => setReviewRef(e.target.value.trim())}
                    style={{ fontFamily: 'monospace' }}
                  />
                </div>
                <Button type="submit" loading={reviewBusy} disabled={reviewBusy || !reviewRef.trim()}>
                  {reviewBusy ? 'Checking…' : 'Initiate Review'}
                </Button>
              </form>
            </div>
          </>
        )}

        {/* Reviewer Step-Up Modal */}
        {isReviewModalOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)' }}>
            <div ref={reviewDialog} role="dialog" aria-modal="true" aria-label="Confirm Independent Review Authorization" tabIndex={-1} className="theme-card" style={{ width: '100%', maxWidth: '440px', padding: '28px', backgroundColor: 'var(--bg-page)', borderRadius: '16px', position: 'relative', boxSizing: 'border-box', boxShadow: 'var(--shadow-lg)' }}>
              <Button
                type="button"
                variant="ghost"
                disabled={reviewBusy}
                onClick={() => setIsReviewModalOpen(false)}
                style={{ position: 'absolute', top: '16px', right: '16px', padding: '6px', minWidth: 'auto', height: 'auto', color: 'var(--text-secondary)' }}
                aria-label="Close review dialog"
              >
                <X size={18} />
              </Button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(212, 20, 58, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-crimson)' }}>
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                    Staff Step-Up Approval
                  </h2>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                    Dual-control independent reviewer verification
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmitReview} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {reviewError && (
                  <Alert variant="destructive">
                    <AlertDescription>{reviewError}</AlertDescription>
                  </Alert>
                )}

                <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Target Reference:</span>
                  <div style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: '12px', marginTop: '4px', overflowWrap: 'anywhere' }}>
                    {reviewRef}
                  </div>
                </div>

                <div>
                  <label htmlFor="review-totp-code" style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>
                    Admin Authenticator 6-Digit Code
                  </label>
                  <Input
                    id="review-totp-code"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    pattern="[0-9]*"
                    maxLength={6}
                    value={reviewTotpCode}
                    placeholder="123456"
                    disabled={reviewBusy}
                    onChange={e => {
                      const cleaned = e.target.value.replace(/\D/g, '').slice(0, 6);
                      setReviewTotpCode(cleaned);
                      if (reviewError) setReviewError(null);
                    }}
                    style={{ textAlign: 'center', fontSize: '20px', letterSpacing: '4px', fontWeight: 700 }}
                    autoFocus
                  />
                  <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Provide your fresh authenticator code to issue a non-repudiable reviewer signature.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={reviewBusy}
                    onClick={() => setIsReviewModalOpen(false)}
                    style={{ flex: 1 }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    loading={reviewBusy}
                    disabled={reviewBusy || reviewTotpCode.length !== 6}
                    style={{ flex: 1 }}
                  >
                    {reviewBusy ? 'Signing…' : 'Submit Approval'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}