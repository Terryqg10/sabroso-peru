# Análisis de la competencia — restaurante peruano, España

- Fase: 2 de 3 (análisis)
- Fecha: 2026-10-15
- Base: las 4 webs oficiales verificadas en [competidores.md](competidores.md): Ceviche 103, Yakumanka, Piscomar y Osaka Nikkei.
- Los 5 candidatos solo de directorio (Gaman, Nikkei 225, Pueblo Libre, Mishkiuchu, Lima Madrigal) **no entran en el análisis**.
- Notación: `n/d` significa que no se pudo comprobar. No equivale a "no lo tiene".

## Limitaciones

1. **Muestra de 4 webs.** "Estándar del rubro" exige ≥ 3 de las 4 webs.
2. **Sin local pequeño verificado.** Todo lo observado procede de locales medianos o grandes, y hay que extrapolar con cautela a un restaurante independiente.
3. **Sin medición de velocidad.** No se midió Lighthouse ni tiempos de carga. Lo anotado sobre móvil son señales del marcado, no datos medidos.
4. **Proveedores de reserva sin identificar.** WebFetch no ve los widgets cargados con scripts. Para identificarlos hace falta abrir las webs en un navegador.
5. **Precios por directorios.** Salvo la carta de Ceviche 103, los precios medios vienen de guías y agregadores, que discrepan entre sí.
6. **Dos de cuatro webs con datos parciales.** De Yakumanka no se pudo ver el contenido de la carta ni del take away. Del 404 de `piscomarcebicheria.com/carta` se dedujo que la ruta correcta es `/la-carta`, pero no se leyó su contenido.

## Evaluación por criterio

### 1. Estructura de navegación

| Competidor | Navegación principal | Idioma | Pie de página |
|---|---|---|---|
| Ceviche 103 | Inicio · Reservas · Regala Ceviche103 · Carta · Galería · CevicheLOVERS · Contacto | n/d | Trabaja con nosotros, aviso legal, privacidad, cookies, **declaración de accesibilidad**, canal de denuncias |
| Yakumanka | Masterclass de cebiches · Reservas · Regala Yakumanka · Cartas (restaurante y take away) · Galería · Gastón Acurio | Solo español (cookies en inglés) | Razón social y CIF, privacidad, cookies |
| Piscomar | La Carta · Pide para llevar (Uber Eats) · Contacto · Instagram · **Reserva una mesa** | Sin selector | Horario, dirección, teléfono, email, transporte y aparcamientos, privacidad, cookies |
| Osaka Nikkei | Book Now · Food & Drinks · Cities · Inside Osaka · Nikkei Chronicles · Osaka Post · Osaka Sounds | **ES / EN** | Newsletter, privacidad, reclamaciones, empleo, cookies |

### 2. UX de carta

| Competidor | Formato | Organización | Precios | Fotos por plato | Alérgenos | Filtros |
|---|---|---|---|---|---|---|
| Ceviche 103 | HTML, sin PDF | 10 secciones: Para compartir, Ceviche, Tiraditos, Causas, Tacu tacus, Tradicionales, Novedades, Vegetarianos, Kids, Postres | Sí, en euros | **No** (unas 7 imágenes sueltas) | No | No, solo anclas |
| Yakumanka | n/d | Tres bloques: cebiches y tiraditos, pescados enteros, arroces wok. Carta de sala y carta take away separadas. | n/d | n/d | n/d | n/d |
| Piscomar | n/d (página `/la-carta`) | Cebiches, platos calientes, cocina nikkei | La FAQ dice que sí | n/d | **FAQ**: gran parte sin gluten, se pide avisar al reservar | n/d |
| Osaka Nikkei | Páginas de menú separadas | Comida y bebidas, con carta de bar aparte | Enlazados desde las páginas de menú | Galerías de platos y cócteles | n/d | n/d |

### 3. Reserva y pedido

