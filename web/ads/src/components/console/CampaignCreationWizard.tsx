"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Globe,
  Layers,
  Loader2,
  Plus,
  ShieldCheck,
  Sliders,
  Sparkles,
  Target,
} from "lucide-react";

import { Button } from "../ui/button";

import { Input } from "../ui/input";

import { Textarea } from "../ui/textarea";

import {
  CampaignWorkflowError,
  createCampaignWorkflow,
  loadCreationCapabilities,
  type CreationCapabilities,
} from "../../lib/campaigns-api";

import { getLocation } from "../../lib/locations-api";

import { ScheduleEditor } from "./ScheduleEditor";

import { MediaPreview } from "../MediaPreview";

import {
  allDay,
  inherited,
  validateSchedule,
  scheduleText,
  SCHEDULE_LABEL,
  type DailySchedule,
} from "../../lib/daily-schedule";

import { bidEstimate, readDraft, DRAFT_PREFIX } from "../../lib/campaign-draft";

import { dashboardSession } from "../../lib/session";

import { apiData } from "../../lib/api-data";

import {
  AdStackEditor,
  createStackDraft,
  type StackDraft,
} from "./AdStackEditor";

import { LocationTargeting } from "./LocationTargeting";

interface CampaignWizardProps {
  onCancel: () => void;

  onSuccess: (campaignId: string) => void;
}

const CATEGORIES = [
  "Technology",
  "Retail",
  "Finance",
  "Health",
  "Education",
  "Travel",
  "Entertainment",
  "Other",
];

