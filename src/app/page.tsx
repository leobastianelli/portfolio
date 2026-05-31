"use client";

import { useEffect, useRef } from "react";
import { LanguageProvider } from "@/context/LanguageContext";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Work from "@/components/Work";
import Stack from "@/components/Stack";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

function Portfolio() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );

    document.querySelectorAll(".reveal").forEach((el) => {
      observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
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

export default function Home() {
  return (
    <LanguageProvider>
      <Portfolio />
    </LanguageProvider>
  );
}
