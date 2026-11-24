'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AuthBrandHeader } from '@/components/AuthBrandHeader';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

function ConsentContent() {
  const searchParams = useSearchParams();
  const clientId = searchParams.get('client_id') || 'Ecosystem App';

  return (
    <div className="auth-centered-container" style={{ background: 'var(--bg-page)', color: 'var(--text-primary)' }}>
      <Card className="glass-card" style={{ width: '100%', maxWidth: '440px', padding: '36px', background: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)' }}>
      <AuthBrandHeader
        title={`Authorize ${clientId}`}
        subtitle="OAuth 2.0 and application authorization are coming soon."
      />

      <Alert style={{ marginBottom: '20px' }}>
        <AlertDescription>
          OAuth 2.0 / PKCE authorization and third-party application consent are not enabled yet and are coming soon.
        </AlertDescription>
      </Alert>

      <div style={{ display: 'flex', gap: '12px' }}>
        <Button asChild variant="outline" style={{ flex: 1, color: 'var(--text-primary)', borderColor: 'var(--border-subtle)' }}>
          <Link href="/">Back to Home</Link>
        </Button>
        <Button
          type="button"
          disabled
          aria-disabled="true"
          style={{ flex: 1 }}
        >
          Coming Soon
        </Button>
      </div>
      </Card>
  </div>
  );
}

export default function ConsentPage() {
  return (
    <Suspense fallback={<div style={{ color: 'var(--color-gray-400)' }}>Loading consent...</div>}>
      <ConsentContent />
    </Suspense>
  );
}
