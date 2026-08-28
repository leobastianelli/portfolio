"use client";

import { useLang } from "@/context/LanguageContext";
import { SITE } from "@/lib/site";

export default function Hero() {
  const { t } = useLang();
  const [firstName, ...rest] = SITE.author.split(" ");
  const lastName = rest.join(" ");

  return (
    <section id="hero" className="relative px-6 md:px-10 pt-24 md:pt-32 pb-16 md:pb-24">
      <div className="max-w-6xl mx-auto w-full">
        {/* Label row */}
        <div className="fade-up flex items-center gap-3 mb-8 font-mono">
          <span className="section-label">{t.hero.labelRole}</span>
          <span className="inline-block h-px w-8 bg-accent" />
          <span className="section-label">{t.hero.labelCity}</span>
        </div>

        {/* Display name — one h1, styled as two lines (R-A: two <h1>s read as
            two top-level headings to a screen reader; this is one name). */}
        <h1
          className="font-display text-ink"
          style={{
            fontSize: "clamp(3.5rem, 10vw, 9rem)",
            lineHeight: 0.92,
            letterSpacing: "-0.02em",
            fontWeight: 400,
          }}
        >
          <span className="fade-up delay-1 block" style={{ marginBottom: "0.15em" }}>
            {firstName} /
          </span>
          <span className="fade-up delay-2 block text-accent italic" style={{ marginBottom: "2.5rem" }}>
            {lastName}
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
