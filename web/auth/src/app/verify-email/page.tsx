'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getApiUrl } from '@/lib/config';

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
    <div className="glass-card" style={{ width: '100%', maxWidth: '420px', padding: '36px', textAlign: 'center' }}>
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

      <h1 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--color-white)', marginBottom: '8px' }}>
        Email Verification
      </h1>

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
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div style={{ color: 'var(--color-gray-400)' }}>Verifying email...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
