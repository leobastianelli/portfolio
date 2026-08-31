"use client";

import { useLang } from "@/context/LanguageContext";
import { SITE } from "@/lib/site";

export default function Hero() {
  const { t } = useLang();

  return (
    <section id="hero" className="relative px-6 md:px-10 pt-24 md:pt-32 pb-16 md:pb-24">
      <div className="max-w-6xl mx-auto w-full">
        {/* Label row — sólo el nombre */}
        <div className="fade-up mb-8">
          <span className="section-label" style={{ textTransform: "none" }}>
            {SITE.author}
          </span>
        </div>

        {/* Rótulo grande — one h1, styled as two lines (R-A: two <h1>s read as
            two top-level headings to a screen reader; this is one title).
            "Fullstack" en gris oscuro, "Developer" en negro, mismo tamaño. */}
        <h1
          className="font-display"
          style={{
            fontSize: "clamp(3.5rem, 10vw, 7rem)",
            lineHeight: 0.6,
            letterSpacing: "-0.08em",
            fontWeight: 900,
            textTransform: "uppercase",
            /* Compensa el side-bearing izquierdo del glifo a este tamaño:
               con la caja alineada al label de arriba, el display se ve
               igual metido hacia adentro. */
            marginLeft: "-0.05em",
          }}
        >
          <span
            className="fade-up delay-1 block"
            style={{ marginBottom: "0.15em", color: "var(--color-ink)", opacity: 0.55 }}
          >
            Fullstack
          </span>
          <span
            className="fade-up delay-2 block"
            style={{ marginBottom: "2.5rem", color: "var(--color-ink)" }}
          >
            Developer
          </span>
        </h1>

        {/* Intro */}
        <div className="fade-up delay-3 flex flex-col gap-4" style={{ maxWidth: "540px", marginBottom: "2.5rem" }}>
          <p
            className="editorial-type"
            style={{ fontSize: "clamp(1rem, 1.6vw, 1.2rem)", lineHeight: 1.75, color: "var(--color-ink-faded)" }}
          >
            {t.hero.intro}
          </p>
          <p
            className="editorial-type"
            style={{ fontSize: "clamp(1rem, 1.6vw, 1.2rem)", lineHeight: 1.75, color: "var(--color-ink-faded)" }}
          >
            {t.hero.introSecondary}
          </p>
        </div>

        {/* CTA */}
        <div className="fade-up delay-4 mb-24 md:mb-32">
          <a href={`mailto:${SITE.email}`} className="cta-btn font-mono">
            {t.hero.cta}
          </a>
        </div>

        {/* Absorbed "About" content: extended bio + info table */}
        <div className="reveal border-t border-[var(--border)] pt-16 grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          <div className="flex flex-col gap-5">
            <p className="section-label font-mono mb-1">{t.hero.moreLabel}</p>
            <p className="editorial-type" style={{ fontSize: "1.1rem", lineHeight: 1.75, color: "var(--color-ink)" }}>
              {t.hero.bioMore.p1}
            </p>
            <p className="editorial-type" style={{ fontSize: "1.05rem", lineHeight: 1.75, color: "var(--color-ink-faded)" }}>
              {t.hero.bioMore.p2pre}
              <a
                href="https://purpuraceniza.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent border-b border-[color-mix(in_srgb,var(--color-accent)_30%,transparent)] hover:border-[var(--color-accent)] transition-colors"
              >
                Púrpura Ceniza
              </a>
              {t.hero.bioMore.p2post}
            </p>
          </div>

          <div className="flex flex-col justify-start gap-0">
            {t.hero.table.map((row, i) => (
              <div
                key={row.label}
                className="flex flex-col gap-1 py-4"
                style={{
                  borderBottom: i < t.hero.table.length - 1 ? "1px solid var(--border)" : "none",
                }}
              >
                <span className="label-engraved">{row.label}</span>
                <span className="font-body text-ink" style={{ fontSize: "0.92rem" }}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
