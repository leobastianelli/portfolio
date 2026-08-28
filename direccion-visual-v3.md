# Dirección visual — v3

Este documento reemplaza a `DIRECCION-VISUAL.md` (v2) y al punto 6 del
`BRIEF.md`. Todo lo anterior sobre paneles, tornillos, relieve, grano de
fotocopia y sellos de tinta queda anulado.

La v2 no era un mal concepto: era un concepto sin referencia. Te pedí que
tradujeras un principio abstracto ("archivo, no producto") y lo convertiste
en decoración de superficie, que es lo que pasa siempre que no hay un
objeto concreto del cual partir. Este documento arregla eso: te doy
referencias reales, medibles, y tu trabajo es traducirlas — no inventar una
identidad.

---

## Qué se descubrió

Miré veinte sitios y las reacciones dejaron un patrón muy nítido.

**Rechacé todo lo minimalista**, sin excepción: Craig Mod, Frank Chimero,
macwright.com, thesephist, paco.me, Maggie Appleton, The Creative
Independent, Hort. Ocho de ocho. Esto importa muchísimo, porque **el sitio
actual pertenece a esa familia** — y explica por qué viene sonando muerto
sin importar qué le cambiemos encima.

**Me gustó lo denso y editorial.** Public Domain Review fue el que describí
con más detalle y más entusiasmo.

**Rechacé todo lo que sacrifica usabilidad**: Andy Matuschak
(antiintuitivo), Rauno (se pierde la información), Robin Rendle (buena idea
pero incómodo de usar). Quiero audacia, no fricción. Que quede claro: un
sitio difícil de leer o de navegar es un fracaso, por más lindo que sea.

---

## Referencia principal — Public Domain Review

`https://publicdomainreview.org/`

Corré `design-analysis` sobre este sitio antes de escribir código. Quiero
tokens medidos, no impresiones.

Lo que dije textualmente:

> "Me encanta la subdivisión, es como tres columnas tipo periódico. El
> trabajo de fuentes es delicioso. Impecable, da gusto mirarlo. Hay
> distintos tamaños, distintas fuentes. Cada sección tiene una estética lo
> suficientemente distinta para diferenciarse de las otras, lo
> suficientemente parecida como para no desentonar."

De ahí salen las cuatro cosas a extraer:

1. **Grilla de columnas real**, tipo publicación. No la grilla de tarjetas
   parejas que tiene el sitio ahora — columnas de ancho distinto, contenido
   que fluye entre ellas.
2. **Varias familias tipográficas usadas con intención.** No una para
   títulos y otra para cuerpo: una jerarquía real, con contrastes fuertes de
   tamaño y de estilo dentro de una misma vista.
3. **Cada sección con tratamiento propio.** Una a dos columnas, otra a tres,
   otra a ancho completo. Distintas entre sí, coherentes en conjunto. Esa
   tensión es exactamente lo que hoy falta: el sitio actual es un continuo
   parejo de principio a fin.
4. **Densidad.** Public Domain Review no tiene miedo de poner mucho
   contenido junto. El sitio actual respira demasiado y por eso se siente
   vacío.

Y esto no traiciona el concepto original: Public Domain Review **es** un
archivo. La idea de fondo sobrevive intacta; lo que cambia es la ejecución,
que pasa de "textura de papel viejo" a "publicación editorial cuidada".

---

## Referencia secundaria — Letterform Archive

`https://letterformarchive.org/`

Corré `design-analysis` también sobre este.

Lo que me atrapó fue el logo de las A que **rota con el scroll**. Y la
descripción importa más que el ejemplo:

> "Me gustó la idea de que se mueva con el scroll como si fuera una polea."

**Polea, no animación.** La diferencia es todo:

- Una animación se dispara sola cuando llegás a cierto punto y corre a su
  propio ritmo. Eso NO es lo que quiero.
- Una polea responde directo a la manivela. Girás para un lado, gira; girás
  al revés, vuelve; parás, para. Hay una relación mecánica y continua entre
  la mano y el objeto.

