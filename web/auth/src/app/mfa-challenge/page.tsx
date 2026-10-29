'use client';

import { Suspense, useState } from 'react';
import { withBrowserRefreshLock } from '@crimfig/session';
import { useSearchParams } from 'next/navigation';
import { loginDestination } from '@/lib/login-return';
import { getApiUrl } from '@/lib/config';
import { AuthBrandHeader } from '@/components/AuthBrandHeader';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

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

      const res = await withBrowserRefreshLock(window.location.origin, () => fetch(getApiUrl('/api/v1/mfa/verify'), {
        method: 'POST', credentials: 'include', redirect: 'error', signal: AbortSignal.timeout(10000),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mfaChallengeToken}`,
        },
        body: JSON.stringify({ code }),
      }));

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Verification failed');

      window.location.assign(loginDestination(new URLSearchParams(searchParams.toString())));

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-centered-container">
      <Card className="glass-card" style={{ width: '100%', maxWidth: '420px', padding: '36px' }}>
      <AuthBrandHeader
        title="Two-Factor Verification"
        subtitle="Enter the 6-digit authenticator code or 8-character backup code"
      />

      {error && (
        <Alert variant="destructive" style={{ marginBottom: '20px' }}>
          <span>{error}</span>
        </Alert>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div>
          <label htmlFor="mfa-code" style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-gray-400)', marginBottom: '8px', textAlign: 'center', letterSpacing: '0.5px' }}>
            AUTHENTICATOR / BACKUP CODE
          </label>
          <Input
            id="mfa-code"
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

        <Button type="submit" loading={loading} style={{ marginTop: '8px', width: '100%' }}>
          {loading ? 'Verifying...' : 'Verify & Continue'}
        </Button>
      </form>
      </Card>
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
