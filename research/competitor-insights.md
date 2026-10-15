# Insights de la competencia — restaurante peruano, España

- Fase: 3 de 3 (traducción a spec)
- Fecha: 2026-10-15
- Input: [competidores.md](competidores.md) y [analisis-competencia.md](analisis-competencia.md).
- Destino: SPEC-001-sitio-restaurante. La spec está **aprobada**, así que nada de aquí la edita. Lo que cambie su alcance entra por `/decide` (ADR + enmienda + tareas nuevas).
- Las propuestas de RF de este documento son borradores sin numeración oficial.

## Alcance y límites de la evidencia

- 4 webs oficiales verificadas: Ceviche 103, Yakumanka, Piscomar y Osaka Nikkei. Los 5 candidatos de directorio quedan fuera.
- **Ningún local pequeño verificado.** Las conclusiones valen para locales medianos y grandes, y hay que extrapolarlas con cautela.
- No hay mediciones de velocidad ni se identificaron los proveedores de reserva.
- Los precios vienen de directorios y a menudo de una sola fuente.

## 1. Imprescindibles

Lo que todo competidor serio tiene. No tenerlo es un riesgo.

| # | Imprescindible | Evidencia | Estado en SPEC-001 | Acción |
|---|---|---|---|---|
| I-1 | Reserva como CTA principal y siempre visible en la navegación | 4 de 4 | **Cubierto** (RF-01, RF-08) | Mantener. Añadir como criterio de diseño que el CTA sea visible en móvil sin hacer scroll. |
| I-2 | Horarios, dirección y contacto en pie de página y en contacto | 4 de 4 | **Cubierto** (RF-03). Falta pedir que estén en el pie de todas las páginas. | Concretar en la tarea de contacto. No exige enmienda. |
| I-3 | Teléfono o WhatsApp visible y vía especial para grupos | 4 de 4 | **Parcial**: el caso límite "cliente sin WhatsApp" lo cubre, pero el teléfono no se exige siempre visible. | Enmienda menor: teléfono visible junto al formulario y en el pie. |
| I-4 | Galería de fotos propia (platos y local) | 4 de 4 | **No cubierto**: la spec solo habla del hero. | **Gap.** Propuesta RF-10. |
| I-5 | Pie legal: privacidad, cookies y aviso legal | 4 de 4 | **Parcial**: solo el aviso del formulario (RF-09). | **Gap.** Propuesta RF-13. Ver decisión D-1. |
| I-6 | Carta ordenada por tipo de plato con la cocina peruana como eje | 3 de 4 | **Cubierto** (RF-02) | Mantener. |
| I-7 | Alguna vía de comida para llevar | 3 de 4 | **Fuera de alcance** en la spec (pedidos y take away) | Ver decisión D-2. |

## 2. Oportunidades de diferenciación

Lo que pocos hacen bien y se puede aprovechar.

| # | Oportunidad | Evidencia | Encaje | Propuesta |
|---|---|---|---|---|
| O-1 | **Prueba social en la propia web.** Solo Ceviche 103 muestra reseñas. | 1 de 4 | Alto. Los otros tres dependen de agregadores. | Propuesta RF-12. Ver decisión D-3. |
| O-2 | **Carta con foto por plato y etiquetas** (vegetariano, sin gluten, picante, para compartir). Ninguno la tiene. | 0 de 4 (confirmado en 1) | Muy alto con v3 editorial: la foto a sangre es su identidad. Hace atractivo el "menú interactivo". | Propuesta RF-11. |
| O-3 | **Cultura gastronómica como contenido.** Ingredientes (ají amarillo, leche de tigre, maíz morado) y origen de los platos. Yakumanka lo hace con su masterclass y Ceviche 103 con CevicheLOVERS. | 2 de 4 lo trabajan como producto | Es el objetivo de la spec ("destacar la cultura gastronómica"). | Sección editorial en inicio o en página propia. Entra en RF-01. |
| O-4 | **Experiencia como marca.** Osaka Nikkei vende ambiente y música. | 1 de 4 | Medio. Sin fotos y vídeo propios no se puede copiar. | Foto y texto de ambiente en inicio. Sin playlists ni vídeo en esta versión. |
| O-5 | **Confirmación de reserva clara.** Ningún competidor verificado reserva solo por WhatsApp, así que aquí hay riesgo y a la vez oportunidad. | Hallazgo propio | Alto | Propuesta RF-14. |
| O-6 | **Accesibilidad declarada.** Solo Ceviche 103 publica una declaración de accesibilidad. | 1 de 4 | Alto: el proyecto ya exige WCAG AA | Enlace en el pie a una declaración breve. |

Fuera de esta versión por alcance: bono de regalo (necesita cobro), inglés (spec: solo español; el análisis lo respalda, porque solo 1 de 4 lo ofrece) y newsletter.

## 3. A evitar

