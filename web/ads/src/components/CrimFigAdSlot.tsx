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
export const CRIMFIG_PLACEMENTS: Record<string, { slotId: string; label: string; recommended: string; width?: number; height?: number }> = {
  banner_top:          { slotId: 'cf_slot_0001', label: 'Banner — Top of Page (728x90)',          recommended: 'Recommended: Place inside <header> or directly after <nav>.', width: 728, height: 90 },
  banner_bottom:       { slotId: 'cf_slot_0002', label: 'Banner — Bottom of Page (728x90)',        recommended: 'Recommended: Place before </footer>.', width: 728, height: 90 },
  in_content_mid:      { slotId: 'cf_slot_0003', label: 'In-Content — Mid Article (300x250 MPU)', recommended: 'Recommended: Place between paragraphs, after 3rd content block.', width: 300, height: 250 },
  in_content_end:      { slotId: 'cf_slot_0004', label: 'In-Content — End of Article (300x250 MPU)', recommended: 'Recommended: Place after post body, before comment section.', width: 300, height: 250 },
  sidebar_sticky:      { slotId: 'cf_slot_0005', label: 'Sidebar — Sticky Rail (160x600 / 300x600)', recommended: 'Recommended: Place inside a position:sticky sidebar column.', width: 300, height: 600 },
  listing_interstitial:{ slotId: 'cf_slot_0006', label: 'Listing Interstitial (Fluid Card)',      recommended: 'Recommended: Inject after every 6th item in a listing grid.' },
  popup_exit_intent:   { slotId: 'cf_slot_0007', label: 'Exit-Intent Popup',                       recommended: 'Recommended: Trigger on mouseleave from viewport top.' },
  app_interstitial:    { slotId: 'cf_slot_0008', label: 'Mobile App — Interstitial',               recommended: 'Recommended: Trigger on screen transition in React Native apps.' },
  app_rewarded:        { slotId: 'cf_slot_0009', label: 'Mobile App — Rewarded Video',             recommended: 'Recommended: Offer before access to premium in-app feature.' },
  reels_preroll:       { slotId: 'cf_slot_0010', label: 'CrimFig Reels — Pre-roll (9:16 Video)',  recommended: 'Recommended: Auto-injected by CrimFig Reels platform — no action needed.' },
};

// ── Types ───────────────────────────────────────────────────────────────────
export type CrimFigPlacement = keyof typeof CRIMFIG_PLACEMENTS;

interface CrimFigAdSlotProps {
  placement: CrimFigPlacement;
  publisherKey: string;        // e.g. "pk_live_abc123" — from Promoter Hub
  responsive?: boolean;        // default: true
  fallbackHtml?: string;
  className?: string;
  style?: React.CSSProperties;
}

// ── Component ───────────────────────────────────────────────────────────────
export function CrimFigAdSlot({
  placement,
  publisherKey,
  responsive = true,
  fallbackHtml,
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
        style={{
          display: 'block',
          minHeight: slotConfig.height || 60,
          maxWidth: slotConfig.width || undefined,
          ...style,
        }}
        data-cf-network="crimfig"
        data-cf-publisher={publisherKey}
        data-cf-placement={slotConfig.slotId}
        data-cf-handle={placement}
        data-cf-responsive={responsive ? 'true' : 'false'}
        data-cf-format="auto"
        data-cf-fallback={fallbackHtml || undefined}
        data-cf-viewable="auto"
      />

      {/* Queue initialisation — fires after the element is mounted */}
      <Script id={`cf-pub-init-${uid}`} strategy="afterInteractive">
        {`(window.cfPubQ = window.cfPubQ || []).push({});`}
      </Script>
    </>
  );
}

// ── Verification Snippet Generators ───────────────────────────────────────
// Generates the site ownership DNS TXT record or HTML meta tag a promoter adds.
export function generateCrimFigDnsTxtRecord(verificationToken: string, domain: string): { host: string; recordType: string; value: string } {
  return {
    host: '@',
    recordType: 'TXT',
    value: `crimfig-site-verification=${verificationToken}`,
  };
}

export function generateCrimFigVerifyMetaTag(verificationToken: string): string {
  return `<!-- CrimFig Site Ownership Verification — add inside <head> -->
<meta name="crimfig-site-verification" content="${verificationToken}" />`;
}

// ── Embed Code Generator ─────────────────────────────────────────────────────
// Generates the raw HTML string for Publisher Network or Owned-Site Direct Spaces
export function generateCrimFigEmbedCode({
  placement,
  publisherKey,
  domain,
  mode = 'publisher_network',
  allowHomeNetworkFill = false,
}: {
  placement: CrimFigPlacement;
  publisherKey: string;
  domain: string;
  mode?: 'publisher_network' | 'owned_site_direct';
  allowHomeNetworkFill?: boolean;
}): string {
  const slotConfig = CRIMFIG_PLACEMENTS[placement];
  if (!slotConfig) return '';

  const commentTitle = mode === 'owned_site_direct'
    ? 'CrimFig Ad Spaces — Owned-Site Direct Deal Slot (Free Barter Tier)'
    : `CrimFig Publisher Network — ${slotConfig.label}`;

  return `<!-- ${commentTitle} -->
<!-- Place this code inside your <body> where you want the ad to appear. -->

<script async src="https://ads.crimfig.com/api/v1/delivery/pub-loader.js?pk=${publisherKey}" crossorigin="anonymous"></script>

<!-- ${slotConfig.label} | Domain: ${domain} | Mode: ${mode} -->
<ins class="crimfig-pub-slot"
     style="display:block"
     data-cf-network="crimfig"
     data-cf-publisher="${publisherKey}"
     data-cf-placement="${slotConfig.slotId}"
     data-cf-handle="${placement}"
     data-cf-mode="${mode}"
     ${mode === 'owned_site_direct' ? `data-cf-network-fill="${allowHomeNetworkFill ? 'true' : 'false'}"` : ''}
     data-cf-responsive="true"
     data-cf-format="auto"></ins>

<script>
  (window.cfPubQ = window.cfPubQ || []).push({});
</script>`;
}

