'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getApiUrl } from '@/lib/config';
import { AuthBrandHeader } from '@/components/AuthBrandHeader';

function ConsentContent() {
  const searchParams = useSearchParams();
  const clientId = searchParams.get('client_id') || 'Ecosystem App';
  const redirectUri = searchParams.get('redirect_uri');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleApprove = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch(getApiUrl('/api/v1/oauth/authorize/approve'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: clientId,
          redirect_uri: redirectUri,
          response_type: searchParams.get('response_type') || 'code',
          scope: searchParams.get('scope'),
          state: searchParams.get('state'),
          code_challenge: searchParams.get('code_challenge'),
          code_challenge_method: searchParams.get('code_challenge_method'),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Authorization failed');

      if (redirectUri && data.code) {
        const url = new URL(redirectUri);
        url.searchParams.set('code', data.code);
        if (data.state) url.searchParams.set('state', data.state);
        window.location.href = url.toString();
      }
    } catch (err: any) {
      setError(err.message);
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
        <div className="alert-error" style={{ marginBottom: '20px' }}>
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
          disabled={loading}
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
