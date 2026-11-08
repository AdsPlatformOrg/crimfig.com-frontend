'use client';

import { useEffect, useRef, type ReactNode } from 'react';

export function MarketingReveal({ children, className }: { children: ReactNode; className?: string }) {
  const main = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!main.current || !('IntersectionObserver' in window)) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const animations: Animation[] = [];
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        if (reducedMotion.matches) continue;
        Array.from(entry.target.children).forEach((element, index) => {
          animations.push(element.animate(
            [
              { opacity: 0.35, transform: 'translateY(24px)' },
              { opacity: 1, transform: 'translateY(0)' },
            ],
            { duration: 560, delay: index * 100, fill: 'backwards', easing: 'cubic-bezier(.2,.7,.25,1)' },
          ));
        });
      }
    }, { threshold: 0.12 });
    main.current.querySelectorAll('[data-ads-reveal]').forEach((section) => observer.observe(section));
    const stopMotion = () => { if (reducedMotion.matches) animations.forEach((animation) => animation.cancel()); };
    reducedMotion.addEventListener('change', stopMotion);
    return () => {
      observer.disconnect();
      reducedMotion.removeEventListener('change', stopMotion);
      animations.forEach((animation) => animation.cancel());
    };
  }, []);

  return <main ref={main} className={className}>{children}</main>;
}
