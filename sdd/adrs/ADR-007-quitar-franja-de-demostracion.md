---
id: ADR-007
title: Quitar la franja de aviso de demostración y mantener el noindex
status: aceptada
date: 2026-10-17
os_version: 0.1.0
relates_to: [SPEC-001-sitio-restaurante, T-030]
---

# ADR-007 — Quitar la franja de aviso de demostración

## Contexto

Todas las páginas mostraban arriba una franja «Proyecto de demostración: todo es ficticio.»
(`AvisoDemo`, activada con `restaurante.demo`). La misma bandera bloquea la indexación (`noindex` y
`robots.txt`) y añade «Proyecto de demostración.» al pie. El usuario pidió quitar la franja. Los datos
siguen siendo ficticios (dirección, teléfono, razón social y NIF pendientes).

## Alternativas consideradas

1. **Poner `demo: false`** — quita la franja, pero también el `noindex` y el bloqueo de `robots.txt`: un
   sitio con datos ficticios quedaría indexable. Descartada.
2. **Quitar solo la franja y mantener `demo`** — la indexación sigue bloqueada y el pie sigue avisando.
3. **Dejar la franja** — contra lo pedido.

## Decisión

Opción 2. Se elimina el componente `AvisoDemo` y su uso en el layout. `restaurante.demo` conserva `noindex`,
`robots.txt` y la frase del pie. Los tests de `demo.spec.ts` dejan de exigir la franja y comprueban que no
está, que el `noindex` se mantiene y que `robots.txt` bloquea el sitio. README actualizado. La spec no
mencionaba la franja, así que no requiere enmienda.

## Consecuencias

Positivas:
- Interfaz más limpia; el sitio sigue sin indexarse mientras sea una demostración.

Negativas:
- Un visitante que llegue por un enlace directo ya no ve el aviso de arriba: solo la frase del pie. Puede
  llamar al teléfono ficticio o fiarse de la dirección. Hay que quitar `demo` y sustituir los datos antes de
  publicar de verdad (README, «Poner `demo: false`»).

## Relación con la constitución

No toca invariantes. Es un cambio de test justificado por este ADR (regla de calidad: no alterar tests sin ADR).
