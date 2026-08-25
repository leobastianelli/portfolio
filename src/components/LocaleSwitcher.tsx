"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang } from "@/context/LanguageContext";
import {
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  locales,
  localizePath,
  type Locale,
} from "@/lib/i18n";

/**
 * Remembers an explicit choice so `Accept-Language` detection never overrides
 * it on a later visit.
 */
function rememberLocale(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}; samesite=lax`;
}

export default function LocaleSwitcher() {
  const { locale, t } = useLang();
  const pathname = usePathname();

  return (
    <div
      role="group"
      aria-label={t.nav.language}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.35rem",
      }}
    >
      {locales.map((l, i) => {
        const current = l === locale;
        return (
          <span key={l} style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
            {i > 0 && (
              <span aria-hidden="true" className="label-engraved" style={{ opacity: 0.5 }}>
                /
              </span>
            )}
            <Link
              href={localizePath(pathname, l)}
              hrefLang={l}
              aria-label={t.nav.localeNames[l]}
              aria-current={current ? "true" : undefined}
              onClick={() => rememberLocale(l)}
              className="label-engraved"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                /* R-A: the visible glyph stays label-sized, but the tap
                   target grows via padding + a matching negative margin so
                   surrounding spacing doesn't shift. */
                padding: "0.6rem",
                margin: "-0.6rem",
                color: current ? "var(--color-ink)" : "var(--color-engrave)",
                opacity: current ? 1 : 0.65,
              }}
            >
              {l.toUpperCase()}
            </Link>
          </span>
        );
      })}
    </div>
  );
}
