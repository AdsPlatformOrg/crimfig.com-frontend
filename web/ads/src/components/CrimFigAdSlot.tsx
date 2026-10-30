'use client';

/**
 * CrimFigAdSlot — Promoter ad placement renderer for the CrimFig Publisher Network.
 *
 * Supports both canonical persisted AdStation slot tags (`cf-slot-*`) and
 * placement format presets, using environment-safe API base URLs.
 */

import React, { useEffect, useId } from 'react';
import Script from 'next/script';

const DEFAULT_ADS_API_URL = (
  process.env.NEXT_PUBLIC_ADS_API_URL || 'https://api.ads.crimfig.com'
).replace(/\/+$/, '');

// ── Placement Catalogue ─────────────────────────────────────────────────────
export const CRIMFIG_PLACEMENTS: Record<
  string,
  {
    slotId: string;
    label: string;
    recommended: string;
    width?: number;
    height?: number;
  }
> = {
  banner_top: {
    slotId: 'cf_slot_0001',
    label: 'Banner — Top of Page (728x90)',
    recommended: 'Recommended: Place inside <header> or directly after <nav>.',
    width: 728,
    height: 90,
  },
  banner_bottom: {
    slotId: 'cf_slot_0002',
    label: 'Banner — Bottom of Page (728x90)',
    recommended: 'Recommended: Place before </footer>.',
    width: 728,
    height: 90,
  },
  in_content_mid: {
    slotId: 'cf_slot_0003',
    label: 'In-Content — Mid Article (300x250 MPU)',
    recommended:
      'Recommended: Place between paragraphs, after 3rd content block.',
    width: 300,
    height: 250,
  },
  in_content_end: {
    slotId: 'cf_slot_0004',
    label: 'In-Content — End of Article (300x250 MPU)',
    recommended:
      'Recommended: Place after post body, before comment section.',
    width: 300,
    height: 250,
  },
  sidebar_sticky: {
    slotId: 'cf_slot_0005',
    label: 'Sidebar — Sticky Rail (160x600 / 300x600)',
    recommended: 'Recommended: Place inside a position:sticky sidebar column.',
    width: 300,
    height: 600,
  },
  listing_interstitial: {
    slotId: 'cf_slot_0006',
    label: 'Listing Interstitial (Fluid Card)',
    recommended: 'Recommended: Inject after every 6th item in a listing grid.',
  },
  popup_exit_intent: {
    slotId: 'cf_slot_0007',
    label: 'Exit-Intent Popup',
    recommended: 'Recommended: Trigger on mouseleave from viewport top.',
  },
  app_interstitial: {
    slotId: 'cf_slot_0008',
    label: 'Mobile App — Interstitial',
    recommended:
      'Recommended: Trigger on screen transition in React Native apps.',
  },
  app_rewarded: {
    slotId: 'cf_slot_0009',
    label: 'Mobile App — Rewarded Video',
    recommended:
      'Recommended: Offer before access to premium in-app feature.',
  },
  reels_preroll: {
    slotId: 'cf_slot_0010',
    label: 'CrimFig Reels — Pre-roll (9:16 Video)',
    recommended:
      'Recommended: Auto-injected by CrimFig Reels platform — no action needed.',
  },
};

export type CrimFigPlacement = keyof typeof CRIMFIG_PLACEMENTS;

