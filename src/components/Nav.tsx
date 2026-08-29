"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useLang } from "@/context/LanguageContext";
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
 * on screen — the button is the box's header, the panel is its body, no
 * gap. Open, the whole box goes white (paper) with an ink border: the
 * label and icon bars stay ink, nothing inverts (Leo). The button shows
 * "Hablemos" (reusing Contact's own section label, not a separate string)
 * next to the icon.
 *
 * The icon's middle bar doesn't just fade on open: it falls straight down
 * like gravity, then slides left to land as the word's underline (Leo
 * simplified this from an earlier rotate-travel-rotate version). Measured
 * against the actual rendered label (not a guessed offset), so it lines
 * up regardless of locale/word length. Once landed, hovering (or focusing)
 * a contact link glides that same line down under the link; leaving it
 * sends the line back under the label.
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

  // Once the open animation lands the underline bar under the label,
  // `pinnedRef` flips true and the bar switches from `@keyframes` control
  // to plain `top`/`left`/`width` transitions — that's what lets a link
  // hover glide the same line down onto that link, and back.
  const pinnedRef = useRef(false);

  // The underline has exactly four resting spots: under the label
  // ("Contactame") when the cursor is over nothing, and under each of the
  // three contact links' value line when hovered/focused. `null` == label.
  const activeTargetRef = useRef<HTMLElement | null>(null);

  const round = (n: number) => Math.round(n * 100) / 100;

  // Move the bar to whatever `activeTargetRef` points at, positioning it
  // with `top`/`left` relative to its containing block — the hamburger
  // icon box, which has no transform and no transition, so its rect is
  // dead stable. (The earlier version tracked a `translate()` offset and
  // recovered the bar's static origin from a live matrix read; that read
  // drifted mid-transition and the line crept.) Measures the target fresh
  // every call so a late reflow (fonts) is corrected when this re-runs
  // from the ResizeObserver. Writes nothing if unchanged, so repeat calls
  // don't retrigger the 0.5s glide.
  const syncUnderline = useCallback(() => {
    const bar = middleBarRef.current;
    const icon = bar?.parentElement;
    if (!bar || !icon || !pinnedRef.current) return;

    const el = activeTargetRef.current;
    // The value span (`.menu-panel-value`) and the toggle label both
    // shrink-wrap their text (never stretch), so their border box IS the
    // text box.
    const measured = el
      ? (el.querySelector<HTMLElement>(".menu-panel-value") ?? el)
      : labelRef.current;
    if (!measured) return;

    const iconRect = icon.getBoundingClientRect();
    const b = measured.getBoundingClientRect();
    // A hair more clearance under the link values (they have descenders —
    // g, @, y) than under the all-caps label.
    const gap = el ? 5 : 3;
    const top = `${round(b.bottom + gap - iconRect.top)}px`;
    const left = `${round(b.left - iconRect.left)}px`;
    const width = `${round(b.width)}px`;
    // Under the links 1px; under the label 2px — a px finer than the 3px
    // hamburger stroke (Leo asked for both).
    const height = el ? "1px" : "2px";

    if (
      bar.style.top === top &&
      bar.style.left === left &&
      bar.style.width === width &&
      bar.style.height === height
    ) {
      return;
    }
    bar.style.top = top;
    bar.style.left = left;
    bar.style.width = width;
    bar.style.height = height;
  }, []);

  const setUnderlineTarget = useCallback(
    (el: HTMLElement | null) => {
      if (activeTargetRef.current === el) return;
      activeTargetRef.current = el;
      syncUnderline();
    },
    [syncUnderline],
  );

  // Which link row the cursor is over, decided purely by geometry — NOT by
  // per-`<a>` mouseenter/mouseleave. A form-fill / anti-phishing browser
  // extension (the video showed `bis_*` attributes) drops invisible
  // overlays on mailto:/social links, and those swallow or reorder the
  // enter/leave events so the underline lands a row off. A hit-test on the
  // pointer position can't be fooled that way.
  const pointToLink = useCallback((x: number, y: number): HTMLElement | null => {
    const links = panelRef.current?.querySelectorAll<HTMLElement>(".menu-panel-link");
    if (!links) return null;
    for (const link of links) {
      const r = link.getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return link;
    }
    return null;
  }, []);

  // Off a ResizeObserver (label + each link row, so a font swap or resize
  // is caught): while the menu is CLOSED, refresh the `--underline-*`
  // custom properties the opening `@keyframes` reads; while it's open,
  // re-glue the pinned bar to its target.
  //
  // "Only while closed" for the keyframe vars: they are the keyframe's
  // *target*, and rewriting them mid-animation (e.g. a web font swapping
  // in during the 1.1s open) makes the bar chase a moving endpoint. They
  // only matter for the *next* open. `tick` is rAF-batched so a burst of
  // resize notifications collapses to one and can't re-enter.
  useEffect(() => {
    const label = labelRef.current;
    const bar = middleBarRef.current;
    const icon = bar?.parentElement;
    if (!label || !bar || !icon) return;

    let queued = 0;
    const run = () => {
      queued = 0;
      if (!open) {
        const iconRect = icon.getBoundingClientRect();
        const labelBox = label.getBoundingClientRect();
        // The bar's resting spot inside the icon (CSS `top: 10px; left: 0`).
        bar.style.setProperty("--underline-dx", `${labelBox.left - iconRect.left}px`);
        bar.style.setProperty("--underline-dy", `${labelBox.bottom + 3 - (iconRect.top + 10)}px`);
        bar.style.setProperty("--underline-width", `${labelBox.width}px`);
      }
      syncUnderline();
    };
    const tick = () => {
      if (queued) return;
      queued = requestAnimationFrame(run);
    };

    const observer = new ResizeObserver(tick);
    observer.observe(label);
    panelRef.current
      ?.querySelectorAll<HTMLElement>(".menu-panel-link")
      .forEach((el) => observer.observe(el));
    window.addEventListener("resize", tick);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", tick);
      if (queued) cancelAnimationFrame(queued);
    };
  }, [t, open, syncUnderline]);

  // Hand the underline bar off from the opening `@keyframes` to inline
  // transform/width transitions once it lands under the label, so a link
  // hover can slide it down (and releasing it slides it back). Closing
  // clears every inline style so the CSS animation runs clean next time.
  useEffect(() => {
    const bar = middleBarRef.current;
    if (!bar) return;

    if (!open) {
      bar.style.top = "";
      bar.style.left = "";
      bar.style.transform = "";
      bar.style.width = "";
      bar.style.height = "";
      bar.style.animation = "";
      pinnedRef.current = false;
      activeTargetRef.current = null;
      return;
    }

    // The opening `@keyframes` moves the bar with `transform`. When it
    // lands, convert that to `top`/`left` (relative to the icon box) so
    // the hover glide can run on `top`/`left` transitions — clearing the
    // transform in the same step keeps the position visually identical.
    const pin = () => {
      if (pinnedRef.current) return;
      const icon = bar.parentElement;
      if (!icon) return;
      const iconRect = icon.getBoundingClientRect();
      const barRect = bar.getBoundingClientRect();
      // Snap `transform` → `top`/`left` with the transition suppressed, so
      // swapping the positioning model doesn't itself animate (the bar
      // would jump to its CSS `top` then glide back). Restore the
      // transition before the hover glides need it.
      bar.style.transition = "none";
      bar.style.top = `${barRect.top - iconRect.top}px`;
      bar.style.left = `${barRect.left - iconRect.left}px`;
      bar.style.width = `${barRect.width}px`;
      bar.style.height = `${barRect.height}px`;
      bar.style.transform = "none";
      bar.style.animation = "none";
      void bar.offsetWidth;
      bar.style.transition = "";
      pinnedRef.current = true;
      // Default rest is under the label. Only start on a link if the
      // cursor is genuinely over one as the menu finishes opening.
      activeTargetRef.current =
        panelRef.current?.querySelector<HTMLElement>(".menu-panel-link:hover") ?? null;
      syncUnderline();
    };

    const onEnd = (e: AnimationEvent) => {
      if (e.animationName.includes("menu-toggle-underline")) pin();
    };
    bar.addEventListener("animationend", onEnd);

    // Reduced motion kills the opening animation, so `animationend` never
    // comes — pin on the next frame instead. The timeout is a belt-and-
    // braces fallback for anything else that swallows the event.
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const raf = reduce ? requestAnimationFrame(pin) : 0;
    const timer = window.setTimeout(pin, 1400);

    return () => {
      bar.removeEventListener("animationend", onEnd);
      if (raf) cancelAnimationFrame(raf);
      window.clearTimeout(timer);
    };
  }, [open, syncUnderline]);

  // Track which link the cursor is over from a document-level listener +
  // geometry hit-test, not React's per-`<a>` enter/leave — see
  // `pointToLink`. Document-level so an extension overlay sitting on top of
  // a link can't stop the event from being seen.
  useEffect(() => {
    if (!open) return;
    const onMove = (e: MouseEvent) => {
      if (pinnedRef.current) setUnderlineTarget(pointToLink(e.clientX, e.clientY));
    };
    document.addEventListener("mousemove", onMove);
    return () => document.removeEventListener("mousemove", onMove);
  }, [open, pointToLink, setUnderlineTarget]);

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

      <div className="menu-anchor" data-open={open}>
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
          <ul className="menu-panel-links">
            {contactLinks.map((link) => (
              <li key={link.key}>
                <a
                  href={link.href}
                  target={link.href.startsWith("mailto") ? undefined : "_blank"}
                  rel={link.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                  className="menu-panel-link"
                  onFocus={(e) => setUnderlineTarget(e.currentTarget)}
                  onBlur={() => setUnderlineTarget(null)}
                >
                  <span className="label-engraved">{link.label}</span>
                  <span
                    className="menu-panel-value editorial-type"
                    style={{ fontSize: "0.95rem", color: "var(--color-ink)" }}
                  >
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
