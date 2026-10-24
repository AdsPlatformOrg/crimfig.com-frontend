'use client';

import React, { useState, useEffect } from 'react';
import { SessionGate } from '../../components/SessionGate';
import { AdsConsoleShell } from '../../components/console/AdsConsoleShell';
import { AdStationWorkspace } from '../../components/console/adstation/AdStationWorkspace';
import { sessionFetch } from '../../lib/session';
import { Layers, Globe, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface PromoterWebsite {
  id: string;
  domain: string;
  url: string;
  verificationStatus: string;
}

export default function AdStationPage() {
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
      const data = await res.json();
      if (data.status === 'success') {
        const sites = data.data || [];
        setWebsites(sites);
        if (sites.length > 0) {
          setSelectedWebsite(sites[0]);
        }
      }
    } catch {
      // Keep UI clean
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SessionGate>
      <AdsConsoleShell role="promoter" activeNavId="adstation">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Header & Website Selector */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                AdStation Workspace
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                Direct Deals (100% to publisher) &amp; Consideration Network Integration (PLAN-0018)
              </p>
            </div>

            {websites.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Active Domain:</span>
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
                    fontSize: '12px',
                    fontWeight: 700,
                  }}
                >
                  {websites.map((site) => (
                    <option key={site.id} value={site.id}>
                      {site.domain}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {isLoading ? (
            <div style={{ padding: '48px', textAlign: 'center' }}>
              <Loader2 style={{ width: 32, height: 32, margin: '0 auto', animation: 'spin 1s linear infinite', color: 'var(--text-muted)' }} />
            </div>
          ) : websites.length === 0 ? (
            <div
              className="theme-card"
              style={{
                padding: '48px 24px',
                textAlign: 'center',
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
                href="/websites"
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
