'use client';
import { useEffect, useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { SessionGate } from './SessionGate';
import { AuthConsoleShell } from './AuthConsoleShell';
import { consentSession } from '../lib/consent';

export function ProtectedWorkspace({ children }: { children: ReactNode }) {
  const path = usePathname();
  const [isStaff, setIsStaff] = useState(false);

  useEffect(() => {
    let active = true;
    void consentSession()
      .request(new URL('/api/v1/auth/staff-status', window.location.origin), {
        headers: { Accept: 'application/json' },
      })
      .then(async (res) => {
        if (!active || !res.ok) return;
        const body = await res.json();
        if (active && body?.data?.isStaff === true) {
          setIsStaff(true);
        }
      })
      .catch(() => {
        /* Fail closed: non-staff by default */
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <SessionGate>
      <AuthConsoleShell activePath={path} isStaff={isStaff}>
        {children}
      </AuthConsoleShell>
    </SessionGate>
  );
}
