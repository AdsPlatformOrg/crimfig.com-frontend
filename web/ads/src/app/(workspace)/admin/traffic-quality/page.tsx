'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface TrafficAssessmentRow {
  id: string;
  promoter_id: string;
  website_id: string;
  visitor_count: number;
  distinct_ip_count: number;
  click_count: number;
  click_to_visit_ratio: number;
  high_signals: string[];
  supporting_signals: string[];
  model_version: string;
  enforcement_mode: string;
  disposition: string;
  would_quarantine_if_enforced: boolean;
  created_at: string;
}

export default function AdminTrafficQualityPage() {
  const [rows, setRows] = useState<TrafficAssessmentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/v1/admin/ads/traffic-quality/publishers', { credentials: 'include' });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || 'Failed to load traffic quality assessments');
      setRows(Array.isArray(json.data) ? json.data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load traffic quality assessments');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  return (
    <div style={{ padding: '24px 0', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>Publisher Traffic Quality</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
            Coordinated click fraud &amp; SIVT cohort observations (report-only baseline before Billing settlement).
          </p>
        </div>
        <Button variant="outline" onClick={() => void load()} disabled={loading}>
          Refresh
        </Button>
      </div>

      {error && (
        <Card style={{ padding: '16px', borderColor: 'var(--color-error)' }}>
          <p style={{ color: 'var(--color-error)', margin: 0, fontSize: '13px' }}>{error}</p>
        </Card>
      )}

      <Card style={{ padding: '20px' }}>
        {loading ? (
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>Loading publisher assessments…</p>
        ) : rows.length === 0 ? (
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
            No publisher traffic quality assessments recorded yet.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {rows.map((row) => (
              <div
                key={row.id}
                style={{
                  padding: '12px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px',
                  fontSize: '13px',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>
                    Promoter <code>{row.promoter_id.slice(0, 8)}</code> · Site <code>{row.website_id.slice(0, 8)}</code>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {row.visitor_count} visitors · {row.distinct_ip_count} IPs · {row.click_count} clicks ({(row.click_to_visit_ratio * 100).toFixed(1)}% ratio)
                  </div>
                  {(row.high_signals?.length > 0 || row.supporting_signals?.length > 0) && (
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Signals: {[...(row.high_signals || []), ...(row.supporting_signals || [])].join(', ')}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <Badge variant="outline">{row.enforcement_mode}</Badge>
                  <Badge variant={row.would_quarantine_if_enforced ? 'destructive' : 'secondary'}>
                    {row.would_quarantine_if_enforced ? 'Flagged' : row.disposition}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

