export function sessionFetch(url: string | URL, init?: RequestInit): Promise<Response>;
export function dashboardSession(): {
  getProfile(): Promise<{ userId: string }>;
  getSnapshot(): { status: string; signOut?: boolean; userId?: string | null; identityVersion?: number };
};
