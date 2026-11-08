import { LandingNavbar } from './LandingNavbar';
import { LandingHero } from './LandingHero';
import { LandingFAQ } from './LandingFAQ';
import { LandingFooter } from './LandingFooter';

export function AuthLandingPage() {
  return (
    <div className="cf-marketing">
      <LandingNavbar />
      <main>
        <LandingHero />
        <LandingFAQ />
      </main>
      <LandingFooter />
    </div>
  );
}
