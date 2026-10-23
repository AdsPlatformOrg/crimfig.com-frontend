import { useEffect, useRef } from 'react';
import { activateDialog } from '../../../../shared/ui/dialog';

/** Attach to the existing panel. Parent must set dialog role/name, aria-modal and tabIndex=-1. */
export function useDialog(open: boolean, onClose: () => void) {
  const panel = useRef<HTMLDivElement>(null);
  const close = useRef(onClose); close.current = onClose;
  useEffect(() => {
    if (open && panel.current) return activateDialog(panel.current, () => close.current());
  }, [open]);
  return panel;
}
