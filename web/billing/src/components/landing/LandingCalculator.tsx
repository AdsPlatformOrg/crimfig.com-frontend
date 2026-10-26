'use client';

import React, { useState } from 'react';
import {
  DollarSign,
  TrendingDown,
  Clock,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  XCircle,
  HelpCircle
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';

interface LandingCalculatorProps {
  onCalculate: () => void;
}

export function LandingCalculator({ onCalculate }: LandingCalculatorProps) {
  const [usdAmount, setUsdAmount] = useState<number>(250);
  const fxRate = 1550;

  // Calculation values
  const ngnValue = usdAmount * fxRate;
  const traditionalWireFee = 45; // standard bank SWIFT fee
  const traditionalFxSpread = usdAmount * 0.045; // 4.5% bank markup spread
  const traditionalTotalCost = traditionalWireFee + traditionalFxSpread;
  const crimfigSavings = traditionalTotalCost;

  return (
    <section
      id="calculator"
      style={{
        padding: '80px 24px',
        backgroundColor: 'var(--bg-page)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 56px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(212, 20, 58, 0.08)',
              border: '1px solid rgba(212, 20, 58, 0.2)',
              color: 'var(--color-crimson)',
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '12px'
            }}
          >
            Radical Fee Transparency &amp; Honest Calculations
          </div>
          <h2
            style={{
              fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              margin: '0 0 16px',
            }}
          >
            Plain-Language Payout &amp; Conversion Simulator
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
            No hidden fees, no opaque currency markups. We believe creators and businesses deserve complete honesty. See an upfront breakdown of standard processor charges and real net proceeds.
          </p>
        </div>

        {/* Calculator Main Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr)',
            gap: '32px',
            alignItems: 'center',
          }}
          className="calc-grid"
        >
          {/* Controls Box */}
          <Card
            className="theme-card"
            style={{
              padding: '32px',
              borderRadius: '20px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 8px' }}>
              Transfer Amount Simulator
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 24px' }}>
              Enter an amount to explore the hypothetical calculation.
            </p>

            <div style={{ marginBottom: '20px' }}>
              <label htmlFor="billing-transfer-amount" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '8px' }}>
                Transfer / Payout Amount (USD)
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: 'var(--text-muted)', fontSize: '18px' }}>
                  $
                </span>
                <Input
                  id="billing-transfer-amount"
                  type="number"
                  min="20"
                  step="10"
                  value={usdAmount}
                  onChange={(e) => setUsdAmount(Math.max(1, Number(e.target.value)))}
                  style={{
                    width: '100%',
                    padding: '14px 16px 14px 36px',
                    borderRadius: '12px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-page)',
                    fontSize: '18px',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-primary)'
                  }}
                />
              </div>

              {/* Quick Select Chips */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                {[50, 100, 250, 500, 1500, 5000].map(val => (
                  <Button
                    key={val}
                    type="button"
                    onClick={() => setUsdAmount(val)}
                    variant={usdAmount === val ? 'default' : 'outline'}
                    size="sm"
                    aria-pressed={usdAmount === val}
                  >
                    ${val.toLocaleString()}
                  </Button>
                ))}
              </div>
            </div>

            {/* Equivalent NGN Callout */}
            <div
              style={{
                padding: '20px',
                borderRadius: '12px',
                backgroundColor: 'var(--bg-page)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Example NGN Value</div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-crimson)' }}>
                  ₦{ngnValue.toLocaleString('en-NG', { maximumFractionDigits: 0 })}
                </div>
              </div>
              <div style={{ textAlign: 'right', fontSize: '11px', color: 'var(--text-muted)' }}>
                Sample rate: <strong>₦{fxRate.toLocaleString()}/$</strong><br />
                Payouts: <strong>Unavailable</strong>
              </div>
            </div>
          </Card>

          {/* Comparison Breakdown Card */}
          <Card
            className="theme-card"
            style={{
              padding: '32px',
              borderRadius: '20px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 16px' }}>
              Hypothetical Fee Comparison
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* CrimFig Row */}
              <div
                style={{
                  padding: '16px 20px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--bg-page)',
                  border: '2px solid var(--color-crimson)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    <CheckCircle2 style={{ width: 16, height: 16, color: 'var(--color-success)' }} />
                    <span>Zero-Fee Example</span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Hypothetical model, not CrimFig pricing
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-success)' }}>
                    Example Fee: $0
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    No speed guarantee
                  </div>
                </div>
              </div>

              {/* Traditional Bank Wire Row */}
              <div
                style={{
                  padding: '16px 20px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--bg-page)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    <XCircle style={{ width: 16, height: 16, color: 'var(--color-error)' }} />
                    <span>Fee-Bearing Example</span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Assumed $45 fee + 4.5% markup
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-error)' }}>
                    -${traditionalTotalCost.toFixed(2)} USD example cost
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    Timing not modeled
                  </div>
                </div>
              </div>
            </div>

            {/* Savings Callout */}
            <div
              style={{
                marginTop: '20px',
                padding: '16px',
                borderRadius: '12px',
                backgroundColor: 'var(--color-success-bg)',
                color: 'var(--color-success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ fontSize: '13px', fontWeight: 700 }}>
                Difference Between Examples:
              </div>
              <div style={{ fontSize: '18px', fontWeight: 800 }}>
                +${crimfigSavings.toFixed(2)} USD
              </div>
            </div>

            {/* CTA */}
            <Button
              type="button"
              onClick={onCalculate}
              size="lg"
              style={{ width: '100%', marginTop: '20px' }}
            >
              <span>View Wallet Availability</span>
              <ArrowRight style={{ width: 16, height: 16 }} />
            </Button>
        </Card>
      </div>
      </div>

      <style jsx>{`
        @media (min-width: 900px) {
          .calc-grid {
            grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
}
