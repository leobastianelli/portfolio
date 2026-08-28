"use client";

import Image from "next/image";
import { useLang } from "@/context/LanguageContext";
import { useContentMode } from "@/context/ContentModeContext";
import type { Project, ProjectStatus } from "@/lib/content/types";

/*
 * direccion-visual-v3.md: status reads as a colored category label (PDR's
 * "Art & Illustration" pattern), not a panel LED. The real text label is
 * still what carries the status — color alone is never the only cue.
 */
export function StatusLabel({ status, label }: { status: ProjectStatus; label: string }) {
  return <span className={`status-label status-label--${status}`}>{label}</span>;
}

export function ProjectCover({
  title,
  cover,
  coverAspect = 16 / 9,
}: {
  title: string;
  cover?: string;
  coverAspect?: number;
}) {
  if (cover) {
    return (
      <div className="cover-frame" style={{ aspectRatio: coverAspect }}>
        <Image src={cover} alt={title} fill sizes="(min-width: 768px) 50vw, 100vw" style={{ objectFit: "cover" }} />
      </div>
    );
  }

  return (
    <div className="cover-typographic" style={{ aspectRatio: coverAspect }}>
      <span className="editorial-type cover-typographic__title" style={{ fontSize: "clamp(1.3rem, 2.6vw, 1.9rem)" }}>
        {title}
      </span>
    </div>
  );
}

function ProjectMeta({ project, statusLabels }: { project: Project; statusLabels: Record<ProjectStatus, string> }) {
  return (
    <div className="flex items-center gap-3 flex-wrap mb-2">
      <span className="font-mono" style={{ fontSize: "0.7rem", letterSpacing: "0.1em", color: "var(--color-ink-faded)" }}>
        {project.year}
      </span>
      <StatusLabel status={project.status} label={statusLabels[project.status]} />
    </div>
  );
}

function ProjectTags({ stack }: { stack: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {stack.map((tag) => (
        <span key={tag} className="tag font-mono">
          {tag}
        </span>
      ))}
    </div>
  );
}

