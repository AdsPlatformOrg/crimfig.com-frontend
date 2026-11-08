import Link from 'next/link';
import { Card } from '../ui/card';

export function NotificationCenter() {
  return (
    <section>
      <h1 className="cf-page-title">Notifications</h1>
      <Card className="cf-empty-state">
        <p>Account notifications are unavailable here.</p>
        <Link href="/campaigns">Check campaign status</Link>
      </Card>
    </section>
  );
}
