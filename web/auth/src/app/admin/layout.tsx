import type { ReactNode } from 'react';
import { SessionGate } from '../../components/SessionGate';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <SessionGate>{children}</SessionGate>;
}
