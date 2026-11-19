'use client';

import { useEffect, useState } from 'react';
import { apiData } from '../../../lib/api-data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';

interface RecentTransaction {
  id: string;
  type: string;
  status: string;
  amountUsdCents: number;
  createdAt: string;
}

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export function RecentBillingTransactions() {
  const [rows, setRows] = useState<RecentTransaction[] | null>(null);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    const request = new AbortController();
    apiData<{ items: RecentTransaction[] }>('/api/v1/ads/billing/recent-transactions', { signal: request.signal })
      .then(({ items }) => {
        if (!Array.isArray(items) || items.length > 5 || items.some(row =>
          !row || typeof row.id !== 'string' || typeof row.type !== 'string' || typeof row.status !== 'string' ||
          !Number.isSafeInteger(row.amountUsdCents) || typeof row.createdAt !== 'string' ||
          !Number.isFinite(Date.parse(row.createdAt)))) throw new Error('Invalid Billing transactions');
        if (!request.signal.aborted) setRows(items);
      })
      .catch(() => { if (!request.signal.aborted) setUnavailable(true); });
    return () => request.abort();
  }, []);

  const message = unavailable ? 'Recent transactions are unavailable.'
    : !rows ? 'Loading recent transactions…'
    : rows.length === 0 ? 'No transactions yet.' : null;

  return (
    <Table aria-label="Five latest Billing transactions">
      <TableHeader><TableRow>
        <TableHead scope="col">Date</TableHead>
        <TableHead scope="col">Transaction</TableHead>
        <TableHead scope="col">Amount</TableHead>
        <TableHead scope="col">Status</TableHead>
      </TableRow></TableHeader>
      <TableBody>
        {message && (
          <TableRow>
            <TableCell colSpan={4}><span role="status">{message}</span></TableCell>
          </TableRow>
        )}
        {rows?.map(row => (
        <TableRow key={row.id}>
          <TableCell><time dateTime={row.createdAt}>{new Date(row.createdAt).toLocaleDateString()}</time></TableCell>
          <TableCell>{row.type.replaceAll('_', ' ')}</TableCell>
          <TableCell className="cf-numeric">{usd.format(row.amountUsdCents / 100)}</TableCell>
          <TableCell>{row.status.replaceAll('_', ' ')}</TableCell>
        </TableRow>
      ))}</TableBody>
    </Table>
  );
}
