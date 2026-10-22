'use client';

import { useState } from 'react';
import Link from 'next/link';
import { loginDestination } from '@/lib/login-return';
import { getApiUrl } from '@/lib/config';
import { AuthBrandHeader } from '@/components/AuthBrandHeader';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(getApiUrl('/api/v1/auth/login'), {
        method: 'POST', credentials: 'include', redirect: 'error', signal: AbortSignal.timeout(10000),
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');

      const params = new URLSearchParams(window.location.search);
      if (data.requiresMfa) {
        params.set('token', data.mfaChallengeToken);
        window.location.assign(`/mfa-challenge?${params.toString()}`);
      } else {
        window.location.assign(loginDestination(params));
      }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-centered-container">
      <div className="glass-card" style={{ width: '100%', maxWidth: '420px', padding: '36px' }}>
      <AuthBrandHeader
        title="CrimFig Identity"
        subtitle="Sign in to access your ecosystem apps"
      />

      {error && (
        <div className="alert-error" style={{ marginBottom: '20px' }}>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-gray-400)', marginBottom: '6px', letterSpacing: '0.5px' }}>
            EMAIL ADDRESS
          </label>
          <input
            type="email"
            className="input-field"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-gray-400)', letterSpacing: '0.5px' }}>
              PASSWORD
            </label>
            <Link href="/forgot-password" style={{ fontSize: '12px', color: 'var(--color-gray-400)' }}>
              Forgot password?
            </Link>
          </div>
          <input
            type="password"
            className="input-field"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>

        <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '8px' }}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div
        style={{
          textAlign: 'center',
          marginTop: '28px',
          paddingTop: '20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          fontSize: '13px',
          color: 'var(--color-gray-400)',
        }}
      >
        Don&apos;t have an account?{' '}
        <Link href="/signup" style={{ fontWeight: '600', color: 'var(--color-crimson-light)' }}>
          Create Account
        </Link>
      </div>
    </div>
  </div>
  );
}

