import { useState } from 'react';
import { Button } from '../ui';

export function useCampaignTable() {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<{ key: string; direction: 'asc' | 'desc' }>({ key: 'title', direction: 'asc' });
  const [page, setPage] = useState(1);
  const pageSize = 20;

  function rows<T>(items: readonly T[], title: (item: T) => string, columns: Record<string, (item: T) => string | number>) {
    const value = columns[sort.key] ?? title;
    const query = search.trim().toLowerCase();
    return items.filter(item => title(item).toLowerCase().includes(query))
      .sort((a, b) => {
        const left = value(a);
        const right = value(b);
        const comparison = typeof left === 'number' && typeof right === 'number'
          ? left - right
          : String(left).localeCompare(String(right));
        return sort.direction === 'asc' ? comparison : -comparison;
      });
  }

  function sortDirection(key: string) {
    return sort.key !== key ? undefined : sort.direction === 'asc' ? 'ascending' as const : 'descending' as const;
  }

  function sortButton(key: string, label: string) {
    const nextDirection = sort.key === key && sort.direction === 'asc' ? 'descending' : 'ascending';
    return (
      <Button type="button" variant="ghost" size="sm" aria-label={`Sort ${label} ${nextDirection}`} onClick={() => {
        setSort(previous => ({ key, direction: previous.key === key && previous.direction === 'asc' ? 'desc' : 'asc' }));
        setPage(1);
      }}>
        {label} <span aria-hidden="true">{sort.key === key ? sort.direction === 'asc' ? '↑' : '↓' : '↕'}</span>
      </Button>
    );
  }

  function paginate<T>(items: readonly T[]) {
    const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
    const current = Math.min(page, pageCount);
    return {
      items: items.slice((current - 1) * pageSize, current * pageSize),
      footer: pageCount > 1 && (
        <nav aria-label="Table pagination">
          <Button size="sm" variant="outline" disabled={current === 1} onClick={() => setPage(current - 1)}>Previous</Button>
          <span> Page {current} of {pageCount} </span>
          <Button size="sm" variant="outline" disabled={current === pageCount} onClick={() => setPage(current + 1)}>Next</Button>
        </nav>
      ),
    };
  }

  function controls(label: string) {
    return <>
      <label>Search {label} <input type="search" value={search} onChange={event => { setSearch(event.target.value); setPage(1); }} /></label>
    </>;
  }
  return { rows, paginate, controls, sortButton, sortDirection, resetPage: () => setPage(1) };
}
