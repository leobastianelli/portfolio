"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import ContentModeText from "@/components/ContentModeText";
import SectionContentModeToggle from "@/components/SectionContentModeToggle";
import { StackIcons } from "@/components/StackIcons";
import type { ContentMode } from "@/context/ContentModeContext";
import { useContentMode } from "@/context/ContentModeContext";
import { useLang } from "@/context/LanguageContext";
import { analytics } from "@/lib/analytics";
import type { Project, ProjectStatus } from "@/lib/content/types";

export function StatusLabel({ status, label }: { status: ProjectStatus; label: string }) {
  return <span className={`status-label status-label--${status}`}>{label}</span>;
}

export function ProjectCover({
  title,
  cover,
  coverAspect = 16 / 9,
  blurred = false,
  coverPosition = "center",
}: {
  title: string;
  cover?: string;
  coverAspect?: number;
  blurred?: boolean;
  coverPosition?: string;
}) {
  if (cover) {
    return (
      <div className={`cover-frame${blurred ? " cover-frame--blurred" : ""}`} style={{ aspectRatio: coverAspect }}>
        <Image
          src={cover}
          alt={title}
          fill
          draggable={false}
          sizes="(min-width: 768px) 50vw, 100vw"
          style={{ objectFit: "cover", objectPosition: coverPosition, pointerEvents: "none", userSelect: "none" }}
        />
      </div>
    );
  }

  return (
    <div className="cover-typographic" style={{ aspectRatio: coverAspect }}>
      <span
        className="editorial-type cover-typographic__title"
        style={{ fontSize: "var(--text-heading)" }}
      >
        {title}
      </span>
    </div>
  );
}

function ProjectCardDetails({
  project,
  statusLabels,
  mode,
}: {
  project: Project;
  statusLabels: Record<ProjectStatus, string>;
  mode: ContentMode;
}) {
  const link = project.links[0];
  return (
    <div className="featured-card__details">
      <div className="featured-card__meta">
        <span className="font-mono" style={{ fontSize: "var(--text-2xs)", letterSpacing: "0.1em", color: "var(--color-ink-faded)" }}>
          {project.year}
        </span>
        <StatusLabel status={project.status} label={statusLabels[project.status]} />
      </div>
      <h3 className="editorial-type featured-card__title">{project.title}</h3>
      <p className="editorial-type featured-card__role">{project.role}</p>
      <ContentModeText
        overview={project.summary}
        technical={project.technical}
        mode={mode}
        className="editorial-type featured-card__summary"
      />
      <StackIcons stack={project.stack} />
      {link && (
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono featured-card__link"
          onClick={() => analytics.projectLinkClick(project.slug, link.url)}
        >
          {link.label} &rarr;
        </a>
      )}
    </div>
  );
}

type ProjectScreenshot = { id: string; title: string; cover: string; coverAspect?: number; blurred?: boolean };

