import type { SessionSnapshot } from '@crimfig/session';

export function publicHeaderActions(snapshot: SessionSnapshot) {
  if (snapshot.status === 'authenticated' && !snapshot.signOut) {
    return [{ href: '/profile', label: 'My Account', primary: false }, { href: '/dashboard', label: 'Open Dashboard', primary: true }];
  }
  if (snapshot.status === 'anonymous' && (!snapshot.signOut || snapshot.signOut === 'complete' || snapshot.signOut === 'remote')) {
    return [{ href: '/login', label: 'Sign In', primary: false }, { href: '/signup', label: 'Create Account', primary: true }];
  }
  // A workspace link makes no claim about identity or permission. Its route stays guarded.
  return [{ href: '/dashboard', label: 'Open Dashboard', primary: true }];
}
