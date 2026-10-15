import { cartaSchema } from './schema';

// VERIFICAR: categorías provisionales. Los platos, precios, etiquetas y alérgenos
// los aporta el restaurante, uno a uno. No se inventan datos reales.
export const carta = cartaSchema.parse({
  categorias: [
    { id: 'ceviches', titulo: 'Ceviches' },
    { id: 'tiraditos', titulo: 'Tiraditos' },
    { id: 'causas', titulo: 'Causas' },
    { id: 'tradicionales', titulo: 'Tradicionales' },
    { id: 'postres', titulo: 'Postres' },
  ],
  platos: [],
});
