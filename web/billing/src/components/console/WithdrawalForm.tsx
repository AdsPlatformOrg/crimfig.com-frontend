'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  cancelUndispatchedWithdrawal,
  confirmWithdrawal,
  quoteWithdrawal,
  recoverWithdrawal,
  withdrawalRequest,
  withdrawalAvailability,
  prepareWithdrawalAuthorization,
  beginWithdrawalChallenge,
  confirmWithdrawalChallenge,
  type WithdrawalQuote,
  type WithdrawalStatus,
} from '../../lib/withdrawal-api';
import { useDialog } from '../../lib/use-dialog';
import { Alert, AlertDescription } from '../ui/alert';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { ShieldCheck, X } from 'lucide-react';

interface Bank { id: string; bankName: string; accountNumber: string; accountName: string }
const ngn = (kobo: number) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(kobo / 100);

export function WithdrawalForm({ banks, availableUsd, onRefresh }: { banks: Bank[]; availableUsd: number | null; onRefresh: () => Promise<void> }) {
  const [amount, setAmount] = useState('25'), [bankId, setBankId] = useState('');
  const [quote, setQuote] = useState<WithdrawalQuote | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [result, setResult] = useState<WithdrawalStatus | null>(null);
  const [error, setError] = useState<string | null>(null), [busy, setBusy] = useState(false);
  const [invalidRecovery, setInvalidRecovery] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);

  // Step-Up TOTP Two-Factor Authorization State
  const [isStepUpOpen, setIsStepUpOpen] = useState(false);
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [totpCode, setTotpCode] = useState('');
  const [stepUpError, setStepUpError] = useState<string | null>(null);
  const [stepUpBusy, setStepUpBusy] = useState(false);

  const stepUpDialog = useDialog(isStepUpOpen, () => {
    if (!stepUpBusy) {
      setIsStepUpOpen(false);
      setTotpCode('');
      setStepUpError(null);
    }
  });

  const flight = useRef(false), mounted = useRef(false);
  useEffect(() => { if (!bankId && banks.length) setBankId(banks[0].id); }, [banks, bankId]);
  useEffect(() => {
    mounted.current = true;
    let active = true;
    void withdrawalAvailability().then(data => { if (active) setAvailable(data.available); }).catch(() => { if (active) setAvailable(false); });
    try { setRequestId(withdrawalRequest(window.location.search)); }
    catch (e) { setInvalidRecovery(true); setError((e as Error).message); }
    return () => { mounted.current = false; active = false; };
  }, []);
  const run = async (action: () => Promise<void>) => {
    if (flight.current) return;
    flight.current = true; setBusy(true); setError(null);
    try { await action(); }
    catch (e) { if (mounted.current) setError(e instanceof Error ? e.message : 'Withdrawal could not be confirmed. Check its status before retrying.'); }
    finally { flight.current = false; if (mounted.current) setBusy(false); }
  };
  const review = () => run(async () => {
    if (available !== true) throw new Error('New withdrawals are temporarily unavailable while security checks are prepared.');
    const value = Number(amount);
    if (!bankId || !Number.isFinite(value) || value < 5 || !/^\d+(\.\d{1,2})?$/.test(amount) || availableUsd === null || value > availableUsd) throw new Error('Choose a bank and an available amount of at least $5, with at most two decimal places.');
    const next = await quoteWithdrawal({ requestId: window.crypto.randomUUID(), bankAccountId: bankId, amountUsd: value });
    if (mounted.current) setQuote(next);
  });
  const confirm = () => run(async () => {
    if (available !== true) throw new Error('New withdrawals are temporarily unavailable. No new payout has been requested.');
    if (!quote || requestId) return;
    if (Date.parse(quote.expiresAt) <= Date.now()) { setQuote(null); throw new Error('Quote expired. Review a new quote before confirming.'); }
    
    // Step 1: Prepare authorization intent
    const prep = await prepareWithdrawalAuthorization(quote);
    
    // Step 2: Begin financial challenge
    const challenge = await beginWithdrawalChallenge(prep.reference);
    
    // Step 3: Open step-up confirmation modal
    if (mounted.current) {
      setChallengeId(challenge.challengeId);
      setTotpCode('');
      setStepUpError(null);
      setIsStepUpOpen(true);
    }
  });

  const handleStepUpSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!quote || !challengeId || stepUpBusy) return;
    if (!/^\d{6}$/.test(totpCode)) {
      setStepUpError('Enter the 6-digit code from your authenticator app.');
      return;
    }
    setStepUpBusy(true);
    setStepUpError(null);
    try {
      // Step 4: Confirm challenge to obtain signed owner FinancialProof
      const confirmed = await confirmWithdrawalChallenge(challengeId, totpCode);
      
      // Persist identity before the money-changing request
      const url = new URL(window.location.href);
      url.searchParams.set('withdrawal_request', quote.requestId);
      url.searchParams.set('view', 'console');
      window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
      setRequestId(quote.requestId);
      
      // Step 5: Submit withdrawal with verified ownerProof
      const next = await confirmWithdrawal(quote, confirmed.proof);
      if (mounted.current) {
        setIsStepUpOpen(false);
        setResult(next);
        await onRefresh();
      }
    } catch (err) {
      if (mounted.current) {
        setStepUpError(err instanceof Error ? err.message : 'Step-up verification failed. Check the code and try again.');
      }
    } finally {
      if (mounted.current) {
        setStepUpBusy(false);
      }
    }
  };

  const recover = () => run(async () => {
    if (!requestId) return;
    const next = await recoverWithdrawal(requestId);
    if (mounted.current) { setResult(next); await onRefresh(); }
  });
  const terminal = result && ['completed', 'failed', 'reversed', 'cancelled'].includes(result.status);
  const cancel = () => run(async () => {
    if (!result || result.confirmation !== 'not_dispatched' || result.status !== 'pending') return;
    const next = await cancelUndispatchedWithdrawal(result.reference);
    if (mounted.current) { setResult(next); await onRefresh(); }
  });
  return <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
    {requestId || invalidRecovery ? <>
      <Alert variant="info">
        <AlertDescription>{result ? `Withdrawal status: ${result.status}.` : 'A withdrawal request needs a status check. No new payout will be sent by checking.'}</AlertDescription>
      </Alert>
      {result?.refund && <p>Returned to your wallet: <strong>${(result.refund.refundUsdCents / 100).toFixed(2)}</strong>. Confirmed non-refundable charges: ${(result.refund.retainedUsdCents / 100).toFixed(2)} ({ngn(result.refund.retainedKobo)} at your original exchange rate).</p>}
      {result?.confirmation === 'operator_approval_required' && <p>Provider approval is required. Your funds remain reserved.</p>}
      {result?.confirmation === 'unconfirmed' && <p>Provider confirmation is unavailable. Your request is retained for reconciliation.</p>}
      {result?.confirmation === 'security_hold' && <p>This withdrawal is held for an independent security review. Your funds remain reserved. Checking status will not send another transfer.</p>}
      {result?.confirmation === 'not_dispatched' && result.status === 'pending' && <>
        <p>Your funds are reserved, but the transfer has not been sent. You can cancel this reservation and release funds.</p>
        <Button type="button" variant="outline" disabled={busy} onClick={cancel}>Cancel unsent withdrawal and release funds</Button>
      </>}
      {requestId && <p style={{ overflowWrap: 'anywhere', fontSize: 12 }}>Request: {requestId}</p>}
      <Button type="button" disabled={busy || invalidRecovery} loading={busy} onClick={recover}>{busy ? 'Checking…' : 'Check withdrawal status'}</Button>
      {terminal && <Button type="button" variant="outline" disabled={busy} onClick={() => {
        const url = new URL(window.location.href); url.searchParams.delete('withdrawal_request');
        window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
        setRequestId(null); setResult(null); setQuote(null); setError(null);
      }}>Start another withdrawal</Button>}
    </> : <>
      <label htmlFor="billing-withdraw-amount">Withdrawal amount (USD)</label>
      <Input id="billing-withdraw-amount" type="number" step="0.01" min="5" value={amount} disabled={busy} onChange={e => { setAmount(e.target.value); setQuote(null); }} />
      <p style={{ fontSize: 12 }}>Available: {availableUsd === null ? 'Unavailable' : `$${availableUsd.toFixed(2)}`}</p>
      <label htmlFor="billing-withdraw-bank">Destination bank account</label>
      <select id="billing-withdraw-bank" className="cf-input" value={bankId} disabled={busy} onChange={e => { setBankId(e.target.value); setQuote(null); }}>
        <option value="">Select a bank account</option>
        {banks.map(bank => <option key={bank.id} value={bank.id}>{bank.bankName} — {bank.accountNumber} ({bank.accountName})</option>)}
      </select>
      {!banks.length && <p>Connect a bank account in the Bank Accounts tab first.</p>}
      {quote && <Card role="region" aria-label="Payout quote" variant="outline" style={{ padding: 16 }}>
        <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 8 }}>
          <dt>Wallet debit</dt><dd style={{ margin: 0, textAlign: 'right', overflowWrap: 'anywhere' }}>${(quote.amountUsdCents / 100).toFixed(2)}</dd>
          <dt>USD/NGN rate</dt><dd style={{ margin: 0, textAlign: 'right', overflowWrap: 'anywhere' }}>{quote.rate.toLocaleString()}</dd>
          <dt>Gross payout</dt><dd style={{ margin: 0, textAlign: 'right', overflowWrap: 'anywhere' }}>{ngn(quote.grossKobo)}</dd>
          <dt>Transfer fee</dt><dd style={{ margin: 0, textAlign: 'right', overflowWrap: 'anywhere' }}>{ngn(quote.transferFeeKobo)}</dd>
          <dt>Stamp duty</dt><dd style={{ margin: 0, textAlign: 'right', overflowWrap: 'anywhere' }}>{ngn(quote.stampDutyKobo)}</dd>
          <dt><strong>You receive</strong></dt><dd style={{ margin: 0, textAlign: 'right', overflowWrap: 'anywhere' }}><strong>{ngn(quote.netKobo)}</strong></dd>
        </dl>
        <p style={{ fontSize: 12 }}>Charges are deducted from your payout. Quote expires at {new Date(quote.expiresAt).toLocaleTimeString()}.</p>
        <p style={{ fontSize: 12 }}>If the transfer fails or is reversed, confirmed non-refundable charges are deducted from your refund using this exchange rate, rounded to the nearest USD cent.</p>
      </Card>}
      {available !== true && <p role="status">{available === null ? 'Checking withdrawal availability…' : 'New withdrawals are temporarily unavailable. You can still check an existing withdrawal.'}</p>}
      <Button type="button" loading={busy} disabled={busy || !banks.length || availableUsd === null || available !== true} onClick={quote ? confirm : review}>
        {busy ? 'Please wait…' : quote ? `Confirm payout of ${ngn(quote.netKobo)}` : 'Review fees and net payout'}
      </Button>
      {available !== true && <details><summary style={{ minHeight: 44, cursor: 'pointer' }} aria-label="Why new withdrawals are unavailable">? Why is this action unavailable?</summary><p>Independent withdrawal security controls must be ready before a new payout can be requested. Opening this form does not reserve your funds. Existing requests can still be checked using their original request link.</p></details>}
    </>}

    {/* Step-Up TOTP Two-Factor Authorization Modal */}
    {isStepUpOpen && quote && (
      <div style={{ position: 'fixed', inset: 0, zIndex: 1400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)' }}>
        <div ref={stepUpDialog} role="dialog" aria-modal="true" aria-label="Authorize Withdrawal with Two-Factor Authentication" tabIndex={-1} className="theme-card" style={{ width: '100%', maxWidth: '440px', padding: '28px', backgroundColor: 'var(--bg-page)', borderRadius: '16px', position: 'relative', boxSizing: 'border-box', boxShadow: 'var(--shadow-lg)' }}>
          <Button
            type="button"
            variant="ghost"
            disabled={stepUpBusy}
            onClick={() => setIsStepUpOpen(false)}
            style={{ position: 'absolute', top: '16px', right: '16px', padding: '6px', minWidth: 'auto', height: 'auto', color: 'var(--text-secondary)' }}
            aria-label="Close step-up dialog"
          >
            <X size={18} />
          </Button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(212, 20, 58, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-crimson)' }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                Step-Up Authorization
              </h2>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                Transaction-bound security verification
              </p>
            </div>
          </div>

          <form onSubmit={handleStepUpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {stepUpError && (
              <Alert variant="destructive">
                <AlertDescription>{stepUpError}</AlertDescription>
              </Alert>
            )}

            <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', fontSize: '13px', lineHeight: 1.5 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Debit Amount:</span>
                <span style={{ fontWeight: 600 }}>${(quote.amountUsdCents / 100).toFixed(2)} USD</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Net Payout:</span>
                <span style={{ fontWeight: 700, color: 'var(--color-crimson)' }}>{ngn(quote.netKobo)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Reference:</span>
                <span style={{ fontFamily: 'monospace', fontSize: '11px', overflowWrap: 'anywhere' }}>{quote.reference.slice(0, 16)}…</span>
              </div>
            </div>

            <div>
              <label htmlFor="stepup-totp-code" style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>
                Authenticator 6-Digit Code
              </label>
              <Input
                id="stepup-totp-code"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]*"
                maxLength={6}
                value={totpCode}
                placeholder="123456"
                disabled={stepUpBusy}
                onChange={e => {
                  const cleaned = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setTotpCode(cleaned);
                  if (stepUpError) setStepUpError(null);
                }}
                style={{ textAlign: 'center', fontSize: '20px', letterSpacing: '4px', fontWeight: 700 }}
                autoFocus
              />
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Enter the code from your authenticator app to authorize this specific payout.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
              <Button
                type="button"
                variant="outline"
                disabled={stepUpBusy}
                onClick={() => setIsStepUpOpen(false)}
                style={{ flex: 1 }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={stepUpBusy}
                disabled={stepUpBusy || totpCode.length !== 6}
                style={{ flex: 1 }}
              >
                {stepUpBusy ? 'Verifying…' : 'Authorize Payout'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    )}
  </div>;
}