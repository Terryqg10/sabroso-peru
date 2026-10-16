---
id: SPEC-001-sitio-restaurante
title: Sitio web del restaurante peruano con carta interactiva y reserva por WhatsApp
status: aprobada
rigor_level: M
created: 2026-10-12
updated: 2026-10-12
---

# SPEC-001 — Sitio web del restaurante peruano

## 1. Objetivos

- Web moderna, rápida y responsiva para un restaurante peruano que destaque la cultura gastronómica.
- Carta interactiva (ceviche, lomo saltado, etc.) navegable por categorías.
- Reserva de mesa desde móvil u ordenador, sin cuentas, enviada por WhatsApp (`wa.me`).
- Usuarios: clientes locales, turistas y amantes de la gastronomía.

## 2. Fuera de alcance

1. Pedidos y pago online (delivery, take-away, carrito, pasarela).
2. Cuentas de cliente y login.
3. Panel de administración y CMS. La carta vive en archivos de contenido del repo.
4. Multi-idioma. Solo español.
5. Control de aforo y disponibilidad. El restaurante confirma por WhatsApp.
6. Reserva por email (descartada, solo WhatsApp).

## 3. Requisitos funcionales

| ID | Requisito |
|---|---|
| RF-01 | La página de inicio presenta el restaurante y su cultura gastronómica, con un CTA visible a reservar. |
| RF-02 | La carta se muestra por categorías y el usuario puede filtrar por categoría. Cada plato muestra nombre, descripción y precio. |
| RF-03 | Una sección muestra horarios, dirección y contacto. |
| RF-04 | El formulario de reserva pide: nombre, teléfono, fecha, hora, número de personas y notas (opcional). |
| RF-05 | El formulario valida con Zod: campos obligatorios, teléfono con formato válido, fecha no pasada, hora dentro del horario de apertura, personas entre 1 y el máximo configurado. |
| RF-06 | Al enviar un formulario válido se abre `wa.me/<número>` con el mensaje de reserva prellenado y codificado. No se guarda ni se envía nada a ningún servidor propio. |
| RF-07 | El sitio es responsivo (móvil primero) y está íntegramente en español. |
| RF-08 | Navegación definida: el logo enlaza a `/`, y hay acceso a Inicio, Carta, Reservas y Contacto. |
| RF-09 | El formulario muestra un aviso breve de privacidad antes del envío. |

## 4. Requisitos no funcionales

- Rendimiento y accesibilidad: Lighthouse ≥ 90.
- WCAG AA, foco visible, objetivos táctiles ≥ 44×44 px, texto ≥ 14 px (endurecimiento de v3).
- `prefers-reduced-motion` respetado con alternativa estática.
- Estilo v3-editorial-dark con `palette.css` aprobado; solo tokens, sin hex en componentes.
- Parámetros de negocio configurables fuera de los componentes: nombre, número de WhatsApp, horarios, máximo de personas. VERIFICAR valores reales.
- TypeScript estricto. Todo input del formulario validado con Zod, tipos derivados con `z.infer`.

## 5. Casos límite

| Caso | Comportamiento esperado |
|---|---|
| Formulario vacío | Se bloquea el envío y se señalan los campos obligatorios. |
| Teléfono con espacios, guiones o prefijo `+51` | Se normaliza. Si no es válido, error en el campo. |
| Fecha pasada | Error en el campo fecha. |
| Hora fuera de horario o día cerrado | Error en el campo hora. VERIFICAR horarios. |
| Personas = 0 o > máximo | Error en el campo. Si supera el máximo, se indica contactar al restaurante. |
| Nombre o notas con caracteres especiales, emojis o `&` | El mensaje se codifica con `encodeURIComponent` sin romper la URL. |
| Notas muy largas | Se limita la longitud con Zod. |
| Cliente sin WhatsApp | Se muestra el teléfono del restaurante y la opción de copiar el mensaje. |
| Doble clic en enviar | No genera estados duplicados; solo abre el enlace. |
| JavaScript desactivado | La carta y la información se leen. La reserva muestra el teléfono como alternativa. |

## 6. Estados de error y vacío en la UI

| Pantalla / flujo | Vacío | Cargando | Error |
|---|---|---|---|
| Carta | Categoría sin platos: mensaje "No hay platos en esta categoría". | Contenido estático, sin carga. | Filtro desconocido: se muestran todas las categorías. |
| Formulario de reserva | Campos vacíos con ayuda visible. | No aplica (sin red). | Mensaje bajo cada campo, con texto e icono además de color, enlazado con `aria-describedby`. |
| Apertura de WhatsApp | No aplica | No aplica | Si el navegador bloquea la apertura, se ofrece el enlace manual y copiar el mensaje. |

## 7. Máquina de estados

No aplica: no hay entidades con ciclo de vida. La reserva no se guarda y no tiene estados en el sitio.

## 8. Riesgos de seguridad

