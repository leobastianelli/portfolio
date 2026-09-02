"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";
import { useLang } from "@/context/LanguageContext";

/*
 * "Acerca de mí" — NO repite los proyectos de Trabajo. Es el recorrido
 * laboral: dónde estuvo Leo, en qué rol, en qué período. Trabajo muestra
 * QUÉ construyó; acá el camino.
 *
 * Interacción: por defecto la columna izquierda muestra la descripción
 * general. Al pasar el puntero (o enfocar con teclado) una entrada del
 * timeline, la entrada se despliega con capturas y — en desktop — la
 * izquierda cambia a la descripción puntual de esa etapa. En mobile no hay
 * hover: la izquierda queda con el texto general y el detalle aparece
 * dentro de la propia entrada al desplegarla (tap).
 */

/* Capturas por entrada, emparejadas por `id`. Fuera del i18n a propósito
   (son locale-independientes). Si una entrada no tiene capturas, no se
   muestra nada — sin placeholder.
   TODO: sumar capturas reales de Onefam, del sitio del centro de estudiantes
   y de algún proyecto freelance cuando Leo las pase. */
const SHOTS: Record<string, string[]> = {
  onefam: [],
  "fcs-unc": ["/covers/ret-enrollment-system.webp"],
  mully: ["/covers/greens-club.webp", "/covers/golf-membership-platform.webp"],
  teems: [],
  cloudpro: [],
  freelance: [],
};

type About = ReturnType<typeof useLang>["t"]["about"];

