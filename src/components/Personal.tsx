"use client";

import { useLang } from "@/context/LanguageContext";
import { useContentMode } from "@/context/ContentModeContext";
import ContentModeText from "@/components/ContentModeText";
import { ProjectCover, StatusLabel } from "@/components/Work";
import { StackIcons } from "@/components/StackIcons";
import SectionContentModeToggle from "@/components/SectionContentModeToggle";
import type { Project } from "@/lib/content/types";

export default function Personal({ projects }: { projects: Project[] }) {
  const { t } = useLang();
  const { mode } = useContentMode();
  const personalProjects = projects.filter((project) => project.personal);
  const statusLabels = t.work.status;

  if (personalProjects.length === 0) return null;

  return (
    <section
      id="personal"
      className="mode-section site-section"
      style={{ borderTop: "1px solid var(--border)", marginTop: "var(--spacing-6)" }}
    >
      <div className="max-w-6xl mx-auto">
        <SectionContentModeToggle sectionId="personal" />
        <div className="reveal mb-7">
          <p className="section-label font-mono mb-3">{t.personal.sectionLabel}</p>
          <h2 className="editorial-type" style={{ fontSize: "var(--text-title)", fontWeight: 500, lineHeight: 1.15, color: "var(--color-ink)" }}>
            {t.personal.sectionTitle}
          </h2>
          <p className="editorial-type mt-4" style={{ fontSize: "var(--text-base)", lineHeight: 1.7, maxWidth: "540px", color: "var(--color-ink-faded)" }}>
            {t.personal.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
          {personalProjects.map((project, i) => (
            <div key={project.slug} className="reveal flex flex-col" style={{ transitionDelay: `${i * 0.08}s` }}>
              <ProjectCover title={project.title} cover={project.cover} />

              <div className="mt-4 mb-2 flex items-center gap-3 flex-wrap">
                <span className="font-mono" style={{ fontSize: "var(--text-2xs)", letterSpacing: "0.1em", color: "var(--color-ink-faded)" }}>
                  {project.year}
                </span>
                <StatusLabel status={project.status} label={statusLabels[project.status]} />
              </div>

              <h3 className="editorial-type" style={{ fontSize: "var(--text-xl)", fontWeight: 500, color: "var(--color-ink)", marginBottom: "0.3rem" }}>
                {project.title}
              </h3>
              <p className="editorial-type mb-4" style={{ fontStyle: "italic", fontSize: "var(--text-sm)", color: "var(--color-ink-faded)" }}>
                {project.role}
              </p>

              <ContentModeText
                overview={project.summary}
                technical={project.technical}
                mode={mode}
                className="editorial-type mb-5"
                style={{ fontSize: "var(--text-base)", lineHeight: 1.7, color: "var(--color-ink)" }}
              />

              <StackIcons stack={project.stack} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
