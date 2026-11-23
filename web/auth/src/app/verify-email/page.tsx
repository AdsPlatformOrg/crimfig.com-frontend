'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { consentSession } from '@/lib/consent';
import { getApiUrl } from '@/lib/config';
import { getVerifyEmailCopy } from '@/lib/auth-copy';
import { useLanguage } from '../../../../../shared/ui/localization/LocalizationProvider';
import { LanguagePicker } from '../../../../../shared/ui/localization/LanguagePicker';
import { AuthBrandHeader } from '@/components/AuthBrandHeader';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

function VerifyEmailContent() {
  const { locale } = useLanguage();
  const copy = getVerifyEmailCopy(locale);
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
      setResendMessage(response.ok ? copy.resendOk
        : response.status === 429 ? copy.resendRateLimit
        : response.status === 401 ? copy.resendUnauth
        : copy.resendError);
    } catch {
      setResendMessage(copy.resendError);
    } finally {
      resendLock.current = false;
      setResending(false);
    }
  }

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setMessage(copy.missingToken);
      return;
    }

    async function verify() {
      try {
        const res = await fetch(getApiUrl(`/api/v1/auth/verify-email?token=${encodeURIComponent(token!)}`));
        const data = await res.json();

        if (res.ok) {
          setSuccess(true);
          setMessage(data.message || copy.verifiedDefault);
        } else {
          setSuccess(false);
          setMessage(data.message || copy.invalidDefault);
        }
      } catch (err: any) {
        setSuccess(false);
        setMessage(err.message || copy.failedDefault);
      } finally {
        setLoading(false);
      }
    }

    verify();
  }, [token]);

  return (
    <>
      <LanguagePicker publishedOnly />
      <AuthBrandHeader
        title={copy.title}
        appearance="light"
      />

      {loading ? (
        <p role="status" className="auth-entry-help">
          {copy.verifying}
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
    </>
  );
}


export default function VerifyEmailPage() {
  return (
    <main className="auth-entry auth-verify-email" data-theme="light">
      <Card className="auth-entry-card">
        <Suspense fallback={<p role="status" className="auth-entry-help">Verifying email...</p>}>
          <VerifyEmailContent />
        </Suspense>
      </Card>
    </main>
  );
}
