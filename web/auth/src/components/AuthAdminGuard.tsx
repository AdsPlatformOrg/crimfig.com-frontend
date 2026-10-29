'use client';

import React, { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldAlert, ArrowLeft, RefreshCw } from 'lucide-react';
import { consentSession } from '../lib/consent';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button } from './ui';

interface StaffStatusResponse {
  userId: string | null;
  isStaff: boolean;
  roles: string[];
}

export function AuthAdminGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'authorized' | 'denied'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    async function checkStaff() {
      try {
        setStatus('loading');
        setErrorMessage(null);

        const res = await consentSession().request(new URL('/api/v1/auth/staff-status', window.location.origin), {
          headers: { 'Accept': 'application/json' },
          signal: controller.signal,
        });

        if (!active) return;

        if (res.ok) {
          const body = await res.json();
          const data = body?.data;
          if (!active) return;
          if (data?.isStaff === true && typeof data.userId === 'string' && Array.isArray(data.roles)) {
            setStatus('authorized');
            return;
          }
        }
        setStatus('denied');
      } catch (err) {
        if (!active) return;
        setStatus('denied');
        setErrorMessage(
          err instanceof Error ? err.message : 'Identity security privileges could not be verified'
        );
      }
    }

    void checkStaff();

    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  if (status === 'authorized') {
    return <>{children}</>;
  }

  if (status === 'loading') {
    return (
      <main
        style={{
          minHeight: '80vh',
          display: 'grid',
          placeItems: 'center',
          padding: '24px',
          fontFamily: "'Poppins', Arial, Helvetica, sans-serif",
        }}
      >
        <Card
          style={{
            maxWidth: '420px',
            width: '100%',
            padding: '32px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <RefreshCw
            style={{
              width: 32,
              height: 32,
              color: 'var(--color-crimson, #D4143A)',
              animation: 'spin 1s linear infinite',
            }}
          />
          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--text-primary, #0F172A)' }}>
            Verifying Identity Staff Authorization
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary, #475569)', margin: 0 }}>
            Verifying account administrator privileges and security tokens...
          </p>
        </Card>
      </main>
    );
  }

  // Denied Access State (HTTP 403 Equivalent)
  return (
    <main
      style={{
        minHeight: '85vh',
        display: 'grid',
        placeItems: 'center',
        padding: '24px',
        fontFamily: "'Poppins', Arial, Helvetica, sans-serif",
      }}
    >
      <Card
        style={{
          maxWidth: '520px',
          width: '100%',
          boxSizing: 'border-box',
          padding: '40px 32px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            backgroundColor: 'rgba(212, 20, 58, 0.1)',
            border: '1px solid rgba(212, 20, 58, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-crimson, #D4143A)',
          }}
        >
          <ShieldAlert size={36} />
        </div>

        <div>
          <span
            style={{
              display: 'inline-block',
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              padding: '4px 10px',
              borderRadius: '20px',
              backgroundColor: 'rgba(212, 20, 58, 0.12)',
              color: 'var(--color-crimson, #D4143A)',
              marginBottom: '10px',
            }}
          >
            HTTP 403 • Restricted Identity Directory
          </span>
          <h1
            style={{
              fontSize: '22px',
              fontWeight: 800,
              color: 'var(--text-primary, #0F172A)',
              margin: '0 0 8px 0',
            }}
          >
            Access Denied
          </h1>
          <p
            style={{
              fontSize: '14px',
              color: 'var(--text-secondary, #475569)',
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            User directory operations, security lockouts, and authentication audit logs are strictly restricted to authenticated platform administrators.
          </p>
          {errorMessage && (
            <p
              style={{
                fontSize: '12px',
                color: 'var(--color-crimson, #D4143A)',
                marginTop: '8px',
                fontFamily: 'monospace',
              }}
            >
              {errorMessage}
            </p>
          )}
        </div>

        <div
          style={{
            width: '100%',
            height: '1px',
            backgroundColor: 'var(--border-subtle, #E2E8F0)',
          }}
        />

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <Button
            onClick={() => router.push('/dashboard')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <ArrowLeft size={16} />
            <span>Return to Account Overview</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push('/login')}
          >
            Switch Account
          </Button>
        </div>
      </Card>
    </main>
  );
}
