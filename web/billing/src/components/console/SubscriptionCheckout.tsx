'use client';
import React, { useEffect, useRef, useState } from 'react';
import { recoverSubscription, startSubscription, subscriptionRequest, SubscriptionPayment } from '../../lib/subscription-api';
import { Alert, AlertDescription } from '../ui/alert';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

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
  return <Card role="region" aria-label="Subscription payment" className="theme-card" style={{ padding: 20 }}>
    {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
    {requestId ? <>
      <Alert variant={payment?.status === 'completed' ? 'success' : 'info'}>
        <AlertDescription>{payment?.status === 'completed' ? 'Payment verified. Your paid subscription period is active.' : 'A subscription payment needs confirmation. Status checks do not send another charge.'}</AlertDescription>
      </Alert>
      <p style={{ overflowWrap: 'anywhere', fontSize: 12 }}>Request: {requestId}</p>
      {payment && <p>${(payment.amountUsdCents / 100).toFixed(2)} · ₦{(payment.amountNgnKobo / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>}
      <Button style={{ width: '100%' }} type="button" disabled={busy} loading={busy} onClick={() => void run(false)}>{busy ? 'Checking…' : 'Check subscription payment'}</Button>
      {payment?.status === 'pending' && payment.checkoutUrl && <p><a href={payment.checkoutUrl}>Continue to Paystack checkout</a></p>}
      {payment?.status === 'completed' && <Button style={{ width: '100%' }} variant="outline" type="button" onClick={() => {
        const url = new URL(window.location.href); ['subscription_request', 'reference', 'trxref'].forEach(key => url.searchParams.delete(key));
        window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`); setRequestId(null); setPayment(null);
      }}>Close confirmation</Button>}
    </> : plan && <>
      <h3 style={{ fontSize: 18, marginBottom: 12 }}>{plan.name}</h3>
      <label>Billing period <select className="cf-input" style={{ marginTop: 8 }} value={interval} disabled={busy} onChange={event => setInterval(event.target.value as 'monthly' | 'annual')}>
        <option value="monthly">Monthly — ${plan.monthlyUsd.toFixed(2)}</option><option value="annual">Annual — ${plan.annualUsd.toFixed(2)}</option>
      </select></label>
      <p style={{ marginTop: 12, fontSize: 13 }}>Buy one paid period. Automatic renewal is off. Review the NGN total at checkout before paying.</p>
      <Button style={{ width: '100%' }} type="button" disabled={busy || !!error} loading={busy} onClick={() => void run(true)}>{busy ? 'Preparing checkout…' : 'Prepare secure checkout'}</Button>
    </>}
  </Card>;
}
