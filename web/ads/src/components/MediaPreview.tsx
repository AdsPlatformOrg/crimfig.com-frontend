'use client';

import { useEffect, useState } from 'react';
import { sessionFetch } from '../lib/session';
import { previewPath } from '../lib/media-preview';

/** Blob URL lives only for this mounted preview and is revoked on source change/unmount. */
export function MediaPreview({ source, mode = 'owner' }: { source: string; mode?: 'owner' | 'review' }) {
  const [preview, setPreview] = useState<{ source: string; url: string; video: boolean } | null>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    const controller = new AbortController();
    let objectUrl: string | undefined;
    setPreview(null); setError('');
    void (async () => {
      try {
        const path = previewPath(source, window.location.origin, mode);
        const response = await sessionFetch(path, { signal: controller.signal });
        if (!response.ok) throw new Error(response.status === 403 ? 'You do not have permission to preview this asset.' : 'This media preview is unavailable.');
        const blob = await response.blob();
        if (!/^(image\/(png|jpeg|gif|webp|avif)|video\/(mp4|webm|ogg))$/i.test(blob.type)) throw new Error('Unsupported preview format.');
        if (controller.signal.aborted) return;
        objectUrl = URL.createObjectURL(blob);
        setPreview({ source, url: objectUrl, video: blob.type.startsWith('video/') });
      } catch (err) {
        if (!controller.signal.aborted) setError(err instanceof Error ? err.message : 'Media preview unavailable.');
      }
    })();
    return () => { controller.abort(); if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [source, mode]);
  if (error) return <p role="status" style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{error}</p>;
  if (!preview || preview.source !== source) return <p role="status">Loading preview…</p>;
  return preview.video
    ? (
      <video
        src={preview.url}
        controls
        controlsList="nodownload noplaybackrate"
        preload="metadata"
        playsInline
        aria-label="Creative video preview"
        {...({ disablePictureInPicture: '', disableRemotePlayback: '' } as any)}
        style={{ maxWidth: '100%', maxHeight: 240, background: '#0b1020' }}
      >
        Your browser cannot play this video.
      </video>
    )
    // next/image cannot optimize authenticated in-memory blob URLs.
    // eslint-disable-next-line @next/next/no-img-element
    : <img src={preview.url} alt="Creative media preview" style={{ maxWidth: '100%', maxHeight: 240, objectFit: 'contain' }} />;
}
