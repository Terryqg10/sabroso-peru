---
id: ADR-001
title: Excepción temporal de audit para braces (sin parche disponible)
status: aceptada
date: 2026-10-15
os_version: 0.1.0
relates_to: [T-001]
---

# ADR-001 — Excepción temporal de audit para braces

## Contexto

`pnpm audit --audit-level=high` devuelve un hallazgo alto: GHSA-vfj7-8cjw-p6xm, denegación de servicio por agotamiento de pila en `braces` con patrones muy anidados.

- Versión afectada: `<=3.0.3`. Versión parcheada: ninguna (el aviso indica `<0.0.0`).
- Ruta: `eslint-config-next@16.4.0` → `@next/eslint-plugin-next@16.4.0` → `fast-glob@3.3.1` → `micromatch@4.0.8` → `braces@3.0.3`.
- Es una dependencia **solo de desarrollo** (lint). No se incluye en el build de producción ni se ejecuta en el sitio publicado.
- Antes de este ADR, T-001 actualizó `vitest` (2.1.9 → 5.0.5), `vite` (→ 8.3.4) y `@vitejs/plugin-react` (4.7.0 → 6.1.2). Con eso desaparecieron los 2 hallazgos críticos de `tinypool` y el alto de `vite`.

## Alternativas consideradas

1. **Esperar y no hacer nada** — rompe el cierre de tareas y la CI de audit.
2. **`pnpm.overrides` a otra versión de `braces`** — no existe versión parcheada, así que no resuelve.
3. **Quitar `eslint-config-next`** — pierde las reglas de Next.js. Cambio de más alcance que esta tarea.
4. **Excepción temporal documentada, con mitigación y caducidad** — elegida.

## Decisión

Se acepta el hallazgo de `braces` hasta el **2026-11-15** (30 días).

- La excepción es solo para GHSA-vfj7-8cjw-p6xm. El resto de hallazgos altos o críticos siguen bloqueando.
- No se usa `pnpm audit --ignore`. El audit sigue fallando en local y en CI hasta que se actualice la dependencia. Este ADR documenta por qué se cierra la tarea con esa salida.
- Revisión: antes de la caducidad, ejecutar `pnpm update eslint-config-next` y `pnpm audit --audit-level=high`. Si aparece un parche, se actualiza y este ADR pasa a `reemplazada`.

## Consecuencias

Positivas:
- Se desbloquea el cierre de T-001 sin cambiar el linter.
- El resto del árbol de dependencias queda sin hallazgos altos ni críticos.

Negativas:
- `pnpm audit --audit-level=high` sigue devolviendo código de salida 1 mientras la excepción esté vigente. La CI bloqueante, si se configura, necesita tratar este ID de forma explícita.
- Mitigación del riesgo residual: `braces` solo se invoca sobre patrones glob del propio repo durante `eslint .`, no sobre entrada externa. El impacto máximo sería un fallo local del linter.
- Hay un hallazgo moderado de `esbuild` (GHSA-67mh-4wv8-2f99, servidor de desarrollo). No bloquea el nivel `high`. Se revisa en la misma fecha.

## Relación con la constitución

- Respeta I8 y las puertas 1-5: el audit no se silencia y la excepción tiene caducidad.
- `docs/dependencies.md` exige ADR con dependencia, motivo, mitigación y caducidad. Todos incluidos.
