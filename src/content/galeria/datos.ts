import { galeriaSchema } from './schema';

// Las fotos reales las aporta el restaurante (platos y local). No se usan imágenes de stock
// ni marcadores. Cada foto necesita ruta, texto alternativo descriptivo y dimensiones reales.
export const galeria = galeriaSchema.parse([]);
