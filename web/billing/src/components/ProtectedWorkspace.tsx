'use client';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { SessionGate } from './SessionGate';
import { BillingConsole } from './console/BillingConsole';
const tabs: Record<string, 'overview' | 'cards' | 'subscriptions' | 'bank_accounts' | 'transactions' | 'rewards' | 'support'> = {
  "/cards": "cards",
  "/dashboard": "overview",
  "/payouts": "bank_accounts",
  "/rewards": "rewards",
  "/subscriptions": "subscriptions",
  "/support": "support",
  "/transactions": "transactions",
  "/rewards/leaderboard": "rewards"
};
export function ProtectedWorkspace({children}: {children: ReactNode}) {
 const path = usePathname();
 return <SessionGate><BillingConsole initialTab={tabs[path] ?? 'overview'} />{children}</SessionGate>;
}
