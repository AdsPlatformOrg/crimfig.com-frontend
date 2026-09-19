'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getApiUrl } from '@/lib/config';

function MfaChallengeContent() {
  const searchParams = useSearchParams();
  const mfaChallengeToken = searchParams.get('token') || '';

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!mfaChallengeToken) {
        throw new Error('MFA challenge session expired or invalid. Please sign in again.');
      }

      const res = await fetch(getApiUrl('/api/v1/mfa/verify'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mfaChallengeToken}`,
        },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Verification failed');

      // Check if there are OAuth parameters to redirect back to consent
      const clientId = searchParams.get('client_id');
      const redirectUri = searchParams.get('redirect_uri');

      if (clientId && redirectUri) {
        window.location.href = `/consent?${searchParams.toString()}`;
      } else {
        window.location.href = '/dashboard';
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card" style={{ width: '100%', maxWidth: '420px', padding: '36px' }}>
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <div
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            background: 'var(--gradient-crimson)',
            boxShadow: 'var(--shadow-crimson)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            fontWeight: '700',
            fontSize: '22px',
            color: '#FFFFFF',
          }}
        >
          C
        </div>
        <h1 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--color-white)', marginBottom: '6px' }}>
          Two-Factor Verification
        </h1>
        <p style={{ color: 'var(--color-gray-400)', fontSize: '13px' }}>
          Enter the 6-digit authenticator code or 8-character backup code
        </p>
      </div>

      {error && (
        <div className="alert-error" style={{ marginBottom: '20px' }}>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-gray-400)', marginBottom: '8px', textAlign: 'center', letterSpacing: '0.5px' }}>
            AUTHENTICATOR / BACKUP CODE
          </label>
          <input
            type="text"
            className="input-field"
            placeholder="123456"
            maxLength={8}
            style={{
              textAlign: 'center',
              letterSpacing: '6px',
              fontSize: '20px',
              fontWeight: '700',
              padding: '14px',
            }}
            value={code}
            onChange={(e) => setCode(e.target.value.trim())}
            required
            autoFocus
          />
        </div>

        <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '8px' }}>
          {loading ? 'Verifying...' : 'Verify & Continue'}
        </button>
      </form>
    </div>
  );
}

export default function MfaChallengePage() {
  return (
    <Suspense fallback={<div style={{ color: 'var(--color-gray-400)' }}>Loading challenge...</div>}>
      <MfaChallengeContent />
    </Suspense>
  );
}
