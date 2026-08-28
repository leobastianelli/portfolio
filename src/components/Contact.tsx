"use client";

import { useLang } from "@/context/LanguageContext";
import { getContactLinks } from "@/lib/contactLinks";

export default function Contact() {
  const { t } = useLang();
  const c = t.contact;
  const contactLinks = getContactLinks(t);

  return (
    <section id="contact" className="py-20 md:py-32 px-6 md:px-10" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="max-w-6xl mx-auto">
        {/* Headline */}
        <div className="reveal mb-6 text-center">
          <p className="section-label font-mono mb-4">{c.sectionLabel}</p>
          <h2 className="editorial-type" style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", fontWeight: 500, lineHeight: 1.1, letterSpacing: "-0.01em", color: "var(--color-ink)" }}>
            {c.headlineMain} <span className="italic" style={{ color: "var(--color-accent-ink)" }}>{c.headlineItalic}</span>
          </h2>
        </div>

        {/* Subtitle */}
        <div className="reveal mb-16 text-center">
          <p className="editorial-type mx-auto" style={{ fontSize: "1rem", lineHeight: 1.7, maxWidth: "460px", color: "var(--color-ink-faded)" }}>
            {c.subtitle}
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-col md:flex-row justify-center gap-4">
          {contactLinks.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("mailto") ? undefined : "_blank"}
              rel={link.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
              className="reveal project-card flex-1 p-8 md:p-10 flex flex-col gap-2 group no-underline"
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              <span className="font-mono text-accent" style={{ fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>
                {link.label}
              </span>
              <span
                className={`${link.mono ? "font-mono" : "font-body"} text-ink group-hover:text-accent transition-colors`}
                style={{ fontSize: link.mono ? "0.8rem" : "0.95rem", wordBreak: "break-all" }}
              >
                {link.value}
              </span>
              <span className="mt-auto pt-4 text-accent opacity-0 -translate-x-1 group-hover:opacity-70 group-hover:translate-x-0 transition-all" style={{ fontSize: "1.1rem" }}>
                ↗
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
