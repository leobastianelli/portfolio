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
import AboutMe from "@/components/AboutMe";
import Work from "@/components/Work";
import Stack from "@/components/Stack";
import Personal from "@/components/Personal";
import Contact from "@/components/Contact";
import { useLang } from "@/context/LanguageContext";

function Sections({ projects }: { projects: Project[] }) {
  const { t } = useLang();
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0, rootMargin: "0px 0px -40px 0px" }
    );

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const hasPersonal = projects.some((project) => project.personal);

  return (
    <div id="site-shell" className="relative site-shell">
      <a href="#main-content" className="skip-link">{t.nav.skipToContent}</a>
      <Nav />
      <SectionIndex hasPersonal={hasPersonal} />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <AboutMe />
        <Work projects={projects} />
        <Stack />
        <Personal projects={projects} />
        <Contact />
      </main>
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
