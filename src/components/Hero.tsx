"use client";

import { useLang } from "@/context/LanguageContext";
import { SITE } from "@/lib/site";
import { analytics } from "@/lib/analytics";
import HeroPortrait from "@/components/HeroPortrait";

export default function Hero() {
  const { t } = useLang();
  const [firstName, ...rest] = SITE.author.split(" ");
  const lastName = rest.join(" ");

  return (
    /*
     * De lg para arriba el hero entra en el viewport sin altura fija: el alto
     * lo define el contenido y las medidas clave (padding, tamaño del nombre)
     * están ligadas a `dvh`, así que el conjunto — nombre + intro + retrato +
     * ficha — se achica solo en pantallas bajas y no se pasa de alto.
     * `overflow-hidden` es el cinturón por si una fuente entra tarde.
     *
     * La ficha técnica ya no es la fila-zócalo del pie: vive en la columna del
     * texto, debajo del intro, y se estira (`self-stretch` + `flex-1`) hasta
     * el pie del retrato.
     *
     * La bio / "Acerca de mí" ya NO vive acá: se fue a su propio bloque
     * (interactivo, tipo CV con hover). En mobile el hero se apila y fluye
     * como siempre.
     */
    <section
      id="hero"
      className="relative px-5 md:px-6 pt-4 pb-7 md:pt-9 md:pb-9 lg:overflow-hidden lg:pt-[clamp(1.5rem,4dvh,4.5rem)] lg:pb-[clamp(1.5rem,4dvh,2.5rem)]"
    >
      <div className="max-w-6xl mx-auto w-full lg:flex lg:flex-col lg:h-full lg:min-h-0">
        {/* Ubicación — arriba de todo, chica y tenue. Atenuada por alfa en el
            color, NO por `opacity`: `.fade-up` anima opacity 0→1 con fill-mode
            both y su keyframe final pisa cualquier `opacity` inline. */}
        <div className="fade-up">
          <span
            className="section-label font-mono"
            style={{
              fontSize: "var(--text-2xs)",
              color: "color-mix(in srgb, var(--color-ink) 65%, transparent)",
            }}
          >
            {t.hero.labelCity}
          </span>
        </div>

        {/* Label row — rol */}
        <div className="fade-up mb-3 lg:mb-[clamp(0.5rem,1.5dvh,1rem)] font-mono">
          <span className="section-label">{t.hero.labelRole}</span>
        </div>

        {/* Cada pieza ocupa un área propia del grid. Así el retrato puede vivir
            junto a la introducción en mobile y pasar a la columna derecha,
            alineado al nombre, desde lg. */}
        {/* Sin `mb` propio: es el último bloque de la sección, así que el
            aire de abajo lo pone el `pb` de la sección y no dos fuentes
            sumadas (en mobile eran 64px de margen + 64px de padding). */}
        <div className="hero-grid grid grid-cols-[minmax(0,1fr)_clamp(6rem,28vw,7rem)] sm:grid-cols-1 lg:grid-cols-[minmax(0,1fr)_clamp(280px,27vw,320px)] lg:gap-x-8 items-start">
            {/* Display name — one h1, styled as two lines (R-A: two <h1>s
                read as two top-level headings to a screen reader; this is
                one name). */}
            <h1
              className="hero-name font-display lg:col-start-1 lg:row-start-1"
              style={{
                /* Ligado a la ALTURA del viewport (dvh) además del ancho:
                   así se achica solo en pantallas bajas y el hero entra. */
                fontSize: "var(--text-display)",
                lineHeight: 0.6,
                letterSpacing: "-0.08em",
                fontWeight: 900,
                textTransform: "uppercase",
                /* Compensa el side-bearing izquierdo del glifo a este
                   tamaño: con la caja alineada al label de arriba, el
                   display se ve igual metido hacia adentro. */
                marginLeft: "-0.05em",
              }}
            >
              <span
                className="fade-up delay-1 block"
                style={{
                  marginBottom: "0.15em",
                  /* Negro atenuado por alfa en el color, NO por `opacity`:
                     el `.fade-up` anima opacity 0→1 con fill-mode both, así
                     que su keyframe final pisa cualquier `opacity` inline. */
                  color: "color-mix(in srgb, var(--color-accent-ink) 78%, transparent)",
                }}
              >
                {firstName}
              </span>
              <span
                className="fade-up delay-2 block"
                style={{ marginBottom: "clamp(1rem, 3dvh, 2.25rem)", color: "var(--color-accent-ink)" }}
              >
                {lastName}
              </span>
            </h1>

            {/* Las dos líneas mantienen la misma jerarquía del intro. En
                mobile se separan como áreas de grid para que la segunda pueda
                compartir el ancho con el retrato. */}
            <p
              className="hero-intro-primary fade-up delay-3 editorial-type lg:col-start-1 lg:row-start-2"
              style={{ maxWidth: "540px", fontSize: "var(--text-lead)", lineHeight: 1.4, fontWeight: 700, color: "var(--color-ink)" }}
            >
              {t.hero.intro}
            </p>
            <p
              className="hero-intro-secondary fade-up delay-3 editorial-type sm:mt-1 lg:col-start-1 lg:row-start-3"
              style={{ maxWidth: "540px", fontSize: "var(--text-lead-sm)", lineHeight: 1.4, fontWeight: 400, color: "var(--color-ink)" }}
            >
              {t.hero.introSecondary}
            </p>

            {/* Mobile/tablet reciben los hijos como piezas del grid. En
                desktop el contacto se superpone dentro del retrato. */}
            <div className="hero-media contents lg:col-start-2 lg:row-start-1 lg:row-span-4 lg:block">
              <div className="hero-portrait fade-up delay-2 w-full justify-self-center sm:mt-5 sm:justify-self-end sm:max-w-[clamp(180px,22vw,220px)] lg:mt-0 lg:max-w-none">
                <HeroPortrait
                  footer={(
                    <div className="portrait-tilt__footer">
                      <p className="hero-availability font-body">
                        <span className="hero-availability__dot" aria-hidden="true" />
                        {t.hero.availability}
                      </p>
                      <a
                        href={`mailto:${SITE.email}`}
                        className="cta-btn no-underline"
                        onClick={() => analytics.heroCtaClick(t.hero.cta)}
                      >
                        {t.hero.cta}
                      </a>
                    </div>
                  )}
                />
              </div>

              <div className="hero-actions fade-up delay-4 mt-5 flex flex-col items-start gap-4 sm:flex-row sm:items-center lg:hidden">
                <p className="hero-availability font-body">
                  <span className="hero-availability__dot" aria-hidden="true" />
                  {t.hero.availability}
                </p>
                <a
                  href={`mailto:${SITE.email}`}
                  className="cta-btn no-underline"
                  onClick={() => analytics.heroCtaClick(t.hero.cta)}
                >
                  {t.hero.cta}
                </a>
              </div>
            </div>

            {/* Ficha técnica — dl de etiqueta/valor. Vive debajo del intro, en
                la columna del texto. Las filas fluyen con su propio alto (el
                aire lo da `--spacing`, no un `justify-between` que las
                estiraba hasta el pie del retrato y abría huecos enormes entre
                una y otra). Etiqueta en mono/versales/tenue a la izquierda;
                valor en el peso del cuerpo, alineado a la derecha. Raya fina
                entre filas cruzando el ancho de la columna de texto. */}
            <dl
              className="hero-facts fade-up delay-3 mt-6 lg:mt-7 flex flex-col lg:col-start-1 lg:row-start-4"
              style={{ maxWidth: "460px" }}
            >
              {t.hero.table.map((row, i) => (
                <div
                  key={row.label}
                  className="flex items-baseline justify-between gap-3 sm:gap-6 py-3"
                  style={{
                    borderTop: i === 0 ? undefined : "1px solid var(--border)",
                  }}
                >
                  <dt
                    className="label-engraved shrink-0"
                    style={{ fontSize: "var(--text-2xs)" }}
                  >
                    {row.label}
                  </dt>
                  <dd
                    className="font-body text-ink text-right"
                    style={{ fontSize: "var(--text-sm)", lineHeight: 1.45 }}
                  >
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
        </div>
      </div>
    </section>
  );
}
