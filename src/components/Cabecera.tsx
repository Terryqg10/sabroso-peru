import Image from 'next/image';
import { EnlaceInicio } from '@/components/EnlaceInicio';
import { Navegacion } from '@/components/Navegacion';
import { restaurante } from '@/config/restaurante';
import { enlacesCabecera } from '@/lib/navegacion';

export function Cabecera() {
  return (
    <header className="sticky top-0 z-40 min-h-nav border-b border-border px-gutter">
      {/* Fondo y desenfoque en una capa aparte: un `backdrop-filter` en el propio <header> haría que el
          menú móvil (`fixed`) quedara confinado a la barra en lugar de ocupar la pantalla. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-bg/90 backdrop-blur-sm" />
      <div className="flex min-h-nav flex-wrap items-center justify-between gap-x-3 py-2 sm:gap-x-6">
        <EnlaceInicio className="inline-flex min-h-11 items-center gap-2 text-label font-extrabold uppercase tracking-wide text-fg sm:text-body sm:tracking-caps">
          <Image src="/brand/emblema.png" alt="" width={163} height={120} priority className="h-10 w-auto" />
          <span className="sr-only xs:not-sr-only">{restaurante.nombre}</span>
        </EnlaceInicio>
        <Navegacion enlaces={enlacesCabecera()} />
      </div>
    </header>
  );
}
