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
        fontFamily: "var(--font-dm-mono)",
        fontSize: "0.7rem",
        letterSpacing: "0.1em",
        border: "1px solid var(--border)",
      }}
    >
      {locales.map((l, i) => {
        const current = l === locale;
        return (
          <Link
            key={l}
            href={localizePath(pathname, l)}
            hrefLang={l}
            aria-label={t.nav.localeNames[l]}
            aria-current={current ? "true" : undefined}
            onClick={() => rememberLocale(l)}
            style={{
              padding: "0.3rem 0.6rem",
              color: current ? "var(--gold)" : "var(--text-muted)",
              background: current ? "rgba(201,169,110,0.08)" : "transparent",
              borderRight: i === 0 ? "1px solid var(--border)" : "none",
              textTransform: "uppercase",
            }}
          >
            {l.toUpperCase()}
          </Link>
        );
      })}
    </div>
  );
}
