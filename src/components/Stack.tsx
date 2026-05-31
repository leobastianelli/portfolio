"use client";

const stacks = [
  {
    category: "Frontend",
    items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "HTML / CSS / SCSS"],
  },
  {
    category: "Backend",
    items: ["Node.js", "PHP", "Firebase", "REST APIs", "n8n Automation"],
  },
  {
    category: "E-Commerce",
    items: [
      "Shopify Plus",
      "Storefront API",
      "Admin API",
      "Loop Subscriptions",
      "WooCommerce",
    ],
  },
  {
    category: "CMS",
    items: ["WordPress", "Custom Plugins", "Elementor", "WPML", "ACF"],
  },
  {
    category: "Infrastructure",
    items: ["Vercel", "Git / GitHub", "Google Cloud Run", "Linux / SSH"],
  },
  {
    category: "AI & Tooling",
    items: [
      "Claude API",
      "Google Places API",
      "SerpAPI",
      "Gemini AI",
    ],
  },
];

export default function Stack() {
  return (
    <section id="stack" className="py-32 px-6 md:px-10" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="reveal mb-16">
          <span className="gold-line" />
          <p className="section-label mb-3" style={{ fontFamily: "var(--font-dm-mono)" }}>
            Technical expertise
          </p>
          <h2
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 400,
              color: "var(--text)",
              lineHeight: 1.15,
            }}
          >
            Stack &{" "}
            <span style={{ fontStyle: "italic", color: "var(--gold)" }}>
              Tools
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {stacks.map((stack, i) => (
            <div
              key={stack.category}
              className="stack-card reveal p-7"
              style={{
                background: "rgba(255,255,255,0.012)",
                transitionDelay: `${i * 0.06}s`,
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-dm-mono)",
                  fontSize: "0.62rem",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "var(--gold)",
                  marginBottom: "1.2rem",
                }}
              >
                {stack.category}
              </p>

              <ul className="flex flex-col gap-2">
                {stack.items.map((item) => (
                  <li
                    key={item}
                    style={{
                      fontFamily: "var(--font-dm-sans)",
                      fontSize: "0.9rem",
                      color: "var(--text)",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.6rem",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        width: "4px",
                        height: "4px",
                        borderRadius: "50%",
                        background: "var(--gold)",
                        flexShrink: 0,
                        opacity: 0.6,
                      }}
                    />
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
