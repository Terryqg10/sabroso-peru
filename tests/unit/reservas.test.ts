import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { restaurante } from '@/config/restaurante';
import { buildWhatsAppUrl, crearReservaSchema, normalizarTelefono } from '@/lib/reservas';

// Lunes 12/10/2026 10:00 (hora local). Lunes cerrado, martes 12:00-22:00, domingo 12:00-17:00.
const AHORA = new Date(2026, 9, 12, 10, 0);
const schema = crearReservaSchema(restaurante, () => AHORA);

const valida = {
  nombre: 'Ana Quispe',
  telefono: '612 345 678',
  fecha: '2026-10-13',
  hora: '20:00',
  personas: '4',
  notas: '',
};

function erroresPorCampo(entrada: Record<string, unknown>): Record<string, string[]> {
  const r = schema.safeParse(entrada);
  if (r.success) return {};
  return r.error.flatten().fieldErrors as Record<string, string[]>;
}

describe('CA-05 reservaSchema', () => {
  it('acepta una reserva válida y normaliza teléfono y personas', () => {
    const r = schema.safeParse(valida);
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.telefono).toBe('34612345678');
      expect(r.data.personas).toBe(4);
    }
  });

  it('rechaza el formulario vacío con error en cada campo obligatorio', () => {
    const e = erroresPorCampo({ nombre: '', telefono: '', fecha: '', hora: '', personas: '' });
    expect(Object.keys(e).sort()).toEqual(['fecha', 'hora', 'nombre', 'personas', 'telefono']);
  });

  it('rechaza teléfonos mal formados y acepta +34 y guiones', () => {
    expect(erroresPorCampo({ ...valida, telefono: '12ab' }).telefono).toBeDefined();
    expect(erroresPorCampo({ ...valida, telefono: '123' }).telefono).toBeDefined();
    expect(erroresPorCampo({ ...valida, telefono: '+34 612-345-678' }).telefono).toBeUndefined();
  });

  it('rechaza una fecha pasada', () => {
    expect(erroresPorCampo({ ...valida, fecha: '2026-10-11' }).fecha).toBeDefined();
  });

  it('rechaza una fecha inexistente', () => {
    expect(erroresPorCampo({ ...valida, fecha: '2026-02-31' }).fecha).toBeDefined();
  });

  it('rechaza un día cerrado', () => {
    expect(erroresPorCampo({ ...valida, fecha: '2026-10-19' }).fecha).toBeDefined();
  });

  it('rechaza horas fuera del horario y acepta los límites', () => {
    expect(erroresPorCampo({ ...valida, hora: '11:59' }).hora).toBeDefined();
    expect(erroresPorCampo({ ...valida, hora: '22:01' }).hora).toBeDefined();
    expect(erroresPorCampo({ ...valida, hora: '12:00' }).hora).toBeUndefined();
    expect(erroresPorCampo({ ...valida, hora: '22:00' }).hora).toBeUndefined();
  });

  it('usa el horario del día: domingo cierra a las 17:00', () => {
    const domingo = { ...valida, fecha: '2026-10-18' };
    expect(erroresPorCampo({ ...domingo, hora: '17:00' }).hora).toBeUndefined();
    expect(erroresPorCampo({ ...domingo, hora: '18:00' }).hora).toBeDefined();
  });

  it('rechaza una hora ya pasada el mismo día', () => {
    const tarde = crearReservaSchema(restaurante, () => new Date(2026, 9, 13, 15, 0));
    const r = tarde.safeParse({ ...valida, hora: '14:00' });
    expect(r.success).toBe(false);
    expect(tarde.safeParse({ ...valida, hora: '16:00' }).success).toBe(true);
  });

  it('rechaza personas fuera de rango', () => {
    expect(erroresPorCampo({ ...valida, personas: '0' }).personas).toBeDefined();
    expect(erroresPorCampo({ ...valida, personas: '2.5' }).personas).toBeDefined();
    expect(erroresPorCampo({ ...valida, personas: String(restaurante.maxPersonas + 1) }).personas).toBeDefined();
    expect(erroresPorCampo({ ...valida, personas: String(restaurante.maxPersonas) }).personas).toBeUndefined();
  });

  it('rechaza notas demasiado largas', () => {
    expect(erroresPorCampo({ ...valida, notas: 'a'.repeat(301) }).notas).toBeDefined();
  });
});

