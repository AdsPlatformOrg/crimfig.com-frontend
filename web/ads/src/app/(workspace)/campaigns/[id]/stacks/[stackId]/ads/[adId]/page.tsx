'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { CampaignBreadcrumbs } from '@/components/console/CampaignBreadcrumbs';
import { campaignsReturnHref, withCampaignReturnTo } from '@/lib/campaign-navigation';
import { MediaPreview } from '@/components/MediaPreview';
import { Button, Card } from '@/components/ui';
import { adsApi } from '@/lib/ads-api-client';
import type { CampaignDetails } from '@/lib/campaign-editor';

export default function CampaignAdDetails() {
  const { id, stackId, adId } = useParams<{ id: string; stackId: string; adId: string }>();
  const searchParams = useSearchParams();
  const returnTo = campaignsReturnHref(searchParams.get('returnTo'));
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{ key: string; campaign?: CampaignDetails; error?: string }>();
  const key = JSON.stringify([id, stackId, adId, attempt]);

  useEffect(() => {
    let current = true;
    void adsApi().details(id).then(
      campaign => { if (current) setResult({ key, campaign }); },
      error => { if (current) setResult({ key, error: error instanceof Error ? error.message : 'Could not load this ad.' }); },
    );
    return () => { current = false; };
  }, [id, key]);

  if (result?.key !== key) return <p role="status">Loading ad…</p>;
  if (result.error) return <div><p role="alert">{result.error}</p><Button onClick={() => setAttempt(value => value + 1)}>Retry</Button></div>;

  const campaign = result.campaign;
  const stack = campaign?.adStacks.find(item => item.id === stackId);
  const ad = campaign?.creatives.find(item => item.id === adId && item.adStackId === stackId);
  if (!campaign || !stack || !ad) return <p role="alert">Ad not found in this stack.</p>;

  const title = ad.headline || 'Image ad';
  return (
    <section>
      <CampaignBreadcrumbs items={[
        { label: campaign.title, href: withCampaignReturnTo(`/campaigns/${id}`, returnTo) },
        { label: stack.name, href: withCampaignReturnTo(`/campaigns/${id}/stacks/${stackId}`, returnTo) },
        { label: title },
      ]} campaignsHref={returnTo} />
      <h1 className="cf-page-title">{title}</h1>
      <Card>
        {ad.imageUrl && <MediaPreview source={ad.imageUrl} />}
        {ad.bodyText && <p>{ad.bodyText}</p>}
        <dl>
          <dt>Ad type</dt><dd>{ad.adType}</dd>
          <dt>Review status</dt><dd>{ad.reviewStatus ?? 'Unavailable'}</dd>
          <dt>Destination</dt><dd>{ad.destinationUrl || 'Unavailable'}</dd>
        </dl>
      </Card>
    </section>
  );
}
