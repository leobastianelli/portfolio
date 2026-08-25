"use client";

import { useLang } from "@/context/LanguageContext";

export default function Stack() {
  const { t } = useLang();

  return (
    <section
      id="stack"
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
            {t.stack.sectionLabel}
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
            Stack &{" "}
            <span style={{ fontStyle: "italic", color: "var(--gold)" }}>
              {t.stack.sectionTitleItalic}
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {t.stack.groups.map((group, i) => (
            <div
              key={group.category}
              className="stack-card reveal p-7"
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
                  textTransform: "uppercase",
                  color: "var(--gold)",
                  marginBottom: "1.2rem",
                }}
              >
                {group.category}
              </p>

              <ul className="flex flex-col gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    style={{
                      fontFamily: "var(--font-dm-sans)",
                      fontSize: "0.9rem",
                      color: "var(--text)",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.6rem",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        width: "4px",
                        height: "4px",
                        borderRadius: "50%",
                        background: "var(--gold)",
                        flexShrink: 0,
                        opacity: 0.6,
                      }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
