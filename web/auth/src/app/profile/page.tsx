'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Check, ExternalLink, Loader2, Sparkles, X } from 'lucide-react';
import { AuthConsoleShell } from '../../components/AuthConsoleShell';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import {
  loadAvatarCatalog,
  loadProfile,
  saveAvatarPreset,
  type AuthProfile,
  type AvatarCatalog,
} from '../../lib/profile';

export default function AuthProfilePage() {
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

  const currentPreset = catalog?.presets.find((preset) => preset.id === profile?.avatar.presetId);
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
    <AuthConsoleShell activePath="/profile">
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
                  src={`/avatars/chibi/${currentPreset?.file || 'chibi-indigo.webp'}`}
                  alt={currentPreset?.alt || 'Current avatar'}
                  width={88}
                  height={88}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ flex: 1, minWidth: '220px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <strong style={{ fontSize: '18px', color: 'var(--text-primary)' }}>{currentPreset?.label || 'Default avatar'}</strong>
                  <Badge variant="secondary">{profile.avatar.kind === 'default' ? 'Default' : 'Selected'}</Badge>
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
                  Twelve chibi ninja avatars. Select one, then save. The default avatar is always available if you remove your choice.
                </p>
              </div>

              <div role="radiogroup" aria-label="Avatar presets" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px' }}>
                {catalog.presets.map((preset) => {
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

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <Button type="button" variant="outline" size="sm" onClick={() => { setSelectedId(catalog.defaultId); setSaved(''); }}>
                  <Sparkles size={14} aria-hidden="true" /> Use default avatar
                </Button>
              </div>

              {error && <p role="alert" style={{ margin: 0, fontSize: '13px', color: 'var(--color-error, #B42318)' }}>{error}</p>}
              {saved && <p role="status" style={{ margin: 0, fontSize: '13px', color: 'var(--color-success)' }}>{saved}</p>}
            </Card>

            <Card style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>Artwork attribution</h2>
              <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.6, color: 'var(--text-secondary)' }}>{catalog.attribution.summary}</p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                <Button ref={attributionTrigger} type="button" variant="outline" size="sm" onClick={() => setAttributionOpen(true)}>
                  View full attribution
                </Button>
                <a href={catalog.attribution.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: 'var(--color-crimson)', fontWeight: 600 }}>
                  Original asset pack <ExternalLink size={12} aria-hidden="true" style={{ display: 'inline' }} />
                </a>
                <a href={catalog.attribution.licenseUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: 'var(--color-crimson)', fontWeight: 600 }}>
                  CC0 1.0 license <ExternalLink size={12} aria-hidden="true" style={{ display: 'inline' }} />
                </a>
              </div>
            </Card>
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
              <h2 id="avatar-attribution-title" style={{ margin: 0, fontSize: '19px', fontWeight: 800, color: 'var(--text-primary)' }}>Avatar artwork attribution</h2>
              <Button type="button" variant="ghost" size="icon" aria-label="Close attribution" onClick={() => setAttributionOpen(false)}>
                <X size={18} aria-hidden="true" />
              </Button>
            </div>
            <dl style={{ display: 'grid', gridTemplateColumns: 'max-content 1fr', gap: '10px 16px', margin: '18px 0', fontSize: '13px', lineHeight: 1.5 }}>
              <dt style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>Source</dt><dd style={{ margin: 0 }}>{catalog.attribution.title}</dd>
              <dt style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>Artist</dt><dd style={{ margin: 0 }}>{catalog.attribution.artist}</dd>
              <dt style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>License</dt><dd style={{ margin: 0 }}>{catalog.attribution.license}</dd>
              <dt style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>Modifications</dt><dd style={{ margin: 0 }}>{catalog.attribution.modifications}</dd>
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
    </AuthConsoleShell>
  );
}
