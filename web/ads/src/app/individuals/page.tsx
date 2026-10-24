'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function IndividualsRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/promoter/individuals');
  }, [router]);

  return null;
}
