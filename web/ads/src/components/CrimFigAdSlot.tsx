'use client';

/**
 * CrimFigAdSlot — Promoter ad placement renderer for the CrimFig Publisher Network.
 *
 * Usage:
 *   <CrimFigAdSlot placement="banner_top" publisherKey="pk_live_xxxx" />
 *
 * Learnt from industry-standard async ad tag patterns (e.g. Google AdSense).
 * Key differences from Google AdSense:
 *   - Attribute prefix: `data-cf-*` instead of `data-ad-*`
 *   - Publisher key: `data-cf-publisher` instead of `data-ad-client`
 *   - Placement handle: `data-cf-placement` instead of `data-ad-slot`
 *   - Network: `data-cf-network="crimfig"` (proprietary identifier)
 *   - Element class: `crimfig-pub-slot` instead of `adsbygoogle`
 *   - Element ID format: `cf-pub-<placement>-<uid>` (namespaced, collision-safe)
 *   - Init call: `window.cfPubQ.push({})` instead of `adsbygoogle.push({})`
 *   - Loader script: served from `ads.crimfig.com` instead of googlesyndication.com
 */

import React, { useEffect, useId } from 'react';
import Script from 'next/script';

// ── Placement Catalogue ─────────────────────────────────────────────────────
// Each placement maps to a server-side slot ID registered in the Ads API.
// Format: `placement_handle` → `slot_id`
export const CRIMFIG_PLACEMENTS: Record<string, { slotId: string; label: string; recommended: string }> = {
  banner_top:          { slotId: 'cf_slot_0001', label: 'Banner — Top of Page',          recommended: 'Recommended: Place inside <header> or directly after <nav>.' },
  banner_bottom:       { slotId: 'cf_slot_0002', label: 'Banner — Bottom of Page',        recommended: 'Recommended: Place before </footer>.' },
  in_content_mid:      { slotId: 'cf_slot_0003', label: 'In-Content — Mid Article',       recommended: 'Recommended: Place between paragraphs, after 3rd content block.' },
  in_content_end:      { slotId: 'cf_slot_0004', label: 'In-Content — End of Article',    recommended: 'Recommended: Place after post body, before comment section.' },
  sidebar_sticky:      { slotId: 'cf_slot_0005', label: 'Sidebar — Sticky Rail',          recommended: 'Recommended: Place inside a position:sticky sidebar column.' },
  listing_interstitial:{ slotId: 'cf_slot_0006', label: 'Listing Interstitial',           recommended: 'Recommended: Inject after every 6th item in a listing grid.' },
  popup_exit_intent:   { slotId: 'cf_slot_0007', label: 'Exit-Intent Popup',              recommended: 'Recommended: Trigger on mouseleave from viewport top.' },
  app_interstitial:    { slotId: 'cf_slot_0008', label: 'Mobile App — Interstitial',      recommended: 'Recommended: Trigger on screen transition in React Native apps.' },
  app_rewarded:        { slotId: 'cf_slot_0009', label: 'Mobile App — Rewarded Video',    recommended: 'Recommended: Offer before access to premium in-app feature.' },
  reels_preroll:       { slotId: 'cf_slot_0010', label: 'CrimFig Reels — Pre-roll',       recommended: 'Recommended: Auto-injected by CrimFig Reels platform — no action needed.' },
};

// ── Types ───────────────────────────────────────────────────────────────────
export type CrimFigPlacement = keyof typeof CRIMFIG_PLACEMENTS;

interface CrimFigAdSlotProps {
  placement: CrimFigPlacement;
  publisherKey: string;        // e.g. "pk_live_abc123" — from Promoter Hub
  responsive?: boolean;        // default: true
  className?: string;
  style?: React.CSSProperties;
}

// ── Component ───────────────────────────────────────────────────────────────
export function CrimFigAdSlot({
  placement,
  publisherKey,
  responsive = true,
  className,
  style,
}: CrimFigAdSlotProps) {
  const uid = useId().replace(/:/g, '');
  const slotConfig = CRIMFIG_PLACEMENTS[placement];

  useEffect(() => {
    try {
      // Push to the CrimFig publisher queue (mirrors the adsbygoogle.push pattern)
      ((window as any).cfPubQ = (window as any).cfPubQ || []).push({});
    } catch (_) {}
  }, [placement, publisherKey]);

  if (!slotConfig) return null;

  return (
    <>
      {/* CrimFig Publisher Network loader — loaded once per page, idempotent */}
      <Script
        id={`cf-pub-loader-${uid}`}
        src={`https://ads.crimfig.com/api/v1/delivery/pub-loader.js?pk=${publisherKey}`}
        strategy="afterInteractive"
        async
      />

      {/* Ad slot element — attributes use `data-cf-*` namespace */}
      <ins
        id={`cf-pub-${placement}-${uid}`}
        className={`crimfig-pub-slot${className ? ` ${className}` : ''}`}
        style={{ display: 'block', minHeight: 60, ...style }}
        data-cf-network="crimfig"
        data-cf-publisher={publisherKey}
        data-cf-placement={slotConfig.slotId}
        data-cf-handle={placement}
        data-cf-responsive={responsive ? 'true' : 'false'}
        data-cf-format="auto"
      />

      {/* Queue initialisation — fires after the element is mounted */}
      <Script id={`cf-pub-init-${uid}`} strategy="afterInteractive">
        {`(window.cfPubQ = window.cfPubQ || []).push({});`}
      </Script>
    </>
  );
}

// ── Embed Code Generator ─────────────────────────────────────────────────────
// Generates the raw HTML string a promoter copies into their website source.
export function generateCrimFigEmbedCode({
  placement,
  publisherKey,
  domain,
}: {
  placement: CrimFigPlacement;
  publisherKey: string;
  domain: string;
}): string {
  const slotConfig = CRIMFIG_PLACEMENTS[placement];
  if (!slotConfig) return '';

  return `<!-- CrimFig Publisher Network — ${slotConfig.label} -->
<!-- Place this code inside your <body> where you want the ad to appear. -->
<!-- For each individual ad position, use a separate code block with a unique placement handle. -->

<script async src="https://ads.crimfig.com/api/v1/delivery/pub-loader.js?pk=${publisherKey}" crossorigin="anonymous"></script>

<!-- ${slotConfig.label} | Domain: ${domain} -->
<ins class="crimfig-pub-slot"
     style="display:block"
     data-cf-network="crimfig"
     data-cf-publisher="${publisherKey}"
     data-cf-placement="${slotConfig.slotId}"
     data-cf-handle="${placement}"
     data-cf-responsive="true"
     data-cf-format="auto"></ins>

<script>
  (window.cfPubQ = window.cfPubQ || []).push({});
</script>`;
}

// ── Verification Meta Tag Generator ─────────────────────────────────────────
// Generates the site ownership verification meta tag a promoter adds to <head>.
export function generateCrimFigVerifyMetaTag(verificationToken: string): string {
  return `<!-- CrimFig Site Ownership Verification — add to your <head> -->
<meta name="cf-site-verify" content="${verificationToken}" />`;
}
