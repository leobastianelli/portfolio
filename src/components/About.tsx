"use client";

import { useLang } from "@/context/LanguageContext";

export default function About() {
  const { t } = useLang();
  const a = t.about;

  return (
    <section
      id="about"
      className="py-32 px-6 md:px-10"
      style={{ borderTop: "1px solid var(--border)" }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="reveal mb-16">
          <span className="gold-line" />
          <p
            className="section-label mb-3"
            style={{ fontFamily: "var(--font-dm-mono)" }}
          >
            {a.sectionLabel}
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
            {a.sectionTitleMain}{" "}
            <span style={{ fontStyle: "italic", color: "var(--gold)" }}>
              {a.sectionTitleItalic}
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          {/* Bio column */}
          <div className="reveal flex flex-col gap-5">
            <p
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: "1.05rem",
                lineHeight: 1.8,
                color: "var(--text)",
              }}
            >
              {a.p1}
            </p>
            <p
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: "1rem",
                lineHeight: 1.8,
                color: "var(--text-muted)",
              }}
            >
              {a.p2}
            </p>
            <p
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: "1rem",
                lineHeight: 1.8,
                color: "var(--text-muted)",
              }}
            >
              {a.p3pre}
              <a
                href="https://purpuraceniza.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "var(--gold)",
                  borderBottom: "1px solid rgba(201,169,110,0.3)",
                  transition: "border-color 0.2s",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.borderColor =
                    "var(--gold)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.borderColor =
                    "rgba(201,169,110,0.3)")
                }
              >
                Púrpura Ceniza
              </a>
              {a.p3post}
            </p>
          </div>

          {/* Info table column */}
          <div className="reveal flex flex-col justify-start gap-0">
            {a.table.map((row, i) => (
              <div
                key={row.label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "1.1rem 0",
                  borderBottom:
                    i < a.table.length - 1
                      ? "1px solid var(--border)"
                      : "none",
                  gap: "0.25rem",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-dm-mono)",
                    fontSize: "0.62rem",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "var(--gold)",
                  }}
                >
                  {row.label}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-dm-sans)",
                    fontSize: "0.92rem",
                    color: "var(--text)",
                  }}
                >
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
