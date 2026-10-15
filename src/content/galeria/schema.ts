import { z } from 'zod';

export const TIPOS_IMAGEN = ['plato', 'local'] as const;

/** Foto de la galería. El texto alternativo es obligatorio (CA-12). */
export const imagenSchema = z.object({
  /** Ruta local (/galeria/…) o URL https. */
  src: z
    .string()
    .refine((s) => s.startsWith('/') || s.startsWith('https://'), 'Ruta local o URL https'),
  alt: z.string().trim().min(1, 'El texto alternativo es obligatorio').max(200),
  ancho: z.number().int().positive(),
  alto: z.number().int().positive(),
  tipo: z.enum(TIPOS_IMAGEN),
});

export const galeriaSchema = z.array(imagenSchema);

export type Imagen = z.infer<typeof imagenSchema>;
