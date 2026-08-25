"use client";

import { useContentMode } from "@/context/ContentModeContext";
import { useLang } from "@/context/LanguageContext";

export default function ContentModeToggle() {
  const { mode, toggle } = useContentMode();
  const { t } = useLang();
  const isTechnical = mode === "technical";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isTechnical}
      aria-label={t.nav.contentMode.label}
      onClick={toggle}
      className="content-mode-toggle"
    >
      <span className="content-mode-toggle-track">
        <span className="content-mode-toggle-knob" />
      </span>
      <span className={`led ${isTechnical ? "led-work" : ""}`} aria-hidden="true" />
      {/* "Overview"/"Technical" render at different widths — stacked in the
          same grid cell (like Work's summary/technical) so the toggle's own
          footprint never changes and nothing next to it in Nav reflows. */}
      <span className="content-mode-text">
        <span data-hidden={isTechnical} className="label-engraved">
          {t.nav.contentMode.overview}
        </span>
        <span data-hidden={!isTechnical} className="label-engraved">
          {t.nav.contentMode.technical}
        </span>
      </span>
    </button>
  );
}
