"use client";

import { useLang } from "@/context/LanguageContext";
import { SITE } from "@/lib/site";

export default function Footer() {
  const { t } = useLang();

  return (
    <footer className="px-6 md:px-10 py-8" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <span className="font-mono text-accent" style={{ fontSize: "0.8rem", letterSpacing: "0.06em" }}>
          {SITE.name}
        </span>

        <span className="font-mono text-ink-soft" style={{ fontSize: "0.68rem", letterSpacing: "0.1em" }}>
          {t.footer.copyright}
        </span>

        <a
          href={`mailto:${SITE.email}`}
          className="font-mono text-ink-soft hover:text-accent transition-colors"
          style={{ fontSize: "0.68rem", letterSpacing: "0.08em" }}
        >
          {SITE.email}
        </a>
      </div>
    </footer>
  );
}
