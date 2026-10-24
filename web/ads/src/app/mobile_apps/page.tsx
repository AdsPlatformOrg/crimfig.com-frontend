'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MobileAppsRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/promoter/mobile-apps');
  }, [router]);

  return null;
}
