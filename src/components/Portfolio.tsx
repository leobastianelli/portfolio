"use client";

import { useEffect } from "react";
import { LanguageProvider } from "@/context/LanguageContext";
import { ContentModeProvider } from "@/context/ContentModeContext";
import type { Locale } from "@/lib/i18n";
import type { UiContent } from "@/lib/content/ui";
import type { Project } from "@/lib/content/types";
import Nav from "@/components/Nav";
import SectionIndex from "@/components/SectionIndex";
import Hero from "@/components/Hero";
import Work from "@/components/Work";
import Stack from "@/components/Stack";
import Personal from "@/components/Personal";
import Contact from "@/components/Contact";

function Sections({ projects }: { projects: Project[] }) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const hasPersonal = projects.some((project) => project.personal);

  return (
    <div className="relative site-shell">
      <Nav />
      <SectionIndex hasPersonal={hasPersonal} />
      <Hero />
      <Work projects={projects} />
      <Stack />
      <Personal projects={projects} />
      <Contact />
    </div>
  );
}

export default function Portfolio({
  locale,
  ui,
  projects,
}: {
  locale: Locale;
  ui: UiContent;
  projects: Project[];
}) {
  return (
    <LanguageProvider locale={locale} ui={ui}>
      <ContentModeProvider>
        <Sections projects={projects} />
      </ContentModeProvider>
    </LanguageProvider>
  );
}
