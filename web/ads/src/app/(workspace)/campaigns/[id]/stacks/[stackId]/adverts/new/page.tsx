'use client';

import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { AdSizePolicy, type AdSizeMode } from '@/components/console/AdSizePolicy';
import { ImagePreparation } from '@/components/console/ImagePreparation';
import { Button, Input } from '@/components/ui';
import { adsApi } from '@/lib/ads-api-client';
import type { CampaignDetails } from '@/lib/campaign-editor';
import { campaignsReturnHref, withCampaignReturnTo } from '@/lib/campaign-navigation';

export default function NewAdvertPage() {
  const { id, stackId } = useParams<{ id: string; stackId: string }>();
  const router = useRouter();
  const search = useSearchParams();
  const back = withCampaignReturnTo('/campaigns/' + encodeURIComponent(id) + '/stacks/' + encodeURIComponent(stackId), campaignsReturnHref(search.get('returnTo')));
  const [campaign, setCampaign] = useState<CampaignDetails | null>(null);
  const [error, setError] = useState('');
  const [destinationUrl, setDestinationUrl] = useState('');
  const [policy, setPolicy] = useState<AdSizeMode>('dynamic');
  const [presets, setPresets] = useState<string[]>([]);
  const [asset, setAsset] = useState<{ assetId: string; cdnUrl: string; adFormat: 'card' | 'banner'; width: number; height: number; bytes: number }>();
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const busy = useRef(false);
  const attempt = useRef<{ body: string; id: string } | null>(null);

  useEffect(() => {
    let active = true;
    setCampaign(null);
    setError('');
    adsApi().details(id).then(value => {
      if (active) setCampaign(value);
    }).catch(() => { if (active) setError('Could not load the campaign.'); });
    return () => { active = false; };
  }, [id, stackId]);

  const stack = campaign?.adStacks.find(item => item.id === stackId);
  const ready = Boolean(stack && campaign?.id === id && campaign.moderationStatus === 'approved' && ['active', 'paused'].includes(campaign.status));

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!campaign || !ready || !asset || uploading || busy.current || policy === 'legacy') return;
    busy.current = true;
    setSaving(true);
    setError('');
    try {
      const url = new URL(destinationUrl.trim());
      if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) throw new Error('Enter a valid website destination.');
      const body = {
        expectedRevision: campaign.contentRevision ?? 1, expectedUpdatedAt: campaign.updatedAt,
        adStackId: stackId, destinationUrl: url.href, adType: 'image' as const, adFormat: asset.adFormat,
        sizePolicy: policy, allowedPresetIds: presets, mediaAssetId: asset.assetId,
      };
      const signature = JSON.stringify(body);
      if (attempt.current?.body !== signature) attempt.current = { body: signature, id: crypto.randomUUID() };
      const result = await adsApi().liveCreativeAddition(id, { ...body, requestId: attempt.current.id });
      if (!result.id) throw new Error('Advert submission could not be confirmed.');
      router.replace(back);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Advert submission could not be confirmed.');
    } finally {
      busy.current = false;
      setSaving(false);
    }
  }

  return <section className="cf-section" style={{ maxWidth: 900, marginInline: 'auto' }}>
    <Link href={back}>Back to stack</Link>
    <h1 className="cf-page-title">Add an Advert</h1>
    {!campaign && !error && <p role="status">Loading campaign…</p>}
    {campaign && !ready && <p role="status">This stack is unavailable for new adverts.</p>}
    {ready && <form onSubmit={submit} className="cf-section cf-surface" style={{ padding: 16 }}>
      <fieldset className="cf-section" style={{ border: 0, padding: 0, margin: 0 }}>
        <legend className="cf-form-label">Advert type</legend>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <Button type="button" variant="default" aria-pressed="true">Image Ads — Available</Button>
          <Button type="button" variant="outline" disabled aria-disabled="true">Text Ads — Coming Soon</Button>
          <Button type="button" variant="outline" disabled aria-disabled="true">Video Ads — Coming Soon</Button>
        </div>
      </fieldset>
      <fieldset disabled={saving} className="cf-section" style={{ border: 0, padding: 0, margin: 0 }}>
        <ImagePreparation approvedSizesOnly currentUrl={asset?.cdnUrl} currentSpecs={asset}
          onBusyChange={setUploading} onUploaded={setAsset} />
        <AdSizePolicy value={policy} selected={presets} image={asset} onChange={(mode, ids) => { setPolicy(mode); setPresets(ids); }} />
        <label className="cf-form-group cf-form-label">Destination URL
          <Input type="url" value={destinationUrl} onChange={event => setDestinationUrl(event.target.value)} required />
        </label>
        <p className="cf-muted">New adverts need Review 1 and Review 2 before they can serve.</p>
        <Button type="submit" disabled={saving || uploading || !asset || (policy !== 'dynamic' && presets.length === 0)} style={{ alignSelf: 'flex-start' }}>
          {saving ? 'Submitting…' : 'Submit new Advert for review'}
        </Button>
      </fieldset>
    </form>}
    {error && <p role="alert">{error}</p>}
  </section>;
}