function ScreenshotDeck({ project, screenshots, onOpen }: { project: Project; screenshots: ProjectScreenshot[]; onOpen: (index: number) => void }) {
  const deckRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false, pointerId: 0 });
  const suppressClickUntil = useRef(0);

  useEffect(() => {
    const deck = deckRef.current;
    if (!deck) return;
    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.shiftKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      const maxScroll = deck.scrollWidth - deck.clientWidth;
      if (maxScroll <= 1 || (event.deltaY < 0 && deck.scrollLeft <= 1) ||
        (event.deltaY > 0 && deck.scrollLeft >= maxScroll - 1)) return;
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? deck.clientWidth : 1;
      event.preventDefault();
      deck.scrollLeft = Math.max(0, Math.min(maxScroll, deck.scrollLeft + event.deltaY * unit));
    };
    deck.addEventListener("wheel", onWheel, { passive: false });
    return () => deck.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <div
      ref={deckRef}
      className="screenshot-deck"
      role="group"
      aria-label={`Capturas de ${project.title}`}
      onPointerDown={(event) => {
        if (event.pointerType === "touch" || event.button !== 0) return;
        const deck = event.currentTarget;
        drag.current = { active: true, startX: event.clientX, scrollLeft: deck.scrollLeft, moved: false, pointerId: event.pointerId };
      }}
      onPointerMove={(event) => {
        if (!drag.current.active) return;
        const distance = event.clientX - drag.current.startX;
        if (Math.abs(distance) > 4) {
          if (!drag.current.moved) event.currentTarget.setPointerCapture(event.pointerId);
          drag.current.moved = true;
        }
        event.currentTarget.scrollLeft = drag.current.scrollLeft - distance;
      }}
      onPointerUp={(event) => {
        const moved = drag.current.moved;
        drag.current.active = false;
        if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
        if (moved) suppressClickUntil.current = Date.now() + 180;
      }}
      onPointerCancel={() => {
        drag.current.active = false;
        drag.current.moved = false;
      }}
    >
      {screenshots.map((screenshot, index) => (
        <button
          key={screenshot.id}
          type="button"
          className="screenshot-deck__card"
          style={{ "--shot-index": index, "--shot-layer": screenshots.length - index } as CSSProperties}
          aria-label={`Ver ${screenshot.title}`}
          onClick={() => {
            if (Date.now() < suppressClickUntil.current) return;
            onOpen(index);
          }}
        >
          <ProjectCover title={screenshot.title} cover={screenshot.cover} coverAspect={screenshot.coverAspect ?? 16 / 10} blurred={screenshot.blurred} />
        </button>
      ))}
    </div>
  );
}

function ProjectLightbox({
  project,
  screenshots,
  index,
  statusLabels,
  mode,
  onClose,
  onSelect,
}: {
  project: Project;
  screenshots: ProjectScreenshot[];
  index: number;
  statusLabels: Record<ProjectStatus, string>;
  mode: ContentMode;
  onClose: () => void;
  onSelect: (index: number) => void;
}) {
  const previous = (index - 1 + screenshots.length) % screenshots.length;
  const next = (index + 1) % screenshots.length;
  const screenshot = screenshots[index];
  const hasMultiple = screenshots.length > 1;
  const dialogRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;

      const focusable = Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
        ) ?? []
      ).filter((element) => element.getClientRects().length > 0);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    // El diálogo se porta a `document.body` (ver el `createPortal` más abajo)
    // para poder dejar `#site-shell` (todo lo demás) fuera del árbol de
    // accesibilidad mientras está abierto — si el diálogo quedara anidado
    // dentro de `#site-shell`, `inert` también lo desactivaría a él.
    const shell = document.getElementById("site-shell");
    shell?.setAttribute("inert", "");
    shell?.setAttribute("aria-hidden", "true");

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      shell?.removeAttribute("inert");
      shell?.removeAttribute("aria-hidden");
      previouslyFocused?.focus();
    };
  }, []);

  return createPortal(
    <div className="project-lightbox" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section
        ref={dialogRef}
        className="project-lightbox__dialog"
        role="dialog"
        aria-modal="true"
        aria-label={`${project.title}: ${screenshot.title}`}
        data-multiple={hasMultiple}
        onKeyDown={(event) => {
          if (event.key === "Escape") { event.preventDefault(); onClose(); }
          if (hasMultiple && event.key === "ArrowLeft") { event.preventDefault(); onSelect(previous); }
          if (hasMultiple && event.key === "ArrowRight") { event.preventDefault(); onSelect(next); }
        }}
      >
        <button ref={closeRef} type="button" className="project-lightbox__close" onClick={onClose} aria-label="Cerrar visor">&times;</button>
        {hasMultiple && (
          <button type="button" className="project-lightbox__side project-lightbox__side--previous" onClick={() => onSelect(previous)} aria-label={`Ver ${screenshots[previous].title}`}>
            <ProjectCover title={screenshots[previous].title} cover={screenshots[previous].cover} coverAspect={screenshots[previous].coverAspect ?? 16 / 10} blurred={screenshots[previous].blurred} />
          </button>
        )}
        <article className="project-lightbox__active">
          <ProjectCover title={screenshot.title} cover={screenshot.cover} coverAspect={screenshot.coverAspect ?? 16 / 10} blurred={screenshot.blurred} />
          <ProjectCardDetails project={project} statusLabels={statusLabels} mode={mode} />
        </article>
        {hasMultiple && (
          <>
            <button type="button" className="project-lightbox__side project-lightbox__side--next" onClick={() => onSelect(next)} aria-label={`Ver ${screenshots[next].title}`}>
              <ProjectCover title={screenshots[next].title} cover={screenshots[next].cover} coverAspect={screenshots[next].coverAspect ?? 16 / 10} blurred={screenshots[next].blurred} />
            </button>
            <div className="project-lightbox__controls" aria-label="Navegacion de capturas">
              <button type="button" onClick={() => onSelect(previous)} aria-label="Captura anterior">&larr;</button>
              <span>{index + 1} / {screenshots.length}</span>
              <button type="button" onClick={() => onSelect(next)} aria-label="Captura siguiente">&rarr;</button>
            </div>
          </>
        )}
      </section>
    </div>,
    document.body
  );
}

