"use client";

import { useEffect, useState } from "react";
import ContentModeToggle from "@/components/ContentModeToggle";

/** A fixed reading-mode control, shown only while its own section is in view. */
export default function SectionContentModeToggle({ sectionId }: { sectionId: string }) {
  const [inScope, setInScope] = useState(false);

  useEffect(() => {
    const section = document.getElementById(sectionId);
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInScope(entry.isIntersecting),
      { rootMargin: "-35% 0px -35% 0px", threshold: 0 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [sectionId]);

  return (
    <div
      className="section-mode-toggle"
      data-visible={inScope}
      aria-hidden={!inScope}
      inert={!inScope || undefined}
    >
      <ContentModeToggle orientation="vertical" />
    </div>
  );
}
