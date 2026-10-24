'use client';

import React, { useState, useEffect } from 'react';
import { SessionGate } from '../../components/SessionGate';
import { AdStationWorkspace } from '../../components/console/adstation/AdStationWorkspace';
import { DashboardSidebar, type NavGroup } from '../../components/DashboardSidebar';
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

  const navGroups: NavGroup[] = [
    {
      title: 'Promoter Hub',
      items: [
        { id: 'websites', label: 'Websites & Embeds', icon: Globe, href: '/websites' },
        { id: 'adstation', label: 'AdStation Direct Deals', icon: Layers, href: '/adstation' },
      ],
    },
  ];

  return (
    <SessionGate>
      <div className="flex h-screen bg-[#F5F6F8] dark:bg-[#121624] text-gray-900 dark:text-white overflow-hidden">
        <DashboardSidebar
          app="ads"
          groups={navGroups}
          activeId="adstation"
          onSelect={() => {}}
          isCollapsed={false}
        />

        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Header */}
          <header className="h-16 px-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#171B2A] flex items-center justify-between sticky top-0 z-20">
            <div className="flex items-center gap-3">
              <Link
                href="/websites"
                className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-500"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <div>
                <h1 className="text-base font-bold">AdStation Workspace</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Direct Deals & Consideration Network Integration (PLAN-0018)
                </p>
              </div>
            </div>

            {/* Website Selector */}
            {websites.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-medium">Domain:</span>
                <select
                  value={selectedWebsite?.id || ''}
                  onChange={(e) => {
                    const found = websites.find((w) => w.id === e.target.value);
                    if (found) setSelectedWebsite(found);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  {websites.map((site) => (
                    <option key={site.id} value={site.id}>
                      {site.domain}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </header>

          <main className="p-6 max-w-7xl mx-auto w-full space-y-6">
            {isLoading ? (
              <div className="p-12 text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
              </div>
            ) : websites.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-[#1E2337] border border-dashed border-gray-300 dark:border-gray-800 rounded-xl">
                <Globe className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">No Registered Websites</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm mx-auto">
                  You need to register and verify at least one website domain in Promoter Hub before launching AdStation.
                </p>
                <Link
                  href="/websites"
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#D4143A] text-white text-xs font-semibold hover:bg-[#A80F32]"
                >
                  Register Website
                </Link>
              </div>
            ) : (
              <AdStationWorkspace
                websiteId={selectedWebsite?.id}
                websiteDomain={selectedWebsite?.domain}
              />
            )}
          </main>
        </div>
      </div>
    </SessionGate>
  );
}
