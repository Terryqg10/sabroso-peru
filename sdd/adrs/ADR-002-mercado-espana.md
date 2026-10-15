---
id: ADR-002
title: El restaurante opera en España y el sitio se rige por la normativa española
status: aceptada
date: 2026-10-15
os_version: 0.1.0
relates_to: [SPEC-001, ADR-001]
---

# ADR-002 — Mercado: España

## Contexto

SPEC-001 §9 dejaba como VERIFICAR la necesidad de una política de privacidad "conforme a la normativa peruana de protección de datos personales". La investigación de competencia (`research/`) se hizo para el mercado español y el usuario ha confirmado que el restaurante opera en **España**. El mercado determina el pie legal, el tratamiento de datos, el formato de teléfono por defecto (+34) y la información de alérgenos.

## Alternativas consideradas

1. **España** — normativa de la UE y española aplicable. Pie legal obligatorio. Es el mercado de los competidores analizados.
2. **Perú** — otro régimen de datos. No encaja con el público (clientes locales y turistas en España).
3. **Sitio agnóstico, sin contenido legal** — rápido, pero incumple obligaciones de información en España. Descartada.

## Decisión

El proyecto asume **España** como jurisdicción y mercado. Efectos:

- Los textos legales (aviso legal, privacidad, cookies si las hubiera) se redactan para España. El contenido exacto es **VERIFICAR** con fuentes oficiales o un asesor; no se fija de memoria.
- El prefijo por defecto de teléfono pasa de `51` a `34` en la normalización (`src/lib/reservas/telefono.ts`). Los números del restaurante y de clientes usan formato internacional.
- La información de alérgenos de la carta se trata como obligación legal. Los datos los facilita el restaurante. VERIFICAR el requisito aplicable.
- Idioma: español, sin cambios.

## Consecuencias

Positivas:
- Alinea el sitio con el mercado analizado y con las expectativas legales.
- Elimina la ambigüedad de privacidad de SPEC-001 §9.

Negativas:
- `normalizarTelefono` y sus tests (T-001) están pensados para móviles peruanos con prefijo `51`: hay que cambiarlos. Es una tarea derivada.
- `src/config/restaurante.ts` usa un número `51…` provisional; hay que sustituirlo por el real.
- Obliga a redactar y validar textos legales antes de publicar.
- Coste de revertir: bajo mientras no haya texto legal publicado.

## Relación con la constitución

- I1: la spec se corrige por enmienda (Enmienda 1), no por edición.
- I5: la normalización de teléfono sigue validada con Zod.
- Puerta 9 (privacidad): la sección "Datos y privacidad" se actualiza.
