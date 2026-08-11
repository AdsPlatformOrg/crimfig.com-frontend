'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

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
      const res = await fetch('/api/v1/oauth/authorize/approve', {
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
    <div className="glass-card" style={{ width: '100%', maxWidth: '440px', padding: '32px' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, #7c3aed, #4c1d95)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontWeight: '700', fontSize: '20px', color: 'white' }}>
          CF
        </div>
        <h1 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>
          Authorize {clientId}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          This application would like to access your CrimFig account credentials & profile details.
        </p>
      </div>

      {error && (
        <div style={{ background: 'var(--error-bg)', color: 'var(--error-text)', padding: '12px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>
          {error}
        </div>
      )}

      <div style={{ background: 'var(--bg-input)', padding: '16px', borderRadius: '8px', marginBottom: '24px', fontSize: '13px' }}>
        <div style={{ fontWeight: '600', color: 'var(--text-main)', marginBottom: '8px' }}>Permissions requested:</div>
        <ul style={{ paddingLeft: '20px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <li>Read basic user profile (Email, ID, Locale)</li>
          <li>Single Sign-On authentication</li>
        </ul>
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          type="button"
          onClick={() => window.history.back()}
          style={{ flex: 1, padding: '12px', background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: '600' }}
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
  );
}

export default function ConsentPage() {
  return (
    <Suspense fallback={<div style={{ color: 'white' }}>Loading consent...</div>}>
      <ConsentContent />
    </Suspense>
  );
}
