"use client";

const links = [
  {
    label: "Email",
    value: "leonelbastianelli@gmail.com",
    href: "mailto:leonelbastianelli@gmail.com",
    mono: true,
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/leonelbstein",
    href: "https://linkedin.com/in/leonelbstein",
    mono: false,
  },
  {
    label: "Freelancer",
    value: "@leonelbstein",
    href: "https://www.freelancer.com/u/leonelbstein",
    mono: false,
  },
];

export default function Contact() {
  return (
    <section
      id="contact"
      className="py-32 px-6 md:px-10"
      style={{ borderTop: "1px solid var(--border)" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Headline */}
        <div className="reveal mb-20 text-center">
          <p
            className="section-label mb-4"
            style={{ fontFamily: "var(--font-dm-mono)" }}
          >
            Get in touch
          </p>
          <h2
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              fontWeight: 400,
              lineHeight: 1.1,
              letterSpacing: "-0.01em",
            }}
          >
            Let&apos;s work{" "}
            <span style={{ fontStyle: "italic", color: "var(--gold)" }}>
              together.
            </span>
          </h2>
        </div>

        {/* Links */}
        <div className="flex flex-col md:flex-row justify-center gap-px" style={{ border: "1px solid var(--border)" }}>
          {links.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("mailto") ? undefined : "_blank"}
              rel={
                link.href.startsWith("mailto") ? undefined : "noopener noreferrer"
              }
              className="reveal project-card flex-1 p-8 md:p-10 flex flex-col gap-2 group"
              style={{ transitionDelay: `${i * 0.08}s`, textDecoration: "none" }}
            >
              <span
                style={{
                  fontFamily: "var(--font-dm-mono)",
                  fontSize: "0.62rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--gold)",
                }}
              >
                {link.label}
              </span>
              <span
                style={{
                  fontFamily: link.mono
                    ? "var(--font-dm-mono)"
                    : "var(--font-dm-sans)",
                  fontSize: link.mono ? "0.8rem" : "0.95rem",
                  color: "var(--text)",
                  transition: "color 0.2s",
                  wordBreak: "break-all",
                }}
                className="group-hover:text-[var(--gold)]"
              >
                {link.value}
              </span>
              <span
                style={{
                  marginTop: "auto",
                  paddingTop: "1rem",
                  color: "var(--gold)",
                  fontSize: "1.1rem",
                  opacity: 0,
                  transform: "translateX(-4px)",
                  transition: "opacity 0.2s, transform 0.2s",
                }}
                className="group-hover:opacity-70 group-hover:translate-x-0"
              >
                ↗
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
