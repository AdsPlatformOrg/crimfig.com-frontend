'use client';

import { useEffect, useMemo, useState } from 'react';
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
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import {
  CampaignWorkflowError,
  createCampaignWorkflow,
  loadCreationCapabilities,
  type CreationCapabilities,
} from '../../lib/campaigns-api';
import { getLocation } from '../../lib/locations-api';
import { AdStackEditor, createStackDraft, type StackDraft } from './AdStackEditor';
import { LocationTargeting } from './LocationTargeting';

interface CampaignWizardProps {
  onCancel: () => void;
  onSuccess: (campaignId: string) => void;
}

const CATEGORIES = ['Technology', 'Retail', 'Finance', 'Health', 'Education', 'Travel', 'Entertainment', 'Other'];

export function CampaignCreationWizard({ onCancel, onSuccess }: CampaignWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [capabilities, setCapabilities] = useState<CreationCapabilities | null>(null);
  const [capabilityError, setCapabilityError] = useState('');

  // Step 1
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Technology');

  // Step 2
  const [stacks, setStacks] = useState<StackDraft[]>([createStackDraft(1)]);

  // Step 3
  const [geoMode, setGeoMode] = useState<'global' | 'targeted'>('global');
  const [locations, setLocations] = useState<string[]>([]);
  const [devices, setDevices] = useState<string[]>(['desktop', 'mobile']);
  const [hours, setHours] = useState<number[]>([]);
  const [hoursText, setHoursText] = useState('');
  const [frequencyCap, setFrequencyCap] = useState(5);

  // Step 4
  const [pricingModel, setPricingModel] = useState<'cpm' | 'cpc'>('cpm');
  const [budgetUsd, setBudgetUsd] = useState(25);
  const [dailyBudgetUsd, setDailyBudgetUsd] = useState(5);
  const [cpmBidCents, setCpmBidCents] = useState(50);
  const [cpcBidCents, setCpcBidCents] = useState(10);

  const [locationNames, setLocationNames] = useState<Record<string, string>>({});

  useEffect(() => {
    let active = true;
    void loadCreationCapabilities()
      .then((data) => { if (active) setCapabilities(data); })
      .catch((err) => { if (active) setCapabilityError(err instanceof Error ? err.message : 'Creative capabilities are unavailable.'); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const allIds = [...new Set([...locations, ...stacks.flatMap((stack) => stack.locations)])];
    const missing = allIds.filter((id) => !locationNames[id]);
    if (missing.length === 0) return;
    let active = true;
    void Promise.all(missing.map((id) => getLocation(id).catch(() => null))).then((places) => {
      if (!active) return;
      setLocationNames((current) => {
        const next = { ...current };
        for (const place of places) if (place) next[place.id] = place.name;
        return next;
      });
    });
    return () => { active = false; };
  }, [locations, stacks, locationNames]);

  const allLocations = useMemo(() => {
    const ids = new Set<string>();
    for (const id of locations) ids.add(id);
    for (const stack of stacks) {
      if (stack.geoMode === 'targeted') for (const id of stack.locations) ids.add(id);
    }
    return [...ids];
  }, [locations, stacks]);

  function validateStep(step: number): boolean {
    setError(null);
    if (step === 1) {
      if (!title.trim()) { setError('Enter a campaign title so you can identify this campaign.'); return false; }
      if (title.trim().length > 255) { setError('Campaign title must be 255 characters or fewer.'); return false; }
      return true;
    }
    if (step === 2) {
      if (stacks.length === 0) { setError('Add at least one ad stack.'); return false; }
      for (const stack of stacks) {
        if (!stack.name.trim()) { setError('Every ad stack needs a name.'); return false; }
        if (stack.ads.length === 0) { setError(`${stack.name} needs at least one ad.`); return false; }
        for (let index = 0; index < stack.ads.length; index += 1) {
          const ad = stack.ads[index];
          const label = `${stack.name}, ad ${index + 1}`;
          if (ad.adType === 'text' && !ad.headline.trim()) { setError(`${label}: enter a headline for the text ad.`); return false; }
          if (ad.headline.trim().length > 100) { setError(`${label}: headline must be 100 characters or fewer.`); return false; }
          if (!ad.destinationUrl.trim()) { setError(`${label}: enter a destination URL.`); return false; }
          try {
            const url = new URL(ad.destinationUrl.trim());
            if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) throw new Error();
          } catch {
            setError(`${label}: enter a valid http(s) destination URL.`);
            return false;
          }
          if (ad.adType !== 'text' && !ad.mediaAssetId) { setError(`${label}: upload a ${ad.adType} asset.`); return false; }
          if (ad.adType === 'video' && !capabilities?.videoAuthoringEnabled) { setError(`${label}: video authoring is not available yet.`); return false; }
        }
        if (stack.geoMode === 'targeted' && !capabilities?.geoTargetingEnabled) { setError('Location targeting is not available yet. Use Global or inherited geography for each stack.'); return false; }
        if (stack.geoMode === 'targeted' && stack.locations.length === 0) { setError(`${stack.name}: choose at least one location, or inherit/global.`); return false; }
      }
      return true;
    }
    if (step === 3) {
      if (devices.length === 0) { setError('Choose at least one device category.'); return false; }
      if (geoMode === 'targeted' && !capabilities?.geoTargetingEnabled) { setError('Location targeting is not available yet. Select Global.'); return false; }
      if (geoMode === 'targeted' && locations.length === 0) { setError('Choose at least one campaign location, or select Global.'); return false; }
      return true;
    }
    if (step === 4) {
      if (!Number.isFinite(budgetUsd) || budgetUsd < 5) { setError('Minimum campaign budget is $5.00 USD.'); return false; }
      if (Number.isFinite(dailyBudgetUsd) && dailyBudgetUsd > budgetUsd) { setError('Daily budget cannot exceed the total campaign budget.'); return false; }
      if (pricingModel === 'cpm' && cpmBidCents < 50) { setError('Minimum CPM bid is $0.50 per 1,000 viewable impressions.'); return false; }
      if (pricingModel === 'cpc' && cpcBidCents < 10) { setError('Minimum CPC bid is $0.10 per click.'); return false; }
      return true;
    }
    return true;
  }

  function next() {
    if (validateStep(currentStep)) setCurrentStep((step) => Math.min(step + 1, 5));
  }

  function back() {
    setError(null);
    setCurrentStep((step) => Math.max(step - 1, 1));
  }

  async function submit() {
    if (!validateStep(1) || !validateStep(2) || !validateStep(3) || !validateStep(4)) return;
    setIsSubmitting(true);
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
          format: 'card',
          targetDevices: devices,
          targetHours: hours,
          frequencyCapPerDay: frequencyCap,
          geoMode,
          locations: geoMode === 'targeted' ? locations : undefined,
        },
        stacks.map((stack) => ({
          name: stack.name.trim(),
          geoMode: stack.geoMode,
          locations: stack.locations,
          targetDevices: stack.targetDevices,
          targetHours: stack.targetHours,
          ads: stack.ads.map((ad) => ({
            adType: ad.adType,
            headline: ad.headline.trim() || undefined,
            bodyText: ad.bodyText.trim() || undefined,
            ctaText: ad.ctaText.trim() || undefined,
            destinationUrl: ad.destinationUrl.trim(),
            adFormat: 'card',
            mediaAssetId: ad.mediaAssetId,
          })),
        })),
      );
      onSuccess(campaignId);
    } catch (err) {
      if (err instanceof CampaignWorkflowError) {
        setError(`Your campaign was saved, but review submission needs reconciliation. Campaign ID: ${err.campaignId}. Refresh your campaign list before retrying.`);
      } else {
        setError(err instanceof Error ? err.message : 'Campaign creation could not be confirmed. Please retry.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  function updateStack(nextStack: StackDraft) {
    setStacks((current) => current.map((stack) => (stack.key === nextStack.key ? nextStack : stack)));
  }

  function addStack() {
    setStacks((current) => [...current, createStackDraft(current.length + 1)]);
  }

  function removeStack(key: string) {
    setStacks((current) => (current.length <= 1 ? current : current.filter((stack) => stack.key !== key)));
  }

  function applyHours(value: string) {
    setHoursText(value);
    const parsed = value.split(',').map((part) => part.trim()).filter(Boolean).map(Number);
    setHours([...new Set(parsed.filter((hour) => Number.isInteger(hour) && hour >= 0 && hour <= 23))].sort((a, b) => a - b));
  }

  const stackCount = stacks.length;
  const adCount = stacks.reduce((total, stack) => total + stack.ads.length, 0);
  const effectiveCount = stacks.filter((stack) => stack.geoMode !== 'inherit' || stack.targetDevices.length > 0 || stack.targetHours.length > 0).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', maxWidth: '1080px', margin: '0 auto', width: '100%' }}>
      <header style={{ padding: '22px', borderRadius: '16px', border: '1px solid var(--border-subtle)', background: 'linear-gradient(135deg, rgba(212,20,58,0.06) 0%, rgba(23,27,42,0.04) 100%)' }}>
        <p style={{ margin: '0 0 4px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-crimson)' }}>Create campaign</p>
        <h2 style={{ margin: '0 0 6px', fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)' }}>Build your ad stacks</h2>
        <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          Group Text, Image, and Video ads into named stacks. Campaign budget and bid stay campaign-level; stacks organize content and optional non-financial overrides.
        </p>
      </header>

      <nav aria-label="Campaign creation steps" style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {[
          { step: 1, label: 'Details' },
          { step: 2, label: 'Ad stacks' },
          { step: 3, label: 'Targeting' },
          { step: 4, label: 'Budget' },
          { step: 5, label: 'Review' },
        ].map((item) => {
          const active = currentStep === item.step;
          const done = currentStep > item.step;
          return (
            <div key={item.step} aria-current={active ? 'step' : undefined} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 10px', borderRadius: '999px', border: `1px solid ${active ? 'var(--color-crimson)' : 'var(--border-subtle)'}`, background: active ? 'var(--badge-bg)' : 'transparent', color: active ? 'var(--color-crimson)' : 'var(--text-muted)', fontSize: '12px', fontWeight: 600 }}>
              {done ? <CheckCircle2 size={12} aria-hidden="true" /> : <span aria-hidden="true">{item.step}</span>} {item.label}
            </div>
          );
        })}
      </nav>

      {capabilityError && <p role="status" style={{ margin: 0, padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-secondary)', fontSize: '12px' }}>{capabilityError} Video remains unavailable until the server capability is recovered.</p>}

      {currentStep === 1 && (
        <section aria-labelledby="step-1-heading" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '20px', border: '1px solid var(--border-subtle)', borderRadius: '14px', background: 'var(--bg-surface)' }}>
          <div>
            <h3 id="step-1-heading" style={{ margin: '0 0 4px', fontSize: '17px', fontWeight: 700 }}>Campaign details</h3>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>Name the campaign and describe what you are promoting.</p>
          </div>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '12px', fontWeight: 600 }}>
            Campaign title <span style={{ color: 'var(--color-crimson)' }}>*</span>
            <Input value={title} maxLength={255} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Spring product launch" />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '12px', fontWeight: 600 }}>
            Description
            <Textarea value={description} rows={3} maxLength={5000} onChange={(event) => setDescription(event.target.value)} placeholder="What should reviewers and publishers understand?" />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '12px', fontWeight: 600 }}>
            Category
            <select value={category} onChange={(event) => setCategory(event.target.value)} style={{ minHeight: '44px', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', font: 'inherit', fontSize: '13px' }}>
              {CATEGORIES.map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </label>
        </section>
      )}

      {currentStep === 2 && (
        <section aria-labelledby="step-2-heading" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
            <div>
              <h3 id="step-2-heading" style={{ margin: '0 0 4px', fontSize: '17px', fontWeight: 700 }}>Ad stacks &amp; creatives</h3>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>Each stack needs at least one complete ad. Text, Image, and Video may coexist in one stack.</p>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addStack}>
              <Plus size={14} aria-hidden="true" /> Add ad stack
            </Button>
          </div>
          {stacks.map((stack, index) => (
            <AdStackEditor
              key={stack.key}
              stack={stack}
              index={index}
              capabilities={capabilities}
              canRemove={stacks.length > 1 && index > 0}
              onChange={updateStack}
              onRemove={() => removeStack(stack.key)}
            />
          ))}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', fontSize: '12px', color: 'var(--text-muted)' }}>
            <span><Layers size={12} aria-hidden="true" /> {stackCount} stack{stackCount === 1 ? '' : 's'}</span>
            <span>·</span>
            <span>{adCount} ad{adCount === 1 ? '' : 's'}</span>
            <span>·</span>
            <span>{effectiveCount} with stack overrides</span>
          </div>
        </section>
      )}

      {currentStep === 3 && (
        <section aria-labelledby="step-3-heading" style={{ display: 'flex', flexDirection: 'column', gap: '18px', padding: '20px', border: '1px solid var(--border-subtle)', borderRadius: '14px', background: 'var(--bg-surface)' }}>
          <div>
            <h3 id="step-3-heading" style={{ margin: '0 0 4px', fontSize: '17px', fontWeight: 700 }}>Audience &amp; targeting</h3>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>These campaign defaults apply to every stack. Unknown visitor geography never widens a targeted campaign.</p>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }} role="group" aria-label="Campaign geography mode">
            <button type="button" aria-pressed={geoMode === 'global'} onClick={() => { setGeoMode('global'); setLocations([]); }} style={{ minHeight: '40px', padding: '8px 14px', borderRadius: '9px', border: `1px solid ${geoMode === 'global' ? 'var(--color-crimson)' : 'var(--border-subtle)'}`, background: geoMode === 'global' ? 'var(--badge-bg)' : 'var(--bg-elevated)', color: geoMode === 'global' ? 'var(--color-crimson)' : 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer' }}>
              <Globe size={14} aria-hidden="true" /> Global
            </button>
            <button type="button" disabled={!capabilities?.geoTargetingEnabled} aria-pressed={geoMode === 'targeted'} onClick={() => setGeoMode('targeted')} style={{ opacity: capabilities?.geoTargetingEnabled ? 1 : 0.55, minHeight: '40px', padding: '8px 14px', borderRadius: '9px', border: `1px solid ${geoMode === 'targeted' ? 'var(--color-crimson)' : 'var(--border-subtle)'}`, background: geoMode === 'targeted' ? 'var(--badge-bg)' : 'var(--bg-elevated)', color: geoMode === 'targeted' ? 'var(--color-crimson)' : 'var(--text-secondary)', fontWeight: 600, cursor: capabilities?.geoTargetingEnabled ? 'pointer' : 'not-allowed' }}>
              <Target size={14} aria-hidden="true" /> Target locations
            </button>
          </div>

          {!capabilities?.geoTargetingEnabled && <p role="status" style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Global targeting is available. Specific locations will be enabled later.</p>}
          {geoMode === 'targeted' && (
            <LocationTargeting value={locations} onChange={setLocations} />
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <fieldset style={{ border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '12px', margin: 0 }}>
              <legend style={{ padding: '0 4px', fontSize: '12px', fontWeight: 600 }}>Device categories</legend>
              {['desktop', 'mobile'].map((device) => (
                <label key={device} style={{ display: 'flex', alignItems: 'center', gap: '8px', minHeight: '36px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  <input type="checkbox" checked={devices.includes(device)} onChange={(event) => setDevices(event.target.checked ? [...devices, device] : devices.filter((item) => item !== device))} />
                  {device === 'desktop' ? 'Desktop & laptop' : 'Mobile'}
                </label>
              ))}
            </fieldset>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '12px', fontWeight: 600 }}>
              Daypart hours (0–23)
              <Input value={hoursText} onChange={(event) => applyHours(event.target.value)} placeholder="All day" inputMode="numeric" />
              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Comma-separated. Leave empty for all hours.</span>
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', fontWeight: 600 }}>
              Daily frequency cap: {frequencyCap}
              <input type="range" min={1} max={20} value={frequencyCap} onChange={(event) => setFrequencyCap(Number(event.target.value))} style={{ width: '100%', accentColor: 'var(--color-crimson)' }} />
              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Maximum impressions per person per day.</span>
            </label>
          </div>
        </section>
      )}

      {currentStep === 4 && (
        <section aria-labelledby="step-4-heading" style={{ display: 'flex', flexDirection: 'column', gap: '18px', padding: '20px', border: '1px solid var(--border-subtle)', borderRadius: '14px', background: 'var(--bg-surface)' }}>
          <div>
            <h3 id="step-4-heading" style={{ margin: '0 0 4px', fontSize: '17px', fontWeight: 700 }}>Budget &amp; pricing</h3>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>Budget and bid apply to every stack. Funds stay in escrow until verified delivery.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {(['cpm', 'cpc'] as const).map((model) => (
              <button key={model} type="button" aria-pressed={pricingModel === model} onClick={() => setPricingModel(model)} style={{ textAlign: 'left', padding: '14px', borderRadius: '10px', border: `2px solid ${pricingModel === model ? 'var(--color-crimson)' : 'var(--border-subtle)'}`, background: pricingModel === model ? 'var(--badge-bg)' : 'var(--bg-elevated)', cursor: 'pointer' }}>
                <span style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>{model.toUpperCase()}</span>
                <span style={{ display: 'block', marginTop: '4px', fontSize: '11px', color: 'var(--text-secondary)' }}>{model === 'cpm' ? 'Per 1,000 viewable impressions' : 'Per verified click'}</span>
              </button>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '12px' }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '12px', fontWeight: 600 }}>
              Total budget (USD)
              <Input type="number" min={5} step={1} value={budgetUsd} onChange={(event) => setBudgetUsd(Number(event.target.value))} />
              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Minimum $5.00</span>
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '12px', fontWeight: 600 }}>
              Daily target (USD)
              <Input type="number" min={1} step={1} value={dailyBudgetUsd} onChange={(event) => setDailyBudgetUsd(Number(event.target.value))} />
            </label>
            {pricingModel === 'cpm' ? (
              <label style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '12px', fontWeight: 600 }}>
                CPM bid (cents)
                <Input type="number" min={50} step={5} value={cpmBidCents} onChange={(event) => setCpmBidCents(Number(event.target.value))} />
                <span style={{ fontSize: '10px', color: 'var(--color-crimson)' }}>${(cpmBidCents / 100).toFixed(2)} per 1,000 views</span>
              </label>
            ) : (
              <label style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '12px', fontWeight: 600 }}>
                CPC bid (cents)
                <Input type="number" min={10} step={1} value={cpcBidCents} onChange={(event) => setCpcBidCents(Number(event.target.value))} />
                <span style={{ fontSize: '10px', color: 'var(--color-crimson)' }}>${(cpcBidCents / 100).toFixed(2)} per click</span>
              </label>
            )}
          </div>
          <div style={{ padding: '12px 14px', borderRadius: '10px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--text-primary)' }}>Conservative delivery estimate:</strong>{' '}
            {pricingModel === 'cpm' ? `${Math.floor((budgetUsd / Math.max(1, cpmBidCents / 100)) * 1000).toLocaleString()} viewable impressions` : `${Math.floor(budgetUsd / Math.max(1, cpcBidCents / 100)).toLocaleString()} clicks`}
          </div>
        </section>
      )}

      {currentStep === 5 && (
        <section aria-labelledby="step-5-heading" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h3 id="step-5-heading" style={{ margin: '0 0 4px', fontSize: '17px', fontWeight: 700 }}>Review &amp; submit</h3>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>Review each stack and its effective settings before submission.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
            <SummaryCard label="Campaign" value={title || 'Untitled'} lines={[`Category: ${category}`, `Budget: $${budgetUsd.toFixed(2)} USD`, `Model: ${pricingModel.toUpperCase()}`]} />
            <SummaryCard label="Creative" value={`${stacks.length} stack${stacks.length === 1 ? '' : 's'} · ${adCount} ad${adCount === 1 ? '' : 's'}`} lines={[`Types: ${[...new Set(stacks.flatMap((stack) => stack.ads.map((ad) => ad.adType)))].join(', ')}`, `Video: ${capabilities?.videoAuthoringEnabled ? 'enabled' : 'coming soon'}`]} />
            <SummaryCard
              label="Campaign targeting"
              value={geoMode === 'global' ? 'Global' : `${locations.length} location${locations.length === 1 ? '' : 's'}`}
              lines={[
                geoMode === 'targeted' ? locations.map((id) => locationNames[id] || id).join(', ') : 'No geographic restriction',
                `Devices: ${devices.join(', ') || 'none'}`,
                `Hours: ${hours.length ? hours.join(', ') : 'all day'}`,
              ]}
            />
          </div>

          {stacks.map((stack, index) => (
            <article key={stack.key} style={{ border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '14px', background: 'var(--bg-surface)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
                <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700 }}>{stack.name || `Ad Stack #${index + 1}`}</h4>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{stack.geoMode === 'inherit' ? 'Inherits campaign settings' : `Override: ${stack.geoMode}`}</span>
              </div>
              <ul style={{ margin: '10px 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {stack.ads.map((ad, adIndex) => (
                  <li key={ad.key} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    <span style={{ padding: '2px 7px', borderRadius: '999px', background: 'var(--badge-bg)', color: 'var(--text-primary)', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' }}>{ad.adType}</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{ad.headline || `Ad ${adIndex + 1}`}</span>
                  </li>
                ))}
              </ul>
              <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>
                {stack.geoMode === 'targeted' ? `Locations: ${stack.locations.map((id) => locationNames[id] || id).join(', ')}` : 'Geography: inherited'}
                {stack.targetDevices.length > 0 ? ` · Devices: ${stack.targetDevices.join(', ')}` : ''}
                {stack.targetHours.length > 0 ? ` · Hours: ${stack.targetHours.join(', ')}` : ''}
              </div>
            </article>
          ))}

          <div style={{ padding: '12px 14px', borderRadius: '10px', background: 'rgba(212,20,58,0.06)', border: '1px solid rgba(212,20,58,0.2)', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
            <ShieldCheck size={16} aria-hidden="true" style={{ marginTop: '1px', color: 'var(--color-crimson)' }} />
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Submission sends every stack to dual-reviewer moderation. It does not activate the campaign or imply approval. Your escrow remains refundable until verified delivery.
            </p>
          </div>
        </section>
      )}

      {error && (
        <div role="alert" style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', padding: '12px 14px', borderRadius: '10px', border: '1px solid rgba(180,35,24,0.25)', background: 'rgba(180,35,24,0.06)', color: 'var(--text-primary)', fontSize: '13px' }}>
          <AlertCircle size={16} aria-hidden="true" style={{ color: 'var(--color-error, #B42318)', flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      <footer style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {currentStep > 1 ? (
            <Button type="button" variant="outline" onClick={back} disabled={isSubmitting}>
              <ArrowLeft size={14} aria-hidden="true" /> Back
            </Button>
          ) : (
            <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>Cancel</Button>
          )}
        </div>
        {currentStep < 5 ? (
          <Button type="button" onClick={next}>
            Continue <ArrowRight size={14} aria-hidden="true" />
          </Button>
        ) : (
          <Button type="button" onClick={() => void submit()} disabled={isSubmitting}>
            {isSubmitting ? <><Loader2 size={14} aria-hidden="true" /> Submitting…</> : <><Sparkles size={14} aria-hidden="true" /> Submit for review</>}
          </Button>
        )}
      </footer>
    </div>
  );
}

function SummaryCard({ label, value, lines }: { label: string; value: string; lines: string[] }) {
  return (
    <div style={{ padding: '14px', border: '1px solid var(--border-subtle)', borderRadius: '10px', background: 'var(--bg-surface)' }}>
      <span style={{ display: 'block', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>{label}</span>
      <strong style={{ display: 'block', margin: '4px 0 6px', fontSize: '14px', color: 'var(--text-primary)' }}>{value}</strong>
      {lines.map((line) => <span key={line} style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{line}</span>)}
    </div>
  );
}
