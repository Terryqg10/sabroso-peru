export type Ubicacion = { lat: number; lon: number };

/** Mitad del lado, en grados, del recuadro que muestra el mapa incrustado (unos 450 m). */
const MARGEN_GRADOS = 0.004;

const coordenadas = ({ lat, lon }: Ubicacion): string => `${lat},${lon}`;

/** Mapa de OpenStreetMap listo para un `<iframe>`, centrado en la ubicación y con una marca. */
export function urlMapaIncrustado(ubicacion: Ubicacion): string {
  const { lat, lon } = ubicacion;
  const parametros = new URLSearchParams({
    bbox: [lon - MARGEN_GRADOS, lat - MARGEN_GRADOS, lon + MARGEN_GRADOS, lat + MARGEN_GRADOS].join(','),
    layer: 'mapnik',
    marker: coordenadas(ubicacion),
  });
  return `https://www.openstreetmap.org/export/embed.html?${parametros.toString()}`;
}

/** Mapa de OpenStreetMap a pantalla completa, con la marca en la ubicación. */
export function urlOpenStreetMap(ubicacion: Ubicacion): string {
  const { lat, lon } = ubicacion;
  const parametros = new URLSearchParams({ mlat: String(lat), mlon: String(lon) });
  return `https://www.openstreetmap.org/?${parametros.toString()}#map=17/${lat}/${lon}`;
}

/**
 * Enlace universal de Google Maps para pedir la ruta hasta la ubicación. En el móvil abre la app de
 * navegación si está instalada; en el ordenador, la web.
 */
export function urlComoLlegar(ubicacion: Ubicacion): string {
  const parametros = new URLSearchParams({ api: '1', destination: coordenadas(ubicacion) });
  return `https://www.google.com/maps/dir/?${parametros.toString()}`;
}
