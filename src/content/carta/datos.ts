import { cartaSchema } from './schema';

// VERIFICAR: categorías provisionales. Los platos, precios, etiquetas y alérgenos
// los aporta el restaurante.
export const carta = cartaSchema.parse({
  categorias: [
    { id: 'ceviches', titulo: 'Ceviches' },
    { id: 'tiraditos', titulo: 'Tiraditos' },
    { id: 'causas', titulo: 'Causas' },
    { id: 'tradicionales', titulo: 'Tradicionales' },
    { id: 'postres', titulo: 'Postres' },
  ],
  platos: [
    // Ceviches
    {
      id: 'ceviche-clasico',
      nombre: 'Ceviche clásico',
      descripcion:
        'Pescado blanco del día marinado en lima, ají limo y cilantro, con cebolla roja, camote y choclo.',
      precio: 18,
      categoria: 'ceviches',
      etiquetas: ['sin-gluten', 'picante'],
      alergenos: ['pescado'],
      foto: {
        src: '/images/plato-ceviche-close.jpg',
        alt: 'Ceviche clásico de pescado blanco con cebolla roja, camote y choclo',
      },
    },
    {
      id: 'ceviche-mixto',
      nombre: 'Ceviche mixto',
      descripcion:
        'Pescado blanco y mariscos (calamar, langostinos) marinados en lima, ají limo, con cebolla roja, camote y choclo.',
      precio: 22,
      categoria: 'ceviches',
      etiquetas: ['sin-gluten', 'picante'],
      alergenos: ['pescado', 'crustaceos', 'moluscos'],
    },
    {
      id: 'ceviche-conchas-negras',
      nombre: 'Ceviche de conchas negras',
      descripcion:
        'Conchas negras del Pacífico en su jugo, con lima, ají limo, cebolla roja y cilantro. Servido con camote y choclo.',
      precio: 24,
      categoria: 'ceviches',
      etiquetas: ['sin-gluten', 'picante'],
      alergenos: ['moluscos'],
    },
    {
      id: 'leche-de-tigre',
      nombre: 'Leche de tigre',
      descripcion:
        'El jugo cítrico del ceviche: lima, ají limo, cebolla roja y cilantro, con tropezones de pescado blanco.',
      precio: 12,
      categoria: 'ceviches',
      etiquetas: ['sin-gluten', 'picante'],
      alergenos: ['pescado'],
    },
    // Tiraditos
    {
      id: 'tiradito-aji-amarillo',
      nombre: 'Tiradito al ají amarillo',
      descripcion:
        'Láminas finas de pescado blanco con crema de ají amarillo, cilantro y un toque de lima.',
      precio: 19,
      categoria: 'tiraditos',
      etiquetas: ['sin-gluten', 'picante'],
      alergenos: ['pescado'],
      foto: {
        src: '/images/plato-tiradito.jpg',
        alt: 'Tiradito de pescado blanco en láminas con crema de ají amarillo',
      },
    },
    {
      id: 'tiradito-rojo',
      nombre: 'Tiradito rojo',
      descripcion:
        'Láminas finas de pescado blanco con salsa de ají panca, cebolla roja y cilantro.',
      precio: 19,
      categoria: 'tiraditos',
      etiquetas: ['sin-gluten', 'picante'],
      alergenos: ['pescado'],
    },
    {
      id: 'tiradito-nikkei',
      nombre: 'Tiradito nikkei',
      descripcion:
        'Láminas de pescado blanco con salsa de soja, sésamo, jengibre y un toque de ají amarillo. Fusión peruano-japonesa.',
      precio: 21,
      categoria: 'tiraditos',
      etiquetas: ['picante'],
      alergenos: ['pescado', 'soja', 'sesamo', 'gluten'],
    },
    // Causas
    {
      id: 'causa-limena-pollo',
      nombre: 'Causa limeña de pollo',
      descripcion:
        'Puré de papa amarilla con ají amarillo, relleno de pollo desmenuzado y mayonesa, decorado con huevo y aceituna.',
      precio: 16,
      categoria: 'causas',
      etiquetas: ['sin-gluten'],
      alergenos: ['huevos'],
      foto: {
        src: '/images/plato-causa.jpg',
        alt: 'Causa limeña de pollo en capas de papa amarilla con huevo y aceituna',
      },
    },
    {
      id: 'causa-cangrejo',
      nombre: 'Causa de cangrejo',
      descripcion:
        'Puré de papa amarilla con ají amarillo, relleno de cangrejo y palta, decorado con huevo y aceituna.',
      precio: 18,
      categoria: 'causas',
      etiquetas: ['sin-gluten'],
      alergenos: ['crustaceos', 'huevos'],
    },
    {
      id: 'causa-atun',
      nombre: 'Causa de atún',
      descripcion:
        'Puré de papa amarilla con ají amarillo, relleno de atún, mayonesa y palta.',
      precio: 16,
      categoria: 'causas',
      etiquetas: ['sin-gluten'],
      alergenos: ['pescado', 'huevos'],
    },
    // Tradicionales
    {
      id: 'lomo-saltado',
      nombre: 'Lomo saltado',
      descripcion:
        'Salteado al wok de lomo de res con cebolla roja, tomate y ají amarillo. Servido con patatas fritas y arroz blanco.',
      precio: 22,
      categoria: 'tradicionales',
      etiquetas: [],
      alergenos: ['soja', 'gluten'],
      foto: {
        src: '/images/plato-lomo-saltado.jpg',
        alt: 'Lomo saltado con patatas fritas y arroz blanco',
      },
    },
    {
      id: 'aji-de-gallina',
      nombre: 'Ají de gallina',
      descripcion:
        'Pollo desmenuzado en crema de ají amarillo con pan, nueces y queso. Servido con arroz blanco, huevo y aceituna.',
      precio: 19,
      categoria: 'tradicionales',
      etiquetas: [],
      alergenos: ['gluten', 'lacteos', 'frutos-de-cascara', 'huevos'],
      foto: {
        src: '/images/plato-aji-gallina.jpg',
        alt: 'Ají de gallina con arroz blanco, huevo y aceituna',
      },
    },
    {
      id: 'anticuchos-corazon',
      nombre: 'Anticuchos de corazón',
      descripcion:
        'Brochetas de corazón de res marinadas en ají panca, a la parrilla. Servidas con papa dorada y choclo.',
      precio: 18,
      categoria: 'tradicionales',
      etiquetas: ['sin-gluten', 'sin-lactosa', 'picante'],
      alergenos: [],
      foto: {
        src: '/images/plato-anticuchos.jpg',
        alt: 'Brochetas de anticuchos a la parrilla con papa y choclo',
      },
    },
    {
      id: 'pollo-a-la-brasa',
      nombre: 'Pollo a la brasa (cuarto)',
      descripcion:
        'Cuarto de pollo marinado en especias peruanas y asado a la brasa. Servido con patatas fritas y ensalada.',
      precio: 17,
      categoria: 'tradicionales',
      etiquetas: ['sin-gluten', 'sin-lactosa'],
      alergenos: [],
    },
    {
      id: 'arroz-con-pato',
      nombre: 'Arroz con pato',
      descripcion:
        'Arroz cocido en cilantro con pato confitado, ají amarillo y cerveza negra. Servido con salsa criolla.',
      precio: 21,
      categoria: 'tradicionales',
      etiquetas: [],
      alergenos: ['gluten'],
    },
    {
      id: 'seco-de-res',
      nombre: 'Seco de res con frijoles',
      descripcion:
        'Guiso de res en salsa de cilantro, ají amarillo y chicha de jora. Servido con frijoles y arroz.',
      precio: 20,
      categoria: 'tradicionales',
      etiquetas: ['sin-gluten', 'sin-lactosa'],
      alergenos: [],
    },
    {
      id: 'tallarin-saltado',
      nombre: 'Tallarín saltado',
      descripcion:
        'Tallarines salteados al wok con verduras, pollo y un toque de soja. Fusión chino-peruana.',
      precio: 18,
      categoria: 'tradicionales',
      etiquetas: ['picante'],
      alergenos: ['gluten', 'soja'],
    },
    {
      id: 'pachamanca',
      nombre: 'Pachamanca (para 2)',
      descripcion:
        'Cocción tradicional andina al calor de piedras: pollo, cerdo, papa, choclo y habas. Para compartir.',
      precio: 42,
      categoria: 'tradicionales',
      etiquetas: ['sin-gluten', 'sin-lactosa', 'para-compartir'],
      alergenos: [],
    },
    // Postres
    {
      id: 'suspiro-a-la-limena',
      nombre: 'Suspiro a la limeña',
      descripcion:
        'Crema de manjar blanco con yemas, coronada de merengue al oporto y canela.',
      precio: 7,
      categoria: 'postres',
      etiquetas: ['sin-gluten'],
      alergenos: ['lacteos', 'huevos'],
      foto: {
        src: '/images/plato-suspiro.jpg',
        alt: 'Suspiro a la limeña con merengue y canela',
      },
    },
    {
      id: 'picarones',
      nombre: 'Picarones (3 uds.)',
      descripcion:
        'Aros de masa de calabaza y camote fritos, bañados en miel de chancaca.',
      precio: 6,
      categoria: 'postres',
      etiquetas: [],
      alergenos: ['gluten', 'lacteos'],
    },
    {
      id: 'mazamorra-morada',
      nombre: 'Mazamorra morada',
      descripcion: 'Postre tradicional de maíz morado, frutas y canela. Servido frío.',
      precio: 6,
      categoria: 'postres',
      etiquetas: ['sin-gluten', 'sin-lactosa', 'vegano'],
      alergenos: [],
    },
    {
      id: 'alfajores-manjar-blanco',
      nombre: 'Alfajores de manjar blanco (3 uds.)',
      descripcion:
        'Galletas de maicena rellenas de manjar blanco, espolvoreadas con azúcar glas.',
      precio: 6,
      categoria: 'postres',
      etiquetas: [],
      alergenos: ['gluten', 'lacteos', 'huevos'],
    },
  ],
});

// NOTA: los alérgenos son estimación para un proyecto de demostración.
// Antes de publicar en un restaurante real, VERIFICAR con las recetas.
