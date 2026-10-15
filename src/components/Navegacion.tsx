'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { EnlaceNav } from '@/lib/navegacion';

const claseBase =
  'inline-flex min-h-11 items-center px-3 text-label font-semibold uppercase tracking-caps';

/** Enlaces de la cabecera; la lista se define en `src/lib/navegacion.ts`. */
export function Navegacion({ enlaces }: { enlaces: readonly EnlaceNav[] }) {
  const ruta = usePathname();

  return (
    <nav aria-label="Principal">
      <ul className="flex flex-wrap items-center gap-x-1">
        {enlaces.map((enlace) => {
          const actual = ruta === enlace.href;
          const esReserva = enlace.href === '/reservas';
          const clase = esReserva
            ? `${claseBase} bg-accent text-accent-fg hover:bg-accent-hover`
            : `${claseBase} text-fg hover:text-accent-text ${actual ? 'underline' : ''}`;
          return (
            <li key={enlace.href}>
              <Link href={enlace.href} aria-current={actual ? 'page' : undefined} className={clase}>
                {enlace.texto}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
