/**
 * Locale primitives. No dependencies: two locales and a static site do not
 * justify an i18n library.
 */

export const locales = ["en", "es"] as const;

export type Locale = (typeof locales)[number];

/** Used when the visitor gives us nothing to go on. */
export const defaultLocale: Locale = "en";

/** Written only when the visitor picks a language by hand. */
export const LOCALE_COOKIE = "NEXT_LOCALE";

export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function isLocale(value: string | undefined | null): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}

/**
 * Resolve a locale from an `Accept-Language` header.
 *
 * Walks the tags in descending quality order and returns the first one we
 * support, so `fr-FR,fr;q=0.9,es;q=0.7` resolves to Spanish rather than falling
 * straight through to the default. Any `es-*` variant is Spanish; everything
 * else is English.
 */
export function localeFromAcceptLanguage(header: string | null): Locale {
  if (!header) return defaultLocale;

  const tags = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params
        .map((p) => p.trim())
        .find((p) => p.startsWith("q="))
        ?.slice(2);
      const quality = q === undefined ? 1 : Number.parseFloat(q);
      return {
        language: tag.trim().toLowerCase().split("-")[0],
        quality: Number.isFinite(quality) ? quality : 0,
      };
    })
    .filter((tag) => tag.quality > 0)
    .sort((a, b) => b.quality - a.quality);

  for (const { language } of tags) {
    if (isLocale(language)) return language;
  }

  return defaultLocale;
}

/** The locale segment of a pathname, or null if there isn't one. */
export function localeFromPath(pathname: string): Locale | null {
  const segment = pathname.split("/")[1];
  return isLocale(segment) ? segment : null;
}

/** Strip the locale segment: `/es/notes/foo` -> `/notes/foo`, `/es` -> `/`. */
export function stripLocale(pathname: string): string {
  if (!localeFromPath(pathname)) return pathname;
  const rest = pathname.slice(3);
  return rest.startsWith("/") ? rest : `/${rest}`;
}

/**
 * The same page in another locale. This is what the language switcher links to,
 * so a visitor reading /es/notes/foo lands on /en/notes/foo and not on the home
 * page.
 */
export function localizePath(pathname: string, locale: Locale): string {
  const path = stripLocale(pathname);
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

/** Absolute URL for a locale-less path, e.g. `/notes` -> `https://…/en/notes`. */
export function localizedUrl(baseUrl: string, path: string, locale: Locale): string {
  return `${baseUrl}${localizePath(path, locale)}`;
}