| Riesgo | Mitigación |
|---|---|
| Inyección en el mensaje de WhatsApp | Validación con Zod y `encodeURIComponent`. Solo texto plano. |
| Enlace `wa.me` manipulado | El número viene de configuración, nunca del input del usuario. |
| Spam o abuso | Sin servidor propio no hay coste ni endpoint que proteger. VERIFICAR si se añade backend en el futuro. |
| Secretos | No hay claves ni APIs de pago. `.env*` queda fuera del repo. |
| Dependencias | `pnpm audit --audit-level=high` sin hallazgos al cerrar cada tarea. |

## 9. Datos y privacidad

| Dato | Para qué | Dónde viaja | Cuánto tiempo | Cómo se borra |
|---|---|---|---|---|
| Nombre | Identificar la reserva | Mensaje de WhatsApp, desde el navegador del cliente | No se guarda en el sitio | No aplica |
| Teléfono del cliente | Contacto para confirmar | Mensaje de WhatsApp | No se guarda en el sitio | No aplica |
| Fecha, hora, personas, notas | Datos de la reserva | Mensaje de WhatsApp | No se guarda en el sitio | No aplica |

- Sin cookies propias, sin analítica en esta versión. Si se añade, requiere ADR y actualizar esta sección.
- Los datos no se registran en logs ni se envían a terceros desde el sitio.
- Una vez en WhatsApp, el tratamiento lo rige WhatsApp y el restaurante. VERIFICAR si hace falta política de privacidad conforme a la normativa peruana de protección de datos personales.

## 10. APIs externas

| API | Uso | Coste | Términos |
|---|---|---|---|
| `wa.me` (enlace de WhatsApp) | Abrir chat con mensaje prellenado | Sin coste, sin clave, sin llamadas desde el servidor | VERIFICAR términos de uso de enlaces de clic a chat de WhatsApp |

Topes de coste: no aplican (sin API de pago).

## 11. Criterios de aceptación

| ID | RF | Dado | Cuando | Entonces | Verificación |
|---|---|---|---|---|---|
| CA-01 | RF-01 | El usuario abre `/` | La página carga | Ve la presentación del restaurante y un CTA que lleva a la reserva | e2e `inicio-cta-reserva` |
| CA-02 | RF-02 | El usuario está en la carta | Selecciona una categoría | Solo se muestran los platos de esa categoría, cada uno con nombre, descripción y precio | e2e `carta-filtro` + unit `filtrarCarta` |
| CA-03 | RF-03 | El usuario abre la sección de contacto | La página carga | Ve horarios, dirección y contacto | comprobación manual documentada |
| CA-04 | RF-04 | El usuario abre el formulario | Se renderiza | Existen los campos nombre, teléfono, fecha, hora, personas y notas, cada uno con etiqueta | e2e `reserva-campos` |
| CA-05 | RF-05 | Datos inválidos (vacíos, teléfono mal formado, fecha pasada, hora fuera de horario, personas fuera de rango) | Se valida con el esquema | Se rechazan con el error del campo correspondiente; los válidos se aceptan | unit `reservaSchema` |
| CA-06 | RF-06 | Datos válidos con caracteres especiales | Se construye el enlace | La URL es `https://wa.me/<número>?text=<mensaje codificado>` y el mensaje decodificado contiene todos los datos | unit `buildWhatsAppUrl` |
| CA-07 | RF-06 | Un envío válido | Se envía el formulario | No hay peticiones de red propias ni almacenamiento (localStorage, cookies, fetch) | unit `sin-persistencia` + e2e sin requests propias |
| CA-08 | RF-04, RF-06 | Un usuario en móvil | Rellena el formulario válido y envía | Se abre `wa.me` con el mensaje prellenado | e2e `reserva-flujo-principal` |
| CA-09 | RF-07 | Anchos 360, 768 y 1280 px | Se recorre el sitio | Sin scroll horizontal, contenido en español, axe sin violaciones graves | e2e + `pnpm test:a11y` |
| CA-10 | RF-08 | El usuario está en cualquier página | Pulsa el logo y los enlaces de navegación | El logo lleva a `/` y no hay enlaces muertos | e2e `navegacion` |
| CA-11 | RF-09 | El usuario está en el formulario | Antes de enviar | Ve el aviso de privacidad | e2e `reserva-aviso-privacidad` |

## 12. Enmiendas

### Enmienda 1 — 2026-10-15 — ADR-002, ADR-003, ADR-004

Origen: `research/competitor-insights.md`. Esta enmienda no reordena ni reescribe lo anterior; lo complementa y, donde choca, prevalece.

**Qué cambia**

