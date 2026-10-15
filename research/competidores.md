# Competidores — restaurante peruano, España

- Fase: 1 de 3 (investigación)
- Fecha: 2026-10-15
- Método: búsqueda web y lectura de la web oficial de cada local con WebFetch.
- Estado de verificación:
  - **Verificada**: se abrió la web oficial y se leyó.
  - **Solo directorios**: no se pudo abrir ninguna web oficial. Los datos vienen de guías o agregadores y pueden estar desfasados.

## A. Webs oficiales verificadas

| # | Competidor | URL | Ciudad | Tipo | Propuesta de valor | Segmento |
|---|---|---|---|---|---|---|
| 1 | Ceviche 103 | https://ceviche103.com/ | Barcelona | Grande | Cocina peruana en ambiente moderno y desenfadado. Se presenta como parada obligada y nominado a mejor peruano. Cita a Perú como destino gastronómico nº 1 (World Travel Awards). | Local y turista, plan informal |
| 2 | Yakumanka (Gastón Acurio) | https://www.yakumanka.com/ | Barcelona | Grande (marca de autor) | Cebichería popular con producto de costas ibéricas, platos abundantes y estética criolla. Lema: "Un deleite con sabor a mar". | Local y turista, precio medio (40-50 € según guía, sin verificar) |
| 3 | Piscomar by Jhosef Arias | https://piscomarcebicheria.com/ (redirige desde restaurantepiscomar.com) | Madrid (La Latina) | Mediano / grupo | "La auténtica cebichería peruana desde 2013". Chef con firma, cebiche nikkei y lomo saltado, catering. | Local y turista, comida y cena |
| 4 | Osaka Nikkei | https://osakanikkei.com/ | Madrid (Castellana) | Grande (cadena internacional) | Nikkei con ambiente inmersivo (más de 200 playlists), técnicas japonesas con ingredientes peruanos. Primer local en Europa, abierto en septiembre de 2025 (Infobae). | Público alto, ticket de 70-90 € (Neo2, sin verificar) |

## B. Candidatos sin web verificada (solo directorios)

| Competidor | Ciudad | Tipo | Qué se sabe | Pendiente |
|---|---|---|---|---|
| Gaman (Luis Arévalo) | Madrid | Nikkei, mediano | Menús degustación de nigiris (16 y 24 piezas), Alma Nikkei y menú ejecutivo (esmadrid). | Encontrar web oficial |
| Nikkei 225 | Madrid | Nikkei | Posible dominio nikkei225.es (sin verificar). Una fuente indica que el chef ya no está, así que la propuesta puede haber cambiado. | Verificar dominio y vigencia |
| Pueblo Libre | Barcelona | Taberna criolla, local | Más de 2.000 reseñas y precio de 25-35 € (guía). | Encontrar web oficial |
| Mishkiuchu | Barcelona | Tapas peruanas, pequeño | Tapas peruanas, precio medio de unos 20 € (guía). | Encontrar web oficial |
| Lima Madrigal | Valencia | Pequeño | 634 reseñas en Google con 9,2 y menú del día de 12 € (Gastroranking). Atiende por WhatsApp según una reseña. | Encontrar web oficial |

## Lagunas de esta fase

1. Hay 4 webs oficiales leídas. El skill pide entre 5 y 8.
2. **No hay todavía ningún local pequeño con web propia verificada.** Mishkiuchu y Lima Madrigal son los candidatos, pero no se encontró su web.
3. Los datos de reserva y pedido son parciales. En las 4 webs, WebFetch no pudo identificar proveedor de reservas ni de pedidos, porque suelen estar en scripts. Habría que revisarlo en el navegador.
4. Gaman, Nikkei 225 y Kechua tampoco tienen web oficial confirmada. Kechua falló con `kechuamadrid.com`.

## Datos de las cuatro webs verificadas

Se ampliarán en la Fase 2.

| Dato | Ceviche 103 | Yakumanka | Piscomar | Osaka Nikkei |
|---|---|---|---|---|
| Reservas | Botón "Reserva" a `/reservas/`, con formulario y WhatsApp para grupos. Proveedor sin identificar. | Botón "Reservar" a ancla `#reservas`. Teléfono y email. Grupos de más de 8 por contacto. | Botón "Reserva una mesa" a `/reservas`, online. Proveedor sin identificar. | Botones "Book Now". Proveedor sin identificar. |
| Pedido o take away | "Pedir Online" a `pedidos.ceviche103.com` (propio, sin detalle). | Enlace a "Carta Take Away" sin proceso explícito. | "Pide para llevar" enlaza a Uber Eats (delivery). | No lo ofrece. |
| Carta | Página `/carta`. | Carta de sala y carta take away separadas. Tres bloques: cebiches y tiraditos, pescados enteros, arroces wok. | Secciones: cebiches, platos calientes y nikkei. | Comida y bebidas separadas, con galerías de platos. |
| Confianza | Reseñas de Google verificadas con Trustindex, nominación, logo Kit Digital. | Datos legales (razón social, CIF). Sin reseñas. | Sin reseñas ni sellos de terceros. | Logos de prensa (El País, La Nación y otros). Sin reseñas de clientes. |
| Fotos | Galería `/galeria`. | Galería de platos y local. | Fotos de platos y marca. | Galerías de local, platos y cócteles. |

## Fuentes

Fuentes de la búsqueda:
- [Barcelona Urbana — mejores peruanos](https://barcelonaurbana.com/blog/mejores-restaurantes-peruanos-barcelona)
- [Barcelona Secreta — peruanos](https://barcelonasecreta.com/restaurantes-peruanos-barcelona/)
- [esMadrid — Gaman](https://www.esmadrid.com/restaurantes/gaman)
- [Neo2 — Osaka Nikkei](https://www.neo2.com/?p=659961)
- [Infobae — nikkei en Madrid](https://www.infobae.com/peru/2025/09/23/cocina-nikkei-conquista-tierras-espanolas-con-su-llegada-a-madrid-uniendo-tradicion-japonesa-y-creatividad-peruana/)
- [Gastroranking — Lima Madrigal](https://gastroranking.es/r/restaurante-lima-madrigal_249009/)
- [Time Out — Nikkei 225](https://www.timeout.es/madrid/es/restaurantes/nikkei-225)

Webs oficiales leídas: las cuatro de la sección A.
