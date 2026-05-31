"use client";

export default function Footer() {
  return (
    <footer
      className="px-6 md:px-10 py-8"
      style={{ borderTop: "1px solid var(--border)" }}
    >
      <div
        className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3"
      >
        <span
          style={{
            fontFamily: "var(--font-dm-mono)",
            color: "var(--gold)",
            fontSize: "0.8rem",
            letterSpacing: "0.06em",
          }}
        >
          lb.dev
        </span>

        <span
          style={{
            fontFamily: "var(--font-dm-mono)",
            color: "var(--text-muted)",
            fontSize: "0.68rem",
            letterSpacing: "0.1em",
          }}
        >
          © 2025 Leo Bastianelli. Córdoba, Argentina.
        </span>

        <a
          href="mailto:leonelbastianelli@gmail.com"
          style={{
            fontFamily: "var(--font-dm-mono)",
            color: "var(--text-muted)",
            fontSize: "0.68rem",
            letterSpacing: "0.08em",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLAnchorElement).style.color = "var(--gold)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLAnchorElement).style.color =
              "var(--text-muted)")
          }
        >
          leonelbastianelli@gmail.com
        </a>
      </div>
    </footer>
  );
}
