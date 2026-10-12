'use client';

import React, { useState } from 'react';
import { X, Building2, CheckCircle2, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { MOCK_BANKS } from '../../../lib/billing-api';

interface WithdrawFundsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (amountUsd: number, amountNgn: number, bankName: string, accountNum: string) => void;
  availableUsd: number;
  exchangeRate?: number;
}

export function WithdrawFundsModal({
  isOpen,
  onClose,
  onSuccess,
  availableUsd,
  exchangeRate = 1625.5,
}: WithdrawFundsModalProps) {
  const [selectedBankCode, setSelectedBankCode] = useState<string>('058');
  const [accountNumber, setAccountNumber] = useState<string>('0234567891');
  const [resolvedName, setResolvedName] = useState<string>('JEDIDIAH E. ARCHIBONG');
  const [isResolving, setIsResolving] = useState<boolean>(false);
  const [amountUsd, setAmountUsd] = useState<string>('50');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  if (!isOpen) return null;

  const withdrawAmount = Number(amountUsd) || 0;
  const calculatedNgn = Math.round(withdrawAmount * exchangeRate);
  const selectedBank = MOCK_BANKS.find((b) => b.code === selectedBankCode) || MOCK_BANKS[0];

  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setAccountNumber(val);

    if (val.length === 10) {
      setIsResolving(true);
      setTimeout(() => {
        setIsResolving(false);
        setResolvedName('JEDIDIAH E. ARCHIBONG');
      }, 700);
    } else {
      setResolvedName('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawAmount < 10 || withdrawAmount > availableUsd || !accountNumber || !resolvedName) {
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsCompleted(true);

      setTimeout(() => {
        setIsCompleted(false);
        onSuccess(withdrawAmount, calculatedNgn, selectedBank.name, accountNumber);
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
                backgroundColor: 'rgba(23, 27, 42, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-primary)',
              }}
            >
              <Building2 style={{ width: 18, height: 18 }} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                Withdraw to Nigerian Bank
              </h3>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>
                Direct Paystack Transfer in NGN to your bank
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
              Withdrawal Dispatched!
            </h4>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>
              ₦{calculatedNgn.toLocaleString()} ($ {withdrawAmount.toFixed(2)}) is on its way to {selectedBank.name}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Bank Selector */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Destination Bank
              </label>
              <select
                value={selectedBankCode}
                onChange={(e) => setSelectedBankCode(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  border: '1.5px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-page)',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  outline: 'none',
                }}
              >
                {MOCK_BANKS.map((b) => (
                  <option key={b.code} value={b.code}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Account Number */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                10-Digit NUBAN Account Number
              </label>
              <input
                type="text"
                value={accountNumber}
                onChange={handleAccountChange}
                maxLength={10}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  border: '1.5px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-page)',
                  fontSize: '15px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
                placeholder="0123456789"
              />

              {/* Resolved Name Preview */}
              {isResolving && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px' }}>
                  <Loader2 style={{ width: 12, height: 12, animation: 'spin 1s linear infinite' }} />
                  <span>Resolving account holder name...</span>
                </div>
              )}
              {!isResolving && resolvedName && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#22c55e',
                    backgroundColor: 'rgba(34, 197, 94, 0.08)',
                    padding: '6px 10px',
                    borderRadius: '8px',
                    marginTop: '8px',
                  }}
                >
                  <CheckCircle2 style={{ width: 14, height: 14 }} />
                  <span>{resolvedName}</span>
                </div>
              )}
            </div>

            {/* Amount USD */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Withdrawal Amount (Min $10)
                </label>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Available: <strong style={{ color: 'var(--color-crimson)' }}>${availableUsd.toFixed(2)}</strong>
                </span>
              </div>
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
                  value={amountUsd}
                  onChange={(e) => setAmountUsd(e.target.value.replace(/[^0-9.]/g, ''))}
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
                />
              </div>
            </div>

            {/* Conversion Breakdown */}
            <div
              style={{
                backgroundColor: 'var(--bg-page)',
                borderRadius: '14px',
                padding: '14px 16px',
                border: '1px solid var(--border-subtle)',
                marginBottom: '20px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>You will receive:</span>
                <span style={{ fontWeight: 700, color: '#22c55e', fontSize: '16px' }}>
                  ₦{calculatedNgn.toLocaleString()}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)' }}>
                <span>FX Rate: 1 USD = ₦{exchangeRate.toFixed(2)}</span>
                <span>Transfer Fee: ₦0 (CrimFig Covered)</span>
              </div>
            </div>

            {/* Actions */}
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
                disabled={
                  isProcessing ||
                  withdrawAmount < 10 ||
                  withdrawAmount > availableUsd ||
                  accountNumber.length !== 10 ||
                  !resolvedName
                }
                style={{
                  flex: 2,
                  padding: '12px',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: 'var(--color-fig-dark)',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor:
                    isProcessing ||
                    withdrawAmount < 10 ||
                    withdrawAmount > availableUsd ||
                    accountNumber.length !== 10
                      ? 'not-allowed'
                      : 'pointer',
                  opacity:
                    isProcessing ||
                    withdrawAmount < 10 ||
                    withdrawAmount > availableUsd ||
                    accountNumber.length !== 10
                      ? 0.6
                      : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                {isProcessing ? (
                  <>
                    <Loader2 style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} />
                    <span>Processing Payout...</span>
                  </>
                ) : (
                  <>
                    <span>Withdraw ₦{calculatedNgn.toLocaleString()}</span>
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
