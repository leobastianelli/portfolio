"use client";

import { useEffect, useRef, useState } from "react";
import { useLang } from "@/context/LanguageContext";

/**
 * Replaces the old top-bar section links. Fixed to the side on desktop
 * (~25vh–68vh, per direccion-visual-v3's follow-up); on narrow viewports
 * there's no side margin to float in, so it becomes a bottom rail of dots
 * instead of hiding — same links, same accessible names, just no room for
 * the text labels (see `.section-index` in globals.css for the breakpoint).
 *
 * Order here has to match the actual DOM order in `Portfolio.tsx`
 * (Hero → Work → Stack → Personal → Contact) — it drifted out of sync
 * once (Personal listed before Stack while rendering after it), which is
 * confusing regardless of scroll behavior since the list should read like
 * a table of contents.
 *
 * Sections already scrolled past stay "painted" (full-ink label) instead
 * of reverting once you move on — Leo wanted the sense of advancing, like
 * a progress trail, not a single spotlight that jumps between items. The
 * CURRENT section fills in progressively as you scroll through it (a
 * left-to-right sweep, not a per-DOM-letter split — see
 * `.section-index-label-fill` in globals.css for why) and additionally
 * carries `aria-current="location"` — that's the one true "where you are"
 * signal for assistive tech; everything else here is a purely visual echo
 * of scroll progress. No bullet/dot marker (removed per Leo) — the sweep +
 * bold-on-current carry state, never color alone.
 */
