import type { Alergeno, Etiqueta } from '@/content/carta';

export const TEXTO_ETIQUETA: Record<Etiqueta, string> = {
  vegetariano: 'Vegetariano',
  vegano: 'Vegano',
  'sin-gluten': 'Sin gluten',
  'sin-lactosa': 'Sin lactosa',
  picante: 'Picante',
  'para-compartir': 'Para compartir',
};

export const TEXTO_ALERGENO: Record<Alergeno, string> = {
  gluten: 'Gluten',
  crustaceos: 'Crustáceos',
  huevos: 'Huevos',
  pescado: 'Pescado',
  cacahuetes: 'Cacahuetes',
  soja: 'Soja',
  lacteos: 'Lácteos',
  'frutos-de-cascara': 'Frutos de cáscara',
  apio: 'Apio',
  mostaza: 'Mostaza',
  sesamo: 'Sésamo',
  sulfitos: 'Sulfitos',
  altramuces: 'Altramuces',
  moluscos: 'Moluscos',
};

const formato = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' });

export function formatearPrecio(precio: number): string {
  return formato.format(precio);
}
