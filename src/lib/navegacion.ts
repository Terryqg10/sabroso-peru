import { galeria } from '@/content/galeria';

export type EnlaceNav = { href: string; texto: string };

/**
 * Enlaces de la cabecera. Un enlace solo existe si su página tiene algo que mostrar:
 * la Galería aparece cuando hay fotos cargadas.
 */
export function enlacesCabecera(): EnlaceNav[] {
  return [
    { href: '/carta', texto: 'Carta' },
    { href: '/para-llevar', texto: 'Para llevar' },
    ...(galeria.length > 0 ? [{ href: '/galeria', texto: 'Galería' }] : []),
    { href: '/contacto', texto: 'Contacto' },
    { href: '/reservas', texto: 'Reservas' },
  ];
}

/** Enlaces del pie: los de la cabecera más las páginas legales. */
export function enlacesPie(): EnlaceNav[] {
  return [
    ...enlacesCabecera().filter((e) => e.href !== '/reservas' && e.href !== '/contacto'),
    { href: '/reservas', texto: 'Reservas' },
    { href: '/contacto', texto: 'Contacto' },
    { href: '/aviso-legal', texto: 'Aviso legal' },
    { href: '/privacidad', texto: 'Política de privacidad' },
    { href: '/accesibilidad', texto: 'Declaración de accesibilidad' },
  ];
}
