"use client";

import { useLang } from "@/context/LanguageContext";

export default function Services() {
  const { t } = useLang();

  return (
    <section id="services" className="py-32 px-6 md:px-10">
      <div className="max-w-6xl mx-auto">
        <div className="reveal mb-16">
          <span className="gold-line" />
          <p
            className="section-label mb-3"
            style={{ fontFamily: "var(--font-dm-mono)" }}
          >
            {t.services.sectionLabel}
          </p>
          <h2
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 400,
              color: "var(--text)",
              lineHeight: 1.15,
            }}
          >
            {t.services.sectionTitleMain}{" "}
            <span style={{ fontStyle: "italic", color: "var(--gold)" }}>
              {t.services.sectionTitleItalic}
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {t.services.items.map((item, i) => (
            <div
              key={item.title}
              className="stack-card reveal p-8"
              style={{
                background: "rgba(255,255,255,0.012)",
                transitionDelay: `${i * 0.06}s`,
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-dm-mono)",
                  fontSize: "0.62rem",
                  letterSpacing: "0.22em",
                  color: "var(--gold)",
                  marginBottom: "0.8rem",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3
                style={{
                  fontFamily: "var(--font-playfair)",
                  fontSize: "1.3rem",
                  fontWeight: 400,
                  color: "var(--text)",
                  marginBottom: "0.6rem",
                }}
              >
                {item.title}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  fontSize: "0.92rem",
                  lineHeight: 1.72,
                  color: "var(--text-muted)",
                }}
              >
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