| Competidor | Cómo se reserva | Grupos | Take away / domicilio |
|---|---|---|---|
| Ceviche 103 | Página `/reservas/` con formulario (campos n/d) | WhatsApp para grupos. Alergias: avisar al reservar. | "Pedir Online" en `pedidos.ceviche103.com`. Subdominio propio, contenido no leído. |
| Yakumanka | Ancla `#reservas`. **Teléfono y email.** Formulario n/d. | Más de 8 personas: contactar con antelación | "Carta Take Away" en página propia. El proceso no consta. |
| Piscomar | Página `/reservas`, online, proveedor sin identificar. También figura en OpenTable. | n/d | **Uber Eats** (enlace externo, modo entrega) |
| Osaka Nikkei | "Book Now", teléfono y email | 8 o más: email aparte | **No lo ofrece** |

### 4. Pricing

| Competidor | Dato | Fuente |
|---|---|---|
| Ceviche 103 | Platos desde 7 € (postres) y 10,90 €. Ticket medio de **30-50 €** (las fuentes discrepan: 30-45 € y 40-50 €). | Su web, GastroRanking, Barcelona Secreta |
| Yakumanka | 40-50 € por persona | Una guía (Barcelona Secreta), una sola fuente |
| Piscomar | Menú degustación de 42 €. Una reseña dice que es más caro que la media de Madrid. | Libertad Digital, Gastroranking |
| Osaka Nikkei | 70-90 € por persona | Neo2, una sola fuente |

### 5. Elementos de confianza

| Competidor | Reseñas en la web | Valoración externa citada | Otros elementos |
|---|---|---|---|
| Ceviche 103 | **Sí**: Google, verificadas con Trustindex, con nombres de camareros | 4,7 con 12.000+ reseñas (guía) · 9,4 en GastroRanking con 15.081 opiniones | Nominación, logo Kit Digital, declaración de accesibilidad |
| Yakumanka | No | n/d | Razón social y CIF, marca de autor (Gastón Acurio) |
| Piscomar | No | 8,9 en GastroRanking con 7.355 opiniones · 4,8 en OpenTable (solo 3 reseñas) | "Desde 2013", chef con firma, fotos de platos |
| Osaka Nikkei | No | n/d | Logos de prensa (El País, La Nación, Gestión, El Comercio y otros) |

### 6. Velocidad y responsive (señales, no mediciones)

| Competidor | Observación |
|---|---|
| Ceviche 103 | Carta con anclas y menú superior cuyos enlaces **no coinciden** con los títulos de las secciones (Tartar, Arroces, Principales frente a Tiraditos, Tradicionales, Novedades). |
| Yakumanka | Menú móvil específico. Muchas imágenes grandes sin señales de carga diferida y algunas sin texto alternativo. |
| Piscomar | La carta responde 404 en `/carta`; la ruta real es `/la-carta`. |
| Osaka Nikkei | Sitio ES/EN con banner de cookies y newsletter. Sin dirección en la página consultada. |

## Estándar del rubro (≥ 3 de 4)

| Patrón | Presente en | Fuentes cruzadas |
|---|---|---|
| Reserva como llamada a la acción principal, siempre visible en la navegación | Los 4 | Portada y página de navegación de cada web |
| Horarios, dirección y contacto fácil de encontrar | Los 4 | Pie de página y página de contacto o portada |
| Galería de fotos propia (platos y local) | Los 4 | Portada y página o sección de galería |
| Teléfono y/o email o WhatsApp para reservar o consultar, y vía alternativa para grupos | Los 4 | Páginas de reservas y contacto |
| Avisos legales, privacidad y cookies visibles en el pie | Los 4 | Pie de página en cada web |
| Carta organizada por tipos de plato, con la cocina peruana como eje (cebiche, tiraditos, causas) | Ceviche 103, Yakumanka, Piscomar | Navegación y página de carta |
| Alguna vía de comida para llevar | Ceviche 103, Yakumanka, Piscomar (3 de 4) | Navegación y páginas de take away |

## Patrones que NO llegan a estándar

