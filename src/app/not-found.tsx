import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Página no encontrada' };

export default function NoEncontrada() {
  return (
    <main className="px-gutter py-16">
      <div className="max-w-prose-token">
        <p className="text-label font-semibold uppercase tracking-caps text-accent-text">Error 404</p>
        <h1 className="mt-2 text-display font-extrabold">Esta página no existe</h1>
        <p className="mt-6 text-body text-fg-muted">
          Puede que el enlace esté roto o que la página haya cambiado de sitio. Vuelve al inicio o mira
          la carta.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center bg-accent px-6 text-label font-bold uppercase tracking-caps text-accent-fg hover:bg-accent-hover"
          >
            Volver al inicio
          </Link>
          <Link
            href="/carta"
            className="inline-flex min-h-11 items-center justify-center border border-border-strong px-6 text-label font-bold uppercase tracking-caps text-fg hover:bg-surface-muted"
          >
            Ver la carta
          </Link>
        </div>
      </div>
    </main>
  );
}
