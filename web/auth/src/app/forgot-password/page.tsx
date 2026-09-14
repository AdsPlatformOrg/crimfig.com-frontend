'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getApiUrl } from '@/lib/config';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(getApiUrl('/api/v1/auth/forgot-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Password reset request failed');

      setSubmitted(true);
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
          Reset Password
        </h1>
        <p style={{ color: 'var(--color-gray-400)', fontSize: '13px' }}>
          Enter your email to receive a password reset link
        </p>
      </div>

      {error && (
        <div className="alert-error" style={{ marginBottom: '20px' }}>
          <span>{error}</span>
        </div>
      )}

      {submitted ? (
        <div>
          <div className="alert-success" style={{ marginBottom: '24px', lineHeight: '1.5' }}>
            <span>If an account with this email exists, a password reset link has been sent. Please check your inbox.</span>
          </div>
          <Link href="/login" className="btn-secondary">
            Back to Sign In
          </Link>
        </div>
      ) : (
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

          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '8px' }}>
            {loading ? 'Sending Link...' : 'Send Reset Link'}
          </button>
        </form>
      )}

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
        Remember your password?{' '}
        <Link href="/login" style={{ fontWeight: '600', color: 'var(--color-crimson-light)' }}>
          Sign In
        </Link>
      </div>
    </div>
  );
}
