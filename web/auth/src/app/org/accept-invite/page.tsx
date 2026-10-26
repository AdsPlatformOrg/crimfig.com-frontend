'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getApiUrl } from '@/lib/config';
import { AuthBrandHeader } from '@/components/AuthBrandHeader';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

function AcceptInviteContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleAccept = async () => {
    if (!token) {
      setError('Missing invitation token.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(getApiUrl('/api/v1/orgs/accept-invite'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('crimfig_at') || ''}`,
        },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to accept invitation');

      setSuccess(true);
      setMessage(data.message || 'You have successfully joined the organisation!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-centered-container">
      <Card className="glass-card" style={{ width: '100%', maxWidth: '440px', padding: '36px', textAlign: 'center' }}>
      <AuthBrandHeader
        title="Organisation Invitation"
        subtitle="You have been invited to join an organisation on CrimFig"
      />

      {error && (
        <Alert variant="destructive" style={{ marginBottom: '20px', textAlign: 'left' }}>
          <span>{error}</span>
        </Alert>
      )}

      {success ? (
        <div>
          <Alert variant="success" style={{ marginBottom: '24px', textAlign: 'left', lineHeight: '1.5' }}>
            <span>{message}</span>
          </Alert>
          <Button asChild className="cf-auth-full-button">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      ) : (
        <div>
          <Button
            onClick={handleAccept}
            disabled={loading || !token}
            style={{ width: '100%', marginBottom: '16px' }}
          >
            {loading ? 'Joining...' : 'Accept Invitation & Join'}
          </Button>
          <Button asChild variant="secondary" className="cf-auth-full-button">
            <Link href="/login">Sign In with Different Account</Link>
          </Button>
        </div>
      )}
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
