'use client';

import React, { useEffect, useId, useRef, useState } from 'react';

interface AccountSession {
  getProfile(): Promise<{ avatar: { url: string; alt: string } }>;
  logout(): Promise<void>;
}
export interface AccountMenuProps {
  session: AccountSession;
  links: { label: string; href: string }[];
}

/** Shared presentation only; each app supplies its existing session and real routes. */
export function AccountMenu({ session, links }: AccountMenuProps) {
  const [open, setOpen] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [imageFailed, setImageFailed] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);
  const busy = useRef(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const id = useId();
  const items = () => Array.from(menu.current?.querySelectorAll<HTMLElement>('[role="menuitem"]:not(:disabled)') ?? []);
  const close = (restore = true) => { setOpen(false); if (restore) trigger.current?.focus(); };

  useEffect(() => {
    let active = true;
    const load = () => { void session.getProfile().then(profile => {
      if (active) { setAvatar(profile.avatar.url); setImageFailed(false); }
    }).catch(() => { /* Account actions remain available without profile data. */ }); };
    load();
    window.addEventListener('crimfig-profile-updated', load);
    return () => { active = false; window.removeEventListener('crimfig-profile-updated', load); };
  }, [session]);
  useEffect(() => {
    if (!open) return;
    items()[0]?.focus();
    const outside = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) close(false); };
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, [open]);

  const signOut = async () => {
    if (busy.current) return;
    busy.current = true; setPending(true); setError(false);
    try { await session.logout(); close(); }
    catch { setError(true); }
    finally { busy.current = false; setPending(false); }
  };

  return <div className="cf-account" ref={root} onBlur={event => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
  }}>
    <button ref={trigger} type="button" className="cf-account-trigger" aria-label="Open account menu"
      aria-haspopup="menu" aria-expanded={open} aria-controls={id}
      onClick={() => setOpen(value => !value)} onKeyDown={event => {
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); setOpen(true); }
        if (event.key === 'Escape') close();
      }}>
      {avatar && !imageFailed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={avatar} alt="" width={36} height={36} onError={() => setImageFailed(true)} />
      ) : <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 21v-2a8 8 0 0 1 16 0v2" /></svg>}
    </button>
    <div ref={menu} id={id} role="menu" aria-label="Account" className="cf-account-menu" hidden={!open}
      onKeyDown={event => {
        if (event.key === 'Escape') { event.stopPropagation(); event.preventDefault(); close(); return; }
        if (!['ArrowDown','ArrowUp','Home','End'].includes(event.key)) return;
        event.preventDefault(); const choices = items(); const index = choices.indexOf(document.activeElement as HTMLElement);
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? choices.length - 1 : (index + (event.key === 'ArrowDown' ? 1 : -1) + choices.length) % choices.length;
        choices[next]?.focus();
      }}>
      {links.map(link => <a key={link.href} role="menuitem" tabIndex={-1} href={link.href} onClick={() => close(false)}>{link.label}</a>)}
      <div role="separator" className="cf-account-separator" />
      <button type="button" role="menuitem" tabIndex={-1} disabled={pending} onClick={() => { void signOut(); }}>
        {pending ? 'Signing out…' : 'Sign out'}
      </button>
      {error && <p role="alert">Sign out could not be confirmed. Please try again.</p>}
    </div>
  </div>;
}
