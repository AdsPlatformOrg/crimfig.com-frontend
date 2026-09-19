'use client';

import React from 'react';

export function TableSkeleton({ rows = 3, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div style={{ width: '100%', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {Array.from({ length: cols }).map((_, j) => (
            <div
              key={j}
              className="skeleton"
              style={{
                height: '24px',
                flex: j === 0 ? 2 : 1,
                borderRadius: '6px',
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton({ count = 2 }: { count?: number }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="theme-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="skeleton" style={{ width: '140px', height: '20px', borderRadius: '4px' }} />
            <div className="skeleton" style={{ width: '80px', height: '18px', borderRadius: '12px' }} />
          </div>
          <div className="skeleton" style={{ width: '100%', height: '14px', borderRadius: '4px' }} />
          <div className="skeleton" style={{ width: '70%', height: '14px', borderRadius: '4px' }} />
          <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
            <div className="skeleton" style={{ width: '90px', height: '32px', borderRadius: '6px' }} />
            <div className="skeleton" style={{ width: '90px', height: '32px', borderRadius: '6px' }} />
          </div>
        </div>
      ))}
    </div>
  );
}
