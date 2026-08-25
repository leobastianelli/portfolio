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
      <span className="label-engraved">
        {isTechnical ? t.nav.contentMode.technical : t.nav.contentMode.overview}
      </span>
    </button>
  );
}
