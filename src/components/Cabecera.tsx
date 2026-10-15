import Link from 'next/link';
import { Navegacion } from '@/components/Navegacion';
import { restaurante } from '@/config/restaurante';
import { enlacesCabecera } from '@/lib/navegacion';

export function Cabecera() {
  return (
    <header className="min-h-nav border-b border-border bg-bg px-gutter">
      <div className="flex min-h-nav flex-wrap items-center justify-between gap-x-6 gap-y-2 py-2">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center text-body font-extrabold uppercase tracking-caps text-fg"
        >
          {restaurante.nombre}
        </Link>
        <Navegacion enlaces={enlacesCabecera()} />
      </div>
    </header>
  );
}
