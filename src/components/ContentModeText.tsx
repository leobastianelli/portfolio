"use client";

import { useLayoutEffect, useRef, type CSSProperties } from "react";
import type { ContentMode } from "@/context/ContentModeContext";

/** Animate the measured paragraph height without duplicating its React state. */
export default function ContentModeText({ overview, technical, mode, className, style }: {
  overview: string;
  technical: string;
  mode: ContentMode;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const previousHeight = useRef<number | null>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const height = element.getBoundingClientRect().height;
    const from = previousHeight.current;
    previousHeight.current = height;
    const animation = from !== null && from !== height &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? element.animate(
          [{ height: from + "px", overflow: "hidden" }, { height: height + "px", overflow: "hidden" }],
          { duration: 260, easing: "ease-out" }
        )
      : null;
    const observer = new ResizeObserver(() => {
      if (!animation || animation.playState === "finished") {
        previousHeight.current = element.getBoundingClientRect().height;
      }
    });
    observer.observe(element);
    return () => { observer.disconnect(); animation?.cancel(); };
  }, [mode, overview, technical]);

  return <p ref={ref} className={className} style={style}>{mode === "overview" ? overview : technical}</p>;
}
