"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { defaultLocale, localeFromPath, type Locale } from "@/lib/i18n";
import enUi from "../../../ui/en.json";
import esUi from "../../../ui/es.json";

// `not-found.tsx` renders wherever `notFound()` is thrown (e.g. a bad
// `/notes/[slug]`) but — per Next's docs — never receives `params`, so the
// locale can't come from the usual server-side chain. It's read from the
// URL client-side instead (the pattern Next's own docs suggest for
// path-dependent not-found content), and the copy is imported directly from
// the JSON files rather than through `getUi` (a server-only fs read).
const NOT_FOUND_COPY: Record<Locale, { title: string; message: string; backHome: string }> = {
  en: enUi.notFound,
  es: esUi.notFound,
};

export default function NotFound() {
  const pathname = usePathname();
  const locale = localeFromPath(pathname) ?? defaultLocale;
  const t = NOT_FOUND_COPY[locale];

  return (
    <main
      className="site-section px-5 md:px-6 flex items-center justify-center"
      style={{ minHeight: "70vh" }}
    >
      <div className="text-center">
        <p className="section-label font-mono mb-3">{t.title}</p>
        <h1
          className="editorial-type"
          style={{ fontSize: "var(--text-title)", fontWeight: 500, color: "var(--color-ink)" }}
        >
          {t.message}
        </h1>
        <Link href={`/${locale}`} className="label-engraved" style={{ display: "inline-block", marginTop: "2rem" }}>
          {t.backHome}
        </Link>
      </div>
    </main>
  );
}
