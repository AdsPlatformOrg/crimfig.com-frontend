'use client';

import React, { useState, useMemo } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronDown, ChevronUp, ChevronsUpDown, Search, X } from 'lucide-react';

export type ColumnDef<T> = {
  id: string;
  header: React.ReactNode;
  accessorKey?: keyof T;
  cell?: (row: T) => React.ReactNode;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  className?: string;
};

export type AdminDataTableProps<T> = {
  columns: ColumnDef<T>[];
  data: T[];
  totalCount?: number;
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  // Server-side control callbacks (if omitted, handles in-memory)
  page?: number;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  search?: string;
  onSearchChange?: (search: string) => void;
  searchPlaceholder?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  onSortChange?: (columnId: string, direction: 'asc' | 'desc') => void;
  onRowClick?: (row: T) => void;
  actions?: React.ReactNode;
};

export function AdminDataTable<T extends { id?: string | number }>({
  columns,
  data,
  totalCount,
  loading = false,
  error = null,
  emptyMessage = 'No records found matching your filters.',
  page = 1,
  pageSize = 25,
  pageSizeOptions = [10, 25, 50, 100],
  onPageChange,
  onPageSizeChange,
  search,
  onSearchChange,
  searchPlaceholder = 'Search records…',
  sortBy,
  sortDirection,
  onSortChange,
  onRowClick,
  actions,
}: AdminDataTableProps<T>) {
  // Client-side fallback states if not driven by server-side props
  const [clientSearch, setClientSearch] = useState('');
  const [clientSortBy, setClientSortBy] = useState<string | undefined>(undefined);
  const [clientSortDir, setClientSortDir] = useState<'asc' | 'desc'>('asc');
  const [clientPage, setClientPage] = useState(1);
  const [clientPageSize, setClientPageSize] = useState(pageSize);

  const isServerSide = totalCount !== undefined;
  const currentSearch = search !== undefined ? search : clientSearch;
  const currentSortBy = sortBy !== undefined ? sortBy : clientSortBy;
  const currentSortDir = sortDirection !== undefined ? sortDirection : clientSortDir;
  const currentPage = onPageChange ? page : clientPage;
  const currentPageSize = onPageSizeChange ? pageSize : clientPageSize;

  const handleSearchChange = (val: string) => {
    if (onSearchChange) {
      onSearchChange(val);
    } else {
      setClientSearch(val);
      setClientPage(1);
    }
  };

  const handleSort = (columnId: string) => {
    let nextDir: 'asc' | 'desc' = 'asc';
    if (currentSortBy === columnId && currentSortDir === 'asc') {
      nextDir = 'desc';
    }
    if (onSortChange) {
      onSortChange(columnId, nextDir);
    } else {
      setClientSortBy(columnId);
      setClientSortDir(nextDir);
    }
  };

  // Process data for client-side mode
  const displayData = useMemo(() => {
    if (isServerSide) return data;

    let res = [...data];
    if (currentSearch.trim()) {
      const q = currentSearch.toLowerCase();
      res = res.filter(row =>
        Object.values(row as Record<string, unknown>).some(
          val => val !== null && val !== undefined && String(val).toLowerCase().includes(q)
        )
      );
    }

    if (currentSortBy) {
      res.sort((a: any, b: any) => {
        const valA = a[currentSortBy];
        const valB = b[currentSortBy];
        if (valA === valB) return 0;
        if (valA === null || valA === undefined) return 1;
        if (valB === null || valB === undefined) return -1;
        const comp = valA > valB ? 1 : -1;
        return currentSortDir === 'desc' ? -comp : comp;
      });
    }

    const start = (currentPage - 1) * currentPageSize;
    return res.slice(start, start + currentPageSize);
  }, [data, isServerSide, currentSearch, currentSortBy, currentSortDir, currentPage, currentPageSize]);

  const effectiveTotal = isServerSide
    ? totalCount
    : currentSearch.trim()
    ? data.filter(row =>
        Object.values(row as Record<string, unknown>).some(
          val => val !== null && val !== undefined && String(val).toLowerCase().includes(currentSearch.toLowerCase())
        )
      ).length
    : data.length;

  const totalPages = Math.max(1, Math.ceil(effectiveTotal / currentPageSize));

  return (
    <div className="cf-admin-data-table-container" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Table Toolbar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        <div style={{ position: 'relative', minWidth: '260px', maxWidth: '380px', flex: 1 }}>
          <Search
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: 16,
              height: 16,
              color: 'var(--text-muted, #64748B)',
            }}
          />
          <Input
            value={currentSearch}
            onChange={e => handleSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            style={{ paddingLeft: '36px', paddingRight: currentSearch ? '36px' : '12px' }}
          />
          {currentSearch && (
            <button
              type="button"
              onClick={() => handleSearchChange('')}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted, #64748B)',
                display: 'flex',
                alignItems: 'center',
              }}
              aria-label="Clear search"
            >
              <X style={{ width: 14, height: 14 }} />
            </button>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {actions}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted, #64748B)' }}>
            <span>Rows:</span>
            <select
              value={currentPageSize}
              onChange={e => {
                const nextSize = Number(e.target.value);
                if (onPageSizeChange) onPageSizeChange(nextSize);
                else {
                  setClientPageSize(nextSize);
                  setClientPage(1);
                }
              }}
              style={{
                borderRadius: '6px',
                border: '1px solid var(--border-subtle, #E2E8F0)',
                backgroundColor: 'var(--bg-surface, #F8FAFC)',
                padding: '4px 8px',
                fontSize: '12px',
                color: 'var(--text-primary, #0F172A)',
              }}
            >
              {pageSizeOptions.map(opt => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map(col => {
              const isSorted = currentSortBy === col.id;
              const textAlignment = col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left';
              return (
                <TableHead
                  key={col.id}
                  className={`${textAlignment} ${col.className ?? ''}`}
                  style={{
                    cursor: col.sortable ? 'pointer' : 'default',
                    userSelect: 'none',
                  }}
                  onClick={() => col.sortable && handleSort(col.id)}
                >
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      justifyContent: col.align === 'right' ? 'flex-end' : col.align === 'center' ? 'center' : 'flex-start',
                      width: '100%',
                    }}
                  >
                    <span>{col.header}</span>
                    {col.sortable && (
                      <span style={{ display: 'inline-flex', color: isSorted ? 'var(--color-crimson, #D4143A)' : 'var(--text-muted, #94A3B8)' }}>
                        {isSorted ? (
                          currentSortDir === 'desc' ? (
                            <ChevronDown style={{ width: 14, height: 14 }} />
                          ) : (
                            <ChevronUp style={{ width: 14, height: 14 }} />
                          )
                        ) : (
                          <ChevronsUpDown style={{ width: 14, height: 14 }} />
                        )}
                      </span>
                    )}
                  </div>
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={columns.length} style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--text-muted, #64748B)' }}>
                Loading data…
              </TableCell>
            </TableRow>
          ) : error ? (
            <TableRow>
              <TableCell colSpan={columns.length} style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--color-crimson, #D4143A)' }}>
                {error}
              </TableCell>
            </TableRow>
          ) : displayData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--text-muted, #64748B)' }}>
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            displayData.map((row, idx) => {
              const rowKey = row.id ? String(row.id) : idx;
              return (
                <TableRow
                  key={rowKey}
                  onClick={() => onRowClick && onRowClick(row)}
                  style={{ cursor: onRowClick ? 'pointer' : 'default' }}
                >
                  {columns.map(col => {
                    const textAlignment = col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left';
                    return (
                      <TableCell key={col.id} className={`${textAlignment} ${col.className ?? ''}`}>
                        {col.cell ? col.cell(row) : col.accessorKey ? String(row[col.accessorKey] ?? '') : null}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      {/* Table Pagination Footer */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          padding: '4px 0',
          fontSize: '13px',
          color: 'var(--text-secondary, #475569)',
        }}
      >
        <div>
          Showing {effectiveTotal === 0 ? 0 : (currentPage - 1) * currentPageSize + 1} to{' '}
          {Math.min(currentPage * currentPageSize, effectiveTotal)} of {effectiveTotal.toLocaleString()} entries
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage <= 1 || loading}
            onClick={() => {
              const prev = Math.max(1, currentPage - 1);
              if (onPageChange) onPageChange(prev);
              else setClientPage(prev);
            }}
          >
            Previous
          </Button>
          <span style={{ fontWeight: 600, padding: '0 4px' }}>
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages || loading}
            onClick={() => {
              const next = Math.min(totalPages, currentPage + 1);
              if (onPageChange) onPageChange(next);
              else setClientPage(next);
            }}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
