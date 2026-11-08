import Link from 'next/link';
import { Card } from '../ui/card';

export function HelpSupportHub() {
  return (
    <section>
      <h1 className="cf-page-title">Help &amp; Support</h1>
      <Card className="cf-empty-state">
        <p>Support tickets are unavailable in this workspace.</p>
        <ul>
          <li><Link href="/campaigns">Check an ad campaign or review status</Link></li>
          <li><Link href="/billing">Find campaign escrow and wallet funding</Link></li>
        </ul>
      </Card>
    </section>
  );
}
