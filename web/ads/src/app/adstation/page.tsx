'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdstationRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/promoter/adstation');
  }, [router]);

  return null;
}
