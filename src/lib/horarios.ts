import type { ConfigRestaurante, Franja } from '@/config/restaurante';

const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'] as const;

/** Orden de presentación: de lunes a domingo. */
const ORDEN = [1, 2, 3, 4, 5, 6, 0] as const;

export type FilaHorario = { dias: string; horario: string };

function mismaFranja(a: Franja | null, b: Franja | null): boolean {
  if (a === null || b === null) return a === b;
  return a.abre === b.abre && a.cierra === b.cierra;
}

function capitalizar(texto: string): string {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function nombreDias(inicio: number, fin: number): string {
  const primero = DIAS[ORDEN[inicio] ?? 0];
  const ultimo = DIAS[ORDEN[fin] ?? 0];
  if (inicio === fin) return capitalizar(primero);
  if (fin === inicio + 1) return `${capitalizar(primero)} y ${ultimo}`;
  return `${capitalizar(primero)} a ${ultimo}`;
}

/** Agrupa días consecutivos con el mismo horario: "Martes a jueves · 12:00–22:00". */
export function resumenHorarios(horarios: ConfigRestaurante['horarios']): FilaHorario[] {
  const filas: FilaHorario[] = [];
  let inicio = 0;
  while (inicio < ORDEN.length) {
    const franja = horarios[ORDEN[inicio] ?? 0] ?? null;
    let fin = inicio;
    while (fin + 1 < ORDEN.length && mismaFranja(franja, horarios[ORDEN[fin + 1] ?? 0] ?? null)) {
      fin += 1;
    }
    filas.push({
      dias: nombreDias(inicio, fin),
      horario: franja === null ? 'Cerrado' : `${franja.abre}–${franja.cierra}`,
    });
    inicio = fin + 1;
  }
  return filas;
}
