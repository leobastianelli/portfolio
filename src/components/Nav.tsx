"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLang } from "@/context/LanguageContext";
import { SITE } from "@/lib/site";
import LocaleSwitcher from "@/components/LocaleSwitcher";

export default function Nav() {
  const { locale, t } = useLang();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: t.nav.work, href: "#work" },
    { label: t.nav.stack, href: "#stack" },
    { label: t.nav.about, href: "#about" },
    { label: t.nav.contact, href: "#contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "nav-blur" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-10 flex items-center justify-between h-16">
        <Link
          href={`/${locale}`}
          style={{
            fontFamily: "var(--font-dm-mono)",
            color: "var(--gold)",
            fontSize: "0.9rem",
            letterSpacing: "0.08em",
            fontWeight: 400,
          }}
        >
          {SITE.name}
        </Link>

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
          <LocaleSwitcher />
          <a
            href={`mailto:${SITE.email}`}
            className="cta-btn"
            style={{ fontFamily: "var(--font-dm-mono)" }}
          >
            {t.nav.hire}
          </a>
        </div>

        {/* Mobile nav */}
        <div className="flex md:hidden items-center gap-4">
          <LocaleSwitcher />
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
