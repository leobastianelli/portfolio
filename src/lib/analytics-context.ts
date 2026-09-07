import { SITE } from "@/lib/site";

export const ANALYTICS_INTERNAL_STORAGE_KEY = "lb_analytics_internal";

export type AnalyticsEnvironment = "production" | "preview" | "development";
export type AnalyticsContentType = "home" | "notes_index" | "note" | "unknown";

export type AnalyticsPageContext = {
  page_key: string;
  locale: "en" | "es" | "unknown";
  content_type: AnalyticsContentType;
  content_slug?: string;
  environment: AnalyticsEnvironment;
};

function normalizePathname(pathname: string): string {
  if (!pathname || pathname === "/") return "/";
  return `/${pathname.split("/").filter(Boolean).join("/")}`;
}

export function pageContextFromPathname(
  pathname: string,
  hostname: string,
): AnalyticsPageContext {
  const pageKey = normalizePathname(pathname);
  const segments = pageKey.split("/").filter(Boolean);
  const locale = segments[0] === "en" || segments[0] === "es" ? segments[0] : "unknown";
  const routeSegments = locale === "unknown" ? segments : segments.slice(1);

  let contentType: AnalyticsContentType = "unknown";
  let contentSlug: string | undefined;

  if (routeSegments.length === 0) {
    contentType = "home";
  } else if (routeSegments[0] === "notes" && routeSegments.length === 1) {
    contentType = "notes_index";
  } else if (routeSegments[0] === "notes" && routeSegments.length === 2) {
    contentType = "note";
    contentSlug = routeSegments[1];
  }

  const productionHostname = new URL(SITE.url).hostname;
  const environment: AnalyticsEnvironment =
    hostname === productionHostname
      ? "production"
      : hostname === "localhost" || hostname === "127.0.0.1"
        ? "development"
        : "preview";

  return {
    page_key: pageKey,
    locale,
    content_type: contentType,
    ...(contentSlug ? { content_slug: contentSlug } : {}),
    environment,
  };
}

/**
 * `?internal=1` opts this browser out of collection. `?internal=0` clears the
 * marker. The explicit query value wins so the opt-out can always be undone.
 */
export function isInternalAnalyticsBrowser(url: URL): boolean {
  try {
    const explicitValue = url.searchParams.get("internal");
    if (explicitValue === "1") {
      window.localStorage.setItem(ANALYTICS_INTERNAL_STORAGE_KEY, "1");
      return true;
    }
    if (explicitValue === "0") {
      window.localStorage.removeItem(ANALYTICS_INTERNAL_STORAGE_KEY);
      return false;
    }
    return window.localStorage.getItem(ANALYTICS_INTERNAL_STORAGE_KEY) === "1";
  } catch {
    // Storage can be unavailable in hardened/private browser contexts.
    return url.searchParams.get("internal") === "1";
  }
}

export function currentAnalyticsContext(): AnalyticsPageContext | null {
  if (typeof window === "undefined") return null;
  return pageContextFromPathname(window.location.pathname, window.location.hostname);
}

export function shouldCollectAnalytics(): boolean {
  if (typeof window === "undefined" || process.env.NODE_ENV !== "production") return false;
  const url = new URL(window.location.href);
  return currentAnalyticsContext()?.environment === "production" && !isInternalAnalyticsBrowser(url);
}
