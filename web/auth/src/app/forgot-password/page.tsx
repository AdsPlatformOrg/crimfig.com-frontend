'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getApiUrl } from '@/lib/config';
import { AuthBrandHeader } from '@/components/AuthBrandHeader';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

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
    <div className="auth-centered-container">
      <Card className="glass-card" style={{ width: '100%', maxWidth: '420px', padding: '36px' }}>
      <AuthBrandHeader
        title="Reset Password"
        subtitle="Enter your email to receive a password reset link"
      />

      {error && (
        <Alert variant="destructive" style={{ marginBottom: '20px' }}>
          <span>{error}</span>
        </Alert>
      )}

      {submitted ? (
        <div>
          <Alert variant="success" style={{ marginBottom: '24px', lineHeight: '1.5' }}>
            <span>If an account with this email exists, a password reset link has been sent. Please check your inbox.</span>
          </Alert>
          <Button asChild variant="secondary" className="cf-auth-full-button">
            <Link href="/login">Back to Sign In</Link>
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label htmlFor="reset-email" style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-gray-400)', marginBottom: '6px', letterSpacing: '0.5px' }}>
              EMAIL ADDRESS
            </label>
            <Input
              id="reset-email"
              type="email"
              className="input-field"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <Button type="submit" loading={loading} style={{ marginTop: '8px', width: '100%' }}>
            {loading ? 'Sending Link...' : 'Send Reset Link'}
          </Button>
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
      </Card>
    </div>
  );
}
