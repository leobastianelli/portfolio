"use client";

import { useLang } from "@/context/LanguageContext";

export default function Stack() {
  const { t } = useLang();

  return (
    <section id="stack" className="py-32 px-6 md:px-10" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="reveal mb-16">
          <span className="accent-line" />
          <p className="section-label font-mono mb-3">{t.stack.sectionLabel}</p>
          <h2 className="font-display text-ink" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 400, lineHeight: 1.15 }}>
            Stack & <span className="italic text-accent">{t.stack.sectionTitleItalic}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {t.stack.groups.map((group, i) => (
            <div key={group.category} className="stack-card reveal p-7" style={{ transitionDelay: `${i * 0.06}s` }}>
              <p className="font-mono text-accent" style={{ fontSize: "0.62rem", letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: "1.2rem" }}>
                {group.category}
              </p>

              <ul className="flex flex-col gap-2">
                {group.items.map((item) => (
                  <li key={item} className="font-body text-ink flex items-center gap-2" style={{ fontSize: "0.9rem" }}>
                    <span className="inline-block w-1 h-1 rounded-full bg-accent flex-shrink-0 opacity-60" />
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
