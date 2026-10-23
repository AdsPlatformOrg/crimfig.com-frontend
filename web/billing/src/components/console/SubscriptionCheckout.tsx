'use client';
import React, { useEffect, useRef, useState } from 'react';
import { recoverSubscription, startSubscription, subscriptionRequest, SubscriptionPayment } from '../../lib/subscription-api';

const control: React.CSSProperties = { width: '100%', padding: '10px 12px', marginTop: 8, borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--bg-page)', color: 'var(--text-primary)', fontSize: 13 };

export type CheckoutPlan = { id: string; appSlug: string; name: string; monthlyUsd: number; annualUsd: number };
export function SubscriptionCheckout({ plan, onConfirmed }: { plan: CheckoutPlan | null; onConfirmed: () => Promise<void> }) {
  const [interval, setInterval] = useState<'monthly' | 'annual'>('monthly');
  const [requestId, setRequestId] = useState<string | null>(null);
  const [payment, setPayment] = useState<SubscriptionPayment | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const pending = useRef(false), alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    try {
      const id = subscriptionRequest(window.location.search);
      setRequestId(id);
      if (!id && ['funding_request', 'reference', 'trxref'].some(key => new URLSearchParams(window.location.search).has(key))) {
        setError('Finish reviewing the current funding request before starting subscription checkout.');
      }
    }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Invalid recovery link.'); }
    return () => { alive.current = false; };
  }, []);
  const remember = (id: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set('subscription_request', id); url.searchParams.set('view', 'console'); url.searchParams.set('tab', 'subscriptions');
    url.searchParams.delete('reference'); url.searchParams.delete('trxref');
    window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
    setRequestId(id);
  };
  const run = async (create: boolean) => {
    if (pending.current || (create && (!plan || requestId || error))) return;
    pending.current = true; setBusy(true); setError(null);
    try {
      const id = requestId || window.crypto.randomUUID();
      if (create) remember(id); // Persist before the single money-related POST.
      const result = create ? await startSubscription({ requestId: id, appSlug: plan!.appSlug, planId: plan!.id, interval },
        Math.round((interval === 'monthly' ? plan!.monthlyUsd : plan!.annualUsd) * 100)) : await recoverSubscription(id);
      if (!alive.current) return;
      setPayment(result);
      if (result.status === 'completed') await onConfirmed();
    } catch { if (alive.current) setError('Subscription payment is unconfirmed. Check this request before starting another payment.'); }
    finally { pending.current = false; if (alive.current) setBusy(false); }
  };
  if (!plan && !requestId && !error) return null;
  return <section aria-label="Subscription payment" className="theme-card" style={{ padding: 20, borderRadius: 12, border: '1px solid var(--border-subtle)' }}>
    {error && <p role="alert">{error}</p>}
    {requestId ? <>
      <p role="status">{payment?.status === 'completed' ? 'Payment verified. Your paid subscription period is active.' : 'A subscription payment needs confirmation. Status checks do not send another charge.'}</p>
      <p style={{ overflowWrap: 'anywhere', fontSize: 12 }}>Request: {requestId}</p>
      {payment && <p>${(payment.amountUsdCents / 100).toFixed(2)} · ₦{(payment.amountNgnKobo / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>}
      <button style={control} type="button" disabled={busy} onClick={() => void run(false)}>{busy ? 'Checking…' : 'Check subscription payment'}</button>
      {payment?.status === 'pending' && payment.checkoutUrl && <p><a href={payment.checkoutUrl}>Continue to Paystack checkout</a></p>}
      {payment?.status === 'completed' && <button style={control} type="button" onClick={() => {
        const url = new URL(window.location.href); ['subscription_request', 'reference', 'trxref'].forEach(key => url.searchParams.delete(key));
        window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`); setRequestId(null); setPayment(null);
      }}>Close confirmation</button>}
    </> : plan && <>
      <h3 style={{ fontSize: 18, marginBottom: 12 }}>{plan.name}</h3>
      <label>Billing period <select style={control} value={interval} disabled={busy} onChange={event => setInterval(event.target.value as 'monthly' | 'annual')}>
        <option value="monthly">Monthly — ${plan.monthlyUsd.toFixed(2)}</option><option value="annual">Annual — ${plan.annualUsd.toFixed(2)}</option>
      </select></label>
      <p style={{ marginTop: 12, fontSize: 13 }}>Buy one paid period. Automatic renewal is off. Review the NGN total at checkout before paying.</p>
      <button style={control} type="button" disabled={busy || !!error} onClick={() => void run(true)}>{busy ? 'Preparing checkout…' : 'Prepare secure checkout'}</button>
    </>}
  </section>;
}
