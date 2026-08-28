"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useLang } from "@/context/LanguageContext";
import { SITE } from "@/lib/site";
import { getContactLinks } from "@/lib/contactLinks";
import LocaleSwitcher from "@/components/LocaleSwitcher";

/**
 * The old top bar (logo + section links + hire CTA) is gone — section
 * navigation moved to the floating index (`SectionIndex.tsx`), and this is
 * now just a disclosure: a button that reveals contact info, socials, and
 * the locale switch. Nothing else lives in here on purpose (Leo: "nada
 * más").
 *
 * The toggle button and the panel it reveals are now ONE visual box
 * (`.menu-anchor`) instead of a floating icon + a separate panel elsewhere
 * on screen — the button is the box's header, the panel is its body,
 * sharing a border with no gap. The button shows "Hablemos" (reusing
 * Contact's own section label, not a separate string) next to the icon.
 * The icon's middle bar doesn't just fade on open: it falls straight down
 * like gravity, then slides left to land as the word's underline (Leo
 * simplified this from an earlier rotate-travel-rotate version). Measured
 * against the actual rendered label (not a guessed offset), so it lines
 * up regardless of locale/word length.
 */
export default function Nav() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const middleBarRef = useRef<HTMLSpanElement>(null);
  const contactLinks = getContactLinks(t);

  // Where the middle bar ends up: left-aligned under the label, just below
  // its baseline, grown to the label's own width so the "underline" really
  // covers the whole word. Set as CSS custom properties the `@keyframes`
  // read from, rather than hardcoded distances — "Contactame" and its
  // translations don't measure the same.
  //
  // Deliberately measured ONLY on mount/resize/font-load — NOT every time
  // `open` changes. It used to also depend on `open`, on the theory that
  // re-measuring right before each animation would be more accurate; in
  // practice that measured the bar WHILE (or just after) the CSS animation
  // had already moved it, so `getBoundingClientRect()` read its in-flight
  // animated position instead of its resting one — the computed distance
  // came out ~0 (bar measured against a target it had already reached),
  // which then got written back as the new "resting" distance and broke
  // every subsequent open. The bar's resting position doesn't change
  // just because the menu opened, so there was never a reason to
  // remeasure then in the first place.
  useEffect(() => {
    const label = labelRef.current;
    const bar = middleBarRef.current;
    if (!label || !bar) return;

    const measure = () => {
      const labelBox = label.getBoundingClientRect();
      const barBox = bar.getBoundingClientRect();
      // No width-growth compensation anymore — that was needed while the
      // bar was a `flex` item (shrink-to-fit parent grew from the right
      // when the bar widened). Now that it's `position: absolute` with an
      // explicit `left`, growing `width` extends rightward from that fixed
      // left edge, the normal box-model behavior — adding a correction for
      // a quirk that no longer applies was making the bar stop short of
      // the label instead of reaching it.
      const dx = labelBox.left - barBox.left;
      // Straight to where the bar's OWN top edge should land (label's
      // bottom + a small gap) instead of going through its center.
      const dy = labelBox.bottom + 3 - barBox.top;
      bar.style.setProperty("--underline-dx", `${dx}px`);
      bar.style.setProperty("--underline-dy", `${dy}px`);
      bar.style.setProperty("--underline-width", `${labelBox.width}px`);
    };

    // A `ResizeObserver` on the label instead of a guessed delay — both
    // `document.fonts.ready` and a flat `setTimeout` still left this
    // reading a stale, too-small distance on some loads (label geometry
    // apparently doesn't finish settling on any fixed schedule this measured
    // against). `ResizeObserver` re-fires `measure()` every time the
    // label's actual box changes — including its guaranteed first call —
    // so this tracks the label's real, settled size instead of a timing
    // guess.
    const observer = new ResizeObserver(measure);
    observer.observe(label);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [t]);

  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;
    if (!panel) return;

    const getFocusable = () =>
      Array.from(
        panel.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
      );

    getFocusable()[0]?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        buttonRef.current?.focus();
        return;
      }
      if (e.key !== "Tab") return;
      const items = getFocusable();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    // No `body { overflow: hidden }` scroll lock. The backdrop already
    // blocks interacting with the page behind it via its own click
    // handler + `inert` on everything else, so a background scroll (via
    // wheel/keyboard) is the only minor trade-off.
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      {/* Click-away + dim only — no content of its own, that lives in
          `.menu-anchor` below, positioned independently so the box stays
          anchored to the button instead of centered/floating. */}
      <div className="menu-overlay" data-open={open} aria-hidden="true" onClick={() => setOpen(false)} />

      <div className="menu-anchor">
        <button
          ref={buttonRef}
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={open ? t.nav.menu.close : t.nav.menu.open}
          onClick={() => setOpen((v) => !v)}
          className="menu-toggle"
        >
          <span ref={labelRef} className="menu-toggle-label editorial-type" aria-hidden="true" data-visible={open}>
            {t.nav.menu.label}
          </span>
          <span className="menu-toggle-icon">
            <span className="menu-toggle-bar" aria-hidden="true" />
            <span ref={middleBarRef} className="menu-toggle-bar" aria-hidden="true" />
            <span className="menu-toggle-bar" aria-hidden="true" />
          </span>
        </button>

        {/*
         * Always mounted (never `{open && ...}`) so it can animate both
         * ways — `inert` blocks interaction/focus while closed, the
         * height/opacity transition is purely visual.
         */}
        <div
          id={panelId}
          ref={panelRef}
          role="dialog"
          aria-modal={open || undefined}
          aria-label={t.nav.menu.title}
          className="menu-panel"
          data-open={open}
          inert={!open || undefined}
        >
          <a href={`mailto:${SITE.email}`} className="cta-btn editorial-type w-fit">
            {t.nav.hire}
          </a>

          <ul className="menu-panel-links">
            {contactLinks.map((link) => (
              <li key={link.key}>
                <a
                  href={link.href}
                  target={link.href.startsWith("mailto") ? undefined : "_blank"}
                  rel={link.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                  className="menu-panel-link"
                >
                  <span className="label-engraved">{link.label}</span>
                  <span className="editorial-type" style={{ fontSize: "0.95rem", color: "var(--color-ink)" }}>
                    {link.value}
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <div className="menu-panel-locale">
            <LocaleSwitcher />
          </div>
        </div>
      </div>
    </>
  );
}
