'use client';

import { useState } from 'react';

export default function AdsDashboard() {
  const [campaigns, setCampaigns] = useState([
    { id: 'camp_1', title: 'Summer Ecosystem Promo', budget: 500, status: 'ACTIVE', impressions: '14,200', clicks: '680' },
    { id: 'camp_2', title: 'Mobile App Launch Campaign', budget: 1200, status: 'ACTIVE', impressions: '45,800', clicks: '2,150' },
  ]);

  const [title, setTitle] = useState('');
  const [budget, setBudget] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !budget) return;

    setCampaigns((prev) => [
      ...prev,
      {
        id: 'camp_' + Math.random().toString(36).substring(2, 7),
        title,
        budget: Number(budget),
        status: 'ACTIVE',
        impressions: '0',
        clicks: '0',
      },
    ]);

    setTitle('');
    setBudget('');
    setShowModal(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', background: 'linear-gradient(to right, #a78bfa, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            CrimFig Ads Manager
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
            Create and track ad campaigns across the CrimFig ecosystem
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          + Create Campaign
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}>
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>TOTAL IMPRESSIONS</div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#6ee7b7' }}>60,000</div>
        </div>
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>TOTAL CLICKS</div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#93c5fd' }}>2,830</div>
        </div>
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>ACTIVE CAMPAIGNS</div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#c4b5fd' }}>{campaigns.length}</div>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Campaigns</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '12px' }}>Campaign Title</th>
              <th style={{ padding: '12px' }}>Budget ($)</th>
              <th style={{ padding: '12px' }}>Status</th>
              <th style={{ padding: '12px' }}>Impressions</th>
              <th style={{ padding: '12px' }}>Clicks</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((camp) => (
              <tr key={camp.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '16px 12px', fontWeight: '600' }}>{camp.title}</td>
                <td style={{ padding: '16px 12px' }}>${camp.budget}</td>
                <td style={{ padding: '16px 12px' }}>
                  <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#6ee7b7', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>
                    {camp.status}
                  </span>
                </td>
                <td style={{ padding: '16px 12px' }}>{camp.impressions}</td>
                <td style={{ padding: '16px 12px' }}>{camp.clicks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '440px', padding: '32px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px' }}>New Ad Campaign</h3>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>CAMPAIGN TITLE</label>
                <input
                  type="text"
                  placeholder="e.g. Black Friday Special"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'white' }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>BUDGET (USD)</label>
                <input
                  type="number"
                  placeholder="e.g. 500"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'white' }}
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{ flex: 1, padding: '12px', background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ flex: 1, padding: '12px', background: '#10b981', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '600', cursor: 'pointer' }}
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
