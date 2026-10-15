import { describe, expect, it } from 'vitest';
import { crearResenasSchema, crearResenaSchema, resenaSchema, resenas } from '@/content/resenas';

// Datos de prueba: no son reseñas reales.
const AHORA = new Date(2026, 9, 15, 12, 0);
const schema = crearResenaSchema(() => AHORA);

const valida = {
  texto: 'Cita de prueba',
  autor: 'Persona de prueba',
  fuente: 'Google',
  fecha: '2026-09-20',
  url: 'https://example.com/resena',
};

function campoRechazado(cambios: Record<string, unknown>, campo: string): boolean {
  const r = schema.safeParse({ ...valida, ...cambios });
  return !r.success && r.error.issues.some((i) => i.path[0] === campo);
}

describe('CA-15 resenaSchema', () => {
  it('acepta una cita completa', () => {
    expect(schema.safeParse(valida).success).toBe(true);
  });

  it('rechaza una cita sin fuente', () => {
    const { fuente: _f, ...sinFuente } = valida;
    expect(schema.safeParse(sinFuente).success).toBe(false);
    expect(campoRechazado({ fuente: '' }, 'fuente')).toBe(true);
    expect(campoRechazado({ fuente: '   ' }, 'fuente')).toBe(true);
  });

  it('rechaza una cita sin fecha o con fecha no válida', () => {
    const { fecha: _d, ...sinFecha } = valida;
    expect(schema.safeParse(sinFecha).success).toBe(false);
    expect(campoRechazado({ fecha: '' }, 'fecha')).toBe(true);
    expect(campoRechazado({ fecha: '20/09/2026' }, 'fecha')).toBe(true);
    expect(campoRechazado({ fecha: '2026-02-31' }, 'fecha')).toBe(true);
  });

  it('rechaza una fecha futura y acepta hoy', () => {
    expect(campoRechazado({ fecha: '2026-10-16' }, 'fecha')).toBe(true);
    expect(schema.safeParse({ ...valida, fecha: '2026-10-15' }).success).toBe(true);
  });

  it('rechaza una cita sin URL o con URL no https', () => {
    const { url: _u, ...sinUrl } = valida;
    expect(schema.safeParse(sinUrl).success).toBe(false);
    expect(campoRechazado({ url: '' }, 'url')).toBe(true);
    expect(campoRechazado({ url: 'no es una url' }, 'url')).toBe(true);
    expect(campoRechazado({ url: 'http://example.com' }, 'url')).toBe(true);
    expect(campoRechazado({ url: 'javascript:alert(1)' }, 'url')).toBe(true);
  });

  it('rechaza texto o autor vacíos y texto demasiado largo', () => {
    expect(campoRechazado({ texto: '' }, 'texto')).toBe(true);
    expect(campoRechazado({ texto: 'a'.repeat(501) }, 'texto')).toBe(true);
    expect(campoRechazado({ autor: '' }, 'autor')).toBe(true);
  });

  it('valida una lista y rechaza si alguna cita es inválida', () => {
    const lista = crearResenasSchema(() => AHORA);
    expect(lista.safeParse([valida, valida]).success).toBe(true);
    expect(lista.safeParse([valida, { ...valida, fuente: '' }]).success).toBe(false);
    expect(lista.safeParse([]).success).toBe(true);
  });

  it('las reseñas reales del proyecto cumplen el esquema', () => {
    expect(Array.isArray(resenas)).toBe(true);
    resenas.forEach((r) => expect(resenaSchema.safeParse(r).success).toBe(true));
  });
});
