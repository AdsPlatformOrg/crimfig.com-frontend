import { LandingNavbar } from './LandingNavbar';
import { LandingHero } from './LandingHero';
import { LandingFooter } from './LandingFooter';

export function AuthLandingPage() {
  return (
    <div className="cf-marketing">
      <LandingNavbar />
      <main>
        <LandingHero />
      </main>
      <LandingFooter />
    </div>
  );
}
