"use client";

import { useEffect, useRef } from "react";
import { analytics } from "@/lib/analytics";

/**
 * Fires `note_read` once the visitor has scrolled far enough that 75% of the
 * note body has passed through the viewport. One event per mount — resets when
 * navigating to another note.
 */
export default function NoteReadTracker({ slug }: { slug: string }) {
  const fired = useRef(false);

  useEffect(() => {
    fired.current = false;
    const body = document.querySelector<HTMLElement>(".note-body");
    if (!body) return;

    const check = () => {
      if (fired.current) return;
      const rect = body.getBoundingClientRect();
      const seen = Math.min(rect.height, Math.max(0, window.innerHeight - rect.top));
      if (rect.height > 0 && seen / rect.height >= 0.75) {
        fired.current = true;
        analytics.noteRead(slug);
        window.removeEventListener("scroll", check);
      }
    };

    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, [slug]);

  return null;
}
