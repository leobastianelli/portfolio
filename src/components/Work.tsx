"use client";

import { useLang } from "@/context/LanguageContext";

const projects = [
  {
    name: "Onefam Hostels",
    period: "2023–2025",
    tags: ["WordPress", "PHP", "AJAX", "WPML", "Elementor"],
    url: null,
  },
  {
    name: "NewReserve / Mully Group",
    period: "2024–2025",
    tags: ["Next.js", "TypeScript", "Firebase", "Shopify", "Stripe"],
    url: null,
  },
  {
    name: "Púrpura Ceniza",
    period: "2024",
    tags: ["Next.js", "Vercel"],
    url: "https://purpuraceniza.com",
  },
  {
    name: "Landing Agency",
    period: "2025",
    tags: ["Claude API", "Node.js", "Google Places", "n8n"],
    url: null,
  },
];

export default function Work() {
  const { t } = useLang();

  return (
    <section id="work" className="py-32 px-6 md:px-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="reveal mb-16">
          <span className="gold-line" />
          <p className="section-label mb-3" style={{ fontFamily: "var(--font-dm-mono)" }}>
            {t.work.sectionLabel}
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
            {t.work.sectionTitle}
          </h2>
        </div>

        {/* Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-px"
          style={{ border: "1px solid var(--border)" }}
        >
          {projects.map((project, i) => {
            const tx = t.work.projects[i];
            return (
              <div
                key={project.name}
                className="project-card reveal p-8 md:p-10"
                style={{ transitionDelay: `${i * 0.08}s` }}
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <p
                      style={{
                        fontFamily: "var(--font-dm-mono)",
                        fontSize: "0.65rem",
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        color: "var(--gold)",
                        marginBottom: "0.4rem",
                      }}
                    >
                      {project.period}
                    </p>
                    <h3
                      style={{
                        fontFamily: "var(--font-playfair)",
                        fontSize: "1.35rem",
                        fontWeight: 400,
                        color: "var(--text)",
                      }}
                    >
                      {project.name}
                    </h3>
                    <p
                      style={{
                        fontFamily: "var(--font-dm-mono)",
                        fontSize: "0.7rem",
                        color: "var(--text-muted)",
                        letterSpacing: "0.06em",
                        marginTop: "0.2rem",
                      }}
                    >
                      {tx.role}
                    </p>
                  </div>

                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "var(--gold)",
                        fontSize: "1.1rem",
                        flexShrink: 0,
                        opacity: 0.7,
                        transition: "opacity 0.2s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.opacity = "1")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.opacity = "0.7")
                      }
                      aria-label={`Visit ${project.name}`}
                    >
                      ↗
                    </a>
                  )}
                </div>

                <p
                  style={{
                    fontFamily: "var(--font-dm-sans)",
                    fontSize: "0.88rem",
                    lineHeight: 1.72,
                    color: "var(--text-muted)",
                    marginBottom: "1.5rem",
                  }}
                >
                  {tx.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="tag"
                      style={{ fontFamily: "var(--font-dm-mono)" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