export default function SectionIndex({ hasPersonal }: { hasPersonal: boolean }) {
  const { t } = useLang();
  const [active, setActive] = useState("hero");
  const activeRef = useRef("hero");
  const rowRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const progressTrackRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);

  const sections = [
    { id: "hero", label: t.nav.home },
    { id: "about", label: t.about.label },
    { id: "work", label: t.nav.work },
    { id: "stack", label: t.nav.stack },
    ...(hasPersonal ? [{ id: "personal", label: t.personal.sectionTitle }] : []),
    { id: "contact", label: t.nav.contact },
  ];
  const sectionIds = sections.map((s) => s.id).join(",");
  const activeIndex = Math.max(
    0,
    sections.findIndex((s) => s.id === active)
  );

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const ids = sectionIds.split(",");
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (els.length === 0) return;

    let ticking = false;
    const applyActive = () => {
      ticking = false;
      const markerY = window.scrollY + window.innerHeight * 0.5;
      let nextActive = els[0].id;

      for (const el of els) {
        const top = el.getBoundingClientRect().top + window.scrollY;
        if (top > markerY) break;
        nextActive = el.id;
      }

      if (nextActive !== activeRef.current) {
        activeRef.current = nextActive;
        setActive(nextActive);
      }
    };
    const onPositionChange = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(applyActive);
    };

    applyActive();
    window.addEventListener("scroll", onPositionChange, { passive: true });
    window.addEventListener("resize", onPositionChange);
    return () => {
      window.removeEventListener("scroll", onPositionChange);
      window.removeEventListener("resize", onPositionChange);
    };
  }, [sectionIds]);

  // The progress rail has to start exactly at the top of the first label's
  // glyphs and end exactly at the bottom of the last label's — not just
  // stretch to match the row's flex box, which includes each line's
  // leading (the space line-height adds above/below the actual letters).
  // Measured directly off the label elements (which are set to
  // `line-height: 1` in CSS specifically so this measurement has as little
  // built-in font leading to subtract as possible — these labels are all
  // caps with no descenders, so line-height:1 gets very close to true ink
  // bounds, not just the line box).
  useEffect(() => {
    const row = rowRef.current;
    const list = listRef.current;
    const track = progressTrackRef.current;
    if (!row || !list || !track) return;

    const measure = () => {
      const labels = list.querySelectorAll<HTMLElement>(".section-index-label");
      if (labels.length === 0) return;
      const rowBox = row.getBoundingClientRect();
      const firstTop = labels[0].getBoundingClientRect().top;
      const lastBottom = labels[labels.length - 1].getBoundingClientRect().bottom;
      track.style.marginTop = `${firstTop - rowBox.top}px`;
      track.style.height = `${lastBottom - firstTop}px`;
    };

    measure();
    window.addEventListener("resize", measure);
    // Bricolage can still be swapping in from a fallback face on first
    // paint — remeasure once the real metrics are in.
    document.fonts?.ready?.then(measure).catch(() => {});
    return () => window.removeEventListener("resize", measure);
  }, [sectionIds]);

  // Two scroll-linked visuals, one listener: the overall page-progress
  // rail, and the current section's own letter-sweep. Both write straight
  // to the DOM (a CSS custom property for the sweep, height for the rail)
  // instead of going through React state, same as the old vinyl's scroll
  // handler — this runs on every scroll frame, a re-render doesn't need to.
  useEffect(() => {
    const fill = progressFillRef.current;
    const list = listRef.current;
    if (!fill || !list) return;

    let ticking = false;
    const apply = () => {
      ticking = false;

      const maxScrollY = document.documentElement.scrollHeight - window.innerHeight;
      const pagePct = maxScrollY > 0 ? Math.min(100, Math.max(0, (window.scrollY / maxScrollY) * 100)) : 0;
      fill.style.height = `${pagePct}%`;

      const sectionEl = document.getElementById(activeRef.current);
      const fillLabel = list.querySelector<HTMLElement>(
        `[data-id="${activeRef.current}"] .section-index-label-fill`
      );
      if (sectionEl && fillLabel) {
        const sectionTop = sectionEl.getBoundingClientRect().top + window.scrollY;
        const viewportHeight = window.innerHeight;
        // Match the sweep to the same center-of-viewport transition used to
        // choose the active section. The previous label reaches 100% at that
        // exact point, so changing it to `data-state="passed"` never creates
        // a visible jump.
        const currentItem = fillLabel.closest<HTMLElement>("li[data-id]");
        const nextId = currentItem?.nextElementSibling?.getAttribute("data-id");
        const nextEl = nextId ? document.getElementById(nextId) : null;
        const activationOffset = viewportHeight * 0.5;
        const startScroll = activeRef.current === "hero"
          ? 0
          : Math.max(0, sectionTop - activationOffset);
        const nextTop = nextEl
          ? nextEl.getBoundingClientRect().top + window.scrollY
          : null;
        const endScroll = nextTop === null
          ? maxScrollY
          : Math.min(maxScrollY, Math.max(startScroll, nextTop - activationOffset));
        const span = Math.max(endScroll - startScroll, 0.0001);
        const raw = (window.scrollY - startScroll) / span;
        const sectionPct = Math.min(100, Math.max(0, raw * 100));
        fillLabel.style.setProperty("--index-fill", `${sectionPct}%`);
      }
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="section-index">
      <div className="section-index-row" ref={rowRef}>
        <div className="section-index-progress" ref={progressTrackRef} aria-hidden="true">
          <div ref={progressFillRef} className="section-index-progress-fill" />
        </div>
        <nav aria-label={t.nav.sections} className="section-index-nav">
          <ul className="section-index-list" ref={listRef}>
            {sections.map((s, i) => {
              const state = i < activeIndex ? "passed" : i === activeIndex ? "current" : "upcoming";
              return (
                <li key={s.id} data-id={s.id}>
                  <a
                    href={`#${s.id}`}
                    data-state={state}
                    aria-current={state === "current" ? "location" : undefined}
                    className="section-index-link"
                  >
                    <span className="section-index-label">
                      {/* The real text a screen reader gets. Its own span (not just
                          text directly in `.section-index-label`) so its faded
                          opacity is independent of the fill's — opacity on a
                          shared parent would've capped the fill's opacity too. */}
                      <span className="section-index-label-base">{s.label}</span>
                      {/* Visual-only duplicate, clipped left-to-right as you scroll
                          through the section — reads as the label "painting in"
                          instead of a flat state flip. `aria-hidden`, doesn't
                          reach assistive tech. */}
                      <span className="section-index-label-fill" aria-hidden="true">
                        {s.label}
                      </span>
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