El scroll deja de ser navegación y pasa a ser **manipulación de un objeto
con inercia**. Y ahí conecta con la idea de fondo del sitio mucho mejor que
cualquier textura: una polea es un objeto físico, con peso y resistencia. El
visitante no consume una animación — mueve algo.

**Un solo elemento así en todo el sitio**, probablemente en el hero. Qué es
lo que gira lo decidís vos: puede ser tipografía en círculo como Letterform,
pueden ser los años de los proyectos, puede ser otra cosa. Proponé opciones
y justificá.

Requisitos: que responda al scroll de forma continua y reversible, que no
bloquee el scroll normal de la página, y que respete
`prefers-reduced-motion` (con reduced motion, estado estático, no una
versión degradada rara).

---

## Referencias de ambición, no de estilo

Estos tres no se copian — marcan el nivel de ambición:

- **Bruno Simon** (`bruno-simon.com`) — su portfolio es un juego 3D de
  manejar. "Es una de las mejores ideas que vi en mi vida. Básicamente el
  tipo dijo: voy a hacer la mejor página de portfolio de la historia."
- **Cameron's World** (`cameronsworld.net`) — collage de Geocities. "Es lo
  mejor que vi en mi vida."
- **Poolsuite** (`poolsuite.net`) — sistema operativo viejo como interfaz.

Ninguno es replicable acá: son meses de trabajo en disciplinas distintas o
productos de empresas enteras. Pero el espíritu sí aplica: **alguien decidió
hacer algo que nadie más tiene, y lo hizo hasta el final.** Ese es el listón.

---

## Paleta

Se mantiene en clave papel/archivo. Los grises fríos y el violeta de tinta
de mimeógrafo de la v2 funcionan como punto de partida — esa parte estaba
bien resuelta, incluidos los cálculos de contraste.

No hay explosión de color saturado. Si proponés un acento más fuerte para
algún momento puntual, justificalo — pero el default es la paleta actual.

---

## Lo que está descartado

- **Todo lo minimalista.** Es el problema, no la solución. Si una decisión
  hace el sitio más "limpio", "sobrio" o "que respire más", va en la
  dirección equivocada.
- Paneles, tornillos, relieve, neumorfismo.
- Grano de fotocopia global, textura de papel simulada.
- Los sellos de fecha rotados de la v2.
- El "registro corrido" en los títulos — se lee como sombra sucia, como un
  bug, no como decisión.
- Duotono violeta con tramado sobre las capturas: destruye la información.
  Las capturas de proyecto tienen que **leerse**. Si necesitan integrarse a
  la paleta, buscá un tratamiento que no las vuelva ilegibles.
- Gradientes difuminados, blobs, tarjetas con sombra suave, timelines con
  iconitos, CTA con franja oscura.
- Cualquier cosa que dificulte leer o navegar.

---

## Cómo trabajar esto

1. Corré `design-analysis` sobre las dos referencias y traeme los tokens
   medidos: tipografías reales, escalas, anchos de columna, espaciados,
   colores. Datos, no adjetivos.

2. Con esos datos, decime qué proponés para el sitio — sobre todo cómo se
   estructura la grilla editorial y qué gira con el scroll. Espero tu
   propuesta antes de que escribas código.

3. Después aplicá sobre el sitio real en `localhost:3000`, empezando por
   Work.

4. Preservá lo estructural: capa de contenido, switch Overview/Technical,
   selector de idioma, i18n, accesibilidad. El aspecto puede cambiar entero.

5. Sigue vigente todo lo demás del `BRIEF.md`: bilingüe, WCAG AA,
   responsive desde 320px, el piso de calidad de la etapa 8.

---

## Nota sobre las tres direcciones anteriores

Fallaron por la misma razón: partiste de un principio abstracto y lo
tradujiste a detalles de superficie (bordes, sombras, texturas, sellos)
sobre la misma estructura de siempre. La estructura es el problema.

Esta vez el material es concreto y medible. Traducí las referencias — no
inventes una identidad desde cero, que es justo lo que no funciona.

Y si dudás entre una decisión segura y una arriesgada, tomá la arriesgada.
Un sitio tibio ya lo tenemos.