export default function AboutMe() {
  const { t } = useLang();
  const about = t.about;
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = about.timeline.find((e) => e.id === activeId) ?? null;
  const listRef = useRef<HTMLUListElement>(null);
  /* Columna izquierda (lg:sticky): en desktop muestra el detalle de la entrada
     activa con sus enlaces. Un click ahí NO cierra el panel — si no, no se
     puede clickear ningún link del detalle. */
  const descRef = useRef<HTMLDivElement>(null);

  /* `src` de la captura ampliada (la misma tarjeta crece y se centra). */
  const [zoomSrc, setZoomSrc] = useState<string | null>(null);

  /* Click fuera del timeline: cierra la entrada abierta. Mientras hay una
     captura ampliada no toca nada — de eso se encarga su propio backdrop. */
  useEffect(() => {
    if (!activeId || zoomSrc) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (
        !listRef.current?.contains(target) &&
        !descRef.current?.contains(target)
      ) {
        setActiveId(null);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [activeId, zoomSrc]);


  return (
    <section
      id="about"
      className="px-5 md:px-6 py-9 md:py-10"
      style={{ borderTop: "1px solid var(--border)" }}
    >
      <div className="max-w-6xl mx-auto w-full">
        {/* Sin `reveal`: este bloque asoma sobre el pliegue y tiene que verse
            de entrada, no aparecer al hacer scroll. */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] gap-8 lg:gap-9 items-start">
          {/* Izquierda: título + descripción */}
          <div ref={descRef} className="lg:sticky lg:top-24">
            <p className="section-label font-mono mb-5">{about.label}</p>

            {/* Desktop: general ↔ detalle de la entrada activa */}
            <div className="hidden lg:block about-desc" key={active?.id ?? "root"}>
              {active ? (
                <>
                  <p
                    className="editorial-type"
                    style={{ fontSize: "var(--text-lg)", lineHeight: 1.7, color: "var(--color-ink)" }}
                  >
                    {active.detail}
                  </p>
                  {active.links && active.links.length > 0 && (
                    <AboutLinks links={active.links} />
                  )}
                </>
              ) : (
                <AboutIntro about={about} />
              )}
            </div>

            {/* Mobile: siempre la descripción general */}
            <div className="lg:hidden">
              <AboutIntro about={about} />
            </div>
          </div>

          {/* Derecha: timeline tipo CV, orden cronológico inverso */}
          {/* El hover funciona como un click: abre y se queda abierto. Sólo
              cambia al pasar a otra entrada; no se cierra al salir del área.
              Se puede cerrar del todo haciendo click en la entrada abierta. */}
          <ul ref={listRef} className="about-timeline">
            {about.timeline.map((entry) => {
              const open = entry.id === activeId;
              const shots = SHOTS[entry.id] ?? [];
              return (
                <li key={entry.id} className="about-timeline__item">
                  <button
                    type="button"
                    className="about-entry"
                    data-open={open}
                    aria-expanded={open}
                    onMouseEnter={() => {
                      if (!zoomSrc) setActiveId(entry.id);
                    }}
                    onFocus={() => {
                      if (!zoomSrc) setActiveId(entry.id);
                    }}
                    onClick={() => setActiveId(open ? null : entry.id)}
                  >
                    <span className="about-entry__period label-engraved">{entry.period}</span>
                    <span className="about-entry__role">{entry.role}</span>
                    <span className="about-entry__org">{entry.org}</span>
                  </button>

                  <div className="about-entry__panel" data-open={open}>
                    <div className="about-entry__panel-inner">
                      {/* Sólo mobile — en desktop el detalle vive en la
                          columna izquierda */}
                      <p
                        className="editorial-type lg:hidden"
                        style={{
                          fontSize: "var(--text-base)",
                          lineHeight: 1.7,
                          color: "var(--color-ink)",
                          marginBottom: "1rem",
                        }}
                      >
                        {entry.detail}
                      </p>
                      {entry.links && entry.links.length > 0 && (
                        <AboutLinks
                          links={entry.links}
                          className="lg:hidden"
                          style={{ marginTop: "-0.25rem", marginBottom: "1rem" }}
                        />
                      )}

                      {shots.length > 0 && (
                        <div className="about-shots">
                          {shots.map((src) => (
                            <AboutShot
                              key={src}
                              src={src}
                              alt={entry.org}
                              zoomed={zoomSrc === src}
                              onToggle={() =>
                                setZoomSrc((cur) => (cur === src ? null : src))
                              }
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/*
 * Captura de una etapa — MISMA mecánica que el retrato del hero
 * (`HeroPortrait`): tilt hacia el puntero con `rotate3d`, ángulo que crece
 * con `log(distancia)` y un `scale3d` marcado en hover. Al hacer click la
 * MISMA card (mismo nodo, mismos handlers) se fija al viewport y crece con
 * un FLIP; el tilt sigue vivo mientras está ampliada. Cierra con click en
 * la card, en el backdrop o con Esc. Con `prefers-reduced-motion` no se
 * engancha nada: la card sólo aparece centrada, sin animación.
 *
 * Mientras la card está fija, un spacer del mismo tamaño ocupa su lugar en
 * la fila para que las otras capturas no salten.
 */
function AboutShot({
  src,
  alt,
  zoomed,
  onToggle,
}: {
  src: string;
  alt: string;
  zoomed: boolean;
  onToggle: () => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLButtonElement>(null);
  /* Rect para calcular el offset puntero→card del tilt. */
  const boundsRef = useRef<DOMRect | null>(null);
  /* Rect de layout capturado en el click, antes de que React re-renderice
     (spacer, backdrop). Es el origen del FLIP en ambos sentidos. */
  const fromRectRef = useRef<DOMRect | null>(null);
  /* FLIP en curso: pausa el tilt para no pisar la animación. */
  const busyRef = useRef(false);
  const [closing, setClosing] = useState(false);

  /* Toggle que primero mide la card SIN transform (rect de layout puro) y
     recién después avisa al padre. */
  const toggle = useCallback(() => {
    const el = cardRef.current;
    if (el) {
      const prev = el.style.transform;
      el.style.transform = "";
      fromRectRef.current = el.getBoundingClientRect();
      el.style.transform = prev;
    }
    onToggle();
  }, [onToggle]);

  // --- Tilt (idéntico al retrato del hero) ---
  function applyTilt(cx: number, cy: number) {
    const card = cardRef.current;
    if (!card) return;
    const distance = Math.hypot(cx, cy);
    const angle = Math.min(Math.log(distance + 1) * (zoomed ? 1 : 1.7), zoomed ? 4.5 : 8);
    const scale = zoomed ? 1 : 1.13;
    const div = zoomed ? 240 : 90;
    card.style.transform =
      `scale3d(${scale}, ${scale}, ${scale}) rotate3d(${cy / div}, ${-cx / div}, 0, ${angle}deg)`;
  }
  function handleEnter(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType === "touch" || prefersReducedMotion() || busyRef.current) return;
    boundsRef.current = cardRef.current?.getBoundingClientRect() ?? null;
    applyTilt(0, 0);
  }
  function handleMove(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType === "touch" || busyRef.current || prefersReducedMotion()) return;
    const b = boundsRef.current;
    if (!b) return;
    applyTilt(e.clientX - b.x - b.width / 2, e.clientY - b.y - b.height / 2);
  }
  function handleLeave() {
    boundsRef.current = null;
    const card = cardRef.current;
    if (card && !busyRef.current) card.style.transform = "";
  }

  /* Esc mientras está ampliada. */
  useEffect(() => {
    if (!zoomed) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") toggle();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [zoomed, toggle]);

  /* Abrir / cerrar: FLIP sobre la MISMA card. El `data-zoomed` del wrapper
     se maneja acá a mano (no como prop de React) para poder medir el rect
     antes y después de fijar la card. */
  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const card = cardRef.current;
    if (!wrap || !card) return;
    const reduce = prefersReducedMotion();

    if (zoomed) {
      document.documentElement.classList.add("about-zoom-lock");
      const from = fromRectRef.current ?? card.getBoundingClientRect();
      wrap.dataset.zoomed = "true";
      const to = card.getBoundingClientRect();
      card.focus({ preventScroll: true });
      if (!reduce) flipTransform(card, from, to, 380, busyRef);
      return;
    }

    document.documentElement.classList.remove("about-zoom-lock");
    if (wrap.dataset.zoomed !== "true") return;
    card.style.transform = "";
    const from = fromRectRef.current ?? card.getBoundingClientRect();
    delete wrap.dataset.zoomed;
    const to = card.getBoundingClientRect();
    if (reduce) return;
    setClosing(true);
    flipTransform(card, from, to, 300, busyRef, "cubic-bezier(0.4, 0, 0.2, 1)", () => {
      setClosing(false);
      cardRef.current?.focus({ preventScroll: true });
    });
  }, [zoomed]);

  return (
    <>
      <div
        ref={wrapRef}
        className="about-shot-tilt"
        onPointerEnter={handleEnter}
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
      >
        <button
          ref={cardRef}
          type="button"
          className="about-shot"
          aria-label={alt}
          onClick={toggle}
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(min-width: 1024px) 900px, 92vw"
            style={{ objectFit: "cover" }}
          />
        </button>
      </div>

      {zoomed && (
        <div className="about-shot-tilt about-shot-tilt--spacer" aria-hidden="true" />
      )}

      {(zoomed || closing) &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="about-zoom-backdrop"
            data-closing={!zoomed}
            onClick={toggle}
          />,
          document.body
        )}
    </>
  );
}

/* FLIP: parte `el` visualmente en `from` y lo lleva a su posición real `to`
   con una transición de `ms`. Marca `busyRef` mientras corre. */
function flipTransform(
  el: HTMLElement,
  from: DOMRect,
  to: DOMRect,
  ms: number,
  busyRef: { current: boolean },
  ease = "cubic-bezier(0.22, 1, 0.36, 1)",
  onDone?: () => void,
) {
  busyRef.current = true;
  const dx = from.left - to.left;
  const dy = from.top - to.top;
  const s = to.width === 0 ? 1 : from.width / to.width;
  el.style.transformOrigin = "top left";
  el.style.transition = "none";
  el.style.transform = `translate(${dx}px, ${dy}px) scale(${s})`;
  void el.getBoundingClientRect();
  el.style.transition = `transform ${ms}ms ${ease}`;
  el.style.transform = "";
  const done = (e: TransitionEvent) => {
    if (e.propertyName !== "transform") return;
    el.removeEventListener("transitionend", done);
    el.style.transition = "";
    el.style.transformOrigin = "";
    busyRef.current = false;
    onDone?.();
  };
  el.addEventListener("transitionend", done);
}

/* Enlaces de una entrada, en línea aparte debajo del párrafo: separados por
   "·", abren en pestaña nueva, mismo tratamiento visual que el resto del sitio. */
function AboutLinks({
  links,
  className,
  style,
}: {
  links: { label: string; href: string }[];
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <p
      className={`label-engraved${className ? ` ${className}` : ""}`}
      style={{ marginTop: "1.25rem", ...style }}
    >
      {links.map((link, i) => (
        <span key={link.href}>
          {i > 0 && <span style={{ opacity: 0.4 }}> · </span>}
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent border-b border-[color-mix(in_srgb,var(--color-accent)_30%,transparent)] hover:border-[var(--color-accent)] transition-colors"
          >
            {link.label}
          </a>
        </span>
      ))}
    </p>
  );
}

function AboutIntro({ about }: { about: About }) {
  return (
    <div className="flex flex-col gap-4">
      {about.intro.map((paragraph, i) => (
        <p
          key={i}
          className="editorial-type"
          style={{
            fontSize: "var(--text-lg)",
            lineHeight: 1.7,
            color: i === 0 ? "var(--color-ink)" : "var(--color-ink-faded)",
          }}
        >
          {paragraph}
        </p>
      ))}
      <p
        className="editorial-type"
        style={{ fontSize: "var(--text-lg)", lineHeight: 1.7, color: "var(--color-ink-faded)" }}
      >
        {about.introBandPre}
        <a
          href="https://purpuraceniza.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent border-b border-[color-mix(in_srgb,var(--color-accent)_30%,transparent)] hover:border-[var(--color-accent)] transition-colors"
        >
          Púrpura Ceniza
        </a>
        {about.introBandPost}
      </p>
    </div>
  );
}
