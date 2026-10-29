'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { consentSession } from '../lib/consent';

/** One nonblocking discovery per root lifetime; menus never initiate refreshes. */
export function PublicSessionDiscovery() {
  const pathname = usePathname();
  const attempted = useRef(false);
  useEffect(() => {
    if (pathname !== '/' || attempted.current) return;
    const session = consentSession();
    if (session.getSnapshot().status !== 'idle') return;
    attempted.current = true;
    void session.bootstrap().catch(() => { /* Public content remains available. */ });
  }, [pathname]);
  return null;
}
