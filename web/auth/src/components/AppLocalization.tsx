'use client';

import type { ReactNode } from 'react';
import { LocalizationProvider } from '../../../../shared/ui/localization/LocalizationProvider';
import type { Locale } from '../../../../shared/ui/localization/locale';
import { consentSession } from '../lib/consent';

export function AppLocalization({ children, availableLocales }: { children: ReactNode; availableLocales: readonly Locale[] }) {
  return <LocalizationProvider initialLocale="en" availableLocales={availableLocales} getSession={consentSession}>
    {children}
  </LocalizationProvider>;
}
