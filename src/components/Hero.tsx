"use client";

import { useLang } from "@/context/LanguageContext";
import { SITE } from "@/lib/site";

export default function Hero() {
  const { t } = useLang();

  return (
    <section
      id="hero"
      className="relative flex flex-col justify-center min-h-screen px-6 md:px-10 pt-16"
      style={{ maxWidth: "100%" }}
    >
      {/* Subtle radial glow */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "10%",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(201,169,110,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div className="max-w-6xl mx-auto w-full">
        {/* Label */}
        <div
          className="fade-up flex items-center gap-3 mb-8"
          style={{ fontFamily: "var(--font-dm-mono)" }}
        >
          <span className="section-label">{t.hero.labelRole}</span>
          <span
            style={{
              display: "inline-block",
              width: "32px",
              height: "1px",
              background: "var(--gold)",
            }}
          />
          <span className="section-label">{t.hero.labelCity}</span>
        </div>

        {/* Display name */}
        <h1
          className="fade-up delay-1"
          style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "clamp(3.5rem, 10vw, 9rem)",
            lineHeight: 0.92,
            letterSpacing: "-0.02em",
            fontWeight: 400,
            color: "var(--text)",
            marginBottom: "0.15em",
          }}
        >
          Leo /
        </h1>
        <h1
          className="fade-up delay-2"
          style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "clamp(3.5rem, 10vw, 9rem)",
            lineHeight: 0.92,
            letterSpacing: "-0.02em",
            fontWeight: 400,
            fontStyle: "italic",
            color: "var(--gold)",
            marginBottom: "2.5rem",
          }}
        >
          Bastianelli
        </h1>

        {/* Bio */}
        <p
          className="fade-up delay-3"
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: "clamp(0.95rem, 1.5vw, 1.15rem)",
            lineHeight: 1.75,
            color: "var(--text-muted)",
            maxWidth: "540px",
            marginBottom: "2.5rem",
          }}
        >
          {t.hero.bio}
        </p>

        {/* CTA */}
        <div className="fade-up delay-4">
          <a
            href={`mailto:${SITE.email}`}
            className="cta-btn"
            style={{ fontFamily: "var(--font-dm-mono)" }}
          >
            {t.hero.cta}
          </a>
        </div>

        {/* Scroll hint */}
        <div
          style={{
            position: "absolute",
            bottom: "2.5rem",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem",
            opacity: 0.35,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-dm-mono)",
              fontSize: "0.6rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
            }}
          >
            Scroll
          </span>
          <div
            style={{
              width: "1px",
              height: "40px",
              background:
                "linear-gradient(to bottom, var(--gold-dim), transparent)",
            }}
          />
        </div>
      </div>
    </section>
  );
}
