import type { Metadata } from 'next';
import Link from 'next/link';
import { AboutNavigation, AboutFooter } from '../about/AboutNavigation';

export const metadata: Metadata = {
  title: 'CrimFig Ads documentation',
  description: 'Get started with campaigns, website placements, and promoter links.',
};

export default function AdsDocsPage() {
  return (
    <div className="cf-marketing">
      <AboutNavigation />
      <main className="cf-marketing-section">
        <div className="cf-marketing-copy" style={{ textAlign: 'left' }}>
          <h1>Ads documentation</h1>
          <p>Get started as an advertiser or promoter.</p>
          <section style={{ marginTop: '2.5rem' }}>
            <h2>Advertisers</h2>
            <ol>
              <li>Open Advertiser Studio and create a campaign.</li>
              <li>Add your creatives, choose targeting, and set a campaign budget.</li>
              <li>Submit for review. Once the campaign runs, use the workspace to check delivery and spend.</li>
            </ol>
            <Link href="/dashboard">Open Advertiser Studio</Link>
          </section>
          <section style={{ marginTop: '2.5rem' }}>
            <h2>Promoters</h2>
            <p>Website publishers can register a site, verify ownership, and set up placements. Creators can use tracked links to share campaigns and review attributed activity.</p>
            <ul>
              <li><Link href="/websites">Website publishing guide</Link></li>
              <li><Link href="/individuals">Creator promotion guide</Link></li>
              <li><Link href="/promoter">Open Promoter Hub</Link></li>
            </ul>
          </section>
        </div>
      </main>
      <AboutFooter />
    </div>
  );
}
