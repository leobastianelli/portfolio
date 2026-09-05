"use client";

import { useRef } from "react";
import Image from "next/image";
import { SITE } from "@/lib/site";

/*
 * Retrato del hero — la ÚNICA superficie del sitio con profundidad real.
 * direccion-visual-v3 retiró el relieve de todo lo demás (paneles planos,
 * sin sombra ni 3D): esta card es la excepción deliberada que pidió Leo,
 * sobre la referencia "rotate-to-mouse" del JWT Handbook de Auth0.
 *
 * Mecánica igual a la referencia: el eje de giro sale del vector
 * puntero→centro y el ángulo crece con log(distancia); hay un `scale3d`
 * sutil y la sombra se agranda al pasar por encima. El "glow" de la
 * referencia (radial-gradient blanco que sigue al mouse) se mantiene pero
 * monocromo y a baja opacidad — un brillo especular, no un LED —, y sólo
 * aparece en hover. Con `prefers-reduced-motion` no se engancha nada y la
 * card queda quieta.
 *
 * El giro se escribe como transform inline en cada `pointermove` (sin
 * re-render de React) y se limpia al salir.
 */
const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function HeroPortrait() {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const boundsRef = useRef<DOMRect | null>(null);

  function handleEnter(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType === "touch" || prefersReducedMotion()) return;
    boundsRef.current = cardRef.current?.getBoundingClientRect() ?? null;
  }

  function handleMove(e: React.PointerEvent<HTMLDivElement>) {
    const bounds = boundsRef.current;
    const card = cardRef.current;
    if (!bounds || !card) return;

    const cx = e.clientX - bounds.x - bounds.width / 2;
    const cy = e.clientY - bounds.y - bounds.height / 2;
    const distance = Math.sqrt(cx * cx + cy * cy);

    card.style.transform = `scale3d(1.04, 1.04, 1.04) rotate3d(${cy / 130}, ${-cx / 130}, 0, ${Math.log(distance + 1) * 1.6}deg)`;

    const glow = glowRef.current;
    if (glow) {
      glow.style.setProperty("--gx", `${cx * 2 + bounds.width / 2}px`);
      glow.style.setProperty("--gy", `${cy * 2 + bounds.height / 2}px`);
      glow.style.opacity = "1";
    }
  }

  function handleLeave() {
    boundsRef.current = null;
    if (cardRef.current) cardRef.current.style.transform = "";
    if (glowRef.current) glowRef.current.style.opacity = "0";
  }

  return (
    <div
      className="portrait-tilt fade-up delay-2"
      onPointerEnter={handleEnter}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      <div ref={cardRef} className="portrait-tilt__card">
        <Image
          src="/leo-portrait.png"
          alt={`Retrato de ${SITE.author}`}
          fill
          preload
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 38vw, 70vw"
          className="portrait-tilt__img"
        />
        <div ref={glowRef} className="portrait-tilt__glow" aria-hidden="true" />
      </div>
    </div>
  );
}
