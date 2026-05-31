"use client";

import { useEffect, useState } from "react";

const links = [
  { label: "Work", href: "#work" },
  { label: "Stack", href: "#stack" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="nav-link">
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href="mailto:leonelbastianelli@gmail.com"
          className="hidden md:flex cta-btn"
          style={{ fontFamily: "var(--font-dm-mono)" }}
        >
          Hire me
        </a>

        {/* Mobile nav */}
        <div className="flex md:hidden items-center gap-5">
          {links.map((link) => (
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
