'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LandingPage } from '../components/landing/LandingPage';

export default function AdsRootPage() {
  const router = useRouter();

  // Backward compatibility: handle legacy ?view=console queries gracefully
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('view') === 'console') {
      router.replace('/dashboard');
    }
  }, [router]);

  return (
    <LandingPage
      onLaunchConsole={(role, section) => {
        if (role === 'promoter') {
          if (section === 'individuals') router.push('/promoter/individuals');
          else if (section === 'mobile_apps') router.push('/promoter/mobile-apps');
          else router.push('/promoter');
        } else {
          router.push('/dashboard');
        }
      }}
    />
  );
}