function FeaturedCards({ projects, statusLabels, mode }: { projects: Project[]; statusLabels: Record<ProjectStatus, string>; mode: ContentMode }) {
  const [open, setOpen] = useState<{ project: Project; screenshots: ProjectScreenshot[]; index: number } | null>(null);
  const screenshotsFor = (project: Project): ProjectScreenshot[] => {
    if (!project.cover) return [];
    return [
      { id: `${project.slug}-cover`, title: project.title, cover: project.cover, coverAspect: project.coverAspect, blurred: project.coverBlurred },
      ...(project.screenshots ?? []).map((screenshot, index) => ({ id: `${project.slug}-screenshot-${index + 1}`, ...screenshot })),
    ];
  };

  return (
    <>
      <div className="featured-deck reveal">
        {projects.map((project) => {
          const screenshots = screenshotsFor(project);
          const textOnly = screenshots.length === 0;
          return (
            <article
              key={project.slug}
              id={`project-${project.slug}`}
              className={`featured-project scroll-mt-24${textOnly ? " featured-project--text-only" : ""}`}
            >
              <div className="featured-project__header">
                <ProjectCardDetails project={project} statusLabels={statusLabels} mode={mode} />
              </div>
              {!textOnly && (
                <ScreenshotDeck
                  project={project}
                  screenshots={screenshots}
                  onOpen={(index) => {
                    analytics.projectCardClick(project.slug);
                    setOpen({ project, screenshots, index });
                  }}
                />
              )}
            </article>
          );
        })}
      </div>
      {open && (
        <ProjectLightbox
          project={open.project}
          screenshots={open.screenshots}
          index={open.index}
          statusLabels={statusLabels}
          mode={mode}
          onClose={() => setOpen(null)}
          onSelect={(index) => setOpen({ ...open, index })}
        />
      )}
    </>
  );
}

// Sin capturas propias: en vez de dejarlas como dos filas angostas y vacías
// en "todo lo demás", se emparejan en un único bloque de dos columnas que
// ocupa el ancho de la sección entre las dos, cada una en vertical.
const PAIRED_SLUGS = ["pit-engineer", "ac-head-tracking"];

