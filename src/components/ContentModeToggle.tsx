"use client";

import { useContentMode } from "@/context/ContentModeContext";
import { useLang } from "@/context/LanguageContext";
import { useEffect, useRef } from "react";

/**
 * Segmented control (Leo's reference: a two-tab jQuery/JavaScript switch)
 * translated to grayscale — no color, just ink/stain. The active option
 * is a solid black box with white text; the inactive one is gray with
 * white text. `.content-mode-toggle-fill` is a single absolutely
 * positioned box that slides between the two halves via `transform`,
 * rather than each button independently swapping its own background —
 * that's what makes it read as the dark fill "draining" from one side to
 * the other instead of an instant flip. Each half is its own `<button
 * aria-pressed>` (matches the reference visually), but both flip the
 * SAME shared state on click rather than each setting its own specific
 * value — clicking the already-active half still has to do something
 * (Leo: "wherever you touch, not just the deactivated one, it has to
 * change"), not be a no-op because it was already selected.
 */
export default function ContentModeToggle({
  orientation = "horizontal",
  className,
}: {
  orientation?: "horizontal" | "vertical";
  className?: string;
} = {}) {
  const { mode, setMode } = useContentMode();
  const { t } = useLang();
  const isTechnical = mode === "technical";
  const flip = () => setMode(isTechnical ? "overview" : "technical");
  /* En vertical el fill se desliza en Y; en horizontal, en X. */
  const axis = orientation === "vertical" ? "translateY" : "translateX";

  const technicalRef = useRef<HTMLSpanElement>(null);
  const overviewRef = useRef<HTMLSpanElement>(null);

  // The two boxes are equal width (`min-width: 0` fix), but "Técnico" and
  // "Resumen" (or "Technical"/"Overview") aren't the same length, so
  // text-align: center leaves more breathing room on one side than the
  // other between the word and its own box edge — which reads as one box
  // being bigger, even though they're not. Stretches the shorter word's
  // own letter-spacing until it occupies the same width as the longer
  // one, so both sit with identical margin inside identical boxes.
  useEffect(() => {
    const a = technicalRef.current;
    const b = overviewRef.current;
    if (!a || !b) return;

    a.style.letterSpacing = "";
    b.style.letterSpacing = "";

    const widthOf = (el: HTMLElement) => el.getBoundingClientRect().width;
    const baseSpacing = (el: HTMLElement) => parseFloat(getComputedStyle(el).letterSpacing) || 0;

    const widthA = widthOf(a);
    const widthB = widthOf(b);
    const target = Math.max(widthA, widthB);

    const stretch = (el: HTMLElement, width: number) => {
      const chars = el.textContent?.length ?? 1;
      if (chars <= 1 || width >= target) return;
      const extraPerGap = (target - width) / (chars - 1);
      el.style.letterSpacing = `${baseSpacing(el) + extraPerGap}px`;
    };

    stretch(a, widthA);
    stretch(b, widthB);
  }, [t]);

  return (
    <div
      className={`content-mode-toggle content-mode-toggle--${orientation}${className ? ` ${className}` : ""}`}
      role="group"
      aria-label={t.nav.contentMode.label}
    >
      <span
        className="content-mode-toggle-fill"
        aria-hidden="true"
        style={{ transform: isTechnical ? `${axis}(0%)` : `${axis}(100%)` }}
      />
      <button type="button" aria-pressed={isTechnical} className="content-mode-toggle-option" onClick={flip}>
        <span ref={technicalRef}>{t.nav.contentMode.technical}</span>
      </button>
      <button type="button" aria-pressed={!isTechnical} className="content-mode-toggle-option" onClick={flip}>
        <span ref={overviewRef}>{t.nav.contentMode.overview}</span>
      </button>
    </div>
  );
}