export default function Work({ projects }: { projects: Project[] }) {
  const { t } = useLang();
  const { mode } = useContentMode();
  const clientProjects = projects.filter((project) => !project.personal);
  const featured = clientProjects.filter((project) => project.featured);
  const [lead, ...featuredRest] = featured;
  const rest = clientProjects.filter((project) => !project.featured);
  const statusLabels = t.work.status;

  return (
    <section id="work" className="work-section py-20 md:py-32 px-6 md:px-10">
      <div className="max-w-6xl mx-auto">
        {/* Selected work */}
        <div className="reveal mb-16">
          <p className="section-label font-mono mb-3">{t.work.sectionLabel}</p>
          <h2 className="editorial-type" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 500, lineHeight: 1.15, color: "var(--color-ink)" }}>
            {t.work.sectionTitle}
          </h2>
        </div>

        {/* Lead: the most recent featured project, full width — PDR's hero
            treatment (big image + text, pull-quote-style accent border on
            the text column), not another card in a grid. */}
        {lead && (
          <div className="reveal grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 mb-16 md:mb-20">
            <ProjectCover title={lead.title} cover={lead.cover} coverAspect={lead.coverAspect} />
            <div className="editorial-lead-text flex flex-col justify-center">
              <ProjectMeta project={lead} statusLabels={statusLabels} />
              <h3 className="editorial-type" style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 500, color: "var(--color-ink)", marginBottom: "0.3rem" }}>
                {lead.title}
              </h3>
              <p className="editorial-type" style={{ fontStyle: "italic", fontSize: "0.95rem", color: "var(--color-ink-faded)", marginBottom: "1rem" }}>
                {lead.role}
              </p>
              <div className="content-mode-text mb-5">
                <p data-hidden={mode !== "overview"} className="editorial-type" style={{ fontSize: "1.05rem", lineHeight: 1.7, color: "var(--color-ink)" }}>
                  {lead.summary}
                </p>
                <p data-hidden={mode !== "technical"} className="editorial-type" style={{ fontSize: "1.05rem", lineHeight: 1.7, color: "var(--color-ink)" }}>
                  {lead.technical}
                </p>
              </div>
              <ProjectTags stack={lead.stack} />
              {lead.links[0] && (
                <a
                  href={lead.links[0].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono mt-4 inline-flex items-center gap-2 w-fit"
                  style={{ fontSize: "0.75rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-accent-ink)" }}
                >
                  {lead.links[0].label} ↗
                </a>
              )}
            </div>
          </div>
        )}

        {/* Remaining featured — 3 columns, own row template (PDR's "Editor's
            Picks / Conjectures / Popular Posts" row uses exactly 3 even
            columns; ours does too, deliberately, not a coincidence). */}
        {featuredRest.length > 0 && (
          <div className="editorial-rule reveal grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-10 pt-10 mb-16 md:mb-20">
            {featuredRest.map((project) => {
              const link = project.links[0];
              return (
                <div key={project.slug} className="flex flex-col">
                  <ProjectCover title={project.title} cover={project.cover} coverAspect={project.coverAspect} />
                  <div className="mt-4">
                    <ProjectMeta project={project} statusLabels={statusLabels} />
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <h3 className="editorial-type" style={{ fontSize: "1.15rem", fontWeight: 500, color: "var(--color-ink)" }}>
                        {project.title}
                      </h3>
                      {link && (
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-shrink-0"
                          style={{ color: "var(--color-accent-ink)" }}
                          aria-label={`Visit ${project.title}`}
                        >
                          ↗
                        </a>
                      )}
                    </div>
                    <p className="editorial-type mb-3" style={{ fontStyle: "italic", fontSize: "0.85rem", color: "var(--color-ink-faded)" }}>
                      {project.role}
                    </p>
                    <div className="content-mode-text mb-3">
                      <p data-hidden={mode !== "overview"} className="editorial-type" style={{ fontSize: "0.92rem", lineHeight: 1.65, color: "var(--color-ink)" }}>
                        {project.summary}
                      </p>
                      <p data-hidden={mode !== "technical"} className="editorial-type" style={{ fontSize: "0.92rem", lineHeight: 1.65, color: "var(--color-ink)" }}>
                        {project.technical}
                      </p>
                    </div>
                    <ProjectTags stack={project.stack} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Everything else — 4 columns, text-only (PDR's "Popular Posts"
            list has no thumbnails either), dense and compact on purpose. */}
        <div className="reveal mb-10">
          <p className="section-label font-mono mb-3">{t.work.moreLabel}</p>
          <h2 className="editorial-type" style={{ fontSize: "clamp(1.3rem, 2.4vw, 1.7rem)", fontWeight: 500, lineHeight: 1.2, color: "var(--color-ink)" }}>
            {t.work.moreTitle}
          </h2>
        </div>

        <div className="editorial-rule grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8 pt-8">
          {rest.map((project) => {
            const link = project.links[0];
            return (
              <div key={project.slug} className="reveal flex flex-col">
                <ProjectMeta project={project} statusLabels={statusLabels} />
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="editorial-type" style={{ fontSize: "0.98rem", fontWeight: 500, color: "var(--color-ink)" }}>
                    {project.title}
                  </h3>
                  {link && (
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0"
                      style={{ color: "var(--color-accent-ink)", fontSize: "0.85rem" }}
                      aria-label={`Visit ${project.title}`}
                    >
                      ↗
                    </a>
                  )}
                </div>
                <div className="content-mode-text mb-2">
                  <p data-hidden={mode !== "overview"} className="editorial-type" style={{ fontSize: "0.82rem", lineHeight: 1.55, color: "var(--color-ink-faded)" }}>
                    {project.summary}
                  </p>
                  <p data-hidden={mode !== "technical"} className="editorial-type" style={{ fontSize: "0.82rem", lineHeight: 1.55, color: "var(--color-ink-faded)" }}>
                    {project.technical}
                  </p>
                </div>
                <ProjectTags stack={project.stack} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
