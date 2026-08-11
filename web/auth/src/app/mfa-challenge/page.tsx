'use client';

import { useState } from 'react';

export default function MfaChallengePage() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const urlParams = new URLSearchParams(window.location.search);
      const mfaChallengeToken = urlParams.get('token');

      const res = await fetch('/api/v1/mfa/totp/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mfaChallengeToken}`,
        },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Verification failed');

      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card" style={{ width: '100%', maxWidth: '420px', padding: '32px' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px', background: 'linear-gradient(to right, #a78bfa, #f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Two-Factor Verification
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Enter the 6-digit code from your authenticator app</p>
      </div>

      {error && (
        <div style={{ background: 'var(--error-bg)', color: 'var(--error-text)', padding: '12px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px' }}>6-DIGIT TOTP CODE / BACKUP CODE</label>
          <input
            type="text"
            className="input-field"
            placeholder="123456"
            maxLength={8}
            style={{ textAlign: 'center', letterSpacing: '4px', fontSize: '18px', fontWeight: '600' }}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '8px' }}>
          {loading ? 'Verifying...' : 'Verify Code'}
        </button>
      </form>
    </div>
  );
}
