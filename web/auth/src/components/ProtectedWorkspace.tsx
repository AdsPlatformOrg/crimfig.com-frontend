'use client';
import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { SessionGate } from './SessionGate';
import { AuthConsoleShell } from './AuthConsoleShell';
export function ProtectedWorkspace({children}: {children: ReactNode}) {
 const path = usePathname();
 return <SessionGate><AuthConsoleShell activePath={path}>{children}</AuthConsoleShell></SessionGate>;
}
