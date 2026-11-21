import { headers } from "next/headers";

/** Only allow redirects to paths inside this site (blocks open-redirect tricks). */
export function safeNext(value: FormDataEntryValue | string | null | undefined, fallback = "/") {
  const v = typeof value === "string" ? value : "";
  return v.startsWith("/") && !v.startsWith("//") && !v.includes("\\") ? v : fallback;
}

/** The site's own origin, used for email confirmation links. */
export async function getOrigin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

export const HANDLE_RE = /^[a-z0-9_]{3,30}$/;
