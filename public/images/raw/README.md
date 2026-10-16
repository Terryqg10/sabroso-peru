# Imágenes originales sin procesar

Aquí van las imágenes tal cual salen de la herramienta que las genera
(Gemini, banco de imágenes, etc.).

Se ignoran por git: no se versionan. El historial no debe contener
JPG originales de varios MB.

El flujo es:

1. Poner las imágenes aquí con el nombre definitivo (ej.
   hero-ceviche-wide.jpg).
2. Ejecutar `pnpm optimize-images`.
3. El script genera versiones AVIF, WebP y JPG optimizadas en
   `public/images/`.

Las imágenes optimizadas son las que usa la web. Las de esta carpeta
son el material de trabajo.
