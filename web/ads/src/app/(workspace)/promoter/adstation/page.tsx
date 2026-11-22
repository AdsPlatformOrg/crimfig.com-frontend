'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AdStationWorkspace } from '../../../../components/console/adstation/AdStationWorkspace';
import { sessionFetch } from '../../../../lib/session';
import { Button } from '../../../../components/ui/button';
import styles from '../../../../components/console/adstation/AdStationWorkspace.module.css';

interface Website {
  id: string; domain: string; verificationStatus: string;
  deliveryPreference?: 'high' | 'medium' | 'low';
}

export default function PromoterAdStationPage() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [status, setStatus] = useState<'loading' | 'ready' | 'failed'>('loading');
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setStatus('loading');
    void sessionFetch('/api/v1/promoters/websites', { signal: controller.signal }).then(async response => {
      if (!response.ok) throw new Error('Websites unavailable');
      const body = await response.json();
      if (!Array.isArray(body.data)) throw new Error('Websites unavailable');
      if (controller.signal.aborted) return;
      setWebsites(body.data);
      setSelectedId(current => body.data.some((site: Website) => site.id === current) ? current : body.data[0]?.id ?? '');
      setStatus('ready');
    }).catch(() => { if (!controller.signal.aborted) setStatus('failed'); });
    return () => controller.abort();
  }, [attempt]);
  const selected = websites.find(site => site.id === selectedId);
  const setup = '/promoter/adstation/setup' + (selected ? '?websiteId=' + encodeURIComponent(selected.id) : '');
  return <div className={styles.workspace}>
    <header className={styles.header}>
      <h1 className="cf-page-title">AdStation Control Center</h1>
      {selected && <label className={styles.property}>Website
        <select value={selectedId} onChange={event => setSelectedId(event.target.value)}>
          {websites.map(site => <option value={site.id} key={site.id}>{site.domain}</option>)}
        </select>
      </label>}
      <Button asChild><Link href={setup}>Setup a Direct Ad Slot</Link></Button>
    </header>
    {status === 'loading' && <p role="status">Loading your websites…</p>}
    {status === 'failed' && <div role="alert"><p>Your websites could not be loaded.</p><Button onClick={() => setAttempt(value => value + 1)}>Try again</Button></div>}
    {status === 'ready' && !selected && <section className={styles.panel}><h2>Add your first website</h2><p>Register a website to manage its direct ad slots and deals.</p><Link href="/promoter/websites">Websites &amp; Ad Slots</Link></section>}
    {status === 'ready' && selected && <AdStationWorkspace key={selected.id} websiteId={selected.id} websiteDomain={selected.domain} initialPreference={selected.deliveryPreference} />}
  </div>;
}