export function CampaignCreationWizard({
  onCancel,
  onSuccess,
}: CampaignWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [capabilities, setCapabilities] = useState<CreationCapabilities | null>(
    null,
  );

  const [capabilityError, setCapabilityError] = useState("");

  // Step 1

  const [title, setTitle] = useState("");

  const [description, setDescription] = useState("");

  const [category, setCategory] = useState("Technology");

  // Step 2

  const [stacks, setStacks] = useState<StackDraft[]>([createStackDraft(1)]);

  // Step 3

  const [geoMode, setGeoMode] = useState<"global" | "targeted">("global");

  const [locations, setLocations] = useState<string[]>([]);

  const [devices, setDevices] = useState<string[]>(["desktop", "mobile"]);

  const [schedule, setSchedule] = useState<DailySchedule>(allDay());

  const [draftOwner, setDraftOwner] = useState<string | null>(null);

  const [draftNotice, setDraftNotice] = useState("Checking for a saved draft…");

  const [requestId, setRequestId] = useState("");

  const [savedCampaignId, setSavedCampaignId] = useState("");

  const [submissionUncertain, setSubmissionUncertain] = useState(false);

  const [mediaBusy, setMediaBusy] = useState(false);

  const maxVisited = useRef(1);
  maxVisited.current = Math.max(maxVisited.current, currentStep);
  const submitBusy = useRef(false),
    form = useRef<HTMLDivElement>(null);

  const [frequencyCap, setFrequencyCap] = useState(5);

  // Step 4

  const [pricingModel, setPricingModel] = useState<"cpm" | "cpc">("cpm");

  const [budgetUsd, setBudgetUsd] = useState(25);

  const [dailyBudgetUsd, setDailyBudgetUsd] = useState(5);

  const [cpmBidCents, setCpmBidCents] = useState(50);

  const [cpcBidCents, setCpcBidCents] = useState(10);

  const [locationNames, setLocationNames] = useState<Record<string, string>>(
    {},
  );

  useEffect(() => {
    let active = true;
    void dashboardSession()
      .getProfile()
      .then(async (profile) => {
        let draft;
        try {
          draft = readDraft(localStorage, profile.userId);
        } catch {
          if (active)
            setDraftNotice(
              "Saved draft could not be read. This form is available without recovery.",
            );
        }

        if (draft) {
          const recovered = await Promise.all(
            draft.stacks.map(async (stack: any) => ({
              ...stack,
              schedule: stack.schedule || inherited(),
              ads: await Promise.all(
                stack.ads.map(async (ad: any) => {
                  if (!ad.mediaAssetId) return { ...ad, mediaUrl: undefined };

                  try {
                    const asset = await apiData<any>(
                      `/api/v1/uploads/assets/${encodeURIComponent(ad.mediaAssetId)}`,
                    );
                    return {
                      ...ad,
                      mediaUrl: asset.cdnUrl,
                      imageInfo: {
                        width: asset.width,
                        height: asset.height,
                        bytes: asset.bytes, mimeType:asset.mimeType,
                      },
                    };
                  } catch {
                    return {
                      ...ad,
                      mediaAssetId: undefined,
                      mediaUrl: undefined,
                      imageInfo: undefined,
                    };
                  }
                }),
              ),
            })),
          );

          if (!active) return;
          setTitle(draft.title || "");
          setDescription(draft.description || "");
          setCategory(draft.category || "Technology");
          setStacks(recovered);
          setGeoMode(draft.geoMode === "targeted" ? "targeted" : "global");
          setLocations(draft.locations || []);
          setDevices(draft.devices || ["desktop", "mobile"]);
          setSchedule(draft.schedule || allDay());
          setFrequencyCap(draft.frequencyCap || 5);
          setPricingModel(draft.pricingModel === "cpc" ? "cpc" : "cpm");
          setBudgetUsd(draft.budgetUsd ?? 25);
          setDailyBudgetUsd(draft.dailyBudgetUsd ?? 5);
          setCpmBidCents(draft.cpmBidCents ?? 50);
          setCpcBidCents(draft.cpcBidCents ?? 10);
          setRequestId(draft.requestId || crypto.randomUUID());
          setSavedCampaignId(draft.savedCampaignId || "");
          setSubmissionUncertain(!!draft.submissionUncertain);
          setDraftNotice(
            "Draft restored for this account. Uploaded media was rechecked. Reselect a source image only if you want to crop it again.",
          );
        } else if (active) {
          setRequestId(crypto.randomUUID());
          setDraftNotice(
            "Your draft is saved on this device for this account. Source images stay in memory only.",
          );
        }

        if (active) setDraftOwner(profile.userId);
      })
      .catch(() => {
        if (active) {
          setRequestId(crypto.randomUUID());
          setDraftNotice(
            "Draft saving is unavailable. Keep this tab open to retain your work.",
          );
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!draftOwner) return;
    const timer = setTimeout(() => {
      const session = dashboardSession().getSnapshot();
      if (session.status !== 'authenticated' || session.signOut) return;
      try {
        localStorage.setItem(
          DRAFT_PREFIX + draftOwner,
          JSON.stringify({
            version: 1,
            savedAt: Date.now(),
            title,
            description,
            category,
            stacks,
            geoMode,
            locations,
            devices,
            schedule,
            frequencyCap,
            pricingModel,
            budgetUsd,
            dailyBudgetUsd,
            cpmBidCents,
            cpcBidCents,
            requestId,
            savedCampaignId,
            submissionUncertain,
          }),
        );
      } catch {
        setDraftNotice(
          "This device could not save the draft. Keep the tab open.",
        );
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [
    draftOwner,
    title,
    description,
    category,
    stacks,
    geoMode,
    locations,
    devices,
    schedule,
    frequencyCap,
    pricingModel,
    budgetUsd,
    dailyBudgetUsd,
    cpmBidCents,
    cpcBidCents,
    requestId,
    savedCampaignId,
    submissionUncertain,
  ]);

  useEffect(() => {
    const heading = form.current?.querySelector<HTMLElement>(
      `#step-${currentStep}-heading`,
    );
    heading?.setAttribute("tabindex", "-1");
    heading?.focus({ preventScroll: true });
    heading?.scrollIntoView({ block: "start", behavior: "instant" });
  }, [currentStep]);

  useEffect(() => {
    form.current
      ?.querySelectorAll("[data-inline-error]")
      .forEach((e) => e.remove());
    form.current?.querySelectorAll('[aria-invalid="true"]').forEach((e) => {
      if (!e.closest(".cf-schedule")) {
        e.removeAttribute("aria-invalid");
        e.removeAttribute("aria-describedby");
      }
    });

    if (!error) return;
    let bad: HTMLElement | null = null;

    for (const input of Array.from(
      form.current?.querySelectorAll<HTMLInputElement>("input") ?? [],
    )) {
      if (input.type === "url") {
        try {
          const url = new URL(input.value);
          if (
            !["https:", "http:"].includes(url.protocol) ||
            url.username ||
            url.password
          )
            throw Error();
        } catch {
          bad = input;
          break;
        }
      }

      if (input.dataset.required === "text-headline" && !input.value.trim()) {
        bad = input;
        break;
      }

      if (input.id === "campaign-title" && !input.value.trim()) {
        bad = input;
        break;
      }
    }

    bad ??=
      form.current?.querySelector<HTMLElement>('[aria-invalid="true"]') ?? null;

    if (bad) {
      const message = document.createElement("span");
      message.id = "campaign-field-error";
      message.dataset.inlineError = "true";
      message.textContent = error;
      message.style.color = "var(--color-error)";
      bad.setAttribute("aria-invalid", "true");
      bad.setAttribute("aria-describedby", message.id);
      bad.insertAdjacentElement("afterend", message);
      bad.focus();
      bad.scrollIntoView({ block: "center" });
    }
  }, [error, currentStep]);

  async function reconcile() {
    setError(null);
    try {
      const result = await apiData<any>(
        `/api/v1/campaigns/creation-request/${encodeURIComponent(requestId)}`,
      );
      if (result?.id) {
        setSavedCampaignId(result.id);
        setError(
          `Saved campaign ${result.id}: ${result.moderationStatus}. Check this campaign before making further changes; no write was repeated.`,
        );
      } else {
        setSubmissionUncertain(false);
        setError(
          "No campaign was found for this request. You can submit again with the same request ID.",
        );
      }
    } catch {
      setError(
        "The service could not confirm the campaign status. Your draft and request ID are retained.",
      );
    }
  }

  useEffect(() => {
    let active = true;

    void loadCreationCapabilities()
      .then((data) => {
        if (active) setCapabilities(data);
      })

      .catch((err) => {
        if (active)
          setCapabilityError(
            err instanceof Error
              ? err.message
              : "Creative capabilities are unavailable.",
          );
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const allIds = [
      ...new Set([...locations, ...stacks.flatMap((stack) => stack.locations)]),
    ];

    const missing = allIds.filter((id) => !locationNames[id]);

    if (missing.length === 0) return;

    let active = true;

    void Promise.all(
      missing.map((id) => getLocation(id).catch(() => null)),
    ).then((places) => {
      if (!active) return;

      setLocationNames((current) => {
        const next = { ...current };

        for (const place of places) if (place) next[place.id] = place.name;

        return next;
      });
    });

    return () => {
      active = false;
    };
  }, [locations, stacks, locationNames]);

  const allLocations = useMemo(() => {
    const ids = new Set<string>();

    for (const id of locations) ids.add(id);

    for (const stack of stacks) {
      if (stack.geoMode === "targeted")
        for (const id of stack.locations) ids.add(id);
    }

    return [...ids];
  }, [locations, stacks]);

  function validateStep(step: number): boolean {
    setError(null);

    if (step === 1) {
      if (!title.trim()) {
        setError("Enter a campaign title so you can identify this campaign.");
        return false;
      }

      if (title.trim().length > 255) {
        setError("Campaign title must be 255 characters or fewer.");
        return false;
      }

      return true;
    }

    if (step === 2) {
      if (stacks.length === 0) {
        setError("Add at least one ad stack.");
        return false;
      }

      for (const stack of stacks) {
        try {
          validateSchedule(stack.schedule, true);
        } catch (e) {
          setError(`${stack.name}: ${(e as Error).message}`);
          return false;
        }

        if (!stack.name.trim()) {
          setError("Every ad stack needs a name.");
          return false;
        }

        if (stack.ads.length === 0) {
          setError(`${stack.name} needs at least one ad.`);
          return false;
        }

        for (let index = 0; index < stack.ads.length; index += 1) {
          const ad = stack.ads[index];

          const label = `${stack.name}, ad ${index + 1}`;

          if (ad.adType === "text" && !ad.headline.trim()) {
            setError(`${label}: enter a headline for the text ad.`);
            return false;
          }

          if (ad.headline.trim().length > 100) {
            setError(`${label}: headline must be 100 characters or fewer.`);
            return false;
          }

          if (!ad.destinationUrl.trim()) {
            setError(`${label}: enter a destination URL.`);
            return false;
          }

          try {
            const url = new URL(ad.destinationUrl.trim());

            if (
              !["http:", "https:"].includes(url.protocol) ||
              url.username ||
              url.password
            )
              throw new Error();
          } catch {
            setError(`${label}: enter a valid http(s) destination URL.`);

            return false;
          }

          if (ad.adType !== "text" && !ad.mediaAssetId) {
            setError(`${label}: upload a ${ad.adType} asset.`);
            return false;
          }

          if (ad.adType === "video" && !capabilities?.videoAuthoringEnabled) {
            setError(`${label}: video authoring is not available yet.`);
            return false;
          }
        }

        if (
          stack.geoMode === "targeted" &&
          !capabilities?.geoTargetingEnabled
        ) {
          setError(
            "Location targeting is not available yet. Use Global or inherited geography for each stack.",
          );
          return false;
        }

        if (stack.geoMode === "targeted" && stack.locations.length === 0) {
          setError(
            `${stack.name}: choose at least one location, or inherit/global.`,
          );
          return false;
        }
      }

      return true;
    }

    if (step === 3) {
      try {
        validateSchedule(schedule);
      } catch (e) {
        setError((e as Error).message);
        return false;
      }

      if (devices.length === 0) {
        setError("Choose at least one device category.");
        return false;
      }

      if (geoMode === "targeted" && !capabilities?.geoTargetingEnabled) {
        setError("Location targeting is not available yet. Select Global.");
        return false;
      }

      if (geoMode === "targeted" && locations.length === 0) {
        setError("Choose at least one campaign location, or select Global.");
        return false;
      }

      return true;
    }

    if (step === 4) {
      if (!Number.isFinite(budgetUsd) || budgetUsd < 5) {
        setError("Minimum campaign budget is $5.00 USD.");
        return false;
      }

      if (!Number.isFinite(dailyBudgetUsd) || dailyBudgetUsd < 1) {
        setError("Daily budget must be at least $1.00.");
        return false;
      }

      if (Number.isFinite(dailyBudgetUsd) && dailyBudgetUsd > budgetUsd) {
        setError("Daily budget cannot exceed the total campaign budget.");
        return false;
      }

      if (
        pricingModel === "cpm" &&
        (!Number.isSafeInteger(cpmBidCents) || cpmBidCents < 50)
      ) {
        setError("Minimum CPM bid is $0.50 per 1,000 viewable impressions.");
        return false;
      }

      if (
        pricingModel === "cpc" &&
        (!Number.isSafeInteger(cpcBidCents) || cpcBidCents < 10)
      ) {
        setError("Minimum CPC bid is $0.10 per click.");
        return false;
      }

      return true;
    }

    return true;
  }

  function next() {
    if (validateStep(currentStep))
      setCurrentStep((step) => Math.min(step + 1, 5));
  }

  function back() {
    setError(null);

    setCurrentStep((step) => Math.max(step - 1, 1));
  }

  async function submit() {
    if (
      submitBusy.current ||
      mediaBusy ||
      submissionUncertain ||
      savedCampaignId
    )
      return;

    if (
      !validateStep(1) ||
      !validateStep(2) ||
      !validateStep(3) ||
      !validateStep(4)
    )
      return;

    submitBusy.current = true;
    setIsSubmitting(true);
    setSubmissionUncertain(true);

    if (draftOwner) {
      try {
        const prior = readDraft(localStorage, draftOwner);
        if (prior)
          localStorage.setItem(
            DRAFT_PREFIX + draftOwner,
            JSON.stringify({ ...prior, submissionUncertain: true, requestId }),
          );
      } catch {
        /* In-memory guard remains. */
      }
    }

    setError(null);

    try {
      const campaignId = await createCampaignWorkflow(
        {
          title: title.trim(),

          description: description.trim() || undefined,

          category,

          budgetUsd,

          dailyBudgetUsd,

          costPerImpressionCents: cpmBidCents,

          costPerClickCents: cpcBidCents,

          pricingModel,

          format: "card",

          targetDevices: devices,

          schedule,
          requestId,

          frequencyCapPerDay: frequencyCap,

          geoMode,

          locations: geoMode === "targeted" ? locations : undefined,
        },

        stacks.map((stack) => ({
          name: stack.name.trim(),

          geoMode: stack.geoMode,

          locations: stack.locations,

          targetDevices: stack.targetDevices,

          targetHours: stack.targetHours,
          schedule: stack.schedule,

          ads: stack.ads.map((ad) => ({
            adType: ad.adType,

            headline: ad.headline.trim() || undefined,

            bodyText: ad.bodyText.trim() || undefined,

            ctaText: ad.ctaText.trim() || undefined,

            destinationUrl: ad.destinationUrl.trim(),

            adFormat: ad.adFormat || "card",

            mediaAssetId: ad.mediaAssetId,
          })),
        })),
      );

      if (draftOwner) localStorage.removeItem(DRAFT_PREFIX + draftOwner);
      setDraftOwner(null);
      onSuccess(campaignId);
    } catch (err) {
      if (err instanceof CampaignWorkflowError) {
        setSavedCampaignId(err.campaignId);

        setError(
          `Your campaign was saved, but review submission needs reconciliation. Campaign ID: ${err.campaignId}. Refresh your campaign list before retrying.`,
        );
      } else {
        setError(
          err instanceof Error
            ? err.message
            : "Campaign creation could not be confirmed. Please retry.",
        );
      }
    } finally {
      submitBusy.current = false;
      setIsSubmitting(false);
    }
  }

  function updateStack(nextStack: StackDraft) {
    setStacks((current) =>
      current.map((stack) => (stack.key === nextStack.key ? nextStack : stack)),
    );
  }

  function addStack() {
    setStacks((current) => [...current, createStackDraft(current.length + 1)]);
  }

  function removeStack(key: string) {
    setStacks((current) =>
      current.length <= 1
        ? current
        : current.filter((stack) => stack.key !== key),
    );
  }

  const stackCount = stacks.length;

  const adCount = stacks.reduce((total, stack) => total + stack.ads.length, 0);

  const effectiveCount = stacks.filter(
    (stack) =>
      stack.geoMode !== "inherit" ||
      stack.targetDevices.length > 0 ||
      stack.schedule.mode !== "inherit",
  ).length;

  return (
    <div
      ref={form}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "22px",
        maxWidth: "1080px",
        margin: "0 auto",
        width: "100%",
      }}
    >
      <header
        style={{
          padding: "22px",
          borderRadius: "16px",
          border: "1px solid var(--border-subtle)",
          background:
            "linear-gradient(135deg, rgba(212,20,58,0.06) 0%, rgba(23,27,42,0.04) 100%)",
        }}
      >
        <p
          style={{
            margin: "0 0 4px",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--color-crimson)",
          }}
        >
          Create campaign
        </p>

        <h2
          style={{
            margin: "0 0 6px",
            fontSize: "22px",
            fontWeight: 800,
            color: "var(--text-primary)",
          }}
        >
          Build your ad stacks
        </h2>

        <p
          style={{
            margin: 0,
            fontSize: "13px",
            color: "var(--text-secondary)",
            lineHeight: 1.5,
          }}
        >
          Add your ads, choose when they run, set a budget, and submit for
          review.
        </p>
      </header>

      <p role="status" style={{ fontSize: 13, color: "var(--text-secondary)" }}>
        {draftNotice}
      </p>

      <nav
        aria-label="Campaign creation steps"
        style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}
      >
        {[
          { step: 1, label: "Details" },

          { step: 2, label: "Ad stacks" },

          { step: 3, label: "Targeting" },

          { step: 4, label: "Budget" },

          { step: 5, label: "Review" },
        ].map((item) => {
          const active = currentStep === item.step;

          const done = currentStep > item.step;

          return (
            <button
              type="button"
              disabled={
                item.step > maxVisited.current || isSubmitting || mediaBusy
              }
              onClick={() => {
                setError(null);
                setCurrentStep(item.step);
              }}
              key={item.step}
              aria-current={active ? "step" : undefined}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 10px",
                borderRadius: "999px",
                border: `1px solid ${active ? "var(--color-crimson)" : "var(--border-subtle)"}`,
                background: active ? "var(--badge-bg)" : "transparent",
                color: active ? "var(--color-crimson)" : "var(--text-muted)",
                fontSize: "12px",
                fontWeight: 600,
              }}
            >
              {done ? (
                <CheckCircle2 size={12} aria-hidden="true" />
              ) : (
                <span aria-hidden="true">{item.step}</span>
              )}{" "}
              {item.label}
            </button>
          );
        })}
      </nav>

      {capabilityError && (
        <p
          role="status"
          style={{
            margin: 0,
            padding: "10px 14px",
            borderRadius: "10px",
            border: "1px solid var(--border-subtle)",
            background: "var(--bg-surface)",
            color: "var(--text-secondary)",
            fontSize: "12px",
          }}
        >
          {capabilityError} Video remains unavailable until the server
          capability is recovered.
        </p>
      )}

      {currentStep === 1 && (
        <section
          aria-labelledby="step-1-heading"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            padding: "20px",
            border: "1px solid var(--border-subtle)",
            borderRadius: "14px",
            background: "var(--bg-surface)",
          }}
        >
          <div>
            <h3
              id="step-1-heading"
              style={{ margin: "0 0 4px", fontSize: "17px", fontWeight: 700 }}
            >
              Campaign details
            </h3>

            <p
              style={{
                margin: 0,
                fontSize: "13px",
                color: "var(--text-secondary)",
              }}
            >
              Name the campaign and describe what you are promoting.
            </p>
          </div>

          <label
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "5px",
              fontSize: "12px",
              fontWeight: 600,
            }}
          >
            Campaign title{" "}
            <span style={{ color: "var(--color-crimson)" }}>*</span>
            <Input
              id="campaign-title"
              value={title}
              maxLength={255}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Spring product launch"
            />
          </label>

          <label
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "5px",
              fontSize: "12px",
              fontWeight: 600,
            }}
          >
            Description
            <Textarea
              value={description}
              rows={3}
              maxLength={5000}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="What should reviewers and publishers understand?"
            />
          </label>

          <label
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "5px",
              fontSize: "12px",
              fontWeight: 600,
            }}
          >
            Category
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              style={{
                minHeight: "44px",
                padding: "8px 10px",
                borderRadius: "8px",
                border: "1px solid var(--border-subtle)",
                background: "var(--bg-elevated)",
                color: "var(--text-primary)",
                font: "inherit",
                fontSize: "13px",
              }}
            >
              {CATEGORIES.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
        </section>
      )}

      {currentStep === 2 && (
        <section
          aria-labelledby="step-2-heading"
          style={{ display: "flex", flexDirection: "column", gap: "14px" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <h3
                id="step-2-heading"
                style={{ margin: "0 0 4px", fontSize: "17px", fontWeight: 700 }}
              >
                Ad stacks &amp; creatives
              </h3>

              <p
                style={{
                  margin: 0,
                  fontSize: "13px",
                  color: "var(--text-secondary)",
                }}
              >
                Each stack needs at least one complete ad. Text, Image, and
                Video may coexist in one stack.
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addStack}
            >
              <Plus size={14} aria-hidden="true" /> Add ad stack
            </Button>
          </div>

          {stacks.map((stack, index) => (
            <AdStackEditor
              key={stack.key}

              stack={stack}

              index={index}

              capabilities={capabilities}

              campaignSchedule={schedule}
              onBusyChange={setMediaBusy}

              canRemove={stacks.length > 1 && index > 0}

              onChange={updateStack}

              onRemove={() => removeStack(stack.key)}
            />
          ))}

          <div
            style={{
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
              fontSize: "12px",
              color: "var(--text-muted)",
            }}
          >
            <span>
              <Layers size={12} aria-hidden="true" /> {stackCount} stack
              {stackCount === 1 ? "" : "s"}
            </span>

            <span>·</span>

            <span>
              {adCount} ad{adCount === 1 ? "" : "s"}
            </span>

            <span>·</span>

            <span>{effectiveCount} with stack overrides</span>
          </div>
        </section>
      )}

      {currentStep === 3 && (
        <section
          aria-labelledby="step-3-heading"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
            padding: "20px",
            border: "1px solid var(--border-subtle)",
            borderRadius: "14px",
            background: "var(--bg-surface)",
          }}
        >
          <div>
            <h3
              id="step-3-heading"
              style={{ margin: "0 0 4px", fontSize: "17px", fontWeight: 700 }}
            >
              Audience &amp; targeting
            </h3>

            <p
              style={{
                margin: 0,
                fontSize: "13px",
                color: "var(--text-secondary)",
              }}
            >
              These campaign defaults apply to every stack. Unknown visitor
              geography never widens a targeted campaign.
            </p>
          </div>

          <div
            style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}
            role="group"
            aria-label="Campaign geography mode"
          >
            <button
              type="button"
              aria-pressed={geoMode === "global"}
              onClick={() => {
                setGeoMode("global");
                setLocations([]);
              }}
              style={{
                minHeight: "40px",
                padding: "8px 14px",
                borderRadius: "9px",
                border: `1px solid ${geoMode === "global" ? "var(--color-crimson)" : "var(--border-subtle)"}`,
                background:
                  geoMode === "global"
                    ? "var(--badge-bg)"
                    : "var(--bg-elevated)",
                color:
                  geoMode === "global"
                    ? "var(--color-crimson)"
                    : "var(--text-secondary)",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <Globe size={14} aria-hidden="true" /> Global
            </button>

            <button
              type="button"
              disabled={!capabilities?.geoTargetingEnabled}
              aria-pressed={geoMode === "targeted"}
              onClick={() => setGeoMode("targeted")}
              style={{
                opacity: capabilities?.geoTargetingEnabled ? 1 : 0.55,
                minHeight: "40px",
                padding: "8px 14px",
                borderRadius: "9px",
                border: `1px solid ${geoMode === "targeted" ? "var(--color-crimson)" : "var(--border-subtle)"}`,
                background:
                  geoMode === "targeted"
                    ? "var(--badge-bg)"
                    : "var(--bg-elevated)",
                color:
                  geoMode === "targeted"
                    ? "var(--color-crimson)"
                    : "var(--text-secondary)",
                fontWeight: 600,
                cursor: capabilities?.geoTargetingEnabled
                  ? "pointer"
                  : "not-allowed",
              }}
            >
              <Target size={14} aria-hidden="true" /> Target locations
            </button>
          </div>

          {!capabilities?.geoTargetingEnabled && (
            <p
              role="status"
              style={{ color: "var(--text-secondary)", fontSize: 13 }}
            >
              Global targeting is available. Specific locations will be enabled
              later.
            </p>
          )}

          {geoMode === "targeted" && (
            <LocationTargeting value={locations} onChange={setLocations} />
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "16px",
            }}
          >
            <fieldset
              style={{
                border: "1px solid var(--border-subtle)",
                borderRadius: "10px",
                padding: "12px",
                margin: 0,
              }}
            >
              <legend
                style={{ padding: "0 4px", fontSize: "12px", fontWeight: 600 }}
              >
                Device categories
              </legend>

              {["desktop", "mobile"].map((device) => (
                <label
                  key={device}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    minHeight: "36px",
                    fontSize: "13px",
                    color: "var(--text-secondary)",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={devices.includes(device)}
                    onChange={(event) =>
                      setDevices(
                        event.target.checked
                          ? [...devices, device]
                          : devices.filter((item) => item !== device),
                      )
                    }
                  />

                  {device === "desktop" ? "Desktop & laptop" : "Mobile"}
                </label>
              ))}
            </fieldset>

            <ScheduleEditor value={schedule} onChange={setSchedule} />

            <label
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                fontSize: "12px",
                fontWeight: 600,
              }}
            >
              Daily frequency cap: {frequencyCap}
              <input
                type="range"
                min={1}
                max={20}
                value={frequencyCap}
                onChange={(event) =>
                  setFrequencyCap(Number(event.target.value))
                }
                style={{ width: "100%", accentColor: "var(--color-crimson)" }}
              />
              <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>
                Maximum impressions per person per day.
              </span>
            </label>
          </div>
        </section>
      )}

      {currentStep === 4 && (
        <section
          aria-labelledby="step-4-heading"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
            padding: "20px",
            border: "1px solid var(--border-subtle)",
            borderRadius: "14px",
            background: "var(--bg-surface)",
          }}
        >
          <div>
            <h3
              id="step-4-heading"
              style={{ margin: "0 0 4px", fontSize: "17px", fontWeight: 700 }}
            >
              Budget &amp; pricing
            </h3>

            <p
              style={{
                margin: 0,
                fontSize: "13px",
                color: "var(--text-secondary)",
              }}
            >
              Budget and bid apply to every stack. Funds stay in escrow until
              verified delivery.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
            }}
          >
            {(["cpm", "cpc"] as const).map((model) => (
              <button
                key={model}
                type="button"
                aria-pressed={pricingModel === model}
                onClick={() => setPricingModel(model)}
                style={{
                  textAlign: "left",
                  padding: "14px",
                  borderRadius: "10px",
                  border: `2px solid ${pricingModel === model ? "var(--color-crimson)" : "var(--border-subtle)"}`,
                  background:
                    pricingModel === model
                      ? "var(--badge-bg)"
                      : "var(--bg-elevated)",
                  cursor: "pointer",
                }}
              >
                <span
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                  }}
                >
                  {model.toUpperCase()}
                </span>

                <span
                  style={{
                    display: "block",
                    marginTop: "4px",
                    fontSize: "11px",
                    color: "var(--text-secondary)",
                  }}
                >
                  {model === "cpm"
                    ? "Per 1,000 viewable impressions"
                    : "Per verified click"}
                </span>
              </button>
            ))}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
              gap: "12px",
            }}
          >
            <label
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "5px",
                fontSize: "12px",
                fontWeight: 600,
              }}
            >
              Total budget (USD)
              <Input
                type="number"
                min={5}
                step={1}
                value={budgetUsd}
                onChange={(event) => setBudgetUsd(Number(event.target.value))}
              />
              <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>
                Minimum $5.00
              </span>
            </label>

            <label
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "5px",
                fontSize: "12px",
                fontWeight: 600,
              }}
            >
              Daily target (USD)
              <Input
                type="number"
                min={1}
                step={1}
                value={dailyBudgetUsd}
                onChange={(event) =>
                  setDailyBudgetUsd(Number(event.target.value))
                }
              />
            </label>

            {pricingModel === "cpm" ? (
              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "5px",
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              >
                CPM bid (cents)
                <Input
                  type="number"
                  min={50}
                  step={5}
                  value={cpmBidCents}
                  onChange={(event) =>
                    setCpmBidCents(Number(event.target.value))
                  }
                />
                <span
                  style={{ fontSize: "10px", color: "var(--color-crimson)" }}
                >
                  ${(cpmBidCents / 100).toFixed(2)} per 1,000 views
                </span>
              </label>
            ) : (
              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "5px",
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              >
                CPC bid (cents)
                <Input
                  type="number"
                  min={10}
                  step={1}
                  value={cpcBidCents}
                  onChange={(event) =>
                    setCpcBidCents(Number(event.target.value))
                  }
                />
                <span
                  style={{ fontSize: "10px", color: "var(--color-crimson)" }}
                >
                  ${(cpcBidCents / 100).toFixed(2)} per click
                </span>
              </label>
            )}
          </div>

          <div
            style={{
              padding: "12px 14px",
              borderRadius: "10px",
              background: "rgba(16,185,129,0.08)",
              border: "1px solid rgba(16,185,129,0.25)",
              fontSize: "12px",
              color: "var(--text-secondary)",
            }}
          >
            <strong style={{ color: "var(--text-primary)" }}>
              Bid-based estimate (not guaranteed):
            </strong>{" "}
            {pricingModel === "cpm"
              ? `${bidEstimate(budgetUsd, cpmBidCents, "cpm")?.toLocaleString() ?? "—"} impressions`
              : `${bidEstimate(budgetUsd, cpcBidCents, "cpc")?.toLocaleString() ?? "—"} clicks`}
          </div>
        </section>
      )}

      {currentStep === 5 && (
        <section
          aria-labelledby="step-5-heading"
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          <div>
            <h3
              id="step-5-heading"
              style={{ margin: "0 0 4px", fontSize: "17px", fontWeight: 700 }}
            >
              Review &amp; submit
            </h3>

            <p
              style={{
                margin: 0,
                fontSize: "13px",
                color: "var(--text-secondary)",
              }}
            >
              Review each stack and its effective settings before submission.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "12px",
            }}
          >
            <SummaryCard
              label="Campaign"
              value={title || "Untitled"}
              lines={[
                `Category: ${category}`,
                `Budget: $${budgetUsd.toFixed(2)} USD`,
                `Daily target: $${dailyBudgetUsd.toFixed(2)} USD`,
                `Model: ${pricingModel.toUpperCase()}`,
                `Bid: $${((pricingModel === "cpm" ? cpmBidCents : cpcBidCents) / 100).toFixed(2)} per ${pricingModel === "cpm" ? "1,000 impressions" : "click"}`,
              ]}
            />

            <SummaryCard
              label="Creative"
              value={`${stacks.length} stack${stacks.length === 1 ? "" : "s"} · ${adCount} ad${adCount === 1 ? "" : "s"}`}
              lines={[
                `Types: ${[...new Set(stacks.flatMap((stack) => stack.ads.map((ad) => ad.adType)))].join(", ")}`,
                `Video: ${capabilities?.videoAuthoringEnabled ? "enabled" : "coming soon"}`,
              ]}
            />

            <SummaryCard
              label="Campaign targeting"

              value={
                geoMode === "global"
                  ? "Global"
                  : `${locations.length} location${locations.length === 1 ? "" : "s"}`
              }

              lines={[
                geoMode === "targeted"
                  ? locations.map((id) => locationNames[id] || id).join(", ")
                  : "No geographic restriction",

                `Devices: ${devices.join(", ") || "none"}`,

                `Schedule: ${scheduleText(schedule)}`,
                SCHEDULE_LABEL,
                `Frequency cap: ${frequencyCap} per day`,
              ]}
            />
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["Details", "Ad stacks", "Targeting", "Budget"].map((label, i) => (
              <Button
                key={label}
                variant="outline"
                size="sm"
                onClick={() => setCurrentStep(i + 1)}
              >
                Edit {label.toLowerCase()}
              </Button>
            ))}
          </div>

          {stacks.map((stack, index) => (
            <article
              key={stack.key}
              style={{
                border: "1px solid var(--border-subtle)",
                borderRadius: "12px",
                padding: "14px",
                background: "var(--bg-surface)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "8px",
                  flexWrap: "wrap",
                }}
              >
                <h4 style={{ margin: 0, fontSize: "14px", fontWeight: 700 }}>
                  {stack.name || `Ad Stack #${index + 1}`}
                </h4>

                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                  {stack.geoMode === "inherit"
                    ? "Inherits campaign settings"
                    : `Override: ${stack.geoMode}`}
                </span>
              </div>

              <p style={{ fontSize: 13 }}>
                {stack.schedule.mode === "inherit" ? "Inherited" : "Override"} ·{" "}
                {scheduleText(
                  stack.schedule.mode === "inherit" ? schedule : stack.schedule,
                )}{" "}
                · {SCHEDULE_LABEL}
              </p>

              <ul
                style={{
                  margin: "10px 0 0",
                  padding: 0,
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                }}
              >
                {stack.ads.map((ad, adIndex) => (
                  <li
                    key={ad.key}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      gap: "8px",
                      fontSize: "12px",
                      color: "var(--text-secondary)",
                    }}
                  >
                    <div style={{ minWidth: 0, width: "100%" }}>
                      {ad.mediaUrl && <MediaPreview source={ad.mediaUrl} />}
                      <p style={{ overflowWrap: "anywhere" }}>
                        Destination: {ad.destinationUrl}
                      </p>
                      {ad.imageInfo && (
                        <p>
                          {ad.imageInfo.width}×{ad.imageInfo.height}px ·{" "}
                          {(ad.imageInfo.bytes / 1000).toFixed(1)} KB
                        </p>
                      )}
                    </div>

                    <span
                      style={{
                        padding: "2px 7px",
                        borderRadius: "999px",
                        background: "var(--badge-bg)",
                        color: "var(--text-primary)",
                        fontSize: "10px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                      }}
                    >
                      {ad.adType}
                    </span>

                    <span
                      style={{ color: "var(--text-primary)", fontWeight: 600 }}
                    >
                      {ad.headline || `Ad ${adIndex + 1}`}
                    </span>
                  </li>
                ))}
              </ul>

              <div
                style={{
                  marginTop: "8px",
                  fontSize: "11px",
                  color: "var(--text-muted)",
                }}
              >
                {stack.geoMode === "targeted"
                  ? `Locations: ${stack.locations.map((id) => locationNames[id] || id).join(", ")}`
                  : "Geography: inherited"}

                {stack.targetDevices.length > 0
                  ? ` · Devices: ${stack.targetDevices.join(", ")}`
                  : ""}

                {stack.schedule.mode !== "inherit"
                  ? ` · Hours: ${stack.targetHours.join(", ")}`
                  : ""}
              </div>
            </article>
          ))}

          <div
            style={{
              padding: "12px 14px",
              borderRadius: "10px",
              background: "rgba(212,20,58,0.06)",
              border: "1px solid rgba(212,20,58,0.2)",
              display: "flex",
              gap: "8px",
              alignItems: "flex-start",
            }}
          >
            <ShieldCheck
              size={16}
              aria-hidden="true"
              style={{ marginTop: "1px", color: "var(--color-crimson)" }}
            />

            <p
              style={{
                margin: 0,
                fontSize: "12px",
                color: "var(--text-secondary)",
                lineHeight: 1.5,
              }}
            >
              Submission sends every stack to dual-reviewer moderation. It does
              not activate the campaign or imply approval. Your escrow remains
              refundable until verified delivery.
            </p>
          </div>
        </section>
      )}

      {error && (
        <div
          role="alert"
          style={{
            display: "flex",
            gap: "8px",
            alignItems: "flex-start",
            padding: "12px 14px",
            borderRadius: "10px",
            border: "1px solid rgba(180,35,24,0.25)",
            background: "rgba(180,35,24,0.06)",
            color: "var(--text-primary)",
            fontSize: "13px",
          }}
        >
          <AlertCircle
            size={16}
            aria-hidden="true"
            style={{ color: "var(--color-error, #B42318)", flexShrink: 0 }}
          />

          <span>{error}</span>
        </div>
      )}

      {(submissionUncertain || savedCampaignId) && (
        <div role="status">
          <p>
            Your campaign request ID is retained. Check the saved state before
            any retry.
          </p>
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={() => void reconcile()}
          >
            Check campaign status
          </Button>
          {savedCampaignId && <a href="/campaigns">Open saved campaigns</a>}
        </div>
      )}

      <footer
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          paddingTop: "16px",
          borderTop: "1px solid var(--border-subtle)",
        }}
      >
        <div style={{ display: "flex", gap: "8px" }}>
          {currentStep > 1 ? (
            <Button
              type="button"
              variant="outline"
              onClick={back}
              disabled={isSubmitting}
            >
              <ArrowLeft size={14} aria-hidden="true" /> Back
            </Button>
          ) : (
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}
        </div>

        {currentStep < 5 ? (
          <Button type="button" disabled={mediaBusy} onClick={next}>
            Continue <ArrowRight size={14} aria-hidden="true" />
          </Button>
        ) : (
          <Button
            type="button"
            onClick={() => void submit()}
            disabled={
              isSubmitting ||
              mediaBusy ||
              submissionUncertain ||
              !!savedCampaignId ||
              !requestId
            }
          >
            {isSubmitting ? (
              <>
                <Loader2 size={14} aria-hidden="true" /> Submitting…
              </>
            ) : (
              <>
                <Sparkles size={14} aria-hidden="true" /> Submit for review
              </>
            )}
          </Button>
        )}
      </footer>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  lines,
}: {
  label: string;
  value: string;
  lines: string[];
}) {
  return (
    <div
      style={{
        padding: "14px",
        border: "1px solid var(--border-subtle)",
        borderRadius: "10px",
        background: "var(--bg-surface)",
      }}
    >
      <span
        style={{
          display: "block",
          fontSize: "10px",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          color: "var(--text-muted)",
        }}
      >
        {label}
      </span>

      <strong
        style={{
          display: "block",
          margin: "4px 0 6px",
          fontSize: "14px",
          color: "var(--text-primary)",
        }}
      >
        {value}
      </strong>

      {lines.map((line) => (
        <span
          key={line}
          style={{
            display: "block",
            fontSize: "11px",
            color: "var(--text-secondary)",
            lineHeight: 1.5,
          }}
        >
          {line}
        </span>
      ))}
    </div>
  );
}
