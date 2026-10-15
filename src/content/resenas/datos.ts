import { resenasSchema } from './schema';

// Solo citas reales, copiadas con permiso o de una fuente pública citada (ADR-004).
// Nunca inventadas ni modificadas. Mientras no haya citas, la lista queda vacía.
// VERIFICAR permisos y términos de cada fuente antes de añadir una cita.
export const resenas = resenasSchema.parse([]);
