---
id: ADR-005
title: Ampliar las etiquetas de la carta con vegano y sin-lactosa
status: aceptada
date: 2026-10-16
os_version: 0.1.0
relates_to: [SPEC-001-sitio-restaurante, T-012]
---

# ADR-005 — Ampliar las etiquetas de la carta con vegano y sin-lactosa

## Contexto

RF-11 de SPEC-001 lista cuatro etiquetas (vegetariano, sin gluten,
picante, para compartir). Al rellenar la carta con 22 platos reales
(T-012), aparecieron dos etiquetas que no estaban en la lista:

- `vegano`: la mazamorra morada no lleva ingredientes de origen animal.
- `sin-lactosa`: aplica a anticuchos, pollo a la brasa, seco de res,
  pachamanca y mazamorra. El enum original no lo contemplaba.

## Alternativas consideradas

1. Quitar las dos etiquetas y dejar los platos con las cuatro del
   enum. Pierde precisión: un vegano no podría filtrar correctamente.
2. Ampliar el enum con vegano y sin-lactosa, y enmendar RF-11.
3. Sustituir "vegetariano" por "vegano" en todo el modelo. Confunde:
   son categorías distintas (vegano ⊂ vegetariano).

## Decisión

Opción 2. Ampliar el enum en `src/content/carta/schema.ts` y en
`TEXTO_ETIQUETA` de `src/lib/carta/textos.ts`, y enmendar RF-11 en
SPEC-001 con las dos etiquetas nuevas.

## Consecuencias

**Positivas:**
- La carta se puede filtrar por vegano y por sin-lactosa con precisión.
- No se pierde información real de los platos.

**Negativas:**
- La spec crece (RF-11 pasa de 4 a 6 etiquetas).
- El enum vive en dos sitios (schema + textos).

## Relación con la constitución

Cambio menor de la spec. No toca invariantes ni defaults. Requiere
enmienda a la spec (registrada en SPEC-001 §12, Enmienda 2) y este ADR.
