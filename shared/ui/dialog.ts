/** DOM-only dialog behavior shared by the existing Ads/Billing overlays. No credentials or storage. */
const stack: HTMLElement[] = [];
const inertLayers = new WeakMap<HTMLElement, { count: number; prior: boolean }>();
const bodyLocks = new WeakMap<HTMLElement, { count: number; prior: string }>();
const selector = 'button, a[href], input, select, textarea, [tabindex], [contenteditable="true"]';

export function activateDialog(dialog: HTMLElement, dismiss: () => void) {
  const doc = dialog.ownerDocument;
  const previous = doc.activeElement instanceof HTMLElement ? doc.activeElement : null;
  const body = doc.body;
  const bodyLock = bodyLocks.get(body) ?? { count: 0, prior: body.style.overflow };
  bodyLock.count++; bodyLocks.set(body, bodyLock); body.style.overflow = 'hidden';
  stack.push(dialog);
  const outside: HTMLElement[] = [];
  for (let node = dialog; node.parentElement; node = node.parentElement) {
    for (const sibling of Array.from(node.parentElement.children)) {
      if (sibling === node || !(sibling instanceof HTMLElement)) continue;
      const layer = inertLayers.get(sibling) ?? { count: 0, prior: sibling.inert };
      layer.count++; inertLayers.set(sibling, layer); sibling.inert = true; outside.push(sibling);
    }
    if (node.parentElement === body) break;
  }
  const top = () => stack[stack.length - 1] === dialog;
  const focusable = () => Array.from(dialog.querySelectorAll<HTMLElement>(selector)).filter(element =>
    element.tabIndex >= 0 && !element.matches(':disabled') && !element.closest('[inert]') &&
    element.getClientRects().length > 0 && getComputedStyle(element).visibility !== 'hidden');
  const initial = () => focusable()[0] ?? dialog;
  const focus = (element: HTMLElement) => element.focus();
  const onKey = (event: KeyboardEvent) => {
    if (!top()) return;
    if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); dismiss(); return; }
    if (event.key !== 'Tab') return;
    const items = focusable(), first = items[0], last = items[items.length - 1];
    if (!first) { event.preventDefault(); focus(dialog); return; }
    if (!dialog.contains(doc.activeElement) || doc.activeElement === dialog ||
        (event.shiftKey ? doc.activeElement === first : doc.activeElement === last)) {
      event.preventDefault(); focus(event.shiftKey ? last : first);
    }
  };
  const onFocus = (event: FocusEvent) => { if (top() && !dialog.contains(event.target as Node)) focus(initial()); };
  doc.addEventListener('keydown', onKey, true);
  doc.addEventListener('focusin', onFocus, true);
  focus(initial());
  let active = true;
  return () => {
    if (!active) return; active = false;
    const wasTop = top();
    stack.splice(stack.indexOf(dialog), 1);
    doc.removeEventListener('keydown', onKey, true); doc.removeEventListener('focusin', onFocus, true);
    for (const element of outside) {
      const layer = inertLayers.get(element)!;
      if (--layer.count === 0) { element.inert = layer.prior; inertLayers.delete(element); }
    }
    if (--bodyLock.count === 0) { body.style.overflow = bodyLock.prior; bodyLocks.delete(body); }
    if (wasTop && previous?.isConnected && !previous.closest('[inert]')) focus(previous);
  };
}
