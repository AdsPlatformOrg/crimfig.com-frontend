'use client';

import { Suspense, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { approveConsent, consentSession } from '@/lib/consent';
import { AuthBrandHeader } from '@/components/AuthBrandHeader';

function ConsentContent() {
  const searchParams = useSearchParams();
  const clientId = searchParams.get('client_id') || 'Ecosystem App';
  const pending = useRef(false);
  const [attempted, setAttempted] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    <div className="auth-centered-container">
      <div className="glass-card" style={{ width: '100%', maxWidth: '440px', padding: '36px' }}>
      <AuthBrandHeader
        title={`Authorize ${clientId}`}
        subtitle="This application would like to connect to your CrimFig account credentials & profile."
      />

      {error && (
        <div role="alert" className="alert-error" style={{ marginBottom: '20px' }}>
          <span>{error}</span>
        </div>
      )}

      <div
        style={{
          background: 'rgba(17, 19, 24, 0.75)',
          border: '1px solid var(--color-gray-700)',
          padding: '16px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '24px',
          fontSize: '13px',
        }}
      >
        <div style={{ fontWeight: '600', color: 'var(--color-white)', marginBottom: '8px' }}>
          Permissions requested:
        </div>
        <ul
          style={{
            paddingLeft: '20px',
            color: 'var(--color-gray-400)',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
          }}
        >
          <li>Read basic user profile (Email, User ID, Locale)</li>
          <li>Single Sign-On authentication session</li>
        </ul>
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          type="button"
          onClick={() => window.history.back()}
          className="btn-secondary"
          style={{ flex: 1 }}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleApprove}
          className="btn-primary"
          disabled={loading || attempted}
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
