"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
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
     activa pasa a "Qué hice en {org}", con el nombre un punto más pesado.
     Excepciones (por `id`, como las pidió Leo): Onefam en presente ("Qué hago
     en …"), Freelance con "como freelance" en vez del nombre de la organización. */
  const headingParts = !active
    ? null
    : active.id === "freelance"
      ? { pre: about.activeLabel.as, name: about.activeLabel.freelanceName }
      : {
          pre: active.id === "onefam" ? about.activeLabel.present : about.activeLabel.past,
          name: active.shortOrg ?? active.org,
        };

  const listRef = useRef<HTMLUListElement>(null);
  /* Columna izquierda (lg:sticky): en desktop muestra el detalle de la
     entrada activa con sus enlaces. Un click ahí NO cierra el panel — si no,
     no se puede clickear ningún link del detalle. */
  const descRef = useRef<HTMLDivElement>(null);
  /* El bloque de detalle en sí (dentro de `descRef`), para poder ubicar sus
     `<a>` cuando hace falta redirigir el foco — ver los dos `onKeyDown` de
     Tab más abajo. */
  const desktopDetailRef = useRef<HTMLDivElement>(null);
  /* Botones de cada entrada, para poder devolver el foco al cerrar con Esc. */
  const entryButtonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  /* Id de la entrada que quedó abierta por `onFocus` (auto-open al tabular),
     no por un click/Enter explícito. Sirve para que la PRIMERA activación
     por teclado sobre esa entrada (Enter/Espacio, que dispara el mismo
     `onClick`) no la cierre de nuevo — sin esto, tabular hasta una entrada
     la abre automáticamente y el primer Enter la cerraba en el acto. */
  const openedByFocusRef = useRef<string | null>(null);

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

  /* Escape cierra la entrada activa y devuelve el foco a su botón (por si el
     foco había avanzado a un link dentro del detalle). */
  useEffect(() => {
    if (!activeId) return;
    const closingId = activeId;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setActiveId(null);
      openedByFocusRef.current = null;
      entryButtonRefs.current.get(closingId)?.focus();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [activeId]);

  return (
    <section
      id="about"
      className="site-section px-5 md:px-6"
    >
      <div className="max-w-6xl mx-auto w-full">
        {/* Sin `reveal`: este bloque asoma sobre el pliegue y tiene que verse
            de entrada, no aparecer al hacer scroll. */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] gap-8 lg:gap-9 items-start">
          {/* Izquierda: título + descripción */}
          <div ref={descRef} className="lg:sticky lg:top-24">
            {/* Sin `key` acá: el texto cambia en el lugar. Un `key` igual al
                del `<div>` de abajo daba dos hermanos con la misma key y React
                dejaba nodos huérfanos (un rótulo viejo por cada etapa tocada). */}
            <h2 className="section-label font-mono mb-5">
              {headingParts ? (
                <>
                  {headingParts.pre}{" "}
                  <span style={{ fontWeight: 700 }}>{headingParts.name}</span>
                </>
              ) : (
                about.label
              )}
            </h2>

            {/* Desktop: general ↔ detalle de la entrada activa. `aria-live`
                anuncia el cambio a lectores de pantalla: el trigger (la
                entrada del timeline) y este contenido no son adyacentes en
                el DOM, así que sin esto un usuario que llega por foco/hover
                no se entera de que cambió texto en otra columna. El `key`
                (y la clase `about-desc` que dispara el fade-in por CSS) van
                en el `<div>` interno, no en el que lleva `aria-live` — si el
                contenedor con `aria-live` tuviera el `key`, React lo
                destruiría y recrearía en cada cambio en vez de mutar su
                contenido, y eso rompe el anuncio (las live regions
                necesitan que el contenedor persista, no que se recree). */}
            <div
              ref={desktopDetailRef}
              className="hidden lg:block"
              aria-live="polite"
              aria-atomic="true"
              onKeyDown={(event) => {
                // La columna izquierda va ANTES que el timeline en el DOM,
                // así que sus links quedan fuera del paso natural de Tab
                // hacia adelante (R-A del bloque de foco, etapa 8). Cuando
                // el usuario llega al ÚLTIMO link de la entrada activa,
                // redirigimos el Tab a la siguiente entrada del timeline en
                // vez de dejar que el navegador caiga al principio de la
                // lista (`<ul>` viene después en el DOM, así que sin esto
                // el foco volvería a la primera entrada).
                if (event.key !== "Tab" || event.shiftKey) return;
                const links = Array.from(desktopDetailRef.current?.querySelectorAll("a") ?? []);
                if (links.length === 0 || event.target !== links[links.length - 1]) return;

                event.preventDefault();
                const idx = about.timeline.findIndex((entry) => entry.id === activeId);
                const nextEntry = idx >= 0 ? about.timeline[idx + 1] : undefined;
                if (nextEntry) {
                  entryButtonRefs.current.get(nextEntry.id)?.focus();
                  return;
                }
                // Última entrada de la lista: no hay "siguiente" a la que
                // saltar, así que escapamos directo al primer elemento
                // enfocable de la próxima sección en vez de caer al
                // principio del timeline. `SectionContentModeToggle` (el
                // primer candidato por posición en el DOM) es `inert`
                // salvo que Work ya esté a mitad de viewport — filtramos
                // por eso en vez de tomar el primer match a ciegas.
                const candidates = Array.from(
                  document
                    .querySelector("#work")
                    ?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])') ?? []
                );
                const nextFocusable = candidates.find(
                  (el) => el.getClientRects().length > 0 && !el.closest("[inert]")
                );
                nextFocusable?.focus();
              }}
            >
              <div className="about-desc" key={active?.id ?? "root"}>
                {active ? (
                  <>
                    <p
                      className="editorial-type"
                      style={{ fontSize: "var(--text-lg)", lineHeight: 1.7, color: "var(--color-ink)" }}
                    >
                      <DetailWithProjectLinks text={active.detail} links={active.projectLinks} />
                    </p>
                    {active.links && active.links.length > 0 && (
                      <AboutLinks links={active.links} />
                    )}
                  </>
                ) : (
                  <AboutIntro about={about} />
                )}
              </div>
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
                    ref={(el) => {
                      if (el) entryButtonRefs.current.set(entry.id, el);
                      else entryButtonRefs.current.delete(entry.id);
                    }}
                    type="button"
                    className="about-entry"
                    data-open={open}
                    aria-expanded={open}
                    onMouseEnter={() => {
                      if (window.matchMedia("(min-width: 1024px) and (hover: hover)").matches) setActiveId(entry.id);
                    }}
                    onFocus={(event) => {
                      if (event.currentTarget.matches(":focus-visible") && window.matchMedia("(min-width: 1024px)").matches) {
                        openedByFocusRef.current = entry.id;
                        setActiveId(entry.id);
                      }
                    }}
                    onClick={() => {
                      // Si esta entrada se abrió sola por foco (tabular hasta
                      // ella), la primera activación por click/Enter/Espacio
                      // solo confirma que quede abierta — recién la próxima
                      // la cierra. Así Enter nunca cierra lo que el propio
                      // Tab acaba de mostrar.
                      if (openedByFocusRef.current === entry.id) {
                        openedByFocusRef.current = null;
                        setActiveId(entry.id);
                        return;
                      }
                      setActiveId(open ? null : entry.id);
                    }}
                    onKeyDown={(event) => {
                      // Entrada abierta con links propios: el próximo Tab
                      // hacia adelante entra al primer link de la columna
                      // izquierda en vez de saltar directo a la siguiente
                      // entrada (que es donde caería por DOM sin esto).
                      if (event.key !== "Tab" || event.shiftKey || !open) return;
                      const firstLink = desktopDetailRef.current?.querySelector("a");
                      if (!firstLink) return;
                      event.preventDefault();
                      firstLink.focus();
                    }}
                  >
                    <span className="about-entry__period label-engraved">{entry.period}</span>
                    <span className="about-entry__role">{entry.role}</span>
                    <span className="about-entry__org">{entry.org}</span>
                  </button>

                  {/* Sólo mobile — en desktop el detalle vive en la columna
                      izquierda */}
                  <div className="about-entry__panel lg:hidden" data-open={open} aria-hidden={!open} inert={!open || undefined}>
                    <div className="about-entry__panel-inner">
                      <p
                        className="editorial-type"
                        style={{
                          fontSize: "var(--text-base)",
                          lineHeight: 1.7,
                          color: "var(--color-ink)",
                        }}
                      >
                        <DetailWithProjectLinks text={entry.detail} links={entry.projectLinks} />
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

function DetailWithProjectLinks({
  text,
  links = [],
}: {
  text: string;
  links?: { label: string; href: string }[];
}) {
  const matches = links
    .map((link) => ({ ...link, index: text.indexOf(link.label) }))
    .filter((link) => link.index >= 0)
    .sort((a, b) => a.index - b.index);

  if (matches.length === 0) return text;

  const parts: ReactNode[] = [];
  let cursor = 0;
  matches.forEach((link) => {
    parts.push(text.slice(cursor, link.index));
    parts.push(
      <a
        key={`${link.href}-${link.index}`}
        href={link.href}
        className="text-accent hover:opacity-70 transition-opacity"
      >
        {link.label}
      </a>
    );
    cursor = link.index + link.label.length;
  });
  parts.push(text.slice(cursor));

  return <>{parts}</>;
}

/* Enlaces externos de una entrada, en línea aparte debajo del párrafo:
   separados por "·" y abiertos en una pestaña nueva. */
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
          href="#project-purpura-ceniza"
          className="text-accent hover:opacity-70 transition-opacity"
        >
          Púrpura Ceniza
        </a>
        {about.introBandPost}
      </p>
    </div>
  );
}
