'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdsDisputesPage() {
  const router = useRouter();
  useEffect(() => {
    const workspace = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('workspace') : null;
    router.replace(workspace ? `/support?workspace=${encodeURIComponent(workspace)}` : '/support');
  }, [router]);
  return null;
}
