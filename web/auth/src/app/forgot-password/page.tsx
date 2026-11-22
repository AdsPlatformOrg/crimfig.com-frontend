'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getApiUrl } from '@/lib/config';
import { getForgotPasswordCopy } from '@/lib/auth-copy';
import { useLanguage } from '../../../../../shared/ui/localization/LocalizationProvider';
import { LanguagePicker } from '../../../../../shared/ui/localization/LanguagePicker';
import { AuthBrandHeader } from '@/components/AuthBrandHeader';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function ForgotPasswordPage() {
  const { locale } = useLanguage();
  const copy = getForgotPasswordCopy(locale);
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
      <LanguagePicker publishedOnly />
      <AuthBrandHeader
        title={copy.title}
        subtitle={copy.subtitle}
      />

      {error && (
        <Alert variant="destructive" style={{ marginBottom: '20px' }}>
          <span>{error}</span>
        </Alert>
      )}

      {submitted ? (
        <div>
          <Alert variant="success" style={{ marginBottom: '24px', lineHeight: '1.5' }}>
            <span>{copy.sentMessage}</span>
          </Alert>
          <Button asChild variant="secondary" className="cf-auth-full-button">
            <Link href="/login">{copy.backToSignIn}</Link>
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label htmlFor="reset-email" style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-gray-400)', marginBottom: '6px', letterSpacing: '0.5px' }}>
              {copy.emailLabel}
            </label>
            <Input
              id="reset-email"
              type="email"
              className="input-field"
              placeholder={copy.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <Button type="submit" loading={loading} style={{ marginTop: '8px', width: '100%' }}>
            {loading ? copy.sending : copy.sendLink}
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
