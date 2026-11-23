'use client';

import { useLanguage } from '../../../../../shared/ui/localization/LocalizationProvider';
import type { Locale } from '../../../../../shared/ui/localization/locale';
import previewMessages from './landing-preview-messages.json';

export function usePreviewCopy() {
  const { locale } = useLanguage();
  return (source: keyof typeof previewMessages) =>
    locale === 'fr' || locale === 'es' ? previewMessages[source][locale] : source;
}

export function adsPreviewHref(path: '/' | '/about' | '/faq' | '/#what-we-do' | '/#partners', locale: Locale) {
  if (locale !== 'fr' && locale !== 'es') return path;
  const [pathname, fragment] = path.split('#');
  return `${pathname}?lang=${locale}${fragment ? '#' + fragment : ''}`;
}
