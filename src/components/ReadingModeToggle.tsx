"use client";

import { useEffect, useRef, useState } from "react";
import ContentModeToggle from "@/components/ContentModeToggle";

/*
 * El switch Resumen/Técnico ya no vive fijo en la sidebar global: es un
 * control ÚNICO (mismo estado global vía `useContentMode`) para las dos
 * secciones cuyo contenido cambia entre modos — Work y Sim Racing
 * (`#work` / `#personal`). Se muestra fijo mientras alguna de las dos ocupa
 * la banda central del viewport y se oculta — con fade + `inert`, respetando
 * `prefers-reduced-motion` desde la CSS — al salir de ambas.
 *
 * Se renderizan dos `ContentModeToggle`: uno vertical para la columna del
 * índice de secciones en desktop, uno horizontal para la tira inferior en
 * mobile. La CSS muestra sólo el que corresponde al breakpoint (`display`),
 * así que sólo uno está en el árbol de accesibilidad a la vez; comparten el
 * mismo estado de contexto. Comportamiento y accesibilidad del control =
 * los de siempre.
 */
export default function ReadingModeToggle() {
  const anchorRef = useRef<HTMLDivElement>(null);
  const [inScope, setInScope] = useState(false);

  useEffect(() => {
    const els = ["work", "personal"]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (els.length === 0) return;

    const visible = new Set<string>();
    /* Banda central del viewport (50% del medio): el toggle se ve mientras
       algo de Work o Sim Racing está en esa franja. Con `threshold: 0` a
       secas se quedaba pegado sobre el encabezado de la sección siguiente. */
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        setInScope(visible.size > 0);
      },
      { threshold: 0, rootMargin: "-25% 0px -25% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={anchorRef}
      className="reading-mode-toggle"
      data-visible={inScope}
      aria-hidden={!inScope}
      inert={!inScope || undefined}
    >
      <ContentModeToggle orientation="vertical" className="reading-mode-toggle__rail" />
      <ContentModeToggle orientation="horizontal" className="reading-mode-toggle__bar" />
    </div>
  );
}
