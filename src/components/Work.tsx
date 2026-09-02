"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useLang } from "@/context/LanguageContext";
import { useContentMode } from "@/context/ContentModeContext";
import { StackIcons } from "@/components/StackIcons";
import ReadingModeToggle from "@/components/ReadingModeToggle";
import type { ContentMode } from "@/context/ContentModeContext";
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
      <span className="editorial-type cover-typographic__title" style={{ fontSize: "var(--text-heading)" }}>
        {title}
      </span>
    </div>
  );
}

/*
 * Los cuatro principales van en un acordeón con la MISMA mecánica que la
 * columna derecha de "Acerca de mí" (`grid-template-rows: 0fr↔1fr`), con dos
 * diferencias: el primero arranca abierto, y el panel abierto sigue al scroll
 * — el que queda más cerca de la línea de anclaje (~30% del viewport) se abre
 * y el anterior se cierra. Un click fija esa entrada; el siguiente scroll
 * vuelve a mandar. Siempre hay exactamente una abierta.
 */
function FeaturedAccordion({
  projects,
  statusLabels,
  mode,
}: {
  projects: Project[];
  statusLabels: Record<ProjectStatus, string>;
  mode: ContentMode;
}) {
  const [activeSlug, setActiveSlug] = useState<string | null>(projects[0]?.slug ?? null);
  const headers = useRef<Map<string, HTMLButtonElement>>(new Map());
  const clickedAt = useRef(0);

  const slugs = projects.map((p) => p.slug);

  useEffect(() => {
    let raf = 0;
    const sync = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (Date.now() - clickedAt.current < 700) return;
        /* La activa es la ÚLTIMA entrada cuyo header cruzó la línea de
           anclaje hacia arriba — monotónico con el scroll, no salta entradas
           al contrario de "la más cercana". Antes de que la primera cruce,
           gana la primera (arranca abierta). */
        const anchor = window.innerHeight * 0.38;
        let pick: string | null = null;
        for (const slug of slugs) {
          const el = headers.current.get(slug);
          if (el && el.getBoundingClientRect().top <= anchor) pick = slug;
        }
        pick = pick ?? slugs[0] ?? null;
        if (pick) setActiveSlug((cur) => (cur === pick ? cur : pick));
      });
    };
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    sync();
    return () => {
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slugs.join(",")]);

  return (
    <ul className="work-accordion reveal">
      {projects.map((project) => {
        const open = project.slug === activeSlug;
        const link = project.links[0];
        return (
          <li key={project.slug} className="work-accordion__item">
            <button
              type="button"
              className="work-entry"
              data-open={open}
              aria-expanded={open}
              ref={(el) => {
                if (el) headers.current.set(project.slug, el);
                else headers.current.delete(project.slug);
              }}
              onClick={(e) => {
                clickedAt.current = Date.now();
                setActiveSlug(project.slug);
                /* Acerca el header a la línea de anclaje para que el próximo
                   scroll no la desactive de golpe. */
                const top = e.currentTarget.getBoundingClientRect().top - window.innerHeight * 0.38;
                window.scrollBy({ top, behavior: "smooth" });
              }}
            >
              <span className="work-entry__meta">
                <span className="font-mono" style={{ fontSize: "var(--text-2xs)", letterSpacing: "0.1em", color: "var(--color-ink-faded)" }}>
                  {project.year}
                </span>
                <StatusLabel status={project.status} label={statusLabels[project.status]} />
              </span>
              <span className="work-entry__title editorial-type">{project.title}</span>
              <span className="work-entry__role editorial-type">{project.role}</span>
            </button>

            <div className="work-entry__panel" data-open={open}>
              <div className="work-entry__panel-inner">
                <div className="work-entry__body">
                  <ProjectCover title={project.title} cover={project.cover} coverAspect={16 / 9} />
                  <div className="flex flex-col max-w-2xl">
                    {/* Sólo el modo activo — nada de overlay que reserve el alto
                       del texto más largo: el panel ya anima su propia altura y
                       acá el gap "en blanco" se notaba demasiado. */}
                    <p className="editorial-type mb-5" style={{ fontSize: "var(--text-base)", lineHeight: 1.7, color: "var(--color-ink)" }}>
                      {mode === "overview" ? project.summary : project.technical}
                    </p>
                    <StackIcons stack={project.stack} />
                    {link && (
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono mt-5 inline-flex items-center gap-2 w-fit"
                        style={{ fontSize: "var(--text-xs)", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-accent-ink)" }}
                      >
                        {link.label} ↗
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default function Work({ projects }: { projects: Project[] }) {
  const { t } = useLang();
  const { mode } = useContentMode();
  const clientProjects = projects.filter((project) => !project.personal);
  const featured = clientProjects.filter((project) => project.featured);
  const rest = clientProjects.filter((project) => !project.featured);
  const statusLabels = t.work.status;

  return (
    <section id="work" className="work-section py-9 md:py-10 px-5 md:px-6">
      <ReadingModeToggle />
      <div className="max-w-6xl mx-auto">
        {/* Selected work */}
        <div className="reveal mb-6">
          <p className="section-label font-mono mb-3">{t.work.sectionLabel}</p>
          <h2 className="editorial-type" style={{ fontSize: "var(--text-title)", fontWeight: 500, lineHeight: 1.15, color: "var(--color-ink)" }}>
            {t.work.sectionTitle}
          </h2>
        </div>

        {featured.length > 0 && (
          <FeaturedAccordion projects={featured} statusLabels={statusLabels} mode={mode} />
        )}

        {/* Everything else — 4 columns, text-only (PDR's "Popular Posts"
            list has no thumbnails either), dense and compact on purpose. */}
        <div className="reveal mb-7 mt-9 md:mt-10">
          <p className="section-label font-mono mb-3">{t.work.moreLabel}</p>
          <h2 className="editorial-type" style={{ fontSize: "var(--text-heading)", fontWeight: 500, lineHeight: 1.2, color: "var(--color-ink)" }}>
            {t.work.moreTitle}
          </h2>
        </div>

        <div className="editorial-rule grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-6 pt-6">
          {rest.map((project) => {
            const link = project.links[0];
            return (
              <div key={project.slug} className="reveal flex flex-col">
                <div className="flex items-center gap-3 flex-wrap mb-2">
                  <span className="font-mono" style={{ fontSize: "var(--text-2xs)", letterSpacing: "0.1em", color: "var(--color-ink-faded)" }}>
                    {project.year}
                  </span>
                  <StatusLabel status={project.status} label={statusLabels[project.status]} />
                </div>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="editorial-type" style={{ fontSize: "var(--text-base)", fontWeight: 500, color: "var(--color-ink)" }}>
                    {project.title}
                  </h3>
                  {link && (
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0"
                      style={{ color: "var(--color-accent-ink)", fontSize: "var(--text-sm)" }}
                      aria-label={`Visit ${project.title}`}
                    >
                      ↗
                    </a>
                  )}
                </div>
                <div className="content-mode-text mb-2">
                  <p data-hidden={mode !== "overview"} className="editorial-type" style={{ fontSize: "var(--text-xs)", lineHeight: 1.55, color: "var(--color-ink-faded)" }}>
                    {project.summary}
                  </p>
                  <p data-hidden={mode !== "technical"} className="editorial-type" style={{ fontSize: "var(--text-xs)", lineHeight: 1.55, color: "var(--color-ink-faded)" }}>
                    {project.technical}
                  </p>
                </div>
                <StackIcons stack={project.stack} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
