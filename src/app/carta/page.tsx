import type { Metadata } from 'next';
import Link from 'next/link';
import { CartaInteractiva } from '@/components/carta/CartaInteractiva';
import { carta } from '@/content/carta';

export const metadata: Metadata = {
  title: 'Carta',
  description: 'La carta del restaurante por categorías, con etiquetas y alérgenos.',
};

export default function CartaPage() {
  return (
    <main className="px-gutter py-12">
      <Link
        href="/"
        className="inline-flex min-h-11 items-center text-label font-semibold uppercase tracking-caps text-accent-text underline"
      >
        Volver al inicio
      </Link>
      <p className="mt-8 text-label font-semibold uppercase tracking-caps text-accent-text">La mesa</p>
      <h1 className="mt-2 text-display font-extrabold">La carta</h1>
      <p className="mt-6 max-w-prose-token text-body text-fg-muted">
        Elige una categoría para ver solo esos platos. Cada plato indica sus etiquetas y alérgenos.
      </p>
      <div className="mt-10">
        <CartaInteractiva carta={carta} />
      </div>
    </main>
  );
}
