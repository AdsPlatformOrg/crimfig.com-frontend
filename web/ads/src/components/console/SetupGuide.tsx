'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AlertCircle, Check, CheckCircle2, Clock, Copy, Loader2, MinusCircle } from 'lucide-react';
import { sessionFetch } from '../../lib/session';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

type EvidenceStatus = 'pending' | 'confirmed' | 'stale' | 'unavailable';
interface StateEntry { status: EvidenceStatus; count?: number; measured?: number; viewable?: number; version?: string | null; reason?: string }
interface InstanceEvidence { instanceId: string; rendered: boolean; measured: boolean; viewable: boolean; instancesDetected: number | null; instanceIndex: number | null; opportunities: number }
interface SetupCheckStatus {
  id: string;
  expiresAt: string;
  slotCodeUnlocked: boolean;
  expired: boolean;
  states: Record<'script_present' | 'sdk_executed' | 'slot_request_received' | 'creative_rendered' | 'measurement_received' | 'setup_complete', StateEntry>;
  instances: InstanceEvidence[];
  coverage: string;
}
interface CreatedCheck { id: string; challenge: string; sdkUrl: string; expiresAt: string }
interface SlotRef { id: string; name: string; slotTagId: string }

const STEP_LABELS: Array<[keyof SetupCheckStatus['states'], string]> = [
  ['script_present', 'Script found in page source'],
  ['sdk_executed', 'SDK executed in a browser'],
  ['slot_request_received', 'Slot request received'],
  ['creative_rendered', 'Creative rendered'],
  ['measurement_received', 'Measurement received'],
  ['setup_complete', 'Setup confirmed'],
];

const STATUS_TEXT: Record<EvidenceStatus, string> = {
  pending: 'Waiting for evidence',
  confirmed: 'Confirmed',
  stale: 'Not observed before the check expired',
  unavailable: 'Not checked',
};

function StatusIcon({ status }: { status: EvidenceStatus }) {
  const common = { width: 16, height: 16, flexShrink: 0 } as const;
  if (status === 'confirmed') return <CheckCircle2 style={{ ...common, color: 'var(--color-success, #16a34a)' }} aria-hidden />;
  if (status === 'stale') return <AlertCircle style={{ ...common, color: 'var(--color-warning, #d97706)' }} aria-hidden />;
  if (status === 'unavailable') return <MinusCircle style={{ ...common, color: 'var(--text-muted)' }} aria-hidden />;
  return <Clock style={{ ...common, color: 'var(--text-muted)' }} aria-hidden />;
}

function useCopy() {
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const copy = async (key: string, text: string) => {
    setError(null);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      setCopied(null);
      setError('Copy failed. Select the code and copy it manually.');
    }
  };
  return { copied, error, copy };
}

const box: React.CSSProperties = { padding: 16, borderRadius: 10, border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-elevated)' };
const codeBox: React.CSSProperties = { margin: 0, padding: 12, borderRadius: 8, backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', fontSize: 12, overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all' };

