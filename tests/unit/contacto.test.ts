import { describe, expect, it } from 'vitest';
import { urlTelefono, urlWhatsApp } from '@/lib/contacto';

describe('urlWhatsApp', () => {
  it('sin mensaje devuelve el enlace al chat', () => {
    expect(urlWhatsApp('34600000000')).toBe('https://wa.me/34600000000');
  });

  it('codifica el mensaje', () => {
    const url = urlWhatsApp('34600000000', 'Hola & buenas: ¿para llevar?');
    expect(url.startsWith('https://wa.me/34600000000?text=')).toBe(true);
    expect(new URL(url).searchParams.get('text')).toBe('Hola & buenas: ¿para llevar?');
    expect(url.split('?text=')[1]).not.toMatch(/[\s&]/);
  });

  it('rechaza un número no válido', () => {
    expect(() => urlWhatsApp('abc')).toThrow();
    expect(() => urlWhatsApp('')).toThrow();
  });
});

describe('urlTelefono', () => {
  it('quita espacios y separadores', () => {
    expect(urlTelefono('+34 600 000 000')).toBe('tel:+34600000000');
    expect(urlTelefono('+34 (600) 000-000')).toBe('tel:+34600000000');
  });
});
