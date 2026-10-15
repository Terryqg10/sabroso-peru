import { z } from 'zod';
import type { ConfigRestaurante } from '@/config/restaurante';
import { normalizarTelefono, TELEFONO_VALIDO } from './telefono';

const FECHA = /^\d{4}-\d{2}-\d{2}$/;
const HORA = /^([01]\d|2[0-3]):[0-5]\d$/;

function aMinutos(hora: string): number {
  const [h = '0', m = '0'] = hora.split(':');
  return Number(h) * 60 + Number(m);
}

function fechaLocal(fecha: Date): string {
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${fecha.getFullYear()}-${mes}-${dia}`;
}

/** Día de la semana (0 = domingo) de una fecha AAAA-MM-DD, o null si no existe. */
function diaSemana(fecha: string): number | null {
  const [a = 0, m = 0, d = 0] = fecha.split('-').map(Number);
  const f = new Date(Date.UTC(a, m - 1, d));
  const coincide =
    f.getUTCFullYear() === a && f.getUTCMonth() === m - 1 && f.getUTCDate() === d;
  return coincide ? f.getUTCDay() : null;
}

export function crearReservaSchema(config: ConfigRestaurante, ahora: () => Date = () => new Date()) {
  return z
    .object({
      nombre: z
        .string()
        .trim()
        .min(2, 'Escribe tu nombre')
        .max(80, 'El nombre es demasiado largo'),
      telefono: z
        .string()
        .transform(normalizarTelefono)
        .pipe(z.string().regex(TELEFONO_VALIDO, 'Escribe un teléfono válido')),
      fecha: z.string().regex(FECHA, 'Elige una fecha'),
      hora: z.string().regex(HORA, 'Elige una hora'),
      personas: z.coerce
        .number({ invalid_type_error: 'Indica el número de personas' })
        .int('Indica el número de personas')
        .min(1, 'Indica el número de personas')
        .max(config.maxPersonas, `Para más de ${config.maxPersonas} personas, contacta con el restaurante`),
      notas: z.string().trim().max(300, 'Las notas son demasiado largas').optional(),
    })
    .superRefine((datos, ctx) => {
      if (!FECHA.test(datos.fecha) || !HORA.test(datos.hora)) return;

      const dia = diaSemana(datos.fecha);
      if (dia === null) {
        ctx.addIssue({ code: 'custom', path: ['fecha'], message: 'Elige una fecha válida' });
        return;
      }

      const ahoraLocal = ahora();
      const hoy = fechaLocal(ahoraLocal);
      if (datos.fecha < hoy) {
        ctx.addIssue({ code: 'custom', path: ['fecha'], message: 'La fecha ya pasó' });
        return;
      }

      const franja = config.horarios[dia];
      if (franja === null || franja === undefined) {
        ctx.addIssue({ code: 'custom', path: ['fecha'], message: 'Ese día el restaurante está cerrado' });
        return;
      }

      const minutos = aMinutos(datos.hora);
      if (minutos < aMinutos(franja.abre) || minutos > aMinutos(franja.cierra)) {
        ctx.addIssue({
          code: 'custom',
          path: ['hora'],
          message: `Ese día atendemos de ${franja.abre} a ${franja.cierra}`,
        });
        return;
      }

      if (datos.fecha === hoy && minutos <= ahoraLocal.getHours() * 60 + ahoraLocal.getMinutes()) {
        ctx.addIssue({ code: 'custom', path: ['hora'], message: 'Esa hora ya pasó' });
      }
    });
}

export type Reserva = z.infer<ReturnType<typeof crearReservaSchema>>;
