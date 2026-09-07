import type { PageContext } from "@/lib/analytics-ops/types";

export function pageContextFromUrl(value: string): PageContext | null {
  let pathname: string;

  try {
    pathname = new URL(value, "https://leobastianelli.dev").pathname;
  } catch {
    return null;
  }

  pathname = pathname.replace(/\/{2,}/g, "/").replace(/\/$/, "") || "/";
  const segments = pathname.split("/").filter(Boolean);
  const locale = segments[0] === "en" || segments[0] === "es" ? segments[0] : "unknown";
  const rest = locale === "unknown" ? segments : segments.slice(1);

  let contentType: PageContext["contentType"] = "unknown";
  let contentSlug: string | null = null;

  if (locale !== "unknown" && rest.length === 0) {
    contentType = "home";
  } else if (locale !== "unknown" && rest[0] === "notes" && rest.length === 1) {
    contentType = "notes_index";
  } else if (locale !== "unknown" && rest[0] === "notes" && rest.length >= 2) {
    contentType = "note";
    contentSlug = rest.slice(1).join("/");
  }

  return { pageKey: pathname, locale, contentType, contentSlug };
}

export function isoDateDaysAgo(daysAgo: number): string {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - daysAgo);
  return date.toISOString().slice(0, 10);
}

export function nextIsoDate(date: string): string {
  const next = new Date(`${date}T00:00:00.000Z`);
  next.setUTCDate(next.getUTCDate() + 1);
  return next.toISOString().slice(0, 10);
}
