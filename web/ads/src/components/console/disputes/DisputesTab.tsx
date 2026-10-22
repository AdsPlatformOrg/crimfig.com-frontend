'use client';

import React, { useState, useEffect } from 'react';
import { AdsDisputeItem } from '../../../types/disputes';
import { apiData, arrayData } from '../../../lib/api-data';
import { fetchDisputes, createDispute } from '../../../lib/disputes-api';

interface DisputesTabProps {
  role?: 'advertiser' | 'promoter';
  campaigns?: Array<{ id: string; title: string }>;
  websites?: Array<{ id: string; domain: string }>;
}

export function DisputesTab({
  role = 'advertiser',
  campaigns = [],
}: DisputesTabProps) {
  const [disputes, setDisputes] = useState<AdsDisputeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [placementOptions, setPlacementOptions] = useState<Array<{ id: string; label: string }>>([]);

  // Form State
  const [scope, setScope] = useState<'campaign' | 'placement' | 'general'>(role === 'advertiser' ? 'campaign' : 'placement');
  const [selectedCampaignId, setSelectedCampaignId] = useState(campaigns[0]?.id || '');
  const [selectedPlacementId, setSelectedPlacementId] = useState('');
  const [periodFrom, setPeriodFrom] = useState(new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0]);
  const [periodTo, setPeriodTo] = useState(new Date().toISOString().split('T')[0]);
  const [reason, setReason] = useState(
    role === 'advertiser'
      ? 'Suspicious CTR spike (>20%) from single IP cluster'
      : 'Viral organic social traffic surge misclassified as rapid bot clicks'
  );
  const [details, setDetails] = useState('');

  // Selected Dispute Details Modal
  const [viewingDispute, setViewingDispute] = useState<AdsDisputeItem | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      setIsLoading(true); setLoadError(null);
      try {
        const [data, owned] = await Promise.all([fetchDisputes(role), role === 'promoter' ? apiData('/api/v1/placements') : Promise.resolve([])]);
        if (active) {
          setDisputes(data);
          const choices = arrayData<any>(owned).map(item => ({ id: item.id, label: item.campaign?.title || item.id }));
          setPlacementOptions(choices); setSelectedPlacementId(choices[0]?.id || '');
        }
      }
      catch (err) { if (active) setLoadError(err instanceof Error ? err.message : 'Disputes unavailable.'); }
      finally { if (active) setIsLoading(false); }
    }
    load();
    return () => { active = false; };
  }, [role, loadAttempt]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim()) return;
    if ((scope === 'campaign' && !selectedCampaignId) || (scope === 'placement' && !selectedPlacementId)) { setError('Choose an owned campaign or placement for this dispute.'); return; }

    setIsSubmitting(true);
    try {
      const created = await createDispute({
        role,
        scope,
        campaignId: scope === 'campaign' ? selectedCampaignId : undefined,
        placementId: scope === 'placement' ? selectedPlacementId : undefined,
        periodFrom,
        periodTo,
        reason,
        details: details.trim(),
      });
      setDisputes(prev => [created, ...prev]);
      setIsModalOpen(false);
      setDetails('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Dispute creation could not be confirmed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalAdjusted = disputes
    .filter(d => d.status === 'resolved_adjusted')
    .reduce((sum, d) => sum + (d.adjustmentUsd || 0), 0);

  const underReviewCount = disputes.filter(d => d.status === 'open' || d.status === 'under_review').length;

  if (loadError) return <div role="alert" style={{ padding: 24, color: 'var(--text-secondary)' }}>
    <p>{loadError}</p>
    <button onClick={() => setLoadAttempt(value => value + 1)}>Retry loading</button>
  </div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {error && <p role="alert">{error}</p>}
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            {role === 'advertiser' ? 'Invalid-Traffic Disputes & Escrow Rebates' : 'Traffic Quality Appeals & Reviews'}
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 0' }}>
            {role === 'advertiser'
              ? 'Report abnormal CTR surges, zero-conversion bot bursts, or duplicate tracking to trigger 6-hour deep audits.'
              : 'Submit appeals for sudden organic traffic bursts, review flagged events, and protect your promoter trust score.'}
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            padding: '9px 16px',
            backgroundColor: 'var(--color-crimson)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: 'var(--shadow-crimson)',
          }}
        >
          <span>+</span> {role === 'advertiser' ? 'Report Suspicious Traffic' : 'Submit Quality Appeal'}
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div style={{ padding: '20px', borderRadius: '12px', background: 'var(--card-bg, #FFFFFF)', border: '1px solid var(--border-color)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Total Cases
          </span>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '6px' }}>
            {disputes.length}
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
            Logged in audit ledger
          </span>
        </div>

        <div style={{ padding: '20px', borderRadius: '12px', background: 'var(--card-bg, #FFFFFF)', border: '1px solid var(--border-color)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Active In Review
          </span>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#F59E0B', marginTop: '6px' }}>
            {underReviewCount}
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
            Under 5 business day SLA
          </span>
        </div>

        <div style={{ padding: '20px', borderRadius: '12px', background: 'var(--card-bg, #FFFFFF)', border: '1px solid var(--border-color)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {role === 'advertiser' ? 'Escrow Rebates Granted' : 'Restored Settlements'}
          </span>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#10B981', marginTop: '6px' }}>
            ${totalAdjusted.toFixed(2)}
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
            Append-only double entry ledger
          </span>
        </div>

        <div style={{ padding: '20px', borderRadius: '12px', background: 'var(--card-bg, #FFFFFF)', border: '1px solid var(--border-color)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Audit Standard
          </span>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '8px' }}>
            IAB MRC 50/1s
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
            Automated bot heuristic scoring
          </span>
        </div>
      </div>

      {/* Disputes History Table */}
      <div style={{ background: 'var(--card-bg, #FFFFFF)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
            Case Log & Decisions ({disputes.length})
          </span>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Zero in-place updates • Immutable ledger records
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary, #F8FAFC)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px 18px', fontWeight: 600 }}>Case ID / Scope</th>
                <th style={{ padding: '12px 18px', fontWeight: 600 }}>Date Range</th>
                <th style={{ padding: '12px 18px', fontWeight: 600 }}>Reason</th>
                <th style={{ padding: '12px 18px', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '12px 18px', fontWeight: 600 }}>Outcome / Adjustment</th>
                <th style={{ padding: '12px 18px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {disputes.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '32px 18px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No disputes filed. All campaign traffic is within normal statistical thresholds.
                  </td>
                </tr>
              ) : (
                disputes.map((d) => (
                  <tr key={d.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{d.id}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'capitalize', marginTop: '2px' }}>
                        {d.scope}: {d.campaignTitle || d.placementId || 'General'}
                      </div>
                    </td>
                    <td style={{ padding: '14px 18px', color: 'var(--text-secondary)', fontSize: '12px' }}>
                      {d.periodFrom} → {d.periodTo}
                    </td>
                    <td style={{ padding: '14px 18px', maxWidth: '300px' }}>
                      <div style={{ fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {d.reason}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '2px' }}>
                        {d.details}
                      </div>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '9999px',
                        fontSize: '11px',
                        fontWeight: 600,
                        backgroundColor:
                          d.status === 'resolved_adjusted' ? 'rgba(16, 185, 129, 0.1)' :
                          d.status === 'under_review' ? 'rgba(245, 158, 11, 0.1)' :
                          d.status === 'resolved_upheld' ? 'rgba(59, 130, 246, 0.1)' :
                          d.status === 'rejected' ? 'rgba(239, 68, 68, 0.1)' : '#F1F5F9',
                        color:
                          d.status === 'resolved_adjusted' ? '#10B981' :
                          d.status === 'under_review' ? '#D97706' :
                          d.status === 'resolved_upheld' ? '#2563EB' :
                          d.status === 'rejected' ? '#EF4444' : '#64748B',
                      }}>
                        {d.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      {d.adjustmentUsd ? (
                        <div style={{ fontWeight: 700, color: '#10B981' }}>
                          +${d.adjustmentUsd.toFixed(2)} Credited
                        </div>
                      ) : (
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          {d.status === 'under_review' ? 'Investigation pending' : 'No adjustment'}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                      <button
                        onClick={() => setViewingDispute(d)}
                        style={{
                          padding: '5px 10px',
                          fontSize: '11px',
                          fontWeight: 600,
                          color: 'var(--text-primary)',
                          background: 'var(--bg-secondary, #F1F5F9)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '6px',
                          cursor: 'pointer',
                        }}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: Create Dispute */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(3px)',
        }}>
          <div style={{
            background: 'var(--card-bg, #FFFFFF)',
            borderRadius: '16px',
            padding: '28px',
            maxWidth: '520px',
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          }}>
            <form onSubmit={handleSubmit}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 8px', color: 'var(--text-primary)' }}>
                {role === 'advertiser' ? 'File Invalid-Traffic Report' : 'Submit Quality Audit Appeal'}
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 20px', lineHeight: 1.5 }}>
                Our compliance team will inspect IP subnet clusters, rapid click velocity, and viewability timelines within 5 business days.
              </p>

              {/* Scope */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Scope
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {(role === 'advertiser'
                    ? [{ key: 'campaign', label: 'Specific Campaign' }, { key: 'general', label: 'General Account' }]
                    : [{ key: 'placement', label: 'Specific Placement' }, { key: 'general', label: 'General Account' }]
                  ).map((s) => (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => setScope(s.key as any)}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: 600,
                        border: scope === s.key ? '2px solid var(--color-crimson)' : '1px solid var(--border-color)',
                        background: scope === s.key ? 'rgba(212, 20, 58, 0.05)' : 'transparent',
                        color: scope === s.key ? 'var(--color-crimson)' : 'var(--text-primary)',
                        cursor: 'pointer',
                      }}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Entity */}
              {scope === 'campaign' && campaigns.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Select Campaign
                  </label>
                  <select
                    value={selectedCampaignId}
                    onChange={(e) => setSelectedCampaignId(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      fontSize: '13px',
                      color: 'var(--text-primary)',
                      background: 'var(--input-bg, #FFFFFF)',
                    }}
                  >
                    {campaigns.map((c) => (
                      <option key={c.id} value={c.id}>{c.title} ({c.id})</option>
                    ))}
                  </select>
                </div>
              )}

              {scope === 'placement' && placementOptions.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Select Placement / Domain
                  </label>
                  <select
                    value={selectedPlacementId}
                    onChange={(e) => setSelectedPlacementId(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      fontSize: '13px',
                      color: 'var(--text-primary)',
                      background: 'var(--input-bg, #FFFFFF)',
                    }}
                  >
                    {placementOptions.map((w) => (
                      <option key={w.id} value={w.id}>{w.label}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Date Window */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    From Date
                  </label>
                  <input
                    type="date"
                    value={periodFrom}
                    onChange={(e) => setPeriodFrom(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      fontSize: '12px',
                      color: 'var(--text-primary)',
                      background: 'var(--input-bg, #FFFFFF)',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    To Date
                  </label>
                  <input
                    type="date"
                    value={periodTo}
                    onChange={(e) => setPeriodTo(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      fontSize: '12px',
                      color: 'var(--text-primary)',
                      background: 'var(--input-bg, #FFFFFF)',
                    }}
                  />
                </div>
              </div>

              {/* Reason */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Primary Reason
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    fontSize: '13px',
                    color: 'var(--text-primary)',
                    background: 'var(--input-bg, #FFFFFF)',
                  }}
                >
                  {role === 'advertiser' ? (
                    <>
                      <option value="Suspicious CTR spike (>20%) from single IP cluster">Suspicious CTR spike (&gt;20%) from single IP cluster</option>
                      <option value="High click count with 0s landing page duration">High click count with 0s landing page duration</option>
                      <option value="Unusual geographic mismatch vs campaign targeting">Unusual geographic mismatch vs campaign targeting</option>
                      <option value="Attributed conversions not found in internal billing">Attributed conversions not found in internal billing</option>
                      <option value="Other invalid interaction activity">Other invalid interaction activity</option>
                    </>
                  ) : (
                    <>
                      <option value="Viral organic social traffic surge misclassified as rapid bot clicks">Viral organic social traffic surge misclassified as rapid bot clicks</option>
                      <option value="Featured publisher newsletter or press release blast">Featured publisher newsletter or press release blast</option>
                      <option value="Ad placement redesign caused legitimate CTR increase">Ad placement redesign caused legitimate CTR increase</option>
                      <option value="Other appeal clarification">Other appeal clarification</option>
                    </>
                  )}
                </select>
              </div>

              {/* Details */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Supporting Details & Observations (≤ 1000 characters)
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide specific hour timestamps, referrers, or analytics discrepancies..."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    fontSize: '13px',
                    color: 'var(--text-primary)',
                    background: 'var(--input-bg, #FFFFFF)',
                    outline: 'none',
                    resize: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    padding: '9px 16px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'transparent',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    padding: '9px 18px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: 'var(--color-crimson)',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isSubmitting ? 'Filing Report...' : 'Submit Case'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: View Dispute Details */}
      {viewingDispute && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(3px)',
        }}>
          <div style={{
            background: 'var(--card-bg, #FFFFFF)',
            borderRadius: '16px',
            padding: '28px',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 12px', color: 'var(--text-primary)' }}>
              Case Dossier: {viewingDispute.id}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
              <div>
                <strong style={{ color: 'var(--text-secondary)' }}>Status:</strong>{' '}
                <span style={{ fontWeight: 600, color: viewingDispute.status === 'resolved_adjusted' ? '#10B981' : '#F59E0B' }}>
                  {viewingDispute.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <div>
                <strong style={{ color: 'var(--text-secondary)' }}>Period:</strong>{' '}
                {viewingDispute.periodFrom} to {viewingDispute.periodTo}
              </div>
              <div>
                <strong style={{ color: 'var(--text-secondary)' }}>Reason:</strong>{' '}
                {viewingDispute.reason}
              </div>
              <div style={{ background: 'var(--bg-secondary, #F8FAFC)', padding: '12px', borderRadius: '8px', color: 'var(--text-primary)' }}>
                <strong>Claim Details:</strong>
                <p style={{ margin: '4px 0 0', lineHeight: 1.5, fontSize: '12px' }}>
                  {viewingDispute.details}
                </p>
              </div>

              {viewingDispute.outcome && (
                <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '12px', borderRadius: '8px', color: '#065F46' }}>
                  <strong>Compliance Finding:</strong>
                  <p style={{ margin: '4px 0 0', lineHeight: 1.5, fontSize: '12px' }}>
                    {viewingDispute.outcome}
                  </p>
                  {viewingDispute.adjustmentUsd && (
                    <div style={{ marginTop: '6px', fontWeight: 700, color: '#10B981' }}>
                      Rebate Issued: +${viewingDispute.adjustmentUsd.toFixed(2)} USD
                    </div>
                  )}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button
                onClick={() => setViewingDispute(null)}
                style={{
                  padding: '9px 18px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  background: 'transparent',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
