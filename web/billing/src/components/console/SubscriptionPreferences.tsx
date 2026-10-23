'use client';
import React, { useEffect, useRef, useState } from 'react';
import { renewalLimitKobo, renewalPreferences, RenewalPreferences, setRenewalConsent, stopRenewal } from '../../lib/subscription-api';

const control: React.CSSProperties = { width: '100%', padding: '10px 12px', marginTop: 8, borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--bg-page)', color: 'var(--text-primary)', fontSize: 13 };
type SubscriptionChoice = { id: string; appSlug: string };
type CardChoice = { id: string; provider: string; cardBrand: string; last4: string };

export function SubscriptionPreferences({ subscriptions, cards }: { subscriptions: SubscriptionChoice[]; cards: CardChoice[] }) {
  const [id, setId] = useState(''), [settings, setSettings] = useState<RenewalPreferences | null>(null);
  const [cardId, setCardId] = useState(''), [limit, setLimit] = useState(''), [accepted, setAccepted] = useState(false);
  const [busy, setBusy] = useState(false), [uncertain, setUncertain] = useState(false), [message, setMessage] = useState('');
  const pending = useRef(false), alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    const query = new URLSearchParams(window.location.search);
    if (query.has('renewal_request')) {
      setId(query.get('renewal_subscription') || ''); setUncertain(true);
      setMessage('A renewal preference change needs confirmation. Check current settings before making another change.');
    }
    return () => { alive.current = false; };
  }, []);
  const clearRequest = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('renewal_request'); url.searchParams.delete('renewal_subscription');
    window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
  };
  const run = async (action: 'read' | 'enable' | 'cancel') => {
    if (pending.current || !id || (action === 'enable' && (!settings || !accepted || uncertain))) return;
    pending.current = true; setBusy(true); setMessage('');
    try {
      if (action === 'enable') {
        const maxNgnKobo = renewalLimitKobo(limit), requestId = window.crypto.randomUUID();
        const url = new URL(window.location.href);
        url.searchParams.set('renewal_request', requestId); url.searchParams.set('renewal_subscription', id);
        url.searchParams.set('view', 'console'); url.searchParams.set('tab', 'subscriptions');
        window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
        setUncertain(true);
        await setRenewalConsent(id, { requestId, savedCardId: cardId, maxNgnKobo, expectedPeriodEnd: settings!.currentPeriodEnd });
      } else if (action === 'cancel') {
        setUncertain(true);
        await stopRenewal(id);
      }
      const current = await renewalPreferences(id);
      if (!alive.current) return;
      setSettings(current); setCardId(current.savedCardId || '');
      setLimit(current.maxNgnKobo === null ? '' : (current.maxNgnKobo / 100).toFixed(2));
      setAccepted(false); setUncertain(false); clearRequest();
      setMessage(action === 'cancel' && !current.autoRenew ? 'Automatic renewal is off. Your verified paid period remains available until its end.' : 'Current renewal settings verified.');
    } catch (error) {
      if (alive.current) setMessage(error instanceof Error ? `${error.message} Check current settings before another change.` : 'Settings are unconfirmed. Check current settings.');
    } finally { pending.current = false; if (alive.current) setBusy(false); }
  };
  if (!subscriptions.length && !uncertain) return null;
  return <section aria-label="Subscription renewal preferences" className="theme-card" style={{ padding: 20, borderRadius: 12, border: '1px solid var(--border-subtle)', minWidth: 0 }}>
    <h3 style={{ fontSize: 18, marginBottom: 12 }}>Renewal preferences</h3>
    <label>Subscription<select style={control} value={id} disabled={busy || uncertain} onChange={event => {
      setId(event.target.value); setSettings(null); setAccepted(false); setMessage('');
    }}><option value="">Choose a subscription</option>{subscriptions.map(sub => <option key={sub.id} value={sub.id}>{sub.appSlug} · {sub.id.slice(0, 8)}</option>)}</select></label>
    <button style={control} type="button" disabled={!id || busy} onClick={() => void run('read')}>{busy ? 'Checking…' : 'Check current settings'}</button>
    {message && <p role="status" style={{ marginTop: 12, overflowWrap: 'anywhere' }}>{message}</p>}
    {settings && <>
      <p style={{ marginTop: 12 }}>${(settings.amountUsdCents / 100).toFixed(2)} per {settings.interval === 'annual' ? 'year' : 'month'}. Paid period ends {new Date(settings.currentPeriodEnd).toLocaleString()}.</p>
      <p>Automatic renewal: {settings.autoRenew ? 'on' : 'off'}. {settings.entitled ? 'Paid access is verified.' : 'No current paid access is verified.'}</p>
      {settings.maxNgnKobo !== null && <p>Agreed maximum per renewal: ₦{(settings.maxNgnKobo / 100).toFixed(2)}.</p>}
      {!settings.renewalProcessingAvailable && <p>Automatic renewal processing is currently unavailable.</p>}
      {settings.autoRenew && <>
        <p>Turning renewal off preserves your paid period. A charge already submitted may still complete; check its payment status.</p>
        <button type="button" style={control} disabled={busy || uncertain} onClick={() => void run('cancel')}>Turn off automatic renewal</button>
      </>}
      {settings.entitled && settings.renewalProcessingAvailable && <fieldset disabled={busy || uncertain} style={{ border: 0, padding: 0, marginTop: 16, minWidth: 0 }}>
        <legend>Authorize future renewals</legend>
        <label>Saved card<select style={control} value={cardId} onChange={event => { setCardId(event.target.value); setAccepted(false); }}>
          <option value="">Choose a saved card</option>{cards.filter(card => card.provider === 'paystack').map(card => <option key={card.id} value={card.id}>{card.cardBrand} ending {card.last4}</option>)}
        </select></label>
        <label style={{ display: 'block', marginTop: 12 }}>Maximum charge per renewal (NGN)<input style={control} inputMode="decimal" value={limit} onChange={event => { setLimit(event.target.value); setAccepted(false); }} /></label>
        <p style={{ marginTop: 12 }}>Renewals use the current exchange rate. A charge above your limit will not be submitted. Saving consent does not charge you now.</p>
        <label style={{ display: 'flex', gap: 8, marginTop: 12, alignItems: 'flex-start' }}><input type="checkbox" checked={accepted} onChange={event => setAccepted(event.target.checked)} />I authorize this card for the displayed recurring USD price, up to my NGN limit per renewal, until I turn renewal off.</label>
        <button type="button" style={control} disabled={!accepted || !cardId || !limit} onClick={() => void run('enable')}>Save renewal authorization</button>
      </fieldset>}
    </>}
  </section>;
}
