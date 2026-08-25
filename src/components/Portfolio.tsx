"use client";

import { useEffect } from "react";
import { LanguageProvider } from "@/context/LanguageContext";
import type { Locale } from "@/lib/i18n";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Work from "@/components/Work";
import Stack from "@/components/Stack";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

// TODO(stage 5): this whole shell is replaced by the panel layout. It is kept
// here so stage 1 ships a working site while the routing changes underneath.
function Sections() {
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

  return (
    <div className="grain relative" style={{ backgroundColor: "var(--bg)" }}>
      <Nav />
      <Hero />
      <Work />
      <Stack />
      <About />
      <Contact />
      <Footer />
    </div>
  );
}

export default function Portfolio({ locale }: { locale: Locale }) {
  return (
    <LanguageProvider locale={locale}>
      <Sections />
    </LanguageProvider>
  );
}
