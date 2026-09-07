"use client";

import { useLang } from "@/context/LanguageContext";
import { getContactLinks } from "@/lib/contactLinks";
import { analytics } from "@/lib/analytics";

export default function Contact() {
  const { t } = useLang();
  const c = t.contact;
  const contactLinks = getContactLinks(t);

  return (
    <section id="contact" className="site-section px-5 md:px-6" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="max-w-6xl mx-auto">
        {/* Headline */}
        <div className="reveal mb-6 text-center">
          <p className="section-label font-mono mb-3">{c.sectionLabel}</p>
          <h2 className="editorial-type" style={{ fontSize: "var(--text-display)", fontWeight: 500, lineHeight: 1.1, letterSpacing: "-0.01em", color: "var(--color-ink)" }}>
            {c.headlineMain} <span className="italic">{c.headlineItalic}</span>
          </h2>
        </div>

        {/* Subtitle */}
        <div className="reveal mb-7 text-center">
          <p className="editorial-type mx-auto" style={{ fontSize: "var(--text-base)", lineHeight: 1.7, maxWidth: "460px", color: "var(--color-ink-faded)" }}>
            {c.subtitle}
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-col md:flex-row justify-center gap-4">
          {contactLinks.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => analytics.contactClick(link.key as "email" | "linkedin" | "github", "contact_section")}
              target={link.href.startsWith("mailto") ? undefined : "_blank"}
              rel={link.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
              className="reveal project-card flex-1 p-6 md:p-7 flex flex-col gap-2 group no-underline"
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              <span className="font-mono text-accent" style={{ fontSize: "var(--text-2xs)", letterSpacing: "0.2em", textTransform: "uppercase" }}>
                {link.label}
              </span>
              <span
                className={`${link.mono ? "font-mono" : "font-body"} text-ink group-hover:text-accent transition-colors`}
                style={{ fontSize: link.mono ? "var(--text-xs)" : "var(--text-sm)", wordBreak: "break-all" }}
              >
                {link.value}
              </span>
              <span className="contact-card__arrow mt-auto pt-4 text-accent opacity-0 -translate-x-1 group-hover:opacity-70 group-hover:translate-x-0 transition-all" style={{ fontSize: "var(--text-lg)" }} aria-hidden="true">
                ↗
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
