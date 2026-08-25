"use client";

import { useLang } from "@/context/LanguageContext";
import { SITE } from "@/lib/site";

const linkData: Record<string, { value: string; href: string; mono: boolean }> = {
  email: {
    value: SITE.email,
    href: `mailto:${SITE.email}`,
    mono: true,
  },
  linkedin: {
    value: SITE.social.linkedin.replace(/^https?:\/\//, ""),
    href: SITE.social.linkedin,
    mono: false,
  },
  github: {
    value: SITE.social.github.replace(/^https?:\/\//, ""),
    href: SITE.social.github,
    mono: false,
  },
};

export default function Contact() {
  const { t } = useLang();
  const c = t.contact;
  const contactLinks = c.links.map((link) => ({ labelKey: link.label, ...linkData[link.key] }));

  return (
    <section id="contact" className="py-32 px-6 md:px-10" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="max-w-6xl mx-auto">
        {/* Headline */}
        <div className="reveal mb-6 text-center">
          <p className="section-label font-mono mb-4">{c.sectionLabel}</p>
          <h2 className="font-display text-ink" style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", fontWeight: 400, lineHeight: 1.1, letterSpacing: "-0.01em" }}>
            {c.headlineMain} <span className="italic text-accent">{c.headlineItalic}</span>
          </h2>
        </div>

        {/* Subtitle */}
        <div className="reveal mb-16 text-center">
          <p className="font-body text-ink-soft mx-auto" style={{ fontSize: "0.92rem", lineHeight: 1.7, maxWidth: "460px" }}>
            {c.subtitle}
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-col md:flex-row justify-center gap-4">
          {contactLinks.map((link, i) => (
            <a
              key={link.labelKey}
              href={link.href}
              target={link.href.startsWith("mailto") ? undefined : "_blank"}
              rel={link.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
              className="reveal project-card flex-1 p-8 md:p-10 flex flex-col gap-2 group no-underline"
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              <span className="font-mono text-accent" style={{ fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>
                {link.labelKey}
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