| Patrón | Presente en | Lectura |
|---|---|---|
| Reseñas de clientes mostradas en la propia web | Solo Ceviche 103 | Prueba social sin explotar en el rubro |
| Carta HTML con precios y sin PDF | Ceviche 103 confirmado, Piscomar probable | Falta confirmar en los demás |
| Regalar una experiencia (bono) | Ceviche 103, Yakumanka | Solo 2 de 4 |
| Selector de idioma | Solo Osaka Nikkei | Los otros tres no lo muestran, aunque atienden a turistas |
| Alergias y dietas resueltas por canal de contacto, no con etiquetas por plato | Ceviche 103, Piscomar | Solo 2 de 4 |
| Fotos por plato en la carta | Ninguno confirmado | Hueco claro |
| Take away propio con pedido en la web | Ceviche 103 (por confirmar) | Piscomar lo delega en Uber Eats |

## Elementos diferenciales

1. **Experiencia como marca (Osaka Nikkei).** Más de 200 playlists, una sección "Osaka Sounds" y ambiente inmersivo. La propuesta de valor es vivir una noche, no solo comer.
2. **Prueba social verificada (Ceviche 103).** Reseñas de Google con Trustindex, con platos y camareros citados por nombre. Es el único con prueba social en la web.
3. **Comunidad y regalo (Ceviche 103 y Yakumanka).** "Regala Ceviche103", "CevicheLOVERS", "Regala Yakumanka" y la masterclass de cebiches convierten la cultura gastronómica en producto. Esto responde de forma directa al objetivo de "destacar la cultura gastronómica".

## Fricciones que se repiten

| Fricción | Dónde |
|---|---|
| Carta sin foto por plato | Ceviche 103; no confirmado en los demás |
| Nomenclatura inconsistente: el menú dice una cosa y las secciones otra | Ceviche 103; Piscomar (FAQ "Menú" frente a nav "La Carta") |
| Salir del sitio para pedir (Uber Eats) | Piscomar |
| Sin dirección en la página consultada | Osaka Nikkei |
| Proceso de take away sin explicar en la página | Yakumanka, Ceviche 103 (en lo que leí) |
| Menú por QR criticado en una reseña | Piscomar (reseña de tercero, Gastroranking) |
| Cookies en inglés en una web en español | Yakumanka |
| Datos contradictorios entre directorios (precio, horarios, reseñas) | Todos; refuerza la importancia de datos propios claros |

## Qué implica para este proyecto (adelanto)

Se desarrolla en la Fase 3. Dos puntos ya cambian lo que dice la spec:

- **Reserva por WhatsApp (`wa.me`).** Ninguno de los cuatro usa solo WhatsApp: ofrecen formulario o sistema online, con teléfono y WhatsApp como vía alternativa. Nuestro diseño es viable, pero hay que cuidar que el cliente reciba una confirmación clara y que haya teléfono como alternativa.
- **Español únicamente.** Solo Osaka Nikkei ofrece inglés. Que los otros tres no lo tengan hace razonable dejar el inglés fuera de esta versión. Se mantiene como mejora futura.

## Fuentes

Webs leídas:
- [Ceviche 103](https://ceviche103.com/), [carta](https://ceviche103.com/carta), [reservas](https://ceviche103.com/reservas/)
- [Yakumanka](https://www.yakumanka.com/), [take away](https://www.yakumanka.com/take-away/)
- [Piscomar](https://piscomarcebicheria.com/)
- [Osaka Nikkei Madrid](https://osakanikkei.com/madrid/)

Búsquedas y agregadores:
- [GastroRanking — Ceviche 103](https://gastroranking.es/r/ceviche-103_51487/)
- [GastroRanking — Piscomar](https://gastroranking.es/r/piscomar-by-jhosef-arias_135)
- [OpenTable — Piscomar](https://www.opentable.co.uk/r/piscomar-madrid)
- [Barcelona Secreta — peruanos](https://barcelonasecreta.com/restaurantes-peruanos-barcelona/)
- [Neo2 — Osaka Nikkei](https://www.neo2.com/?p=659961)
- [Libertad Digital — Piscomar](https://www.libertaddigital.com/chic/viajar-comer/2024-08-25/piscomar-la-autentica-cevicheria-peruana-en-el-centro-de-madrid-0e-7157737/)
