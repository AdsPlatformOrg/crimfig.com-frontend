'use client';

import React from 'react';
import Link from 'next/link';
import { Globe, Smartphone, Share2, ShieldCheck, Clock, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../../../components/ui/card';
import { Button } from '../../../../../components/ui/button';
import { Badge } from '../../../../../components/ui/badge';

export default function CrimFigAdNetworkGetStartedPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)' }}>
            CrimFig Ad Network — Get Started
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
            Choose how you want to monetize your audience with CrimFig Ad Network.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
          {/* 1. Website Ad Slot */}
          <Card>
            <CardHeader>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Globe size={18} style={{ color: 'var(--color-crimson)' }} />
                <Badge variant="secondary">Available</Badge>
              </div>
              <CardTitle style={{ fontSize: '16px', marginTop: '8px' }}>Setup an Ad Slot — On Website</CardTitle>
              <CardDescription style={{ fontSize: '12px' }}>
                Register your domain, verify ownership, wait for policy approval, and embed your CrimFig Ad Network tag.
              </CardDescription>
            </CardHeader>
            <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                <li>Verify domain ownership (DNS / meta tag / file).</li>
                <li>Create a Network or Consideration Ad Slot and place the script on your site.</li>
                <li>Active website network integration also unlocks AdStation Direct Ad Slots on that same site.</li>
              </ul>
              <Button asChild size="sm">
                <Link href="/promoter/websites">
                  Setup Website Ad Slot <ArrowRight size={14} />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* 2. Mobile App Ad Slot */}
          <Card>
            <CardHeader>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Smartphone size={18} style={{ color: 'var(--color-crimson)' }} />
                <Badge variant="outline">Coming Soon</Badge>
              </div>
              <CardTitle style={{ fontSize: '16px', marginTop: '8px' }}>Setup an Ad Slot — On Mobile App</CardTitle>
              <CardDescription style={{ fontSize: '12px' }}>
                Mobile app registration and supported SDK setup are planned.
              </CardDescription>
            </CardHeader>
            <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                <li>Registration is not available yet.</li>
                <li>Existing registered application information remains available in Mobile Apps.</li>
              </ul>

            </CardContent>
          </Card>

          {/* 3. Affiliate Link */}
          <Card>
            <CardHeader>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Share2 size={18} style={{ color: 'var(--color-crimson)' }} />
                <Badge variant="outline">Coming Soon</Badge>
              </div>
              <CardTitle style={{ fontSize: '16px', marginTop: '8px' }}>Get an Affiliate Link for Affiliate Ads</CardTitle>
              <CardDescription style={{ fontSize: '12px' }}>
                New affiliate link issuance is coming soon. You can still view existing approved links.
              </CardDescription>
            </CardHeader>
            <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <p>Read the link rules on the Affiliate Links page before sharing an approved link.</p>
              <Button asChild size="sm" variant="outline">
                <Link href="/promoter/individuals">
                  View Affiliate Link Status <ArrowRight size={14} />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
  );
}
