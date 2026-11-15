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
                <Badge variant="outline">App Registration</Badge>
              </div>
              <CardTitle style={{ fontSize: '16px', marginTop: '8px' }}>Setup an Ad Slot — On Mobile App</CardTitle>
              <CardDescription style={{ fontSize: '12px' }}>
                Register your iOS or Android app bundle ID to prepare mobile inventory.
              </CardDescription>
            </CardHeader>
            <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                <li>Register your app name, platform, and bundle/package identifier.</li>
                <li>Note: Live mobile SDK ad-serving is not yet enabled in delivery; app registration prepares your profile without fake metrics.</li>
              </ul>
              <Button asChild size="sm" variant="outline">
                <Link href="/promoter/mobile-apps">
                  Register Mobile App <ArrowRight size={14} />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* 3. Affiliate Link */}
          <Card>
            <CardHeader>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Share2 size={18} style={{ color: 'var(--color-crimson)' }} />
                <Badge variant="outline">Governance Gated</Badge>
              </div>
              <CardTitle style={{ fontSize: '16px', marginTop: '8px' }}>Get an Affiliate Link for Affiliate Ads</CardTitle>
              <CardDescription style={{ fontSize: '12px' }}>
                Understand how affiliate traffic validation, attribution, and payouts work before sharing links.
              </CardDescription>
            </CardHeader>
            <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                  <ShieldCheck size={14} style={{ color: 'var(--color-crimson)', marginTop: '2px', flexShrink: 0 }} />
                  <span>Only verified, non-duplicate, human interactions count toward earnings.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                  <Clock size={14} style={{ color: 'var(--color-crimson)', marginTop: '2px', flexShrink: 0 }} />
                  <span>Approved promoter earnings undergo a 72-hour clearance hold before becoming withdrawable.</span>
                </div>
                <p style={{ margin: '4px 0 0', fontSize: '11px', color: 'var(--text-muted)' }}>
                  Affiliate Links V2 link issuance and commission schedules remain gated until explicitly activated by governance approval.
                </p>
              </div>
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
