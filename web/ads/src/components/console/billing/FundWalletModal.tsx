'use client';

import React, { useState } from 'react';
import { X, CreditCard, ShieldCheck, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';

interface FundWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (amountUsd: number, amountNgn: number, reference: string) => void;
  exchangeRate?: number;
}

export function FundWalletModal({
  isOpen,
  onClose,
  onSuccess,
  exchangeRate = 1625.5,
}: FundWalletModalProps) {
  const [amountUsd, setAmountUsd] = useState<number>(100);
  const [customInput, setCustomInput] = useState<string>('100');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  if (!isOpen) return null;

  const quickAmounts = [25, 50, 100, 250, 500];
  const activeAmount = Number(customInput) || 0;
  const calculatedNgn = Math.round(activeAmount * exchangeRate);

  const handleSelectQuick = (val: number) => {
    setAmountUsd(val);
    setCustomInput(val.toString());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9.]/g, '');
    setCustomInput(val);
    setAmountUsd(Number(val) || 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeAmount < 5) return;

    setIsProcessing(true);

    // Simulate Paystack Inline Checkout / verification
    setTimeout(() => {
      setIsProcessing(false);
      setIsCompleted(true);

      const ref = `pstk_fund_${Date.now()}`;
      setTimeout(() => {
        setIsCompleted(false);
        onSuccess(activeAmount, calculatedNgn, ref);
        onClose();
      }, 1200);
    }, 1500);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        backgroundColor: 'rgba(23, 27, 42, 0.65)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '20px',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-xl)',
          padding: '28px',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'rgba(212, 20, 58, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-crimson)',
              }}
            >
              <CreditCard style={{ width: 18, height: 18 }} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                Fund Advertiser Balance
              </h3>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>
                Deposit USD via Paystack (Cards, Transfer & USSD)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              padding: '6px',
            }}
          >
            <X style={{ width: 20, height: 20 }} />
          </button>
        </div>

        {isCompleted ? (
          <div style={{ textAlign: 'center', padding: '36px 0' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'rgba(34, 197, 94, 0.12)',
                color: '#22c55e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <CheckCircle2 style={{ width: 32, height: 32 }} />
            </div>
            <h4 style={{ margin: '0 0 6px', fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
              Wallet Funded Successfully!
            </h4>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>
              Credited ${activeAmount.toFixed(2)} (₦{calculatedNgn.toLocaleString()}) to your balance.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Quick Presets */}
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
              Select Amount
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', marginBottom: '16px' }}>
              {quickAmounts.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => handleSelectQuick(q)}
                  style={{
                    padding: '8px 0',
                    borderRadius: '10px',
                    border: `1.5px solid ${activeAmount === q ? 'var(--color-crimson)' : 'var(--border-subtle)'}`,
                    backgroundColor: activeAmount === q ? 'rgba(212, 20, 58, 0.08)' : 'var(--bg-page)',
                    color: activeAmount === q ? 'var(--color-crimson)' : 'var(--text-primary)',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  ${q}
                </button>
              ))}
            </div>

            {/* Custom Amount Field */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Or Custom USD Amount (Min $5)
              </label>
              <div style={{ position: 'relative' }}>
                <span
                  style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontWeight: 700,
                    fontSize: '16px',
                    color: 'var(--text-secondary)',
                  }}
                >
                  $
                </span>
                <input
                  type="text"
                  value={customInput}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 30px',
                    borderRadius: '12px',
                    border: '1.5px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-page)',
                    fontSize: '16px',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  placeholder="100"
                />
              </div>
            </div>

            {/* Conversion Details Card */}
            <div
              style={{
                backgroundColor: 'var(--bg-page)',
                borderRadius: '14px',
                padding: '14px 16px',
                border: '1px solid var(--border-subtle)',
                marginBottom: '20px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Live Exchange Rate:</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>1 USD = ₦{exchangeRate.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Total Payable in NGN:</span>
                <span style={{ fontWeight: 700, color: 'var(--color-crimson)', fontSize: '15px' }}>
                  ₦{calculatedNgn.toLocaleString()}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                <ShieldCheck style={{ width: 14, height: 14, color: '#22c55e' }} />
                <span>Protected by Paystack 256-bit bank-grade encryption</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={onClose}
                disabled={isProcessing}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '12px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isProcessing || activeAmount < 5}
                style={{
                  flex: 2,
                  padding: '12px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'var(--gradient-crimson)',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: isProcessing || activeAmount < 5 ? 'not-allowed' : 'pointer',
                  opacity: isProcessing || activeAmount < 5 ? 0.7 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: 'var(--shadow-crimson)',
                }}
              >
                {isProcessing ? (
                  <>
                    <Loader2 style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} />
                    <span>Connecting Paystack...</span>
                  </>
                ) : (
                  <>
                    <span>Pay ₦{calculatedNgn.toLocaleString()}</span>
                    <ArrowRight style={{ width: 16, height: 16 }} />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
