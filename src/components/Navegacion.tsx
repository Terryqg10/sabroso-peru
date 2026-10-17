'use client';

import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { restaurante } from '@/config/restaurante';
import type { EnlaceNav } from '@/lib/navegacion';

const claseBase =
  'inline-flex min-h-11 items-center px-2 text-label font-semibold uppercase tracking-wider sm:px-3 sm:tracking-caps';
const claseCta = `${claseBase} bg-accent text-accent-fg hover:bg-accent-hover`;

const FOCOS = 'a[href], button:not([disabled])';

/**
 * Navegación de la cabecera. En pantallas anchas (lg, 1024 px) los enlaces van en línea; en las
 * estrechas (incluida una tableta en vertical), "Reservas" queda siempre a la vista y el resto se abre
 * con el botón "Menú" en un diálogo a pantalla completa. La lista se define en `src/lib/navegacion.ts`.
 */
export function Navegacion({ enlaces }: { enlaces: readonly EnlaceNav[] }) {
  const ruta = usePathname();
  const [abierto, setAbierto] = useState(false);
  const boton = useRef<HTMLButtonElement>(null);
  const cerrar = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  const reserva = enlaces.find((e) => e.href === '/reservas');
  const resto = enlaces.filter((e) => e.href !== '/reservas');

  // Mientras está abierto: el foco entra en el diálogo y se queda dentro (Tab y Mayús+Tab dan la vuelta),
  // Esc cierra y devuelve el foco al botón, el fondo no hace scroll y pasar a escritorio lo cierra.
  useEffect(() => {
    if (!abierto) return;
    cerrar.current?.focus();
    // Solo por debajo de lg: ahí el diálogo existe. La clase está escrita completa para que Tailwind la genere.
    document.body.classList.add('max-lg:overflow-hidden');

    const alTeclear = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') {
        setAbierto(false);
        boton.current?.focus();
        return;
      }
      if (evento.key !== 'Tab') return;
      // Ciclo de foco manual: no depende de qué elementos considere tabulables cada navegador
      // (Safari, por ejemplo, omite los enlaces).
      const focos = Array.from(panel.current?.querySelectorAll<HTMLElement>(FOCOS) ?? []);
      if (focos.length === 0) return;
      evento.preventDefault();
      const indice = focos.findIndex((el) => el === document.activeElement);
      const paso = evento.shiftKey ? -1 : 1;
      const siguiente = indice === -1 ? 0 : (indice + paso + focos.length) % focos.length;
      focos[siguiente]?.focus();
    };
    // Al ensanchar la ventana hasta escritorio el diálogo desaparece; hay que soltar el scroll del fondo.
    const alCambiarAncho = () => {
      if (window.matchMedia('(min-width: 1024px)').matches) setAbierto(false);
    };
    document.addEventListener('keydown', alTeclear);
    window.addEventListener('resize', alCambiarAncho);
    return () => {
      document.body.classList.remove('max-lg:overflow-hidden');
      document.removeEventListener('keydown', alTeclear);
      window.removeEventListener('resize', alCambiarAncho);
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

  const cerrarMenu = () => setAbierto(false);

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
          onClick={() => setAbierto(true)}
          className={`${claseBase} min-w-11 justify-center gap-2 border border-border-strong text-fg hover:bg-surface-muted`}
        >
          <Menu aria-hidden="true" className="size-4" />
          <span className="sr-only sm:not-sr-only">Menú</span>
        </button>
      </div>

      {abierto && (
        <div
          ref={panel}
          id="menu-movil"
          role="dialog"
          aria-modal="true"
          aria-label="Navegación principal"
          className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-bg px-gutter py-6 lg:hidden"
        >
          <div className="flex items-center justify-between border-b border-border pb-6">
            <Link href="/" onClick={cerrarMenu} className="inline-flex min-h-11 items-center">
              <Image
                src="/brand/emblema.png"
                alt={restaurante.nombre}
                width={163}
                height={120}
                className="h-8 w-auto"
              />
            </Link>
            <button
              ref={cerrar}
              type="button"
              aria-label="Cerrar navegación"
              onClick={() => {
                cerrarMenu();
                boton.current?.focus();
              }}
              className="inline-flex size-11 items-center justify-center text-fg-muted hover:text-fg motion-safe:transition-colors"
            >
              <X aria-hidden="true" className="size-6" />
            </button>
          </div>

          <nav aria-label="Principal" className="grow py-12">
            <ul className="grid gap-8">
              {resto.map((e, indice) => {
                const actual = ruta === e.href;
                return (
                  <li key={e.href}>
                    <Link
                      href={e.href}
                      aria-current={actual ? 'page' : undefined}
                      onClick={cerrarMenu}
                      className="group flex min-h-11 items-baseline gap-4"
                    >
                      <span className="text-label font-semibold uppercase tracking-caps text-accent-text">
                        {String(indice + 1).padStart(2, '0')}
                      </span>
                      <span
                        className={`text-3xl font-extrabold uppercase tracking-caps group-hover:text-accent-text motion-safe:transition-colors ${
                          actual ? 'text-accent-text' : 'text-fg'
                        }`}
                      >
                        {e.texto}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {reserva && (
            <div className="border-t border-border pt-6">
              <Link
                href={reserva.href}
                aria-current={ruta === reserva.href ? 'page' : undefined}
                onClick={cerrarMenu}
                className="flex min-h-11 w-full items-center justify-center bg-accent px-6 py-4 text-label font-bold uppercase tracking-caps text-accent-fg hover:bg-accent-hover"
              >
                Reservar mesa
              </Link>
            </div>
          )}
        </div>
      )}
    </>
  );
}
