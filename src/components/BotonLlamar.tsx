import { Phone } from 'lucide-react';
import { restaurante } from '@/config/restaurante';
import { urlTelefono } from '@/lib/contacto';

/**
 * Botón flotante para llamar al restaurante, abajo a la derecha. Va por debajo del menú móvil (z-30 frente
 * al z-40 de la cabecera, que lo contiene). Esquinas rectas: es la firma del estilo v3.
 */
export function BotonLlamar() {
  return (
    <a
      href={urlTelefono(restaurante.telefono)}
      aria-label="Llamar al restaurante"
      className="fixed right-4 bottom-4 z-30 inline-flex size-14 lg:hidden items-center justify-center bg-accent text-accent-fg shadow-lift hover:bg-accent-hover motion-safe:transition-colors sm:right-6 sm:bottom-6"
    >
      <Phone aria-hidden="true" className="size-6" />
    </a>
  );
}
