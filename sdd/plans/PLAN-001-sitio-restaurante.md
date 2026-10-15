---
id: PLAN-001-sitio-restaurante
spec: SPEC-001-sitio-restaurante
rigor_level: M
style: v3-editorial-dark@0.1.0
palette:
  source: sector
  mode: oscuro
  seed: "#e0a21b"
  approved_by: user
  checked: "check-palette OK, 2026-10-12"
deploy: vercel
status: borrador
created: 2026-10-12
updated: 2026-10-12
---

# PLAN-001 — Sitio web del restaurante peruano

## 1. Resumen técnico

Sitio estático en Next.js (App Router), sin base de datos ni backend propio. Contenido (carta, horarios) en archivos del repo. La reserva es un formulario cliente validado con Zod que construye un enlace `wa.me`. Estilo v3-editorial-dark, que está en borrador 0.1.0 (no aprobado); se usa así y se anota el riesgo.

## 2. Arquitectura

| Ruta / módulo | Función |
|---|---|
| `src/app/page.tsx` | Inicio: hero, cultura, CTA |
| `src/app/carta/page.tsx` | Carta con filtro por categoría |
| `src/app/reservas/page.tsx` | Formulario de reserva |
| `src/app/contacto/page.tsx` | Horarios, dirección, contacto |
| `src/content/` | Carta y datos del restaurante tipados |
| `src/config/restaurante.ts` | Nombre, número de WhatsApp, horarios, máximo de personas (VERIFICAR valores) |
| `src/lib/reservas/` | Esquema Zod, normalización de teléfono, `buildWhatsAppUrl` (lógica pura, sin I/O) |
| `src/components/` | Componentes que consumen solo tokens |

Componentes de servidor por defecto; `'use client'` solo en el filtro de carta y el formulario.

## 3. Modelo de datos

No hay base de datos. No se persiste nada (SPEC-001 §9). Tipos de carta y de reserva derivados de esquemas Zod con `z.infer`.

## 4. Contratos

- `reservaSchema` (Zod): `nombre`, `telefono`, `fecha`, `hora`, `personas`, `notas?`.
- `type Reserva = z.infer<typeof reservaSchema>`.
- `buildWhatsAppUrl(reserva, numero): string` devuelve `https://wa.me/<número>?text=<codificado>`.
- El número sale siempre de `src/config/restaurante.ts`.

## 5. UI

- Estilo v3: oscuro, esquinas rectas, titular grande, un único acento ámbar. Tipografía Geist.
- Mínimo 14 px, objetivos táctiles ≥ 44×44 px, foco visible.
- Texto sobre foto con scrim medido en el peor punto.
- Motion contenido con alternativa `prefers-reduced-motion`.
- Imágenes con `next/image`, tamaños declarados y texto alternativo.
- Navegación: logo a `/`, enlaces a Inicio, Carta, Reservas y Contacto.

## 6. Estrategia de tests

| Capa | Herramienta | Qué cubre |
|---|---|---|
| Lógica pura | Vitest | `reservaSchema`, normalización de teléfono, `buildWhatsAppUrl`, `filtrarCarta` (CA-02, 05, 06, 07) |
| Componentes | Vitest + Testing Library | Mensajes de error del formulario, filtro de carta |
| Flujo principal | Playwright | Reserva completa hasta `wa.me` (CA-08); navegación (CA-10); sin requests propias (CA-07) |
| Accesibilidad | axe vía Playwright (`pnpm test:a11y`) | CA-09 |
| Rendimiento | Lighthouse | Rendimiento y accesibilidad ≥ 90 |
| Manual documentado | review.md | CA-03 |

## 7. Riesgos y mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| Estilo v3 en borrador cambia | media | medio | Fijar `@0.1.0`; si cambia, versión nueva con ADR |
| Datos reales del restaurante pendientes (nombre, número, horarios, carta) | alta | medio | Centralizar en `config` y `content`; marcar VERIFICAR |
| Contraste del texto sobre foto | media | alto | Scrim medido y prueba axe |
| Usuario sin WhatsApp | media | medio | Teléfono visible y copiar mensaje (SPEC §5) |
| Requisitos legales de privacidad en Perú | media | medio | VERIFICAR antes de publicar |
| Peso de imágenes y Lighthouse < 90 | media | medio | `next/image`, formatos modernos, dimensiones explícitas |

## 8. ADRs relacionados

Ninguno. Los defaults (Next.js, pnpm, Vitest, Playwright, lucide-react, Geist, Motion, Vercel) no se cambian. Pendiente un ADR si se añade analítica o backend.

## 9. Tareas derivadas

Actualizado el 2026-10-15 tras la Enmienda 1 de SPEC-001 (ADR-002, ADR-003, ADR-004). Algunas tareas propuestas en la enmienda se dividieron para no mezclar capas.

| Tarea | CA | Capa | Estado | Descripción |
|---|---|---|---|---|
| T-001 | CA-05, CA-06, CA-07 | Lógica | cerrada | Esquema Zod y `buildWhatsAppUrl` |
| T-002 | CA-05, CA-06 | Lógica | cerrada | Prefijo telefónico `34` |
| T-003 | CA-13, CA-14 | Lógica | cerrada | Esquema de carta, datos y `filtrarCarta` |
| T-004 | CA-15 | Lógica | cerrada | Esquema de reseñas y contenido |
| T-005 | CA-04, CA-08, CA-11, CA-17 | UI | cerrada | Formulario de reserva con confirmación |
| T-006 | CA-12 | UI | cerrada | Galería de fotos |
| T-007 | CA-16, CA-03 | UI | cerrada | Pie legal y contacto |
| T-008 | CA-18 | UI | cerrada | Sección para llevar |
| T-009 | CA-01, CA-10 | UI | cerrada | Inicio y navegación (incluye mostrar reseñas) |
| T-010 | CA-02, CA-14 | UI | cerrada | Carta interactiva |
| T-011 | CA-09 | UI | cerrada | Pasada de responsive y accesibilidad |

Hueco conocido: ningún CA verifica que la sección de reseñas (RF-12) se renderice. Se resuelve con una enmienda futura o dentro de T-009.
