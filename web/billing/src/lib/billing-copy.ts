import type { Locale } from '../../../../shared/ui/localization/locale';

export type BillingNavCopy = {
  workspaces: string;
  wallet: string;
  payouts: string;
  rewards: string;
  walletAndBalances: string;
  walletOverview: string;
  fundWallet: string;
  transactionsAndReceipts: string;
  paymentMethods: string;
  savedCards: string;
  subscriptions: string;
  support: string;
  helpAndInquiries: string;
  publisherAndPayouts: string;
  bankAccounts: string;
  requestWithdrawal: string;
  settlementHistory: string;
  payoutStatements: string;
  payoutInquiries: string;
  rewardsAndPerks: string;
  rewardsHub: string;
  redemptionStatements: string;
  redemptionHistory: string;
  rewardsInquiries: string;
  faq: string;
  dismiss: string;
};

const EN: BillingNavCopy = {
  workspaces: 'Workspaces',
  wallet: 'Wallet',
  payouts: 'Payouts',
  rewards: 'Rewards',
  walletAndBalances: 'Wallet & Balances',
  walletOverview: 'Wallet Overview',
  fundWallet: 'Fund Wallet',
  transactionsAndReceipts: 'Transactions & Receipts',
  paymentMethods: 'Payment Methods',
  savedCards: 'Saved Cards',
  subscriptions: 'Subscriptions',
  support: 'Support',
  helpAndInquiries: 'Help & Inquiries',
  publisherAndPayouts: 'Publisher & Payouts',
  bankAccounts: 'Bank Accounts',
  requestWithdrawal: 'Request Withdrawal',
  settlementHistory: 'Settlement History',
  payoutStatements: 'Payout Statements',
  payoutInquiries: 'Payout Inquiries',
  rewardsAndPerks: 'Rewards & Perks',
  rewardsHub: 'Rewards Hub',
  redemptionStatements: 'Redemption Statements',
  redemptionHistory: 'Redemption History',
  rewardsInquiries: 'Rewards Inquiries',
  faq: 'FAQ',
  dismiss: 'Dismiss',
};

const FR: BillingNavCopy = {
  workspaces: 'Espaces',
  wallet: 'Portefeuille',
  payouts: 'Paiements',
  rewards: 'Récompenses',
  walletAndBalances: 'Portefeuille et soldes',
  walletOverview: 'Aperçu du portefeuille',
  fundWallet: 'Alimenter le portefeuille',
  transactionsAndReceipts: 'Transactions et reçus',
  paymentMethods: 'Moyens de paiement',
  savedCards: 'Cartes enregistrées',
  subscriptions: 'Abonnements',
  support: 'Support',
  helpAndInquiries: 'Aide et demandes',
  publisherAndPayouts: 'Éditeur et paiements',
  bankAccounts: 'Comptes bancaires',
  requestWithdrawal: 'Demander un retrait',
  settlementHistory: 'Historique des règlements',
  payoutStatements: 'Relevés de paiement',
  payoutInquiries: 'Demandes de paiement',
  rewardsAndPerks: 'Récompenses et avantages',
  rewardsHub: 'Centre des récompenses',
  redemptionStatements: 'Relevés d’échange',
  redemptionHistory: 'Historique des échanges',
  rewardsInquiries: 'Demandes de récompenses',
  faq: 'FAQ',
  dismiss: 'Fermer',
};

const ES: BillingNavCopy = {
  workspaces: 'Espacios',
  wallet: 'Billetera',
  payouts: 'Pagos',
  rewards: 'Recompensas',
  walletAndBalances: 'Billetera y saldos',
  walletOverview: 'Resumen de billetera',
  fundWallet: 'Recargar billetera',
  transactionsAndReceipts: 'Transacciones y recibos',
  paymentMethods: 'Métodos de pago',
  savedCards: 'Tarjetas guardadas',
  subscriptions: 'Suscripciones',
  support: 'Soporte',
  helpAndInquiries: 'Ayuda y consultas',
  publisherAndPayouts: 'Editor y pagos',
  bankAccounts: 'Cuentas bancarias',
  requestWithdrawal: 'Solicitar retiro',
  settlementHistory: 'Historial de liquidación',
  payoutStatements: 'Estados de pago',
  payoutInquiries: 'Consultas de pago',
  rewardsAndPerks: 'Recompensas y beneficios',
  rewardsHub: 'Centro de recompensas',
  redemptionStatements: 'Estados de canje',
  redemptionHistory: 'Historial de canjes',
  rewardsInquiries: 'Consultas de recompensas',
  faq: 'FAQ',
  dismiss: 'Cerrar',
};

const BILLING_NAV_COPY: Partial<Record<Locale, BillingNavCopy>> = {
  en: EN,
  fr: FR,
  es: ES,
};

export function getBillingNavCopy(locale: Locale): BillingNavCopy {
  return BILLING_NAV_COPY[locale] ?? EN;
}
