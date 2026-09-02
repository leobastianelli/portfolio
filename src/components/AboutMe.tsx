"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useLang } from "@/context/LanguageContext";

/*
 * "Acerca de mí" — el recorrido laboral: dónde estuvo Leo, en qué rol, en
 * qué período y con qué alcance. NO vuelve a describir qué se construyó
 * proyecto por proyecto — eso vive en "Proyectos & Colaboraciones" con más
 * espacio y mejores fotos.
 *
 * Interacción: por defecto la columna izquierda muestra la descripción
 * general. Al pasar el puntero (o enfocar con teclado) una entrada del
 * timeline, la izquierda cambia a la descripción puntual de esa etapa. En
 * mobile no hay hover: la izquierda queda con el texto general y el detalle
 * aparece dentro de la propia entrada al desplegarla (tap). Sin capturas ni
 * tilt/zoom — la obra y las fotos son de Work.
 */

type About = ReturnType<typeof useLang>["t"]["about"];

export default function AboutMe() {
  const { t } = useLang();
  const about = t.about;
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = about.timeline.find((e) => e.id === activeId) ?? null;

  /* Rótulo de la columna izquierda: por defecto "Acerca de mí"; con una etapa
     activa pasa a "Qué hice en {org}". Excepciones (por `id`, como las pidió
     Leo): Onefam en presente ("Qué hago en …"), Freelance con "como
     freelance" en vez del nombre de la organización. */
  const heading = !active
    ? about.label
    : active.id === "freelance"
      ? about.activeLabel.freelance
      : `${active.id === "onefam" ? about.activeLabel.present : about.activeLabel.past} ${active.org}`;

  const listRef = useRef<HTMLUListElement>(null);
  /* Columna izquierda (lg:sticky): en desktop muestra el detalle de la
     entrada activa con sus enlaces. Un click ahí NO cierra el panel — si no,
     no se puede clickear ningún link del detalle. */
  const descRef = useRef<HTMLDivElement>(null);

  /* Click fuera del timeline: cierra la entrada abierta. */
  useEffect(() => {
    if (!activeId) return;
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
  }, [activeId]);

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
            <p
              key={active?.id ?? "root"}
              className="section-label font-mono mb-5 about-desc"
            >
              {heading}
            </p>

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

          {/* Derecha: timeline tipo CV, orden cronológico inverso. El hover
              funciona como un click: abre y se queda abierto. Sólo cambia al
              pasar a otra entrada; se cierra del todo haciendo click en la
              entrada abierta o fuera del timeline. */}
          <ul ref={listRef} className="about-timeline">
            {about.timeline.map((entry) => {
              const open = entry.id === activeId;
              return (
                <li key={entry.id} className="about-timeline__item">
                  <button
                    type="button"
                    className="about-entry"
                    data-open={open}
                    aria-expanded={open}
                    onMouseEnter={() => setActiveId(entry.id)}
                    onFocus={() => setActiveId(entry.id)}
                    onClick={() => setActiveId(open ? null : entry.id)}
                  >
                    <span className="about-entry__period label-engraved">{entry.period}</span>
                    <span className="about-entry__role">{entry.role}</span>
                    <span className="about-entry__org">{entry.org}</span>
                  </button>

                  {/* Sólo mobile — en desktop el detalle vive en la columna
                      izquierda */}
                  <div className="about-entry__panel lg:hidden" data-open={open}>
                    <div className="about-entry__panel-inner">
                      <p
                        className="editorial-type"
                        style={{
                          fontSize: "var(--text-base)",
                          lineHeight: 1.7,
                          color: "var(--color-ink)",
                        }}
                      >
                        {entry.detail}
                      </p>
                      {entry.links && entry.links.length > 0 && (
                        <AboutLinks links={entry.links} style={{ marginTop: "0.75rem" }} />
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
