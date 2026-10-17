---
id: ADR-006
title: Mapa de OpenStreetMap incrustado en contacto y enlace «Cómo llegar»
status: aceptada
date: 2026-10-17
os_version: 0.1.0
relates_to: [SPEC-001-sitio-restaurante, ADR-002, T-021]
---

# ADR-006 — Mapa de OpenStreetMap incrustado en /contacto

## Contexto

SPEC-001 §9 decía que los datos no se envían a terceros desde el sitio y `restaurante.ts` documentaba
que el mapa «no se incrusta». El usuario quiere un mapa visible en «Ven a vernos» y un botón
«Cómo llegar» que abra la app de navegación. Incrustar un mapa hace que el navegador del visitante
pida recursos a un tercero (su IP y datos del navegador llegan al proveedor), así que cambia §9 y §10.

## Alternativas consideradas

1. **Solo botón «Cómo llegar», sin mapa incrustado** — máxima privacidad y cero dependencias, pero
   no cumple lo pedido (ver el mapa en la página).
2. **Mapa que carga al pulsar** — privacidad por defecto; el usuario ve el mapa tras un clic. Era la
   opción recomendada.
3. **Mapa de OpenStreetMap siempre visible** — sin clave ni coste ni cookies propias del proveedor
   conocidas; la visita envía la IP a openstreetmap.org al cargar. **Elegida por el usuario.**
4. **Google Maps incrustado** — el más reconocible, pero con cookies de Google (el sitio no tiene
   aviso de cookies) y condiciones de uso/coste a revisar. Descartada.

## Decisión

Opción 3. `/contacto` incrusta el mapa de OpenStreetMap (`openstreetmap.org/export/embed.html`) con
`loading="lazy"`, `referrerPolicy="no-referrer"`, `sandbox` mínimo y un `title` accesible. El botón
«Cómo llegar» es un enlace universal de Google Maps con las coordenadas (`maps/dir/?api=1&destination=`),
que abre la app de navegación en el móvil; solo se contacta con Google si el usuario lo pulsa.
La política de privacidad lo declara. SPEC-001 queda enmendada (Enmienda 3).

## Consecuencias

Positivas:
- Mapa y ruta a un toque, sin claves ni costes.
- Los enlaces se construyen con una función probada a partir de dos coordenadas.

Negativas:
- Cada visita a `/contacto` envía la IP del visitante a OpenStreetMap, aunque no pulse nada.
- Dependencia externa: si el servicio falla, el iframe queda vacío (el texto de la dirección y los
  enlaces siguen disponibles).
- VERIFICAR los términos de uso del embed de OpenStreetMap y la base legal con asesoramiento jurídico.
- Con la dirección ficticia, el punto es el centro de Majadahonda hasta tener la calle real.

## Relación con la constitución

No toca invariantes. Respeta I5 (sin entradas externas nuevas), I6/I7 (el iframe tiene título, no hay
movimiento) y el estilo v3 (solo tokens). Requiere actualizar «Datos y privacidad» (§9) y §10.
