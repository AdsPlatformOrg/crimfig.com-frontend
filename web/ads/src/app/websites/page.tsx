'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function WebsitesRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/promoter/websites');
  }, [router]);

  return null;
}
