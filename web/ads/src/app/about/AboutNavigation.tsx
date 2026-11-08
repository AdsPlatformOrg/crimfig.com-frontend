'use client';

import { useRouter } from 'next/navigation';
import { LandingNavbar } from '../../components/landing/LandingNavbar';
import { LandingFooter } from '../../components/landing/LandingFooter';

export function AboutNavigation() {
  const router = useRouter();
  return <LandingNavbar onLaunchConsole={() => router.push('/dashboard')} />;
}

export function AboutFooter() {
  const router = useRouter();
  return <LandingFooter onLaunchConsole={(role) => router.push(role === 'promoter' ? '/promoter' : '/dashboard')} />;
}
