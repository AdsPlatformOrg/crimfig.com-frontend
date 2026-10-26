'use client';

import React from 'react';
import Link from 'next/link';
import { AuthConsoleShell } from '../../components/AuthConsoleShell';
import { Users, UserPlus, ShieldCheck, Mail } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';

export default function OrganizationPage() {
  return (
    <AuthConsoleShell activePath="/org">
      <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
        <div>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-crimson)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Team &amp; Governance
          </span>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0 8px' }}>
            Organization &amp; Team Members
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
            Invite team members, assign fine-grained RBAC roles, and manage shared advertiser workspaces.
          </p>
        </div>

        {/* Current Org Status */}
        <Card style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(212, 20, 58, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-crimson)' }}>
                <Users size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Primary Workspace</h3>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>1 Active Seat</span>
              </div>
            </div>
            <Button asChild size="sm">
              <Link href="/org/accept-invite">
                <UserPlus size={14} />
                <span>Invite Teammate</span>
              </Link>
            </Button>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
            Collaborate on advertiser campaigns, creative reviews, and publisher properties with role-based permissions.
          </p>
        </Card>
      </div>
    </AuthConsoleShell>
  );
}