describe('normalizarTelefono', () => {
  it('quita separadores y añade 34 a un número nacional de 9 dígitos', () => {
    expect(normalizarTelefono('612345678')).toBe('34612345678');
    expect(normalizarTelefono('612-345-678')).toBe('34612345678');
    expect(normalizarTelefono('(612) 345.678')).toBe('34612345678');
    expect(normalizarTelefono('912 345 678')).toBe('34912345678');
  });

  it('conserva el prefijo internacional si ya viene', () => {
    expect(normalizarTelefono('+34 612 345 678')).toBe('34612345678');
    expect(normalizarTelefono('+51 987 654 321')).toBe('51987654321');
    expect(normalizarTelefono('+44 7700 900123')).toBe('447700900123');
  });

  it('un número peruano sin prefijo se interpreta como español', () => {
    expect(normalizarTelefono('987 654 321')).toBe('34987654321');
  });

  it('no añade prefijo si no es un número nacional de 9 dígitos', () => {
    expect(normalizarTelefono('512345678')).toBe('512345678');
    expect(normalizarTelefono('6123456')).toBe('6123456');
  });
});

describe('CA-06 buildWhatsAppUrl', () => {
  const datos = schema.parse({
    ...valida,
    nombre: 'José & María "Los Ñandú" 🍤',
    notas: 'Alergia a mariscos: ¿sin ají? 100% seguro #1',
  });
  const url = buildWhatsAppUrl(datos, '34699111222', restaurante.nombre);

  it('genera la URL de wa.me con el número del restaurante', () => {
    expect(url.startsWith('https://wa.me/34699111222?text=')).toBe(true);
  });

  it('codifica el mensaje sin romper la URL', () => {
    const parsed = new URL(url);
    expect(parsed.origin).toBe('https://wa.me');
    expect([...parsed.searchParams.keys()]).toEqual(['text']);
    expect(url.split('?text=')[1]).not.toMatch(/[\s"&#]/);
  });

  it('el mensaje decodificado contiene todos los datos', () => {
    const texto = new URL(url).searchParams.get('text') ?? '';
    expect(texto).toContain('José & María "Los Ñandú" 🍤');
    expect(texto).toContain('34612345678');
    expect(texto).toContain('13/10/2026');
    expect(texto).toContain('20:00');
    expect(texto).toContain('Personas: 4');
    expect(texto).toContain('Alergia a mariscos: ¿sin ají? 100% seguro #1');
    expect(texto).toContain(restaurante.nombre);
  });

  it('omite la línea de notas si no hay notas', () => {
    const sin = schema.parse(valida);
    const texto = new URL(buildWhatsAppUrl(sin, '34699111222', restaurante.nombre)).searchParams.get('text');
    expect(texto).not.toContain('Notas:');
  });

  it('rechaza un número de restaurante no válido', () => {
    expect(() => buildWhatsAppUrl(schema.parse(valida), 'abc', restaurante.nombre)).toThrow();
  });
});

describe('CA-07 sin persistencia ni red', () => {
  const dir = path.resolve(__dirname, '../../src/lib/reservas');
  const archivos = readdirSync(dir).filter((f) => f.endsWith('.ts'));
  const prohibido = /\b(fetch|XMLHttpRequest|localStorage|sessionStorage|indexedDB|document\.cookie|navigator\.sendBeacon|WebSocket)\b/;

  it('hay archivos que revisar', () => {
    expect(archivos.length).toBeGreaterThan(0);
  });

  it.each(archivos)('%s no usa red ni almacenamiento', (archivo) => {
    const codigo = readFileSync(path.join(dir, archivo), 'utf8');
    expect(codigo).not.toMatch(prohibido);
  });
});
