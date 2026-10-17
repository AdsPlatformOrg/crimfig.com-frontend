'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getApiUrl } from '@/lib/config';
import { AuthBrandHeader } from '@/components/AuthBrandHeader';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setMessage('Invalid or missing verification link.');
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
      <div className="glass-card" style={{ width: '100%', maxWidth: '420px', padding: '36px', textAlign: 'center' }}>
      <AuthBrandHeader
        title="Email Verification"
      />

      {loading ? (
        <p style={{ color: 'var(--color-gray-400)', fontSize: '14px', margin: '24px 0' }}>
          Verifying your email address...
        </p>
      ) : (
        <div style={{ marginTop: '20px' }}>
          <div className={success ? 'alert-success' : 'alert-error'} style={{ marginBottom: '24px', textAlign: 'left', lineHeight: '1.5' }}>
            <span>{message}</span>
          </div>

          <Link href="/login" className="btn-primary">
            Continue to Sign In
          </Link>
        </div>
      )}
    </div>
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
