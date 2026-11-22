'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AdSizePolicy, type AdSizeMode } from '../../../../../components/console/AdSizePolicy';
import { Layers, ShieldCheck, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { apiData } from '../../../../../lib/api-data';
import { sessionFetch } from '../../../../../lib/session';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../../../components/ui/card';
import { Button } from '../../../../../components/ui/button';
import { Input } from '../../../../../components/ui/input';

interface PromoterWebsite {
  id: string;
  domain: string;
  verificationStatus: string;
  policyStatus: string;
}

export default function AdStationSetupDirectSlotPage() {
  const router = useRouter();
  const requestedWebsite = useSearchParams().get('websiteId');
  const lock = useRef(false);
  const attempt = useRef<{ signature: string; requestId: string } | null>(null);
  const [websites, setWebsites] = useState<PromoterWebsite[]>([]);
  const [selectedWebsiteId, setSelectedWebsiteId] = useState('');
  const [name, setName] = useState('');
  const [sizePolicy, setSizePolicy] = useState<AdSizeMode>('dynamic');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [publishMode, setPublishMode] = useState<'draft' | 'testing'>('testing');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    apiData<PromoterWebsite[]>('/api/v1/promoters/websites')
      .then((rows) => {
        const list = Array.isArray(rows) ? rows.filter(site => site.verificationStatus === 'verified' && site.policyStatus !== 'suspended') : [];
        setWebsites(list);
        if (list.length > 0) setSelectedWebsiteId(list.find(site => site.id === requestedWebsite)?.id ?? list[0].id);
      })
      .catch(() => setFeedback({ type: 'error', message: 'Verified websites could not be loaded.' }))
      .finally(() => setLoading(false));
  }, [requestedWebsite]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lock.current || !websites.some(site => site.id === selectedWebsiteId) || !name.trim() ||
        name.trim().length > 150 || (sizePolicy !== 'dynamic' && !selectedSizes.length)) return;
    lock.current = true;
    const body = {
      websiteId: selectedWebsiteId, name: name.trim(), slotType: 'direct', format: 'general',
      allowedAdTypes: ['image'], responsive: true, allowedPresetIds: sizePolicy === 'dynamic' ? [] : selectedSizes,
      lifecycleStatus: publishMode,
    };
    const signature = JSON.stringify(body);
    if (attempt.current?.signature !== signature) attempt.current = { signature, requestId: crypto.randomUUID() };
    try {
      setSubmitting(true);
      setFeedback(null);
      const res = await sessionFetch('/api/v1/publisher/slots/managed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...body, requestId: attempt.current.requestId }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || 'Failed to create Direct Ad Slot.');
      }
      const slot = data?.data;
      if (data?.status !== 'success' || typeof slot?.id !== 'string' || slot.websiteId !== selectedWebsiteId || slot.slotType !== 'direct') {
        throw new Error('Slot creation could not be confirmed.');
      }
      router.push('/promoter/websites/' + encodeURIComponent(selectedWebsiteId) + '/slots/' + encodeURIComponent(slot.id));
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.message || 'Failed to create Direct Ad Slot.' });
    } finally {
      lock.current = false;
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '760px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)' }}>
            AdStation — Setup a Direct Ad Slot
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
            Configure a direct-sold ad slot on one of your verified websites.
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/promoter/adstation">
            <ArrowLeft size={14} /> Back to AdStation Dashboard
          </Link>
        </Button>
      </div>

      <Card style={{ borderLeft: '4px solid var(--color-crimson)' }}>
        <CardContent style={{ padding: '16px 20px', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
            <ShieldCheck size={16} style={{ color: 'var(--color-crimson)' }} />
            Mandatory Dual Gate Before Going Live
          </div>
          A Direct Ad Slot may be drafted or published anytime, but it can only transition to <strong>Live</strong> when:
          <ol style={{ margin: '6px 0 0', paddingLeft: '18px' }}>
            <li>An active, verified, and operational <strong>CrimFig Ad Network</strong> integration exists on that <strong>same website</strong>, AND</li>
            <li><strong>Manual review approval</strong> has been granted on the slot&apos;s <strong>current material revision</strong>.</li>
          </ol>
        </CardContent>
      </Card>

      {feedback && (
        <Card style={{ borderColor: feedback.type === 'success' ? 'var(--color-success)' : 'var(--color-error)' }}>
          <CardContent style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
            {feedback.type === 'success' ? (
              <CheckCircle2 size={16} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
            ) : (
              <AlertCircle size={16} style={{ color: 'var(--color-error)', flexShrink: 0 }} />
            )}
            <span>{feedback.message}</span>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle style={{ fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={16} style={{ color: 'var(--color-crimson)' }} />
            Direct Ad Slot Configuration
          </CardTitle>
          <CardDescription style={{ fontSize: '12px' }}>
            Select a verified website and configure your Direct Ad Slot.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="cf-shimmer" style={{ height: '140px', borderRadius: '10px' }} />
          ) : websites.length === 0 ? (
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              No verified websites available.{' '}
              <Link href="/promoter/websites" style={{ color: 'var(--color-crimson)', fontWeight: 600 }}>
                Register and verify a website first
              </Link>
              .
            </div>
          ) : (
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label htmlFor="direct-slot-website" style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                  Target Website
                </label>
                <select
                  id="direct-slot-website"
                  value={selectedWebsiteId}
                  onChange={(e) => setSelectedWebsiteId(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-page)', color: 'var(--text-primary)', fontSize: '13px' }}
                >
                  {websites.map((site) => (
                    <option key={site.id} value={site.id}>
                      {site.domain} ({site.verificationStatus} / {site.policyStatus})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="direct-slot-name" style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                  Slot Name
                </label>
                <Input
                  id="direct-slot-name"
                  required
                  maxLength={150}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Homepage Header Sponsor Banner"
                />
              </div>

              <AdSizePolicy context="publisher" value={sizePolicy} selected={selectedSizes}
                onChange={(mode, sizes) => { setSizePolicy(mode); setSelectedSizes(sizes); }} />
              <p className="cf-muted">Images available. Text ads and video ads are coming soon.</p>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                  Initial State
                </label>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <Button
                    type="button"
                    size="sm"
                    variant={publishMode === 'testing' ? 'default' : 'outline'}
                    onClick={() => setPublishMode('testing')}
                  >
                    Publish for Review (Pending Review)
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={publishMode === 'draft' ? 'default' : 'outline'}
                    onClick={() => setPublishMode('draft')}
                  >
                    Save as Draft
                  </Button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', paddingTop: '4px' }}>
                <Button type="submit" disabled={submitting || !name.trim() || (sizePolicy !== 'dynamic' && !selectedSizes.length)}>
                  {submitting ? 'Creating...' : publishMode === 'draft' ? 'Save Draft' : 'Create & Submit for Review'}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

