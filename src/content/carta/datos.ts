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
    { id: 'bebidas', titulo: 'Bebidas' },
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
        alt: 'Dados de pescado blanco marinado con cebolla roja en pluma, cilantro y rodajas de ají, en un plato oscuro',
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
      foto: {
        src: '/images/plato-ceviche-mixto.jpg',
        alt: 'Ceviche mixto en cuenco de barro: pescado blanco, calamar y langostino con cebolla roja, ají, camote, choclo y cancha',
      },
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
      foto: {
        src: '/images/plato-ceviche-conchas.jpg',
        alt: 'Conchas negras abiertas en su jugo oscuro con cebolla roja, ají picado, cilantro, choclo y cancha',
      },
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
      foto: {
        src: '/images/plato-leche-tigre.jpg',
        alt: 'Copa de leche de tigre con trozos de pescado blanco, cebolla roja, cilantro y cancha, sobre una pizarra',
      },
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
        alt: 'Láminas de pescado blanco con crema de ají amarillo, una rodaja de camote y maíz tostado',
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
      foto: {
        src: '/images/plato-tiradito-rojo.jpg',
        alt: 'Láminas de pescado blanco con salsa roja de ají panca, cebolla roja en pluma y cilantro, en un plato oscuro',
      },
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
      foto: {
        src: '/images/plato-tiradito-nikkei.jpg',
        alt: 'Láminas de pescado blanco con salsa oscura de soja, sésamo blanco y negro, brotes verdes y una rodaja de camote',
      },
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
        alt: 'Causa de papa amarilla en capas con pollo desmenuzado y aguacate, coronada con huevo de codorniz y aceituna',
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
      foto: {
        src: '/images/plato-causa-cangrejo.jpg',
        alt: 'Causa de papa amarilla en capas con cangrejo y aguacate, coronada con huevo cocido, aceituna y salsa',
      },
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
      foto: {
        src: '/images/plato-causa-atun.jpg',
        alt: 'Causa de papa amarilla en capas con atún desmenuzado y aguacate, coronada con huevo cocido, aceituna y salsa',
      },
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
        alt: 'Tiras de lomo salteadas con cebolla roja y tomate, con patatas fritas y arroz blanco',
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
        alt: 'Pollo desmenuzado en crema de ají amarillo con arroz blanco, huevo cocido, aceitunas, patata y nueces',
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
        alt: 'Brochetas de anticuchos a la parrilla con patatas asadas y media lima',
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
      foto: {
        src: '/images/plato-pollo-brasa.jpg',
        alt: 'Pollo a la brasa dorado con patatas fritas, ensalada de lechuga, tomate y pepino, y salsa verde',
      },
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
      foto: {
        src: '/images/plato-arroz-con-pato.jpg',
        alt: 'Arroz verde con guisantes y pimiento, con muslo de pato dorado y carne deshebrada, coronado con cebolla roja en pluma',
      },
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
      foto: {
        src: '/images/plato-seco-res.jpg',
        alt: 'Seco de res: trozos de carne en salsa verde de cilantro con guisantes y zanahoria, junto a arroz blanco, frijoles y cebolla roja',
      },
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
      foto: {
        src: '/images/plato-tallarin-saltado.jpg',
        alt: 'Tallarines salteados al wok con tiras de carne, pimiento, tomate y cebolla roja, con cilantro',
      },
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
      foto: {
        src: '/images/plato-pachamanca.jpg',
        alt: 'Muslo de pollo, trozo de cerdo, papas, choclo y habas servidos humeantes en un plato oscuro',
      },
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
      alergenos: ['lacteos', 'huevos', 'sulfitos'],
      foto: {
        src: '/images/plato-suspiro.jpg',
        alt: 'Suspiro a la limeña en copa de vidrio: manjar blanco coronado de merengue con canela',
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
      foto: {
        src: '/images/plato-picarones.jpg',
        alt: 'Tres aros de picarones fritos bañados en miel oscura de chancaca',
      },
    },
    {
      id: 'mazamorra-morada',
      nombre: 'Mazamorra morada',
      descripcion: 'Postre tradicional de maíz morado, frutas y canela. Servido frío.',
      precio: 6,
      categoria: 'postres',
      etiquetas: ['sin-gluten', 'sin-lactosa', 'vegano'],
      alergenos: [],
      foto: {
        src: '/images/plato-mazamorra.jpg',
        alt: 'Cuenco de mazamorra morada espesa con canela en rama, clavos, menta y trozos de fruta',
      },
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
      foto: {
        src: '/images/plato-alfajores.jpg',
        alt: 'Tres alfajores de masa dorada rellenos de manjar blanco y espolvoreados con azúcar glas',
      },
    },
    // Bebidas
    {
      id: 'inka-kola',
      nombre: 'Inka Kola',
      descripcion: 'Refresco peruano de sabor amarillo inconfundible.',
      precio: 3,
      categoria: 'bebidas',
      etiquetas: [],
      alergenos: [],
      foto: {
        src: '/images/bebida-inka-kola.jpg',
        alt: 'Botella de Inca Kola y vaso con hielo sobre una barra de madera',
      },
    },
    {
      id: 'coca-cola',
      nombre: 'Coca-Cola',
      descripcion: 'Refresco clásico.',
      precio: 3,
      categoria: 'bebidas',
      etiquetas: [],
      alergenos: [],
      foto: {
        src: '/images/bebida-coca-cola.jpg',
        alt: 'Botella de Coca-Cola y vaso con hielo y burbujas sobre una barra de madera',
      },
    },
    {
      id: 'chicha-morada',
      nombre: 'Chicha morada',
      descripcion: 'Bebida tradicional peruana de maíz morado, frutas y canela.',
      precio: 4,
      categoria: 'bebidas',
      etiquetas: [],
      alergenos: [],
      foto: {
        src: '/images/bebida-chicha.jpg',
        alt: 'Copa de chicha morada con hielo, rodaja de lima y canela en rama',
      },
    },
    {
      id: 'maracucha',
      nombre: 'Maracucha',
      descripcion: 'Refresco natural de maracuyá.',
      precio: 4,
      categoria: 'bebidas',
      etiquetas: [],
      alergenos: [],
      foto: {
        src: '/images/bebida-maracucha.jpg',
        alt: 'Copa de refresco de maracuyá con hielo, media maracuyá y hierbabuena',
      },
    },
  ],
});

// NOTA: los alérgenos son estimación para un proyecto de demostración.
// Antes de publicar en un restaurante real, VERIFICAR con las recetas.
