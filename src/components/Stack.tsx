"use client";

import { useLang } from "@/context/LanguageContext";

export default function Stack() {
  const { t } = useLang();

  return (
    <section id="stack" className="py-20 md:py-32 px-6 md:px-10" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="reveal mb-16">
          <p className="section-label font-mono mb-3">{t.stack.sectionLabel}</p>
          <h2 className="editorial-type" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 500, lineHeight: 1.15, color: "var(--color-ink)" }}>
            Stack & <span className="italic" style={{ color: "var(--color-accent-ink)" }}>{t.stack.sectionTitleItalic}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
          {t.stack.groups.map((group, i) => (
            <div key={group.category} className="stack-card reveal pt-5" style={{ transitionDelay: `${i * 0.06}s` }}>
              <p className="font-mono" style={{ fontSize: "0.62rem", letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: "1.2rem", color: "var(--color-accent-ink)" }}>
                {group.category}
              </p>

              <ul className="flex flex-col gap-2">
                {group.items.map((item) => (
                  <li key={item} className="font-body flex items-center gap-2" style={{ fontSize: "0.9rem", color: "var(--color-ink)" }}>
                    <span className="inline-block w-1 h-1 rounded-full flex-shrink-0 opacity-60" style={{ background: "var(--color-accent-ink)" }} />
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
