'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getApiUrl, clientConfig } from '@/lib/config';

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
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');

      if (data.requiresMfa) {
        window.location.href = `/mfa-challenge?token=${encodeURIComponent(data.mfaChallengeToken)}`;
      } else {
        // If there are redirect query parameters (OAuth flow)
        const urlParams = new URLSearchParams(window.location.search);
        const redirectUri = urlParams.get('redirect_uri');
        const clientId = urlParams.get('client_id');

        if (clientId && redirectUri) {
          window.location.href = `/consent?${urlParams.toString()}`;
        } else {
          window.location.href = '/dashboard';
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card" style={{ width: '100%', maxWidth: '420px', padding: '36px' }}>
      {/* Brand Header */}
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
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--color-white)', marginBottom: '6px' }}>
          Crim<span style={{ color: 'var(--color-crimson-light)' }}>Fig</span> Identity
        </h1>
        <p style={{ color: 'var(--color-gray-400)', fontSize: '13px' }}>
          Sign in to access your ecosystem apps
        </p>
      </div>

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
  );
}
