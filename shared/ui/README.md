# Existing dashboard dialog behavior

`dialog.ts` supplies DOM-only focus and background behavior for the existing Ads/Billing overlays.
The app `useDialog` adapters activate it after the panel mounts and clean up on close/unmount.
Attach the returned ref to the actual panel, set `role="dialog"`, `aria-modal="true"`, a descriptive
accessible name and `tabIndex={-1}`. Enable the hook only while the panel is rendered, including any
session/view gates. Keep hooks unconditional. Close handlers must update the parent open state.

Opening focuses the first usable control (or panel). Tab/Shift+Tab wrap, Escape dismisses only the
topmost dialog, and outside focus is redirected inside. Outside siblings become inert and body scrolling
locks. Reference counts preserve nested locks and pre-existing inert/overflow values. Cleanup is
idempotent and restores the connected, non-inert invoking control when closing the topmost dialog.
Normal focus scrolling is intentional: short screens must reveal the focused control. Panel CSS must
bound height and permit vertical scrolling; overlays must clear the existing sticky error banner.

Actual local browser fixtures checked both dashboards, creative replacement, nested dialogs and
out-of-order underlying cleanup, keyboard wrapping/Escape/focus restoration and 375x600 scrolling.
Fixtures deny real mutations and have been removed. This is not a screen-reader or cross-browser
certification. Reduced-motion rules exist in both apps; CSS parsing was inspected, but an actual OS
reduced-motion preference was not emulated. Keep broader accessibility acceptance open.

Follow the [WAI modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/).
No credentials, browser storage or financial behavior belongs in this helper.
