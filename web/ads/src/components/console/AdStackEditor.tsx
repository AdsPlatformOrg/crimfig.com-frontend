'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronUp, Image as ImageIcon, Layers, Loader2, Plus, Trash2, Type, Video } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { MediaPreview } from '../MediaPreview';
import { LocationTargeting } from './LocationTargeting';
import { sessionFetch } from '../../lib/session';
import type { CreationCapabilities } from '../../lib/campaigns-api';

export type AdDraftType = 'text' | 'image' | 'video';

export interface AdDraft {
  key: string;
  adType: AdDraftType;
  headline: string;
  bodyText: string;
  ctaText: string;
  destinationUrl: string;
  mediaAssetId?: string;
  mediaUrl?: string;
}

export interface StackDraft {
  key: string;
  name: string;
  geoMode: 'inherit' | 'global' | 'targeted';
  locations: string[];
  targetDevices: string[];
  targetHours: number[];
  ads: AdDraft[];
}

function draftKey(prefix: string): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return `${prefix}-${crypto.randomUUID()}`;
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function createAdDraft(): AdDraft {
  return { key: draftKey('ad'), adType: 'text', headline: '', bodyText: '', ctaText: 'Learn More', destinationUrl: '' };
}

export function createStackDraft(position: number): StackDraft {
  return {
    key: draftKey('stack'),
    name: `Ad Stack #${position}`,
    geoMode: 'inherit',
    locations: [],
    targetDevices: [],
    targetHours: [],
    ads: [createAdDraft()],
  };
}

interface AdStackEditorProps {
  stack: StackDraft;
  index: number;
  capabilities: CreationCapabilities | null;
  canRemove: boolean;
  onChange: (stack: StackDraft) => void;
  onRemove: () => void;
}

const TYPE_OPTIONS: Array<{ type: AdDraftType; label: string; icon: typeof Type }> = [
  { type: 'text', label: 'Text', icon: Type },
  { type: 'image', label: 'Image', icon: ImageIcon },
  { type: 'video', label: 'Video', icon: Video },
];

