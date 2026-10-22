'use client';

import React, { useEffect, useRef, useState } from 'react';
import { confirmWithdrawal, quoteWithdrawal, recoverWithdrawal, withdrawalRequest, type WithdrawalQuote, type WithdrawalStatus } from '../../lib/withdrawal-api';

interface Bank { id: string; bankName: string; accountNumber: string; accountName: string }
const ngn = (kobo: number) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(kobo / 100);
const control: React.CSSProperties = { width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--bg-page)', color: 'var(--text-primary)' };

export function WithdrawalForm({ banks, availableUsd, onRefresh }: { banks: Bank[]; availableUsd: number | null; onRefresh: () => Promise<void> }) {
  const [amount, setAmount] = useState('25'), [bankId, setBankId] = useState('');
  const [quote, setQuote] = useState<WithdrawalQuote | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [result, setResult] = useState<WithdrawalStatus | null>(null);
  const [error, setError] = useState<string | null>(null), [busy, setBusy] = useState(false);
  const [invalidRecovery, setInvalidRecovery] = useState(false);
  const flight = useRef(false), mounted = useRef(false);
  useEffect(() => { if (!bankId && banks.length) setBankId(banks[0].id); }, [banks, bankId]);
  useEffect(() => {
    mounted.current = true;
    try { setRequestId(withdrawalRequest(window.location.search)); }
    catch (e) { setInvalidRecovery(true); setError((e as Error).message); }
    return () => { mounted.current = false; };
  }, []);
  const run = async (action: () => Promise<void>) => {
    if (flight.current) return;
    flight.current = true; setBusy(true); setError(null);
    try { await action(); }
    catch (e) { if (mounted.current) setError(e instanceof Error ? e.message : 'Withdrawal could not be confirmed. Check its status before retrying.'); }
    finally { flight.current = false; if (mounted.current) setBusy(false); }
  };
  const review = () => run(async () => {
    const value = Number(amount);
    if (!bankId || !Number.isFinite(value) || value < 5 || !/^\d+(\.\d{1,2})?$/.test(amount) || availableUsd === null || value > availableUsd) throw new Error('Choose a bank and an available amount of at least $5, with at most two decimal places.');
    const next = await quoteWithdrawal({ requestId: window.crypto.randomUUID(), bankAccountId: bankId, amountUsd: value });
    if (mounted.current) setQuote(next);
  });
  const confirm = () => run(async () => {
    if (!quote || requestId) return;
    if (Date.parse(quote.expiresAt) <= Date.now()) { setQuote(null); throw new Error('Quote expired. Review a new quote before confirming.'); }
    // Persist identity before the first money-changing request, including if its response is lost.
    const url = new URL(window.location.href); url.searchParams.set('withdrawal_request', quote.requestId); url.searchParams.set('view', 'console');
    window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
    setRequestId(quote.requestId);
    const next = await confirmWithdrawal(quote);
    if (mounted.current) { setResult(next); await onRefresh(); }
  });
  const recover = () => run(async () => {
    if (!requestId) return;
    const next = await recoverWithdrawal(requestId);
    if (mounted.current) { setResult(next); await onRefresh(); }
  });
  const terminal = result && ['completed', 'failed', 'reversed', 'cancelled'].includes(result.status);
  return <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    {error && <p role="alert" style={{ color: 'var(--color-crimson)' }}>{error}</p>}
    {requestId || invalidRecovery ? <>
      <p role="status">{result ? `Withdrawal status: ${result.status}.` : 'A withdrawal request needs a status check. No new payout will be sent by checking.'}</p>
      {result?.confirmation === 'operator_approval_required' && <p>Provider approval is required. Your funds remain reserved.</p>}
      {result?.confirmation === 'unconfirmed' && <p>Provider confirmation is unavailable. Your request is retained for reconciliation.</p>}
      {result?.confirmation === 'not_dispatched' && result.status === 'pending' && <p>Your funds are reserved, but the transfer has not been sent. Contact support with your request ID.</p>}
      {requestId && <p style={{ overflowWrap: 'anywhere', fontSize: 12 }}>Request: {requestId}</p>}
      <button type="button" style={control} disabled={busy || invalidRecovery} onClick={recover}>{busy ? 'Checking…' : 'Check withdrawal status'}</button>
      {terminal && <button type="button" style={control} disabled={busy} onClick={() => {
        const url = new URL(window.location.href); url.searchParams.delete('withdrawal_request');
        window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
        setRequestId(null); setResult(null); setQuote(null); setError(null);
      }}>Start another withdrawal</button>}
    </> : <>
      <label htmlFor="billing-withdraw-amount">Withdrawal amount (USD)</label>
      <input id="billing-withdraw-amount" style={control} type="number" step="0.01" min="5" value={amount} disabled={busy} onChange={e => { setAmount(e.target.value); setQuote(null); }} />
      <p style={{ fontSize: 12 }}>Available: {availableUsd === null ? 'Unavailable' : `$${availableUsd.toFixed(2)}`}</p>
      <label htmlFor="billing-withdraw-bank">Destination bank account</label>
      <select id="billing-withdraw-bank" style={control} value={bankId} disabled={busy} onChange={e => { setBankId(e.target.value); setQuote(null); }}>
        <option value="">Select a bank account</option>
        {banks.map(bank => <option key={bank.id} value={bank.id}>{bank.bankName} — {bank.accountNumber} ({bank.accountName})</option>)}
      </select>
      {!banks.length && <p>Connect a bank account in the Bank Accounts tab first.</p>}
      {quote && <section aria-label="Payout quote" style={{ padding: 16, border: '1px solid var(--border-subtle)', borderRadius: 8 }}>
        <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 8 }}>
          <dt>Wallet debit</dt><dd style={{ margin: 0, textAlign: 'right', overflowWrap: 'anywhere' }}>${(quote.amountUsdCents / 100).toFixed(2)}</dd>
          <dt>USD/NGN rate</dt><dd style={{ margin: 0, textAlign: 'right', overflowWrap: 'anywhere' }}>{quote.rate.toLocaleString()}</dd>
          <dt>Gross payout</dt><dd style={{ margin: 0, textAlign: 'right', overflowWrap: 'anywhere' }}>{ngn(quote.grossKobo)}</dd>
          <dt>Transfer fee</dt><dd style={{ margin: 0, textAlign: 'right', overflowWrap: 'anywhere' }}>{ngn(quote.transferFeeKobo)}</dd>
          <dt>Stamp duty</dt><dd style={{ margin: 0, textAlign: 'right', overflowWrap: 'anywhere' }}>{ngn(quote.stampDutyKobo)}</dd>
          <dt><strong>You receive</strong></dt><dd style={{ margin: 0, textAlign: 'right', overflowWrap: 'anywhere' }}><strong>{ngn(quote.netKobo)}</strong></dd>
        </dl>
        <p style={{ fontSize: 12 }}>Charges are deducted from your payout. Quote expires at {new Date(quote.expiresAt).toLocaleTimeString()}.</p>
      </section>}
      <button type="button" style={{ ...control, background: 'var(--color-crimson)', color: '#fff', fontWeight: 600 }} disabled={busy || !banks.length || availableUsd === null} onClick={quote ? confirm : review}>
        {busy ? 'Please wait…' : quote ? `Confirm payout of ${ngn(quote.netKobo)}` : 'Review fees and net payout'}
      </button>
    </>}
  </div>;
}
