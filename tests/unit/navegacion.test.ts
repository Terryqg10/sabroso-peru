import { describe, expect, it } from 'vitest';
import { enlacesCabecera, enlacesPie } from '@/lib/navegacion';

describe('navegación', () => {
  it('la cabecera lista Carta, Para llevar, Contacto y Reservas; sin fotos no incluye Galería', () => {
    expect(enlacesCabecera().map((e) => e.href)).toEqual(['/carta', '/para-llevar', '/contacto', '/reservas']);
  });

  it('Reservas es siempre el último enlace de la cabecera (CTA)', () => {
    const enlaces = enlacesCabecera();
    expect(enlaces[enlaces.length - 1]?.href).toBe('/reservas');
  });

  it('el pie incluye los enlaces de la cabecera y las tres páginas legales, sin duplicados', () => {
    const hrefs = enlacesPie().map((e) => e.href);
    for (const e of enlacesCabecera()) expect(hrefs).toContain(e.href);
    for (const legal of ['/aviso-legal', '/privacidad', '/accesibilidad']) expect(hrefs).toContain(legal);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });
});