export function AdStackEditor({ stack, index, capabilities, canRemove, onChange, onRemove }: AdStackEditorProps) {
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [uploadingAd, setUploadingAd] = useState('');
  const [error, setError] = useState('');
  const [hoursText, setHoursText] = useState(stack.targetHours.join(', '));
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});
  const videoEnabled = Boolean(capabilities?.videoAuthoringEnabled);

  useEffect(() => {
    setHoursText(stack.targetHours.join(', '));
  }, [stack.key]); // eslint-disable-line react-hooks/exhaustive-deps

  function update(patch: Partial<StackDraft>) {
    onChange({ ...stack, ...patch });
  }

  function updateAd(key: string, patch: Partial<AdDraft>) {
    update({ ads: stack.ads.map((ad) => (ad.key === key ? { ...ad, ...patch } : ad)) });
  }

  function addAd() {
    update({ ads: [...stack.ads, createAdDraft()] });
  }

  function removeAd(key: string) {
    if (stack.ads.length <= 1) {
      setError('A stack needs at least one ad. Remove the stack instead, or replace this ad.');
      return;
    }
    update({ ads: stack.ads.filter((ad) => ad.key !== key) });
  }

  function setType(ad: AdDraft, type: AdDraftType) {
    if (type === 'video' && !videoEnabled) return;
    updateAd(ad.key, {
      adType: type,
      ...(type !== ad.adType ? { mediaAssetId: undefined, mediaUrl: undefined } : {}),
    });
  }

  async function upload(ad: AdDraft, file: File | undefined) {
    if (!file) return;
    const isVideo = ad.adType === 'video';
    const maxBytes = isVideo ? 20 * 1024 * 1024 : 750 * 1024;
    if (file.size > maxBytes) {
      setError(`This file exceeds the ${isVideo ? '20 MB video' : '750 KB image'} limit. Please optimize it locally.`);
      return;
    }
    setUploadingAd(ad.key);
    setError('');
    try {
      const body = new FormData();
      body.append('file', file);
      const response = await sessionFetch('/api/v1/uploads/direct', { method: 'POST', body });
      if (!response.ok) throw new Error('The upload could not be confirmed. Please retry.');
      const json = await response.json();
      const asset = json?.data;
      if (!asset?.assetId || !asset?.cdnUrl) throw new Error('The upload response was invalid.');
      updateAd(ad.key, { mediaAssetId: asset.assetId, mediaUrl: asset.cdnUrl });
      if (fileInputs.current[ad.key]) fileInputs.current[ad.key]!.value = '';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'The upload failed.');
    } finally {
      setUploadingAd('');
    }
  }

  function applyHours(value: string) {
    setHoursText(value);
    const parts = value.split(',').map((part) => part.trim()).filter(Boolean);
    const parsed = parts.map(Number);
    const valid = parsed.filter((hour) => Number.isInteger(hour) && hour >= 0 && hour <= 23);
    update({ targetHours: [...new Set(valid)].sort((a, b) => a - b) });
  }

  return (
    <section
      aria-labelledby={`stack-heading-${stack.key}`}
      style={{ border: '1px solid var(--border-subtle)', borderRadius: '14px', background: 'var(--bg-surface)', padding: '18px', display: 'flex', flexDirection: 'column', gap: '16px' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1 1 260px' }}>
          <span aria-hidden="true" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '34px', height: '34px', borderRadius: '9px', background: 'var(--badge-bg)', color: 'var(--color-crimson)' }}>
            <Layers size={17} />
          </span>
          <div style={{ flex: 1 }}>
            <label htmlFor={`stack-name-${stack.key}`} style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
              Ad Stack #{index + 1}
            </label>
            <Input
              id={`stack-name-${stack.key}`}
              value={stack.name}
              maxLength={100}
              onChange={(event) => update({ name: event.target.value })}
              aria-label={`Ad stack ${index + 1} name`}
              style={{ marginTop: '4px', fontWeight: 600 }}
            />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{stack.ads.length} ad{stack.ads.length === 1 ? '' : 's'}</span>
          {canRemove && (
            <Button type="button" variant="ghost" size="sm" onClick={onRemove} aria-label={`Remove ${stack.name}`}>
              <Trash2 size={14} aria-hidden="true" /> Remove stack
            </Button>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {stack.ads.map((ad, adIndex) => (
          <article key={ad.key} style={{ border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '14px', background: 'var(--bg-elevated)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
              <div role="group" aria-label={`Ad ${adIndex + 1} content type`} style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {TYPE_OPTIONS.map((option) => {
                  const Icon = option.icon;
                  const disabled = option.type === 'video' && !videoEnabled;
                  const active = ad.adType === option.type;
                  return (
                    <button
                      key={option.type}
                      type="button"
                      aria-pressed={active}
                      disabled={disabled}
                      onClick={() => setType(ad, option.type)}
                      title={disabled ? 'Video authoring is not available yet.' : undefined}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '5px', minHeight: '36px', padding: '6px 10px', borderRadius: '8px',
                        border: `1px solid ${active ? 'var(--color-crimson)' : 'var(--border-subtle)'}`,
                        background: active ? 'var(--badge-bg)' : 'var(--bg-surface)',
                        color: active ? 'var(--color-crimson)' : disabled ? 'var(--text-muted)' : 'var(--text-secondary)',
                        fontSize: '12px', fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.65 : 1,
                      }}
                    >
                      <Icon size={13} aria-hidden="true" /> {option.label}
                      {option.type === 'video' && !videoEnabled && <span style={{ fontSize: '10px' }}>· Soon</span>}
                    </button>
                  );
                })}
              </div>
              <Button type="button" variant="ghost" size="sm" onClick={() => removeAd(ad.key)} aria-label={`Remove ad ${adIndex + 1}`}>
                <Trash2 size={13} aria-hidden="true" /> Remove
              </Button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                  <label htmlFor={`headline-${ad.key}`} style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                    Headline <span style={{ color: 'var(--color-crimson)' }}>*</span>
                  </label>
                  <Input id={`headline-${ad.key}`} value={ad.headline} maxLength={100} onChange={(event) => updateAd(ad.key, { headline: event.target.value })} placeholder="A clear, honest headline" />
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{ad.headline.length}/100</span>
                </div>
                <div>
                  <label htmlFor={`body-${ad.key}`} style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Body / sub-headline</label>
                  <Textarea id={`body-${ad.key}`} rows={2} value={ad.bodyText} maxLength={2000} onChange={(event) => updateAd(ad.key, { bodyText: event.target.value })} placeholder="Optional supporting copy" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '10px' }}>
                  <div>
                    <label htmlFor={`cta-${ad.key}`} style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Call to action</label>
                    <Input id={`cta-${ad.key}`} value={ad.ctaText} maxLength={50} onChange={(event) => updateAd(ad.key, { ctaText: event.target.value })} />
                  </div>
                  <div>
                    <label htmlFor={`destination-${ad.key}`} style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                      Destination URL <span style={{ color: 'var(--color-crimson)' }}>*</span>
                    </label>
                    <Input id={`destination-${ad.key}`} type="url" value={ad.destinationUrl} onChange={(event) => updateAd(ad.key, { destinationUrl: event.target.value })} placeholder="https://example.com/landing" />
                  </div>
                </div>

                {ad.adType !== 'text' && (
                  <div style={{ border: '1px dashed var(--border-subtle)', borderRadius: '10px', padding: '12px', background: 'var(--bg-surface)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600 }}>
                        {ad.adType === 'video' ? 'Video asset (MP4/WebM, max 20 MB)' : 'Image asset (JPG/PNG/WebP, max 750 KB)'}
                      </span>
                      {uploadingAd === ad.key && <Loader2 size={14} aria-hidden="true" />}
                    </div>
                    <input
                      ref={(node) => { fileInputs.current[ad.key] = node; }}
                      type="file"
                      accept={ad.adType === 'video' ? 'video/mp4,video/webm' : 'image/jpeg,image/png,image/webp,image/avif'}
                      onChange={(event) => void upload(ad, event.target.files?.[0])}
                      disabled={uploadingAd === ad.key}
                      aria-label={ad.adType === 'video' ? 'Upload video asset' : 'Upload image asset'}
                      style={{ fontSize: '12px', color: 'var(--text-secondary)', maxWidth: '100%' }}
                    />
                    {ad.mediaUrl && (
                      <div style={{ marginTop: '10px' }}>
                        <MediaPreview source={ad.mediaUrl} />
                        <p style={{ margin: '6px 0 0', fontSize: '11px', color: 'var(--color-success)' }}>Media ready for review.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Preview</span>
                <div style={{ border: '1px solid var(--border-subtle)', borderRadius: '10px', overflow: 'hidden', background: 'var(--bg-page)' }}>
                  {ad.adType === 'video' && ad.mediaUrl ? (
                    <MediaPreview source={ad.mediaUrl} />
                  ) : ad.adType === 'image' && ad.mediaUrl ? (
                    <MediaPreview source={ad.mediaUrl} />
                  ) : (
                    <div style={{ height: '100px', display: 'grid', placeItems: 'center', background: 'var(--bg-surface)', color: 'var(--text-muted)', fontSize: '12px' }}>
                      {ad.adType === 'text' ? 'Text-only ad' : 'Upload media to preview'}
                    </div>
                  )}
                  <div style={{ padding: '12px' }}>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-crimson)', textTransform: 'uppercase', marginBottom: '4px' }}>Promoted</div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>{ad.headline || 'Your headline appears here'}</div>
                    <p style={{ margin: '0 0 10px', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{ad.bodyText || 'Optional supporting copy.'}</p>
                    <span style={{ display: 'inline-block', padding: '5px 10px', borderRadius: '6px', background: 'var(--color-crimson)', color: '#fff', fontSize: '11px', fontWeight: 700 }}>{ad.ctaText || 'Learn More'}</span>
                  </div>
                </div>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Card / feed unit. Placement format is chosen by the publisher surface.</span>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
        <Button type="button" variant="outline" size="sm" onClick={addAd}>
          <Plus size={14} aria-hidden="true" /> Add ad to this stack
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => setAdvancedOpen((open) => !open)} aria-expanded={advancedOpen}>
          {advancedOpen ? <ChevronUp size={14} aria-hidden="true" /> : <ChevronDown size={14} aria-hidden="true" />} Advanced settings
        </Button>
      </div>

      {error && <p role="alert" style={{ margin: 0, fontSize: '12px', color: 'var(--color-error, #B42318)' }}>{error}</p>}

      {advancedOpen && (
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Campaign-level settings apply by default. Overrides here change eligibility only for ads in this stack; budget and bid stay campaign-level.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '12px', fontWeight: 600 }}>
              Geography
              <select
                value={stack.geoMode}
                onChange={(event) => {
                  const geoMode = event.target.value as StackDraft['geoMode'];
                  update({ geoMode, ...(geoMode === 'targeted' ? {} : { locations: [] }) });
                }}
                style={{ minHeight: '44px', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-page)', color: 'var(--text-primary)', font: 'inherit', fontSize: '13px' }}
              >
                <option value="inherit">Inherit campaign geography</option>
                <option value="global">Global for this stack</option>
                <option value="targeted">Target this stack</option>
              </select>
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600 }}>Devices</span>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {['desktop', 'mobile'].map((device) => (
                  <label key={device} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)', minHeight: '32px' }}>
                    <input
                      type="checkbox"
                      checked={stack.targetDevices.includes(device)}
                      onChange={(event) => {
                        update({ targetDevices: event.target.checked ? [...stack.targetDevices, device] : stack.targetDevices.filter((item) => item !== device) });
                      }}
                    />
                    {device === 'desktop' ? 'Desktop' : 'Mobile'}
                  </label>
                ))}
              </div>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Leave both unchecked to inherit the campaign devices.</span>
            </div>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '12px', fontWeight: 600 }}>
              Daypart hours (0–23)
              <Input
                value={hoursText}
                onChange={(event) => applyHours(event.target.value)}
                placeholder="e.g. 8, 9, 17"
                inputMode="numeric"
                aria-describedby={`hours-hint-${stack.key}`}
              />
              <span id={`hours-hint-${stack.key}`} style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Comma-separated hours. Leave empty to inherit the campaign daypart.</span>
            </label>
          </div>

          {stack.geoMode === 'targeted' && (
            <div>
              <span style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>Stack locations</span>
              <LocationTargeting value={stack.locations} onChange={(locations) => update({ locations })} compact />
            </div>
          )}
        </div>
      )}
    </section>
  );
}
