import { z } from 'zod';

export const ETIQUETAS = [
  'vegetariano',
  'vegano',
  'sin-gluten',
  'sin-lactosa',
  'picante',
  'para-compartir',
] as const;

// Los 14 alérgenos de declaración obligatoria en la UE. VERIFICAR contra la norma vigente.
export const ALERGENOS = [
  'gluten',
  'crustaceos',
  'huevos',
  'pescado',
  'cacahuetes',
  'soja',
  'lacteos',
  'frutos-de-cascara',
  'apio',
  'mostaza',
  'sesamo',
  'sulfitos',
  'altramuces',
  'moluscos',
] as const;

const slug = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Identificador no válido');

export const categoriaSchema = z.object({
  id: slug,
  titulo: z.string().trim().min(1).max(60),
});

export const fotoSchema = z.object({
  src: z.string().min(1),
  alt: z.string().trim().min(1, 'El texto alternativo es obligatorio'),
});

export const platoSchema = z.object({
  id: slug,
  nombre: z.string().trim().min(1).max(80),
  descripcion: z.string().trim().min(1).max(300),
  /** Euros con hasta dos decimales. */
  precio: z
    .number()
    .positive()
    .max(1000)
    .refine((p) => Math.round(p * 100) / 100 === p, 'Máximo dos decimales'),
  categoria: slug,
  etiquetas: z.array(z.enum(ETIQUETAS)),
  /** Declaración explícita: una lista vacía significa "sin alérgenos declarados". */
  alergenos: z.array(z.enum(ALERGENOS)),
  foto: fotoSchema.optional(),
});

export const cartaSchema = z
  .object({
    categorias: z.array(categoriaSchema),
    platos: z.array(platoSchema),
  })
  .superRefine((carta, ctx) => {
    const ids = new Set<string>();
    carta.categorias.forEach((c, i) => {
      if (ids.has(c.id)) {
        ctx.addIssue({ code: 'custom', path: ['categorias', i, 'id'], message: 'Categoría duplicada' });
      }
      ids.add(c.id);
    });

    const platos = new Set<string>();
    carta.platos.forEach((p, i) => {
      if (platos.has(p.id)) {
        ctx.addIssue({ code: 'custom', path: ['platos', i, 'id'], message: 'Plato duplicado' });
      }
      platos.add(p.id);
      if (!ids.has(p.categoria)) {
        ctx.addIssue({ code: 'custom', path: ['platos', i, 'categoria'], message: 'Categoría inexistente' });
      }
    });
  });

export type Etiqueta = (typeof ETIQUETAS)[number];
export type Alergeno = (typeof ALERGENOS)[number];
export type Plato = z.infer<typeof platoSchema>;
export type Categoria = z.infer<typeof categoriaSchema>;
export type Carta = z.infer<typeof cartaSchema>;
