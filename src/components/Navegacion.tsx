'use client';

import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import type { EnlaceNav } from '@/lib/navegacion';

const claseBase =
  'inline-flex min-h-11 items-center px-2 text-label font-semibold uppercase tracking-wider sm:px-3 sm:tracking-caps';
const claseMenu =
  'inline-flex min-h-11 w-full items-center text-label font-semibold uppercase tracking-caps text-fg hover:text-accent-text';
const claseCta = `${claseBase} bg-accent text-accent-fg hover:bg-accent-hover`;

/**
 * Navegación de la cabecera. En pantallas anchas (lg, 1024 px) los enlaces van en línea; en las
 * estrechas (incluida una tableta en vertical), "Reservas" queda siempre a la vista y el resto se abre con el botón "Menú".
 * La lista se define en `src/lib/navegacion.ts`.
 */
export function Navegacion({ enlaces }: { enlaces: readonly EnlaceNav[] }) {
  const ruta = usePathname();
  const [abierto, setAbierto] = useState(false);
  const boton = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLElement>(null);

  const reserva = enlaces.find((e) => e.href === '/reservas');
  const resto = enlaces.filter((e) => e.href !== '/reservas');

  // Esc cierra el menú y devuelve el foco al botón; un clic fuera también lo cierra.
  useEffect(() => {
    if (!abierto) return;
    const alTeclear = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') {
        setAbierto(false);
        boton.current?.focus();
      }
    };
    const alPulsar = (evento: MouseEvent) => {
      const destino = evento.target as Node;
      if (!panel.current?.contains(destino) && !boton.current?.contains(destino)) setAbierto(false);
    };
    document.addEventListener('keydown', alTeclear);
    document.addEventListener('mousedown', alPulsar);
    return () => {
      document.removeEventListener('keydown', alTeclear);
      document.removeEventListener('mousedown', alPulsar);
    };
  }, [abierto]);

  const enlace = (e: EnlaceNav, clase: string, alPulsar?: () => void) => {
    const actual = ruta === e.href;
    return (
      <Link
        href={e.href}
        aria-current={actual ? 'page' : undefined}
        onClick={alPulsar}
        className={`${clase} ${actual ? 'underline' : ''}`}
      >
        {e.texto}
      </Link>
    );
  };

  return (
    <>
      {/* Pantallas anchas: todos los enlaces en línea. */}
      <nav aria-label="Principal" className="hidden lg:block">
        <ul className="-mr-3 flex items-center gap-x-1">
          {enlaces.map((e) => (
            <li key={e.href}>
              {e.href === '/reservas'
                ? enlace(e, claseCta)
                : enlace(e, `${claseBase} text-fg hover:text-accent-text`)}
            </li>
          ))}
        </ul>
      </nav>

      {/* Pantallas estrechas: CTA a la vista y botón de menú. */}
      <div className="ml-auto flex items-center gap-2 lg:hidden">
        {reserva && enlace(reserva, claseCta)}
        <button
          ref={boton}
          type="button"
          aria-expanded={abierto}
          aria-controls="menu-movil"
          onClick={() => setAbierto((v) => !v)}
          className={`${claseBase} min-w-11 justify-center gap-2 border border-border-strong text-fg hover:bg-surface-muted`}
        >
          {abierto ? <X aria-hidden="true" className="size-4" /> : <Menu aria-hidden="true" className="size-4" />}
          <span className="sr-only sm:not-sr-only">Menú</span>
        </button>
      </div>

      <nav
        ref={panel}
        id="menu-movil"
        aria-label="Principal"
        hidden={!abierto}
        className="basis-full border-t border-border lg:hidden"
      >
        <ul className="grid">
          {resto.map((e) => (
            <li key={e.href} className="border-b border-border last:border-b-0">
              {enlace(e, claseMenu, () => setAbierto(false))}
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
