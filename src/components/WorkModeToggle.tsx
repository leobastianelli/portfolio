"use client";

import { useEffect, useRef, useState } from "react";
import ContentModeToggle from "@/components/ContentModeToggle";

/*
 * El switch Resumen/Técnico ya no vive en la sidebar global de secciones: es
 * un control ÚNICO para toda la sección Work (mismo estado global vía
 * `useContentMode` dentro de `ContentModeToggle`), fijo al viewport mientras
 * `#work` está en pantalla y oculto — con fade + `inert`, respetando
 * `prefers-reduced-motion` desde la CSS — al salir hacia Stack / Sim Racing /
 * Contact. Sólo cambia dónde y cuándo se ve; el comportamiento y la
 * accesibilidad del control son los de siempre.
 */
export default function WorkModeToggle() {
  const anchorRef = useRef<HTMLDivElement>(null);
  const [inWork, setInWork] = useState(false);

  useEffect(() => {
    /* El wrapper es `position: fixed` pero sigue siendo descendiente de
       `<section id="work">` en el DOM, así que `closest` lo encuentra. */
    const section = anchorRef.current?.closest("section");
    if (!section) return;

    /* Banda central del viewport (50% del medio): el toggle se ve mientras
       algo de Work está en esa franja — o sea mientras "estás mirando Work" —
       y se va apenas Work sale de ahí hacia Stack. Con `threshold: 0` a secas
       se quedaba pegado sobre el encabezado de Stack porque el borde inferior
       de Work seguía tocando el tope del viewport. */
    const io = new IntersectionObserver(
      ([entry]) => setInWork(entry.isIntersecting),
      { threshold: 0, rootMargin: "-25% 0px -25% 0px" },
    );
    io.observe(section);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={anchorRef}
      className="work-mode-toggle"
      data-visible={inWork}
      aria-hidden={!inWork}
      inert={!inWork || undefined}
    >
      <ContentModeToggle />
    </div>
  );
}
