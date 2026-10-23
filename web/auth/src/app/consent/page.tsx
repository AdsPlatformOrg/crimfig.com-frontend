'use client';

import { Suspense, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { approveConsent, consentRequest, consentSession } from '@/lib/consent';
import { AuthBrandHeader } from '@/components/AuthBrandHeader';

function ConsentContent() {
  const searchParams = useSearchParams();
  const clientId = searchParams.get('client_id') || 'Ecosystem App';
  const pending = useRef(false);
  const [attempted, setAttempted] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  let request: ReturnType<typeof consentRequest> | undefined;
  try { request = consentRequest(new URLSearchParams(searchParams.toString())); } catch { /* Disable incomplete requests before any approval. */ }
  const permissions: Record<string, string> = {
    openid: 'Confirm your CrimFig account ID',
    profile: 'Read your preferred language',
    email: 'Read your email address and verification status',
  };

  const handleApprove = async () => {
    if (pending.current || attempted) return;
    pending.current = true;
    setAttempted(true);
    setLoading(true);
    setError('');
    try {
      const callback = await approveConsent(new URLSearchParams(searchParams.toString()), (path, init) =>
        consentSession().request(new URL(path, window.location.origin), init));
      window.location.assign(callback);
    } catch {
      setError('Authorization could not be confirmed. Return to the requesting application and start again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-centered-container" style={{ background: 'var(--bg-page)', color: 'var(--text-primary)' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '440px', padding: '36px', background: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)' }}>
      <AuthBrandHeader
        title={`Authorize ${clientId}`}
        subtitle="Review the account information this application is requesting."
      />

      {(error || !request) && (
        <div role="alert" className="alert-error" style={{ marginBottom: '20px' }}>
          <span>{error || 'This authorization request is incomplete. Return to the requesting application and start again.'}</span>
        </div>
      )}

      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          padding: '16px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '24px',
          fontSize: '13px',
        }}
      >
        <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px' }}>
          Permissions requested:
        </div>
        <ul
          style={{
            paddingLeft: '20px',
            color: 'var(--text-secondary)',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
          }}
        >
          {(request?.scope || '').split(' ').filter(Boolean).map(scope => <li key={scope}>{permissions[scope]}</li>)}
        </ul>
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          type="button"
          onClick={() => window.history.back()}
          className="btn-secondary"
          style={{ flex: 1, color: 'var(--text-primary)', borderColor: 'var(--border-subtle)' }}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleApprove}
          className="btn-primary"
          disabled={loading || attempted || !request}
          style={{ flex: 1 }}
        >
          {loading ? 'Authorizing...' : 'Authorize'}
        </button>
      </div>
    </div>
  </div>
  );
}

export default function ConsentPage() {
  return (
    <Suspense fallback={<div style={{ color: 'var(--color-gray-400)' }}>Loading consent...</div>}>
      <ConsentContent />
    </Suspense>
  );
}
