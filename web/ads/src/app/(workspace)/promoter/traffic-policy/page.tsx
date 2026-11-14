'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function PromoterTrafficPolicyPage() {
  return (
    <div style={{ padding: '24px 0', display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '820px' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>Publisher Traffic Quality Policy</h1>
          <Badge variant="outline">Active Policy</Badge>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '6px 0 0 0' }}>
          How CrimFig distinguishes genuine audience interest from coordinated invalid click activity.
        </p>
      </div>

      <Card style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 700, margin: 0 }}>Permitted Website Promotion</h2>
        <p style={{ fontSize: '13px', margin: 0, lineHeight: 1.6 }}>
          You are free to share your website articles and links on WhatsApp, Telegram, Facebook, Instagram, X, and search engines.
          Arriving from social media or messaging apps—or with a missing browser referrer—never automatically invalidates a click.
        </p>
      </Card>

      <Card style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 700, margin: 0 }}>Prohibited Coordinated Activity</h2>
        <ul style={{ fontSize: '13px', margin: 0, paddingLeft: '18px', lineHeight: 1.7 }}>
          <li>Asking friends, relatives, employees, or followers to click advertisements merely to support your site.</li>
          <li>Paying, rewarding, or incentivizing people to generate ad clicks without an authorized program.</li>
          <li>Organizing click exchanges, engagement groups, or traffic farms across separate devices or IP addresses.</li>
          <li>Artificially inflating impressions through repeated refreshing or manipulated ad placements.</li>
        </ul>
      </Card>
    </div>
  );
}

