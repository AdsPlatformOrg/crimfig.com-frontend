'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui/button';
import { useSessionSnapshot } from '../SessionGate';
import { publicHeaderActions } from '../../lib/public-header';

export function LandingHero() {
  const actions = publicHeaderActions(useSessionSnapshot());
  return (
    <section className="cf-marketing-section">
      <div className="cf-marketing-frame">
        <div className="cf-marketing-copy">
          <h1>Your CrimFig account.</h1>
          <p>One account for CrimFig services.</p>
          <div className="cf-marketing-actions">
            {actions.map(({ href, label, primary }) => (
              <Button key={href} asChild size="lg" variant={primary ? 'default' : 'outline'}>
                <Link href={href}>{label}</Link>
              </Button>
            ))}
          </div>
        </div>
        <div className="cf-marketing-visual cf-marketing-visual--compact">
          <Image src="/img/marketing/lagos-sunset.webp" alt="Lagos skyline at sunset reflected in the water" fill sizes="(min-width: 56rem) 832px, calc(100vw - 40px)" priority />
        </div>
      </div>
    </section>
  );
}
