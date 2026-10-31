"use client";
import { usePathname, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import { AdminGuard } from "./AdminGuard";
import { SessionGate } from "./SessionGate";
import { AdsConsoleShell } from "./console/AdsConsoleShell";

export { resolveWorkspaceContext } from "../lib/workspace-navigation";
import {
  resolveWorkspaceContext,
  type WorkspaceRole,
} from "../lib/workspace-navigation";
import { Suspense } from "react";
export function ProtectedWorkspace({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<p role="status">Resolving workspace...</p>}>
      <WorkspaceContent>{children}</WorkspaceContent>
    </Suspense>
  );
}
function WorkspaceContent({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const value = useSearchParams().get("workspace");
  const utilityRole: WorkspaceRole =
    value === "promoter" || value === "admin" ? value : "advertiser";
  const [role, activeNavId] = resolveWorkspaceContext(
    pathname,
    utilityRole || "advertiser",
  );

  const workspace = (
    <AdsConsoleShell role={role} activeNavId={activeNavId}>
      {children}
    </AdsConsoleShell>
  );

  // Safe Guarding: The ENTIRE /admin subtree requires AdminGuard
  const isAdminPath = pathname === "/admin" || pathname.startsWith("/admin/");
  return (
    <SessionGate>
      {role === "admin" || isAdminPath ? (
        <AdminGuard key={pathname}>{workspace}</AdminGuard>
      ) : (
        workspace
      )}
    </SessionGate>
  );
}