export default function Work({ projects }: { projects: Project[] }) {
  const { t } = useLang();
  const { mode } = useContentMode();
  const clientProjects = projects.filter((project) => !project.personal);
  const featured = clientProjects.filter((project) => project.featured);
  const rest = clientProjects.filter((project) => !project.featured);
  const restRows = rest.filter((project) => !PAIRED_SLUGS.includes(project.slug));
  const restPaired = PAIRED_SLUGS.map((slug) => rest.find((project) => project.slug === slug)).filter(
    (project): project is Project => Boolean(project)
  );
  const statusLabels = t.work.status;
  return (
    <section id="work" className="work-section mode-section site-section">
      <div className="max-w-6xl mx-auto">
        <SectionContentModeToggle sectionId="work" />
        <div className="reveal mb-6">
          <p className="section-label font-mono mb-3">{t.work.sectionLabel}</p>
          <h2 className="editorial-type" style={{ fontSize: "var(--text-title)", fontWeight: 500, lineHeight: 1.15, color: "var(--color-ink)" }}>{t.work.sectionTitle}</h2>
        </div>
        {featured.length > 0 && <FeaturedCards projects={featured} statusLabels={statusLabels} mode={mode} />}
        <div className="reveal mb-7 mt-9 md:mt-10">
          <p className="section-label font-mono mb-3">{t.work.moreLabel}</p>
          <h2 className="editorial-type" style={{ fontSize: "var(--text-heading)", fontWeight: 500, lineHeight: 1.2, color: "var(--color-ink)" }}>{t.work.moreTitle}</h2>
        </div>
        <div className="more-project-list">
          {restRows.map((project) => {
            const link = project.links[0];
            return (
              <article
                key={project.slug}
                id={`project-${project.slug}`}
                className="reveal more-project-row scroll-mt-24"
              >
                {project.cover && (
                  <div className="more-project-row__cover">
                    <ProjectCover title={project.title} cover={project.cover} coverAspect={project.coverAspect ?? 16 / 10} blurred={project.coverBlurred} coverPosition={project.coverPosition} />
                  </div>
                )}
                <div className="more-project-row__info">
                  <div className="more-project-row__meta">
                    <span className="font-mono" style={{ fontSize: "var(--text-2xs)", letterSpacing: "0.1em", color: "var(--color-ink-faded)" }}>{project.year}</span>
                    <StatusLabel status={project.status} label={statusLabels[project.status]} />
                  </div>
                  <div className="more-project-row__title">
                    <h3 className="editorial-type" style={{ fontSize: "var(--text-base)", fontWeight: 500, color: "var(--color-ink)" }}>
                      {link ? (
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="more-project-row__title-link"
                          onClick={() => analytics.projectLinkClick(project.slug, link.url)}
                        >
                          {project.title} <span aria-hidden="true">&rarr;</span>
                        </a>
                      ) : project.title}
                    </h3>
                  </div>
                </div>
                <div className="more-project-row__summary">
                  <ContentModeText
                    overview={project.summary}
                    technical={project.technical}
                    mode={mode}
                    className="editorial-type"
                    style={{ fontSize: "var(--text-xs)", lineHeight: 1.55, color: "var(--color-ink-faded)" }}
                  />
                </div>
                <div className="more-project-row__stack"><StackIcons stack={project.stack} /></div>
              </article>
            );
          })}

          {restPaired.length > 0 && (
            <div className="more-project-pair">
              {restPaired.map((project) => {
                const link = project.links[0];
                return (
                  <article
                    key={project.slug}
                    id={`project-${project.slug}`}
                    className="reveal more-project-pair__item scroll-mt-24"
                  >
                    <div className="more-project-pair__meta">
                      <span className="font-mono" style={{ fontSize: "var(--text-2xs)", letterSpacing: "0.1em", color: "var(--color-ink-faded)" }}>{project.year}</span>
                      <StatusLabel status={project.status} label={statusLabels[project.status]} />
                    </div>
                    <h3 className="editorial-type more-project-pair__title" style={{ fontSize: "var(--text-base)", fontWeight: 500, color: "var(--color-ink)" }}>
                      {link ? (
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="more-project-row__title-link"
                          onClick={() => analytics.projectLinkClick(project.slug, link.url)}
                        >
                          {project.title} <span aria-hidden="true">&rarr;</span>
                        </a>
                      ) : project.title}
                    </h3>
                    <div className="more-project-pair__summary">
                      <ContentModeText
                        overview={project.summary}
                        technical={project.technical}
                        mode={mode}
                        className="editorial-type"
                        style={{ fontSize: "var(--text-xs)", lineHeight: 1.55, color: "var(--color-ink-faded)" }}
                      />
                    </div>
                    <div className="more-project-pair__stack"><StackIcons stack={project.stack} /></div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
