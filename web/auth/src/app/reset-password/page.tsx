'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getApiUrl } from '@/lib/config';

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (!token) {
      setError('Missing or invalid reset token. Please request a new link.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(getApiUrl('/api/v1/auth/reset-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Password reset failed');

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card" style={{ width: '100%', maxWidth: '420px', padding: '36px' }}>
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <div
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            background: 'var(--gradient-crimson)',
            boxShadow: 'var(--shadow-crimson)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            fontWeight: '700',
            fontSize: '22px',
            color: '#FFFFFF',
          }}
        >
          C
        </div>
        <h1 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--color-white)', marginBottom: '6px' }}>
          Create New Password
        </h1>
        <p style={{ color: 'var(--color-gray-400)', fontSize: '13px' }}>
          Set a secure password for your CrimFig account
        </p>
      </div>

      {error && (
        <div className="alert-error" style={{ marginBottom: '20px' }}>
          <span>{error}</span>
        </div>
      )}

      {success ? (
        <div>
          <div className="alert-success" style={{ marginBottom: '24px', lineHeight: '1.5' }}>
            <span>Your password has been reset successfully. You can now log in with your new credentials.</span>
          </div>
          <Link href="/login" className="btn-primary">
            Sign In Now
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-gray-400)', marginBottom: '6px', letterSpacing: '0.5px' }}>
              NEW PASSWORD
            </label>
            <input
              type="password"
              className="input-field"
              placeholder="Min 8 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-gray-400)', marginBottom: '6px', letterSpacing: '0.5px' }}>
              CONFIRM NEW PASSWORD
            </label>
            <input
              type="password"
              className="input-field"
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '8px' }}>
            {loading ? 'Resetting Password...' : 'Reset Password'}
          </button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div style={{ color: 'var(--color-gray-400)' }}>Loading reset form...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
