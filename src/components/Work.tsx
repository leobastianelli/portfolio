"use client";

import Image from "next/image";
import { useLang } from "@/context/LanguageContext";
import { useContentMode } from "@/context/ContentModeContext";
import type { Project, ProjectStatus } from "@/lib/content/types";

const STATUS_LED: Record<ProjectStatus, string> = {
  live: "led-on",
  building: "led-work",
  archived: "led",
};

function StatusIndicator({ status, label }: { status: ProjectStatus; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`led ${STATUS_LED[status]}`} aria-hidden="true" />
      <span className="label-engraved">{label}</span>
    </span>
  );
}

function ProjectCover({ title, cover }: { title: string; cover?: string }) {
  return (
    <div
      className="panel-recessed relative flex items-center justify-center mb-5 overflow-hidden"
      style={{ aspectRatio: "16 / 9" }}
    >
      {cover ? (
        <Image
          src={cover}
          alt={title}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          style={{ objectFit: "cover" }}
        />
      ) : (
        <span className="label-engraved" style={{ fontSize: "0.85rem", letterSpacing: "0.08em" }}>
          {title}
        </span>
      )}
    </div>
  );
}

export default function Work({ projects }: { projects: Project[] }) {
  const { t } = useLang();
  const { mode } = useContentMode();
  const featured = projects.filter((project) => project.featured);
  const rest = projects.filter((project) => !project.featured);
  const statusLabels = t.work.status;

  return (
    <section id="work" className="py-32 px-6 md:px-10" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="max-w-6xl mx-auto">
        {/* Selected work */}
        <div className="reveal mb-16">
          <span className="accent-line" />
          <p className="section-label font-mono mb-3">{t.work.sectionLabel}</p>
          <h2 className="font-display text-ink" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 400, lineHeight: 1.15 }}>
            {t.work.sectionTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-32">
          {featured.map((project, i) => {
            const link = project.links[0];
            return (
              <div key={project.slug} className="project-card reveal p-8 md:p-10" style={{ transitionDelay: `${i * 0.08}s` }}>
                <ProjectCover title={project.title} cover={project.cover} />

                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <p className="font-mono text-accent" style={{ fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "0.4rem" }}>
                      {project.year}
                    </p>
                    <h3 className="font-display text-ink" style={{ fontSize: "1.35rem", fontWeight: 400 }}>
                      {project.title}
                    </h3>
                    <p className="font-mono text-ink-soft" style={{ fontSize: "0.7rem", letterSpacing: "0.06em", marginTop: "0.2rem" }}>
                      {project.role}
                    </p>
                  </div>

                  {link && (
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
                      style={{ fontSize: "1.1rem" }}
                      aria-label={`Visit ${project.title}`}
                    >
                      ↗
                    </a>
                  )}
                </div>

                <div className="mb-3">
                  <StatusIndicator status={project.status} label={statusLabels[project.status]} />
                </div>

                <div className="content-mode-text mb-6">
                  <p data-hidden={mode !== "overview"} className="font-body text-ink-soft" style={{ fontSize: "0.88rem", lineHeight: 1.72 }}>
                    {project.summary}
                  </p>
                  <p data-hidden={mode !== "technical"} className="font-body text-ink-soft" style={{ fontSize: "0.88rem", lineHeight: 1.72 }}>
                    {project.technical}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {project.stack.map((tag) => (
                    <span key={tag} className="tag font-mono">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Everything else */}
        <div className="reveal mb-12">
          <span className="accent-line" />
          <p className="section-label font-mono mb-3">{t.work.moreLabel}</p>
          <h2 className="font-display text-ink" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 400, lineHeight: 1.15 }}>
            {t.work.moreTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {rest.map((project, i) => {
            const link = project.links[0];
            return (
              <div key={project.slug} className="project-card reveal p-6" style={{ transitionDelay: `${i * 0.06}s` }}>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="font-display text-ink" style={{ fontSize: "1.05rem", fontWeight: 400 }}>
                      {project.title}
                    </h3>
                    <p className="font-mono text-ink-soft" style={{ fontSize: "0.65rem", letterSpacing: "0.06em", marginTop: "0.15rem" }}>
                      {project.role} · {project.year}
                    </p>
                  </div>

                  {link && (
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
                      aria-label={`Visit ${project.title}`}
                    >
                      ↗
                    </a>
                  )}
                </div>

                <div className="mb-3">
                  <StatusIndicator status={project.status} label={statusLabels[project.status]} />
                </div>

                <div className="content-mode-text mb-4">
                  <p data-hidden={mode !== "overview"} className="font-body text-ink-soft" style={{ fontSize: "0.82rem", lineHeight: 1.65 }}>
                    {project.summary}
                  </p>
                  <p data-hidden={mode !== "technical"} className="font-body text-ink-soft" style={{ fontSize: "0.82rem", lineHeight: 1.65 }}>
                    {project.technical}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {project.stack.map((tag) => (
                    <span key={tag} className="tag font-mono">
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
