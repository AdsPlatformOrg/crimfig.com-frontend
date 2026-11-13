"use client";
import { usePathname, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import { AdminGuard } from "./AdminGuard";
import { SessionGate } from "./SessionGate";
import { AdsConsoleShell } from "./console/AdsConsoleShell";
import styles from "./WorkspaceLoading.module.css";

export { resolveWorkspaceContext } from "../lib/workspace-navigation";
import {
  resolveWorkspaceContext,
  type WorkspaceRole,
} from "../lib/workspace-navigation";
import { Suspense } from "react";

function WorkspaceLoading({ dashboard = false }: { dashboard?: boolean }) {
  return (
    <div className={styles.loading}>
      <span role="status" className={styles.announcement}>Loading workspace…</span>
      <div aria-hidden="true" className={styles.placeholder}>
        <div className={styles.heading} />
        {dashboard && (
          <div className={styles.cards}>
            {[0, 1, 2, 3].map((card) => <div key={card} className={styles.card} />)}
          </div>
        )}
        <div className={styles.chart} />
      </div>
    </div>
  );
}

export function ProtectedWorkspace({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<WorkspaceLoading />}>
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
  const showPublicShell = role !== "admin" && !isAdminPath;
  const renderPendingShell = (content: ReactNode) => (
    <AdsConsoleShell role={role} activeNavId={activeNavId} pendingSession>
      {content}
    </AdsConsoleShell>
  );
  return (
    <SessionGate
      loadingShell={showPublicShell
        ? renderPendingShell(<WorkspaceLoading dashboard={pathname === "/dashboard"} />)
        : <WorkspaceLoading />}
      recoveryShell={showPublicShell ? renderPendingShell : undefined}
    >
      {role === "admin" || isAdminPath ? (
        <AdminGuard key={pathname}>{workspace}</AdminGuard>
      ) : (
        workspace
      )}
    </SessionGate>
  );
}
