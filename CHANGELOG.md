# Changelog — {{ project_name }}

Formato basado en [Keep a Changelog](https://keepachangelog.com/es/1.1.0/)
y versionado [SemVer](https://semver.org/lang/es/).

## [Unreleased]

### Añadido
- Lógica de reserva (T-001): esquema Zod, normalización de teléfono y enlace wa.me, con tests unitarios.
- Esquema de carta (platos, etiquetas, alérgenos, foto opcional) y filtro por categoría, con 14 tests (T-003). La carta aún no tiene platos.
- Esquema de reseñas (citas reales con fuente, fecha y URL https), con 8 tests (T-004). Sin citas todavía.
- Página /reservas con formulario accesible, validación por campo, aviso de privacidad y confirmación con teléfono alternativo; 11 tests e2e (T-005).
- Pie global (dirección, teléfono, horarios, enlaces legales), página de contacto y borradores de aviso legal, privacidad y accesibilidad pendientes de validación jurídica; 13 tests e2e y 4 unitarios (T-007).
- Portada con hero tipográfico, cultura y CTA de reserva; cabecera con logo y navegación; enlace para saltar al contenido; sección de reseñas que solo se muestra con citas reales (T-009).
- Página /carta con filtro por categoría, tarjetas de plato con etiquetas y alérgenos, estado vacío y enlace en cabecera, pie y portada; la carta aún no tiene platos reales (T-010).
- Página /para-llevar: cómo pedir por teléfono o WhatsApp, recogida y horario, sin carrito ni pago (T-008, ADR-003).
- Página /galeria (esquema de imagen con alt obligatorio y estado vacío); el enlace en cabecera y pie solo aparece cuando hay fotos (T-006).
- Recorrido responsive y de accesibilidad de las 9 páginas a 360, 768 y 1280 px, y página 404 en español (T-011).
- Modo demostración (`demo` en src/config/restaurante.ts): franja de aviso en todas las páginas, noindex y robots.txt que bloquea el sitio. Se desactiva con demo: false.
- Paleta v3-editorial-dark (ají amarillo) aprobada.
- SPEC-001, PLAN-001, ADR-001 e informes de competencia en research/.

### Cambiado
- Desplegado en Vercel (https://sabroso-peru.vercel.app) desde la rama main; cada push a main redespliega.
- La CI usa `pnpm run audit:ci` (scripts/check-audit.mjs): aplica la excepción de ADR-001 y falla si caduca el 2026-11-15 o si aparece otra vulnerabilidad alta o crítica. Se añade .node-version (24), que la CI necesitaba.
- El proyecto usa los tokens de v3-editorial-dark (antes importaba v1-soft-commerce de la plantilla). La URL de WhatsApp y el teléfono del restaurante viven en src/config.
- Normalización de teléfono: el prefijo por defecto pasa de 51 a 34 (T-002, ADR-002).
- vitest 5.0.5, vite 8.3.4 y @vitejs/plugin-react 6.1.2 para resolver vulnerabilidades críticas y altas.

## [0.1.0] — YYYY-MM-DD

### Añadido
- Instanciado desde web-os.
- Constitución del OS.
- Estructura SDD.
- Estilos disponibles v1-v4.
- Plantilla de Next.js, TypeScript, Tailwind, Motion.
- CI mínima (typecheck, lint, tests, build, gitleaks, audit).
