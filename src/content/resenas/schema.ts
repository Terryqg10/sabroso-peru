import { z } from 'zod';

const FECHA = /^\d{4}-\d{2}-\d{2}$/;

function fechaExiste(fecha: string): boolean {
  const [a = 0, m = 0, d = 0] = fecha.split('-').map(Number);
  const f = new Date(Date.UTC(a, m - 1, d));
  return f.getUTCFullYear() === a && f.getUTCMonth() === m - 1 && f.getUTCDate() === d;
}

function fechaLocal(fecha: Date): string {
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${fecha.getFullYear()}-${mes}-${dia}`;
}

/**
 * Cita real de un cliente (ADR-004). Fuente, fecha y URL son obligatorias:
 * sin ellas no se puede comprobar de dónde sale la cita.
 */
export function crearResenaSchema(ahora: () => Date = () => new Date()) {
  return z.object({
    texto: z.string().trim().min(1, 'La cita no puede estar vacía').max(500, 'La cita es demasiado larga'),
    /** Nombre público o inicial, tal como figura en la fuente. */
    autor: z.string().trim().min(1, 'Indica el autor').max(60),
    /** Plataforma de origen, por ejemplo "Google". */
    fuente: z.string().trim().min(1, 'Indica la fuente').max(40),
    fecha: z
      .string()
      .regex(FECHA, 'Fecha no válida (AAAA-MM-DD)')
      .refine(fechaExiste, 'Fecha no válida')
      .refine((f) => f <= fechaLocal(ahora()), 'La fecha no puede ser futura'),
    url: z
      .string()
      .url('URL no válida')
      .refine((u) => u.startsWith('https://'), 'La URL debe ser https'),
  });
}

export function crearResenasSchema(ahora: () => Date = () => new Date()) {
  return z.array(crearResenaSchema(ahora));
}

export const resenaSchema = crearResenaSchema();
export const resenasSchema = crearResenasSchema();

export type Resena = z.infer<typeof resenaSchema>;
