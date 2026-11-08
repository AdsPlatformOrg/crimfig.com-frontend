"use client";
import { ImagePreparation } from "./ImagePreparation";
import { useDialog } from "../../lib/use-dialog";
import { MediaPreview } from "../MediaPreview";
import { adsApi } from '../../lib/ads-api-client';
import type { ReplaceCreativeInput } from '@crimfig/api-client/src/ads-operations';

import React, { useState } from "react";
import {
  X,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import type { AdType } from "../../lib/campaigns-api";

interface CreativeToReplace {
  id: string;
  campaignId: string;
  expectedRevision?: number;
  headline?: string | null;
  bodyText?: string | null;
  ctaText?: string | null;
  destinationUrl: string;
  imageUrl?: string;
  videoUrl?: string;
  adType?: AdType;
  adFormat?: "banner" | "card" | "video" | "interstitial";
  mediaFormat?: "image" | "gif" | "video";
  mediaAssetId?: string;
  imageSpecs?: {width:number;height:number;bytes:number;mimeType?:string};
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
  const [headline, setHeadline] = useState(creative?.headline || "");
  const [bodyText, setBodyText] = useState(creative?.bodyText || "");
  const [ctaText, setCtaText] = useState(creative?.ctaText || "");
  const [destinationUrl, setDestinationUrl] = useState(
    creative?.destinationUrl || "",
  );
  const isExistingImage = creative?.adType === 'image' || (!creative?.adType && Boolean(creative?.imageUrl));
  const [mediaAssetId, setMediaAssetId] = useState<string | undefined>(isExistingImage ? creative?.mediaAssetId : undefined);
  const [mediaUrl, setMediaUrl] = useState(isExistingImage ? creative?.imageUrl || '' : '');
  const [preparedFormat, setPreparedFormat] = useState<"card" | "banner">(
    creative?.adFormat === "banner" ? "banner" : "card",
  );
  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fieldId = React.useId();
  const panel = useDialog(isOpen && Boolean(creative), onClose);

  if (!isOpen || !creative) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!mediaAssetId) throw new Error("Upload a prepared replacement image before submitting.");
      const payload: ReplaceCreativeInput = {
        expectedRevision: creative.expectedRevision ?? 1,
        requestId: crypto.randomUUID(),
        headline: headline.trim() || undefined,
        bodyText: bodyText.trim() || undefined,
        ctaText: ctaText.trim() || undefined,
        destinationUrl,
        adType: "image",
        adFormat: preparedFormat,
        mediaAssetId,
      };

      const updated = await adsApi().replaceCreative(creative.id, payload);
      if (!updated.id)
        throw new Error("Replacement could not be confirmed.");
      onReplaceSuccess(updated);
      onClose();
    } catch (err: any) {
      setError(
        err instanceof Error
          ? err.message
          : "Replacement could not be confirmed.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.65)",
        backdropFilter: "blur(4px)",
        zIndex: 1300,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label="Replace Rejected Creative Asset"
        tabIndex={-1}
        style={{
          width: "100%",
          boxSizing: "border-box",
          maxWidth: "540px",
          borderRadius: "16px",
          backgroundColor: "var(--bg-elevated)",
          border: "1px solid var(--border-subtle)",
          boxShadow: "var(--shadow-xl)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          maxHeight: "90vh",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid var(--border-subtle)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <RefreshCw
              style={{ width: 18, height: 18, color: "var(--color-crimson)" }}
            />
            <h3
              style={{
                fontSize: "16px",
                fontWeight: 700,
                color: "var(--text-primary)",
                margin: 0,
              }}
            >
              Replace Rejected Creative Asset
            </h3>
          </div>
          <Button
            type="button"
            aria-label="Close replacement dialog"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-muted)",
              display: "flex",
              padding: "4px",
            }}
          >
            <X style={{ width: 18, height: 18 }} />
          </Button>
        </div>

        {/* Content & Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            overflowY: "auto",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {/* Reason Alert Banner */}
          <div
            style={{
              padding: "14px 16px",
              borderRadius: "10px",
              backgroundColor: "var(--color-error-bg)",
              border: "1px solid rgba(220, 38, 38, 0.2)",
              display: "flex",
              gap: "12px",
              alignItems: "flex-start",
            }}
          >
            <AlertCircle
              style={{
                width: 18,
                height: 18,
                color: "var(--color-error)",
                flexShrink: 0,
                marginTop: "2px",
              }}
            />
            <div>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "var(--color-error)",
                }}
              >
                Moderation Feedback
              </div>
              <p
                style={{
                  fontSize: "12px",
                  color: "var(--text-primary)",
                  margin: "4px 0 0",
                  lineHeight: 1.5,
                }}
              >
                {creative.rejectionReason ||
                  "Asset failed compliance check. Please provide a compliant replacement creative below to resume ad delivery."}
              </p>
            </div>
          </div>

          {/* Ad type */}
          <div>
              <p>Prepare replacement image</p>
              <ImagePreparation
                currentUrl={mediaUrl} currentSpecs={isExistingImage ? creative.imageSpecs : undefined}
                onBusyChange={setUploading}
                onUploaded={(asset) => {
                  setMediaAssetId(asset.assetId);
                  setMediaUrl(asset.cdnUrl);
                  setPreparedFormat(asset.adFormat);
                }}
              />
              {uploading && (
                <p
                  role="status"
                  style={{
                    margin: "6px 0 0",
                    fontSize: "12px",
                    color: "var(--text-muted)",
                  }}
                >
                  <Loader2 size={12} aria-hidden="true" /> Uploading…
                </p>
              )}
              {mediaUrl && (
                <div style={{ marginTop: "8px" }}>
                  <MediaPreview source={mediaUrl} />
                </div>
              )}
              {mediaAssetId && !uploading && (
                <p
                  style={{
                    margin: "6px 0 0",
                    fontSize: "11px",
                    color: "var(--color-success)",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <CheckCircle2 size={12} aria-hidden="true" /> Replacement
                  asset ready.
                </p>
              )}
            </div>


          {/* Headline */}
          <div>
            <label
              htmlFor={`${fieldId}-headline`}
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: 600,
                color: "var(--text-secondary)",
                marginBottom: "6px",
              }}
            >
              Headline{" "}
              (optional) ·
              Max 100 characters
            </label>
            <Input
              id={`${fieldId}-headline`}
              type="text"
              maxLength={100}
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "8px",
                border: "1px solid var(--border-subtle)",
                backgroundColor: "var(--bg-page)",
                color: "var(--text-primary)",
                fontSize: "13px",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Destination URL */}
          <div>
            <label
              htmlFor={`${fieldId}-destination`}
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: 600,
                color: "var(--text-secondary)",
                marginBottom: "6px",
              }}
            >
              Click Destination URL
            </label>
            <Input
              id={`${fieldId}-destination`}
              type="url"
              required
              value={destinationUrl}
              onChange={(e) => setDestinationUrl(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "8px",
                border: "1px solid var(--border-subtle)",
                backgroundColor: "var(--bg-page)",
                color: "var(--text-primary)",
                fontSize: "13px",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* CTA Text */}
          <div>
            <label
              htmlFor={`${fieldId}-cta`}
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: 600,
                color: "var(--text-secondary)",
                marginBottom: "6px",
              }}
            >
              Call-to-Action (CTA) Button Text
            </label>
            <Input
              id={`${fieldId}-cta`}
              type="text"
              value={ctaText}
              onChange={(e) => setCtaText(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "8px",
                border: "1px solid var(--border-subtle)",
                backgroundColor: "var(--bg-page)",
                color: "var(--text-primary)",
                fontSize: "13px",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Form Actions */}
          <div
            style={{
              paddingTop: "16px",
              borderTop: "1px solid var(--border-subtle)",
              display: "flex",
              justifyContent: "flex-end",
              gap: "12px",
            }}
          >
            <Button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: "1px solid var(--border-subtle)",
                backgroundColor: "var(--bg-page)",
                color: "var(--text-secondary)",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: "8px 20px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "var(--color-crimson)",
                color: "#FFFFFF",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "var(--shadow-crimson)",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <RefreshCw style={{ width: 14, height: 14 }} />
              <span>
                {isSubmitting ? "Submitting..." : "Submit Replacement Asset"}
              </span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
