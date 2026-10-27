'use client';
import { useDialog } from '../../lib/use-dialog';
import { MediaPreview } from '../MediaPreview';
import { sessionFetch } from '../../lib/session';

import React, { useEffect, useState } from 'react';
import { X, AlertCircle, RefreshCw, CheckCircle2, Type, Image as ImageIcon, Video, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { loadCreationCapabilities, type AdType } from '../../lib/campaigns-api';

interface CreativeToReplace {
  id: string;
  campaignId: string;
  headline?: string | null;
  bodyText?: string | null;
  ctaText?: string | null;
  destinationUrl: string;
  imageUrl?: string;
  videoUrl?: string;
  adType?: AdType;
  adFormat?: 'banner' | 'card' | 'video' | 'interstitial';
  mediaFormat?: 'image' | 'gif' | 'video';
  mediaAssetId?: string;
  rejectionReason?: string;
}

interface ReplaceCreativeModalProps {
  isOpen: boolean;
  onClose: () => void;
  creative: CreativeToReplace | null;
  onReplaceSuccess: (updated: any) => void;
}

export function ReplaceCreativeModal({
  isOpen,
  onClose,
  creative,
  onReplaceSuccess,
}: ReplaceCreativeModalProps) {
  const [headline, setHeadline] = useState(creative?.headline || '');
  const [bodyText, setBodyText] = useState(creative?.bodyText || '');
  const [ctaText, setCtaText] = useState(creative?.ctaText || '');
  const [destinationUrl, setDestinationUrl] = useState(creative?.destinationUrl || '');
  const [adType, setAdType] = useState<AdType>(
    creative?.adType || (creative?.videoUrl ? 'video' : creative?.imageUrl ? 'image' : 'text'),
  );
  const [mediaAssetId, setMediaAssetId] = useState<string | undefined>(creative?.mediaAssetId);
  const [mediaUrl, setMediaUrl] = useState(creative?.videoUrl || creative?.imageUrl || '');
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fieldId = React.useId();
  const panel = useDialog(isOpen && Boolean(creative), onClose);

  useEffect(() => {
    let active = true;
    void loadCreationCapabilities().then((caps) => { if (active) setVideoEnabled(caps.videoAuthoringEnabled); }).catch(() => {});
    return () => { active = false; };
  }, []);

  async function uploadReplacement(file: File | undefined) {
    if (!file) return;
    const maxBytes = adType === 'video' ? 20 * 1024 * 1024 : 750 * 1024;
    if (file.size > maxBytes) {
      setError(`This file exceeds the ${adType === 'video' ? '20 MB video' : '750 KB image'} limit.`);
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const body = new FormData();
      body.append('file', file);
      const response = await sessionFetch('/api/v1/uploads/direct', { method: 'POST', body });
      if (!response.ok) throw new Error('The upload could not be confirmed.');
      const json = await response.json();
      if (!json?.data?.assetId) throw new Error('The upload response was invalid.');
      setMediaAssetId(json.data.assetId);
      setMediaUrl(json.data.cdnUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'The upload failed.');
    } finally {
      setUploading(false);
    }
  }

  if (!isOpen || !creative) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (adType !== 'text' && !mediaAssetId && !mediaUrl) {
        throw new Error(`Upload a replacement ${adType} asset before submitting.`);
      }
      if (adType === 'text' && !headline.trim()) {
        throw new Error('Text ads need a headline.');
      }
      const payload: any = {
        headline: headline.trim() || undefined,
        bodyText: bodyText.trim() || undefined,
        ctaText: ctaText.trim() || undefined,
        destinationUrl,
        adType,
        ...(adType === 'text'
          ? { imageUrl: undefined, videoUrl: undefined }
          : mediaAssetId
            ? { mediaAssetId }
            : adType === 'video'
              ? { videoUrl: mediaUrl }
              : { imageUrl: mediaUrl }),
      };

      // Call API
      const API_BASE = typeof window !== 'undefined' ? '' : (process.env.NEXT_PUBLIC_ADS_API_URL || 'https://ads-api-production-d889.up.railway.app');
      const res = await sessionFetch(`${API_BASE}/api/v1/campaigns/creatives/${creative.id}/replace`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Failed to submit replacement asset.');
      }

      const data = await res.json();
      if (!data.data?.id) throw new Error('Replacement could not be confirmed.');
      onReplaceSuccess(data.data);
      onClose();
    } catch (err: any) {
      setError(err instanceof Error ? err.message : 'Replacement could not be confirmed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 1300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div ref={panel} role="dialog" aria-modal="true" aria-label="Replace Rejected Creative Asset" tabIndex={-1}
        style={{
          width: '100%',
          boxSizing: 'border-box',
          maxWidth: '540px',
          borderRadius: '16px',
          backgroundColor: 'var(--bg-elevated)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-xl)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <RefreshCw style={{ width: 18, height: 18, color: 'var(--color-crimson)' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Replace Rejected Creative Asset
            </h3>
          </div>
          <Button
            type="button"
            aria-label="Close replacement dialog"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              display: 'flex',
              padding: '4px',
            }}
          >
            <X style={{ width: 18, height: 18 }} />
          </Button>
        </div>

        {/* Content & Form */}
        <form onSubmit={handleSubmit} style={{ overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Reason Alert Banner */}
          <div
            style={{
              padding: '14px 16px',
              borderRadius: '10px',
              backgroundColor: 'var(--color-error-bg)',
              border: '1px solid rgba(220, 38, 38, 0.2)',
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-start',
            }}
          >
            <AlertCircle style={{ width: 18, height: 18, color: 'var(--color-error)', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-error)' }}>
                Moderation Feedback
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-primary)', margin: '4px 0 0', lineHeight: 1.5 }}>
                {creative.rejectionReason || 'Asset failed compliance check. Please provide a compliant replacement creative below to resume ad delivery.'}
              </p>
            </div>
          </div>

          {/* Ad type */}
          <div>
            <span style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Ad content type
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }} role="group" aria-label="Ad content type">
              {([
                { type: 'text' as const, label: 'Text', icon: Type },
                { type: 'image' as const, label: 'Image', icon: ImageIcon },
                { type: 'video' as const, label: 'Video', icon: Video },
              ]).map((option) => {
                const Icon = option.icon;
                const disabled = option.type === 'video' && !videoEnabled;
                const active = adType === option.type;
                return (
                  <Button
                    key={option.type}
                    type="button"
                    disabled={disabled}
                    onClick={() => {
                      setAdType(option.type);
                      if (option.type !== adType) { setMediaAssetId(undefined); setMediaUrl(''); }
                    }}
                    aria-pressed={active}
                    title={disabled ? 'Video authoring is not available yet.' : undefined}
                    style={{
                      padding: '9px 8px',
                      borderRadius: '8px',
                      border: `1px solid ${active ? 'var(--color-crimson)' : 'var(--border-subtle)'}`,
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: disabled ? 'not-allowed' : 'pointer',
                      opacity: disabled ? 0.65 : 1,
                      backgroundColor: active ? 'var(--badge-bg)' : 'var(--bg-page)',
                      color: active ? 'var(--color-crimson)' : 'var(--text-secondary)',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                    }}
                  >
                    <Icon size={13} aria-hidden="true" /> {option.label}{disabled ? ' · Soon' : ''}
                  </Button>
                );
              })}
            </div>
          </div>

          {adType !== 'text' && (
            <div>
              <label htmlFor={`${fieldId}-media`} style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                {adType === 'video' ? 'Replacement video (MP4/WebM, max 20 MB)' : 'Replacement image (JPG/PNG/WebP, max 750 KB)'}
              </label>
              <input
                id={`${fieldId}-media`}
                type="file"
                accept={adType === 'video' ? 'video/mp4,video/webm' : 'image/jpeg,image/png,image/webp,image/avif'}
                onChange={(event) => void uploadReplacement(event.target.files?.[0])}
                disabled={uploading || isSubmitting}
                style={{ width: '100%', fontSize: '12px', color: 'var(--text-secondary)' }}
              />
              {uploading && <p role="status" style={{ margin: '6px 0 0', fontSize: '12px', color: 'var(--text-muted)' }}><Loader2 size={12} aria-hidden="true" /> Uploading…</p>}
              {mediaUrl && <div style={{ marginTop: '8px' }}><MediaPreview source={mediaUrl} /></div>}
              {mediaAssetId && !uploading && (
                <p style={{ margin: '6px 0 0', fontSize: '11px', color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={12} aria-hidden="true" /> Replacement asset ready.
                </p>
              )}
            </div>
          )}

          {/* Headline */}
          <div>
            <label htmlFor={`${fieldId}-headline`} style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Headline {adType === 'text' ? '(required for text ads)' : '(optional)'} · Max 100 characters
            </label>
            <Input id={`${fieldId}-headline`}
              type="text"
              required={adType === 'text'}
              maxLength={100}
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-page)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Destination URL */}
          <div>
            <label htmlFor={`${fieldId}-destination`} style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Click Destination URL
            </label>
            <Input id={`${fieldId}-destination`}
              type="url"
              required
              value={destinationUrl}
              onChange={(e) => setDestinationUrl(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-page)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* CTA Text */}
          <div>
            <label htmlFor={`${fieldId}-cta`} style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Call-to-Action (CTA) Button Text
            </label>
            <Input id={`${fieldId}-cta`}
              type="text"
              value={ctaText}
              onChange={(e) => setCtaText(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-page)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Form Actions */}
          <div
            style={{
              paddingTop: '16px',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px',
            }}
          >
            <Button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-page)',
                color: 'var(--text-secondary)',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '8px 20px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: 'var(--color-crimson)',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: 'var(--shadow-crimson)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <RefreshCw style={{ width: 14, height: 14 }} />
              <span>{isSubmitting ? 'Submitting...' : 'Submit Replacement Asset'}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
