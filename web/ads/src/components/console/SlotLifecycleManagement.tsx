'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { sessionFetch } from '@/lib/session';
import { PlayCircle, PauseCircle, ShieldAlert, CheckCircle2, AlertTriangle } from 'lucide-react';

interface SlotLifecycleProps {
  slotId: string;
  currentLifecycle: string;
  installationStatus: string;
  websitePolicy: string;
  websiteDomain: string;
  onUpdated?: () => void;
}

export function SlotLifecycleManagement({
  slotId,
  currentLifecycle,
  installationStatus,
  websitePolicy,
  websiteDomain,
  onUpdated,
}: SlotLifecycleProps) {
  const [target, setTarget] = useState<'active' | 'testing' | 'paused' | 'suspended' | null>(null);
  const [reason, setReason] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isInstalled = installationStatus === 'verified';
  const isPolicyApproved = websitePolicy === 'approved';
  const canActivate = isInstalled && isPolicyApproved;

  async function handleTransition(lifecycle: 'active' | 'testing' | 'paused' | 'suspended') {
    if (!reason.trim() || reason.trim().length < 5) {
      setError('Please provide a specific confirmation reason (minimum 5 characters).');
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await sessionFetch(`/api/v1/admin/ads/slots/${slotId}/lifecycle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetLifecycle: lifecycle,
          reason: reason.trim(),
        }),
      });

      const body = await res.json();
      if (!res.ok) {
        throw new Error(body.message || `HTTP ${res.status}`);
      }

      setSuccessMessage(body.data?.message || `Slot transitioned to ${lifecycle}`);
      setTarget(null);
      setReason('');
      if (onUpdated) onUpdated();
    } catch (err: any) {
      setError(err.message || 'Failed to update slot lifecycle.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="border-[var(--border-subtle)] bg-[var(--bg-surface)]">
      <CardHeader className="p-4 pb-2 border-b border-[var(--border-subtle)]">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <span>Slot Lifecycle Management</span>
              <Badge
                variant="outline"
                style={{
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  fontSize: '11px',
                  backgroundColor: currentLifecycle === 'active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                  color: currentLifecycle === 'active' ? '#10B981' : '#F59E0B',
                  borderColor: currentLifecycle === 'active' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)',
                }}
              >
                {currentLifecycle}
              </Badge>
            </CardTitle>
            <CardDescription className="text-xs text-[var(--color-text-muted)] mt-1">
              Authorized staff transitions. Slot activation unlocks paid campaign delivery and logs an immutable audit event.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {/* Prerequisite status checklist */}
        <div className="p-3 bg-[var(--bg-subtle,rgba(0,0,0,0.02))] border border-[var(--border-subtle)] rounded-lg text-xs space-y-2">
          <div className="font-semibold text-[var(--text-primary)]">Activation Prerequisites Check:</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="flex items-center gap-2">
              {isPolicyApproved ? (
                <CheckCircle2 size={14} className="text-emerald-500" />
              ) : (
                <AlertTriangle size={14} className="text-amber-500" />
              )}
              <span>Website Policy: <strong>{websitePolicy.toUpperCase()}</strong> ({isPolicyApproved ? 'Approved' : 'Pending Approval'})</span>
            </div>
            <div className="flex items-center gap-2">
              {isInstalled ? (
                <CheckCircle2 size={14} className="text-emerald-500" />
              ) : (
                <AlertTriangle size={14} className="text-amber-500" />
              )}
              <span>Installation: <strong>{installationStatus.toUpperCase()}</strong> ({isInstalled ? 'Verified Embed' : 'Missing Telemetry'})</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {currentLifecycle !== 'active' ? (
            <Button
              size="sm"
              disabled={!canActivate || submitting}
              onClick={() => { setTarget('active'); setReason('Verified slot installation and suitability policy on ' + websiteDomain); }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5"
            >
              <PlayCircle size={14} />
              <span>Activate Slot</span>
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              disabled={submitting}
              onClick={() => { setTarget('testing'); setReason('Moved back to testing mode for diagnostics'); }}
              className="flex items-center gap-1.5 text-amber-600 border-amber-300 hover:bg-amber-50"
            >
              <PauseCircle size={14} />
              <span>Put in Testing Mode</span>
            </Button>
          )}

          {currentLifecycle !== 'paused' && (
            <Button
              size="sm"
              variant="outline"
              disabled={submitting}
              onClick={() => { setTarget('paused'); setReason('Promoter requested pause or maintenance'); }}
            >
              Pause Delivery
            </Button>
          )}

          {currentLifecycle !== 'suspended' && (
            <Button
              size="sm"
              variant="outline"
              disabled={submitting}
              onClick={() => { setTarget('suspended'); setReason('Policy or traffic violation suspension'); }}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <ShieldAlert size={14} />
              <span>Suspend Slot</span>
            </Button>
          )}
        </div>

        {!canActivate && currentLifecycle !== 'active' && (
          <p className="text-xs text-amber-600 dark:text-amber-400">
            * To activate this slot for paid delivery, verified installation telemetry (serves and render beacons) and website policy approval are required.
          </p>
        )}

        {/* Confirmation Form Sheet */}
        {target && (
          <div className="mt-3 p-3 border border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20 rounded-md space-y-3">
            <div className="text-xs font-semibold text-emerald-900 dark:text-emerald-200">
              Confirm Transition to: <span className="uppercase">{target}</span>
            </div>
            <div>
              <label htmlFor="slot-transition-reason" className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                Audit Reason (required, logged to ads_supply_state_history):
              </label>
              <input
                id="slot-transition-reason"
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter authorized justification..."
                className="w-full text-xs p-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)]"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                disabled={submitting || reason.trim().length < 5}
                onClick={() => handleTransition(target)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {submitting ? 'Executing Transition...' : `Confirm & Transition to ${target.toUpperCase()}`}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                disabled={submitting}
                onClick={() => { setTarget(null); setReason(''); setError(null); }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-md text-xs">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-md text-xs">
            {error}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
