'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { consentSession } from '@/lib/consent';
import { getApiUrl } from '@/lib/config';
import { AuthBrandHeader } from '@/components/AuthBrandHeader';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');

  const resendLock = useRef(false);
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  async function resend() {
    if (resendLock.current) return;
    resendLock.current = true;
    setResending(true);
    setResendMessage('');
    try {
      const response = await consentSession().request(new URL('/api/v1/auth/resend-verification', window.location.origin), { method: 'POST' });
      setResendMessage(response.ok ? 'Check the email inbox for your signed-in account.'
        : response.status === 429 ? 'Too many requests. Wait before retrying.'
        : response.status === 401 ? 'Sign in to resend a verification link.'
        : 'The resend could not be confirmed. Check your inbox before trying again.');
    } catch {
      setResendMessage('The resend could not be confirmed. Check your inbox before trying again.');
    } finally {
      resendLock.current = false;
      setResending(false);
    }
  }

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setMessage('Open the verification link from your email, or request a fresh link while signed in.');
      return;
    }

    async function verify() {
      try {
        const res = await fetch(getApiUrl(`/api/v1/auth/verify-email?token=${encodeURIComponent(token!)}`));
        const data = await res.json();

        if (res.ok) {
          setSuccess(true);
          setMessage(data.message || 'Email verified successfully! Your account is now active.');
        } else {
          setSuccess(false);
          setMessage(data.message || 'Email verification link is invalid or has expired.');
        }
      } catch (err: any) {
        setSuccess(false);
        setMessage(err.message || 'Verification request failed.');
      } finally {
        setLoading(false);
      }
    }

    verify();
  }, [token]);

  return (
    <div className="auth-centered-container">
      <Card className="glass-card" style={{ width: '100%', maxWidth: '420px', padding: '36px', textAlign: 'center' }}>
      <AuthBrandHeader
        title="Email Verification"
      />

      {loading ? (
        <p style={{ color: 'var(--color-gray-400)', fontSize: '14px', margin: '24px 0' }}>
          Verifying your email address...
        </p>
      ) : (
        <div style={{ marginTop: '20px' }}>
          <Alert variant={success ? 'success' : 'destructive'} style={{ marginBottom: '24px', textAlign: 'left', lineHeight: '1.5' }}>
            <span>{message}</span>
          </Alert>

          {!success && <>
            <Button type="button" variant="outline" disabled={resending} onClick={() => void resend()}>
              {resending ? 'Requesting link…' : 'Resend verification email'}
            </Button>
            {resendMessage && <p role="status">{resendMessage}</p>}
          </>}
          <Button asChild className="cf-auth-full-button">
            <Link href="/login">Continue to Sign In</Link>
          </Button>
        </div>
      )}
      </Card>
  </div>
  );
}


export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div style={{ color: 'var(--color-gray-400)' }}>Verifying email...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
