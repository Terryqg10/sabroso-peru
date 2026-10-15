import { describe, expect, it } from 'vitest';
import { restaurante } from '@/config/restaurante';
import type { ConfigRestaurante } from '@/config/restaurante';
import { resumenHorarios } from '@/lib/horarios';

const dia = { abre: '12:00', cierra: '22:00' };

describe('resumenHorarios', () => {
  it('agrupa días consecutivos con el mismo horario, de lunes a domingo', () => {
    expect(resumenHorarios(restaurante.horarios)).toEqual([
      { dias: 'Lunes', horario: 'Cerrado' },
      { dias: 'Martes a jueves', horario: '12:00–22:00' },
      { dias: 'Viernes y sábado', horario: '12:00–23:00' },
      { dias: 'Domingo', horario: '12:00–17:00' },
    ]);
  });

  it('un horario uniforme se resume en una fila', () => {
    const todos: ConfigRestaurante['horarios'] = [dia, dia, dia, dia, dia, dia, dia];
    expect(resumenHorarios(todos)).toEqual([{ dias: 'Lunes a domingo', horario: '12:00–22:00' }]);
  });

  it('los días cerrados no consecutivos van en filas separadas', () => {
    const h: ConfigRestaurante['horarios'] = [null, dia, dia, null, dia, dia, dia];
    expect(resumenHorarios(h)).toEqual([
      { dias: 'Lunes y martes', horario: '12:00–22:00' },
      { dias: 'Miércoles', horario: 'Cerrado' },
      { dias: 'Jueves a sábado', horario: '12:00–22:00' },
      { dias: 'Domingo', horario: 'Cerrado' },
    ]);
  });

  it('cubre los siete días exactamente una vez', () => {
    const filas = resumenHorarios(restaurante.horarios);
    expect(filas.length).toBeGreaterThan(0);
    expect(filas.length).toBeLessThanOrEqual(7);
  });
});