| Tema | Cambio | ADR |
|---|---|---|
| Mercado | El restaurante opera en **España**. Sustituye las menciones a "normativa peruana" de §9 por la normativa aplicable en España (contenido legal exacto: VERIFICAR con fuente oficial o asesor). El prefijo telefónico por defecto es `34`. | ADR-002 |
| Para llevar | La comida para llevar se **informa** en la web (llamar o WhatsApp). Carrito, pago y pedidos online siguen fuera de alcance. | ADR-003 |
| Reseñas | Citas reales estáticas con fuente y fecha, nunca inventadas. | ADR-004 |
| Carta | Los platos y sus datos (etiquetas, alérgenos, fotos) los aporta el restaurante, plato a plato. Mientras no existan, los datos de la carta son provisionales y marcados VERIFICAR. La foto por plato es opcional. | — |
| Galería, pie legal y confirmación de reserva | Se añaden sin alternativas reales que justifiquen un ADR propio. | — |

**Nuevos requisitos funcionales** (la numeración continúa)

| ID | Requisito |
|---|---|
| RF-10 | Una sección de galería muestra fotos de platos y del local. Cada imagen tiene texto alternativo y dimensiones declaradas. |
| RF-11 | Cada plato de la carta muestra además etiquetas (vegetariano, sin gluten, picante, para compartir) y alérgenos declarados. La foto por plato es opcional. Los enlaces de categoría se generan desde los datos y coinciden con los títulos de las secciones. Amplía RF-02. |
| RF-12 | Una sección de reseñas muestra citas reales con fuente, fecha y enlace. Si no hay citas, solo muestra el enlace a la ficha de Google, o se omite. |
| RF-13 | El pie de todas las páginas muestra dirección, teléfono, horarios y enlaces a aviso legal, política de privacidad y declaración de accesibilidad, todo en español. Amplía RF-09. |
| RF-14 | Tras enviar el formulario, el sitio explica qué ocurre: se abre WhatsApp, la reserva no está confirmada hasta que el restaurante responda, plazo de respuesta (VERIFICAR) y teléfono alternativo. Amplía RF-06. |
| RF-15 | Una sección informa de cómo pedir para llevar (llamada o WhatsApp), horario y recogida. Sin carrito ni pago. |

**Nuevos criterios de aceptación**

| ID | RF | Dado | Cuando | Entonces | Verificación |
|---|---|---|---|---|---|
| CA-12 | RF-10 | El usuario abre la galería | La página carga | Cada imagen tiene texto alternativo no vacío | e2e `galeria-alt` |
| CA-13 | RF-11 | Datos de carta cargados | Se validan con el esquema | Cada plato tiene nombre, precio, etiquetas y alérgenos declarados; la foto es opcional | unit `cartaSchema` |
| CA-14 | RF-11 | La carta renderizada | Se comparan enlaces de categoría y títulos de sección | Coinciden uno a uno | unit `categorias-coherentes` + e2e `carta-anclas` |
| CA-15 | RF-12 | Citas cargadas | Se validan con el esquema | Toda cita tiene fuente, fecha y URL; el esquema rechaza las que no | unit `resenaSchema` |
| CA-16 | RF-13 | El usuario está en cualquier página | Mira el pie | Ve dirección, teléfono, horarios y enlaces a páginas legales que existen | e2e `pie-legal` |
| CA-17 | RF-14 | Un envío válido | Se abre WhatsApp | La página muestra el aviso de reserva no confirmada y el teléfono alternativo | e2e `reserva-confirmacion` |
| CA-18 | RF-15 | El usuario abre la sección para llevar | La página carga | Ve cómo pedir, horario y recogida, sin carrito ni pago | e2e `para-llevar` |

**Cambios a otras secciones**

- §9 Datos y privacidad: donde dice "normativa peruana" se lee "normativa aplicable en España (VERIFICAR)".
- §10 APIs externas: sin cambios. No se añaden terceros.
- CA-06 y CA-05: el prefijo de teléfono por defecto pasa a `34`. Sus tests de T-001 deben actualizarse (tarea derivada T-002).

**Tareas derivadas** (propuestas; se crean con `/new-task`)

| Tarea | CA | Descripción |
|---|---|---|
| T-002 | CA-05, CA-06 | Cambiar el prefijo a `34` en `telefono.ts`, actualizar los tests y el número provisional |
| T-003 | CA-02, CA-13, CA-14 | Esquema de carta, datos y `filtrarCarta` con etiquetas y alérgenos |
| T-004 | CA-15 | Esquema de reseñas y contenido |
| T-005 | CA-04, CA-08, CA-11, CA-17 | Formulario de reserva con confirmación |
| T-006 | CA-12, CA-16, CA-18, CA-03 | Galería, pie legal, para llevar y contacto |
| T-007 | CA-01, CA-10 | Inicio y navegación |
| T-008 | CA-09 | Pasada de responsive y accesibilidad |

### Enmienda 2 — 2026-10-16 — ADR-005

- RF-11: las etiquetas de la carta pasan de
  `(vegetariano, sin gluten, picante, para compartir)` a
  `(vegetariano, vegano, sin gluten, sin-lactosa, picante, para compartir)`.
- Motivación: los 22 platos de la carta necesitan las dos etiquetas
  nuevas para describirse con precisión.
- Sin cambios en los CA. CA-13 sigue cubriendo el requisito de
  "etiquetas declaradas" de forma genérica.
