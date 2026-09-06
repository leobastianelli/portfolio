import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { LOCALE_COOKIE, isLocale, localeFromAcceptLanguage } from "@/lib/i18n";

/**
 * Sends locale-less requests to a localized route.
 *
 * A manual choice is stored in the `NEXT_LOCALE` cookie by the language
 * switcher and always beats `Accept-Language` detection. Requests that already
 * carry a locale segment fall through untouched, so a redirect can never loop.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isLocale(pathname.split("/")[1])) return;

  const chosen = request.cookies.get(LOCALE_COOKIE)?.value;
  const locale = isLocale(chosen)
    ? chosen
    : localeFromAcceptLanguage(request.headers.get("accept-language"));

  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;

  return NextResponse.redirect(url);
}

export const config = {
  // Everything except Next internals, API routes, the PostHog reverse proxy
  // (`/ingest/*`, see next.config.ts — a locale redirect there would break
  // event capture), and any path containing a dot (favicon.ico, sitemap.xml,
  // robots.txt, images).
  //
  // The literal dot is a character class on purpose: a `/` inside a class is
  // read by path-to-regexp as a path delimiter, and an escaped dot sits one
  // TypeScript-string layer away from collapsing into a bare `.`, which
  // would silently exclude every non-empty path.
  matcher: ["/((?!_next|api|ingest|.*[.]).*)"],
};
