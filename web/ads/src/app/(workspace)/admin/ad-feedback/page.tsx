'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { apiData, arrayData } from '@/lib/api-data';

type Feedback = { id: string; rating: 'love' | 'like' | 'dislike'; receivedAt: string };
type Advert = {
  id: string;
  title: string | null;
  house: boolean;
  campaignId: string | null;
  campaignTitle: string | null;
  total: number;
  love: number;
  like: number;
  dislike: number;
};
const labels = { love: 'Love', like: 'Like', dislike: 'Dislike' };
const pageSize = 25;

function FeedbackList({ advert }: { advert: Advert }) {
  const [page, setPage] = useState(1);
  const path = `/api/v1/admin/ads/feedback?creativeId=${encodeURIComponent(advert.id)}&page=${page}`;
  return <FeedbackResults<Feedback> key={path} path={path} empty="No feedback for this ad in the last 30 days."
    page={page} onPage={setPage} render={rows => (
      <ul>{rows.map(row => <li key={row.id}>
        {labels[row.rating]} · <time dateTime={row.receivedAt}>{new Date(row.receivedAt).toLocaleString()}</time>
      </li>)}</ul>
    )} />;
}

function FeedbackResults<T>({ path, empty, page, onPage, render }: {
  path: string;
  empty: string;
  page: number;
  onPage: (page: number) => void;
  render: (rows: T[]) => React.ReactNode;
}) {
  const [rows, setRows] = useState<T[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    apiData<unknown>(path, { signal: controller.signal })
      .then(arrayData<T>)
      .then(data => { if (!controller.signal.aborted) setRows(data); })
      .catch((err: unknown) => {
        if (!controller.signal.aborted) setError(err instanceof Error ? err.message : 'Feedback could not be loaded.');
      });
    return () => controller.abort();
  }, [path, attempt]);

  if (error) return <div>
    <p role="alert">{error}</p>
    <Button type="button" variant="outline" onClick={() => { setError(null); setAttempt(value => value + 1); }}>Retry</Button>
  </div>;
  if (!rows) return <p role="status">Loading ad feedback…</p>;

  return <>
    {rows.length ? render(rows) : <p>{empty}</p>}
    {(page > 1 || rows.length === pageSize) && (
      <nav aria-label="Feedback pagination" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
        <Button type="button" variant="outline" disabled={page <= 1} onClick={() => onPage(page - 1)}>Previous</Button>
        <Button type="button" variant="outline" disabled={rows.length < pageSize} onClick={() => onPage(page + 1)}>Next</Button>
      </nav>
    )}
  </>;
}

export default function AdFeedbackPage() {
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string | null>(null);
  return <section>
    <h1>Ad feedback</h1>
    <p>Visitor ratings from the last 30 days, grouped by ad.</p>
    <FeedbackResults<Advert> key={page} path={`/api/v1/admin/ads/feedback?page=${page}`}
      empty="No ad feedback in the last 30 days." page={page} onPage={setPage} render={rows => (
        <div style={{ display: 'grid', gap: 12 }}>
          {rows.map(ad => <Card key={ad.id} style={{ padding: 16, overflowWrap: 'anywhere' }}>
            <h2>{ad.title || 'Untitled ad'}</h2>
            <p>{ad.house ? 'House ad' : 'Advertiser ad'} · <code>{ad.id}</code></p>
            {ad.campaignId && <p>Campaign {ad.campaignTitle || ad.campaignId}</p>}
            <p>{ad.total} ratings · Love {ad.love} · Like {ad.like} · Dislike {ad.dislike}</p>
            <Button type="button" variant="outline" aria-expanded={selected === ad.id}
              onClick={() => setSelected(current => current === ad.id ? null : ad.id)}>
              {selected === ad.id ? 'Hide ratings' : 'View ratings'}
            </Button>
            {selected === ad.id && <FeedbackList advert={ad} />}
          </Card>)}
        </div>
      )} />
  </section>;
}
