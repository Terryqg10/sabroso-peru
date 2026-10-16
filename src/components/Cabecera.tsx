import Image from 'next/image';
import Link from 'next/link';
import { Navegacion } from '@/components/Navegacion';
import { restaurante } from '@/config/restaurante';
import { enlacesCabecera } from '@/lib/navegacion';

export function Cabecera() {
  return (
    <header className="min-h-nav border-b border-border bg-bg px-gutter">
      <div className="flex min-h-nav flex-wrap items-center justify-between gap-x-3 py-2 sm:gap-x-6">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center gap-2 text-label font-extrabold uppercase tracking-wide text-fg sm:text-body sm:tracking-caps"
        >
          <Image src="/brand/emblema.png" alt="" width={163} height={120} priority className="h-10 w-auto" />
          <span className="sr-only xs:not-sr-only">{restaurante.nombre}</span>
        </Link>
        <Navegacion enlaces={enlacesCabecera()} />
      </div>
    </header>
  );
}
