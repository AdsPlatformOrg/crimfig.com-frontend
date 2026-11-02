export function sessionFetch(url: string | URL, init?: RequestInit): Promise<Response>;
export function dashboardSession(): {
  subscribe(listener:(snapshot:{status:string;signOut?:boolean;identityVersion?:number})=>void):()=>void;
  getProfile(): Promise<{ userId: string }>;
  getSnapshot(): { status: string; signOut?: boolean; userId?: string | null; identityVersion?: number };
};
