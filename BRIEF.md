# Brief — Rediseño y ampliación del portfolio

Este es el brief completo del trabajo. Leelo entero antes de tocar nada.

---

## 0. Antes de escribir código

No modifiques ningún archivo todavía. Primero:

1. Auditá el repo y decime: framework y versión, router (app o pages), sistema de estilos, dónde vive el contenido hoy (hardcodeado en componentes o en archivos de datos), dependencias que ya están instaladas, y qué hay en el historial de git.
2. Confirmame qué skills de las del punto 9 tenés disponibles.
3. Señalá qué se puede reusar y qué conviene reescribir.
4. Proponeme un plan de trabajo por etapas, con un commit por etapa, incluyendo dónde caen las revisiones del punto 9.

Recién cuando yo apruebe el plan, arrancás.

Reglas durante todo el trabajo:
- Preguntame antes de instalar cualquier dependencia nueva.
- Un commit por etapa, con mensaje descriptivo. Nunca un commit gigante al final.
- Si algo del brief choca con lo que ya existe en el repo, decímelo en vez de resolverlo por tu cuenta.

---

## 1. Qué es este sitio ahora

Hoy es un portfolio simple apuntado a clientes argentinos. Cambia a dos cosas:

- **Mi carta de presentación internacional.** Va a ser el link que mando a empresas, startups, agencias y clientes directos, dentro y fuera del país.
- **El lugar donde consolido todo lo que hago relacionado con desarrollo:** proyectos terminados, cosas en curso, experimentos, procesos y notas técnicas. Hoy eso está disperso entre repos locales, la cabeza y nada publicado.

Eso implica una sección nueva de escritura/notas, además de los proyectos.

## 2. Idioma — bilingüe desde el día uno

El sitio existe completo en **inglés y español**, y arranca en el idioma del visitante.

Requisitos:

- **Rutas localizadas**: `/en/...` y `/es/...`. Cada página tiene URL propia en cada idioma. Nada de cambiar el idioma solo en el cliente sin cambiar la URL — se rompe el compartir links y el SEO.
- **Detección en la primera visita**: se resuelve el idioma a partir del header `Accept-Language` del navegador. Español para cualquier variante `es-*`; inglés para todo lo demás.
- **La elección manual gana siempre**. Si el visitante cambia el idioma, se guarda y no se lo vuelve a pisar con la detección automática en visitas siguientes.
- **Sin loops de redirección** y sin bloquear el primer render mientras se resuelve el idioma.
- El selector de idioma lleva al equivalente exacto de la página actual, no al home.
- `<html lang>` correcto en cada página, y `hreflang` cruzado entre las dos versiones más `x-default`.
- Cero texto hardcodeado en JSX. Todo, incluidos labels de UI, mensajes de estado y metadata, sale de la capa de contenido.

Si el proyecto ya usa App Router, resolvelo con el patrón de segmento dinámico `[locale]`. Antes de instalar cualquier librería de i18n, decime cuál y por qué — para dos idiomas y contenido estático puede alcanzar con una solución propia.

## 3. Arquitectura de contenido

Sacá el contenido de los componentes. Quiero poder agregar un proyecto o una nota editando un archivo, sin tocar JSX.

Estructura acordada (revisada respecto del primer borrador del brief, ver nota
al final del punto): **una carpeta por contenido**, con los datos duros una sola
vez y un archivo de prosa por idioma.

```
content/
  projects/
    greens-club/
      meta.ts     -> slug, org, year, status, stack, links, featured, cover
      en.md       -> title, role, summary, technical
      es.md       -> title, role, summary, technical
    onefam-community-portal/
      meta.ts
      en.md
      es.md
  notes/
    <slug>/
      meta.ts     -> slug, date, tags
      en.mdx
      es.mdx
ui/
  en.json         -> labels de interfaz
  es.json
```

Un contenido = una carpeta. Agregar un proyecto es crear una carpeta; agregar un
idioma es agregar un archivo.

> **Nota sobre el cambio.** El borrador original de este punto dibujaba
> `projects/en/` y `projects/es/` con un archivo por proyecto por idioma, y dos
> párrafos más abajo pedía que `stack`, `links`, `status` y `year` vivieran una
> sola vez. Las dos cosas no son compatibles: con el árbol por idioma, los datos
> duros o se duplican o quedan arbitrariamente en uno de los dos archivos. La
> estructura de arriba cumple la intención — los datos duros no se pueden
> desincronizar porque existen una sola vez.

Cada proyecto necesita estos campos: `slug`, `title`, `role`, `org`, `year`, `status` (`live` | `building` | `archived`), `summary` (para audiencia no técnica), `technical` (para audiencia técnica), `stack` (array), `links` (array de `{label, url}`), `featured` (booleano), `cover` (imagen).

Los dos campos de descripción son a propósito — ver punto 5.

