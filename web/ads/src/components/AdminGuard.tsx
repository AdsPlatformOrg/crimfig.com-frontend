'use client';

import React, { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldAlert, ArrowLeft, RefreshCw } from 'lucide-react';
import { apiData } from '../lib/api-data';
import { Button } from './ui/button';

interface StaffStatusResponse {
  userId: string | null;
  isStaff: boolean;
  roles: string[];
}

export function AdminGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'authorized' | 'denied'>('loading');
  const [roles, setRoles] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function checkStaff() {
      try {
        setStatus('loading');
        setErrorMessage(null);
        const data = await apiData<StaffStatusResponse>('/api/v1/ecosystem/staff-status');
        if (!active) return;

        if (data && data.isStaff) {
          setRoles(data.roles || []);
          setStatus('authorized');
        } else {
          setStatus('denied');
        }
      } catch (err) {
        if (!active) return;
        setStatus('denied');
        setErrorMessage(err instanceof Error ? err.message : 'Unable to verify administrative authorization');
      }
    }

    void checkStaff();

    return () => {
      active = false;
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
        <div
          style={{
            maxWidth: '420px',
            width: '100%',
            padding: '32px',
            backgroundColor: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '16px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <RefreshCw
            style={{
              width: 32,
              height: 32,
              color: 'var(--color-crimson)',
              animation: 'spin 1s linear infinite',
            }}
          />
          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
            Verifying Staff Authorization
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
            Checking role grants against platform governance policy...
          </p>
        </div>
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
      <section
        style={{
          maxWidth: '520px',
          width: '100%',
          boxSizing: 'border-box',
          backgroundColor: 'var(--bg-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          padding: '40px 32px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          boxShadow: 'var(--shadow-md)',
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
            color: 'var(--color-crimson)',
          }}
        >
          <ShieldAlert style={{ width: 36, height: 36 }} />
        </div>

        <div>
          <span
            style={{
              display: 'inline-block',
              fontSize: '11px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              color: 'var(--color-crimson)',
              backgroundColor: 'rgba(212, 20, 58, 0.08)',
              padding: '4px 10px',
              borderRadius: '9999px',
              marginBottom: '8px',
            }}
          >
            HTTP 403 • Restricted Access
          </span>
          <h1
            style={{
              fontSize: '22px',
              fontWeight: 800,
              color: 'var(--text-primary)',
              margin: '4px 0 8px 0',
            }}
          >
            Staff Governance Portal
          </h1>
          <p
            style={{
              fontSize: '14px',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            This section is restricted strictly to verified CrimFig compliance, review, and system administration personnel. Your authenticated account does not currently hold an assigned staff grant.
          </p>
        </div>

        {errorMessage && (
          <div
            style={{
              fontSize: '12px',
              color: 'var(--color-danger)',
              backgroundColor: 'rgba(239, 68, 68, 0.08)',
              padding: '8px 14px',
              borderRadius: '8px',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            {errorMessage}
          </div>
        )}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            flexWrap: 'wrap',
            width: '100%',
            marginTop: '8px',
          }}
        >
          <Button
            type="button"
            variant="default"
            onClick={() => router.push('/dashboard')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 700,
            }}
          >
            <ArrowLeft style={{ width: 16, height: 16 }} />
            <span>Return to Advertiser Studio</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/promoter')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>Promoter Hub</span>
          </Button>
        </div>

        <div
          style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '16px',
            fontSize: '12px',
            color: 'var(--text-muted)',
            width: '100%',
          }}
        >
          Need compliance access? Contact platform operations via{' '}
          <Link
            href="/support"
            style={{
              color: 'var(--color-crimson)',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            Support & Governance
          </Link>
          .
        </div>
      </section>
    </main>
  );
}
