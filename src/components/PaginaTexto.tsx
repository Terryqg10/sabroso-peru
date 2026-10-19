import Link from 'next/link';
import type { ReactNode } from 'react';

type Props = {
  etiqueta: string;
  titulo: string;
  /** Aviso visible cuando el contenido aún no está validado. */
  aviso?: string;
  children: ReactNode;
};

/** Plantilla de página de texto (legal, accesibilidad…) con texto corrido limitado. */
export function PaginaTexto({ etiqueta, titulo, aviso, children }: Props) {
  return (
    <main className="px-gutter py-12">
      <div className="max-w-prose-token">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center text-label font-semibold uppercase tracking-caps text-accent-text transition-opacity hover:opacity-80"
        >
          Volver al inicio
        </Link>
        <p className="mt-8 text-label font-semibold uppercase tracking-caps text-accent-text">
          {etiqueta}
        </p>
        <h1 className="mt-2 text-display font-extrabold">{titulo}</h1>
        {aviso && (
          <p className="mt-6 border border-border-strong bg-surface p-4 text-body text-fg-muted">
            {aviso}
          </p>
        )}
        <div className="mt-10 grid gap-8 text-body">{children}</div>
      </div>
    </main>
  );
}

export function Seccion({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-label font-bold uppercase tracking-caps text-fg">{titulo}</h2>
      <div className="mt-3 grid gap-3 text-fg-muted">{children}</div>
    </section>
  );
}
