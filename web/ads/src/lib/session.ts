"use client";

import { clearCampaignDrafts } from "./campaign-draft";
import { createSessionClient } from "@crimfig/session";

let client: ReturnType<typeof createSessionClient> | undefined;
export function dashboardSession() {
  if (typeof window === "undefined")
    throw new Error("Dashboard sessions require a browser");
  if (client) return client;
  client = createSessionClient({
    authOrigin:
      process.env.NEXT_PUBLIC_AUTH_WEB_URL ||
      (process.env.NODE_ENV === "production"
        ? "https://auth.crimfig.com"
        : "http://localhost:3000"),
    apiOrigins: [window.location.origin],
    crossTabSignOut: true,
    allowLocalHttp: process.env.NODE_ENV !== "production",
  });
  client.subscribe(() => {
    const snapshot = client!.getSnapshot();
    if (snapshot.signOut || snapshot.status === "anonymous") {
      try {
        clearCampaignDrafts(localStorage);
      } catch {
        /* Storage may be unavailable. */
      }
    }
  });
  return client;
}

/** First-party same-origin Next proxy only. Cookies belong solely to Auth refresh/logout. */
export function sessionFetch(input: string | URL, init?: RequestInit) {
  return dashboardSession().request(
    new URL(input, window.location.origin),
    init,
  );
}

export function loginUrl() {
  const auth =
    process.env.NEXT_PUBLIC_AUTH_WEB_URL ||
    (process.env.NODE_ENV === "production"
      ? "https://auth.crimfig.com"
      : "http://localhost:3000");
  const url = new URL("/login", auth);
  const back = new URL(window.location.href);
  back.searchParams.set("view", "console");
  back.hash = "";
  url.searchParams.set("return_to", back.href);
  return url.href;
}