Sobre los locales:
- El `slug` es el mismo en ambos idiomas, así el selector puede saltar entre versiones equivalentes.
- Los campos que no son texto (`stack`, `links`, `status`, `year`) no se duplican: viven una sola vez y se comparten. Solo se traduce lo que es prosa.
- Si un contenido existe en un idioma y no en el otro, no rompas el build: caé al inglés y dejá un aviso en consola durante el build listando lo que falta.

## 4. Secciones

1. **Hero** — quién soy y qué hago, sin adjetivos vacíos.
2. **Selected work** — los proyectos con `featured: true`, en tarjetas grandes.
3. **Everything else** — el resto, en una grilla más compacta.
4. **Notes / Log** — la sección nueva. Posts cortos en MDX sobre lo que estoy construyendo, decisiones técnicas, experimentos. Index con listado + páginas individuales. Que funcione con dos notas y con cincuenta. Sembrala con un post de ejemplo, ya escribo yo los reales.
5. **Stack** — agrupado por área, no una nube de logos.
6. **Contact** — mail, LinkedIn, GitHub.

## 5. Elemento distintivo: el switch Overview / Technical

Un interruptor físico, fijo en la barra superior. Cambia todas las descripciones de proyecto entre el campo `summary` y el campo `technical`.

Por qué: el sitio le habla a gente muy distinta. Un fundador no técnico quiere saber qué resuelve el producto; un CTO quiere saber cómo está construido. En vez de escribir un texto tibio que no le sirve a ninguno de los dos, escribo los dos y el visitante elige.

Requisitos:
- Estado global, no por tarjeta.
- Persiste en `localStorage` entre visitas.
- Transición suave al cambiar, sin salto de layout.
- Accesible por teclado, con `aria-pressed` y label claro.

**Los dos controles de la barra superior.** Ahora conviven el switch Overview/Technical y el selector de idioma, y no pueden competir visualmente. El switch es el objeto físico: palanca, relieve, LED. El idioma es discreto — un par `EN / ES` en tipografía mono, grabado, del tamaño de un label. Uno es el elemento de personalidad de la página; el otro es utilitario y tiene que desaparecer hasta que lo necesiten. En mobile, si no entran los dos cómodos, priorizá el switch y llevá el idioma al menú o al pie.

## 6. Dirección visual

Tenés `portfolio-leo.html` en la raíz del repo como referencia visual. **No lo copies literal** — es una maqueta estática, no la arquitectura final. Tomá de ahí el sistema de diseño y traducilo a componentes.

El concepto: **paneles de equipamiento de audio**. Faceplates de amplificador, pedales, racks. Superficies con relieve, tornillos, etiquetas grabadas, LEDs de estado. Es neumorfismo, pero anclado en un objeto real en vez de ser una textura decorativa — soy músico además de desarrollador, y de ahí sale.

Tokens (llevalos a variables CSS o a la config de Tailwind, no los repitas sueltos):

```
panel        #CBC7C0    superficie base
panel-deep   #BFBAB2    superficies hundidas
highlight    #EAE7E1    luz superior izquierda
shadow       #A29C93    sombra inferior derecha
ink          #17161A    texto principal
ink-soft     #4E4A44    texto secundario
engrave      #59544C    labels grabados
accent       #523A9E    violeta
accent-glow  #7B5BD6    hover y LEDs
led-on       #2F7D4F    en producción
led-work     #B26A12    en desarrollo
led-off      #8A857D    archivado
```

Tipografías: Bricolage Grotesque (display), Instrument Sans (cuerpo), IBM Plex Mono (labels, tags, datos).

**Regla no negociable sobre el neumorfismo:** es una textura de superficie, no un sistema de contraste. El texto siempre en `ink` o `ink-soft` sobre `panel`, nunca gris-sobre-gris. Todo texto e ícono interactivo tiene que pasar WCAG AA. Si en algún punto la estética pelea con la legibilidad, gana la legibilidad — avisame y lo resolvemos.

## 7. Piso de calidad

- Responsive real desde 320px. Probá el layout en mobile, no solo en desktop.
- Foco de teclado visible en todo elemento interactivo.
- `prefers-reduced-motion` respetado: sin animaciones de entrada ni transiciones.
- Imágenes optimizadas, con `width` y `height` para que no haya layout shift.
- Metadata completa y traducida: title y description por página **y por idioma**, Open Graph e imagen de card, favicon.
- Sitemap con las dos versiones de cada página.
- Sin errores ni warnings en consola.
- Lighthouse: verde en las cuatro categorías, **medido en ambos idiomas**.

## 8. Fuera de alcance por ahora

No hagas: CMS, formulario de contacto con backend, analytics, modo oscuro, animaciones elaboradas, ni un tercer idioma. Si creés que algo de esto hace falta, decímelo y lo discutimos.

---

## Contenido de los proyectos