interface CrimFigAdSlotProps {
  placement?: CrimFigPlacement;
  slotTagId?: string; // Canonical AdStation slot tag ID (`cf-slot-...`)
  publisherKey: string;
  apiBaseUrl?: string;
  responsive?: boolean;
  fallbackHtml?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function CrimFigAdSlot({
  placement = 'banner_top',
  slotTagId,
  publisherKey,
  apiBaseUrl,
  responsive = true,
  fallbackHtml,
  className,
  style,
}: CrimFigAdSlotProps) {
  const uid = useId().replace(/:/g, '');
  const slotConfig = CRIMFIG_PLACEMENTS[placement];
  const resolvedApiBase = (apiBaseUrl || DEFAULT_ADS_API_URL).replace(
    /\/+$/,
    '',
  );
  const resolvedSlotId = slotTagId || slotConfig?.slotId;

  useEffect(() => {
    try {
      ((window as any).cfPubQ = (window as any).cfPubQ || []).push({});
    } catch (_) {}
  }, [placement, slotTagId, publisherKey]);

  if (!resolvedSlotId) return null;

  return (
    <>
      <Script
        id={`cf-pub-loader-${uid}`}
        src={`${resolvedApiBase}/api/v1/delivery/pub-loader.js?pk=${encodeURIComponent(publisherKey)}`}
        strategy="afterInteractive"
        async
      />

      <ins
        id={`cf-pub-${placement}-${uid}`}
        className={`crimfig-pub-slot${className ? ` ${className}` : ''}`}
        style={{
          display: 'block',
          minHeight: slotConfig?.height || 60,
          maxWidth: slotConfig?.width || undefined,
          ...style,
        }}
        data-cf-network="crimfig"
        data-cf-publisher={publisherKey}
        data-ad-slot={resolvedSlotId}
        data-cf-placement={resolvedSlotId}
        data-cf-api-base={resolvedApiBase}
        data-cf-handle={placement}
        data-cf-responsive={responsive ? 'true' : 'false'}
        data-cf-format="auto"
        data-cf-fallback={fallbackHtml || undefined}
        data-cf-viewable="auto"
      />

      <Script id={`cf-pub-init-${uid}`} strategy="afterInteractive">
        {`(window.cfPubQ = window.cfPubQ || []).push({});`}
      </Script>
    </>
  );
}

// ── Verification Snippet Generators ───────────────────────────────────────
export function generateCrimFigDnsTxtRecord(
  verificationToken: string,
  domain: string,
): { host: string; recordType: string; value: string } {
  return {
    host: '@',
    recordType: 'TXT',
    value: `crimfig-site-verification=${verificationToken}`,
  };
}

export function generateCrimFigVerifyMetaTag(
  verificationToken: string,
): string {
  return `<!-- CrimFig Site Ownership Verification — add inside <head> -->
<meta name="crimfig-site-verification" content="${verificationToken}" />`;
}

// ── Embed Code Generator ─────────────────────────────────────────────────────
export function generateCrimFigEmbedCode({
  placement,
  slotTagId,
  publisherKey,
  domain,
  apiBaseUrl,
  mode = 'publisher_network',
  allowHomeNetworkFill = false,
}: {
  placement: CrimFigPlacement;
  slotTagId?: string;
  publisherKey: string;
  domain: string;
  apiBaseUrl?: string;
  mode?: 'publisher_network' | 'owned_site_direct';
  allowHomeNetworkFill?: boolean;
}): string {
  const slotConfig = CRIMFIG_PLACEMENTS[placement];
  if (!slotConfig && !slotTagId) return '';

  const resolvedApiBase = (apiBaseUrl || DEFAULT_ADS_API_URL).replace(
    /\/+$/,
    '',
  );
  const effectiveSlotId = slotTagId || slotConfig.slotId;

  const commentTitle =
    mode === 'owned_site_direct'
      ? 'CrimFig Ad Spaces — Owned-Site Direct Deal Slot (Free Barter Tier)'
      : `CrimFig Publisher Network — ${slotConfig?.label || effectiveSlotId}`;

  return `<!-- ${commentTitle} -->
<!-- Place this code inside your <body> where you want the ad to appear. -->

<script async src="${resolvedApiBase}/api/v1/delivery/pub-loader.js?pk=${publisherKey}" crossorigin="anonymous"></script>

<!-- ${slotConfig?.label || effectiveSlotId} | Domain: ${domain} | Slot Tag: ${effectiveSlotId} -->
<ins class="crimfig-pub-slot"
     style="display:block;min-height:${slotConfig?.height || 90}px;"
     data-cf-network="crimfig"
     data-cf-publisher="${publisherKey}"
     data-ad-slot="${effectiveSlotId}"
     data-cf-placement="${effectiveSlotId}"
     data-cf-api-base="${resolvedApiBase}"
     data-cf-handle="${placement}"
     data-cf-mode="${mode}"
     ${mode === 'owned_site_direct' ? `data-cf-network-fill="${allowHomeNetworkFill ? 'true' : 'false'}"` : ''}
     data-cf-responsive="true"
     data-cf-format="auto"></ins>

<script>
  (window.cfPubQ = window.cfPubQ || []).push({});
</script>`;
}
