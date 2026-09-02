"use client";

import { useLang } from "@/context/LanguageContext";
import { SITE } from "@/lib/site";
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
      className="relative px-5 md:px-6 pt-9 pb-8 md:pb-9 lg:overflow-hidden lg:pt-[clamp(1.5rem,4dvh,4.5rem)] lg:pb-[clamp(1.5rem,4dvh,2.5rem)]"
    >
      <div className="max-w-6xl mx-auto w-full lg:flex lg:flex-col lg:h-full lg:min-h-0">
        {/* Ubicación — arriba de todo, chica y tenue. Atenuada por alfa en el
            color, NO por `opacity`: `.fade-up` anima opacity 0→1 con fill-mode
            both y su keyframe final pisa cualquier `opacity` inline. */}
        <div className="fade-up mb-1">
          <span
            className="section-label font-mono"
            style={{
              fontSize: "var(--text-2xs)",
              color: "color-mix(in srgb, var(--color-ink) 40%, transparent)",
            }}
          >
            {t.hero.labelCity}
          </span>
        </div>

        {/* Label row — rol */}
        <div className="fade-up mb-5 lg:mb-[clamp(0.75rem,2.5dvh,1.5rem)] font-mono">
          <span className="section-label">{t.hero.labelRole}</span>
        </div>

        {/* Bloque a dos columnas DESDE el nombre: a la izquierda nombre +
            intro; a la derecha el retrato inclinable, alineado al tope del
            h1 (`items-start`). Dos columnas desde lg — abajo de eso se apila
            y el retrato cae después de la intro. El CTA "Escribime" se sacó
            (el contacto vive en el menú). */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(300px,400px)] gap-7 lg:gap-8 items-start mb-8 lg:mb-0">
          <div className="lg:self-stretch lg:flex lg:flex-col">
            {/* Display name — one h1, styled as two lines (R-A: two <h1>s
                read as two top-level headings to a screen reader; this is
                one name). */}
            <h1
              className="font-display"
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
                  color: "color-mix(in srgb, var(--color-ink) 55%, transparent)",
                }}
              >
                {firstName}
              </span>
              <span
                className="fade-up delay-2 block"
                style={{ marginBottom: "clamp(1rem, 3dvh, 2.25rem)", color: "var(--color-ink)" }}
              >
                {lastName}
              </span>
            </h1>

            {/* Intro */}
            <div
              className="fade-up delay-3 flex flex-col gap-1"
              style={{ maxWidth: "540px" }}
            >
              {/* Los dos renglones son el mismo párrafo: mismo tamaño y mismo
                  color. La única distinción es el peso — el primero en negrita,
                  el segundo en 400. */}
              <p
                className="editorial-type"
                style={{ fontSize: "var(--text-lead)", lineHeight: 1.4, fontWeight: 700, color: "var(--color-ink)" }}
              >
                {t.hero.intro}
              </p>
              <p
                className="editorial-type"
                style={{ fontSize: "var(--text-lead-sm)", lineHeight: 1.4, fontWeight: 400, color: "var(--color-ink)" }}
              >
                {t.hero.introSecondary}
              </p>
            </div>

            {/* Ficha técnica — dl de etiqueta/valor. Vive debajo del intro, en
                la columna del texto. Las filas fluyen con su propio alto (el
                aire lo da `--spacing`, no un `justify-between` que las
                estiraba hasta el pie del retrato y abría huecos enormes entre
                una y otra). Etiqueta en mono/versales/tenue a la izquierda;
                valor en el peso del cuerpo, alineado a la derecha. Raya fina
                entre filas cruzando el ancho de la columna de texto. */}
            <dl
              className="fade-up delay-3 mt-6 lg:mt-7 flex flex-col"
              style={{ maxWidth: "460px" }}
            >
              {t.hero.table.map((row, i) => (
                <div
                  key={row.label}
                  className="flex items-baseline justify-between gap-6 py-3"
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

          {/* Columna derecha — retrato, alineado al tope del nombre. En lg+ el
              ancho (y por lo tanto el alto 3:4) sigue a la altura del
              viewport para no pasarse. */}
          <div className="justify-self-center lg:justify-self-end w-full max-w-[340px] sm:max-w-[400px] lg:max-w-[clamp(240px,46dvh,400px)]">
            <HeroPortrait />
          </div>
        </div>
      </div>
    </section>
  );
}
