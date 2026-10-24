'use client';

import React, { useState, useEffect } from 'react';
import { SessionGate } from '../../../components/SessionGate';
import { AdsConsoleShell } from '../../../components/console/AdsConsoleShell';
import { AdStationWorkspace } from '../../../components/console/adstation/AdStationWorkspace';
import { sessionFetch } from '../../../lib/session';
import { Layers, Globe, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface PromoterWebsite {
  id: string;
  domain: string;
  url: string;
  verificationStatus: string;
}

export default function PromoterAdStationPage() {
  const [websites, setWebsites] = useState<PromoterWebsite[]>([]);
  const [selectedWebsite, setSelectedWebsite] = useState<PromoterWebsite | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadWebsites();
  }, []);

  const loadWebsites = async () => {
    try {
      setIsLoading(true);
      const res = await sessionFetch('/api/v1/promoters/websites');
      if (res.ok) {
        const json = await res.json();
        const list = Array.isArray(json?.data) ? json.data : [];
        setWebsites(list);
        if (list.length > 0 && !selectedWebsite) {
          setSelectedWebsite(list[0]);
        }
      }
    } catch {
      // Fallback: empty list
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SessionGate>
      <AdsConsoleShell role="promoter" activeNavId="adstation">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Header Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-crimson)', fontSize: '13px', fontWeight: 700 }}>
                <Layers style={{ width: 16, height: 16 }} />
                <span>AdStation • Direct Deals & Placements</span>
              </div>
              <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0 0 0' }}>
                Website Direct Placements
              </h1>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                Manage 1-to-1 advertiser direct campaigns, custom delivery modes, consideration placements, and slot health.
              </p>
            </div>

            {/* Website Selector Dropdown */}
            {websites.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Globe style={{ width: 16, height: 16, color: 'var(--text-muted)' }} />
                <select
                  value={selectedWebsite?.id || ''}
                  onChange={(e) => {
                    const found = websites.find((w) => w.id === e.target.value);
                    if (found) setSelectedWebsite(found);
                  }}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-surface)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    fontWeight: 600,
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {websites.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.domain} ({w.verificationStatus})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Body Content */}
          {isLoading ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '64px',
                backgroundColor: 'var(--bg-elevated)',
                borderRadius: '16px',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <Loader2 style={{ width: 28, height: 28, color: 'var(--color-crimson)', animation: 'spin 1s linear infinite' }} />
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '12px' }}>Loading registered websites...</p>
            </div>
          ) : websites.length === 0 ? (
            <div
              style={{
                padding: '48px 24px',
                textAlign: 'center',
                backgroundColor: 'var(--bg-elevated)',
                borderRadius: '16px',
                border: '1px dashed var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <Globe style={{ width: 40, height: 40, color: 'var(--text-muted)' }} />
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                No Registered Websites
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '400px', margin: 0 }}>
                You need to register and verify at least one website domain in Promoter Hub before configuring AdStation slots.
              </p>
              <Link
                href="/promoter/websites"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '8px 18px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--color-crimson)',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 700,
                  textDecoration: 'none',
                  marginTop: '8px',
                }}
              >
                Register Website First
              </Link>
            </div>
          ) : (
            <AdStationWorkspace
              websiteId={selectedWebsite?.id}
              websiteDomain={selectedWebsite?.domain}
            />
          )}
        </div>
      </AdsConsoleShell>
    </SessionGate>
  );
}