/** Guided SDK-first setup: install once -> verify execution -> slot-only code -> verify placements -> confirm data. */
export function SetupGuide({ website, slots }: { website: { id: string; domain: string }; slots: SlotRef[] }) {
  const storageKey = `cf-setup-check:${website.id}`;
  const [pagePath, setPagePath] = useState('/');
  const [created, setCreated] = useState<CreatedCheck | null>(null);
  const [status, setStatus] = useState<SetupCheckStatus | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [slotId, setSlotId] = useState('');
  const [slotCode, setSlotCode] = useState<string | null>(null);
  const requestId = useRef<string | null>(null);
  const { copied, error: copyError, copy } = useCopy();

  const refresh = useCallback(async (id: string): Promise<SetupCheckStatus | null> => {
    try {
      const res = await sessionFetch(`/api/v1/adstation/setup-checks/${id}`);
      if (res.status === 404) {
        localStorage.removeItem(storageKey);
        setCreated(null);
        setStatus(null);
        return null;
      }
      if (!res.ok) throw new Error('unavailable');
      const json = await res.json();
      setStatus(json.data);
      setMessage(null);
      return json.data;
    } catch {
      setMessage('Verification status is unavailable right now. Your progress is kept; retry shortly.');
      return null;
    }
  }, [storageKey]);

  // Restore progress for this website after a refresh or website switch.
  useEffect(() => {
    setCreated(null);
    setStatus(null);
    setSlotCode(null);
    requestId.current = null;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as CreatedCheck;
        setCreated(parsed);
        void refresh(parsed.id);
      } catch {
        localStorage.removeItem(storageKey);
      }
    }
  }, [storageKey, refresh]);

  // Poll only while evidence is still being awaited.
  useEffect(() => {
    if (!created || !status || status.expired || status.states.setup_complete.status === 'confirmed') return;
    const timer = setInterval(() => void refresh(created.id), 5000);
    return () => clearInterval(timer);
  }, [created, status, refresh]);

  const startCheck = async () => {
    setBusy(true);
    setMessage(null);
    try {
      requestId.current = requestId.current ?? crypto.randomUUID();
      const res = await sessionFetch(`/api/v1/adstation/websites/${website.id}/setup-checks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId: requestId.current, pagePath: pagePath.trim() || undefined }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Could not start verification.');
      setCreated(json.data);
      localStorage.setItem(storageKey, JSON.stringify(json.data));
      requestId.current = null;
      await refresh(json.data.id);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Could not start verification.');
    } finally {
      setBusy(false);
    }
  };

  const loadSlotCode = async (id: string) => {
    setSlotId(id);
    setSlotCode(null);
    if (!id) return;
    try {
      const res = await sessionFetch(`/api/v1/adstation/slots/${id}/embed`);
      const json = await res.json();
      if (!res.ok) throw new Error();
      // Slot-only: the SDK is installed once above, so omit the per-slot loader tag.
      const html: string = json.data.htmlSnippet;
      setSlotCode(html.split('\n').filter((l) => !l.trim().startsWith('<script')).join('\n'));
    } catch {
      setMessage('Slot code is unavailable right now. Retry in a moment.');
    }
  };

  const sdkTag = created ? `<script async crossorigin="anonymous" src="${created.sdkUrl}"></script>` : null;
  const nextTag = created ? `import Script from 'next/script';\n// In your root layout:\n<Script src="${created.sdkUrl}" strategy="afterInteractive" crossOrigin="anonymous" />` : null;
  const verifyUrl = created ? `https://${website.domain}${pagePath.trim() || '/'}${(pagePath || '/').includes('?') ? '&' : '?'}cf_setup=${created.challenge}` : null;
  const unlocked = !!status?.slotCodeUnlocked;

  return (
    <section aria-labelledby="setup-guide-title" style={{ ...box, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h2 id="setup-guide-title" style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Guided setup for {website.domain}</h2>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-secondary)' }}>
          Install the SDK once, confirm it ran, then add slots. Existing installations keep working; this guide never changes ad delivery.
        </p>
      </div>

      <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <li>
          <strong style={{ fontSize: 13 }}>1. Install the SDK once</strong>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '4px 0 8px' }}>
            One loader finds every slot on the page, including repeated copies of the same slot. Put it in {'<head>'} with async (or once in a shared Next.js root layout).
          </p>
          {sdkTag ? (
            <>
              <pre style={codeBox}>{sdkTag}</pre>
              <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                <Button type="button" onClick={() => copy('sdk', sdkTag)} aria-label="Copy SDK script tag">
                  {copied === 'sdk' ? <Check style={{ width: 14, height: 14 }} /> : <Copy style={{ width: 14, height: 14 }} />} Copy script tag
                </Button>
                <Button type="button" onClick={() => copy('next', nextTag!)} aria-label="Copy Next.js SDK snippet">
                  {copied === 'next' ? <Check style={{ width: 14, height: 14 }} /> : <Copy style={{ width: 14, height: 14 }} />} Copy Next.js snippet
                </Button>
              </div>
            </>
          ) : (
            <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>Start verification in step 2 to generate your SDK tag.</p>
          )}
        </li>

        <li>
          <strong style={{ fontSize: 13 }}>2. Verify the SDK</strong>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '4px 0 8px' }}>
            Choose the page where you installed it. Open the verification link in a browser; execution is confirmed by the SDK itself, not by reading your HTML. This verifies this page only.
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <Input aria-label="Page path to verify" value={pagePath} onChange={(e) => setPagePath(e.target.value)} placeholder="/" style={{ maxWidth: 260 }} />
            <Button type="button" onClick={startCheck} disabled={busy}>
              {busy ? <Loader2 style={{ width: 14, height: 14, animation: 'spin 1s linear infinite' }} /> : null}
              {created ? 'Start a new check' : 'Start verification'}
            </Button>
            {created ? <Button type="button" onClick={() => void refresh(created.id)}>Check again</Button> : null}
          </div>
          {verifyUrl && !status?.expired ? (
            <div style={{ marginTop: 8 }}>
              <pre style={codeBox}>{verifyUrl}</pre>
              <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                <Button type="button" onClick={() => copy('verify', verifyUrl)}>
                  {copied === 'verify' ? <Check style={{ width: 14, height: 14 }} /> : <Copy style={{ width: 14, height: 14 }} />} Copy link
                </Button>
                <a href={verifyUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, alignSelf: 'center' }}>Open page</a>
              </div>
            </div>
          ) : null}
          {status?.expired ? <p role="status" style={{ fontSize: 12, color: 'var(--color-warning, #d97706)' }}>This check expired. Start a new check.</p> : null}
        </li>

        <li>
          <strong style={{ fontSize: 13 }}>3. Add slot code</strong>
          {unlocked ? (
            <>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '4px 0 8px' }}>
                Slot-only code. Repeated copies of one slot share a registration but are measured independently.
              </p>
              <select aria-label="Slot" value={slotId} onChange={(e) => void loadSlotCode(e.target.value)} style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', fontSize: 13 }}>
                <option value="">Select a slot…</option>
                {slots.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              {slotCode ? (
                <div style={{ marginTop: 8 }}>
                  <pre style={codeBox}>{slotCode}</pre>
                  <Button type="button" onClick={() => copy('slot', slotCode)} style={{ marginTop: 8 }}>
                    {copied === 'slot' ? <Check style={{ width: 14, height: 14 }} /> : <Copy style={{ width: 14, height: 14 }} />} Copy slot code
                  </Button>
                </div>
              ) : null}
              {slots.length === 0 ? <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Create a slot first, then return here.</p> : null}
            </>
          ) : (
            <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '4px 0 0' }}>
              Locked until the SDK is confirmed running on your page. Already-installed slots are unaffected, and the per-slot Get Embed Code button below still works.
            </p>
          )}
        </li>

        <li>
          <strong style={{ fontSize: 13 }}>4–5. Verify placements and confirm data</strong>
          {status ? (
            <>
              <ul aria-live="polite" style={{ listStyle: 'none', padding: 0, margin: '8px 0', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {STEP_LABELS.map(([key, label]) => {
                  const entry = status.states[key];
                  const extra = key === 'slot_request_received' || key === 'creative_rendered' ? (typeof entry.count === 'number' ? ` · ${entry.count}` : '') : key === 'measurement_received' && entry.status === 'confirmed' ? ` · ${entry.measured} measured, ${entry.viewable ?? 0} viewable` : '';
                  return (
                    <li key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                      <StatusIcon status={entry.status} />
                      <span>{label}: <strong>{STATUS_TEXT[entry.status]}</strong>{extra}</span>
                    </li>
                  );
                })}
              </ul>
              {status.instances.length > 0 ? (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
                    <caption style={{ textAlign: 'left', fontWeight: 600, paddingBottom: 4 }}>Detected placements (this check)</caption>
                    <thead><tr><th align="left">Instance</th><th align="left">Rendered</th><th align="left">Measured</th><th align="left">Viewable</th><th align="left">Copies seen</th></tr></thead>
                    <tbody>
                      {status.instances.map((i) => (
                        <tr key={i.instanceId}>
                          <td>{i.instanceId.slice(0, 8)}</td>
                          <td>{i.rendered ? 'Yes' : 'No'}</td>
                          <td>{i.measured ? 'Yes' : 'No'}</td>
                          <td>{i.viewable ? 'Yes' : 'Not yet'}</td>
                          <td>{i.instancesDetected ?? 'Unknown'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
              <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '8px 0 0' }}>
                {status.coverage} Confirmation means technical setup is working; it is not a guarantee of fill, earnings or traffic quality.
              </p>
            </>
          ) : (
            <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '4px 0 0' }}>Evidence appears here after you start a check.</p>
          )}
        </li>
      </ol>
      {message ? <p role="alert" style={{ margin: 0, fontSize: 12, color: 'var(--color-warning, #d97706)' }}>{message}</p> : null}
      {copyError ? <p role="alert" style={{ margin: 0, fontSize: 12, color: 'var(--color-warning, #d97706)' }}>{copyError}</p> : null}
    </section>
  );
}

