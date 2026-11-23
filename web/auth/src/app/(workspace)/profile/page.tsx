'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Check, ExternalLink, Loader2, X } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { getProfileCopy } from '../../../lib/auth-copy';
import { useLanguage } from '../../../../../../shared/ui/localization/LocalizationProvider';
import {
  loadAvatarCatalog,
  loadProfile,
  saveAvatarPreset,
  type AuthProfile,
  type AvatarCatalog,
} from '../../../lib/profile';

export default function AuthProfilePage() {
  const { locale } = useLanguage();
  const copy = getProfileCopy(locale);
  const [profile, setProfile] = useState<AuthProfile | null>(null);
  const [catalog, setCatalog] = useState<AvatarCatalog | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState('');
  const [attributionOpen, setAttributionOpen] = useState(false);
  const attributionTrigger = useRef<HTMLButtonElement | null>(null);
  const attributionDialog = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let active = true;
    void Promise.all([loadProfile(), loadAvatarCatalog()])
      .then(([nextProfile, nextCatalog]) => {
        if (!active) return;
        setProfile(nextProfile);
        setCatalog(nextCatalog);
        setSelectedId(nextProfile.avatar.presetId);
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : 'Profile settings are unavailable.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!attributionOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    const dialog = attributionDialog.current;
    dialog?.focus();
    const keydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setAttributionOpen(false);
        attributionTrigger.current?.focus();
      }
      if (event.key !== 'Tab' || !dialog) return;
      const focusable = dialog.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])');
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', keydown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', keydown);
      document.body.style.overflow = previousOverflow;
      previous?.focus();
    };
  }, [attributionOpen]);

  const selectedPreset = catalog?.presets.find(preset => preset.id === selectedId);
  const dirty = Boolean(profile && selectedId !== profile.avatar.presetId);

  async function save() {
    if (!catalog || !profile) return;
    setSaving(true);
    setError('');
    setSaved('');
    try {
      const updated = await saveAvatarPreset(selectedId === catalog.defaultId ? null : selectedId);
      setProfile(updated);
      setSelectedId(updated.avatar.presetId);
      setSaved('Your avatar has been updated.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Your avatar could not be saved.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-crimson)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Identity &amp; Security
          </span>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0 8px' }}>Profile &amp; Avatar</h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
            Choose how you appear in CrimFig Auth, Ads, and Billing.
          </p>
        </div>

        {loading ? (
          <Card style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Loader2 size={18} aria-hidden="true" style={{ display: 'inline-block', marginRight: '8px' }} />
            Loading your profile…
          </Card>
        ) : error && !profile ? (
          <Card style={{ padding: '24px' }}>
            <p role="alert" style={{ margin: 0, color: 'var(--color-error, #B42318)', fontSize: '14px' }}>{error}</p>
          </Card>
        ) : profile && catalog ? (
          <>
            <Card style={{ padding: '24px', display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ width: '88px', height: '88px', borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--border-subtle)', flexShrink: 0, background: 'var(--bg-surface)' }}>
                <Image
                  src={selectedPreset ? `/avatars/chibi/${selectedPreset.file}` : new URL(profile.avatar.url).pathname}
                  alt={selectedPreset?.alt ?? profile.avatar.alt}
                  width={88}
                  height={88}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ flex: 1, minWidth: '220px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <strong style={{ fontSize: '18px', color: 'var(--text-primary)' }}>{selectedPreset?.label ?? profile.avatar.label}</strong>
                  <Badge variant="secondary">{dirty ? 'Preview' : profile.avatar.kind === 'default' ? 'Default' : 'Selected'}</Badge>
                </div>
                <p style={{ margin: '6px 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>{profile.email}</p>
              </div>
              <Button type="button" onClick={() => void save()} disabled={!dirty || saving}>
                {saving ? <><Loader2 size={14} aria-hidden="true" /> Saving…</> : <><Check size={14} aria-hidden="true" /> Save avatar</>}
              </Button>
            </Card>

            <Card style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)' }}>Choose your avatar</h2>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Choose an avatar from Geometric Characters, Portraits, or Ninjas, then save.
                </p>
              </div>

              <div role="radiogroup" aria-label="Avatar presets" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {(['geometric', 'portrait', 'ninja'] as const).map(collection => (
                <section key={collection}>
                  <h3 style={{ margin: '0 0 10px', fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {collection === 'geometric' ? 'Geometric Characters' : collection === 'portrait' ? 'Portraits' : 'Ninjas'}
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px' }}>
                {catalog.presets.filter(preset => (preset.collection ?? 'ninja') === collection).map((preset) => {
                  const active = selectedId === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => { setSelectedId(preset.id); setSaved(''); }}
                      style={{
                        border: `2px solid ${active ? 'var(--color-crimson)' : 'var(--border-subtle)'}`,
                        borderRadius: '14px',
                        background: active ? 'rgba(212,20,58,0.06)' : 'var(--bg-surface)',
                        padding: '10px',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '8px',
                        minHeight: '44px',
                      }}
                    >
                      <span style={{ width: '72px', height: '72px', borderRadius: '18px', overflow: 'hidden', display: 'block', background: 'var(--bg-page)' }}>
                        <Image src={`/avatars/chibi/${preset.file}`} alt={preset.alt} width={72} height={72} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </span>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>{preset.label}</span>
                      {active && <Check size={14} aria-hidden="true" style={{ color: 'var(--color-crimson)' }} />}
                    </button>
                  );
                })}
              </div>
                </section>
              ))}
              </div>

              {error && <p role="alert" style={{ margin: 0, fontSize: '13px', color: 'var(--color-error, #B42318)' }}>{error}</p>}
              {saved && <p role="status" style={{ margin: 0, fontSize: '13px', color: 'var(--color-success)' }}>{saved}</p>}
            </Card>

            <footer
              aria-label={copy.artworkAttribution}
              style={{
                padding: '0 4px',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '4px 10px',
                fontSize: '11px',
                lineHeight: 1.5,
                color: 'var(--text-muted)',
              }}
            >
              <span>{copy.artworkAttribution}: {catalog.attribution.summary}</span>
              <button
                ref={attributionTrigger}
                type="button"
                onClick={() => setAttributionOpen(true)}
                style={{
                  border: 'none',
                  background: 'none',
                  padding: 0,
                  margin: 0,
                  font: 'inherit',
                  color: 'var(--text-secondary)',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                }}
              >
                {copy.viewFullAttribution}
              </button>
              <a href={catalog.attribution.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'underline' }}>
                {copy.originalAssetPack} <ExternalLink size={10} aria-hidden="true" style={{ display: 'inline', verticalAlign: 'middle' }} />
              </a>
              <a href={catalog.attribution.licenseUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'underline' }}>
                {copy.cc0License} <ExternalLink size={10} aria-hidden="true" style={{ display: 'inline', verticalAlign: 'middle' }} />
              </a>
            </footer>
          </>
        ) : null}
      </div>

      {attributionOpen && catalog && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', backgroundColor: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(4px)' }}>
          <div
            ref={attributionDialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby="avatar-attribution-title"
            tabIndex={-1}
            style={{ width: '100%', maxWidth: '560px', maxHeight: 'calc(100dvh - 32px)', overflowY: 'auto', borderRadius: '16px', border: '1px solid var(--border-subtle)', background: 'var(--bg-elevated)', padding: '24px', boxSizing: 'border-box', outline: 'none' }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
              <h2 id="avatar-attribution-title" style={{ margin: 0, fontSize: '19px', fontWeight: 800, color: 'var(--text-primary)' }}>{copy.avatarAttributionTitle}</h2>
              <Button type="button" variant="ghost" size="icon" aria-label={copy.closeAttribution} onClick={() => setAttributionOpen(false)}>
                <X size={18} aria-hidden="true" />
              </Button>
            </div>
            <dl style={{ display: 'grid', gridTemplateColumns: 'max-content 1fr', gap: '10px 16px', margin: '18px 0', fontSize: '13px', lineHeight: 1.5 }}>
              <dt style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>{copy.source}</dt><dd style={{ margin: 0 }}>{catalog.attribution.title}</dd>
              <dt style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>{copy.artist}</dt><dd style={{ margin: 0 }}>{catalog.attribution.artist}</dd>
              <dt style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>{copy.license}</dt><dd style={{ margin: 0 }}>{catalog.attribution.license}</dd>
              <dt style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>{copy.modifications}</dt><dd style={{ margin: 0 }}>{catalog.attribution.modifications}</dd>
            </dl>
            <p style={{ margin: '0 0 16px', fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              CC0 does not imply endorsement by the artist. CrimFig does not include franchise characters, logos, or other third-party marks in this collection.
            </p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <a href={catalog.attribution.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-crimson)' }}>OpenGameArt source</a>
              <a href={catalog.attribution.licenseUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-crimson)' }}>CC0 1.0 license</a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
