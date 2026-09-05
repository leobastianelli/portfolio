"use client";

import { useLang } from "@/context/LanguageContext";
import { StackIcons } from "@/components/StackIcons";

export default function Stack() {
  const { t } = useLang();

  return (
    <section id="stack" className="site-section px-5 md:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="reveal mb-7">
          <p className="section-label font-mono mb-3">{t.stack.sectionLabel}</p>
          <h2 className="editorial-type" style={{ fontSize: "var(--text-title)", fontWeight: 500, lineHeight: 1.15, color: "var(--color-ink)" }}>
            Stack & <span className="italic">{t.stack.sectionTitleItalic}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-7">
          {t.stack.groups.map((group, i) => (
            <div key={group.category} className="stack-card reveal pt-5" style={{ transitionDelay: `${i * 0.06}s` }}>
              <p className="font-mono" style={{ fontSize: "var(--text-2xs)", letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: "1.2rem", color: "var(--color-ink-faded)" }}>
                {group.category}
              </p>

              <StackIcons stack={group.items} variant="labeled" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