Los textos abajo son un borrador mío en español. Necesito **las dos versiones**:

- **Inglés**: no traduzcas literal. Escribilo como lo escribiría alguien que trabaja en producto en inglés — directo, concreto, sin marketing hueco ni calcos del español.
- **Español**: partí de mi borrador y mejoralo. Español neutro, que funcione tanto en Argentina como en España. Evitá el voseo en el contenido del sitio.

Las dos versiones tienen que decir lo mismo y tener un peso parecido. Que ninguna se lea como la traducción de la otra.

Los datos técnicos no los inventes: donde falte información, dejá un `TODO` y preguntame.

### Greens Club — featured
- org: Mully Group · rol: Developer · status: live
- Links: greensclub.ai · app.greensclub.ai
- Summary: Coaching de golf con IA. Caddie conversacional que responde durante la partida, análisis de swing por video, distancias por GPS y tienda para socios. Web app, iOS y Android.
- Technical: TODO — preguntame el stack real antes de escribir esto.

### Onefam Community Portal — featured
- org: Onefam Hostels · rol: Full-stack developer · status: building
- Summary: Programa de membresía para una cadena europea de hostels. Los huéspedes se suscriben, acumulan cashback por sus reservas y lo canjean en recepción al hacer el check-in.
- Technical: Next.js en Vercel, Supabase para usuarios, autenticación por customer ID de Stripe con alta automática, tres tiers de suscripción, ledger de cashback e integración con la API de Cloudbeds para aplicar el crédito sobre la reserva.
- Stack: Next.js, Supabase, Stripe, Cloudbeds API, Vercel

### Golf Membership Platform — featured
- org: Mully Group / NewReserve · rol: Lead developer · status: archived
- Summary: Plataforma de membresías de golf en Estados Unidos, con suscripciones recurrentes y tienda propia. Varios años a cargo del desarrollo.
- Technical: Shopify Plus headless con frontend en Next.js y Firebase, suscripciones vía Loop, pipeline de contenido SEO automatizado en n8n, integración con Impact.com para atribución de afiliados.
- Stack: Shopify Plus, Next.js, Firebase, n8n, Impact.com

### RET Enrollment System — featured
- org: Facultad de Ciencias Sociales, UNC · status: live
- Summary: Sistema de inscripciones para una facultad, usado por estudiantes, docentes y administración, con una vista distinta para cada rol.
- Technical: Next.js sobre Firebase, control de acceso por roles.
- Stack: Next.js, Firebase

### Armador de Apuntes
- status: live · rol: Proyecto propio
- Summary: Editor de PDF que corre entero en el navegador: reordenar, recortar y combinar sin subir archivos a ningún servidor.
- Stack: client-side PDF, Vercel

### Scout
- status: building · rol: Proyecto propio
- Summary: Sistema multiagente que encuentra comercios locales sin sitio web y genera una propuesta de landing para cada uno.
- Stack: agentes, automatización

### Púrpura Ceniza
- status: live · rol: Proyecto propio · link: purpuraceniza.com
- Summary: Sitio de mi banda. Diseño y desarrollo completo.

---

## 9. Skills de revisión

Tengo instaladas las skills de `awesome-ux-skills` (github.com/tommyjepsen/awesome-ux-skills) en `~/.claude/skills/`. Verificá que estén disponibles al empezar y avisame si no las encontrás.

**Usalas así:**

- `accessibility` — obligatoria. Corré una revisión completa contra WCAG 2.1 cuando el layout esté armado, y otra antes de dar el trabajo por terminado. Es la revisión más importante de este proyecto: la dirección visual es neumórfica y ese estilo falla en contraste por defecto. Quiero saber exactamente dónde falla el mío.
- `ux-heuristics-review` — una pasada sobre el sitio completo antes de cerrar. Me interesa sobre todo si el switch Overview/Technical se entiende sin explicación y si el selector de idioma se encuentra.
- `design-analysis` — opcional, solo si necesitamos comparar contra alguna referencia.

**No uses `craft` en este proyecto.** Sus reglas prohíben gradientes y glow, y el sistema de paneles depende de las dos cosas: los LEDs de estado son glow y las superficies son gradientes. La regla es razonable para interfaces planas y no aplica a esta dirección. Si ves algo de `craft` que igual valga la pena, decímelo como comentario suelto, pero no reescribas el sistema visual por eso.

**Cómo reportar las revisiones:** cuando corras una, pasame los hallazgos ordenados por severidad, separando lo que rompe una regla dura (contraste insuficiente, falta de foco visible, orden de tabulación roto) de lo que es una opinión de diseño. Lo primero se arregla; lo segundo lo decido yo.

Ninguna etapa se da por cerrada con problemas de accesibilidad pendientes.

---

## Empezá acá

Hacé la auditoría del punto 0 y proponeme el plan por etapas. No toques archivos hasta que lo aprobemos.
