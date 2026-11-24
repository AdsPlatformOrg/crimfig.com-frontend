'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { AuthBrandHeader } from '@/components/AuthBrandHeader';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

function AcceptInviteContent() {
  return (
    <div className="auth-centered-container">
      <Card className="glass-card" style={{ width: '100%', maxWidth: '440px', padding: '36px', textAlign: 'center' }}>
      <AuthBrandHeader
        title="Organisation Invitation"
        subtitle="Organizations and team invitations are coming soon."
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Alert style={{ textAlign: 'left', lineHeight: '1.5' }}>
          <span>Organizations and team invitations are not enabled yet and are coming soon.</span>
        </Alert>
        <Button asChild variant="outline" className="cf-auth-full-button">
          <Link href="/org">Back to Organization &amp; Team</Link>
        </Button>
        <Button asChild variant="ghost" className="cf-auth-full-button">
          <Link href="/dashboard">Go to Dashboard</Link>
        </Button>
      </div>
      </Card>
  </div>
  );
}


export default function AcceptInvitePage() {
  return (
    <Suspense fallback={<div style={{ color: 'var(--color-gray-400)' }}>Loading invitation...</div>}>
      <AcceptInviteContent />
    </Suspense>
  );
}
