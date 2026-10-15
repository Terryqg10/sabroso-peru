---
id: ADR-004
title: Las reseñas se muestran como citas reales estáticas con fuente y fecha
status: aceptada
date: 2026-10-15
os_version: 0.1.0
relates_to: [SPEC-001]
---

# ADR-004 — Reseñas en la web

## Contexto

Solo 1 de 4 competidores verificados muestra reseñas en su propia web (Ceviche 103, con widget de Trustindex). Es una oportunidad de prueba social. La spec no prevé reseñas y descarta APIs de pago y backend propio.

## Alternativas consideradas

1. **Citas reales estáticas** — texto copiado con permiso, con fuente, fecha y enlace, guardado en un archivo de contenido. Sin scripts externos, sin coste. Requiere mantenimiento manual.
2. **Widget de terceros** (Trustindex u otro) — se actualiza solo, pero añade script externo, posible cuota, impacto en rendimiento y cookies o transferencias de datos que habría que revisar.
3. **API de Google Places** — datos automáticos, pero API de pago con claves y topes de coste obligatorios (`docs/costs.md`).
4. **Solo enlace a la ficha de Google** — sin citas en la web.
5. **No mostrar reseñas.**

## Decisión

Opción 1. Las reseñas se guardan como contenido tipado (esquema Zod con texto, autor o inicial, fuente, fecha y URL). Reglas:

- Solo citas reales, copiadas con permiso o de fuentes públicas citadas. **Nunca inventadas** ni modificadas.
- Si todavía no hay citas, la sección muestra únicamente el enlace a la ficha de Google, o se omite.
- No se muestran valoraciones agregadas inventadas. Una nota agregada solo se publica si se cita fuente y fecha.

## Consecuencias

Positivas:
- Sin dependencias, coste ni scripts externos. Mejor rendimiento y privacidad.
- Contenido auditable y accesible.

Negativas:
- Mantenimiento manual: las citas pueden quedar obsoletas.
- Hay que obtener permiso o respetar los términos de cada fuente (VERIFICAR).
- Coste de revertir: bajo; cambiar a widget o API exigiría un ADR nuevo.

## Relación con la constitución

- I5: las citas se validan con Zod en el límite del contenido.
- I9: queda trazado a RF-12 y CA-15.
- Puerta 9: no se tratan datos personales nuevos más allá del nombre público de quien reseña, y solo con permiso.
