"use client";

import { useEffect, useState } from "react";
import { useLang, type Lang } from "@/context/LanguageContext";

export default function Nav() {
  const { lang, t, setLang } = useLang();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: t.nav.services, href: "#services" },
    { label: t.nav.work, href: "#work" },
    { label: t.nav.stack, href: "#stack" },
    { label: t.nav.about, href: "#about" },
    { label: t.nav.contact, href: "#contact" },
  ];

  const LangToggle = () => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0",
        fontFamily: "var(--font-dm-mono)",
        fontSize: "0.7rem",
        letterSpacing: "0.1em",
        border: "1px solid var(--border)",
      }}
    >
      {(["es", "en"] as Lang[]).map((l, i) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          style={{
            padding: "0.3rem 0.6rem",
            color: lang === l ? "var(--gold)" : "var(--text-muted)",
            background: lang === l ? "rgba(201,169,110,0.08)" : "transparent",
            borderRight: i === 0 ? "1px solid var(--border)" : "none",
            transition: "color 0.2s, background 0.2s",
            cursor: "pointer",
            textTransform: "uppercase",
          }}
          aria-label={`Switch to ${l === "es" ? "Spanish" : "English"}`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "nav-blur" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-10 flex items-center justify-between h-16">
        <a
          href="#"
          style={{
            fontFamily: "var(--font-dm-mono)",
            color: "var(--gold)",
            fontSize: "0.9rem",
            letterSpacing: "0.08em",
            fontWeight: 400,
          }}
        >
          lb.dev
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="nav-link">
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop right side */}
        <div className="hidden md:flex items-center gap-4">
          <LangToggle />
          <a
            href="mailto:leonelbastianelli@gmail.com"
            className="cta-btn"
            style={{ fontFamily: "var(--font-dm-mono)" }}
          >
            {t.nav.hire}
          </a>
        </div>

        {/* Mobile nav */}
        <div className="flex md:hidden items-center gap-4">
          <LangToggle />
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              style={{
                fontFamily: "var(--font-dm-mono)",
                fontSize: "0.65rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}
