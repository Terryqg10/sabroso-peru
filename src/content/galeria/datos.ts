import { galeriaSchema } from './schema';

// Fotos de la galería. Cada una lleva ruta, texto alternativo descriptivo (máximo 200 caracteres)
// y las dimensiones reales del archivo. El esquema las valida al compilar.
// Los originales viven en public/images/raw/ y se optimizan con `pnpm optimize-images`.
export const galeria = galeriaSchema.parse([
  {
    src: '/images/galeria-interior-01.jpg',
    alt: 'Interior del restaurante con mesas de madera, luz cálida y detalles textiles peruanos',
    ancho: 1200,
    alto: 1607,
    tipo: 'local',
  },
  {
    src: '/images/galeria-detalle-mesa.jpg',
    alt: 'Detalle de mesa con mantelería de lino, cubertería de plata y una vela encendida',
    ancho: 1200,
    alto: 1607,
    tipo: 'local',
  },
  {
    src: '/images/galeria-cocina.jpg',
    alt: 'Manos del chef emplatando un plato peruano en la cocina',
    ancho: 1200,
    alto: 1607,
    tipo: 'local',
  },
  {
    src: '/images/galeria-ingredientes.jpg',
    alt: 'Ingredientes peruanos sobre pizarra: ají amarillo, cebolla roja, lima, cilantro, maíz morado y quinoa',
    ancho: 1200,
    alto: 1200,
    tipo: 'plato',
  },
  {
    src: '/images/galeria-plato-02.jpg',
    alt: 'Tiradito peruano con láminas de pescado blanco y salsa de ají amarillo',
    ancho: 1200,
    alto: 1607,
    tipo: 'plato',
  },
  {
    src: '/images/galeria-barra.jpg',
    alt: 'Barra del restaurante con madera oscura, botellas y luces colgantes doradas',
    ancho: 1200,
    alto: 1607,
    tipo: 'local',
  },
  {
    src: '/images/galeria-fachada.jpg',
    alt: 'Fachada del restaurante al atardecer con luz cálida saliendo por los ventanales',
    ancho: 1200,
    alto: 670,
    tipo: 'local',
  },
]);
