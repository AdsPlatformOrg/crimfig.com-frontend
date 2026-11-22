'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';

export function ConversionsTab() {
  return (
    <section style={{ maxWidth: '760px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Conversion Tracking
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px', marginBottom: 0 }}>
            Pixel, S2S postback, and CPA conversion attribution.
          </p>
        </div>
        <Badge variant="secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Clock size={13} /> Coming soon
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle style={{ fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} style={{ color: 'var(--color-crimson)' }} />
            Conversion Tracking — Coming soon
          </CardTitle>
          <CardDescription style={{ fontSize: '13px' }}>
            Browser pixels, S2S conversion postbacks, API key issuance, and CPA billing are currently paused while conversion attribution prepares for launch.
          </CardDescription>
        </CardHeader>
        <CardContent style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          <Button asChild variant="outline" size="sm">
            <Link href="/campaigns">My Ad Campaigns</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/reports">View Reports</Link>
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
