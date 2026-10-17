'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { MouseEvent, ReactNode } from 'react';

/**
 * Enlace del logo a la portada. Si ya se está en la portada no hay a dónde navegar, así que el clic sube al
 * inicio de la página con un desplazamiento suave (instantáneo con `prefers-reduced-motion`). Desde otra
 * página navega a la portada como cualquier enlace; un segundo clic ya estando allí sube al inicio.
 */
export function EnlaceInicio({ className, children }: { className?: string; children: ReactNode }) {
  const ruta = usePathname();

  const alPulsar = (evento: MouseEvent<HTMLAnchorElement>) => {
    const conModificador = evento.metaKey || evento.ctrlKey || evento.shiftKey || evento.altKey;
    if (ruta !== '/' || evento.button !== 0 || conModificador) return;
    evento.preventDefault();
    const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: sinMovimiento ? 'auto' : 'smooth' });
  };

  return (
    <Link href="/" onClick={alPulsar} className={className}>
      {children}
    </Link>
  );
}
