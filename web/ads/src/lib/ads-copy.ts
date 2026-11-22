import type { Locale } from '../../../../shared/ui/localization/locale';

export type AdsDashboardCopy = {
  title: string;
  adSpend: string;
  impressions: string;
  clicks: string;
  additionalDetails: string;
  remainingBudget: string;
  billedCtr: string;
  unavailable: string;
  billedClicks: string;
  engagementTimeseries: string;
  channelAttribution: string;
  views: string;
};

const EN: AdsDashboardCopy = {
  title: 'Ads Console Dashboard',
  adSpend: 'Ad Spend',
  impressions: 'Impressions',
  clicks: 'Clicks',
  additionalDetails: 'Additional Details',
  remainingBudget: 'Remaining Campaign Budget',
  billedCtr: 'Billed CTR',
  unavailable: 'Unavailable',
  billedClicks: 'billed clicks',
  engagementTimeseries: 'Engagement Timeseries',
  channelAttribution: 'Channel Attribution',
  views: 'views',
};

const FR: AdsDashboardCopy = {
  title: 'Tableau de bord Ads Console',
  adSpend: 'Dépenses publicitaires',
  impressions: 'Impressions',
  clicks: 'Clics',
  additionalDetails: 'Détails supplémentaires',
  remainingBudget: 'Budget de campagne restant',
  billedCtr: 'CTR facturé',
  unavailable: 'Indisponible',
  billedClicks: 'clics facturés',
  engagementTimeseries: 'Série chronologique d’engagement',
  channelAttribution: 'Attribution par canal',
  views: 'vues',
};

const ES: AdsDashboardCopy = {
  title: 'Panel de Ads Console',
  adSpend: 'Gasto publicitario',
  impressions: 'Impresiones',
  clicks: 'Clics',
  additionalDetails: 'Detalles adicionales',
  remainingBudget: 'Presupuesto restante de campaña',
  billedCtr: 'CTR facturado',
  unavailable: 'No disponible',
  billedClicks: 'clics facturados',
  engagementTimeseries: 'Serie temporal de interacción',
  channelAttribution: 'Atribución por canal',
  views: 'vistas',
};

const ADS_DASHBOARD_COPY: Partial<Record<Locale, AdsDashboardCopy>> = {
  en: EN,
  fr: FR,
  es: ES,
};

export function getAdsDashboardCopy(locale: Locale): AdsDashboardCopy {
  return ADS_DASHBOARD_COPY[locale] ?? EN;
}
