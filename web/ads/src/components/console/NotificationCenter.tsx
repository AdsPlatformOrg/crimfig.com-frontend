'use client';

import React from 'react';
import { Bell, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

export function NotificationCenter() {
  return (
    <section style={{ maxWidth: '760px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Notifications
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px', marginBottom: 0 }}>
            Account, campaign review, website approval, and billing updates.
          </p>
        </div>
        <Badge variant="secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Clock size={13} /> Coming soon
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle style={{ fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={18} style={{ color: 'var(--color-crimson)' }} />
            In-App Notifications — Coming soon
          </CardTitle>
          <CardDescription style={{ fontSize: '13px' }}>
            Your in-app notification inbox is not yet enabled. Check campaign status, website reviews, or wallet transactions directly in your workspace.
          </CardDescription>
        </CardHeader>
        <CardContent />
      </Card>
    </section>
  );
}
