'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getApiUrl } from '@/lib/config';
import { AuthBrandHeader } from '@/components/AuthBrandHeader';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch(getApiUrl('/api/v1/auth/signup'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, phone: phone || undefined }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');

      setMessage(data.message || 'Account created! Please check your email to verify your address.');
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
        title="Create Account"
        subtitle="One CrimFig account for all ecosystem apps"
      />

      {error && (
        <Alert variant="destructive" style={{ marginBottom: '20px' }}>
          <span>{error}</span>
        </Alert>
      )}

      {message ? (
        <div>
          <Alert variant="success" style={{ marginBottom: '24px', lineHeight: '1.5' }}>
            <span>{message}</span>
          </Alert>
          <Button asChild variant="secondary" className="cf-auth-full-button">
            <Link href="/login">Back to Sign In</Link>
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label htmlFor="signup-email" style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-gray-400)', marginBottom: '6px', letterSpacing: '0.5px' }}>
              EMAIL ADDRESS
            </label>
            <Input
              id="signup-email"
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
            <label htmlFor="signup-phone" style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-gray-400)', marginBottom: '6px', letterSpacing: '0.5px' }}>
              PHONE NUMBER (OPTIONAL)
            </label>
            <Input
              id="signup-phone"
              type="tel"
              className="input-field"
              placeholder="+2348012345678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
            />
          </div>

          <div>
            <label htmlFor="signup-password" style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-gray-400)', marginBottom: '6px', letterSpacing: '0.5px' }}>
              PASSWORD
            </label>
            <Input
              id="signup-password"
              type="password"
              className="input-field"
              placeholder="Min 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>

          <Button type="submit" loading={loading} style={{ marginTop: '8px', width: '100%' }}>
            {loading ? 'Creating Account...' : 'Create Account'}
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
        Already have an account?{' '}
        <Link href="/login" style={{ fontWeight: '600', color: 'var(--color-crimson-light)' }}>
          Sign In
        </Link>
      </div>
      </Card>
    </div>
  );
}
