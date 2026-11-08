import { useState } from 'react';
import { Button } from '../ui';

export function useCampaignTable() {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('asc');
  const [page, setPage] = useState(1);
  const pageSize = 20;

  function rows<T>(items: readonly T[], title: (item: T) => string) {
    return items.filter(item => title(item).toLowerCase().includes(search.trim().toLowerCase()))
      .sort((a, b) => (sort === 'asc' ? 1 : -1) * title(a).localeCompare(title(b)));
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
      <label>Sort {label} <select value={sort} onChange={event => { setSort(event.target.value); setPage(1); }}>
        <option value="asc">Title A to Z</option>
        <option value="desc">Title Z to A</option>
      </select></label>
    </>;
  }
  return { rows, paginate, controls, resetPage: () => setPage(1) };
}
