export default function WorkspaceLoading() {
 return <section aria-busy="true" aria-label="Loading page" style={{ padding: 24 }}><div aria-hidden="true" style={{height: 160, borderRadius: 12, background: 'var(--bg-surface)'}} /><p role="status">Loading page…</p></section>;
}