| # | Fricción | Dónde | Cómo evitarla |
|---|---|---|---|
| E-1 | Menú y secciones con nombres distintos | Ceviche 103, Piscomar | Una sola fuente de verdad para las categorías. Los enlaces de la carta se generan desde los datos y se verifican con un test. |
| E-2 | Carta sin foto ni etiquetas | Ceviche 103 | Ver O-2. |
| E-3 | Sacar al cliente a un tercero para pedir | Piscomar (Uber Eats) | Si hay take away, explicar el proceso dentro del sitio antes de enlazar. Ver D-2. |
| E-4 | Proceso de take away o reserva sin explicar en la página | Yakumanka, Ceviche 103 | Texto breve de cómo funciona, con plazos. |
| E-5 | Carta por QR o PDF | Piscomar (queja en una reseña de tercero) | Carta en HTML, legible y enlazable. Ya es la decisión de la spec. |
| E-6 | Sin dirección visible | Osaka Nikkei | Dirección completa en el pie y enlace a mapa, sin incrustar mapas de terceros, por privacidad y rendimiento. |
| E-7 | Avisos en otro idioma | Yakumanka (cookies en inglés) | Todo el texto legal en español. Sin cookies propias no hace falta banner. |
| E-8 | Datos contradictorios entre directorios | Todos | Mantener horarios y precios en un solo sitio (`src/config`) y actualizar cuando cambien. |
| E-9 | Imágenes pesadas sin lazy loading ni texto alternativo | Yakumanka (señal, sin medir) | `next/image`, dimensiones explícitas y alt obligatorio. |

## 4. Impacto en la spec

| Propuesta | Origen | CA que habría que añadir | Tipo de cambio |
|---|---|---|---|
| RF-10 Galería de fotos de platos y local | I-4 | Existe una sección con fotos que tienen alt. | Enmienda: RF nuevo |
| RF-11 La carta muestra foto, etiquetas y alérgenos por plato | O-2, E-1, E-2 | Cada plato tiene foto y etiquetas; los enlaces de categoría coinciden con los títulos. | Enmienda: ampliar RF-02 |
| RF-12 Sección de reseñas con citas reales y enlace a la fuente | O-1 | Cada cita indica fuente y fecha. | Enmienda: RF nuevo (ver D-3) |
| RF-13 Pie legal: privacidad, aviso legal y declaración de accesibilidad | I-5, O-6, E-7 | El pie enlaza a páginas existentes. | Enmienda: ampliar RF-09 (ver D-1) |
| RF-14 Pantalla o mensaje tras enviar, con teléfono alternativo y plazo de confirmación | O-5, E-4 | Al enviar, el usuario ve qué ocurre y cómo contactar. | Enmienda: ampliar RF-06 |
| RF-15 Información de comida para llevar | I-7, E-3 | La web explica cómo pedir para llevar. | Enmienda condicionada a D-2 |
| I-2, I-3 | Contacto en el pie y teléfono visible junto al formulario | — | Concreción en tareas, sin enmienda |

Los CA son borradores. Se redactan con formato Dado/Cuando/Entonces cuando se apruebe cada enmienda.

## 5. DECISIONES PENDIENTES

| ID | Decisión | Opciones | Recomendación |
|---|---|---|---|
| D-1 | **¿En qué país opera el restaurante?** La spec habla de normativa peruana de datos, pero esta investigación se hizo para el mercado español. Esto cambia la información legal obligatoria: en España se esperan aviso legal y privacidad conforme al RGPD y a la LSSI; si el local está en Perú aplica otra normativa. | A. España. B. Perú. C. Otro. | Confirmarlo antes de redactar el pie legal. VERIFICAR la normativa con una fuente oficial; no la fijo de memoria. |
| D-2 | **Comida para llevar.** Está fuera de alcance, pero 3 de 4 competidores la ofrecen. | A. Seguir fuera de alcance. B. Solo informar ("Llama o escribe por WhatsApp para pedir para llevar"), sin carrito ni pago. C. Enlazar a una plataforma externa (Uber Eats o similar). | **B.** Cubre la expectativa sin carrito, base de datos ni cobro, y evita sacar al cliente del sitio. |
| D-3 | **Reseñas en la web.** Hay que decidir de dónde salen. | A. Citas reales copiadas con permiso, con fuente y fecha, como contenido estático. B. Widget de terceros (Trustindex o similar): añade script externo, coste posible y privacidad. C. Solo un enlace a la ficha de Google. D. Omitir. | **A**, o C si no hay reseñas aún. Nunca citas inventadas. B exigiría ADR y revisar privacidad. |
| D-4 | **Alcance de la carta.** Foto y etiquetas por plato exigen material propio. | A. Foto y etiquetas desde el inicio. B. Etiquetas ahora y fotos cuando existan. | **B** si no hay fotos reales todavía. Las alergias requieren datos fiables del restaurante; marcar VERIFICAR. |
| D-5 | **Cómo canalizar los cambios.** | A. Un único `/decide` con ADR y enmienda de la spec con RF-10 a RF-15, y tareas nuevas. B. Un ADR por tema. | **A** para no dispersar el trabajo. |

## 6. Siguientes pasos sugeridos

1. Resolver D-1 a D-4.
2. Ejecutar `/decide` para enmendar SPEC-001.
3. Añadir tareas con `/new-task`.
4. **T-001 sigue abierta**: la puerta `audit` falla por dependencias de desarrollo (vitest, vite, braces). Falta tu decisión entre actualizar dependencias o ADR de excepción.

## Fuentes

Las del análisis. Webs oficiales leídas:
[Ceviche 103](https://ceviche103.com/), [Yakumanka](https://www.yakumanka.com/), [Piscomar](https://piscomarcebicheria.com/) y [Osaka Nikkei](https://osakanikkei.com/madrid/).
Agregadores y prensa: ver [analisis-competencia.md](analisis-competencia.md).
