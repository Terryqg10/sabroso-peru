import { describe, expect, it } from 'vitest';
import { urlComoLlegar, urlMapaIncrustado, urlOpenStreetMap } from '@/lib/mapa';

const ubicacion = { lat: 40.4728, lon: -3.8724 };

describe('urlComoLlegar', () => {
  it('apunta al enlace universal de Google Maps con las coordenadas como destino', () => {
    const url = new URL(urlComoLlegar(ubicacion));
    expect(url.origin + url.pathname).toBe('https://www.google.com/maps/dir/');
    expect(url.searchParams.get('api')).toBe('1');
    expect(url.searchParams.get('destination')).toBe('40.4728,-3.8724');
  });
});

describe('urlMapaIncrustado', () => {
  it('usa el embed de OpenStreetMap, con marca en la ubicación y un recuadro centrado en ella', () => {
    const url = new URL(urlMapaIncrustado(ubicacion));
    expect(url.origin + url.pathname).toBe('https://www.openstreetmap.org/export/embed.html');
    expect(url.searchParams.get('marker')).toBe('40.4728,-3.8724');
    const [oeste, sur, este, norte] = (url.searchParams.get('bbox') ?? '').split(',').map(Number);
    expect(oeste).toBeLessThan(ubicacion.lon);
    expect(este).toBeGreaterThan(ubicacion.lon);
    expect(sur).toBeLessThan(ubicacion.lat);
    expect(norte).toBeGreaterThan(ubicacion.lat);
  });
});

describe('urlOpenStreetMap', () => {
  it('abre el mapa completo con la marca y el zoom en el fragmento', () => {
    const url = new URL(urlOpenStreetMap(ubicacion));
    expect(url.origin).toBe('https://www.openstreetmap.org');
    expect(url.searchParams.get('mlat')).toBe('40.4728');
    expect(url.searchParams.get('mlon')).toBe('-3.8724');
    expect(url.hash).toBe('#map=17/40.4728/-3.8724');
  });
});
