'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { getMfaChallengeCopy } from '@/lib/auth-copy';
import { useLanguage } from '../../../../../shared/ui/localization/LocalizationProvider';
import { LanguagePicker } from '../../../../../shared/ui/localization/LanguagePicker';
import { AuthBrandHeader } from '@/components/AuthBrandHeader';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

function MfaChallengeContent() {
  const { locale } = useLanguage();
  const copy = getMfaChallengeCopy(locale);

  return (
    <div className="auth-centered-container">
      <Card className="glass-card" style={{ width: '100%', maxWidth: '420px', padding: '36px' }}>
      <LanguagePicker publishedOnly />
      <AuthBrandHeader
        title={copy.title}
        subtitle="Two-factor authentication challenges are coming soon."
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'center' }}>
        <Alert>
          <span>Multi-factor authentication is not enabled yet and is coming soon.</span>
        </Alert>
        <Button asChild variant="outline" style={{ width: '100%' }}>
          <Link href="/login">Back to Sign In</Link>
        </Button>
        <Button asChild variant="ghost" style={{ width: '100%' }}>
          <Link href="/security">Credentials &amp; Security</Link>
        </Button>
      </div>
      </Card>
  </div>
  );
}


export default function MfaChallengePage() {
  return (
    <Suspense fallback={<div style={{ color: 'var(--color-gray-400)' }}>Loading challenge...</div>}>
      <MfaChallengeContent />
    </Suspense>
  );
}
