'use client';

import Image from 'next/image';
import { Button } from '../ui/button';

export function LandingHero({ onLaunchConsole }: { onLaunchConsole: () => void }) {
  return (
    <section id="features" className="cf-marketing-section">
      <div className="cf-marketing-frame">
        <div className="cf-marketing-copy">
          <h1>CrimFig Billing.</h1>
          <p>Wallet funding, campaign escrow, and transaction history.</p>
          <div className="cf-marketing-actions">
            <Button size="lg" onClick={onLaunchConsole}>Open Billing</Button>
          </div>
          <p id="security">Bank withdrawals are currently unavailable. Review the provider-confirmed quote before funding.</p>
        </div>
        <div className="cf-marketing-visual cf-marketing-visual--compact">
          <Image src="/img/marketing/lagos-aerial.webp" alt="Aerial view of Lagos streets and buildings" fill sizes="(min-width: 56rem) 832px, calc(100vw - 40px)" priority />
        </div>
      </div>
    </section>
  );
}
