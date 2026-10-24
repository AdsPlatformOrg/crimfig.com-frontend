'use client';

import React, { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldAlert, ArrowLeft, RefreshCw } from 'lucide-react';
import { billingData } from '../lib/billing-api';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button } from './ui';

interface StaffStatusResponse {
  userId: string | null;
  isStaff: boolean;
  roles: string[];
}

export function BillingAdminGuard({ children }: { children: ReactNode }) {
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
        const data = await billingData<StaffStatusResponse>('/api/v1/ecosystem/staff-status');
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
        setErrorMessage(
          err instanceof Error ? err.message : 'Administrative credentials could not be verified'
        );
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
              color: 'var(--color-crimson)',
              animation: 'spin 1s linear infinite',
            }}
          />
          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
            Verifying Billing Staff Authorization
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
            Verifying staff roles and settlement management access...
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
            color: 'var(--color-crimson)',
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
              color: 'var(--color-crimson)',
              marginBottom: '10px',
            }}
          >
            HTTP 403 • Restricted Staff Console
          </span>
          <h1
            style={{
              fontSize: '22px',
              fontWeight: 800,
              color: 'var(--text-primary)',
              margin: '0 0 8px 0',
            }}
          >
            Access Denied
          </h1>
          <p
            style={{
              fontSize: '14px',
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            The Billing Administration Console is strictly restricted to verified staff operators, settlement officers, and financial audit managers.
          </p>
          {errorMessage && (
            <p
              style={{
                fontSize: '12px',
                color: 'var(--color-crimson)',
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
            backgroundColor: 'var(--border-subtle)',
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
            <span>Return to Billing Overview</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push('/support')}
          >
            Contact Billing Support
          </Button>
        </div>
      </Card>
    </main>
  );
}
