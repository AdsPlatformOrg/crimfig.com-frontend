'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, ChevronRight, Globe2, Loader2, MapPin, Plus, Search, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  createLocationSession,
  getLocation,
  loadHierarchy,
  resolveLocation,
  searchLocations,
  type GeoPlace,
  type NormalizedSuggestion,
} from '../../lib/locations-api';

interface LocationTargetingProps {
  value: string[];
  onChange: (ids: string[]) => void;
  disabled?: boolean;
  compact?: boolean;
}

type SearchScope = 'country' | 'state' | 'city';

export function LocationTargeting({ value, onChange, disabled = false, compact = false }: LocationTargetingProps) {
  const [selected, setSelected] = useState<GeoPlace[]>([]);
  const [query, setQuery] = useState('');
  const [scope, setScope] = useState<SearchScope>('city');
  const [results, setResults] = useState<NormalizedSuggestion[]>([]);
  const [attribution, setAttribution] = useState('');
  const [searching, setSearching] = useState(false);
  const [resolvingId, setResolvingId] = useState('');
  const [error, setError] = useState('');
  const [browseOpen, setBrowseOpen] = useState(false);
  const [browseOptions, setBrowseOptions] = useState<GeoPlace[]>([]);
  const [browsePath, setBrowsePath] = useState<GeoPlace[]>([]);
  const [browseLoading, setBrowseLoading] = useState(false);
  const sessionRef = useRef('');
  const valueKey = value.join('|');

  useEffect(() => {
    let active = true;
    const missing = value.filter((id) => !selected.some((place) => place.id === id));
    if (missing.length === 0) return;
    void Promise.all(missing.map((id) => getLocation(id).catch(() => null))).then((places) => {
      if (!active) return;
      const found = places.filter(Boolean) as GeoPlace[];
      setSelected((current) => {
        const byId = new Map(current.map((place) => [place.id, place]));
        for (const place of found) byId.set(place.id, place);
        return value.map((id) => byId.get(id)).filter(Boolean) as GeoPlace[];
      });
    });
    return () => { active = false; };
  }, [valueKey]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (query.trim().length < 3 || disabled) {
      setResults([]);
      return;
    }
    let active = true;
    const timer = setTimeout(async () => {
      setSearching(true);
      setError('');
      try {
        if (!sessionRef.current) {
          const session = await createLocationSession();
          sessionRef.current = session.sessionToken;
        }
        const response = await searchLocations({
          query: query.trim(),
          scope,
          sessionToken: sessionRef.current,
        });
        if (!active) return;
        setResults(response.suggestions);
        setAttribution(response.attribution);
      } catch (err) {
        if (!active) return;
        setResults([]);
        setAttribution('');
        setError(err instanceof Error ? err.message : 'Location search is unavailable.');
      } finally {
        if (active) setSearching(false);
      }
    }, 320);
    return () => { active = false; clearTimeout(timer); };
  }, [query, scope, disabled]);

  function addPlace(place: GeoPlace) {
    if (value.includes(place.id)) return;
    onChange([...value, place.id]);
    setSelected((current) => (current.some((item) => item.id === place.id) ? current : [...current, place]));
  }

  function removePlace(id: string) {
    onChange(value.filter((item) => item !== id));
    setSelected((current) => current.filter((item) => item.id !== id));
  }

  async function chooseSuggestion(suggestion: NormalizedSuggestion) {
    if (suggestion.canonicalId) {
      addPlace({
        id: suggestion.canonicalId,
        scope: suggestion.scope,
        name: suggestion.label,
        parentId: null,
        countryCode: suggestion.countryCode || null,
        subdivisionCode: suggestion.subdivisionCode || null,
      });
      return;
    }
    setResolvingId(suggestion.providerPlaceId);
    setError('');
    try {
      if (!sessionRef.current) {
        const session = await createLocationSession();
        sessionRef.current = session.sessionToken;
      }
      const place = await resolveLocation({
        provider: suggestion.provider,
        providerPlaceId: suggestion.providerPlaceId,
        scope: suggestion.scope,
        sessionToken: sessionRef.current,
      });
      addPlace(place);
      setResults([]);
      setQuery('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'This location could not be resolved.');
    } finally {
      setResolvingId('');
    }
  }

  async function openBrowse() {
    setBrowseOpen(true);
    setError('');
    setBrowsePath([]);
    setBrowseLoading(true);
    try {
      setBrowseOptions(await loadHierarchy());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'The location hierarchy is unavailable.');
    } finally {
      setBrowseLoading(false);
    }
  }

  async function chooseBrowse(place: GeoPlace) {
    setBrowsePath((current) => [...current, place]);
    setBrowseLoading(true);
    try {
      setBrowseOptions(await loadHierarchy(place.id));
    } catch {
      setBrowseOptions([]);
    } finally {
      setBrowseLoading(false);
    }
  }

  async function browseBack(index: number) {
    const nextPath = browsePath.slice(0, index);
    setBrowsePath(nextPath);
    setBrowseLoading(true);
    try {
      setBrowseOptions(await loadHierarchy(nextPath[nextPath.length - 1]?.id));
    } catch {
      setBrowseOptions([]);
    } finally {
      setBrowseLoading(false);
    }
  }

  const currentBrowse = browsePath[browsePath.length - 1];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: compact ? '10px' : '14px' }}>
      {selected.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }} aria-label="Selected locations">
          {selected.map((place) => (
            <span
              key={place.id}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 10px', borderRadius: '999px', border: '1px solid var(--border-subtle)', background: 'var(--badge-bg)', color: 'var(--text-primary)', fontSize: '12px', fontWeight: 600 }}
            >
              <MapPin size={12} aria-hidden="true" /> {place.name}
              <button
                type="button"
                onClick={() => removePlace(place.id)}
                disabled={disabled}
                aria-label={`Remove ${place.name}`}
                style={{ border: 0, background: 'transparent', color: 'var(--text-muted)', cursor: disabled ? 'not-allowed' : 'pointer', padding: '2px', display: 'inline-flex' }}
              >
                <X size={12} aria-hidden="true" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <label style={{ flex: '1 1 150px', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
          Search level
          <select
            value={scope}
            onChange={(event) => setScope(event.target.value as SearchScope)}
            disabled={disabled}
            style={{ minHeight: '44px', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', font: 'inherit', fontSize: '13px' }}
          >
            <option value="country">Country</option>
            <option value="state">State / Province</option>
            <option value="city">City / Locality</option>
          </select>
        </label>
        <label style={{ flex: '2 1 220px', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
          Search location
          <span style={{ position: 'relative', display: 'block' }}>
            <Search size={14} aria-hidden="true" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="City, state, or country"
              disabled={disabled}
              style={{ paddingLeft: '34px' }}
              aria-label="Search locations"
            />
          </span>
        </label>
      </div>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <Button type="button" variant="outline" size="sm" onClick={() => void openBrowse()} disabled={disabled || browseLoading}>
          <Globe2 size={14} aria-hidden="true" /> Browse hierarchy
        </Button>
        {value.length > 0 && (
          <Button type="button" variant="ghost" size="sm" onClick={() => { onChange([]); setSelected([]); }} disabled={disabled}>
            Clear all
          </Button>
        )}
      </div>

      {searching && <p role="status" style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}><Loader2 size={12} aria-hidden="true" /> Searching…</p>}
      {error && <p role="alert" style={{ margin: 0, fontSize: '12px', color: 'var(--color-error, #B42318)' }}>{error}</p>}

      {results.length > 0 && (
        <div style={{ border: '1px solid var(--border-subtle)', borderRadius: '10px', overflow: 'hidden' }}>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {results.map((suggestion) => (
              <li key={`${suggestion.provider}:${suggestion.providerPlaceId}`} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <button
                  type="button"
                  onClick={() => void chooseSuggestion(suggestion)}
                  disabled={Boolean(resolvingId) || disabled}
                  style={{ width: '100%', textAlign: 'left', padding: '10px 12px', border: 0, background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', minHeight: '44px' }}
                >
                  <span>
                    <span style={{ display: 'block', fontSize: '13px', fontWeight: 600 }}>{suggestion.label}</span>
                    {suggestion.description && <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)' }}>{suggestion.description}</span>}
                  </span>
                  {resolvingId === suggestion.providerPlaceId ? <Loader2 size={14} aria-hidden="true" /> : <Plus size={14} aria-hidden="true" />}
                </button>
              </li>
            ))}
          </ul>
          {attribution && <p style={{ margin: 0, padding: '6px 12px', fontSize: '10px', color: 'var(--text-muted)', background: 'var(--bg-surface)' }}>{attribution}</p>}
        </div>
      )}

      {browseOpen && (
        <div style={{ border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '12px', background: 'var(--bg-surface)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
            <strong style={{ fontSize: '12px' }}>Browse canonical geography</strong>
            <button type="button" onClick={() => setBrowseOpen(false)} aria-label="Close browse" style={{ border: 0, background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={14} aria-hidden="true" />
            </button>
          </div>
          <nav aria-label="Geography breadcrumb" style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', alignItems: 'center' }}>
            <button type="button" onClick={() => void browseBack(0)} style={{ border: 0, background: 'transparent', color: 'var(--color-crimson)', fontSize: '11px', cursor: 'pointer' }}>World</button>
            {browsePath.map((place, index) => (
              <span key={place.id} style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                <ChevronRight size={10} aria-hidden="true" />
                <button type="button" onClick={() => void browseBack(index + 1)} style={{ border: 0, background: 'transparent', color: 'var(--text-secondary)', fontSize: '11px', cursor: 'pointer' }}>{place.name}</button>
              </span>
            ))}
          </nav>
          {browseLoading ? (
            <p role="status" style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>Loading locations…</p>
          ) : browseOptions.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {browseOptions.map((place) => (
                <button
                  key={place.id}
                  type="button"
                  onClick={() => void chooseBrowse(place)}
                  style={{ padding: '7px 10px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontSize: '12px', cursor: 'pointer', minHeight: '36px' }}
                >
                  {place.name}
                </button>
              ))}
            </div>
          ) : (
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>No deeper canonical locations are available.</p>
          )}
          {currentBrowse && (
            <Button type="button" size="sm" onClick={() => addPlace(currentBrowse)} disabled={disabled || value.includes(currentBrowse.id)}>
              <Check size={14} aria-hidden="true" /> Add {currentBrowse.name}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
