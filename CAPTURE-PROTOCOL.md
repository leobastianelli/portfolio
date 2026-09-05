# Protocolo de capturas para el portfolio

## Objetivo

Mostrar producto real con acabado editorial de startup. La interfaz es la evidencia; el mockup sólo le da contexto y profundidad. Nunca se reconstruye una UI con IA cuando el texto o los datos deben ser fieles.

## 1. Preparar el estado

- Usar datos demo creíbles, breves y consistentes. Nunca exponer datos personales, tokens, correos reales ni paneles internos sensibles.
- Cerrar banners, DevTools, extensiones, cursores y notificaciones.
- Elegir un estado con una acción y una jerarquía visual claras. Evitar páginas vacías, loaders y formularios cortados a mitad de scroll.
- Mantener zoom del navegador en 100% y esperar a que fuentes, imágenes y animaciones terminen de cargar.

## 2. Capturar tres vistas por proyecto

1. **Principal:** la pantalla que explica el producto en menos de dos segundos.
2. **Flujo:** la acción central en curso — formulario, análisis, compra o configuración.
3. **Resultado:** el valor entregado — confirmación, reporte, dashboard o contenido generado.

Agregar una cuarta vista sólo si muestra algo distinto: mobile, administración o una integración relevante.

## 3. Medidas de origen

- Desktop: viewport de `1600 × 1000` (16:10), DPR 2. El PNG original resultante mide `3200 × 2000`.
- Mobile: viewport de `390 × 844`, DPR 3.
- Capturar PNG sin compresión. No usar capturas reenviadas por WhatsApp, escaladas desde un documento o tomadas a una pantalla.
- Si la app no llena el viewport, centrar el contenido útil; no ampliar una zona pequeña hasta que el texto pierda nitidez.

## 4. Tratamiento visual del portfolio

- Entrega final desktop: `1600 × 1000` (16:10).
- Fondo: blanco aperlado `#fafaf9`.
- Acento exterior: violeta `#523a9e`, usado como halo suave al 12–18%; no recolorear el producto.
- Un solo marco de navegador, casi frontal. Perspectiva máxima aproximada: 2°.
- Sombra amplia y tenue; una placa translúcida detrás como máximo.
- Mantener el producto ocupando 72–84% del lienzo.
- Sin titulares, logos añadidos, blobs decorativos, teléfonos flotantes ni objetos 3D salvo que el proyecto los necesite para entenderse.

## 5. Exportación

- Conservar el PNG original en una carpeta de fuentes fuera de `public`.
- Publicar WebP con calidad 88–92, perfil sRGB y ancho de 1600 px.
- Objetivo: menos de 250 KB por portada sin degradar texto pequeño.
- Nombre: `proyecto-vista-01.webp`, `proyecto-vista-02.webp`, etc.
- Revisar la imagen al tamaño real de la card y dentro del visor ampliado.

Comando reproducible:

```bash
npm run capture -- --url https://example.com --output captures/source/proyecto/vista-01.png
```

El capturador espera las fuentes y la red, congela animaciones y exporta a DPR 2. Se pueden ajustar `--width`, `--height`, `--dpr`, `--delay`, `--locale` y `--selector`.

Para pantallas autenticadas, usar un navegador interactivo. Las credenciales se introducen únicamente en el sitio y la sesión se descarta al cerrar:

```bash
npm run capture -- --url https://example.com --output captures/source/proyecto/vista-privada.png --headed --interactive --profile captures/auth/proyecto
```

`--profile` conserva la sesión sólo dentro de `captures/`, una carpeta ignorada por Git. Nunca se publica ni se comparte.

## 6. Control de calidad

- ¿Se entiende el producto sin leer la descripción?
- ¿El foco está en una sola acción o resultado?
- ¿Todo el texto de la UI sigue siendo el texto real?
- ¿Hay información privada o accidental?
- ¿El recorte funciona tanto en 16:10 como en pantallas angostas?
- ¿La decoración acompaña al producto sin competir con él?

Si una captura original está borrosa, se vuelve a capturar. El reencuadre y el mockup pueden mejorar la presentación, pero no recuperan tipografía ni detalle que nunca estuvieron en la fuente.
